import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, User, Home, DollarSign } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '@/constants/colors';
import {
  AssetMapData,
  PersonalInfo,
  getAssetMapData,
  saveAssetMapData,
  PROVINCES,
} from '@/utils/mappingStorage';

export default function AssetMapPersonal() {
  const router = useRouter();
  const [assetMapData, setAssetMapData] = useState<AssetMapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [hasLogoError, setHasLogoError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      setIsSaving(true);
      await saveAssetMapData(data);
      setAssetMapData(data);
    } catch (error) {
      console.error('Error saving asset map data:', error);
      Alert.alert('Error', 'Failed to save your changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updatePersonalInfo = (updates: Partial<PersonalInfo>) => {
    if (!assetMapData) return;

    const updatedData = {
      ...assetMapData,
      personalInfo: {
        ...assetMapData.personalInfo,
        ...updates,
      },
    };

    saveAssetMapDataAsync(updatedData);
  };

  const handleNext = async () => {
    if (!assetMapData) return;
    
    const updatedData = {
      ...assetMapData,
      currentStep: 3,
    };
    
    await saveAssetMapDataAsync(updatedData);
    router.push('/asset-map/insurance' as any);
  };

  const handleBack = async () => {
    if (!assetMapData) return;
    
    const updatedData = {
      ...assetMapData,
      currentStep: 1,
    };
    
    await saveAssetMapDataAsync(updatedData);
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your information...</Text>
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
            There was an issue loading your information.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadAssetMapData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { personalInfo } = assetMapData;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <ArrowLeft size={24} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Step 2: Personal</Text>
          <Text style={styles.headerSubtitle}>Your Information</Text>
        </View>
        <View style={styles.placeholder} />
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

        <View style={styles.formContainer}>
          <View style={styles.sectionHeader}>
            <User size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Age</Text>
            <TextInput
              style={styles.input}
              value={personalInfo.age?.toString() || ''}
              onChangeText={(value) => {
                const age = parseInt(value) || undefined;
                updatePersonalInfo({ age });
              }}
              placeholder="Enter your age"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Do you have a spouse/partner?</Text>
              <Switch
                value={personalInfo.hasSpouse}
                onValueChange={(hasSpouse) => {
                  updatePersonalInfo({ 
                    hasSpouse,
                    spouseAge: hasSpouse ? personalInfo.spouseAge : undefined,
                  });
                }}
                trackColor={{ false: Colors.backgroundGray, true: Colors.accentLight }}
                thumbColor={personalInfo.hasSpouse ? Colors.primary : Colors.textMuted}
              />
            </View>
          </View>

          {personalInfo.hasSpouse && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Spouse/Partner Age</Text>
              <TextInput
                style={styles.input}
                value={personalInfo.spouseAge?.toString() || ''}
                onChangeText={(value) => {
                  const spouseAge = parseInt(value) || undefined;
                  updatePersonalInfo({ spouseAge });
                }}
                placeholder="Enter spouse/partner age"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Number of Dependents</Text>
            <TextInput
              style={styles.input}
              value={personalInfo.dependents.toString()}
              onChangeText={(value) => {
                const dependents = parseInt(value) || 0;
                updatePersonalInfo({ dependents });
              }}
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.sectionHeader}>
            <DollarSign size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Financial Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Household Income (Gross Annual)</Text>
            <TextInput
              style={styles.input}
              value={personalInfo.householdIncome?.toString() || ''}
              onChangeText={(value) => {
                const householdIncome = parseInt(value) || undefined;
                updatePersonalInfo({ householdIncome });
              }}
              placeholder="Enter annual household income"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Province/Territory</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={personalInfo.province}
                onValueChange={(province) => updatePersonalInfo({ province })}
                style={styles.picker}
              >
                {PROVINCES.map((province) => (
                  <Picker.Item
                    key={province.value}
                    label={province.label}
                    value={province.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Home size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Goals & Housing</Text>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Do you own your home?</Text>
              <Switch
                value={personalInfo.isHomeowner}
                onValueChange={(isHomeowner) => updatePersonalInfo({ isHomeowner })}
                trackColor={{ false: Colors.backgroundGray, true: Colors.accentLight }}
                thumbColor={personalInfo.isHomeowner ? Colors.primary : Colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Retirement Age</Text>
            <TextInput
              style={styles.input}
              value={personalInfo.targetRetirementAge?.toString() || ''}
              onChangeText={(value) => {
                const targetRetirementAge = parseInt(value) || undefined;
                updatePersonalInfo({ targetRetirementAge });
              }}
              placeholder="e.g., 65"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Retirement Income (After Tax, Annual)</Text>
            <TextInput
              style={styles.input}
              value={personalInfo.targetRetirementIncome?.toString() || ''}
              onChangeText={(value) => {
                const targetRetirementIncome = parseInt(value) || undefined;
                updatePersonalInfo({ targetRetirementIncome });
              }}
              placeholder="Enter desired retirement income"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.navigationFooter}>
        <TouchableOpacity
          style={styles.backNavButton}
          onPress={handleBack}
        >
          <ArrowLeft size={20} color={Colors.primary} />
          <Text style={styles.backNavButtonText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 2 of 4</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.nextButton, isSaving && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={Colors.background} />
          ) : (
            <>
              <Text style={styles.nextButtonText}>Next: Insurance</Text>
              <ArrowRight size={20} color={Colors.background} />
            </>
          )}
        </TouchableOpacity>
      </View>
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
  placeholder: {
    width: 40,
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
  formContainer: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 32,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: Colors.text,
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
  backNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 8,
  },
  backNavButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  stepIndicator: {
    flex: 1,
    alignItems: 'center',
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
  nextButtonDisabled: {
    opacity: 0.6,
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