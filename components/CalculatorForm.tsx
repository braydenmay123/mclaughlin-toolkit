import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useCalculatorStore } from "@/store/calculatorStore";
import Colors from "@/constants/colors";
import { DollarSign, Percent, Info, CreditCard } from "lucide-react-native";
import UserInfoModal from "@/components/UserInfoModal";

export default function CalculatorForm() {
  const router = useRouter();
  const {
    homePrice,
    interestRate,
    downPaymentPercent,
    mortgageTermYears,
    biWeeklyUtilitiesAndTaxes,
    currentBiWeeklyRent,
    monthlyInsurance,
    annualIncome,
    currentSavings,
    monthlyExpenses,
    monthlyDebtPayments,
    setHomePrice,
    setInterestRate,
    setDownPaymentPercent,
    setMortgageTermYears,
    setBiWeeklyUtilitiesAndTaxes,
    setCurrentBiWeeklyRent,
    setMonthlyInsurance,
    setAnnualIncome,
    setCurrentSavings,
    setMonthlyExpenses,
    setMonthlyDebtPayments,
    setUserInfo,
    calculateResults,
  } = useCalculatorStore();

  // Local state for form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!homePrice || homePrice <= 0) {
      newErrors.homePrice = "Please enter a valid home price";
    }
    
    if (!interestRate || interestRate <= 0) {
      newErrors.interestRate = "Please enter a valid interest rate";
    }
    
    if (!downPaymentPercent || downPaymentPercent <= 0 || downPaymentPercent > 100) {
      newErrors.downPaymentPercent = "Please enter a valid down payment percentage (1-100)";
    }
    
    if (!mortgageTermYears || mortgageTermYears <= 0) {
      newErrors.mortgageTermYears = "Please enter a valid mortgage term";
    }
    
    if (!biWeeklyUtilitiesAndTaxes || biWeeklyUtilitiesAndTaxes < 0) {
      newErrors.biWeeklyUtilitiesAndTaxes = "Please enter valid utilities and taxes";
    }
    
    if (!currentBiWeeklyRent || currentBiWeeklyRent < 0) {
      newErrors.currentBiWeeklyRent = "Please enter valid current rent";
    }
    
    setErrors(newErrors);
    
    // If no errors, show user info modal
    if (Object.keys(newErrors).length === 0) {
      calculateResults();
      setUserInfoModalVisible(true);
    }
  };

  const handleUserInfoSubmit = (name: string, email: string) => {
    // Store user info in the calculator store
    setUserInfo({ name, email });
    
    // Close the modal and navigate to results immediately
    setUserInfoModalVisible(false);
    router.push("/(tabs)/results");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Property Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Home Price</Text>
              <View style={[
                styles.inputContainer,
                focusedField === "homePrice" && styles.inputContainerFocused,
                errors.homePrice && styles.inputContainerError
              ]}>
                <View style={styles.iconContainer}>
                  <DollarSign size={18} color={Colors.primary} />
                </View>
                <TextInput
                  style={styles.input}
                  value={homePrice.toString()}
                  onChangeText={(text) => setHomePrice(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="600,000"
                  placeholderTextColor={Colors.textLight}
                  onFocus={() => setFocusedField("homePrice")}
                  onBlur={() => setFocusedField(null)}
                  returnKeyType="next"
                />
              </View>
              {errors.homePrice && <Text style={styles.errorText}>{errors.homePrice}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Interest Rate (%)</Text>
              <View style={[
                styles.inputContainer,
                focusedField === "interestRate" && styles.inputContainerFocused,
                errors.interestRate && styles.inputContainerError
              ]}>
                <View style={styles.iconContainer}>
                  <Percent size={18} color={Colors.primary} />
                </View>
                <TextInput
                  style={styles.input}
                  value={interestRate.toString()}
                  onChangeText={(text) => setInterestRate(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="3.99"
                  placeholderTextColor={Colors.textLight}
                  onFocus={() => setFocusedField("interestRate")}
                  onBlur={() => setFocusedField(null)}
                  returnKeyType="next"
                />
              </View>
              {errors.interestRate && <Text style={styles.errorText}>{errors.interestRate}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Down Payment (%)</Text>
              <View style={[
                styles.inputContainer,
                focusedField === "downPaymentPercent" && styles.inputContainerFocused,
                errors.downPaymentPercent && styles.inputContainerError
              ]}>
                <View style={styles.iconContainer}>
                  <Percent size={18} color={Colors.primary} />
                </View>
                <TextInput
                  style={styles.input}
                  value={downPaymentPercent.toString()}
                  onChangeText={(text) => setDownPaymentPercent(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="10"
                  placeholderTextColor={Colors.textLight}
                  onFocus={() => setFocusedField("downPaymentPercent")}
                  onBlur={() => setFocusedField(null)}
                  returnKeyType="next"
                />
              </View>
              {errors.downPaymentPercent && <Text style={styles.errorText}>{errors.downPaymentPercent}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mortgage Term (Years)</Text>
              <View style={[
                styles.inputContainer,
                focusedField === "mortgageTermYears" && styles.inputContainerFocused,
                errors.mortgageTermYears && styles.inputContainerError
              ]}>
                <TextInput
                  style={[styles.input, styles.inputWithoutIcon]}
                  value={mortgageTermYears.toString()}
                  onChangeText={(text) => setMortgageTermYears(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="30"
                  placeholderTextColor={Colors.textLight}
                  onFocus={() => setFocusedField("mortgageTermYears")}
                  onBlur={() => setFocusedField(null)}
                  returnKeyType="next"
                />
              </View>
              {errors.mortgageTermYears && <Text style={styles.errorText}>{errors.mortgageTermYears}</Text>}
            </View>
            
            <Text style={styles.sectionTitle}>Current Financial Situation</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Savings</Text>
              <View style={[
                styles.inputContainer,
                focusedField === "currentSavings" && styles.inputContainerFocused
              ]}>
                <View style={styles.iconContainer}>
                  <DollarSign size={18} color={Colors.primary} />
                </View>
                <TextInput
                  style={styles.input}
                  value={currentSavings.toString()}
                  onChangeText={(text) => setCurrentSavings(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="10000"
                  placeholderTextColor={Colors.textLight}
                  onFocus={() => setFocusedField("currentSavings")}
                  onBlur={() => setFocusedField(null)}
                  returnKeyType="next"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Bi-Weekly Rent</Text>
              <View style={[
                styles.inputContainer,
                focusedField === "currentBiWeeklyRent" && styles.inputContainerFocused,
                errors.currentBiWeeklyRent && styles.inputContainerError
              ]}>
                <View style={styles.iconContainer}>
                  <DollarSign size={18} color={Colors.primary} />
                </View>
                <TextInput
                  style={styles.input}
                  value={currentBiWeeklyRent.toString()}
                  onChangeText={(text) => setCurrentBiWeeklyRent(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="1000"
                  placeholderTextColor={Colors.textLight}
                  onFocus={() => setFocusedField("currentBiWeeklyRent")}
                  onBlur={() => setFocusedField(null)}
                  returnKeyType="next"
                />
              </View>
              {errors.currentBiWeeklyRent && <Text style={styles.errorText}>{errors.currentBiWeeklyRent}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monthly Expenses (excluding rent)</Text>
              <View style={[
                styles.inputContainer,
                focusedField === "monthlyExpenses" && styles.inputContainerFocused
              ]}>
                <View style={styles.iconContainer}>
                  <DollarSign size={18} color={Colors.primary} />
                </View>
                <TextInput
                  style={styles.input}
                  value={monthlyExpenses.toString()}
                  onChangeText={(text) => setMonthlyExpenses(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="2500"
                  placeholderTextColor={Colors.textLight}
                  onFocus={() => setFocusedField("monthlyExpenses")}
                  onBlur={() => setFocusedField(null)}
                  returnKeyType="next"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monthly Debt Payments</Text>
              <View style={[
                styles.inputContainer,
                focusedField === "monthlyDebtPayments" && styles.inputContainerFocused
              ]}>
                <View style={styles.iconContainer}>
                  <CreditCard size={18} color={Colors.primary} />
                </View>
                <TextInput
                  style={styles.input}
                  value={monthlyDebtPayments.toString()}
                  onChangeText={(text) => setMonthlyDebtPayments(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="500"
                  placeholderTextColor={Colors.textLight}
                  onFocus={() => setFocusedField("monthlyDebtPayments")}
                  onBlur={() => setFocusedField(null)}
                  returnKeyType="next"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Annual Household Income</Text>
              <View style={[
                styles.inputContainer,
                focusedField === "annualIncome" && styles.inputContainerFocused
              ]}>
                <View style={styles.iconContainer}>
                  <DollarSign size={18} color={Colors.primary} />
                </View>
                <TextInput
                  style={styles.input}
                  value={annualIncome.toString()}
                  onChangeText={(text) => setAnnualIncome(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="90000"
                  placeholderTextColor={Colors.textLight}
                  onFocus={() => setFocusedField("annualIncome")}
                  onBlur={() => setFocusedField(null)}
                  returnKeyType="next"
                />
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Additional Costs</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bi-Weekly Utilities & Taxes</Text>
              <View style={[
                styles.inputContainer,
                focusedField === "biWeeklyUtilitiesAndTaxes" && styles.inputContainerFocused,
                errors.biWeeklyUtilitiesAndTaxes && styles.inputContainerError
              ]}>
                <View style={styles.iconContainer}>
                  <DollarSign size={18} color={Colors.primary} />
                </View>
                <TextInput
                  style={styles.input}
                  value={biWeeklyUtilitiesAndTaxes.toString()}
                  onChangeText={(text) => setBiWeeklyUtilitiesAndTaxes(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="353"
                  placeholderTextColor={Colors.textLight}
                  onFocus={() => setFocusedField("biWeeklyUtilitiesAndTaxes")}
                  onBlur={() => setFocusedField(null)}
                  returnKeyType="next"
                />
              </View>
              {errors.biWeeklyUtilitiesAndTaxes && <Text style={styles.errorText}>{errors.biWeeklyUtilitiesAndTaxes}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monthly Home Insurance</Text>
              <View style={[
                styles.inputContainer,
                focusedField === "monthlyInsurance" && styles.inputContainerFocused
              ]}>
                <View style={styles.iconContainer}>
                  <DollarSign size={18} color={Colors.primary} />
                </View>
                <TextInput
                  style={styles.input}
                  value={monthlyInsurance.toString()}
                  onChangeText={(text) => setMonthlyInsurance(Number(text.replace(/[^0-9.]/g, "")))}
                  keyboardType="numeric"
                  placeholder="150"
                  placeholderTextColor={Colors.textLight}
                  onFocus={() => setFocusedField("monthlyInsurance")}
                  onBlur={() => setFocusedField(null)}
                  returnKeyType="done"
                />
              </View>
            </View>
            
            <View style={styles.tipContainer}>
              <Info size={18} color={Colors.primary} style={styles.tipIcon} />
              <Text style={styles.tipText}>
                Adding your current financial details helps us provide a more accurate assessment of your home buying readiness and timeline.
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.calculateButton} 
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.calculateButtonText}>Calculate Results</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <UserInfoModal
        visible={userInfoModalVisible}
        onClose={() => setUserInfoModalVisible(false)}
        onSubmit={handleUserInfoSubmit}
        calculatorType="Home Affordability Calculator"
        results={{
          homePrice,
          interestRate,
          downPaymentPercent,
          mortgageTermYears,
          biWeeklyUtilitiesAndTaxes,
          currentBiWeeklyRent,
          monthlyInsurance,
          annualIncome,
          currentSavings,
          monthlyExpenses,
          monthlyDebtPayments
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    padding: 24,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginTop: 24,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    color: Colors.text,
    letterSpacing: -0.1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 16,
    backgroundColor: Colors.background,
    overflow: "hidden",
    minHeight: 56,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainerError: {
    borderColor: Colors.error,
  },
  iconContainer: {
    width: 52,
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.accentLight,
    borderRightWidth: 1,
    borderRightColor: Colors.borderLight,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 18,
    fontSize: 17,
    color: Colors.text,
    minHeight: 56,
    fontWeight: "500",
  },
  inputWithoutIcon: {
    paddingLeft: 24,
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
    marginTop: 8,
    marginLeft: 6,
    fontWeight: "500",
  },
  tipContainer: {
    flexDirection: "row",
    backgroundColor: Colors.infoLight,
    padding: 20,
    borderRadius: 16,
    marginVertical: 24,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: Colors.accentMedium,
  },
  tipIcon: {
    marginRight: 14,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary,
    lineHeight: 20,
    fontWeight: "500",
  },
  calculateButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  calculateButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});