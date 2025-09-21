import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useInvestmentStore } from "@/store/investmentStore";
import Colors from "@/constants/colors";
import { formatCurrency } from "@/utils/calculations";
import { TrendingUp, DollarSign, Calendar, Download } from "lucide-react-native";
import ToolkitHeader from "@/components/ToolkitHeader";
import { downloadPDF, EmailData, getStoredAnalytics } from "@/utils/emailService";

export default function InvestmentResultsScreen() {
  const router = useRouter();
  const {
    initialInvestment,
    monthlyContribution,
    yearsToInvest,
    riskProfile,
    projectedValue,
    yearlyProjections,
  } = useInvestmentStore();
  
  const [selectedTab, setSelectedTab] = useState<'summary' | 'projections'>('summary');
  const [userInfo, setUserInfo] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  // Load user info from recent analytics
  const loadUserInfo = async () => {
    try {
      const analytics = await getStoredAnalytics();
      const recentUser = analytics
        .filter(entry => entry.calculatorType === 'Investment Growth Calculator')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      
      if (recentUser) {
        setUserInfo(recentUser.userInfo);
      }
    } catch (error) {
      console.error('Failed to load user info:', error);
    }
  };



  // Handle back to calculator
  const handleBackToCalculator = () => {
    router.push("/(app)/investment");
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!userInfo) {
      console.log('No user info available for PDF generation');
      return;
    }

    const pdfData: EmailData = {
      name: userInfo.name,
      email: userInfo.email,
      calculatorType: "Investment Growth Calculator",
      results: {
        initialInvestment,
        monthlyContribution,
        yearsToInvest,
        riskProfile,
        projectedValue,
        totalContributions: initialInvestment + (monthlyContribution * 12 * yearsToInvest),
        totalGrowth: projectedValue - (initialInvestment + (monthlyContribution * 12 * yearsToInvest)),
        annualReturnRate: getReturnRate()
      },
      timestamp: new Date().toISOString()
    };

    await downloadPDF(pdfData);
  };

  // Get return rate based on risk profile
  const getReturnRate = () => {
    switch (riskProfile) {
      case "conservative":
        return "2.5%";
      case "balanced":
        return "5%";
      case "growth":
        return "7.5%";
      default:
        return "5%";
    }
  };



  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ToolkitHeader />
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Your Investment Projections</Text>
          <Text style={styles.subtitle}>
            Based on {formatCurrency(initialInvestment)} initial investment and {formatCurrency(monthlyContribution)} monthly contributions
          </Text>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, selectedTab === 'summary' && styles.activeTabButton]}
            onPress={() => setSelectedTab('summary')}
          >
            <Text style={[styles.tabButtonText, selectedTab === 'summary' && styles.activeTabButtonText]}>
              Summary
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, selectedTab === 'projections' && styles.activeTabButton]}
            onPress={() => setSelectedTab('projections')}
          >
            <Text style={[styles.tabButtonText, selectedTab === 'projections' && styles.activeTabButtonText]}>
              Projections
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.resultsContainer}>
          {selectedTab === 'summary' && (
            <>
              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Text style={styles.summaryTitle}>Investment Summary</Text>
                  <View style={styles.riskBadge}>
                    <Text style={styles.riskBadgeText}>{riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)} ({getReturnRate()})</Text>
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Initial Investment:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(initialInvestment)}</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Monthly Contribution:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(monthlyContribution)}</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Investment Period:</Text>
                  <Text style={styles.summaryValue}>{yearsToInvest} years</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Contributions:</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(initialInvestment + (monthlyContribution * 12 * yearsToInvest))}
                  </Text>
                </View>
              </View>
              
              <View style={styles.projectionCard}>
                <Text style={styles.cardTitle}>Projected Growth</Text>
                <View style={styles.divider} />
                
                <View style={styles.projectionRow}>
                  <View style={styles.projectionItem}>
                    <View style={styles.projectionIconContainer}>
                      <TrendingUp size={24} color={Colors.navy} />
                    </View>
                    <Text style={styles.projectionValue}>{formatCurrency(projectedValue)}</Text>
                    <Text style={styles.projectionLabel}>Investment Value</Text>
                    <Text style={styles.projectionSubLabel}>after {yearsToInvest} years</Text>
                  </View>
                  
                  <View style={styles.projectionItem}>
                    <View style={styles.projectionIconContainer}>
                      <DollarSign size={24} color={Colors.navy} />
                    </View>
                    <Text style={styles.projectionValue}>{formatCurrency(projectedValue - (initialInvestment + (monthlyContribution * 12 * yearsToInvest)))}</Text>
                    <Text style={styles.projectionLabel}>Investment Growth</Text>
                    <Text style={styles.projectionSubLabel}>total gains earned</Text>
                  </View>
                </View>
              </View>
            </>
          )}
          
          {selectedTab === 'projections' && (
            <View style={styles.yearlyProjectionsCard}>
              <Text style={styles.cardTitle}>Yearly Projections</Text>
              <View style={styles.divider} />
              
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>Year</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Value</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Contributions</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Total Invested</Text>
              </View>
              
              {yearlyProjections.map((projection, index) => (
                <View key={projection.year} style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                ]}>
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>{projection.year}</Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>{formatCurrency(projection.investmentValue)}</Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>{formatCurrency(projection.contributions)}</Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>{formatCurrency(projection.cumulativeContributions)}</Text>
                </View>
              ))}
              
              <View style={styles.projectionNote}>
                <Calendar size={16} color={Colors.navy} style={styles.noteIcon} />
                <Text style={styles.noteText}>
                  Projections assume consistent monthly contributions and {getReturnRate()} annual returns based on your {riskProfile} risk profile.
                </Text>
              </View>
            </View>
          )}
          

          
          {userInfo && (
            <TouchableOpacity 
              style={styles.pdfButton}
              onPress={handleDownloadPDF}
            >
              <Download size={18} color="white" style={styles.buttonIcon} />
              <Text style={styles.pdfButtonText}>Save Your Results</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.advisorButton}
            onPress={() => router.push("/(app)/advisor")}
          >
            <Text style={styles.advisorButtonText}>Schedule Investment Consultation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToCalculator}
          >
            <Text style={styles.backButtonText}>Back to Calculator</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.navy,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: Colors.lightGray,
  },
  activeTabButton: {
    backgroundColor: Colors.navy,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.secondary,
  },
  activeTabButtonText: {
    color: "white",
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  summaryCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.navy,
  },
  riskBadge: {
    backgroundColor: Colors.navyLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  riskBadgeText: {
    fontSize: 12,
    color: Colors.navy,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.secondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  projectionCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 8,
  },
  projectionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  projectionItem: {
    alignItems: "center",
  },
  projectionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.navyLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  projectionValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.navy,
    marginBottom: 4,
  },
  projectionLabel: {
    fontSize: 14,
    color: Colors.secondary,
  },
  projectionSubLabel: {
    fontSize: 12,
    color: Colors.secondary,
    fontStyle: "italic",
  },
  retirementProjection: {
    alignItems: "center",
    backgroundColor: Colors.navyLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  retirementIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  retirementValue: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.navy,
    marginBottom: 4,
  },
  retirementLabel: {
    fontSize: 14,
    color: Colors.navy,
    textAlign: "center",
  },
  comparisonContainer: {
    marginTop: 16,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 12,
  },
  comparisonBar: {
    flexDirection: "row",
    height: 40,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  tfsaBar: {
    backgroundColor: Colors.navy,
    justifyContent: "center",
    alignItems: "center",
  },
  taxableBar: {
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  barText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
  comparisonLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  tfsaLegendColor: {
    width: 12,
    height: 12,
    backgroundColor: Colors.navy,
    marginRight: 6,
  },
  taxableLegendColor: {
    width: 12,
    height: 12,
    backgroundColor: Colors.secondary,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: Colors.secondary,
  },
  yearlyProjectionsCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    backgroundColor: Colors.navyLight,
    borderRadius: 4,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.navy,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tableRowEven: {
    backgroundColor: Colors.background,
  },
  tableRowOdd: {
    backgroundColor: Colors.lightGray,
  },
  tableCell: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: "center",
  },
  projectionNote: {
    flexDirection: "row",
    backgroundColor: Colors.navyLight,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "flex-start",
  },
  noteIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: Colors.navy,
    lineHeight: 18,
  },
  advisoryCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  advisoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 8,
  },
  advisoryText: {
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  strategySection: {
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: Colors.navyLight,
    borderRadius: 8,
    padding: 12,
  },
  strategyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 8,
  },
  strategyText: {
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  strategyPoint: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  strategyBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.navy,
    marginTop: 7,
    marginRight: 8,
  },
  strategyPointText: {
    flex: 1,
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
  },
  strategyHighlight: {
    fontWeight: "600",
    color: Colors.navy,
  },
  recommendationContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 12,
  },
  recommendation: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  recommendationBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.navy,
    marginTop: 7,
    marginRight: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
  },
  pdfButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  pdfButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  advisorButton: {
    backgroundColor: Colors.backgroundGray,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  advisorButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: Colors.lightGray,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});