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
import { useTaxStore } from '@/store/taxStore';
import { Calculator, ArrowLeft, Download } from 'lucide-react-native';
import { downloadPDF, EmailData, getStoredAnalytics } from '@/utils/emailService';

export default function TaxResultsScreen() {
  const { calculation, taxableIncome, selectedProvince, otherDeductions, resetCalculation } = useTaxStore();
  const [userInfo, setUserInfo] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  // Load user info from recent analytics
  const loadUserInfo = async () => {
    try {
      const analytics = await getStoredAnalytics();
      const recentUser = analytics
        .filter(entry => entry.calculatorType === 'Income Tax Calculator')
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
          <Calculator size={48} color="#ccc" />
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



  const handleDownload = async () => {
    if (!userInfo || !calculation) {
      Alert.alert('No Data', 'User information and calculation results are required for PDF generation.');
      return;
    }

    const pdfData: EmailData = {
      name: userInfo.name,
      email: userInfo.email,
      calculatorType: "Income Tax Calculator",
      results: {
        taxableIncome,
        selectedProvince,
        otherDeductions,
        federalTax: calculation.federalTax,
        provincialTax: calculation.provincialTax,
        totalTax: calculation.totalTax,
        marginalRate: (calculation.marginalRate * 100).toFixed(2) + '%',
        averageRate: (calculation.averageRate * 100).toFixed(2) + '%',
        afterTaxIncome: taxableIncome - calculation.totalTax
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

  const formatPercentage = (rate: number) => {
    return `${(rate * 100).toFixed(2)}%`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Tax Calculation Results</Text>
        <Text style={styles.subtitle}>
          Based on {formatCurrency(taxableIncome)} taxable income
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Tax Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Federal Tax:</Text>
          <Text style={styles.summaryValue}>{formatCurrency(calculation.federalTax)}</Text>
        </View>
        

        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Federal Tax:</Text>
          <Text style={styles.totalValue}>{formatCurrency(calculation.totalTax)}</Text>
        </View>
      </View>

      <View style={styles.ratesCard}>
        <Text style={styles.cardTitle}>Tax Rates</Text>
        
        <View style={styles.rateItem}>
          <Text style={styles.rateLabel}>Marginal Tax Rate</Text>
          <Text style={styles.rateValue}>{formatPercentage(calculation.marginalRate)}</Text>
          <Text style={styles.rateDescription}>
            Rate applied to your next dollar of income
          </Text>
        </View>
        
        <View style={styles.rateItem}>
          <Text style={styles.rateLabel}>Average Tax Rate</Text>
          <Text style={styles.rateValue}>{formatPercentage(calculation.averageRate)}</Text>
          <Text style={styles.rateDescription}>
            Overall percentage of income paid in taxes
          </Text>
        </View>
      </View>

      <View style={styles.breakdownCard}>
        <Text style={styles.cardTitle}>Tax Breakdown by Bracket</Text>
        
        <Text style={styles.breakdownSubtitle}>Federal Tax Brackets</Text>
        {calculation.breakdown.federal.map((item, index) => (
          <View key={index} style={styles.bracketRow}>
            <Text style={styles.bracketLabel}>Bracket {item.bracket}</Text>
            <Text style={styles.bracketValue}>{formatCurrency(item.tax)}</Text>
          </View>
        ))}
        

      </View>

      {userInfo && calculation && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownload}
            testID="download-button"
          >
            <Download size={20} color="#fff" />
            <Text style={styles.downloadButtonText}>Download PDF</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.newCalculationButton}
        onPress={() => {
          resetCalculation();
          router.push('/tax-calculator');
        }}
        testID="new-calculation-button"
      >
        <Calculator size={20} color="#fff" />
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#04233a',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#333',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#04233a',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10,
    paddingTop: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#04233a',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#04233a',
  },
  ratesCard: {
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
  rateItem: {
    marginBottom: 20,
  },
  rateLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#04233a',
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#04233a',
    marginBottom: 4,
  },
  rateDescription: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic' as const,
  },
  breakdownCard: {
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
  breakdownSubtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#04233a',
    marginBottom: 10,
  },
  bracketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  bracketLabel: {
    fontSize: 14,
    color: '#666',
  },
  bracketValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#04233a',
  },
  actionButtons: {
    marginBottom: 20,
  },
  downloadButton: {
    backgroundColor: '#04233a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  downloadButtonText: {
    fontSize: 16,
    color: '#fff',
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