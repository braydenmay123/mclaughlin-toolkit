import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLargePurchaseStore } from '@/store/largePurchaseStore';
import { ShoppingCart, DollarSign, TrendingUp, Clock, Percent, ArrowLeft } from 'lucide-react-native';
import UserInfoModal from '@/components/UserInfoModal';

export default function LargePurchaseScreen() {
  const router = useRouter();
  const {
    purchaseAmount,
    downPayment,
    loanRate,
    loanTerm,
    expectedReturn,
    monthlySavings,
    inflationRate,
    setPurchaseAmount,
    setDownPayment,
    setLoanRate,
    setLoanTerm,
    setExpectedReturn,
    setMonthlySavings,
    setInflationRate,
    calculateScenarios
  } = useLargePurchaseStore();

  const [purchaseInput, setPurchaseInput] = useState<string>(purchaseAmount.toString());
  const [downPaymentInput, setDownPaymentInput] = useState<string>(downPayment.toString());
  const [loanRateInput, setLoanRateInput] = useState<string>((loanRate * 100).toString());
  const [loanTermInput, setLoanTermInput] = useState<string>(loanTerm.toString());
  const [expectedReturnInput, setExpectedReturnInput] = useState<string>((expectedReturn * 100).toString());
  const [monthlySavingsInput, setMonthlySavingsInput] = useState<string>(monthlySavings.toString());
  const [inflationRateInput, setInflationRateInput] = useState<string>((inflationRate * 100).toString());
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false);

  const handleCalculate = () => {
    const purchase = parseFloat(purchaseInput) || 0;
    const down = parseFloat(downPaymentInput) || 0;
    const lRate = (parseFloat(loanRateInput) || 0) / 100;
    const lTerm = parseFloat(loanTermInput) || 0;
    const eReturn = (parseFloat(expectedReturnInput) || 0) / 100;
    const mSavings = parseFloat(monthlySavingsInput) || 0;
    const iRate = (parseFloat(inflationRateInput) || 0) / 100;

    if (purchase <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid purchase amount.');
      return;
    }

    if (down >= purchase) {
      Alert.alert('Invalid Input', 'Down payment cannot be greater than or equal to purchase amount.');
      return;
    }

    setPurchaseAmount(purchase);
    setDownPayment(down);
    setLoanRate(lRate);
    setLoanTerm(lTerm);
    setExpectedReturn(eReturn);
    setMonthlySavings(mSavings);
    setInflationRate(iRate);
    
    calculateScenarios();
    setUserInfoModalVisible(true);
  };

  const handleUserInfoSubmit = (name: string, email: string) => {
    setUserInfoModalVisible(false);
    router.push('/large-purchase/results');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(app)')}
        >
          <ArrowLeft size={20} color="#04233a" />
          <Text style={styles.backButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.header}>
        <ShoppingCart size={48} color="#04233a" />
        <Text style={styles.title}>Large Purchase Calculator</Text>
        <Text style={styles.subtitle}>
          Compare lump sum vs financing vs saving strategies
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Purchase Details</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <DollarSign size={16} color="#04233a" />
            {' '}Purchase Amount
          </Text>
          <TextInput
            style={styles.input}
            value={purchaseInput}
            onChangeText={setPurchaseInput}
            placeholder="Enter purchase amount"
            keyboardType="numeric"
            testID="purchase-amount-input"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <DollarSign size={16} color="#04233a" />
            {' '}Down Payment
          </Text>
          <TextInput
            style={styles.input}
            value={downPaymentInput}
            onChangeText={setDownPaymentInput}
            placeholder="Enter down payment amount"
            keyboardType="numeric"
            testID="down-payment-input"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>
              <Percent size={16} color="#04233a" />
              {' '}Loan Rate (%)
            </Text>
            <TextInput
              style={styles.input}
              value={loanRateInput}
              onChangeText={setLoanRateInput}
              placeholder="6.0"
              keyboardType="numeric"
              testID="loan-rate-input"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>
              <Clock size={16} color="#04233a" />
              {' '}Loan Term (years)
            </Text>
            <TextInput
              style={styles.input}
              value={loanTermInput}
              onChangeText={setLoanTermInput}
              placeholder="5"
              keyboardType="numeric"
              testID="loan-term-input"
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Investment Assumptions</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <TrendingUp size={16} color="#04233a" />
            {' '}Expected Return (%)
          </Text>
          <TextInput
            style={styles.input}
            value={expectedReturnInput}
            onChangeText={setExpectedReturnInput}
            placeholder="7.0"
            keyboardType="numeric"
            testID="expected-return-input"
          />
          <Text style={styles.helperText}>
            Annual return rate for invested funds
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Savings Strategy</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <DollarSign size={16} color="#04233a" />
            {' '}Monthly Savings Capacity
          </Text>
          <TextInput
            style={styles.input}
            value={monthlySavingsInput}
            onChangeText={setMonthlySavingsInput}
            placeholder="1000"
            keyboardType="numeric"
            testID="monthly-savings-input"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <Percent size={16} color="#04233a" />
            {' '}Inflation Rate (%)
          </Text>
          <TextInput
            style={styles.input}
            value={inflationRateInput}
            onChangeText={setInflationRateInput}
            placeholder="3.0"
            keyboardType="numeric"
            testID="inflation-rate-input"
          />
          <Text style={styles.helperText}>
            Expected annual price inflation for this purchase
          </Text>
        </View>

        <TouchableOpacity
          style={styles.calculateButton}
          onPress={handleCalculate}
          testID="calculate-button"
        >
          <ShoppingCart size={20} color="#fff" />
          <Text style={styles.calculateButtonText}>Compare Scenarios</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>What This Calculator Shows</Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Lump Sum:</Text> Pay cash now vs. investing that money{'\n'}
          • <Text style={styles.bold}>Finance + Invest:</Text> Take a loan and invest the cash{'\n'}
          • <Text style={styles.bold}>Save First:</Text> Delay purchase and save monthly{'\n'}
          • Net worth impact and optimal strategy recommendation
        </Text>
      </View>
      
      <UserInfoModal
        visible={userInfoModalVisible}
        onClose={() => setUserInfoModalVisible(false)}
        onSubmit={handleUserInfoSubmit}
        calculatorType="Large Purchase Calculator"
        results={{
          purchaseAmount: parseFloat(purchaseInput) || 0,
          downPayment: parseFloat(downPaymentInput) || 0,
          loanRate: (parseFloat(loanRateInput) || 0) / 100,
          loanTerm: parseFloat(loanTermInput) || 0,
          expectedReturn: (parseFloat(expectedReturnInput) || 0) / 100,
          monthlySavings: parseFloat(monthlySavingsInput) || 0,
          inflationRate: (parseFloat(inflationRateInput) || 0) / 100
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#04233a',
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#04233a',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#04233a',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic' as const,
  },
  calculateButton: {
    backgroundColor: '#04233a',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#04233a',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold' as const,
    color: '#04233a',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#04233a',
    marginLeft: 8,
    fontWeight: '600' as const,
  },
});