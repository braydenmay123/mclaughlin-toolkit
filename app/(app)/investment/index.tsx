import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useInvestmentStore } from "@/store/investmentStore";
import Colors from "@/constants/colors";
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Info, 
  AlertTriangle,
} from "lucide-react-native";
import ToolkitHeader from "@/components/ToolkitHeader";
import UserInfoModal from "@/components/UserInfoModal";
import { formatCurrency } from "@/utils/calculations";

export default function InvestmentCalculatorScreen() {
  const router = useRouter();
  const {
    initialInvestment,
    monthlyContribution,
    yearsToInvest,
    riskProfile,
    projectedValue,
    setInitialInvestment,
    setMonthlyContribution,
    setYearsToInvest,
    setRiskProfile,
    calculateResults,
  } = useInvestmentStore();
  
  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false);

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!initialInvestment && initialInvestment !== 0) {
      newErrors.initialInvestment = "Please enter a valid amount";
    }
    
    if (!monthlyContribution && monthlyContribution !== 0) {
      newErrors.monthlyContribution = "Please enter a valid amount";
    }
    
    if (!yearsToInvest || yearsToInvest <= 0) {
      newErrors.yearsToInvest = "Please enter a valid number of years";
    }
    
    setErrors(newErrors);
    
    // If no errors, calculate results and show user info modal
    if (Object.keys(newErrors).length === 0) {
      calculateResults();
      setUserInfoModalVisible(true);
    }
  };



  const handleUserInfoSubmit = (name?: string, email?: string) => {
    // Close modal and navigate to results
    setUserInfoModalVisible(false);
    router.push("/(app)/investment/results");
  };

  // Get return rate text based on risk profile
  const getReturnRateText = () => {
    switch (riskProfile) {
      case "conservative": return "2.5%";
      case "balanced": return "5%";
      case "growth": return "7.5%";
      default: return "5%";
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ToolkitHeader />
          
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Investment Growth Calculator</Text>
            <Text style={styles.subtitle}>
              Project your investment growth and compare different account types
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Investment Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Initial Investment</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={initialInvestment > 0 ? initialInvestment.toString() : ""}
                  onChangeText={(text) => setInitialInvestment(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="5,000"
                />
              </View>
              {errors.initialInvestment && <Text style={styles.errorText}>{errors.initialInvestment}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monthly Contribution</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={monthlyContribution > 0 ? monthlyContribution.toString() : ""}
                  onChangeText={(text) => setMonthlyContribution(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="500"
                />
              </View>
              {errors.monthlyContribution && <Text style={styles.errorText}>{errors.monthlyContribution}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Investment Timeframe (Years)</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={yearsToInvest > 0 ? yearsToInvest.toString() : ""}
                  onChangeText={(text) => setYearsToInvest(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="20"
                />
              </View>
              {errors.yearsToInvest && <Text style={styles.errorText}>{errors.yearsToInvest}</Text>}
            </View>
            

            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Investment Risk Profile</Text>
              <View style={styles.riskProfileContainer}>
                <TouchableOpacity
                  style={[
                    styles.riskProfileButton,
                    riskProfile === "conservative" && styles.riskProfileButtonActive,
                  ]}
                  onPress={() => setRiskProfile("conservative")}
                >
                  <Text
                    style={[
                      styles.riskProfileButtonText,
                      riskProfile === "conservative" && styles.riskProfileButtonTextActive,
                    ]}
                  >
                    Conservative (2.5%)
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.riskProfileButton,
                    riskProfile === "balanced" && styles.riskProfileButtonActive,
                  ]}
                  onPress={() => setRiskProfile("balanced")}
                >
                  <Text
                    style={[
                      styles.riskProfileButtonText,
                      riskProfile === "balanced" && styles.riskProfileButtonTextActive,
                    ]}
                  >
                    Balanced (5%)
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.riskProfileButton,
                    riskProfile === "growth" && styles.riskProfileButtonActive,
                  ]}
                  onPress={() => setRiskProfile("growth")}
                >
                  <Text
                    style={[
                      styles.riskProfileButtonText,
                      riskProfile === "growth" && styles.riskProfileButtonTextActive,
                    ]}
                  >
                    Growth (7.5%)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            

            
            <View style={styles.tipContainer}>
              <Info size={18} color={Colors.navy} style={styles.tipIcon} />
              <Text style={styles.tipText}>
                A {riskProfile} investment strategy with a {getReturnRateText()} expected annual return could grow your initial investment of {formatCurrency(initialInvestment)} to approximately {formatCurrency(projectedValue)} over {yearsToInvest} years with monthly contributions of {formatCurrency(monthlyContribution)}.
              </Text>
            </View>
            
            <TouchableOpacity style={styles.calculateButton} onPress={handleSubmit}>
              <Text style={styles.calculateButtonText}>Calculate Growth</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tfsaButton} 
              onPress={() => router.push("/(app)/tfsa")}
            >
              <Text style={styles.tfsaButtonText}>
                Check Your TFSA Contribution Room
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <UserInfoModal
        visible={userInfoModalVisible}
        onClose={() => setUserInfoModalVisible(false)}
        onSubmit={handleUserInfoSubmit}
        calculatorType="Investment Growth Calculator"
        results={{
          initialInvestment,
          monthlyContribution,
          yearsToInvest,
          riskProfile,
          projectedValue,
          totalContributions: initialInvestment + (monthlyContribution * 12 * yearsToInvest),
          totalGrowth: projectedValue - (initialInvestment + (monthlyContribution * 12 * yearsToInvest)),
          annualReturnRate: getReturnRateText()
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: '#04233a',
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: "center",
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.navy,
    marginTop: 20,
    marginBottom: 10,
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
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  accountTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  accountTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    backgroundColor: Colors.lightGray,
  },
  accountTypeButtonActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  accountTypeButtonText: {
    fontSize: 12,
    color: Colors.secondary,
    textAlign: "center",
  },
  accountTypeButtonTextActive: {
    color: "white",
    fontWeight: "600",
  },
  riskProfileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  riskProfileButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    backgroundColor: Colors.lightGray,
  },
  riskProfileButtonActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  riskProfileButtonText: {
    fontSize: 12,
    color: Colors.secondary,
    textAlign: "center",
  },
  riskProfileButtonTextActive: {
    color: "white",
    fontWeight: "600",
  },
  advancedOptionsToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  advancedOptionsText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.secondary,
  },
  tipContainer: {
    flexDirection: "row",
    backgroundColor: Colors.navyLight,
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: "flex-start",
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.navy,
    lineHeight: 20,
  },
  calculateButton: {
    backgroundColor: '#04233a',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  tfsaButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#04233a',
  },
  tfsaButtonText: {
    color: '#04233a',
    fontSize: 16,
    fontWeight: "600",
  },
});