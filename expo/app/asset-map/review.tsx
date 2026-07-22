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
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
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
  Droplets,
  Calendar,
  Scale,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Zap,
  PiggyBank,
  Activity,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import {
  AssetMapData,
  getAssetMapData,
  saveAssetMapData,
  calculateTotals,
  getProtectionSnapshot,
  getTaxConsiderations,
  getAreasOfConcern,
  getLiquidityBreakdown,
  getEmergencyFundMonths,
  getWealthAccumulationScore,
  getDebtToAssetRatio,
  getDebtServiceRatio,
  getSavingsRateDetailed,
  projectRetirement,
  getLifeInsuranceDIME,
  getDiversificationScore,
  getContributionRoomAnalysis,
  getCashFlowSummary,
  getRecommendations,
  Recommendation,
  RecommendationPriority,
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

const formatCompact = (amount: number): string => {
  if (Math.abs(amount) >= 1_000_000)
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  if (Math.abs(amount) >= 1_000) return `$${Math.round(amount / 1_000)}k`;
  return formatCurrency(amount);
};

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

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AssetMapReview() {
  const router = useRouter();
  const [assetMapData, setAssetMapData] = useState<AssetMapData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [gateData, setGateData] = useState<any>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [simReturnRate, setSimReturnRate] = useState<string>('6');
  const [simMonthlySavings, setSimMonthlySavings] = useState<string>('');
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
      // Pre-fill simulator with current monthly savings
      if (assetData.personalInfo.monthlySavings) {
        setSimMonthlySavings(assetData.personalInfo.monthlySavings.toString());
      }
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

  const toggleSection = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection((cur) => (cur === id ? null : id));
  };

  const derived = useMemo(() => {
    if (!assetMapData) return null;
    const { mappingData, personalInfo, insuranceInfo } = assetMapData;
    const totals = calculateTotals(mappingData.categories);
    const savingsRate = getSavingsRateDetailed(mappingData.categories, personalInfo);
    const debtToIncome =
      personalInfo.householdIncome && personalInfo.householdIncome > 0
        ? (totals.totalLiabilities / personalInfo.householdIncome) * 100
        : null;
    const debtToAssets = getDebtToAssetRatio(mappingData.categories);
    const debtService = getDebtServiceRatio(mappingData.categories, personalInfo);
    const protection = getProtectionSnapshot(insuranceInfo, personalInfo);
    const taxConsiderations = getTaxConsiderations(mappingData.categories);
    const areasOfConcern = getAreasOfConcern(personalInfo, insuranceInfo, mappingData.categories);
    const liquidity = getLiquidityBreakdown(mappingData.categories);
    const emergencyMonths = getEmergencyFundMonths(mappingData.categories, personalInfo);
    const wealth = getWealthAccumulationScore(totals, personalInfo);
    const retirement = projectRetirement(mappingData.categories, personalInfo);
    const dime = getLifeInsuranceDIME(mappingData.categories, personalInfo, insuranceInfo);
    const diversification = getDiversificationScore(mappingData.categories);
    const contributionRoom = getContributionRoomAnalysis(mappingData.categories);
    const cashFlow = getCashFlowSummary(personalInfo, mappingData.categories);
    const recommendations = getRecommendations(mappingData.categories, personalInfo, insuranceInfo);

    // Financial health score — richer model
    let score = 40;
    if (totals.netWorth > 0) score += 8;
    if (totals.netWorth > (personalInfo.householdIncome ?? 0) * 2) score += 8;
    if (totals.netWorth > (personalInfo.householdIncome ?? 0) * 5) score += 4;
    if (savingsRate.rate !== null && savingsRate.rate >= 10) score += 6;
    if (savingsRate.rate !== null && savingsRate.rate >= 20) score += 4;
    if (debtToAssets !== null && debtToAssets < 50) score += 6;
    if (debtToAssets !== null && debtToAssets < 30) score += 3;
    if (debtService !== null && debtService < 36) score += 5;
    if (emergencyMonths !== null && emergencyMonths >= 3) score += 6;
    if (emergencyMonths !== null && emergencyMonths >= 6) score += 3;
    if (protection.adequateLife) score += 5;
    if (protection.adequateDisability) score += 5;
    if (diversification.score >= 70) score += 4;
    if (wealth.status === 'on-track' || wealth.status === 'prodigy') score += 5;
    if (retirement.targetMet === true) score += 5;
    if (cashFlow.surplus > 0) score += 3;
    score -= areasOfConcern.length * 3;
    score -= recommendations.filter((r) => r.priority === 'critical').length * 4;
    score = Math.max(0, Math.min(100, Math.round(score)));

    return {
      totals,
      savingsRate,
      debtToIncome,
      debtToAssets,
      debtService,
      protection,
      taxConsiderations,
      areasOfConcern,
      liquidity,
      emergencyMonths,
      wealth,
      retirement,
      dime,
      diversification,
      contributionRoom,
      cashFlow,
      recommendations,
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

  // What-if simulator — recalculate retirement with overridden inputs
  const simulation = useMemo(() => {
    if (!assetMapData) return null;
    const rate = parseFloat(simReturnRate) || 6;
    const savings = parseFloat(simMonthlySavings) || 0;
    const syntheticPersonal = {
      ...assetMapData.personalInfo,
      expectedReturnRate: rate,
      monthlySavings: savings,
    };
    return projectRetirement(assetMapData.mappingData.categories, syntheticPersonal);
  }, [assetMapData, simReturnRate, simMonthlySavings]);

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
      liquidity: derived.liquidity,
      emergencyMonths: derived.emergencyMonths,
      diversification: derived.diversification,
      retirement: derived.retirement,
      dime: derived.dime,
      recommendations: derived.recommendations,
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
      Alert.alert(
        'Partial Success',
        'We saved your report locally. Please try again later if the advisor did not receive it.'
      );
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
  const {
    totals,
    savingsRate,
    debtToAssets,
    debtService,
    protection,
    taxConsiderations,
    areasOfConcern,
    liquidity,
    emergencyMonths,
    wealth,
    retirement,
    dime,
    diversification,
    contributionRoom,
    cashFlow,
    recommendations,
    score,
  } = derived;

  const scoreColor =
    score >= 75 ? Colors.success : score >= 50 ? Colors.warning : Colors.error;
  const scoreLabel =
    score >= 75 ? 'Strong' : score >= 50 ? 'Building' : 'Needs Attention';
  const scoreBarWidth = scoreAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  // Asset allocation segments
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

  const targetCapital = personalInfo.targetRetirementIncome
    ? personalInfo.targetRetirementIncome * 25
    : null;

  const criticalCount = recommendations.filter((r) => r.priority === 'critical').length;
  const highCount = recommendations.filter((r) => r.priority === 'high').length;

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
            Based on net worth, savings rate, debt ratios, emergency fund, protection,
            diversification & retirement readiness.
          </Text>
          {(criticalCount > 0 || highCount > 0) && (
            <View style={styles.priorityRow}>
              {criticalCount > 0 && (
                <View style={[styles.priorityPill, { backgroundColor: Colors.errorLight }]}>
                  <AlertTriangle size={12} color={Colors.error} />
                  <Text style={[styles.priorityText, { color: Colors.error }]}>
                    {criticalCount} critical
                  </Text>
                </View>
              )}
              {highCount > 0 && (
                <View style={[styles.priorityPill, { backgroundColor: Colors.warningLight }]}>
                  <Zap size={12} color={Colors.warning} />
                  <Text style={[styles.priorityText, { color: Colors.warning }]}>
                    {highCount} high priority
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Key Metrics — expanded grid */}
        <View style={styles.metricsContainer}>
          <MetricCard
            icon={<DollarSign size={18} color={Colors.primary} />}
            label="Net Worth"
            value={formatCurrency(totals.netWorth)}
            valueColor={totals.netWorth >= 0 ? Colors.success : Colors.error}
          />
          <MetricCard
            icon={<PiggyBank size={18} color={Colors.primary} />}
            label="Savings Rate"
            value={formatPercentage(savingsRate.rate)}
            sub={savingsRate.source === 'direct' ? 'self-reported' : 'estimated'}
            valueColor={
              savingsRate.rate === null
                ? Colors.textMuted
                : savingsRate.rate >= 15
                ? Colors.success
                : savingsRate.rate >= 10
                ? Colors.warning
                : Colors.error
            }
          />
          <MetricCard
            icon={<Scale size={18} color={Colors.primary} />}
            label="Debt-to-Asset"
            value={formatPercentage(debtToAssets)}
            valueColor={
              debtToAssets === null
                ? Colors.textMuted
                : debtToAssets < 30
                ? Colors.success
                : debtToAssets < 50
                ? Colors.warning
                : Colors.error
            }
          />
          <MetricCard
            icon={<CreditCardIcon />}
            label="Debt Service"
            value={formatPercentage(debtService)}
            valueColor={
              debtService === null
                ? Colors.textMuted
                : debtService < 20
                ? Colors.success
                : debtService < 36
                ? Colors.warning
                : Colors.error
            }
          />
          <MetricCard
            icon={<Droplets size={18} color={Colors.primary} />}
            label="Emergency Fund"
            value={emergencyMonths !== null ? `${emergencyMonths.toFixed(1)} mo` : 'N/A'}
            valueColor={
              emergencyMonths === null
                ? Colors.textMuted
                : emergencyMonths >= 6
                ? Colors.success
                : emergencyMonths >= 3
                ? Colors.warning
                : Colors.error
            }
          />
          <MetricCard
            icon={<PieChart size={18} color={Colors.primary} />}
            label="Diversification"
            value={diversification.label === 'No data' ? 'N/A' : `${diversification.score}/100`}
            sub={diversification.label}
            valueColor={
              diversification.label === 'Diversified'
                ? Colors.success
                : diversification.label === 'Moderate'
                ? Colors.warning
                : Colors.error
            }
          />
          <MetricCard
            icon={<Shield size={18} color={Colors.primary} />}
            label="Protection"
            value={protection.adequateLife ? 'Adequate' : 'Review'}
            valueColor={protection.adequateLife ? Colors.success : Colors.error}
          />
          <MetricCard
            icon={<Target size={18} color={Colors.primary} />}
            label="Retirement"
            value={
              retirement.targetMet === null
                ? 'Set goal'
                : retirement.targetMet
                ? 'On track'
                : 'Gap'
            }
            valueColor={
              retirement.targetMet === null
                ? Colors.textMuted
                : retirement.targetMet
                ? Colors.success
                : Colors.error
            }
          />
        </View>

        {/* Cash Flow Snapshot */}
        {cashFlow.totalIncome > 0 && (
          <CollapsibleSection
            id="cashflow"
            expandedId={expandedSection}
            onToggle={toggleSection}
            icon={<Activity size={18} color={Colors.primary} />}
            title="Monthly Cash Flow"
            summary={cashFlow.surplus >= 0 ? `+${formatCurrency(cashFlow.surplus)}/mo` : `${formatCurrency(cashFlow.surplus)}/mo`}
            summaryColor={cashFlow.surplus >= 0 ? Colors.success : Colors.error}
          >
            <View style={styles.flowRows}>
              <FlowRow label="Take-home pay" value={formatCurrency(cashFlow.takeHome)} positive />
              {cashFlow.investmentIncome > 0 && (
                <FlowRow
                  label="Investment income"
                  value={formatCurrency(cashFlow.investmentIncome)}
                  positive
                />
              )}
              <FlowRow label="Expenses" value={formatCurrency(cashFlow.expenses)} />
              <FlowRow label="Debt payments" value={formatCurrency(cashFlow.debtPayments)} />
              <FlowRow label="Savings" value={formatCurrency(cashFlow.savings)} />
              <View style={styles.flowDivider} />
              <FlowRow
                label="Net surplus"
                value={formatCurrency(cashFlow.surplus)}
                positive={cashFlow.surplus >= 0}
                bold
              />
            </View>
            {cashFlow.savingsRate !== null && (
              <View style={styles.flowBarContainer}>
                <Text style={styles.flowBarLabel}>
                  Savings rate: {cashFlow.savingsRate.toFixed(1)}% of take-home pay
                </Text>
                <View style={styles.flowBarTrack}>
                  <View
                    style={[
                      styles.flowBarFill,
                      {
                        width: `${Math.min(100, cashFlow.savingsRate)}%`,
                        backgroundColor:
                          cashFlow.savingsRate >= 15
                            ? Colors.success
                            : cashFlow.savingsRate >= 10
                            ? Colors.warning
                            : Colors.error,
                      },
                    ]}
                  />
                </View>
              </View>
            )}
          </CollapsibleSection>
        )}

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
                    <Text style={styles.allocationValue}>{formatCurrency(seg.value)}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Liquidity Breakdown */}
        {liquidity.totalAssets > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Droplets size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Liquidity Breakdown</Text>
            </View>
            <View style={styles.allocationCard}>
              <View style={styles.allocationBar}>
                <View
                  style={{
                    flex: liquidity.liquidShare,
                    backgroundColor: Colors.success,
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                  }}
                />
                <View
                  style={{
                    flex: liquidity.semiLiquidShare,
                    backgroundColor: Colors.warning,
                  }}
                />
                <View
                  style={{
                    flex: liquidity.illiquidShare,
                    backgroundColor: Colors.info,
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                  }}
                />
              </View>
              <View style={styles.allocationLegend}>
                <View style={styles.allocationLegendRow}>
                  <View style={[styles.allocationDot, { backgroundColor: Colors.success }]} />
                  <Text style={styles.allocationName}>Liquid (cash, TFSA)</Text>
                  <Text style={styles.allocationShare}>
                    {(liquidity.liquidShare * 100).toFixed(0)}%
                  </Text>
                  <Text style={styles.allocationValue}>{formatCurrency(liquidity.liquid)}</Text>
                </View>
                <View style={styles.allocationLegendRow}>
                  <View style={[styles.allocationDot, { backgroundColor: Colors.warning }]} />
                  <Text style={styles.allocationName}>Semi-liquid (RRSP)</Text>
                  <Text style={styles.allocationShare}>
                    {(liquidity.semiLiquidShare * 100).toFixed(0)}%
                  </Text>
                  <Text style={styles.allocationValue}>
                    {formatCurrency(liquidity.semiLiquid)}
                  </Text>
                </View>
                <View style={styles.allocationLegendRow}>
                  <View style={[styles.allocationDot, { backgroundColor: Colors.info }]} />
                  <Text style={styles.allocationName}>Illiquid (real estate)</Text>
                  <Text style={styles.allocationShare}>
                    {(liquidity.illiquidShare * 100).toFixed(0)}%
                  </Text>
                  <Text style={styles.allocationValue}>
                    {formatCurrency(liquidity.illiquid)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Emergency Fund Analysis */}
        {emergencyMonths !== null && personalInfo.monthlyExpenses && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Shield size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Emergency Fund</Text>
            </View>
            <View style={styles.tipCard}>
              <View style={styles.emergencyRow}>
                <Text style={styles.emergencyLabel}>Current coverage</Text>
                <Text
                  style={[
                    styles.emergencyValue,
                    {
                      color:
                        emergencyMonths >= 6
                          ? Colors.success
                          : emergencyMonths >= 3
                          ? Colors.warning
                          : Colors.error,
                    },
                  ]}
                >
                  {emergencyMonths.toFixed(1)} months
                </Text>
              </View>
              <View style={styles.emergencyTrack}>
                <View
                  style={[
                    styles.emergencyFill,
                    {
                      width: `${Math.min(100, (emergencyMonths / 6) * 100)}%`,
                      backgroundColor:
                        emergencyMonths >= 6
                          ? Colors.success
                          : emergencyMonths >= 3
                          ? Colors.warning
                          : Colors.error,
                    },
                  ]}
                />
                {/* Target markers at 3 and 6 months */}
                <View style={[styles.emergencyMarker, { left: '50%' }]} />
                <View style={[styles.emergencyMarker, { left: '100%' }]} />
              </View>
              <View style={styles.emergencyScaleRow}>
                <Text style={styles.emergencyScale}>0</Text>
                <Text style={styles.emergencyScale}>3 mo</Text>
                <Text style={styles.emergencyScale}>6 mo</Text>
              </View>
              <Text style={styles.emergencyCaption}>
                Target: 3–6 months of essential expenses (
                {formatCurrency(personalInfo.monthlyExpenses)}/mo).{' '}
                {emergencyMonths < 3
                  ? `You need ${formatCurrency(personalInfo.monthlyExpenses * (3 - emergencyMonths))} more to reach 3 months.`
                  : emergencyMonths < 6
                  ? `${formatCurrency(personalInfo.monthlyExpenses * (6 - emergencyMonths))} more to reach 6 months.`
                  : 'You have healthy coverage.'}
              </Text>
            </View>
          </View>
        )}

        {/* Retirement Projection */}
        {personalInfo.age && personalInfo.targetRetirementAge && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Calendar size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Retirement Projection</Text>
            </View>
            <View style={styles.tipCard}>
              <View style={styles.retirementGrid}>
                <RetirementStat
                  label="Current investable assets"
                  value={formatCurrency(retirement.startingAssets)}
                />
                <RetirementStat
                  label="Monthly contribution"
                  value={formatCurrency(retirement.monthlyContribution)}
                />
                <RetirementStat
                  label="Years to retirement"
                  value={`${retirement.yearsToRetirement ?? 0}`}
                />
                <RetirementStat
                  label="Annual return assumed"
                  value={`${(retirement.annualReturn * 100).toFixed(1)}%`}
                />
                <RetirementStat
                  label="Projected at retirement"
                  value={formatCurrency(retirement.projectedAtRetirement ?? 0)}
                  highlight={
                    retirement.targetMet === true
                      ? 'success'
                      : retirement.targetMet === false
                      ? 'error'
                      : undefined
                  }
                />
                {targetCapital && (
                  <RetirementStat
                    label="Target capital (25x rule)"
                    value={formatCurrency(targetCapital)}
                  />
                )}
              </View>

              {/* Mini trajectory chart */}
              {retirement.trajectory.length > 1 && (
                <MiniChart
                  data={retirement.trajectory.map((p) => p.balance)}
                  labels={retirement.trajectory.map((p) => p.year)}
                  color={retirement.targetMet === false ? Colors.warning : Colors.primary}
                  targetLine={targetCapital ?? undefined}
                />
              )}

              {retirement.targetMet === false && retirement.targetShortfall !== null && (
                <View style={styles.gapBanner}>
                  <AlertTriangle size={16} color={Colors.warning} />
                  <Text style={styles.gapText}>
                    Projected shortfall of {formatCurrency(retirement.targetShortfall)} at
                    retirement.
                  </Text>
                </View>
              )}
              {retirement.targetMet === true && (
                <View style={[styles.gapBanner, { backgroundColor: Colors.successLight }]}>
                  <CheckCircle size={16} color={Colors.success} />
                  <Text style={[styles.gapText, { color: Colors.success }]}>
                    On track to meet your retirement income target.
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* What-if Simulator */}
        {personalInfo.age && personalInfo.targetRetirementAge && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>What-If Simulator</Text>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.simCaption}>
                Adjust your expected return & monthly savings to see how they affect your
                retirement projection.
              </Text>
              <View style={styles.simInputs}>
                <View style={styles.simInputWrap}>
                  <Text style={styles.simInputLabel}>Annual return %</Text>
                  <TextInput
                    style={styles.simInput}
                    value={simReturnRate}
                    onChangeText={setSimReturnRate}
                    keyboardType="decimal-pad"
                    placeholder="6"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
                <View style={styles.simInputWrap}>
                  <Text style={styles.simInputLabel}>Monthly savings</Text>
                  <TextInput
                    style={styles.simInput}
                    value={simMonthlySavings}
                    onChangeText={setSimMonthlySavings}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              </View>
              {simulation && simulation.projectedAtRetirement !== null && (
                <View style={styles.simResultRow}>
                  <Text style={styles.simResultLabel}>Projected at retirement:</Text>
                  <Text
                    style={[
                      styles.simResultValue,
                      {
                        color:
                          retirement.projectedAtRetirement !== null &&
                          simulation.projectedAtRetirement > retirement.projectedAtRetirement
                            ? Colors.success
                            : Colors.primary,
                      },
                    ]}
                  >
                    {formatCurrency(simulation.projectedAtRetirement)}
                  </Text>
                  {retirement.projectedAtRetirement !== null && (
                    <Text
                      style={[
                        styles.simDelta,
                        {
                          color:
                            simulation.projectedAtRetirement > retirement.projectedAtRetirement
                              ? Colors.success
                              : Colors.error,
                        },
                      ]}
                    >
                      {simulation.projectedAtRetirement > retirement.projectedAtRetirement
                        ? '+'
                        : ''}
                      {formatCompact(
                        simulation.projectedAtRetirement - retirement.projectedAtRetirement
                      )}{' '}
                      vs current
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Life Insurance DIME */}
        {personalInfo.householdIncome && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <HeartHandshake size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Life Insurance DIME Analysis</Text>
            </View>
            <View style={styles.tipCard}>
              {dime.recommended !== null ? (
                <>
                  <View style={styles.dimeComponents}>
                    {dime.components.map((comp) => (
                      <View key={comp.label} style={styles.dimeRow}>
                        <Text style={styles.dimeCompLabel}>{comp.label}</Text>
                        <Text style={styles.dimeCompValue}>{formatCurrency(comp.value)}</Text>
                      </View>
                    ))}
                    <View style={styles.dimeDivider} />
                    <View style={styles.dimeRow}>
                      <Text style={styles.dimeTotalLabel}>Recommended coverage</Text>
                      <Text style={styles.dimeTotalValue}>{formatCurrency(dime.recommended)}</Text>
                    </View>
                    <View style={styles.dimeRow}>
                      <Text style={styles.dimeCompLabel}>Current coverage</Text>
                      <Text style={styles.dimeCompValue}>
                        {formatCurrency(dime.current)}
                      </Text>
                    </View>
                    <View style={styles.dimeRow}>
                      <Text
                        style={[
                          styles.dimeCompLabel,
                          { fontWeight: '700' as const },
                        ]}
                      >
                        {dime.gap !== null && dime.gap > 0 ? 'Coverage gap' : 'Surplus'}
                      </Text>
                      <Text
                        style={[
                          styles.dimeCompValue,
                          {
                            color:
                              dime.gap !== null && dime.gap > 0 ? Colors.error : Colors.success,
                            fontWeight: '700' as const,
                          },
                        ]}
                      >
                        {formatCurrency(Math.abs(dime.gap ?? 0))}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <Text style={styles.emptyText}>
                  Add your household income to see DIME life insurance analysis.
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Contribution Room */}
        {contributionRoom.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <PiggyBank size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Contribution Room</Text>
            </View>
            <View style={styles.tipCard}>
              {contributionRoom.map((room) => (
                <View key={room.id} style={styles.roomRow}>
                  <View style={styles.roomHeader}>
                    <Text style={styles.roomName}>{room.name}</Text>
                    <Text style={styles.roomUsed}>{formatCurrency(room.used)}</Text>
                  </View>
                  <View style={styles.roomTrack}>
                    <View
                      style={[
                        styles.roomFill,
                        {
                          width: `${Math.min(100, room.utilization)}%`,
                          backgroundColor:
                            room.utilization >= 100
                              ? Colors.success
                              : room.utilization >= 80
                              ? Colors.info
                              : Colors.warning,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.roomFooterRow}>
                    <Text style={styles.roomCaption}>
                      {room.utilization.toFixed(0)}% utilized
                      {room.room > 0 ? ` · ${formatCurrency(room.room)} room left` : ''}
                    </Text>
                    {room.annual > 0 && (
                      <Text style={styles.roomAnnual}>
                        {formatCurrency(room.annual)}/yr
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Wealth Accumulation */}
        {personalInfo.age && personalInfo.householdIncome && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Scale size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Wealth Accumulation</Text>
            </View>
            <View style={styles.tipCard}>
              <View style={styles.wealthRow}>
                <View style={styles.wealthCol}>
                  <Text style={styles.wealthLabel}>Your net worth</Text>
                  <Text
                    style={[
                      styles.wealthValue,
                      {
                        color:
                          wealth.status === 'prodigy'
                            ? Colors.success
                            : wealth.status === 'on-track'
                            ? Colors.primary
                            : Colors.error,
                      },
                    ]}
                  >
                    {formatCurrency(totals.netWorth)}
                  </Text>
                </View>
                <View style={styles.wealthDivider} />
                <View style={styles.wealthCol}>
                  <Text style={styles.wealthLabel}>Expected for age & income</Text>
                  <Text style={styles.wealthValue}>
                    {wealth.expected !== null ? formatCurrency(wealth.expected) : 'N/A'}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.wealthStatusPill,
                  {
                    backgroundColor:
                      wealth.status === 'prodigy'
                        ? Colors.successLight
                        : wealth.status === 'on-track'
                        ? Colors.accentLight
                        : wealth.status === 'behind'
                        ? Colors.errorLight
                        : Colors.backgroundGray,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.wealthStatusText,
                    {
                      color:
                        wealth.status === 'prodigy'
                          ? Colors.success
                          : wealth.status === 'on-track'
                          ? Colors.primary
                          : wealth.status === 'behind'
                          ? Colors.error
                          : Colors.textMuted,
                    },
                  ]}
                >
                  {wealth.status === 'prodigy'
                    ? 'Wealth prodigy — well ahead of peers'
                    : wealth.status === 'on-track'
                    ? 'On track for your age & income'
                    : wealth.status === 'behind'
                    ? 'Behind where you should be — focus on saving more'
                    : 'Add age & income to assess'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Prioritized Recommendations */}
        {recommendations.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Lightbulb size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
            </View>
            <View style={styles.recsContainer}>
              {recommendations.map((rec, idx) => (
                <RecommendationRow key={rec.id} rec={rec} index={idx} />
              ))}
            </View>
          </View>
        )}

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

        {/* Snapshot Quadrant */}
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
                  ? `Age ${personalInfo.age}${
                      personalInfo.hasSpouse && personalInfo.spouseAge
                        ? ` · Spouse ${personalInfo.spouseAge}`
                        : ''
                    }`
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

        {/* Edit Sections */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Edit3 size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Edit Information</Text>
          </View>
          <View style={styles.editButtonsContainer}>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEditStep(1)}>
              <Text style={styles.editButtonText}>Finances</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEditStep(2)}>
              <Text style={styles.editButtonText}>Personal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEditStep(3)}>
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

/* ---------- Sub-components ---------- */

function CreditCardIcon() {
  return <Scale size={18} color={Colors.primary} />;
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.metricCard}>
      {icon}
      <Text style={styles.metricLabel}>{label}</Text>
      <Text
        style={[styles.metricValue, valueColor ? { color: valueColor } : null]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      {sub ? <Text style={styles.metricSub}>{sub}</Text> : null}
    </View>
  );
}

function CollapsibleSection({
  id,
  expandedId,
  onToggle,
  icon,
  title,
  summary,
  summaryColor,
  children,
}: {
  id: string;
  expandedId: string | null;
  onToggle: (id: string) => void;
  icon: React.ReactNode;
  title: string;
  summary?: string;
  summaryColor?: string;
  children: React.ReactNode;
}) {
  const expanded = expandedId === id;
  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => onToggle(id)}
        activeOpacity={0.85}
      >
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
        {summary ? (
          <Text style={[styles.sectionSummary, summaryColor ? { color: summaryColor } : null]}>
            {summary}
          </Text>
        ) : null}
        <Animated.View style={{ transform: [{ rotate: expanded ? '90deg' : '0deg' }] }}>
          <ChevronRight size={18} color={Colors.textMuted} />
        </Animated.View>
      </TouchableOpacity>
      {expanded ? <View style={styles.collapsibleBody}>{children}</View> : null}
    </View>
  );
}

function FlowRow({
  label,
  value,
  positive,
  bold,
}: {
  label: string;
  value: string;
  positive?: boolean;
  bold?: boolean;
}) {
  return (
    <View style={styles.flowRow}>
      <Text style={[styles.flowLabel, bold ? { fontWeight: '700' as const } : null]}>
        {label}
      </Text>
      <Text
        style={[
          styles.flowValue,
          bold ? { fontWeight: '700' as const } : null,
          positive ? { color: Colors.success } : null,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function RetirementStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: 'success' | 'error';
}) {
  return (
    <View style={styles.retirementStat}>
      <Text style={styles.retirementStatLabel}>{label}</Text>
      <Text
        style={[
          styles.retirementStatValue,
          highlight === 'success'
            ? { color: Colors.success }
            : highlight === 'error'
            ? { color: Colors.error }
            : null,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function MiniChart({
  data,
  labels,
  color,
  targetLine,
}: {
  data: number[];
  labels: number[];
  color: string;
  targetLine?: number;
}) {
  if (data.length < 2) return null;
  const max = Math.max(...data, targetLine ?? 0, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  // Sample down to ~30 points for visual clarity
  const step = Math.max(1, Math.floor(data.length / 30));
  const sampled = data.filter((_, i) => i % step === 0 || i === data.length - 1);
  const sampledLabels = labels.filter((_, i) => i % step === 0 || i === labels.length - 1);

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartPlot}>
        <View
          style={[
            styles.chartLine,
            {
              height: 1,
              backgroundColor: Colors.borderLight,
              bottom: `${((0 - min) / range) * 100}%`,
            },
          ]}
        />
        {targetLine !== undefined && targetLine > 0 && (
          <View
            style={[
              styles.chartLine,
              {
                height: 1,
                backgroundColor: Colors.error,
                opacity: 0.5,
                bottom: `${((targetLine - min) / range) * 100}%`,
              },
            ]}
          />
        )}
        {/* Build a bar-based area visualization */}
        <View style={styles.chartBars}>
          {sampled.map((v, i) => {
            const h = ((v - min) / range) * 100;
            return (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  backgroundColor: color,
                  opacity: 0.15 + (i / sampled.length) * 0.85,
                  borderTopLeftRadius: i === 0 ? 4 : 0,
                  borderTopRightRadius: i === sampled.length - 1 ? 4 : 0,
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                }}
              />
            );
          })}
        </View>
      </View>
      <View style={styles.chartLabels}>
        <Text style={styles.chartLabel}>{sampledLabels[0]}</Text>
        <Text style={styles.chartLabel}>{sampledLabels[Math.floor(sampledLabels.length / 2)]}</Text>
        <Text style={styles.chartLabel}>{sampledLabels[sampledLabels.length - 1]}</Text>
      </View>
    </View>
  );
}

function RecommendationRow({ rec, index }: { rec: Recommendation; index: number }) {
  const priorityColors: Record<RecommendationPriority, { bg: string; text: string; icon: string }> = {
    critical: { bg: Colors.errorLight, text: Colors.error, icon: Colors.error },
    high: { bg: Colors.warningLight, text: Colors.warning, icon: Colors.warning },
    medium: { bg: Colors.infoLight, text: Colors.info, icon: Colors.info },
    low: { bg: Colors.backgroundGray, text: Colors.textSecondary, icon: Colors.textSecondary },
  };
  const c = priorityColors[rec.priority];
  const PriorityIcon =
    rec.priority === 'critical' ? AlertTriangle : rec.priority === 'high' ? Zap : Lightbulb;

  return (
    <View style={styles.recRow}>
      <View style={styles.recHeader}>
        <View style={[styles.recIcon, { backgroundColor: c.bg }]}>
          <PriorityIcon size={14} color={c.icon} />
        </View>
        <View style={styles.recBody}>
          <Text style={styles.recTitle}>{rec.title}</Text>
          <Text style={styles.recDetail}>{rec.detail}</Text>
        </View>
      </View>
      <View style={styles.recFooter}>
        <View style={[styles.recPill, { backgroundColor: c.bg }]}>
          <Text style={[styles.recPillText, { color: c.text }]}>{rec.priority}</Text>
        </View>
        {rec.actionLabel ? (
          <TouchableOpacity style={styles.recAction}>
            <Text style={styles.recActionText}>{rec.actionLabel}</Text>
            <ChevronRight size={12} color={Colors.primary} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
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
    <View
      style={[styles.mapTile, accent ? { borderTopColor: accent, borderTopWidth: 3 } : null]}
    >
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
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700' as const,
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
    minWidth: '47%',
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
  metricSub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
    fontStyle: 'italic' as const,
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
    flex: 1,
  },
  sectionSummary: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
  },
  collapsibleBody: {
    marginTop: 4,
  },
  flowRows: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 10,
  },
  flowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flowLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  flowValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  flowDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 4,
  },
  flowBarContainer: {
    marginTop: 14,
  },
  flowBarLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  flowBarTrack: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  flowBarFill: {
    height: '100%',
    borderRadius: 4,
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
  tipCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  emergencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  emergencyLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  emergencyValue: {
    fontSize: 22,
    fontWeight: '800' as const,
  },
  emergencyTrack: {
    height: 10,
    backgroundColor: Colors.borderLight,
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 4,
  },
  emergencyFill: {
    height: '100%',
    borderRadius: 5,
  },
  emergencyMarker: {
    position: 'absolute',
    top: -2,
    width: 2,
    height: 14,
    backgroundColor: Colors.textMuted,
    opacity: 0.4,
  },
  emergencyScaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  emergencyScale: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  emergencyCaption: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  retirementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 16,
  },
  retirementStat: {
    flex: 1,
    minWidth: '45%',
  },
  retirementStatLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  retirementStatValue: {
    fontSize: 17,
    fontWeight: '800' as const,
    color: Colors.primary,
    letterSpacing: -0.2,
  },
  chartContainer: {
    marginBottom: 16,
  },
  chartPlot: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'relative',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 4,
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: '100%',
  },
  chartLine: {
    position: 'absolute',
    left: 4,
    right: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  chartLabel: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  gapBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.warningLight,
    borderRadius: 10,
    padding: 12,
  },
  gapText: {
    flex: 1,
    fontSize: 13,
    color: Colors.warning,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
  simCaption: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 14,
    lineHeight: 18,
  },
  simInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  simInputWrap: {
    flex: 1,
  },
  simInputLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.3,
  },
  simInput: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600' as const,
  },
  simResultRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    flexWrap: 'wrap',
  },
  simResultLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  simResultValue: {
    fontSize: 22,
    fontWeight: '800' as const,
  },
  simDelta: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  dimeComponents: {
    gap: 10,
  },
  dimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dimeCompLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  dimeCompValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  dimeDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 4,
  },
  dimeTotalLabel: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  dimeTotalValue: {
    fontSize: 17,
    fontWeight: '800' as const,
    color: Colors.primary,
  },
  roomRow: {
    marginBottom: 14,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  roomName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  roomUsed: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  roomTrack: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  roomFill: {
    height: '100%',
    borderRadius: 4,
  },
  roomFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomCaption: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  roomAnnual: {
    fontSize: 12,
    color: Colors.info,
    fontWeight: '600' as const,
  },
  wealthRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  wealthCol: {
    flex: 1,
  },
  wealthDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 14,
  },
  wealthLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  wealthValue: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  wealthStatusPill: {
    borderRadius: 10,
    padding: 12,
  },
  wealthStatusText: {
    fontSize: 13,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
  recsContainer: {
    gap: 10,
  },
  recRow: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  recHeader: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  recIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recBody: {
    flex: 1,
  },
  recTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  recDetail: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  recFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  recPillText: {
    fontSize: 11,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.4,
  },
  recAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recActionText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
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
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 12,
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
