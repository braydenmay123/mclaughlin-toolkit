import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTFSAStore } from "@/store/tfsaStore";
import Colors from "@/constants/colors";
import { formatCurrency } from "@/utils/calculations";
import { AlertTriangle, Calendar, Info, DollarSign, Download } from "lucide-react-native";
import ToolkitHeader from "@/components/ToolkitHeader";
import { downloadPDF, EmailData, getStoredAnalytics } from "@/utils/emailService";

export default function TFSAResultsScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<{name: string, email: string} | null>(null);
  const {
    birthYear,
    canadianResidentSince,
    currentTFSARoom,
    pastContributions,
    pastWithdrawals,
    contributionRoom,
    hasOvercontributed,
    overcontributionAmount,
    calculateContributionRoom,
  } = useTFSAStore();

  // Recalculate results when the screen is loaded
  useEffect(() => {
    calculateContributionRoom();
    loadUserInfo();
  }, []);

  // Load user info from recent analytics
  const loadUserInfo = async () => {
    try {
      const analytics = await getStoredAnalytics();
      const recentTFSAUser = analytics
        .filter(entry => entry.calculatorType === 'TFSA Contribution Calculator')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      
      if (recentTFSAUser) {
        setUserInfo(recentTFSAUser.userInfo);
      }
    } catch (error) {
      console.error('Failed to load user info:', error);
    }
  };

  // Handle back to calculator
  const handleBackToCalculator = () => {
    router.push("/(app)/tfsa");
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
      calculatorType: "TFSA Contribution Calculator",
      results: {
        birthYear,
        canadianResidentSince,
        currentTFSARoom,
        contributionRoom,
        totalContributions,
        totalWithdrawals,
        hasOvercontributed,
        overcontributionAmount,
        nextYearRoom
      },
      timestamp: new Date().toISOString()
    };

    await downloadPDF(pdfData);
  };

  // Calculate total contributions and withdrawals
  const totalContributions = pastContributions.reduce((sum, record) => sum + record.amount, 0);
  const totalWithdrawals = pastWithdrawals.reduce((sum, record) => sum + record.amount, 0);

  // Get current year
  const currentYear = new Date().getFullYear();

  // Calculate next year's contribution room
  const nextYearWithdrawals = pastWithdrawals
    .filter(record => record.year === currentYear)
    .reduce((sum, record) => sum + record.amount, 0);
  
  const nextYearRoom = contributionRoom + 7000 + nextYearWithdrawals; // Assuming $7,000 for next year

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ToolkitHeader />
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Your TFSA Contribution Room</Text>
          <Text style={styles.subtitle}>
            Based on your birth year and contribution history
          </Text>
        </View>
        
        {hasOvercontributed && (
          <View style={styles.overcontributionAlert}>
            <AlertTriangle size={20} color="white" style={styles.alertIcon} />
            <Text style={styles.alertText}>
              Warning: You have overcontributed by {formatCurrency(overcontributionAmount)}. 
              This may result in a 1% per month penalty on the excess amount.
            </Text>
          </View>
        )}
        
        <View style={styles.resultsContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>Contribution Room Summary</Text>
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Birth Year:</Text>
              <Text style={styles.summaryValue}>{birthYear}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Canadian Resident Since:</Text>
              <Text style={styles.summaryValue}>{canadianResidentSince}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Contributions:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalContributions)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Withdrawals:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalWithdrawals)}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.currentRoomContainer}>
              <Text style={styles.currentRoomLabel}>Current Available Room:</Text>
              <Text style={[
                styles.currentRoomValue,
                { color: hasOvercontributed ? Colors.error : Colors.navy }
              ]}>
                {formatCurrency(contributionRoom)}
              </Text>
            </View>
            
            <View style={styles.nextYearContainer}>
              <Text style={styles.nextYearLabel}>Estimated {currentYear + 1} Room:</Text>
              <Text style={styles.nextYearValue}>
                {formatCurrency(nextYearRoom)}
              </Text>
              <Text style={styles.nextYearNote}>
                (Includes new annual room and {currentYear} withdrawals)
              </Text>
            </View>
          </View>
          
          {pastContributions.length > 0 && (
            <View style={styles.historyCard}>
              <Text style={styles.cardTitle}>Contribution History</Text>
              <View style={styles.divider} />
              
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Year</Text>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Amount</Text>
              </View>
              
              {pastContributions.map((contribution, index) => (
                <View key={`contribution-${index}`} style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                ]}>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{contribution.year}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{formatCurrency(contribution.amount)}</Text>
                </View>
              ))}
            </View>
          )}
          
          {pastWithdrawals.length > 0 && (
            <View style={styles.historyCard}>
              <Text style={styles.cardTitle}>Withdrawal History</Text>
              <View style={styles.divider} />
              
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Year</Text>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Amount</Text>
              </View>
              
              {pastWithdrawals.map((withdrawal, index) => (
                <View key={`withdrawal-${index}`} style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                ]}>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{withdrawal.year}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{formatCurrency(withdrawal.amount)}</Text>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.tipsCard}>
            <Text style={styles.cardTitle}>TFSA Tips</Text>
            <View style={styles.divider} />
            
            <View style={styles.tipItem}>
              <Calendar size={20} color={Colors.navy} style={styles.tipIcon} />
              <Text style={styles.tipText}>
                Withdrawals are added back to your contribution room on January 1 of the following year.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <AlertTriangle size={20} color={Colors.navy} style={styles.tipIcon} />
              <Text style={styles.tipText}>
                Overcontributions are subject to a 1% per month penalty until the excess amount is withdrawn.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Info size={20} color={Colors.navy} style={styles.tipIcon} />
              <Text style={styles.tipText}>
                Consider using your TFSA for investments with higher growth potential to maximize tax-free returns.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <DollarSign size={20} color={Colors.navy} style={styles.tipIcon} />
              <Text style={styles.tipText}>
                Use our Investment Calculator to see how your TFSA investments could grow over time.
              </Text>
            </View>
          </View>
          
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToCalculator}
            >
              <Text style={styles.backButtonText}>Back to Calculator</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.investmentButton}
              onPress={() => router.push("/(app)/investment")}
            >
              <Text style={styles.investmentButtonText}>Investment Calculator</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.advisorButton}
              onPress={() => router.push("/(app)/advisor")}
            >
              <Text style={styles.advisorButtonText}>Talk with Joe</Text>
            </TouchableOpacity>
            
            {userInfo && (
              <TouchableOpacity
                style={styles.pdfButton}
                onPress={handleDownloadPDF}
                activeOpacity={0.8}
              >
                <Download size={18} color="white" style={styles.buttonIcon} />
                <Text style={styles.pdfButtonText}>Save Your Results</Text>
              </TouchableOpacity>
            )}
          </View>
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
  overcontributionAlert: {
    backgroundColor: Colors.error,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  alertIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  alertText: {
    flex: 1,
    color: "white",
    fontSize: 14,
    lineHeight: 20,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 8,
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
  currentRoomContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  currentRoomLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 4,
  },
  currentRoomValue: {
    fontSize: 24,
    fontWeight: "700",
    // Color is applied conditionally in the component
  },
  nextYearContainer: {
    backgroundColor: Colors.navyLight,
    padding: 12,
    borderRadius: 8,
  },
  nextYearLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 4,
  },
  nextYearValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.navy,
    marginBottom: 4,
  },
  nextYearNote: {
    fontSize: 12,
    color: Colors.secondary,
    fontStyle: "italic",
  },
  historyCard: {
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
  tipsCard: {
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
  tipItem: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
  },
  actionButtonsContainer: {
    marginTop: 16,
  },
  backButton: {
    backgroundColor: Colors.lightGray,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backButtonText: {
    color: Colors.navy,
    fontSize: 16,
    fontWeight: "600",
  },
  investmentButton: {
    backgroundColor: Colors.background,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.navy,
  },
  investmentButtonText: {
    color: Colors.navy,
    fontSize: 16,
    fontWeight: "600",
  },
  advisorButton: {
    backgroundColor: Colors.navy,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  advisorButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  pdfButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  pdfButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
});