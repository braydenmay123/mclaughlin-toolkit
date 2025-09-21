import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Dimensions } from "react-native";
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
import { downloadPDF, EmailData } from "@/utils/emailService";
import { Download } from "lucide-react-native";

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isVerySmallScreen = screenWidth < 350;

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
    userInfo,
    calculateResults,
  } = useCalculatorStore();

  // State for modals
  const [financialBenefitsModalVisible, setFinancialBenefitsModalVisible] = useState(false);
  const [longTermImpactModalVisible, setLongTermImpactModalVisible] = useState(false);

  // Recalculate results when the screen is loaded
  useEffect(() => {
    calculateResults();
  }, [calculateResults]);

  // Handle back to calculator
  const handleBackToCalculator = () => {
    router.push("/(app)/calculator");
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
        biWeeklyUtilitiesAndTaxes,
        biWeeklyTotalCostOfOwnership,
        currentBiWeeklyRent,
        biWeeklyAffordabilityGap,
        monthlyInsurance,
        annualIncome,
        currentSavings,
        timeToReachDownPayment,
        practicePaymentAmount
      },
      timestamp: new Date().toISOString()
    };

    await downloadPDF(pdfData);
  };



  // Determine if the affordability gap is positive or negative
  const isAffordable = biWeeklyAffordabilityGap <= 0;

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
    paddingHorizontal: isVerySmallScreen ? 12 : 20,
    marginBottom: isVerySmallScreen ? 16 : 20,
  },
  title: {
    fontSize: isVerySmallScreen ? 20 : isSmallScreen ? 22 : 24,
    fontWeight: "700",
    color: Colors.navy,
    textAlign: "center",
    marginBottom: isVerySmallScreen ? 6 : 8,
  },
  subtitle: {
    fontSize: isVerySmallScreen ? 14 : isSmallScreen ? 15 : 16,
    color: Colors.secondary,
    textAlign: "center",
    lineHeight: isVerySmallScreen ? 20 : 22,
    paddingHorizontal: isVerySmallScreen ? 8 : 0,
  },
  resultsContainer: {
    paddingHorizontal: isVerySmallScreen ? 12 : 20,
    paddingBottom: 30,
  },
  affordabilityContainer: {
    padding: isVerySmallScreen ? 12 : 16,
    borderRadius: isVerySmallScreen ? 10 : 12,
    marginBottom: isVerySmallScreen ? 20 : 24,
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
    fontSize: isVerySmallScreen ? 16 : 18,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: isVerySmallScreen ? 6 : 8,
  },
  affordabilityDescription: {
    fontSize: isVerySmallScreen ? 13 : 14,
    color: Colors.secondary,
    lineHeight: isVerySmallScreen ? 18 : 20,
  },
  backButton: {
    backgroundColor: Colors.navy,
    paddingVertical: isVerySmallScreen ? 14 : 16,
    borderRadius: isVerySmallScreen ? 10 : 12,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: isVerySmallScreen ? 14 : 16,
    fontWeight: "600",
  },
  pdfButton: {
    backgroundColor: Colors.accent,
    paddingVertical: isVerySmallScreen ? 14 : 16,
    borderRadius: isVerySmallScreen ? 10 : 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: isVerySmallScreen ? 12 : 16,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  pdfButtonText: {
    color: "white",
    fontSize: isVerySmallScreen ? 14 : 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
});