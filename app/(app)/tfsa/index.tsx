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
import { useTFSAStore, calculateCumulativeRoom } from "@/store/tfsaStore";
import Colors from "@/constants/colors";
import { 
  DollarSign, 
  Calendar, 
  Info, 
  AlertTriangle,
  Plus,
  Trash2
} from "lucide-react-native";
import ToolkitHeader from "@/components/ToolkitHeader";
import UserInfoModal from "@/components/UserInfoModal";
import { formatCurrency } from "@/utils/calculations";

export default function TFSACalculatorScreen() {
  const router = useRouter();
  const {
    birthYear,
    canadianResidentSince,
    currentTFSARoom,
    pastContributions,
    pastWithdrawals,
    hasOvercontributed,
    overcontributionAmount,
    setBirthYear,
    setCanadianResidentSince,
    setCurrentTFSARoom,
    addContribution,
    addWithdrawal,
    removeContribution,
    removeWithdrawal,
    calculateContributionRoom,
  } = useTFSAStore();

  // Local state for form validation and UI
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [newContribution, setNewContribution] = useState({ year: new Date().getFullYear(), amount: 0 });
  const [newWithdrawal, setNewWithdrawal] = useState({ year: new Date().getFullYear(), amount: 0 });
  const [maxTFSARoom, setMaxTFSARoom] = useState(0);

  // Calculate maximum TFSA room based on birth year
  useEffect(() => {
    const maxRoom = calculateCumulativeRoom(birthYear);
    setMaxTFSARoom(maxRoom);
    calculateContributionRoom();
  }, [birthYear, canadianResidentSince]);

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!birthYear || birthYear < 1900 || birthYear > new Date().getFullYear() - 18) {
      newErrors.birthYear = "Please enter a valid birth year";
    }
    
    setErrors(newErrors);
    
    // If no errors, show user info modal
    if (Object.keys(newErrors).length === 0) {
      calculateContributionRoom();
      setUserInfoModalVisible(true);
    }
  };

  const handleUserInfoSubmit = (name: string, email: string) => {
    // Close modal and navigate to results
    setUserInfoModalVisible(false);
    router.push("/(app)/tfsa/results");
  };

  const handleAddContribution = () => {
    if (newContribution.year && newContribution.amount > 0) {
      addContribution(newContribution.year, newContribution.amount);
      setNewContribution({ year: new Date().getFullYear(), amount: 0 });
    } else {
      Alert.alert("Invalid Input", "Please enter a valid year and amount");
    }
  };

  const handleAddWithdrawal = () => {
    if (newWithdrawal.year && newWithdrawal.amount > 0) {
      addWithdrawal(newWithdrawal.year, newWithdrawal.amount);
      setNewWithdrawal({ year: new Date().getFullYear(), amount: 0 });
    } else {
      Alert.alert("Invalid Input", "Please enter a valid year and amount");
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
            <Text style={styles.title}>TFSA Contribution Calculator</Text>
            <Text style={styles.subtitle}>
              Track your contribution room and avoid penalties
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
          
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Birth Year</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={birthYear.toString()}
                  onChangeText={(text) => setBirthYear(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="1990"
                />
              </View>
              {errors.birthYear && <Text style={styles.errorText}>{errors.birthYear}</Text>}
              <Text style={styles.helperText}>
                Your maximum lifetime TFSA contribution room: {formatCurrency(maxTFSARoom)}
              </Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Canadian Resident Since</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={canadianResidentSince.toString()}
                  onChangeText={(text) => setCanadianResidentSince(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="2009"
                />
              </View>
              <Text style={styles.helperText}>
                TFSA eligibility begins when you become a Canadian resident and are at least 18 years old
              </Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current TFSA Contribution Room</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={currentTFSARoom > 0 ? currentTFSARoom.toString() : ""}
                  onChangeText={(text) => setCurrentTFSARoom(Number(text.replace(/[^0-9]/g, "")))}
                  keyboardType="numeric"
                  placeholder="Enter your current room"
                />
              </View>
              <Text style={styles.helperText}>
                Enter your current TFSA contribution room (check your CRA account or T4A slip)
              </Text>
            </View>
            
            <View style={styles.advancedOptionsToggle}>
              <Text style={styles.advancedOptionsText}>Track Contributions & Withdrawals</Text>
              <Switch
                value={showAdvancedOptions}
                onValueChange={setShowAdvancedOptions}
                trackColor={{ false: Colors.lightGray, true: Colors.navyLight }}
                thumbColor={showAdvancedOptions ? Colors.navy : "#f4f3f4"}
              />
            </View>
            
            {showAdvancedOptions && (
              <>
                <Text style={styles.sectionTitle}>Past Contributions & Withdrawals</Text>
                
                <View style={styles.transactionSection}>
                  <Text style={styles.transactionTitle}>Past Contributions</Text>
                  
                  {pastContributions.length > 0 ? (
                    pastContributions.map((contribution, index) => (
                      <View key={`contribution-${index}`} style={styles.transactionItem}>
                        <Text style={styles.transactionYear}>{contribution.year}</Text>
                        <Text style={styles.transactionAmount}>{formatCurrency(contribution.amount)}</Text>
                        <TouchableOpacity 
                          style={styles.deleteButton}
                          onPress={() => removeContribution(index)}
                        >
                          <Trash2 size={16} color={Colors.error} />
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noTransactionsText}>No past contributions recorded</Text>
                  )}
                  
                  <View style={styles.addTransactionContainer}>
                    <View style={styles.transactionInputGroup}>
                      <Text style={styles.transactionLabel}>Year</Text>
                      <TextInput
                        style={styles.transactionInput}
                        value={newContribution.year.toString()}
                        onChangeText={(text) => setNewContribution({
                          ...newContribution,
                          year: Number(text.replace(/[^0-9]/g, ""))
                        })}
                        keyboardType="numeric"
                        placeholder="2023"
                      />
                    </View>
                    
                    <View style={styles.transactionInputGroup}>
                      <Text style={styles.transactionLabel}>Amount</Text>
                      <TextInput
                        style={styles.transactionInput}
                        value={newContribution.amount ? newContribution.amount.toString() : ""}
                        onChangeText={(text) => setNewContribution({
                          ...newContribution,
                          amount: Number(text.replace(/[^0-9]/g, ""))
                        })}
                        keyboardType="numeric"
                        placeholder="5000"
                      />
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.addButton}
                      onPress={handleAddContribution}
                    >
                      <Plus size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.transactionSection}>
                  <Text style={styles.transactionTitle}>Past Withdrawals</Text>
                  
                  {pastWithdrawals.length > 0 ? (
                    pastWithdrawals.map((withdrawal, index) => (
                      <View key={`withdrawal-${index}`} style={styles.transactionItem}>
                        <Text style={styles.transactionYear}>{withdrawal.year}</Text>
                        <Text style={styles.transactionAmount}>{formatCurrency(withdrawal.amount)}</Text>
                        <TouchableOpacity 
                          style={styles.deleteButton}
                          onPress={() => removeWithdrawal(index)}
                        >
                          <Trash2 size={16} color={Colors.error} />
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noTransactionsText}>No past withdrawals recorded</Text>
                  )}
                  
                  <View style={styles.addTransactionContainer}>
                    <View style={styles.transactionInputGroup}>
                      <Text style={styles.transactionLabel}>Year</Text>
                      <TextInput
                        style={styles.transactionInput}
                        value={newWithdrawal.year.toString()}
                        onChangeText={(text) => setNewWithdrawal({
                          ...newWithdrawal,
                          year: Number(text.replace(/[^0-9]/g, ""))
                        })}
                        keyboardType="numeric"
                        placeholder="2023"
                      />
                    </View>
                    
                    <View style={styles.transactionInputGroup}>
                      <Text style={styles.transactionLabel}>Amount</Text>
                      <TextInput
                        style={styles.transactionInput}
                        value={newWithdrawal.amount ? newWithdrawal.amount.toString() : ""}
                        onChangeText={(text) => setNewWithdrawal({
                          ...newWithdrawal,
                          amount: Number(text.replace(/[^0-9]/g, ""))
                        })}
                        keyboardType="numeric"
                        placeholder="1000"
                      />
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.addButton}
                      onPress={handleAddWithdrawal}
                    >
                      <Plus size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
            
            <View style={styles.tipContainer}>
              <Info size={18} color={Colors.navy} style={styles.tipIcon} />
              <Text style={styles.tipText}>
                The TFSA allows your investments to grow tax-free. Tracking your contribution room helps you avoid penalties and maximize your tax-free growth potential.
              </Text>
            </View>
            
            <TouchableOpacity style={styles.calculateButton} onPress={handleSubmit}>
              <Text style={styles.calculateButtonText}>Calculate Room</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.investmentButton} 
              onPress={() => router.push("/(app)/investment")}
            >
              <Text style={styles.investmentButtonText}>
                Use Investment Calculator to Project Growth
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <UserInfoModal
        visible={userInfoModalVisible}
        onClose={() => setUserInfoModalVisible(false)}
        onSubmit={handleUserInfoSubmit}
        calculatorType="TFSA Contribution Calculator"
        results={{
          birthYear,
          canadianResidentSince,
          currentTFSARoom,
          pastContributions,
          pastWithdrawals,
          hasOvercontributed,
          overcontributionAmount
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
  helperText: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 4,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
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
  transactionSection: {
    marginBottom: 20,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 12,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  transactionYear: {
    flex: 1,
    fontSize: 14,
    color: Colors.secondary,
  },
  transactionAmount: {
    flex: 2,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
    textAlign: "right",
    marginRight: 10,
  },
  deleteButton: {
    padding: 4,
  },
  noTransactionsText: {
    fontSize: 14,
    color: Colors.secondary,
    fontStyle: "italic",
    marginBottom: 12,
  },
  addTransactionContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 12,
  },
  transactionInputGroup: {
    flex: 1,
    marginRight: 8,
  },
  transactionLabel: {
    fontSize: 12,
    color: Colors.secondary,
    marginBottom: 4,
  },
  transactionInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "white",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: Colors.navy,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
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
  investmentButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#04233a',
  },
  investmentButtonText: {
    color: '#04233a',
    fontSize: 16,
    fontWeight: "600",
  },
});