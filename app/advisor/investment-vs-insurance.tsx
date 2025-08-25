import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { DollarSign, Calendar, Percent, Calculator, AlertTriangle, Info, Download } from "lucide-react-native";
import ToolkitHeader from "@/components/ToolkitHeader";
import { formatCurrency } from "@/utils/calculations";
import { downloadPDF, EmailData } from "@/utils/emailService";

export default function InvestmentVsInsuranceScreen() {
  const router = useRouter();
  
  // Client information
  const [clientAge, setClientAge] = useState(60);
  const [clientGender, setClientGender] = useState("male");
  const [healthStatus, setHealthStatus] = useState("average");
  
  // Financial inputs
  const [lumpSumAvailable, setLumpSumAvailable] = useState(250000);
  const [annualPremium, setAnnualPremium] = useState(5000);
  const [deathBenefit, setDeathBenefit] = useState(500000);
  const [taxRate, setTaxRate] = useState(30);
  
  // Time horizon
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [yearsToProject, setYearsToProject] = useState(25);
  
  // Results
  const [hasCalculated, setHasCalculated] = useState(false);
  const [projectionResults, setProjectionResults] = useState<any[]>([]);
  const [totalPremiumsPaid, setTotalPremiumsPaid] = useState(0);
  const [finalInvestmentValue, setFinalInvestmentValue] = useState(0);
  const [breakEvenYear, setBreakEvenYear] = useState<number | null>(null);
  
  // User info for PDF generation
  const userInfo = { name: "Client", email: "client@example.com" };
  
  // Calculate projections
  const calculateProjections = () => {
    const results = [];
    let premiumsPaid = 0;
    let foundBreakEvenYear = null;
    
    // Initialize compounding investment scenarios
    let investment3Percent = lumpSumAvailable;
    let investment5Percent = lumpSumAvailable;
    let investment7Percent = lumpSumAvailable;
    let investment10Percent = lumpSumAvailable;
    
    for (let year = 1; year <= yearsToProject; year++) {
      // Calculate insurance metrics
      premiumsPaid += annualPremium;
      
      // Calculate total contributed so far
      const totalContributed = lumpSumAvailable + (annualPremium * year);
      
      // Calculate required COMPOUNDING ROI:
      // For compound growth with annual additions:
      // FV = PV * (1 + r)^n + PMT * [((1 + r)^n - 1) / r]
      // We need to solve for r where FV = deathBenefit
      // This requires iterative solving, so we'll use approximation
      
      // Simple approximation: what annual return is needed on initial lump sum + annual premiums
      // to reach death benefit after 'year' years with compounding
      
      // Calculate required compound annual growth rate
      // Using formula: r = (FV / PV)^(1/n) - 1
      // But accounting for annual additions, we use average invested amount
      const averageInvested = lumpSumAvailable + (annualPremium * year / 2);
      const requiredROI = averageInvested > 0 
        ? (Math.pow(deathBenefit / averageInvested, 1 / year) - 1) * 100
        : 0;
      
      // Apply compounding growth to each scenario
      // Add annual premium first, then apply growth
      investment3Percent = (investment3Percent + annualPremium) * 1.03;
      investment5Percent = (investment5Percent + annualPremium) * 1.05;
      investment7Percent = (investment7Percent + annualPremium) * 1.07;
      investment10Percent = (investment10Percent + annualPremium) * 1.10;
      
      // Check for break-even year (when investment at 7% matches death benefit)
      if (!foundBreakEvenYear && investment7Percent >= deathBenefit) {
        foundBreakEvenYear = year;
      }
      
      // Store results for this year
      results.push({
        year,
        age: clientAge + year - 1,
        investmentBalance: totalContributed,
        premiumsPaid,
        deathBenefit,
        requiredROI: Math.max(0, requiredROI),
        roi3Percent: investment3Percent,
        roi5Percent: investment5Percent,
        roi7Percent: investment7Percent,
        roi10Percent: investment10Percent,
        insuranceAdvantage: deathBenefit - totalContributed,
      });
    }
    
    setProjectionResults(results);
    setTotalPremiumsPaid(premiumsPaid);
    setFinalInvestmentValue(results[yearsToProject - 1]?.investmentBalance || 0);
    setBreakEvenYear(foundBreakEvenYear);
    setHasCalculated(true);
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    const pdfData: EmailData = {
      name: userInfo.name,
      email: userInfo.email,
      calculatorType: "Investment ROI vs Life Insurance",
      results: {
        clientAge,
        clientGender,
        healthStatus,
        lumpSumAvailable,
        annualPremium,
        deathBenefit,
        taxRate,
        lifeExpectancy,
        yearsToProject,
        totalPremiumsPaid,
        finalInvestmentValue,
        breakEvenYear,
        projectionResults
      },
      timestamp: new Date().toISOString()
    };

    await downloadPDF(pdfData);
  };

  const getRiskLevelData = () => [
    { level: "Conservative", description: "GICs, Bonds, Money Market", expectedReturn: "2-4%", color: "#4CAF50" },
    { level: "Moderate", description: "Balanced Funds, Mixed Portfolio", expectedReturn: "4-7%", color: "#FF9800" },
    { level: "Aggressive", description: "Growth Stocks, Equity Funds", expectedReturn: "7-12%", color: "#F44336" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ToolkitHeader />
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Investment ROI vs Life Insurance</Text>
          <Text style={styles.subtitle}>
            Compare what investment return is needed to match life insurance death benefits
          </Text>
        </View>
        
        <View style={styles.calculatorContainer}>
          <View style={styles.formContainer}>
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>Client Information</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Client Age</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={clientAge.toString()}
                  onChangeText={(text) => setClientAge(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="60"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    clientGender === "male" && styles.radioButtonSelected
                  ]}
                  onPress={() => setClientGender("male")}
                >
                  <Text style={[
                    styles.radioButtonText,
                    clientGender === "male" && styles.radioButtonTextSelected
                  ]}>Male</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    clientGender === "female" && styles.radioButtonSelected
                  ]}
                  onPress={() => setClientGender("female")}
                >
                  <Text style={[
                    styles.radioButtonText,
                    clientGender === "female" && styles.radioButtonTextSelected
                  ]}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Health Status</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    healthStatus === "excellent" && styles.radioButtonSelected
                  ]}
                  onPress={() => setHealthStatus("excellent")}
                >
                  <Text style={[
                    styles.radioButtonText,
                    healthStatus === "excellent" && styles.radioButtonTextSelected
                  ]}>Excellent</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    healthStatus === "average" && styles.radioButtonSelected
                  ]}
                  onPress={() => setHealthStatus("average")}
                >
                  <Text style={[
                    styles.radioButtonText,
                    healthStatus === "average" && styles.radioButtonTextSelected
                  ]}>Average</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    healthStatus === "below-average" && styles.radioButtonSelected
                  ]}
                  onPress={() => setHealthStatus("below-average")}
                >
                  <Text style={[
                    styles.radioButtonText,
                    healthStatus === "below-average" && styles.radioButtonTextSelected
                  ]}>Below Average</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>Financial Details</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Lump Sum Available for Investment</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={lumpSumAvailable.toString()}
                  onChangeText={(text) => setLumpSumAvailable(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="250,000"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Annual Insurance Premium</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={annualPremium.toString()}
                  onChangeText={(text) => setAnnualPremium(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="5,000"
                />
              </View>
              <Text style={styles.helperText}>
                This amount will be added to the investment annually instead of paying premiums
              </Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Insurance Death Benefit</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={deathBenefit.toString()}
                  onChangeText={(text) => setDeathBenefit(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="500,000"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Marginal Tax Rate (%)</Text>
              <View style={styles.inputContainer}>
                <Percent size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={taxRate.toString()}
                  onChangeText={(text) => setTaxRate(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="30"
                />
              </View>
            </View>
            
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>Time Horizon</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Life Expectancy</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={lifeExpectancy.toString()}
                  onChangeText={(text) => {
                    const age = Number(text.replace(/[^0-9]/g, ""));
                    setLifeExpectancy(age);
                    setYearsToProject(age - clientAge);
                  }}
                  keyboardType="numeric"
                  placeholder="85"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Years to Project</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={yearsToProject.toString()}
                  onChangeText={(text) => setYearsToProject(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="25"
                />
              </View>
              <Text style={styles.helperText}>
                Based on life expectancy of {lifeExpectancy} years
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.calculateButton}
              onPress={calculateProjections}
            >
              <Calculator size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.calculateButtonText}>Generate Projections</Text>
            </TouchableOpacity>
            
            {hasCalculated && (
              <View style={styles.resultsContainer}>
                <View style={styles.resultsSummary}>
                  <Text style={styles.resultsSummaryTitle}>Comparison Summary</Text>
                  
                  <View style={styles.comparisonContainer}>
                    <View style={styles.comparisonColumn}>
                      <View style={[styles.comparisonHeader, styles.insuranceHeader]}>
                        <Text style={styles.comparisonHeaderText}>Life Insurance</Text>
                      </View>
                      <Text style={styles.comparisonValue}>{formatCurrency(deathBenefit)}</Text>
                      <Text style={styles.comparisonDetail}>Death Benefit</Text>
                      <Text style={styles.comparisonSubValue}>{formatCurrency(totalPremiumsPaid)}</Text>
                      <Text style={styles.comparisonDetail}>Total Premiums</Text>
                    </View>
                    
                    <View style={styles.comparisonColumn}>
                      <View style={[styles.comparisonHeader, styles.investmentHeader]}>
                        <Text style={styles.comparisonHeaderText}>Investment Strategy</Text>
                      </View>
                      <Text style={styles.comparisonValue}>{formatCurrency(finalInvestmentValue)}</Text>
                      <Text style={styles.comparisonDetail}>Final Investment Value</Text>
                      <Text style={styles.comparisonSubValue}>
                        {breakEvenYear ? `Year ${breakEvenYear}` : "Never"}
                      </Text>
                      <Text style={styles.comparisonDetail}>Break-Even Year (7% ROI)</Text>
                    </View>
                  </View>
                  
                  <View style={styles.keyMetricsContainer}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Break-Even Year (7% ROI):</Text>
                      <Text style={styles.metricValue}>
                        {breakEvenYear ? `Year ${breakEvenYear}` : "Never breaks even"}
                      </Text>
                    </View>
                    
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Total Premiums vs Final Investment:</Text>
                      <Text style={styles.metricValue}>
                        {formatCurrency(totalPremiumsPaid)} vs {formatCurrency(finalInvestmentValue)}
                      </Text>
                    </View>
                    
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Insurance Advantage:</Text>
                      <Text style={[
                        styles.metricValue,
                        deathBenefit > finalInvestmentValue ? styles.positiveValue : styles.negativeValue
                      ]}>
                        {formatCurrency(deathBenefit - finalInvestmentValue)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.recommendationContainer}>
                    <Info size={20} color={Colors.navy} style={styles.recommendationIcon} />
                    <Text style={styles.recommendationText}>
                      {breakEvenYear && breakEvenYear <= 10 ? 
                        `Investment strategy breaks even with life insurance in year ${breakEvenYear} at 7% annual returns. Consider investment risk vs guaranteed insurance protection.` :
                        breakEvenYear && breakEvenYear > 10 ?
                        `Investment strategy takes ${breakEvenYear} years to match insurance death benefit at 7% returns. Life insurance provides immediate protection.` :
                        `Investment strategy never matches the insurance death benefit at 7% returns over ${yearsToProject} years. Life insurance provides superior protection for this scenario.`
                      }
                    </Text>
                  </View>
                </View>
                
                <View style={styles.tableContainer}>
                  <Text style={styles.tableTitle}>Year-by-Year Projection</Text>
                  
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, { flex: 0.4 }]}>Year</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.4 }]}>Age</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Total Invested</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Death Benefit</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Annual ROI Needed</Text>
                  </View>
                  
                  {projectionResults.map((result, index) => (
                    <View key={`result-${index}`} style={[
                      styles.tableRow,
                      index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                    ]}>
                      <Text style={[styles.tableCell, { flex: 0.4 }]}>{result.year}</Text>
                      <Text style={[styles.tableCell, { flex: 0.4 }]}>{result.age}</Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}>{formatCurrency(result.investmentBalance)}</Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}>{formatCurrency(result.deathBenefit)}</Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}>{result.requiredROI.toFixed(1)}%</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.scenarioContainer}>
                  <Text style={styles.scenarioTitle}>Investment Return Scenarios</Text>
                  <Text style={styles.scenarioSubtitle}>
                    Final investment value at different annual return rates:
                  </Text>
                  
                  <View style={styles.scenarioGrid}>
                    <View style={styles.scenarioItem}>
                      <Text style={styles.scenarioRate}>3% Annual Return</Text>
                      <Text style={styles.scenarioValue}>
                        {formatCurrency(projectionResults[projectionResults.length - 1]?.roi3Percent || 0)}
                      </Text>
                    </View>
                    
                    <View style={styles.scenarioItem}>
                      <Text style={styles.scenarioRate}>5% Annual Return</Text>
                      <Text style={styles.scenarioValue}>
                        {formatCurrency(projectionResults[projectionResults.length - 1]?.roi5Percent || 0)}
                      </Text>
                    </View>
                    
                    <View style={styles.scenarioItem}>
                      <Text style={styles.scenarioRate}>7% Annual Return</Text>
                      <Text style={styles.scenarioValue}>
                        {formatCurrency(projectionResults[projectionResults.length - 1]?.roi7Percent || 0)}
                      </Text>
                    </View>
                    
                    <View style={styles.scenarioItem}>
                      <Text style={styles.scenarioRate}>10% Annual Return</Text>
                      <Text style={styles.scenarioValue}>
                        {formatCurrency(projectionResults[projectionResults.length - 1]?.roi10Percent || 0)}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.riskLevelContainer}>
                  <Text style={styles.riskLevelTitle}>Historical Return Expectations (10-Year Average)</Text>
                  
                  {getRiskLevelData().map((risk, index) => (
                    <View key={index} style={styles.riskLevelItem}>
                      <View style={[styles.riskLevelIndicator, { backgroundColor: risk.color }]} />
                      <View style={styles.riskLevelContent}>
                        <Text style={styles.riskLevelName}>{risk.level}</Text>
                        <Text style={styles.riskLevelDescription}>{risk.description}</Text>
                        <Text style={styles.riskLevelReturn}>{risk.expectedReturn}</Text>
                      </View>
                    </View>
                  ))}
                  
                  <Text style={styles.riskLevelDisclaimer}>
                    * Past performance does not guarantee future results. Returns are before fees and taxes.
                  </Text>
                </View>
                
                <View style={styles.keyPointsContainer}>
                  <Text style={styles.keyPointsTitle}>Key Takeaways</Text>
                  
                  <View style={styles.keyPoint}>
                    <AlertTriangle size={20} color={Colors.navy} style={styles.keyPointIcon} />
                    <Text style={styles.keyPointText}>
                      Life insurance provides guaranteed death benefits regardless of market performance.
                    </Text>
                  </View>
                  
                  <View style={styles.keyPoint}>
                    <AlertTriangle size={20} color={Colors.navy} style={styles.keyPointIcon} />
                    <Text style={styles.keyPointText}>
                      Investment strategies require consistent returns and carry market risk.
                    </Text>
                  </View>
                  
                  <View style={styles.keyPoint}>
                    <AlertTriangle size={20} color={Colors.navy} style={styles.keyPointIcon} />
                    <Text style={styles.keyPointText}>
                      Consider the client&apos;s risk tolerance, health status, and need for guaranteed protection.
                    </Text>
                  </View>
                  
                  <View style={styles.keyPoint}>
                    <AlertTriangle size={20} color={Colors.navy} style={styles.keyPointIcon} />
                    <Text style={styles.keyPointText}>
                      Younger clients may benefit more from investment strategies due to longer time horizons.
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.pdfButton}
                  onPress={handleDownloadPDF}
                  activeOpacity={0.8}
                >
                  <Download size={18} color="white" style={styles.buttonIcon} />
                  <Text style={styles.pdfButtonText}>Save Results as PDF</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/advisor")}
          >
            <Text style={styles.backButtonText}>Back to Advisor Tools</Text>
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
    paddingBottom: 30,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
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
  calculatorContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  formContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: Colors.secondary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.backgroundGray,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 4,
    fontStyle: "italic",
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundGray,
  },
  radioButtonSelected: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  radioButtonText: {
    fontSize: 14,
    color: Colors.secondary,
  },
  radioButtonTextSelected: {
    color: "white",
  },
  calculateButton: {
    backgroundColor: Colors.navy,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },

  calculateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resultsContainer: {
    marginTop: 24,
  },
  resultsSummary: {
    backgroundColor: Colors.navyLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  resultsSummaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 16,
    textAlign: "center",
  },
  comparisonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  comparisonColumn: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  comparisonHeader: {
    paddingVertical: 8,
    borderRadius: 8,
    width: "100%",
    marginBottom: 8,
    alignItems: "center",
  },
  insuranceHeader: {
    backgroundColor: Colors.navy,
  },
  investmentHeader: {
    backgroundColor: Colors.secondary,
  },
  comparisonHeaderText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  comparisonValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.navy,
    marginBottom: 4,
  },
  comparisonSubValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginTop: 8,
    marginBottom: 4,
  },
  comparisonDetail: {
    fontSize: 12,
    color: Colors.secondary,
    textAlign: "center",
  },
  keyMetricsContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  metricItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.secondary,
    flex: 1,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.navy,
  },
  positiveValue: {
    color: "#2E7D32",
  },
  negativeValue: {
    color: Colors.error,
  },
  recommendationContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.navy,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  recommendationIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: Colors.navy,
    lineHeight: 20,
  },
  tableContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    backgroundColor: Colors.navy,
    borderRadius: 4,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
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
    backgroundColor: Colors.backgroundGray,
  },
  tableCell: {
    fontSize: 12,
    color: Colors.secondary,
    textAlign: "center",
  },
  scenarioContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scenarioTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 8,
  },
  scenarioSubtitle: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 16,
  },
  scenarioGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  scenarioItem: {
    width: "48%",
    backgroundColor: Colors.navyLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  scenarioRate: {
    fontSize: 12,
    color: Colors.secondary,
    marginBottom: 4,
  },
  scenarioValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.navy,
  },
  riskLevelContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  riskLevelTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 16,
  },
  riskLevelItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  riskLevelIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  riskLevelContent: {
    flex: 1,
  },
  riskLevelName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.navy,
  },
  riskLevelDescription: {
    fontSize: 12,
    color: Colors.secondary,
    marginBottom: 2,
  },
  riskLevelReturn: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
  riskLevelDisclaimer: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: "italic",
    marginTop: 8,
  },
  keyPointsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  keyPointsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 12,
  },
  keyPoint: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  keyPointIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  keyPointText: {
    flex: 1,
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
  },
  footerContainer: {
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: Colors.backgroundGray,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backButtonText: {
    color: Colors.navy,
    fontSize: 16,
    fontWeight: "600",
  },
  pdfButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 16,
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