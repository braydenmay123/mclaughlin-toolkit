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
import {
  Edit3,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  PieChart,
  FileText,
  Mail,
  Download,
  Sparkles,
  Users,
  Target,
  HeartHandshake,
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
import AssetMapHeader from '@/components/mapping/AssetMapHeader';

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const formatPercentage = (value: number | null): string => {
  if (value === null) return 'N/A';
  return `${value.toFixed(1)}%`;
};

const ALLOCATION_COLORS: Record<string, string> = {
  'cash-savings': '#0EA5E9',
  tfsa: '#10B981',
  rrsp: '#6366F1',
  fhsa: '#F59E0B',
  resp: '#EC4899',
  rdsp: '#8B5CF6',
  'non-registered': '#14B8A6',
  'real-estate': '#F97316',
  'business-equity': '#84CC16',
};

export default function AssetMapReview() {
  const router = useRouter();
  const [assetMapData, setAssetMapData] = useState<AssetMapData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [gateData, setGateData] = useState<any>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const scoreAnim = useRef(new Animated.Value(0)).current;

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
    await saveAssetMapData({ ...assetMapData, currentStep: 3 });
    router.back();
  };

  const handleEditStep = async (step: number) => {
    if (!assetMapData) return;
    await saveAssetMapData({ ...assetMapData, currentStep: step });
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
      default:
        break;
    }
  };

  const derived = useMemo(() => {
    if (!assetMapData) return null;
    const { mappingData, personalInfo, insuranceInfo } = assetMapData;
    const totals = calculateTotals(mappingData.categories);
    const savingsRate = calculateSavingsRate(personalInfo, mappingData.categories);
    const debtToIncome = calculateDebtToIncome(personalInfo, mappingData.categories);
    const protection = getProtectionSnapshot(insuranceInfo, personalInfo);
    const taxConsiderations = getTaxConsiderations(mappingData.categories);
    const areasOfConcern = getAreasOfConcern(personalInfo, insuranceInfo, mappingData.categories);

    // Financial health score (0-100)
    let score = 50;
    if (totals.netWorth > 0) score += 10;
    if (totals.netWorth > (personalInfo.householdIncome ?? 0) * 2) score += 10;
    if (savingsRate !== null && savingsRate >= 10) score += 8;
    if (debtToIncome !== null && debtToIncome < 30) score += 8;
    if (protection.adequateLife) score += 7;
    if (protection.adequateDisability) score += 7;
    if (totals.totalLiabilities === 0) score += 5;
    if (areasOfConcern.length === 0) score += 5;
    score -= areasOfConcern.length * 5;
    score = Math.max(0, Math.min(100, Math.round(score)));

    return {
      totals,
      savingsRate,
      debtToIncome,
      protection,
      taxConsiderations,
      areasOfConcern,
      score,
    };
  }, [assetMapData]);

  useEffect(() => {
    if (!derived) return;
    Animated.timing(scoreAnim, {
      toValue: derived.score,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [derived, scoreAnim]);

  const prepareAdvisorPayload = useMemo(() => {
    if (!assetMapData || !derived) return null;
    return {
      totals: derived.totals,
      savingsRate: derived.savingsRate,
      debtToIncome: derived.debtToIncome,
      protection: derived.protection,
      personalInfo: assetMapData.personalInfo,
      categories: assetMapData.mappingData.categories,
      healthScore: derived.score,
    };
  }, [assetMapData, derived]);

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
      const payload: EmailData = {
        name: gateData?.name ?? 'Unknown',
        email: gateData?.email ?? 'unknown@example.com',
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
      await downloadPDF({
        name: gateData?.name ?? 'Client',
        email: gateData?.email ?? 'client@example.com',
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
          <Text style={styles.loadingText}>Generating your report…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!assetMapData || !derived) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to Load Data</Text>
          <Text style={styles.errorText}>There was an issue loading your information.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { mappingData, personalInfo, insuranceInfo } = assetMapData;
  const { totals, savingsRate, debtToIncome, protection, taxConsiderations, areasOfConcern, score } = derived;

  const scoreColor =
    score >= 75 ? Colors.success : score >= 50 ? Colors.warning : Colors.error;
  const scoreLabel =
    score >= 75 ? 'Strong' : score >= 50 ? 'Building' : 'Needs Attention';
  const scoreBarWidth = scoreAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  // Build allocation segments
  const assetCats = mappingData.categories.filter(
    (c) => c.type === 'asset' && c.items.length > 0
  );
  const allocationSegments = assetCats
    .map((c) => {
      const value = c.items.reduce((s, it) => s + it.amount, 0);
      return {
        id: c.id,
        name: c.name,
        value,
        share: totals.totalAssets > 0 ? value / totals.totalAssets : 0,
        color: ALLOCATION_COLORS[c.id] ?? Colors.primary,
      };
    })
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <AssetMapHeader
        step={4}
        title="Your Financial Map"
        subtitle="Step 4 of 4"
        onBack={handleBack}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Health Score Hero */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreTopRow}>
            <View style={[styles.scoreIcon, { backgroundColor: `${scoreColor}1A` }]}>
              <Sparkles size={20} color={scoreColor} />
            </View>
            <Text style={styles.scoreLabel}>Financial Health Score</Text>
          </View>
          <View style={styles.scoreNumberRow}>
            <Text style={[styles.scoreNumber, { color: scoreColor }]}>{score}</Text>
            <Text style={styles.scoreDenom}>/100</Text>
            <View style={[styles.scoreBadge, { backgroundColor: `${scoreColor}1A` }]}>
              <Text style={[styles.scoreBadgeText, { color: scoreColor }]}>
                {scoreLabel}
              </Text>
            </View>
          </View>
          <View style={styles.scoreTrack}>
            <Animated.View
              style={[
                styles.scoreFill,
                { width: scoreBarWidth, backgroundColor: scoreColor },
              ]}
            />
          </View>
          <Text style={styles.scoreCaption}>
            Based on net worth, savings rate, debt-to-income, and protection coverage.
          </Text>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <DollarSign size={18} color={Colors.primary} />
            <Text style={styles.metricLabel}>Net Worth</Text>
            <Text
              style={[
                styles.metricValue,
                totals.netWorth >= 0 ? styles.positive : styles.negative,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatCurrency(totals.netWorth)}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <TrendingUp size={18} color={Colors.primary} />
            <Text style={styles.metricLabel}>Savings Rate</Text>
            <Text style={styles.metricValue}>{formatPercentage(savingsRate)}</Text>
          </View>
          <View style={styles.metricCard}>
            <PieChart size={18} color={Colors.primary} />
            <Text style={styles.metricLabel}>Debt-to-Income</Text>
            <Text
              style={[
                styles.metricValue,
                (debtToIncome || 0) > 40 ? styles.negative : styles.positive,
              ]}
            >
              {formatPercentage(debtToIncome)}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Shield size={18} color={Colors.primary} />
            <Text style={styles.metricLabel}>Protection</Text>
            <View style={styles.protectionRow}>
              {protection.adequateLife ? (
                <CheckCircle size={14} color={Colors.success} />
              ) : (
                <AlertTriangle size={14} color={Colors.error} />
              )}
              <Text
                style={[
                  styles.metricValue,
                  { fontSize: 14 },
                  protection.adequateLife ? styles.positive : styles.negative,
                ]}
              >
                {protection.adequateLife ? 'Adequate' : 'Review'}
              </Text>
            </View>
          </View>
        </View>

        {/* Asset Allocation */}
        {allocationSegments.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <PieChart size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Asset Allocation</Text>
            </View>
            <View style={styles.allocationCard}>
              <View style={styles.allocationBar}>
                {allocationSegments.map((seg, idx) => (
                  <View
                    key={seg.id}
                    style={{
                      flex: seg.share,
                      backgroundColor: seg.color,
                      borderTopLeftRadius: idx === 0 ? 8 : 0,
                      borderBottomLeftRadius: idx === 0 ? 8 : 0,
                      borderTopRightRadius:
                        idx === allocationSegments.length - 1 ? 8 : 0,
                      borderBottomRightRadius:
                        idx === allocationSegments.length - 1 ? 8 : 0,
                    }}
                  />
                ))}
              </View>
              <View style={styles.allocationLegend}>
                {allocationSegments.map((seg) => (
                  <View key={seg.id} style={styles.allocationLegendRow}>
                    <View style={[styles.allocationDot, { backgroundColor: seg.color }]} />
                    <Text style={styles.allocationName}>{seg.name}</Text>
                    <Text style={styles.allocationShare}>
                      {(seg.share * 100).toFixed(0)}%
                    </Text>
                    <Text style={styles.allocationValue}>
                      {formatCurrency(seg.value)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Visual Map - quadrant style */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Target size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Snapshot</Text>
          </View>
          <View style={styles.quadrant}>
            <MapTile
              icon={<Users size={18} color={Colors.primary} />}
              title="Household"
              primary={
                personalInfo.age
                  ? `Age ${personalInfo.age}${personalInfo.hasSpouse && personalInfo.spouseAge ? ` · Spouse ${personalInfo.spouseAge}` : ''}`
                  : 'Add age'
              }
              secondary={
                personalInfo.householdIncome
                  ? `${formatCurrency(personalInfo.householdIncome)} income`
                  : personalInfo.dependents > 0
                  ? `${personalInfo.dependents} dependents`
                  : 'No income set'
              }
            />
            <MapTile
              icon={<DollarSign size={18} color={Colors.success} />}
              title="Assets"
              primary={formatCurrency(totals.totalAssets)}
              secondary={`${assetCats.length} account types`}
              accent={Colors.success}
            />
            <MapTile
              icon={<HeartHandshake size={18} color={Colors.warning} />}
              title="Protection"
              primary={
                insuranceInfo.lifeType !== 'none'
                  ? `${insuranceInfo.lifeType.toUpperCase()} Life`
                  : 'No life cover'
              }
              secondary={
                insuranceInfo.disabilityBenefit
                  ? `${formatCurrency(insuranceInfo.disabilityBenefit)}/mo disability`
                  : 'No disability'
              }
              accent={Colors.warning}
            />
            <MapTile
              icon={<Target size={18} color={Colors.info} />}
              title="Goals"
              primary={
                personalInfo.targetRetirementAge
                  ? `Retire at ${personalInfo.targetRetirementAge}`
                  : 'Set retirement age'
              }
              secondary={
                personalInfo.targetRetirementIncome
                  ? `${formatCurrency(personalInfo.targetRetirementIncome)} target`
                  : 'No income target'
              }
              accent={Colors.info}
            />
          </View>
        </View>

        {/* Areas of Concern */}
        {areasOfConcern.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <AlertTriangle size={18} color={Colors.error} />
              <Text style={[styles.sectionTitle, { color: Colors.error }]}>
                Areas of Concern
              </Text>
            </View>
            <View style={styles.concernCard}>
              {areasOfConcern.map((concern, index) => (
                <View key={index} style={styles.concernItem}>
                  <View style={styles.concernIcon}>
                    <AlertTriangle size={14} color={Colors.error} />
                  </View>
                  <Text style={styles.concernText}>{concern}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tax Considerations */}
        {taxConsiderations.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <FileText size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Tax Considerations</Text>
            </View>
            <View style={styles.tipsCard}>
              {taxConsiderations.map((consideration, index) => (
                <View key={index} style={styles.tipItem}>
                  <View style={styles.tipBullet} />
                  <Text style={styles.tipText}>{consideration}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Edit Sections */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Edit3 size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Edit Information</Text>
          </View>
          <View style={styles.editButtonsContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditStep(1)}
            >
              <Text style={styles.editButtonText}>Finances</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditStep(2)}
            >
              <Text style={styles.editButtonText}>Personal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditStep(3)}
            >
              <Text style={styles.editButtonText}>Insurance</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.navigationFooter}>
        <TouchableOpacity
          style={[styles.secondaryButton, isGenerating && styles.disabledBtn]}
          onPress={handleDownloadPDF}
          disabled={isGenerating}
          testID="assetMapDownloadPDF"
        >
          <Download size={18} color={Colors.primary} />
          <Text style={styles.secondaryButtonText}>
            {isGenerating ? 'Preparing…' : 'PDF'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sendButton, isSending && styles.disabledBtn]}
          onPress={handleSendToAdvisor}
          disabled={isSending}
          testID="assetMapSendAdvisor"
        >
          <Mail size={18} color={Colors.background} />
          <Text style={styles.sendButtonText}>
            {isSending ? 'Sending…' : 'Send to Advisor'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function MapTile({
  icon,
  title,
  primary,
  secondary,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  primary: string;
  secondary: string;
  accent?: string;
}) {
  return (
    <View style={[styles.mapTile, accent ? { borderTopColor: accent, borderTopWidth: 3 } : null]}>
      <View style={styles.mapTileHeader}>
        {icon}
        <Text style={styles.mapTileTitle}>{title}</Text>
      </View>
      <Text style={styles.mapTilePrimary} numberOfLines={2}>
        {primary}
      </Text>
      <Text style={styles.mapTileSecondary} numberOfLines={2}>
        {secondary}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  scoreCard: {
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
    marginBottom: 20,
  },
  scoreTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  scoreIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
    textTransform: 'uppercase' as const,
  },
  scoreNumberRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginBottom: 14,
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: '800' as const,
    letterSpacing: -2,
    lineHeight: 56,
  },
  scoreDenom: {
    fontSize: 18,
    color: Colors.textMuted,
    fontWeight: '600' as const,
    marginBottom: 6,
  },
  scoreBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 6,
  },
  scoreBadgeText: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  scoreTrack: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  scoreFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreCaption: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
    marginTop: 8,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  positive: { color: Colors.success },
  negative: { color: Colors.error },
  protectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  allocationCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  allocationBar: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.borderLight,
    marginBottom: 16,
  },
  allocationLegend: {
    gap: 10,
  },
  allocationLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  allocationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  allocationName: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  allocationShare: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600' as const,
    width: 38,
    textAlign: 'right',
  },
  allocationValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '700' as const,
    width: 80,
    textAlign: 'right',
  },
  quadrant: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mapTile: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  mapTileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  mapTileTitle: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600' as const,
    letterSpacing: 0.4,
    textTransform: 'uppercase' as const,
  },
  mapTilePrimary: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  mapTileSecondary: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  concernCard: {
    backgroundColor: Colors.errorLight,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FBCFCF',
    gap: 12,
  },
  concernItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  concernIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  concernText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 10,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 7,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  navigationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  sendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  disabledBtn: { opacity: 0.6 },
  sendButtonText: {
    fontSize: 15,
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
