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
import { ArrowLeft, ArrowRight, Shield, Heart, Home } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '@/constants/colors';
import {
  AssetMapData,
  InsuranceInfo,
  getAssetMapData,
  saveAssetMapData,
} from '@/utils/mappingStorage';

const LIFE_INSURANCE_TYPES = [
  { value: 'none', label: 'No Life Insurance' },
  { value: 'term', label: 'Term Life' },
  { value: 'whole', label: 'Whole Life' },
  { value: 'ul', label: 'Universal Life' },
  { value: 'mix', label: 'Mix of Types' },
];

export default function AssetMapInsurance() {
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

  const updateInsuranceInfo = (updates: Partial<InsuranceInfo>) => {
    if (!assetMapData) return;

    const updatedData = {
      ...assetMapData,
      insuranceInfo: {
        ...assetMapData.insuranceInfo,
        ...updates,
      },
    };

    saveAssetMapDataAsync(updatedData);
  };

  const handleNext = async () => {
    if (!assetMapData) return;
    
    const updatedData = {
      ...assetMapData,
      currentStep: 4,
    };
    
    await saveAssetMapDataAsync(updatedData);
    router.push('/asset-map/review' as any);
  };

  const handleBack = async () => {
    if (!assetMapData) return;
    
    const updatedData = {
      ...assetMapData,
      currentStep: 2,
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

  const { insuranceInfo } = assetMapData;

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
          <Text style={styles.headerTitle}>Step 3: Insurance</Text>
          <Text style={styles.headerSubtitle}>Protection Coverage</Text>
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
            <Heart size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Life Insurance</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Life Insurance Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={insuranceInfo.lifeType}
                onValueChange={(lifeType: any) => updateInsuranceInfo({ lifeType })}
                style={styles.picker}
              >
                {LIFE_INSURANCE_TYPES.map((type) => (
                  <Picker.Item
                    key={type.value}
                    label={type.label}
                    value={type.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {insuranceInfo.lifeType !== 'none' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Life Insurance Coverage (Death Benefit)</Text>
              <TextInput
                style={styles.input}
                value={insuranceInfo.lifeCoverage?.toString() || ''}
                onChangeText={(value) => {
                  const lifeCoverage = parseInt(value) || undefined;
                  updateInsuranceInfo({ lifeCoverage });
                }}
                placeholder="Enter total death benefit"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
              />
            </View>
          )}

          <View style={styles.sectionHeader}>
            <Shield size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Disability & Health</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Disability Benefit (Monthly)</Text>
            <TextInput
              style={styles.input}
              value={insuranceInfo.disabilityBenefit?.toString() || ''}
              onChangeText={(value) => {
                const disabilityBenefit = parseInt(value) || undefined;
                updateInsuranceInfo({ disabilityBenefit });
              }}
              placeholder="Enter monthly disability benefit"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Disability Elimination Period (Days)</Text>
            <TextInput
              style={styles.input}
              value={insuranceInfo.disabilityEliminationPeriod?.toString() || ''}
              onChangeText={(value) => {
                const disabilityEliminationPeriod = parseInt(value) || undefined;
                updateInsuranceInfo({ disabilityEliminationPeriod });
              }}
              placeholder="e.g., 90, 120"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Critical Illness Coverage</Text>
            <TextInput
              style={styles.input}
              value={insuranceInfo.criticalIllnessCoverage?.toString() || ''}
              onChangeText={(value) => {
                const criticalIllnessCoverage = parseInt(value) || undefined;
                updateInsuranceInfo({ criticalIllnessCoverage });
              }}
              placeholder="Enter critical illness coverage"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Do you have group benefits through work?</Text>
              <Switch
                value={insuranceInfo.hasGroupBenefits}
                onValueChange={(hasGroupBenefits) => updateInsuranceInfo({ hasGroupBenefits })}
                trackColor={{ false: Colors.backgroundGray, true: Colors.accentLight }}
                thumbColor={insuranceInfo.hasGroupBenefits ? Colors.primary : Colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Home size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Property Insurance</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Home Insurance Coverage (Optional)</Text>
            <TextInput
              style={styles.input}
              value={insuranceInfo.homeCoverage?.toString() || ''}
              onChangeText={(value) => {
                const homeCoverage = parseInt(value) || undefined;
                updateInsuranceInfo({ homeCoverage });
              }}
              placeholder="Enter home insurance coverage"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Auto Liability Limit (Optional)</Text>
            <TextInput
              style={styles.input}
              value={insuranceInfo.autoLiabilityLimit?.toString() || ''}
              onChangeText={(value) => {
                const autoLiabilityLimit = parseInt(value) || undefined;
                updateInsuranceInfo({ autoLiabilityLimit });
              }}
              placeholder="e.g., 1000000, 2000000"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Umbrella Coverage (Optional)</Text>
            <TextInput
              style={styles.input}
              value={insuranceInfo.umbrellaCoverage?.toString() || ''}
              onChangeText={(value) => {
                const umbrellaCoverage = parseInt(value) || undefined;
                updateInsuranceInfo({ umbrellaCoverage });
              }}
              placeholder="Enter umbrella policy coverage"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Insurance information helps us assess your protection needs and identify potential gaps in coverage.
            </Text>
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
          <Text style={styles.stepText}>Step 3 of 4</Text>
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
              <Text style={styles.nextButtonText}>Review & Report</Text>
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
  infoBox: {
    backgroundColor: Colors.accentLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
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