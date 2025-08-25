import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCalculatorStore } from "@/store/calculatorStore";
import ResultsCard from "@/components/ResultsCard";
import Colors from "@/constants/colors";
import { formatCurrency } from "@/utils/calculations";
import AdvisorCTA from "@/components/AdvisorCTA";
import PracticeBeforeBuySection from "@/components/PracticeBeforeBuySection";
import DetailModal from "@/components/DetailModal";
import FinancialBenefitsDetail from "@/components/FinancialBenefitsDetail";
import LongTermImpactDetail from "@/components/LongTermImpactDetail";
import ToolkitHeader from "@/components/ToolkitHeader";
import { Download } from "lucide-react-native";
import { downloadPDF, EmailData, getStoredAnalytics } from "@/utils/emailService";

export default function ResultsScreen() {
  const router = useRouter();
  const {
    homePrice,
    downPaymentAmount,
    downPaymentPercent,
    biWeeklySavings3Years,
    biWeeklySavings5Years,
    mortgageAmount,
    biWeeklyMortgagePayment,
    annualMortgagePayment,
    biWeeklyUtilitiesAndTaxes,
    biWeeklyTotalCostOfOwnership,
    currentBiWeeklyRent,
    biWeeklyAffordabilityGap,
    monthlyInsurance,
    annualIncome,
    annualTaxSavings,
    retirementImpact,
    mortgagePreQualification,
    currentSavings,
    timeToReachDownPayment,
    practicePaymentAmount,
    calculateResults,
  } = useCalculatorStore();

  // State for modals and user info
  const [financialBenefitsModalVisible, setFinancialBenefitsModalVisible] = useState(false);
  const [longTermImpactModalVisible, setLongTermImpactModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<{name: string, email: string} | null>(null);

  // Recalculate results when the screen is loaded
  useEffect(() => {
    calculateResults();
    loadUserInfo();
  }, []);

  // Load user info from recent analytics
  const loadUserInfo = async () => {
    try {
      const analytics = await getStoredAnalytics();
      const recentUser = analytics
        .filter(entry => entry.calculatorType === 'Home Affordability Calculator')
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
    router.push("/(tabs)/");
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
      calculatorType: "Home Affordability Calculator",
      results: {
        homePrice,
        downPaymentAmount,
        downPaymentPercent,
        mortgageAmount,
        biWeeklyMortgagePayment,
        annualMortgagePayment,
        biWeeklyTotalCostOfOwnership: biWeeklyTotalCostOfOwnership + (monthlyInsurance / 2),
        currentBiWeeklyRent,
        biWeeklyAffordabilityGap,
        monthlyInsurance,
        annualIncome,
        annualTaxSavings,
        retirementImpact,
        mortgagePreQualification,
        currentSavings,
        timeToReachDownPayment,
        isAffordable: biWeeklyAffordabilityGap <= 0
      },
      timestamp: new Date().toISOString()
    };

    await downloadPDF(pdfData);
  };

  // Determine if the affordability gap is positive or negative
  const isAffordable = biWeeklyAffordabilityGap <= 0;

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ToolkitHeader />
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Your Home Buying Plan</Text>
          <Text style={styles.subtitle}>
            Based on a home price of {formatCurrency(homePrice)}
          </Text>
        </View>
        
        <View style={styles.resultsContainer}>
          <ResultsCard
            title="Down Payment Plan"
            items={[
              {
                label: `Down Payment Amount (${downPaymentPercent}%)`,
                value: downPaymentAmount,
                isHighlighted: true,
                isCurrency: true,
              },
              {
                label: "Current Savings",
                value: currentSavings,
                isCurrency: true,
              },
              {
                label: "Additional Savings Needed",
                value: Math.max(0, downPaymentAmount - currentSavings),
                isCurrency: true,
              },
              {
                label: "Bi-Weekly Savings (3 Years)",
                value: biWeeklySavings3Years,
                isCurrency: true,
              },
              {
                label: "Bi-Weekly Savings (5 Years)",
                value: biWeeklySavings5Years,
                isCurrency: true,
              },
              {
                label: "Estimated Time to Save",
                value: timeToReachDownPayment > 0 
                  ? `${Math.ceil(timeToReachDownPayment)} months` 
                  : "Ready now!",
              },
            ]}
          />
          
          <PracticeBeforeBuySection 
            practiceAmount={practicePaymentAmount}
            currentRent={currentBiWeeklyRent}
            totalHousingCost={biWeeklyTotalCostOfOwnership + (monthlyInsurance / 2)}
          />
          
          <ResultsCard
            title="Mortgage Details"
            items={[
              {
                label: "Mortgage Amount",
                value: mortgageAmount,
                isHighlighted: true,
                isCurrency: true,
              },
              {
                label: "Bi-Weekly Mortgage Payment",
                value: biWeeklyMortgagePayment,
                isCurrency: true,
              },
              {
                label: "Annual Mortgage Payment",
                value: annualMortgagePayment,
                isCurrency: true,
              },
              {
                label: "Monthly Insurance",
                value: monthlyInsurance,
                isCurrency: true,
              },
            ]}
          />
          
          <ResultsCard
            title="Cost of Ownership"
            items={[
              {
                label: "Bi-Weekly Mortgage Payment",
                value: biWeeklyMortgagePayment,
                isCurrency: true,
              },
              {
                label: "Bi-Weekly Utilities & Taxes",
                value: biWeeklyUtilitiesAndTaxes,
                isCurrency: true,
              },
              {
                label: "Bi-Weekly Insurance",
                value: monthlyInsurance / 2,
                isCurrency: true,
              },
              {
                label: "Total Bi-Weekly Cost",
                value: biWeeklyTotalCostOfOwnership + (monthlyInsurance / 2),
                isHighlighted: true,
                isCurrency: true,
              },
            ]}
          />
          
          <ResultsCard
            title="Affordability Analysis"
            items={[
              {
                label: "Current Bi-Weekly Rent",
                value: currentBiWeeklyRent,
                isCurrency: true,
              },
              {
                label: "Future Bi-Weekly Housing Cost",
                value: biWeeklyTotalCostOfOwnership + (monthlyInsurance / 2),
                isCurrency: true,
              },
              {
                label: "Bi-Weekly Difference",
                value: Math.abs(biWeeklyAffordabilityGap + (monthlyInsurance / 2)),
                isHighlighted: true,
                isCurrency: true,
              },
            ]}
          />
          
          {annualIncome > 0 && (
            <>
              <TouchableOpacity 
                onPress={() => setFinancialBenefitsModalVisible(true)}
                activeOpacity={0.7}
              >
                <ResultsCard
                  title="Financial Benefits"
                  showChevron={true}
                  items={[
                    {
                      label: "Annual Tax Savings (Est.)",
                      value: annualTaxSavings,
                      isHighlighted: true,
                      isCurrency: true,
                    },
                    {
                      label: "Monthly Tax Benefit",
                      value: annualTaxSavings / 12,
                      isCurrency: true,
                    },
                    {
                      label: "Mortgage Pre-Qualification",
                      value: mortgagePreQualification,
                      isCurrency: true,
                    },
                  ]}
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setLongTermImpactModalVisible(true)}
                activeOpacity={0.7}
              >
                <ResultsCard
                  title="Long-Term Financial Impact"
                  showChevron={true}
                  items={[
                    {
                      label: "5-Year Home Equity (Est.)",
                      value: (homePrice * 0.1) + (biWeeklyMortgagePayment * 26 * 5 * 0.3),
                      isCurrency: true,
                    },
                    {
                      label: "10-Year Home Equity (Est.)",
                      value: (homePrice * 0.2) + (biWeeklyMortgagePayment * 26 * 10 * 0.4),
                      isCurrency: true,
                    },
                    {
                      label: "Retirement Savings Impact",
                      value: retirementImpact,
                      isHighlighted: true,
                      isCurrency: true,
                    },
                  ]}
                />
              </TouchableOpacity>
            </>
          )}
          
          <View style={[
            styles.affordabilityContainer,
            isAffordable ? styles.affordableBackground : styles.notAffordableBackground
          ]}>
            <Text style={styles.affordabilityTitle}>
              {isAffordable
                ? "This home appears affordable!"
                : "Additional savings needed"}
            </Text>
            <Text style={styles.affordabilityDescription}>
              {isAffordable
                ? "Your current rent is higher than or equal to the estimated cost of owning this home."
                : `You would need to save an additional ${formatCurrency(biWeeklyAffordabilityGap + (monthlyInsurance / 2))} bi-weekly to afford this home.`}
            </Text>
          </View>
          
          <AdvisorCTA />
          
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
          
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToCalculator}
          >
            <Text style={styles.backButtonText}>Back to Calculator</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Financial Benefits Detail Modal */}
      <DetailModal
        visible={financialBenefitsModalVisible}
        onClose={() => setFinancialBenefitsModalVisible(false)}
        title="Financial Benefits of Homeownership"
      >
        <FinancialBenefitsDetail
          annualTaxSavings={annualTaxSavings}
          annualIncome={annualIncome}
          mortgagePreQualification={mortgagePreQualification}
          annualMortgagePayment={annualMortgagePayment}
        />
      </DetailModal>
      
      {/* Long-Term Impact Detail Modal */}
      <DetailModal
        visible={longTermImpactModalVisible}
        onClose={() => setLongTermImpactModalVisible(false)}
        title="Long-Term Financial Impact"
      >
        <LongTermImpactDetail
          homePrice={homePrice}
          biWeeklyMortgagePayment={biWeeklyMortgagePayment}
          retirementImpact={retirementImpact}
          downPaymentAmount={downPaymentAmount}
        />
      </DetailModal>
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
  resultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  affordabilityContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  affordableBackground: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.3)",
  },
  notAffordableBackground: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(244, 67, 54, 0.3)",
  },
  affordabilityTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 8,
  },
  affordabilityDescription: {
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: Colors.navy,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  pdfButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
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
    fontWeight: "600",
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
});