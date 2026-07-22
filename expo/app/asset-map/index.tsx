import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowRight, RotateCcw, TrendingUp, TrendingDown, Wallet } from 'lucide-react-native';
import Colors from '@/constants/colors';
import {
  AssetMapData,
  MappingItem,
  getAssetMapData,
  saveAssetMapData,
  clearAssetMapData,
  calculateTotals,
} from '@/utils/mappingStorage';
import { trackEvent, AnalyticsEvents } from '@/utils/analytics';
import CategoryCard from '@/components/mapping/CategoryCard';
import ItemEditor from '@/components/mapping/ItemEditor';
import AssetMapHeader from '@/components/mapping/AssetMapHeader';

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export default function AssetMapFinances() {
  const router = useRouter();
  const [assetMapData, setAssetMapData] = useState<AssetMapData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [editorVisible, setEditorVisible] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<string>('');
  const [editingItem, setEditingItem] = useState<MappingItem | undefined>();

  const ratioAnim = useRef(new Animated.Value(0)).current;

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

  const totals = useMemo(
    () =>
      assetMapData
        ? calculateTotals(assetMapData.mappingData.categories)
        : { totalAssets: 0, totalLiabilities: 0, netWorth: 0 },
    [assetMapData]
  );

  const assetRatio = useMemo(() => {
    const sum = totals.totalAssets + totals.totalLiabilities;
    if (sum === 0) return 0;
    return totals.totalAssets / sum;
  }, [totals]);

  useEffect(() => {
    Animated.spring(ratioAnim, {
      toValue: assetRatio,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [assetRatio, ratioAnim]);

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
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (!assetMapData) return;
          const updatedCategories = assetMapData.mappingData.categories.map(
            (category) =>
              category.id === categoryId
                ? {
                    ...category,
                    items: category.items.filter((it) => it.id !== itemId),
                  }
                : category
          );
          saveAssetMapDataAsync({
            ...assetMapData,
            mappingData: {
              ...assetMapData.mappingData,
              categories: updatedCategories,
            },
          });
        },
      },
    ]);
  };

  const handleSaveItem = (item: MappingItem) => {
    if (!assetMapData) return;

    trackEvent(AnalyticsEvents.MAPPING_ADD_ITEM, {
      categoryId: editingCategory,
      isEdit: !!editingItem,
    });

    const updatedCategories = assetMapData.mappingData.categories.map((category) => {
      if (category.id !== editingCategory) return category;
      if (editingItem) {
        return {
          ...category,
          items: category.items.map((existing) =>
            existing.id === editingItem.id ? item : existing
          ),
        };
      }
      return { ...category, items: [...category.items, item] };
    });

    saveAssetMapDataAsync({
      ...assetMapData,
      mappingData: {
        ...assetMapData.mappingData,
        categories: updatedCategories,
      },
    });
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
    await saveAssetMapDataAsync({ ...assetMapData, currentStep: 2 });
    router.push('/asset-map/personal' as any);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your portfolio…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!assetMapData) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to Load Data</Text>
          <Text style={styles.errorText}>There was an issue loading your portfolio data.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadAssetMapData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const assetCategories = assetMapData.mappingData.categories.filter(
    (cat) => cat.type === 'asset'
  );
  const liabilityCategories = assetMapData.mappingData.categories.filter(
    (cat) => cat.type === 'liability'
  );

  const editingCategoryData = assetMapData.mappingData.categories.find(
    (cat) => cat.id === editingCategory
  );

  const assetBarWidth = ratioAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const netWorthColor =
    totals.netWorth >= 0 ? Colors.success : Colors.error;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <AssetMapHeader
        step={1}
        title="Finances"
        subtitle="Step 1 of 4"
        onBack={() => router.back()}
        right={
          <TouchableOpacity
            onPress={handleResetData}
            style={styles.headerRightBtn}
            accessibilityRole="button"
            testID="resetData"
          >
            <RotateCcw size={18} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroIcon}>
              <Wallet size={20} color={Colors.primary} />
            </View>
            <Text style={styles.heroLabel}>Net Worth</Text>
          </View>
          <Text
            style={[styles.heroValue, { color: netWorthColor }]}
            testID="netWorthValue"
          >
            {formatCurrency(totals.netWorth)}
          </Text>

          <View style={styles.ratioTrack}>
            <Animated.View
              style={[styles.ratioFill, { width: assetBarWidth }]}
            />
          </View>

          <View style={styles.ratioLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
              <View>
                <Text style={styles.legendLabel}>Assets</Text>
                <Text style={[styles.legendValue, { color: Colors.success }]}>
                  {formatCurrency(totals.totalAssets)}
                </Text>
              </View>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.error }]} />
              <View style={styles.legendRight}>
                <Text style={styles.legendLabel}>Liabilities</Text>
                <Text style={[styles.legendValue, { color: Colors.error }]}>
                  {formatCurrency(totals.totalLiabilities)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionsContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <TrendingUp size={18} color={Colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Assets</Text>
              <Text style={styles.sectionSubtitle}>What you own</Text>
            </View>
            <Text style={[styles.sectionTotal, { color: Colors.success }]}>
              {formatCurrency(totals.totalAssets)}
            </Text>
          </View>
          {assetCategories.map((category) => {
            const catTotal = category.items.reduce((s, it) => s + it.amount, 0);
            const share =
              totals.totalAssets > 0 ? catTotal / totals.totalAssets : 0;
            return (
              <CategoryCard
                key={category.id}
                category={category}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                shareOfTotal={share}
              />
            );
          })}
        </View>

        <View style={styles.sectionsContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, { backgroundColor: Colors.errorLight }]}>
              <TrendingDown size={18} color={Colors.error} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Liabilities</Text>
              <Text style={styles.sectionSubtitle}>What you owe</Text>
            </View>
            <Text style={[styles.sectionTotal, { color: Colors.error }]}>
              {formatCurrency(totals.totalLiabilities)}
            </Text>
          </View>
          {liabilityCategories.map((category) => {
            const catTotal = category.items.reduce((s, it) => s + it.amount, 0);
            const share =
              totals.totalLiabilities > 0
                ? catTotal / totals.totalLiabilities
                : 0;
            return (
              <CategoryCard
                key={category.id}
                category={category}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                shareOfTotal={share}
              />
            );
          })}
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Your data is stored locally on this device and auto-saves as you type.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.navigationFooter}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          testID="nextStep"
        >
          <Text style={styles.nextButtonText}>Continue to Personal Info</Text>
          <ArrowRight size={20} color={Colors.background} />
        </TouchableOpacity>
      </View>

      <ItemEditor
        visible={editorVisible}
        onClose={() => setEditorVisible(false)}
        onSave={handleSaveItem}
        item={editingItem}
        categoryName={editingCategoryData?.name || ''}
        categoryId={editingCategoryData?.id || ''}
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
  headerRightBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  heroCard: {
    marginTop: -14,
    marginHorizontal: 20,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 24,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  heroIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
    textTransform: 'uppercase' as const,
  },
  heroValue: {
    fontSize: 36,
    fontWeight: '800' as const,
    letterSpacing: -0.8,
    marginBottom: 16,
  },
  ratioTrack: {
    height: 10,
    backgroundColor: Colors.error,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  ratioFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 5,
  },
  ratioLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  legendRight: {
    alignItems: 'flex-end',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  legendValue: {
    fontSize: 15,
    fontWeight: '700' as const,
    marginTop: 2,
  },
  sectionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  sectionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 1,
  },
  sectionTotal: {
    fontSize: 16,
    fontWeight: '800' as const,
    letterSpacing: -0.3,
  },
  footerContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  navigationFooter: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.background,
    letterSpacing: -0.2,
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
    fontWeight: '700' as const,
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
    fontWeight: '600' as const,
    color: Colors.background,
  },
});
