import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react-native';
import Colors from '@/constants/colors';
import {
  AssetMapData,
  MappingCategory,
  MappingItem,
  getAssetMapData,
  saveAssetMapData,
  clearAssetMapData,
  calculateTotals,
} from '@/utils/mappingStorage';
import { trackEvent, AnalyticsEvents } from '@/utils/analytics';
import CategoryCard from '@/components/mapping/CategoryCard';
import ItemEditor from '@/components/mapping/ItemEditor';

export default function AssetMapFinances() {
  const router = useRouter();
  const [assetMapData, setAssetMapData] = useState<AssetMapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [hasLogoError, setHasLogoError] = useState(false);
  
  // Item editor state
  const [editorVisible, setEditorVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string>('');
  const [editingItem, setEditingItem] = useState<MappingItem | undefined>();

  useEffect(() => {
    loadAssetMapData();
  }, []);

  const loadAssetMapData = async () => {
    try {
      const data = await getAssetMapData();
      setAssetMapData(data);
    } catch (error) {
      console.error('Error loading asset map data:', error);
      Alert.alert('Error', 'Failed to load your data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveAssetMapDataAsync = async (data: AssetMapData) => {
    try {
      await saveAssetMapData(data);
      setAssetMapData(data);
    } catch (error) {
      console.error('Error saving asset map data:', error);
      Alert.alert('Error', 'Failed to save your changes. Please try again.');
    }
  };

  const handleAddItem = (categoryId: string) => {
    setEditingCategory(categoryId);
    setEditingItem(undefined);
    setEditorVisible(true);
  };

  const handleEditItem = (categoryId: string, item: MappingItem) => {
    setEditingCategory(categoryId);
    setEditingItem(item);
    setEditorVisible(true);
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (!assetMapData) return;

            const updatedCategories = assetMapData.mappingData.categories.map(category => {
              if (category.id === categoryId) {
                return {
                  ...category,
                  items: category.items.filter(item => item.id !== itemId),
                };
              }
              return category;
            });

            const updatedData = {
              ...assetMapData,
              mappingData: {
                ...assetMapData.mappingData,
                categories: updatedCategories,
              },
            };

            saveAssetMapDataAsync(updatedData);
          },
        },
      ]
    );
  };

  const handleSaveItem = (item: MappingItem) => {
    if (!assetMapData) return;

    trackEvent(AnalyticsEvents.MAPPING_ADD_ITEM, {
      categoryId: editingCategory,
      isEdit: !!editingItem,
    });

    const updatedCategories = assetMapData.mappingData.categories.map(category => {
      if (category.id === editingCategory) {
        if (editingItem) {
          // Update existing item
          return {
            ...category,
            items: category.items.map(existingItem =>
              existingItem.id === editingItem.id ? item : existingItem
            ),
          };
        } else {
          // Add new item
          return {
            ...category,
            items: [...category.items, item],
          };
        }
      }
      return category;
    });

    const updatedData = {
      ...assetMapData,
      mappingData: {
        ...assetMapData.mappingData,
        categories: updatedCategories,
      },
    };

    saveAssetMapDataAsync(updatedData);
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your financial information across all steps. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAssetMapData();
              trackEvent(AnalyticsEvents.MAPPING_RESET);
              await loadAssetMapData();
            } catch (error) {
              console.error('Error resetting data:', error);
              Alert.alert('Error', 'Failed to reset data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleNext = async () => {
    if (!assetMapData) return;
    
    const updatedData = {
      ...assetMapData,
      currentStep: 2,
    };
    
    await saveAssetMapDataAsync(updatedData);
    router.push('/asset-map/personal' as any);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your portfolio...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!assetMapData) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to Load Data</Text>
          <Text style={styles.errorText}>
            There was an issue loading your portfolio data.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadAssetMapData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const totals = calculateTotals(assetMapData.mappingData.categories);
  const assetCategories = assetMapData.mappingData.categories.filter(cat => cat.type === 'asset');
  const liabilityCategories = assetMapData.mappingData.categories.filter(cat => cat.type === 'liability');
  
  const editingCategoryData = assetMapData.mappingData.categories.find(cat => cat.id === editingCategory);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Step 1: Finances</Text>
          <Text style={styles.headerSubtitle}>Assets & Liabilities</Text>
        </View>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetData}
        >
          <RotateCcw size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          {isLogoLoading && (
            <ActivityIndicator size="small" color={Colors.primary} style={styles.loader} />
          )}
          
          <Image
            source={{ 
              uri: "https://mclaughlinfinancial.ca/wp-content/uploads/2024/11/logo.png",
              cache: "force-cache" 
            }}
            style={[styles.logo, hasLogoError && styles.hidden]}
            resizeMode="contain"
            onLoadStart={() => setIsLogoLoading(true)}
            onLoadEnd={() => setIsLogoLoading(false)}
            onError={() => {
              setHasLogoError(true);
              setIsLogoLoading(false);
            }}
          />
          
          {hasLogoError && (
            <Text style={styles.fallbackText}>McLaughlin Financial Group</Text>
          )}
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Financial Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Net Worth</Text>
              <Text style={[
                styles.summaryValue,
                totals.netWorth >= 0 ? styles.positiveValue : styles.negativeValue
              ]}>
                {formatCurrency(totals.netWorth)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Assets</Text>
              <Text style={[styles.summaryValue, styles.positiveValue]}>
                {formatCurrency(totals.totalAssets)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Liabilities</Text>
              <Text style={[styles.summaryValue, styles.negativeValue]}>
                {formatCurrency(totals.totalLiabilities)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Assets</Text>
            <Text style={styles.sectionSubtitle}>
              What you own ({formatCurrency(totals.totalAssets)})
            </Text>
          </View>
          {assetCategories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
          ))}
        </View>

        <View style={styles.sectionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Liabilities</Text>
            <Text style={styles.sectionSubtitle}>
              What you owe ({formatCurrency(totals.totalLiabilities)})
            </Text>
          </View>
          {liabilityCategories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
          ))}
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Your data is stored locally and automatically saved as you make changes.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.navigationFooter}>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 1 of 4</Text>
        </View>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next: Personal Info</Text>
          <ArrowRight size={20} color={Colors.background} />
        </TouchableOpacity>
      </View>

      <ItemEditor
        visible={editorVisible}
        onClose={() => setEditorVisible(false)}
        onSave={handleSaveItem}
        item={editingItem}
        categoryName={editingCategoryData?.name || ''}
        isLiability={editingCategoryData?.type === 'liability'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
    position: 'relative',
    height: 50,
  },
  loader: {
    position: 'absolute',
    top: 15,
  },
  logo: {
    width: 200,
    height: 50,
  },
  hidden: {
    display: 'none',
  },
  fallbackText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  summaryGrid: {
    gap: 12,
  },
  summaryCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  positiveValue: {
    color: Colors.success,
  },
  negativeValue: {
    color: Colors.error,
  },
  sectionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  footerContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  navigationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  stepIndicator: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
});