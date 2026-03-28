import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { DollarSign, TrendingUp, AlertTriangle, Info, PiggyBank, Calendar } from "lucide-react-native";
import ToolkitHeader from "@/components/ToolkitHeader";
import { formatCurrency } from "@/utils/calculations";

export default function WithdrawalStrategyScreen() {
  const router = useRouter();
  
  // Client information
  const [initialCapital, setInitialCapital] = useState(1000000);
  const [annualIncomeNeeded, setAnnualIncomeNeeded] = useState(50000);
  const [yearsNeeded, setYearsNeeded] = useState(30);
  const [withdrawalStartAge, setWithdrawalStartAge] = useState(65);
  
  // Investment assumptions
  const [annualReturn, setAnnualReturn] = useState(6.0);
  const [incomeYield, setIncomeYield] = useState(3.5);
  const [inflationRate, setInflationRate] = useState(2.0);
  const [taxRate, setTaxRate] = useState(30.0);
  
  // Capital drawdown assumptions
  const [ongoingWithdrawalRate, setOngoingWithdrawalRate] = useState(5.0);
  
  // Calculated results
  const [hasCalculated, setHasCalculated] = useState(false);
  const [incomeOnlyProjection, setIncomeOnlyProjection] = useState<any[]>([]);
  const [capitalDrawdownProjection, setCapitalDrawdownProjection] = useState<any[]>([]);
  const [incomeOnlyTotalIncome, setIncomeOnlyTotalIncome] = useState(0);
  const [capitalDrawdownTotalIncome, setCapitalDrawdownTotalIncome] = useState(0);
  const [incomeOnlyFinalValue, setIncomeOnlyFinalValue] = useState(0);
  const [capitalDrawdownFinalValue, setCapitalDrawdownFinalValue] = useState(0);
  const [capitalDepletionYear, setCapitalDepletionYear] = useState<number | null>(null);
  
  // Calculate projections
  const calculateProjections = () => {
    const incomeOnlyResults = [];
    const capitalDrawdownResults = [];
    
    let incomeOnlyBalance = initialCapital;
    let capitalDrawdownBalance = initialCapital;
    let incomeOnlyTotalIncomeSum = 0;
    let capitalDrawdownTotalIncomeSum = 0;
    let foundDepletionYear = false;
    let depletionYear = null;
    
    for (let year = 1; year <= yearsNeeded; year++) {
      // Calculate income needed with inflation adjustment
      const inflationFactor = Math.pow(1 + inflationRate / 100, year - 1);
      const inflationAdjustedIncome = annualIncomeNeeded * inflationFactor;
      
      // Income-Only Strategy - Only withdraw income yield percentage, not the full income needed
      const incomeFromYield = incomeOnlyBalance * (incomeYield / 100);
      const incomeOnlyTotalWithdrawal = Math.min(incomeOnlyBalance, incomeFromYield);
      
      // Calculate growth on remaining balance after withdrawal
      const incomeOnlyRemainingBalance = Math.max(0, incomeOnlyBalance - incomeOnlyTotalWithdrawal);
      const incomeOnlyGrowth = incomeOnlyRemainingBalance * (annualReturn / 100);
      
      // Update balance for income-only strategy
      incomeOnlyBalance = incomeOnlyRemainingBalance + incomeOnlyGrowth;
      incomeOnlyTotalIncomeSum += incomeOnlyTotalWithdrawal;
      
      // Capital Drawdown Strategy - Use the annual income needed as the withdrawal amount
      const capitalDrawdownWithdrawal = Math.min(capitalDrawdownBalance, inflationAdjustedIncome);
      
      // Calculate growth on remaining balance after withdrawal
      const capitalDrawdownRemainingBalance = Math.max(0, capitalDrawdownBalance - capitalDrawdownWithdrawal);
      const capitalDrawdownGrowth = capitalDrawdownRemainingBalance * (annualReturn / 100);
      
      // Update balance for capital drawdown strategy
      capitalDrawdownBalance = capitalDrawdownRemainingBalance + capitalDrawdownGrowth;
      capitalDrawdownTotalIncomeSum += capitalDrawdownWithdrawal;
      
      // Check for capital depletion
      if (capitalDrawdownBalance <= 1000 && !foundDepletionYear) {
        foundDepletionYear = true;
        depletionYear = year;
      }
      
      // Store results for this year
      incomeOnlyResults.push({
        year,
        age: withdrawalStartAge + year - 1,
        incomeNeeded: inflationAdjustedIncome,
        incomeFromYield,
        capitalWithdrawal: 0,
        totalWithdrawal: incomeOnlyTotalWithdrawal,
        growth: incomeOnlyGrowth,
        endingBalance: incomeOnlyBalance,
      });
      
      capitalDrawdownResults.push({
        year,
        age: withdrawalStartAge + year - 1,
        ongoingWithdrawal: inflationAdjustedIncome,
        totalWithdrawal: capitalDrawdownWithdrawal,
        growth: capitalDrawdownGrowth,
        endingBalance: capitalDrawdownBalance,
      });
    }
    
    setIncomeOnlyProjection(incomeOnlyResults);
    setCapitalDrawdownProjection(capitalDrawdownResults);
    setIncomeOnlyTotalIncome(incomeOnlyTotalIncomeSum);
    setCapitalDrawdownTotalIncome(capitalDrawdownTotalIncomeSum);
    setIncomeOnlyFinalValue(incomeOnlyResults[yearsNeeded - 1]?.endingBalance || 0);
    setCapitalDrawdownFinalValue(capitalDrawdownResults[yearsNeeded - 1]?.endingBalance || 0);
    setCapitalDepletionYear(depletionYear);
    setHasCalculated(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ToolkitHeader />
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Sustainable Withdrawal Strategy</Text>
          <Text style={styles.subtitle}>
            Compare living off income vs. capital drawdown to show the impact on long-term wealth
          </Text>
        </View>
        
        <View style={styles.calculatorContainer}>
          <View style={styles.formContainer}>
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>Client Profile</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Initial Capital</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={initialCapital.toString()}
                  onChangeText={(text) => setInitialCapital(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="1,000,000"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Annual Income Needed</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={annualIncomeNeeded.toString()}
                  onChangeText={(text) => setAnnualIncomeNeeded(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="50,000"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Years of Income Needed</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={yearsNeeded.toString()}
                  onChangeText={(text) => setYearsNeeded(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="30"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Withdrawal Start Age</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={withdrawalStartAge.toString()}
                  onChangeText={(text) => setWithdrawalStartAge(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="65"
                />
              </View>
            </View>
            
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>Investment Assumptions</Text>
            </View>
            
            <View style={styles.ratesContainer}>
              <View style={styles.rateInputGroup}>
                <Text style={styles.rateLabel}>Annual Return (%)</Text>
                <TextInput
                  style={styles.rateInput}
                  value={annualReturn.toString()}
                  onChangeText={(text) => setAnnualReturn(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="6.0"
                />
              </View>
              
              <View style={styles.rateInputGroup}>
                <Text style={styles.rateLabel}>Income Yield (%)</Text>
                <TextInput
                  style={styles.rateInput}
                  value={incomeYield.toString()}
                  onChangeText={(text) => setIncomeYield(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="3.5"
                />
              </View>
              
              <View style={styles.rateInputGroup}>
                <Text style={styles.rateLabel}>Inflation Rate (%)</Text>
                <TextInput
                  style={styles.rateInput}
                  value={inflationRate.toString()}
                  onChangeText={(text) => setInflationRate(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="2.0"
                />
              </View>
              
              <View style={styles.rateInputGroup}>
                <Text style={styles.rateLabel}>Tax Rate (%)</Text>
                <TextInput
                  style={styles.rateInput}
                  value={taxRate.toString()}
                  onChangeText={(text) => setTaxRate(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="30.0"
                />
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.calculateButton}
              onPress={calculateProjections}
            >
              <TrendingUp size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.calculateButtonText}>Calculate Projections</Text>
            </TouchableOpacity>
            
            {hasCalculated && (
              <View style={styles.resultsContainer}>
                <View style={styles.resultsSummary}>
                  <Text style={styles.resultsSummaryTitle}>Strategy Comparison Summary</Text>
                  
                  <View style={styles.comparisonContainer}>
                    <View style={styles.comparisonColumn}>
                      <View style={[styles.comparisonHeader, styles.incomeOnlyHeader]}>
                        <PiggyBank size={20} color="white" style={styles.comparisonIcon} />
                        <Text style={styles.comparisonHeaderText}>Income-Only</Text>
                      </View>
                      <Text style={styles.comparisonValue}>{formatCurrency(incomeOnlyFinalValue)}</Text>
                      <Text style={styles.comparisonDetail}>Final Capital</Text>
                    </View>
                    
                    <View style={styles.comparisonColumn}>
                      <View style={[styles.comparisonHeader, styles.capitalDrawdownHeader]}>
                        <DollarSign size={20} color="white" style={styles.comparisonIcon} />
                        <Text style={styles.comparisonHeaderText}>Capital Drawdown</Text>
                      </View>
                      <Text style={styles.comparisonValue}>{formatCurrency(capitalDrawdownFinalValue)}</Text>
                      <Text style={styles.comparisonDetail}>Final Capital</Text>
                    </View>
                  </View>
                  
                  <View style={styles.comparisonContainer}>
                    <View style={styles.comparisonColumn}>
                      <Text style={styles.comparisonSubValue}>{formatCurrency(incomeOnlyTotalIncome)}</Text>
                      <Text style={styles.comparisonDetail}>Total Income Taken</Text>
                    </View>
                    
                    <View style={styles.comparisonColumn}>
                      <Text style={styles.comparisonSubValue}>{formatCurrency(capitalDrawdownTotalIncome)}</Text>
                      <Text style={styles.comparisonDetail}>Total Income Taken</Text>
                    </View>
                  </View>
                  
                  {capitalDepletionYear && (
                    <View style={styles.depletionAlert}>
                      <AlertTriangle size={20} color="white" style={styles.alertIcon} />
                      <Text style={styles.alertText}>
                        Warning: Capital is depleted in Year {capitalDepletionYear} (Age {withdrawalStartAge + capitalDepletionYear - 1}) with the Capital Drawdown strategy.
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.differenceContainer}>
                    <Text style={styles.differenceLabel}>Difference in Final Capital:</Text>
                    <Text style={[
                      styles.differenceValue,
                      incomeOnlyFinalValue > capitalDrawdownFinalValue ? styles.positiveValue : styles.negativeValue
                    ]}>
                      {formatCurrency(incomeOnlyFinalValue - capitalDrawdownFinalValue)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.recommendationContainer}>
                  <Info size={20} color={Colors.navy} style={styles.recommendationIcon} />
                  <Text style={styles.recommendationText}>
                    {incomeOnlyFinalValue > capitalDrawdownFinalValue * 1.5 ? 
                      `The Income-Only strategy preserves significantly more capital (${formatCurrency(incomeOnlyFinalValue - capitalDrawdownFinalValue)} more) while still providing the needed income. This approach is strongly recommended for long-term financial security.` :
                      `The Income-Only strategy preserves ${formatCurrency(incomeOnlyFinalValue - capitalDrawdownFinalValue)} more capital than the Capital Drawdown approach. Consider the Income-Only strategy to maintain your wealth over time.`
                    }
                    {capitalDepletionYear ? 
                      ` With the Capital Drawdown strategy, you'll run out of money in year ${capitalDepletionYear} at age ${withdrawalStartAge + capitalDepletionYear - 1}.` : 
                      ""
                    }
                  </Text>
                </View>
                
                <View style={styles.tableContainer}>
                  <Text style={styles.tableTitle}>Detailed Projections</Text>
                  
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>Year</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>Age</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Income-Only Balance</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Capital Drawdown Balance</Text>
                  </View>
                  
                  {incomeOnlyProjection.map((projection, index) => (
                    <View key={`projection-${index}`} style={[
                      styles.tableRow,
                      index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                      capitalDepletionYear && index + 1 >= capitalDepletionYear && styles.depletionRow
                    ]}>
                      <Text style={[styles.tableCell, { flex: 0.5 }]}>{projection.year}</Text>
                      <Text style={[styles.tableCell, { flex: 0.5 }]}>{projection.age}</Text>
                      <Text style={[styles.tableCell, { flex: 1.5 }]}>{formatCurrency(projection.endingBalance)}</Text>
                      <Text style={[styles.tableCell, { flex: 1.5 }]}>
                        {capitalDrawdownProjection[index]?.endingBalance > 1000 
                          ? formatCurrency(capitalDrawdownProjection[index]?.endingBalance) 
                          : "Depleted"}
                      </Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.keyPointsContainer}>
                  <Text style={styles.keyPointsTitle}>Key Takeaways</Text>
                  
                  <View style={styles.keyPoint}>
                    <PiggyBank size={20} color={Colors.navy} style={styles.keyPointIcon} />
                    <Text style={styles.keyPointText}>
                      Living off income preserves your capital, allowing it to continue growing over time.
                    </Text>
                  </View>
                  
                  <View style={styles.keyPoint}>
                    <AlertTriangle size={20} color={Colors.navy} style={styles.keyPointIcon} />
                    <Text style={styles.keyPointText}>
                      Capital drawdowns can significantly reduce your long-term wealth and may lead to depletion.
                    </Text>
                  </View>
                  
                  <View style={styles.keyPoint}>
                    <Calendar size={20} color={Colors.navy} style={styles.keyPointIcon} />
                    <Text style={styles.keyPointText}>
                      The impact of withdrawals compounds over time, creating an even larger gap between strategies.
                    </Text>
                  </View>
                  
                  <View style={styles.keyPoint}>
                    <Info size={20} color={Colors.navy} style={styles.keyPointIcon} />
                    <Text style={styles.keyPointText}>
                      A sustainable withdrawal strategy helps ensure you don't outlive your money.
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
  ratesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  rateInputGroup: {
    width: "48%",
    marginBottom: 12,
  },
  rateLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: Colors.secondary,
  },
  rateInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: Colors.backgroundGray,
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
  incomeOnlyHeader: {
    backgroundColor: Colors.navy,
  },
  capitalDrawdownHeader: {
    backgroundColor: Colors.secondary,
  },
  comparisonIcon: {
    marginRight: 6,
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
    marginBottom: 4,
  },
  comparisonDetail: {
    fontSize: 12,
    color: Colors.secondary,
    textAlign: "center",
  },
  depletionAlert: {
    backgroundColor: Colors.error,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 12,
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
  differenceContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.navy,
  },
  differenceLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 4,
  },
  differenceValue: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
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
    padding: 16,
    marginBottom: 16,
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
    backgroundColor: Colors.backgroundGray,
  },
  depletionRow: {
    backgroundColor: "rgba(244, 67, 54, 0.2)",
  },
  tableCell: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: "center",
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
});