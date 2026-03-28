import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { useLargePurchaseStore } from '@/store/largePurchaseStore';
import { ShoppingCart, ArrowLeft, Download, Share2, Trophy, TrendingUp, Clock, DollarSign, Info, CheckCircle, XCircle, AlertTriangle } from 'lucide-react-native';
import { downloadPDF, EmailData, getStoredAnalytics } from '@/utils/emailService';

export default function LargePurchaseResultsScreen() {
  const { calculation, resetCalculation, purchaseAmount, downPayment, loanRate, loanTerm, expectedReturn, monthlySavings, inflationRate } = useLargePurchaseStore();
  const [userInfo, setUserInfo] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  // Load user info from recent analytics
  const loadUserInfo = async () => {
    try {
      const analytics = await getStoredAnalytics();
      const recentUser = analytics
        .filter(entry => entry.calculatorType === 'Large Purchase Calculator')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      
      if (recentUser) {
        setUserInfo(recentUser.userInfo);
      }
    } catch (error) {
      console.error('Failed to load user info:', error);
    }
  };

  if (!calculation) {
    return (
      <View style={styles.container}>
        <View style={styles.noResults}>
          <ShoppingCart size={48} color="#ccc" />
          <Text style={styles.noResultsText}>No calculation results available</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color="#04233a" />
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleShare = () => {
    Alert.alert('Share Results', 'Share functionality would be implemented here');
  };

  const handleDownload = async () => {
    if (!userInfo) {
      Alert.alert('No User Info', 'User information is required for PDF generation.');
      return;
    }

    const pdfData: EmailData = {
      name: userInfo.name,
      email: userInfo.email,
      calculatorType: "Large Purchase Calculator",
      results: {
        purchaseAmount,
        downPayment,
        loanRate: loanRate * 100,
        loanTerm,
        expectedReturn: expectedReturn * 100,
        monthlySavings,
        inflationRate: inflationRate * 100,
        bestScenario: calculation?.bestScenario,
        lumpSumNetCost: calculation?.scenarios.lumpSum.netCost,
        lumpSumNetWorthImpact: calculation?.scenarios.lumpSum.netWorthImpact,
        financeNetCost: calculation?.scenarios.finance.netCost,
        financeNetWorthImpact: calculation?.scenarios.finance.netWorthImpact,
        saveFirstNetCost: calculation?.scenarios.saveFirst.netCost,
        saveFirstNetWorthImpact: calculation?.scenarios.saveFirst.netWorthImpact
      },
      timestamp: new Date().toISOString()
    };

    await downloadPDF(pdfData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const formatTime = (years: number) => {
    if (years < 1) {
      return `${Math.round(years * 12)} months`;
    }
    return `${years.toFixed(1)} years`;
  };

  const getScenarioIcon = (scenarioName: string) => {
    switch (scenarioName) {
      case 'Pay Lump Sum Now':
        return <DollarSign size={24} color="#04233a" />;
      case 'Finance + Invest':
        return <TrendingUp size={24} color="#04233a" />;
      case 'Save First, Buy Later':
        return <Clock size={24} color="#04233a" />;
      default:
        return <ShoppingCart size={24} color="#04233a" />;
    }
  };

  const getScenarioDescription = (scenarioName: string) => {
    switch (scenarioName) {
      case 'Pay Lump Sum Now':
        return 'Use available cash to purchase immediately. Simple and straightforward with no debt.';
      case 'Finance + Invest':
        return 'Finance the purchase and invest the remaining cash. Potential for higher returns but involves debt risk.';
      case 'Save First, Buy Later':
        return 'Save money over time before making the purchase. Avoids debt but delays ownership and faces inflation.';
      default:
        return '';
    }
  };

  const getScenarioPros = (scenarioName: string) => {
    switch (scenarioName) {
      case 'Pay Lump Sum Now':
        return ['No debt or interest payments', 'Immediate ownership', 'Simple and stress-free', 'No credit requirements'];
      case 'Finance + Invest':
        return ['Potential for higher returns', 'Preserve cash liquidity', 'Leverage other people\'s money', 'Tax-deductible interest (if applicable)'];
      case 'Save First, Buy Later':
        return ['No debt burden', 'Disciplined saving approach', 'No interest payments', 'Flexibility to change mind'];
      default:
        return [];
    }
  };

  const getScenarioCons = (scenarioName: string) => {
    switch (scenarioName) {
      case 'Pay Lump Sum Now':
        return ['Large upfront cash outlay', 'Missed investment opportunities', 'Reduced liquidity', 'Opportunity cost of capital'];
      case 'Finance + Invest':
        return ['Interest payments required', 'Investment risk', 'Debt obligation', 'Market volatility exposure'];
      case 'Save First, Buy Later':
        return ['Inflation increases cost', 'Delayed gratification', 'Price appreciation risk', 'Opportunity cost of waiting'];
      default:
        return [];
    }
  };

  const getBestScenarioColor = (scenarioName: string) => {
    return scenarioName === calculation.bestScenario ? '#e8f5e8' : '#fff';
  };

  const scenarios = [
    calculation.scenarios.lumpSum,
    calculation.scenarios.finance,
    calculation.scenarios.saveFirst
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Purchase Scenario Comparison</Text>
        <Text style={styles.subtitle}>
          Analyzing your best financial strategy
        </Text>
      </View>

      <View style={styles.bestScenarioCard}>
        <View style={styles.bestScenarioHeader}>
          <Trophy size={24} color="#fff" />
          <Text style={styles.bestScenarioTitle}>Recommended Strategy</Text>
        </View>
        <Text style={styles.bestScenarioName}>{calculation.bestScenario}</Text>
        <Text style={styles.bestScenarioDescription}>
          {getScenarioDescription(calculation.bestScenario)}
        </Text>
        <View style={styles.bestScenarioMetric}>
          <Text style={styles.bestScenarioMetricLabel}>Net Worth Impact:</Text>
          <Text style={styles.bestScenarioMetricValue}>
            {formatCurrency(scenarios.find(s => s.name === calculation.bestScenario)?.netWorthImpact || 0)}
          </Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Info size={20} color="#04233a" />
          <Text style={styles.summaryTitle}>Purchase Summary</Text>
        </View>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Purchase Amount</Text>
            <Text style={styles.summaryValue}>{formatCurrency(purchaseAmount)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Down Payment</Text>
            <Text style={styles.summaryValue}>{formatCurrency(downPayment)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Loan Rate</Text>
            <Text style={styles.summaryValue}>{(loanRate * 100).toFixed(2)}%</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Expected Return</Text>
            <Text style={styles.summaryValue}>{(expectedReturn * 100).toFixed(2)}%</Text>
          </View>
        </View>
      </View>

      {scenarios.map((scenario, index) => (
        <View 
          key={index} 
          style={[
            styles.scenarioCard,
            { backgroundColor: getBestScenarioColor(scenario.name) }
          ]}
        >
          <View style={styles.scenarioHeader}>
            {getScenarioIcon(scenario.name)}
            <Text style={styles.scenarioTitle}>{scenario.name}</Text>
            {scenario.name === calculation.bestScenario && (
              <View style={styles.bestBadge}>
                <Text style={styles.bestBadgeText}>BEST</Text>
              </View>
            )}
          </View>

          <Text style={styles.scenarioDescription}>
            {getScenarioDescription(scenario.name)}
          </Text>

          <View style={styles.scenarioDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Cost:</Text>
              <Text style={styles.detailValue}>{formatCurrency(scenario.netCost)}</Text>
            </View>

            {scenario.monthlyPayment && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Monthly Payment:</Text>
                <Text style={styles.detailValue}>{formatCurrency(scenario.monthlyPayment)}</Text>
              </View>
            )}

            {scenario.totalPayments && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Loan Payments:</Text>
                <Text style={styles.detailValue}>{formatCurrency(scenario.totalPayments)}</Text>
              </View>
            )}

            {scenario.investmentGrowth && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Investment Growth:</Text>
                <Text style={[styles.detailValue, { color: '#22c55e' }]}>
                  +{formatCurrency(scenario.investmentGrowth)}
                </Text>
              </View>
            )}

            {scenario.timeToSave && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time to Save:</Text>
                <Text style={styles.detailValue}>{formatTime(scenario.timeToSave)}</Text>
              </View>
            )}

            <View style={[styles.detailRow, styles.netWorthRow]}>
              <Text style={styles.netWorthLabel}>Net Worth Impact:</Text>
              <Text style={[
                styles.netWorthValue,
                { color: scenario.netWorthImpact >= 0 ? '#22c55e' : '#ef4444' }
              ]}>
                {scenario.netWorthImpact >= 0 ? '+' : ''}{formatCurrency(scenario.netWorthImpact)}
              </Text>
            </View>
          </View>

          <View style={styles.prosConsContainer}>
            <View style={styles.prosContainer}>
              <View style={styles.prosHeader}>
                <CheckCircle size={16} color="#22c55e" />
                <Text style={styles.prosTitle}>Advantages</Text>
              </View>
              {getScenarioPros(scenario.name).map((pro, idx) => (
                <Text key={idx} style={styles.proConItem}>• {pro}</Text>
              ))}
            </View>
            
            <View style={styles.consContainer}>
              <View style={styles.consHeader}>
                <XCircle size={16} color="#ef4444" />
                <Text style={styles.consTitle}>Considerations</Text>
              </View>
              {getScenarioCons(scenario.name).map((con, idx) => (
                <Text key={idx} style={styles.proConItem}>• {con}</Text>
              ))}
            </View>
          </View>
        </View>
      ))}

      <View style={styles.analysisSection}>
        <View style={styles.analysisHeader}>
          <AlertTriangle size={20} color="#04233a" />
          <Text style={styles.analysisTitle}>Financial Analysis</Text>
        </View>
        
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Understanding the Numbers</Text>
          <Text style={styles.insightDescription}>
            The &ldquo;Net Worth Impact&rdquo; shows how each strategy affects your overall financial position over {loanTerm} years. These calculations assume you have {formatCurrency(purchaseAmount)} available and are deciding the optimal way to use it.
          </Text>
          <View style={styles.explanationList}>
            <Text style={styles.explanationItem}>
              • <Text style={styles.bold}>Pay Lump Sum Now ({formatCurrency(calculation.scenarios.lumpSum.netWorthImpact)}):</Text> This represents the missed investment opportunity. By using {formatCurrency(purchaseAmount)} for the purchase instead of investing it at {(expectedReturn * 100).toFixed(1)}% for {loanTerm} years, you miss out on {formatCurrency(Math.abs(calculation.scenarios.lumpSum.netWorthImpact))} in potential growth.
            </Text>
            <Text style={styles.explanationItem}>
              • <Text style={styles.bold}>Finance + Invest ({formatCurrency(calculation.scenarios.finance.netWorthImpact)}):</Text> By financing the purchase and investing {formatCurrency(purchaseAmount - downPayment)} (after paying {formatCurrency(downPayment)} down payment), you earn {formatCurrency(calculation.scenarios.finance.investmentGrowth || 0)} in investment growth but pay {formatCurrency(calculation.scenarios.finance.totalPayments || 0)} in total loan payments, resulting in a net benefit of {formatCurrency(calculation.scenarios.finance.netWorthImpact)}.
            </Text>
            <Text style={styles.explanationItem}>
              • <Text style={styles.bold}>Save First ({formatCurrency(calculation.scenarios.saveFirst.netWorthImpact)}):</Text> Waiting to save means the purchase price increases due to inflation, costing you an extra {formatCurrency(Math.abs(calculation.scenarios.saveFirst.netWorthImpact))} over {calculation.scenarios.saveFirst.timeToSave?.toFixed(1)} years.
            </Text>
          </View>
        </View>

        {calculation.breakEvenRate && (
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Break-Even Analysis</Text>
            <Text style={styles.insightText}>
              Break-even investment return: {(calculation.breakEvenRate * 100).toFixed(2)}%
            </Text>
            <Text style={styles.insightDescription}>
              This is the minimum return rate needed to make &ldquo;Finance + Invest&rdquo; more profitable than paying cash. 
              Your expected return is {(expectedReturn * 100).toFixed(2)}%, which is {expectedReturn > calculation.breakEvenRate ? 'above' : 'below'} the break-even point.
            </Text>
          </View>
        )}

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Key Considerations</Text>
          <View style={styles.considerationsList}>
            <Text style={styles.considerationItem}>• <Text style={styles.bold}>Market Risk:</Text> Investment returns are not guaranteed and can be volatile</Text>
            <Text style={styles.considerationItem}>• <Text style={styles.bold}>Interest Rate Risk:</Text> Variable loan rates may increase over time</Text>
            <Text style={styles.considerationItem}>• <Text style={styles.bold}>Liquidity:</Text> Maintain adequate emergency funds regardless of strategy</Text>
            <Text style={styles.considerationItem}>• <Text style={styles.bold}>Tax Efficiency:</Text> Consider tax implications of investment gains vs. loan interest</Text>
            <Text style={styles.considerationItem}>• <Text style={styles.bold}>Credit Impact:</Text> Financing affects your debt-to-income ratio and credit utilization</Text>
            <Text style={styles.considerationItem}>• <Text style={styles.bold}>Opportunity Cost:</Text> Consider what else you could do with the money</Text>
          </View>
        </View>
        
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Strategic Considerations</Text>
          <Text style={styles.insightDescription}>
            <Text style={styles.bold}>Risk vs. Reward:</Text> With your {(expectedReturn * 100).toFixed(1)}% expected return vs {(loanRate * 100).toFixed(1)}% loan rate, financing can be profitable, but investment returns aren't guaranteed while loan payments are fixed obligations.
          </Text>
          <Text style={styles.insightDescription}>
            <Text style={styles.bold}>Liquidity:</Text> Financing preserves your cash for emergencies or other opportunities, while paying cash reduces your liquid assets.
          </Text>
          <Text style={styles.insightDescription}>
            <Text style={styles.bold}>Peace of Mind:</Text> Paying cash eliminates debt and interest payments, providing psychological benefits that may outweigh the financial optimization.
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
          testID="share-button"
        >
          <Share2 size={20} color="#04233a" />
          <Text style={styles.actionButtonText}>Share Results</Text>
        </TouchableOpacity>
        
        {userInfo && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownload}
            testID="download-button"
          >
            <Download size={20} color="#04233a" />
            <Text style={styles.actionButtonText}>Save Your Results</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.newCalculationButton}
        onPress={() => {
          resetCalculation();
          router.push('/large-purchase');
        }}
        testID="new-calculation-button"
      >
        <ShoppingCart size={20} color="#fff" />
        <Text style={styles.newCalculationButtonText}>New Calculation</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#04233a',
    marginLeft: 8,
    fontWeight: '600' as const,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#04233a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  bestScenarioCard: {
    backgroundColor: '#04233a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bestScenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bestScenarioTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginLeft: 10,
  },
  bestScenarioMetric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  bestScenarioMetricLabel: {
    fontSize: 16,
    color: '#e0e0e0',
    fontWeight: '600' as const,
  },
  bestScenarioMetricValue: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#04233a',
    marginLeft: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#04233a',
  },
  bestScenarioName: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginBottom: 8,
  },
  bestScenarioDescription: {
    fontSize: 14,
    color: '#e0e0e0',
    fontStyle: 'italic' as const,
  },
  scenarioCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  scenarioTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#04233a',
    marginLeft: 10,
    flex: 1,
  },
  scenarioDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic' as const,
    lineHeight: 20,
  },
  bestBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestBadgeText: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  scenarioDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#04233a',
  },
  netWorthRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    paddingTop: 12,
  },
  netWorthLabel: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#04233a',
  },
  netWorthValue: {
    fontSize: 20,
    fontWeight: 'bold' as const,
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#04233a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#04233a',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#04233a',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  prosConsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 15,
  },
  prosContainer: {
    flex: 1,
    backgroundColor: '#f8fdf8',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#22c55e',
  },
  consContainer: {
    flex: 1,
    backgroundColor: '#fef8f8',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
  },
  prosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  consHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  prosTitle: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: '#22c55e',
    marginLeft: 6,
  },
  consTitle: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: '#ef4444',
    marginLeft: 6,
  },
  proConItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 16,
  },
  analysisSection: {
    marginBottom: 20,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#04233a',
    marginLeft: 8,
  },
  considerationsList: {
    marginTop: 8,
  },
  considerationItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },
  explanationList: {
    marginTop: 8,
  },
  explanationItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold' as const,
    color: '#04233a',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#04233a',
    marginLeft: 8,
    fontWeight: '600' as const,
  },
  newCalculationButton: {
    backgroundColor: '#04233a',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newCalculationButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
});