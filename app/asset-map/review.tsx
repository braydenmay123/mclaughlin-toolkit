import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Edit3, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  PieChart,
  FileText,
  Mail,
  Download
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import {
  AssetMapData,
  getAssetMapData,
  saveAssetMapData,
  calculateTotals,
  calculateSavingsRate,
  calculateDebtToIncome,
  getProtectionSnapshot,
  getTaxConsiderations,
  getAreasOfConcern,
} from '@/utils/mappingStorage';
import { getGateStatus } from '@/utils/gateStorage';
import { downloadPDF, storeUserAnalytics, EmailData } from '@/utils/emailService';

export default function AssetMapReview() {
  const router = useRouter();
  const [assetMapData, setAssetMapData] = useState<AssetMapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [hasLogoError, setHasLogoError] = useState(false);
  const [gateData, setGateData] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assetData, gateInfo] = await Promise.all([
        getAssetMapData(),
        getGateStatus(),
      ]);
      setAssetMapData(assetData);
      setGateData(gateInfo);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load your data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = async () => {
    if (!assetMapData) return;
    
    const updatedData = {
      ...assetMapData,
      currentStep: 3,
    };
    
    await saveAssetMapData(updatedData);
    router.back();
  };

  const handleEditStep = async (step: number) => {
    if (!assetMapData) return;
    
    const updatedData = {
      ...assetMapData,
      currentStep: step,
    };
    
    await saveAssetMapData(updatedData);
    
    switch (step) {
      case 1:
        router.push('/asset-map' as any);
        break;
      case 2:
        router.push('/asset-map/personal' as any);
        break;
      case 3:
        router.push('/asset-map/insurance' as any);
        break;
    }
  };

  const prepareAdvisorPayload = useMemo(() => {
    if (!assetMapData) return null;
    const { mappingData, personalInfo, insuranceInfo } = assetMapData;
    const totals = calculateTotals(mappingData.categories);
    const savingsRate = calculateSavingsRate(personalInfo, mappingData.categories);
    const dti = calculateDebtToIncome(personalInfo, mappingData.categories);
    const protection = getProtectionSnapshot(insuranceInfo, personalInfo);

    return {
      totals,
      savingsRate,
      debtToIncome: dti,
      protection,
      personalInfo,
      categories: mappingData.categories,
    };
  }, [assetMapData]);

  const handleSendToAdvisor = async () => {
    if (!gateData?.passed) {
      Alert.alert(
        'Contact Information Required',
        'Please provide your contact information first to send this report to your advisor.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Provide Info', onPress: () => router.push('/go/calculators' as any) },
        ]
      );
      return;
    }

    if (!prepareAdvisorPayload) return;

    try {
      setIsSending(true);
      const name = gateData?.name ?? 'Unknown';
      const email = gateData?.email ?? 'unknown@example.com';
      const payload: EmailData = {
        name,
        email,
        calculatorType: 'Asset Map',
        results: prepareAdvisorPayload,
        timestamp: new Date().toISOString(),
      };
      await storeUserAnalytics(payload);
      Alert.alert('Report Sent', 'Your asset map report has been queued for your advisor.');
    } catch (e) {
      Alert.alert('Partial Success', 'We saved your report locally. Please try again later if the advisor did not receive it.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!prepareAdvisorPayload) return;
    try {
      setIsGenerating(true);
      const name = gateData?.name ?? 'Client';
      const email = gateData?.email ?? 'client@example.com';
      await downloadPDF({
        name,
        email,
        calculatorType: 'Asset Map',
        results: prepareAdvisorPayload,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Generating your report...</Text>
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
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { mappingData, personalInfo, insuranceInfo } = assetMapData;
  const totals = calculateTotals(mappingData.categories);
  const savingsRate = calculateSavingsRate(personalInfo, mappingData.categories);
  const debtToIncome = calculateDebtToIncome(personalInfo, mappingData.categories);
  const protection = getProtectionSnapshot(insuranceInfo, personalInfo);
  const taxConsiderations = getTaxConsiderations(mappingData.categories);
  const areasOfConcern = getAreasOfConcern(personalInfo, insuranceInfo, mappingData.categories);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number | null): string => {
    if (value === null) return 'N/A';
    return `${value.toFixed(1)}%`;
  };

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
          <Text style={styles.headerTitle}>Step 4: Review</Text>
          <Text style={styles.headerSubtitle}>Financial Map & Report</Text>
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

        {/* Summary Tiles */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Financial Overview</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <DollarSign size={24} color={Colors.primary} />
              <Text style={styles.summaryLabel}>Net Worth</Text>
              <Text style={[
                styles.summaryValue,
                totals.netWorth >= 0 ? styles.positiveValue : styles.negativeValue
              ]}>
                {formatCurrency(totals.netWorth)}
              </Text>
            </View>
            
            <View style={styles.summaryCard}>
              <TrendingUp size={24} color={Colors.primary} />
              <Text style={styles.summaryLabel}>Savings Rate</Text>
              <Text style={styles.summaryValue}>
                {formatPercentage(savingsRate)}
              </Text>
            </View>
            
            <View style={styles.summaryCard}>
              <PieChart size={24} color={Colors.primary} />
              <Text style={styles.summaryLabel}>Debt-to-Income</Text>
              <Text style={[
                styles.summaryValue,
                (debtToIncome || 0) > 40 ? styles.negativeValue : styles.positiveValue
              ]}>
                {formatPercentage(debtToIncome)}
              </Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Shield size={24} color={Colors.primary} />
              <Text style={styles.summaryLabel}>Protection</Text>
              <View style={styles.protectionStatus}>
                {protection.adequateLife ? (
                  <CheckCircle size={16} color={Colors.success} />
                ) : (
                  <AlertTriangle size={16} color={Colors.error} />
                )}
                <Text style={[
                  styles.summaryValue,
                  { fontSize: 16 },
                  protection.adequateLife ? styles.positiveValue : styles.negativeValue
                ]}>
                  {protection.adequateLife ? 'Adequate' : 'Review Needed'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tax Considerations */}
        {taxConsiderations.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <FileText size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Tax Considerations</Text>
            </View>
            {taxConsiderations.map((consideration, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.listItemText}>{consideration}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Areas of Concern */}
        {areasOfConcern.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <AlertTriangle size={20} color={Colors.error} />
              <Text style={[styles.sectionTitle, { color: Colors.error }]}>Areas of Concern</Text>
            </View>
            {areasOfConcern.map((concern, index) => (
              <View key={index} style={styles.listItem}>
                <AlertTriangle size={16} color={Colors.error} />
                <Text style={styles.listItemText}>{concern}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Visual Map */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <PieChart size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Financial Map</Text>
          </View>
          
          <View style={styles.mapContainer}>
            <View style={styles.mapSection}>
              <Text style={styles.mapSectionTitle}>Household</Text>
              <View style={styles.mapCard}>
                <Text style={styles.mapCardText}>
                  {personalInfo.age ? `Age ${personalInfo.age}` : 'Age not provided'}
                  {personalInfo.hasSpouse && personalInfo.spouseAge && ` • Spouse ${personalInfo.spouseAge}`}
                  {personalInfo.dependents > 0 && ` • ${personalInfo.dependents} dependents`}
                </Text>
                <Text style={styles.mapCardSubtext}>
                  {personalInfo.householdIncome ? formatCurrency(personalInfo.householdIncome) + ' income' : 'Income not provided'}
                </Text>
              </View>
            </View>

            <View style={styles.mapConnector} />

            <View style={styles.mapSection}>
              <Text style={styles.mapSectionTitle}>Assets</Text>
              <View style={styles.mapCard}>
                <Text style={styles.mapCardText}>{formatCurrency(totals.totalAssets)}</Text>
                <Text style={styles.mapCardSubtext}>
                  {mappingData.categories.filter(cat => cat.type === 'asset' && cat.items.length > 0).length} account types
                </Text>
              </View>
            </View>

            <View style={styles.mapConnector} />

            <View style={styles.mapSection}>
              <Text style={styles.mapSectionTitle}>Protection</Text>
              <View style={styles.mapCard}>
                <Text style={styles.mapCardText}>
                  {insuranceInfo.lifeType !== 'none' ? 'Life Insurance' : 'No Life Insurance'}
                </Text>
                <Text style={styles.mapCardSubtext}>
                  {insuranceInfo.disabilityBenefit ? `$${insuranceInfo.disabilityBenefit}/mo disability` : 'No disability coverage'}
                </Text>
              </View>
            </View>

            <View style={styles.mapConnector} />

            <View style={styles.mapSection}>
              <Text style={styles.mapSectionTitle}>Goals</Text>
              <View style={styles.mapCard}>
                <Text style={styles.mapCardText}>
                  {personalInfo.targetRetirementAge ? `Retire at ${personalInfo.targetRetirementAge}` : 'No retirement age set'}
                </Text>
                <Text style={styles.mapCardSubtext}>
                  {personalInfo.targetRetirementIncome ? formatCurrency(personalInfo.targetRetirementIncome) + ' target' : 'No income target'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Edit Sections */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Edit3 size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Edit Information</Text>
          </View>
          
          <View style={styles.editButtonsContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditStep(1)}
            >
              <Text style={styles.editButtonText}>Edit Finances</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditStep(2)}
            >
              <Text style={styles.editButtonText}>Edit Personal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditStep(3)}
            >
              <Text style={styles.editButtonText}>Edit Insurance</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.navigationFooter}>
        <TouchableOpacity
          style={styles.backNavButton}
          onPress={handleBack}
          testID="assetMapBack"
        >
          <ArrowLeft size={20} color={Colors.primary} />
          <Text style={styles.backNavButtonText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.secondaryButton, isGenerating && styles.disabledBtn]}
            onPress={handleDownloadPDF}
            disabled={isGenerating}
            testID="assetMapDownloadPDF"
          >
            <Download size={18} color={Colors.primary} />
            <Text style={styles.secondaryButtonText}>{isGenerating ? 'Preparing…' : 'Download PDF'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sendButton, isSending && styles.disabledBtn]}
            onPress={handleSendToAdvisor}
            disabled={isSending}
            testID="assetMapSendAdvisor"
          >
            <Mail size={20} color={Colors.background} />
            <Text style={styles.sendButtonText}>{isSending ? 'Sending…' : 'Send to Advisor'}</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    flex: 1,
    minWidth: '45%',
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  positiveValue: {
    color: Colors.success,
  },
  negativeValue: {
    color: Colors.error,
  },
  protectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 8,
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  mapContainer: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  mapSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mapSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  mapCard: {
    backgroundColor: Colors.accentLight,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent,
    minWidth: 200,
  },
  mapCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
  },
  mapCardSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  mapConnector: {
    width: 2,
    height: 16,
    backgroundColor: Colors.borderLight,
    alignSelf: 'center',
    marginBottom: 8,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  editButton: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
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
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  sendButtonText: {
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