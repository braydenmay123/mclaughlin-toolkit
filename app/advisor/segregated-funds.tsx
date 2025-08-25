import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { DollarSign, Calculator, Shield, AlertTriangle, Info, Percent, Download } from "lucide-react-native";
import ToolkitHeader from "@/components/ToolkitHeader";
import { formatCurrency } from "@/utils/calculations";
import { downloadPDF, EmailData } from "@/utils/emailService";

export default function SegregatedFundsScreen() {
  const router = useRouter();
  
  // Client information
  const [clientName, setClientName] = useState("John Doe");
  const [clientAge, setClientAge] = useState(86);
  const [advisorName, setAdvisorName] = useState("Joe McLaughlin");
  
  // Investment inputs
  const [initialDeposit, setInitialDeposit] = useState(250000);
  const [marketValueAtDeath, setMarketValueAtDeath] = useState(300000);
  const [deathBenefitGuarantee, setDeathBenefitGuarantee] = useState(100);
  
  // Fee inputs
  const [probateFeePercent, setProbateFeePercent] = useState(1.33);
  const [accountingFeePercent, setAccountingFeePercent] = useState(1.0);
  const [executorFeePercent, setExecutorFeePercent] = useState(1.0);
  const [legalFeePercent, setLegalFeePercent] = useState(2.5);
  const [surrenderFeePercent, setSurrenderFeePercent] = useState(0.0);
  
  // Province selection
  const [province, setProvince] = useState("Ontario");
  
  // Results
  const [hasCalculated, setHasCalculated] = useState(false);
  const [traditionalFees, setTraditionalFees] = useState<any>({});
  const [traditionalEstateValue, setTraditionalEstateValue] = useState(0);
  const [segregatedEstateValue, setSegregatedEstateValue] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  
  // User info for PDF generation
  const [userInfo, setUserInfo] = useState({ name: clientName, email: "client@example.com" });
  
  // Calculate comparison
  const calculateComparison = () => {
    // Calculate guaranteed death benefit for segregated funds
    const guaranteedDeathBenefit = Math.max(
      initialDeposit * (deathBenefitGuarantee / 100),
      marketValueAtDeath
    );
    
    // Calculate fees for traditional investments
    const probateFee = marketValueAtDeath * (probateFeePercent / 100);
    const accountingFee = marketValueAtDeath * (accountingFeePercent / 100);
    const executorFee = marketValueAtDeath * (executorFeePercent / 100);
    const legalFee = marketValueAtDeath * (legalFeePercent / 100);
    const surrenderFee = marketValueAtDeath * (surrenderFeePercent / 100);
    
    const totalFees = probateFee + accountingFee + executorFee + legalFee + surrenderFee;
    
    // Calculate estate values
    const traditionalValue = marketValueAtDeath - totalFees;
    const segregatedValue = guaranteedDeathBenefit; // No fees due to beneficiary designation
    
    // Calculate savings
    const savings = segregatedValue - traditionalValue;
    
    // Update state with calculated values
    setTraditionalFees({
      probate: probateFee,
      accounting: accountingFee,
      executor: executorFee,
      legal: legalFee,
      surrender: surrenderFee,
      total: totalFees
    });
    setTraditionalEstateValue(traditionalValue);
    setSegregatedEstateValue(segregatedValue);
    setTotalSavings(savings);
    setHasCalculated(true);
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    const pdfData: EmailData = {
      name: userInfo.name,
      email: userInfo.email,
      calculatorType: "Segregated Funds vs Traditional Investments",
      results: {
        clientName,
        clientAge,
        advisorName,
        initialDeposit,
        marketValueAtDeath,
        deathBenefitGuarantee,
        probateFeePercent,
        accountingFeePercent,
        executorFeePercent,
        legalFeePercent,
        surrenderFeePercent,
        province,
        traditionalFees,
        traditionalEstateValue,
        segregatedEstateValue,
        totalSavings
      },
      timestamp: new Date().toISOString()
    };

    await downloadPDF(pdfData);
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ToolkitHeader />
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Segregated Funds vs Traditional Investments</Text>
          <Text style={styles.subtitle}>
            Compare the estate planning benefits of segregated funds vs traditional investments
          </Text>
        </View>
        
        <View style={styles.calculatorContainer}>
          <View style={styles.formContainer}>
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>Client Information</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Client Name</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={clientName}
                  onChangeText={setClientName}
                  placeholder="John Doe"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Client Age</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={clientAge.toString()}
                  onChangeText={(text) => setClientAge(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="86"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Advisor Name</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={advisorName}
                  onChangeText={setAdvisorName}
                  placeholder="Joe McLaughlin"
                />
              </View>
            </View>
            
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>Investment Details</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Initial Deposit</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={initialDeposit.toString()}
                  onChangeText={(text) => setInitialDeposit(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="250,000"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Market Value at Death</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={marketValueAtDeath.toString()}
                  onChangeText={(text) => setMarketValueAtDeath(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="300,000"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Death Benefit Guarantee (%)</Text>
              <View style={styles.inputContainer}>
                <Percent size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={deathBenefitGuarantee.toString()}
                  onChangeText={(text) => setDeathBenefitGuarantee(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="100"
                />
              </View>
              <Text style={styles.helperText}>
                Percentage of initial deposit guaranteed as minimum death benefit
              </Text>
            </View>
            
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>Estate Settlement Costs</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Province</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={province}
                  editable={false}
                  placeholder="Ontario"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Probate Fee (%)</Text>
              <View style={styles.inputContainer}>
                <Percent size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={probateFeePercent.toString()}
                  onChangeText={(text) => setProbateFeePercent(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="1.33"
                />
              </View>
              <Text style={styles.helperText}>
                Ontario probate fee: 1.33% on estates over $50,000
              </Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Accounting Fee (%)</Text>
              <View style={styles.inputContainer}>
                <Percent size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={accountingFeePercent.toString()}
                  onChangeText={(text) => setAccountingFeePercent(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="1.0"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Executor Fee (%)</Text>
              <View style={styles.inputContainer}>
                <Percent size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={executorFeePercent.toString()}
                  onChangeText={(text) => setExecutorFeePercent(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="1.0"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Legal Fee (%)</Text>
              <View style={styles.inputContainer}>
                <Percent size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={legalFeePercent.toString()}
                  onChangeText={(text) => setLegalFeePercent(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="2.5"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Surrender Fee (%)</Text>
              <View style={styles.inputContainer}>
                <Percent size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={surrenderFeePercent.toString()}
                  onChangeText={(text) => setSurrenderFeePercent(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="0.0"
                />
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.calculateButton}
              onPress={calculateComparison}
            >
              <Calculator size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.calculateButtonText}>Calculate Comparison</Text>
            </TouchableOpacity>
            
            {hasCalculated && (
              <View style={styles.resultsContainer}>
                <View style={styles.resultsSummary}>
                  <Text style={styles.resultsSummaryTitle}>Estate Value Comparison</Text>
                  
                  <View style={styles.comparisonContainer}>
                    <View style={styles.comparisonColumn}>
                      <View style={[styles.comparisonHeader, styles.segregatedHeader]}>
                        <Shield size={20} color="white" style={styles.comparisonIcon} />
                        <Text style={styles.comparisonHeaderText}>Segregated Funds</Text>
                      </View>
                      <Text style={styles.comparisonValue}>{formatCurrency(segregatedEstateValue)}</Text>
                      <Text style={styles.comparisonDetail}>Estate Value</Text>
                    </View>
                    
                    <View style={styles.comparisonColumn}>
                      <View style={[styles.comparisonHeader, styles.traditionalHeader]}>
                        <Text style={styles.comparisonHeaderText}>Traditional</Text>
                      </View>
                      <Text style={styles.comparisonValue}>{formatCurrency(traditionalEstateValue)}</Text>
                      <Text style={styles.comparisonDetail}>Estate Value</Text>
                    </View>
                  </View>
                  
                  <View style={styles.savingsContainer}>
                    <Text style={styles.savingsLabel}>Amount Saved with Segregated Funds:</Text>
                    <Text style={styles.savingsValue}>{formatCurrency(totalSavings)}</Text>
                  </View>
                  
                  <View style={styles.feeBreakdownContainer}>
                    <Text style={styles.feeBreakdownTitle}>Traditional Investment Fee Breakdown</Text>
                    
                    <View style={styles.feeTable}>
                      <View style={styles.feeRow}>
                        <Text style={styles.feeLabel}>Probate Fee:</Text>
                        <Text style={styles.feeValue}>{formatCurrency(traditionalFees.probate)}</Text>
                        <Text style={styles.feePercent}>({probateFeePercent}%)</Text>
                      </View>
                      
                      <View style={styles.feeRow}>
                        <Text style={styles.feeLabel}>Accounting Fee:</Text>
                        <Text style={styles.feeValue}>{formatCurrency(traditionalFees.accounting)}</Text>
                        <Text style={styles.feePercent}>({accountingFeePercent}%)</Text>
                      </View>
                      
                      <View style={styles.feeRow}>
                        <Text style={styles.feeLabel}>Executor Fee:</Text>
                        <Text style={styles.feeValue}>{formatCurrency(traditionalFees.executor)}</Text>
                        <Text style={styles.feePercent}>({executorFeePercent}%)</Text>
                      </View>
                      
                      <View style={styles.feeRow}>
                        <Text style={styles.feeLabel}>Legal Fee:</Text>
                        <Text style={styles.feeValue}>{formatCurrency(traditionalFees.legal)}</Text>
                        <Text style={styles.feePercent}>({legalFeePercent}%)</Text>
                      </View>
                      
                      <View style={styles.feeRow}>
                        <Text style={styles.feeLabel}>Surrender Fee:</Text>
                        <Text style={styles.feeValue}>{formatCurrency(traditionalFees.surrender)}</Text>
                        <Text style={styles.feePercent}>({surrenderFeePercent}%)</Text>
                      </View>
                      
                      <View style={styles.feeTotalRow}>
                        <Text style={styles.feeTotalLabel}>Total Fees:</Text>
                        <Text style={styles.feeTotalValue}>{formatCurrency(traditionalFees.total)}</Text>
                        <Text style={styles.feeTotalPercent}>
                          ({(traditionalFees.total / marketValueAtDeath * 100).toFixed(2)}%)
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.recommendationContainer}>
                    <Info size={20} color={Colors.navy} style={styles.recommendationIcon} />
                    <Text style={styles.recommendationText}>
                      Segregated funds provide significant estate planning advantages by bypassing probate and avoiding estate settlement costs. In this scenario, the client's heirs would receive {formatCurrency(totalSavings)} more with segregated funds compared to traditional investments.
                    </Text>
                  </View>
                </View>
                
                <View style={styles.keyPointsContainer}>
                  <Text style={styles.keyPointsTitle}>Key Benefits of Segregated Funds</Text>
                  
                  <View style={styles.keyPoint}>
                    <Shield size={20} color={Colors.navy} style={styles.keyPointIcon} />
                    <Text style={styles.keyPointText}>
                      <Text style={styles.keyPointHighlight}>Bypass Probate:</Text> Assets are paid directly to named beneficiaries, avoiding probate fees and delays.
                    </Text>
                  </View>
                  
                  <View style={styles.keyPoint}>
                    <Shield size={20} color={Colors.navy} style={styles.keyPointIcon} />
                    <Text style={styles.keyPointText}>
                      <Text style={styles.keyPointHighlight}>Death Benefit Guarantee:</Text> Provides a minimum guaranteed death benefit of up to 100% of the original investment.
                    </Text>
                  </View>
                  
                  <View style={styles.keyPoint}>
                    <Shield size={20} color={Colors.navy} style={styles.keyPointIcon} />
                    <Text style={styles.keyPointText}>
                      <Text style={styles.keyPointHighlight}>Creditor Protection:</Text> May offer protection from creditors during lifetime and at death.
                    </Text>
                  </View>
                  
                  <View style={styles.keyPoint}>
                    <Shield size={20} color={Colors.navy} style={styles.keyPointIcon} />
                    <Text style={styles.keyPointText}>
                      <Text style={styles.keyPointHighlight}>Privacy:</Text> Beneficiary designations are private and not part of the public probate process.
                    </Text>
                  </View>
                  
                  <View style={styles.keyPoint}>
                    <Shield size={20} color={Colors.navy} style={styles.keyPointIcon} />
                    <Text style={styles.keyPointText}>
                      <Text style={styles.keyPointHighlight}>Quick Settlement:</Text> Benefits are typically paid to beneficiaries within 2 weeks of death notification.
                    </Text>
                  </View>
                </View>
                
                <View style={styles.disclaimerContainer}>
                  <AlertTriangle size={20} color={Colors.secondary} style={styles.disclaimerIcon} />
                  <Text style={styles.disclaimerText}>
                    This comparison is for illustrative purposes only. Actual fees and costs may vary. Segregated funds typically have higher management fees than traditional investments, which are not reflected in this analysis.
                  </Text>
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
    backgroundColor: Colors.lightGray,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    width: "100%",
    marginBottom: 8,
  },
  comparisonIcon: {
    marginRight: 6,
  },
  segregatedHeader: {
    backgroundColor: Colors.navy,
  },
  traditionalHeader: {
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
  comparisonDetail: {
    fontSize: 12,
    color: Colors.secondary,
    textAlign: "center",
  },
  savingsContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.navy,
  },
  savingsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 4,
  },
  savingsValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.navy,
    textAlign: "center",
  },
  feeBreakdownContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  feeBreakdownTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 8,
  },
  feeTable: {
    marginBottom: 8,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  feeLabel: {
    flex: 1.5,
    fontSize: 14,
    color: Colors.secondary,
  },
  feeValue: {
    flex: 1,
    fontSize: 14,
    color: Colors.secondary,
    textAlign: "right",
  },
  feePercent: {
    flex: 0.8,
    fontSize: 14,
    color: Colors.secondary,
    textAlign: "right",
  },
  feeTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  feeTotalLabel: {
    flex: 1.5,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.navy,
  },
  feeTotalValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.navy,
    textAlign: "right",
  },
  feeTotalPercent: {
    flex: 0.8,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.navy,
    textAlign: "right",
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
  keyPointsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
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
  keyPointHighlight: {
    fontWeight: "600",
    color: Colors.navy,
  },
  disclaimerContainer: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  disclaimerIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: Colors.secondary,
    fontStyle: "italic",
    lineHeight: 18,
  },
  footerContainer: {
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: Colors.lightGray,
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