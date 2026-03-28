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
import { useTaxStore, getProvinceOptions } from '@/store/taxStore';
import { Calculator, DollarSign, MapPin, ArrowLeft, ChevronDown } from 'lucide-react-native';
import UserInfoModal from '@/components/UserInfoModal';

export default function TaxCalculatorScreen() {
  const router = useRouter();
  const {
    taxableIncome,
    selectedProvince,
    otherDeductions,
    setTaxableIncome,
    setSelectedProvince,
    setOtherDeductions,
    calculateTax
  } = useTaxStore();

  const [incomeInput, setIncomeInput] = useState<string>(taxableIncome.toString());
  const [deductionsInput, setDeductionsInput] = useState<string>(otherDeductions.toString());
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false);
  const [provinceModalVisible, setProvinceModalVisible] = useState(false);

  const provinceOptions = getProvinceOptions();

  const handleCalculate = () => {
    const income = parseFloat(incomeInput) || 0;
    const deductions = parseFloat(deductionsInput) || 0;

    if (income <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid taxable income amount.');
      return;
    }

    setTaxableIncome(income);
    setOtherDeductions(deductions);
    calculateTax();
    setUserInfoModalVisible(true);
  };

  const handleUserInfoSubmit = (name: string, email: string) => {
    setUserInfoModalVisible(false);
    router.push('/tax-calculator/results');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/')}
        >
          <ArrowLeft size={20} color="#04233a" />
          <Text style={styles.backButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.header}>
        <Calculator size={48} color="#04233a" />
        <Text style={styles.title}>Federal Income Tax Calculator</Text>
        <Text style={styles.subtitle}>
          Calculate your federal income tax for 2025
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <DollarSign size={16} color="#04233a" />
            {' '}Annual Taxable Income
          </Text>
          <TextInput
            style={styles.input}
            value={incomeInput}
            onChangeText={setIncomeInput}
            placeholder="Enter your taxable income"
            keyboardType="numeric"
            testID="taxable-income-input"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <MapPin size={16} color="#04233a" />
            {' '}Province/Territory (for reference only)
          </Text>
          <TouchableOpacity
            style={styles.provinceSelector}
            onPress={() => setProvinceModalVisible(true)}
            testID="province-selector"
          >
            <Text style={styles.provinceSelectorText}>
              {provinceOptions.find(p => p.value === selectedProvince)?.label || 'Select Province'}
            </Text>
            <ChevronDown size={20} color="#04233a" />
          </TouchableOpacity>
          <Text style={styles.helperText}>
            Note: This calculator only shows federal tax rates
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <DollarSign size={16} color="#04233a" />
            {' '}Other Deductions (Optional)
          </Text>
          <TextInput
            style={styles.input}
            value={deductionsInput}
            onChangeText={setDeductionsInput}
            placeholder="Additional deductions or credits"
            keyboardType="numeric"
            testID="deductions-input"
          />
          <Text style={styles.helperText}>
            Enter any additional deductions or credits not included in standard calculations
          </Text>
        </View>

        <TouchableOpacity
          style={styles.calculateButton}
          onPress={handleCalculate}
          testID="calculate-button"
        >
          <Calculator size={20} color="#fff" />
          <Text style={styles.calculateButtonText}>Calculate Tax</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Tax Calculation Information</Text>
        <Text style={styles.infoText}>
          • Uses 2025 federal tax brackets only{'\n'}
          • Provides marginal and average federal tax rates{'\n'}
          • Shows detailed breakdown by federal tax bracket{'\n'}
          • Provincial taxes are not included in calculations
        </Text>
      </View>
      
      <UserInfoModal
        visible={userInfoModalVisible}
        onClose={() => setUserInfoModalVisible(false)}
        onSubmit={handleUserInfoSubmit}
        calculatorType="Income Tax Calculator"
        results={{
          taxableIncome: parseFloat(incomeInput) || 0,
          selectedProvince,
          otherDeductions: parseFloat(deductionsInput) || 0
        }}
      />
      
      {/* Province Selection Modal */}
      {provinceModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Province/Territory</Text>
            <ScrollView style={styles.provinceList} showsVerticalScrollIndicator={true}>
              {provinceOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.provinceOption,
                    selectedProvince === option.value && styles.provinceOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedProvince(option.value);
                    setProvinceModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.provinceOptionText,
                    selectedProvince === option.value && styles.provinceOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setProvinceModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  picker: {
    height: 50,
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
  provinceSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
  },
  provinceSelectorText: {
    fontSize: 16,
    color: '#04233a',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#04233a',
    marginBottom: 15,
    textAlign: 'center',
  },
  provinceList: {
    maxHeight: 300,
  },
  provinceOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  provinceOptionSelected: {
    backgroundColor: '#04233a',
  },
  provinceOptionText: {
    fontSize: 16,
    color: '#04233a',
  },
  provinceOptionTextSelected: {
    color: '#fff',
  },
  modalCloseButton: {
    backgroundColor: '#04233a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});