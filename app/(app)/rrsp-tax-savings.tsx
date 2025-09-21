import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { DollarSign, Percent, Calculator, Info } from "lucide-react-native";
import ToolkitHeader from "@/components/ToolkitHeader";
import { formatCurrency } from "@/utils/calculations";

export default function RRSPTaxSavingsScreen() {
  const router = useRouter();
  
  // Input state
  const [annualIncome, setAnnualIncome] = useState(100000);
  const [rrspContribution, setRrspContribution] = useState(10000);
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [province, setProvince] = useState("Ontario");
  
  // Calculated results
  const [hasCalculated, setHasCalculated] = useState(false);
  const [taxableIncomeBeforeRRSP, setTaxableIncomeBeforeRRSP] = useState(0);
  const [taxableIncomeAfterRRSP, setTaxableIncomeAfterRRSP] = useState(0);
  const [federalTaxBeforeRRSP, setFederalTaxBeforeRRSP] = useState(0);
  const [federalTaxAfterRRSP, setFederalTaxAfterRRSP] = useState(0);
  const [provincialTaxBeforeRRSP, setProvincialTaxBeforeRRSP] = useState(0);
  const [provincialTaxAfterRRSP, setProvincialTaxAfterRRSP] = useState(0);
  const [totalTaxBeforeRRSP, setTotalTaxBeforeRRSP] = useState(0);
  const [totalTaxAfterRRSP, setTotalTaxAfterRRSP] = useState(0);
  const [totalTaxSavings, setTotalTaxSavings] = useState(0);
  const [effectiveTaxRate, setEffectiveTaxRate] = useState(0);
  const [marginalTaxRate, setMarginalTaxRate] = useState(0);
  
  // 2025 Federal Tax Brackets
  const federalBrackets = [
    { min: 0, max: 57375, rate: 0.15 },
    { min: 57375, max: 114750, rate: 0.205 },
    { min: 114750, max: 177882, rate: 0.26 },
    { min: 177882, max: 253414, rate: 0.29 },
    { min: 253414, max: Infinity, rate: 0.33 }
  ];
  
  // 2025 Ontario Provincial Tax Brackets
  const ontarioBrackets = [
    { min: 0, max: 52886, rate: 0.0505 },
    { min: 52886, max: 105775, rate: 0.0915 },
    { min: 105775, max: 150000, rate: 0.1116 },
    { min: 150000, max: 220000, rate: 0.1216 },
    { min: 220000, max: Infinity, rate: 0.1316 }
  ];
  
  // Calculate tax for a given income and tax brackets
  const calculateTax = (income: number, brackets: any[]) => {
    let tax = 0;
    let remainingIncome = income;
    
    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;
      
      const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      tax += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
    }
    
    return tax;
  };
  
  // Calculate marginal tax rate for a given income
  const calculateMarginalRate = (income: number) => {
    // Find federal bracket
    const federalBracket = federalBrackets.find(bracket => income >= bracket.min && income < bracket.max);
    
    // Find provincial bracket
    const provincialBracket = ontarioBrackets.find(bracket => income >= bracket.min && income < bracket.max);
    
    // Combined marginal rate
    return (federalBracket?.rate || 0) + (provincialBracket?.rate || 0);
  };
  
  // Calculate tax savings
  const calculateTaxSavings = () => {
    // Calculate taxable income
    const taxableBeforeRRSP = Math.max(0, annualIncome - otherDeductions);
    const taxableAfterRRSP = Math.max(0, taxableBeforeRRSP - rrspContribution);
    
    // Calculate federal tax
    const fedTaxBefore = calculateTax(taxableBeforeRRSP, federalBrackets);
    const fedTaxAfter = calculateTax(taxableAfterRRSP, federalBrackets);
    
    // Calculate provincial tax (Ontario)
    const provTaxBefore = calculateTax(taxableBeforeRRSP, ontarioBrackets);
    const provTaxAfter = calculateTax(taxableAfterRRSP, ontarioBrackets);
    
    // Calculate total tax
    const totalTaxBefore = fedTaxBefore + provTaxBefore;
    const totalTaxAfter = fedTaxAfter + provTaxAfter;
    
    // Calculate tax savings
    const savings = totalTaxBefore - totalTaxAfter;
    
    // Calculate effective tax rate on RRSP contribution
    const effectiveRate = (savings / rrspContribution) * 100;
    
    // Calculate marginal tax rate
    const marginalRate = calculateMarginalRate(taxableBeforeRRSP) * 100;
    
    // Update state with calculated values
    setTaxableIncomeBeforeRRSP(taxableBeforeRRSP);
    setTaxableIncomeAfterRRSP(taxableAfterRRSP);
    setFederalTaxBeforeRRSP(fedTaxBefore);
    setFederalTaxAfterRRSP(fedTaxAfter);
    setProvincialTaxBeforeRRSP(provTaxBefore);
    setProvincialTaxAfterRRSP(provTaxAfter);
    setTotalTaxBeforeRRSP(totalTaxBefore);
    setTotalTaxAfterRRSP(totalTaxAfter);
    setTotalTaxSavings(savings);
    setEffectiveTaxRate(effectiveRate);
    setMarginalTaxRate(marginalRate);
    setHasCalculated(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ToolkitHeader />
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>RRSP Tax Savings Calculator</Text>
          <Text style={styles.subtitle}>
            Calculate the tax savings from RRSP contributions based on 2025 tax brackets
          </Text>
        </View>
        
        <View style={styles.calculatorContainer}>
          <View style={styles.formContainer}>
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>Income & Contribution Details</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Annual Income</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={annualIncome.toString()}
                  onChangeText={(text) => setAnnualIncome(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="100,000"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>RRSP Contribution</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={rrspContribution.toString()}
                  onChangeText={(text) => setRrspContribution(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="10,000"
                />
              </View>
              <Text style={styles.helperText}>
                Maximum contribution limit for 2025: $32,490 or 18% of previous year's earned income
              </Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Other Deductions/Credits</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={otherDeductions.toString()}
                  onChangeText={(text) => setOtherDeductions(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              <Text style={styles.helperText}>
                Optional: Include other tax deductions to get a more accurate calculation
              </Text>
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
              <Text style={styles.helperText}>
                Currently only Ontario tax rates are supported
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.calculateButton}
              onPress={calculateTaxSavings}
            >
              <Calculator size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.calculateButtonText}>Calculate Tax Savings</Text>
            </TouchableOpacity>
            
            {hasCalculated && (
              <View style={styles.resultsContainer}>
                <View style={styles.resultsSummary}>
                  <Text style={styles.resultsSummaryTitle}>Tax Savings Summary</Text>
                  
                  <View style={styles.savingsContainer}>
                    <Text style={styles.savingsLabel}>Total Tax Savings:</Text>
                    <Text style={styles.savingsValue}>{formatCurrency(totalTaxSavings)}</Text>
                  </View>
                  
                  <View style={styles.rateContainer}>
                    <View style={styles.rateItem}>
                      <Text style={styles.rateLabel}>Effective Tax Rate on Contribution:</Text>
                      <Text style={styles.rateValue}>{effectiveTaxRate.toFixed(2)}%</Text>
                    </View>
                    
                    <View style={styles.rateItem}>
                      <Text style={styles.rateLabel}>Marginal Tax Rate:</Text>
                      <Text style={styles.rateValue}>{marginalTaxRate.toFixed(2)}%</Text>
                    </View>
                  </View>
                  
                  <View style={styles.comparisonContainer}>
                    <View style={styles.comparisonColumn}>
                      <View style={[styles.comparisonHeader, styles.beforeHeader]}>
                        <Text style={styles.comparisonHeaderText}>Before RRSP</Text>
                      </View>
                      <Text style={styles.comparisonValue}>{formatCurrency(totalTaxBeforeRRSP)}</Text>
                      <Text style={styles.comparisonDetail}>Total Tax</Text>
                    </View>
                    
                    <View style={styles.comparisonColumn}>
                      <View style={[styles.comparisonHeader, styles.afterHeader]}>
                        <Text style={styles.comparisonHeaderText}>After RRSP</Text>
                      </View>
                      <Text style={styles.comparisonValue}>{formatCurrency(totalTaxAfterRRSP)}</Text>
                      <Text style={styles.comparisonDetail}>Total Tax</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.detailedResultsContainer}>
                  <Text style={styles.detailedResultsTitle}>Detailed Tax Calculation</Text>
                  
                  <View style={styles.detailedTable}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Item</Text>
                      <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Before RRSP</Text>
                      <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>After RRSP</Text>
                    </View>
                    
                    <View style={[styles.tableRow, styles.tableRowEven]}>
                      <Text style={[styles.tableCell, { flex: 2 }]}>Taxable Income</Text>
                      <Text style={[styles.tableCell, { flex: 1.5 }]}>{formatCurrency(taxableIncomeBeforeRRSP)}</Text>
                      <Text style={[styles.tableCell, { flex: 1.5 }]}>{formatCurrency(taxableIncomeAfterRRSP)}</Text>
                    </View>
                    
                    <View style={[styles.tableRow, styles.tableRowOdd]}>
                      <Text style={[styles.tableCell, { flex: 2 }]}>Federal Tax</Text>
                      <Text style={[styles.tableCell, { flex: 1.5 }]}>{formatCurrency(federalTaxBeforeRRSP)}</Text>
                      <Text style={[styles.tableCell, { flex: 1.5 }]}>{formatCurrency(federalTaxAfterRRSP)}</Text>
                    </View>
                    
                    <View style={[styles.tableRow, styles.tableRowEven]}>
                      <Text style={[styles.tableCell, { flex: 2 }]}>Provincial Tax</Text>
                      <Text style={[styles.tableCell, { flex: 1.5 }]}>{formatCurrency(provincialTaxBeforeRRSP)}</Text>
                      <Text style={[styles.tableCell, { flex: 1.5 }]}>{formatCurrency(provincialTaxAfterRRSP)}</Text>
                    </View>
                    
                    <View style={styles.tableTotalRow}>
                      <Text style={[styles.tableTotalCell, { flex: 2 }]}>Total Tax</Text>
                      <Text style={[styles.tableTotalCell, { flex: 1.5 }]}>{formatCurrency(totalTaxBeforeRRSP)}</Text>
                      <Text style={[styles.tableTotalCell, { flex: 1.5 }]}>{formatCurrency(totalTaxAfterRRSP)}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.taxBracketsContainer}>
                  <Text style={styles.taxBracketsTitle}>2025 Tax Brackets (Ontario)</Text>
                  
                  <View style={styles.bracketSection}>
                    <Text style={styles.bracketSectionTitle}>Federal Tax Brackets</Text>
                    
                    <View style={styles.bracketTable}>
                      <View style={styles.bracketTableHeader}>
                        <Text style={[styles.bracketHeaderCell, { flex: 2 }]}>Income Range</Text>
                        <Text style={[styles.bracketHeaderCell, { flex: 1 }]}>Rate</Text>
                      </View>
                      
                      {federalBrackets.map((bracket, index) => (
                        <View key={`fed-bracket-${index}`} style={[
                          styles.bracketRow,
                          index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                          taxableIncomeBeforeRRSP >= bracket.min && taxableIncomeBeforeRRSP < bracket.max && styles.currentBracketRow
                        ]}>
                          <Text style={[styles.bracketCell, { flex: 2 }]}>
                            {bracket.min.toLocaleString()} - {bracket.max === Infinity ? "and up" : bracket.max.toLocaleString()}
                          </Text>
                          <Text style={[styles.bracketCell, { flex: 1 }]}>{(bracket.rate * 100).toFixed(2)}%</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  
                  <View style={styles.bracketSection}>
                    <Text style={styles.bracketSectionTitle}>Ontario Provincial Tax Brackets</Text>
                    
                    <View style={styles.bracketTable}>
                      <View style={styles.bracketTableHeader}>
                        <Text style={[styles.bracketHeaderCell, { flex: 2 }]}>Income Range</Text>
                        <Text style={[styles.bracketHeaderCell, { flex: 1 }]}>Rate</Text>
                      </View>
                      
                      {ontarioBrackets.map((bracket, index) => (
                        <View key={`prov-bracket-${index}`} style={[
                          styles.bracketRow,
                          index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                          taxableIncomeBeforeRRSP >= bracket.min && taxableIncomeBeforeRRSP < bracket.max && styles.currentBracketRow
                        ]}>
                          <Text style={[styles.bracketCell, { flex: 2 }]}>
                            {bracket.min.toLocaleString()} - {bracket.max === Infinity ? "and up" : bracket.max.toLocaleString()}
                          </Text>
                          <Text style={[styles.bracketCell, { flex: 1 }]}>{(bracket.rate * 100).toFixed(2)}%</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
                
                <View style={styles.tipsContainer}>
                  <Text style={styles.tipsTitle}>RRSP Contribution Tips</Text>
                  
                  <View style={styles.tipItem}>
                    <Info size={20} color={Colors.navy} style={styles.tipIcon} />
                    <Text style={styles.tipText}>
                      RRSP contributions are most beneficial when your current tax rate is higher than your expected tax rate in retirement.
                    </Text>
                  </View>
                  
                  <View style={styles.tipItem}>
                    <Info size={20} color={Colors.navy} style={styles.tipIcon} />
                    <Text style={styles.tipText}>
                      Consider contributing enough to drop to a lower tax bracket for maximum tax savings.
                    </Text>
                  </View>
                  
                  <View style={styles.tipItem}>
                    <Info size={20} color={Colors.navy} style={styles.tipIcon} />
                    <Text style={styles.tipText}>
                      You can contribute to your RRSP until March 1, 2026 to claim a deduction for the 2025 tax year.
                    </Text>
                  </View>
                  
                  <View style={styles.tipItem}>
                    <Info size={20} color={Colors.navy} style={styles.tipIcon} />
                    <Text style={styles.tipText}>
                      Consider reinvesting your tax refund to maximize the long-term growth of your retirement savings.
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.backButtonText}>Back to Main Menu</Text>
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
  buttonIcon: {
    marginRight: 8,
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
  rateContainer: {
    marginBottom: 16,
  },
  rateItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
  },
  rateLabel: {
    fontSize: 14,
    color: Colors.secondary,
  },
  rateValue: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.navy,
  },
  comparisonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  beforeHeader: {
    backgroundColor: Colors.secondary,
  },
  afterHeader: {
    backgroundColor: Colors.navy,
  },
  comparisonHeaderText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  comparisonValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.navy,
    marginBottom: 4,
  },
  comparisonDetail: {
    fontSize: 12,
    color: Colors.secondary,
    textAlign: "center",
  },
  detailedResultsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailedResultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 12,
  },
  detailedTable: {
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    backgroundColor: Colors.navy,
    borderRadius: 4,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontSize: 14,
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
    backgroundColor: Colors.lightGray,
  },
  tableCell: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: "center",
  },
  tableTotalRow: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: Colors.navyLight,
    borderRadius: 4,
    marginTop: 8,
  },
  tableTotalCell: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.navy,
    textAlign: "center",
  },
  taxBracketsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  taxBracketsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 12,
  },
  bracketSection: {
    marginBottom: 16,
  },
  bracketSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 8,
  },
  bracketTable: {
    marginBottom: 8,
  },
  bracketTableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    backgroundColor: Colors.navy,
    borderRadius: 4,
    marginBottom: 8,
  },
  bracketHeaderCell: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  bracketRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  currentBracketRow: {
    backgroundColor: "rgba(10, 36, 99, 0.1)",
  },
  bracketCell: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: "center",
  },
  tipsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 12,
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
});