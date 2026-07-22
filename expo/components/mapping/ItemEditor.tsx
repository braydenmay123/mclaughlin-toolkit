import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  DollarSign,
  FileText,
  Tag,
  Percent,
  Calendar,
  Building,
  TrendingUp,
  Repeat,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { MappingItem, generateId } from '@/utils/mappingStorage';

interface ItemEditorProps {
  visible: boolean;
  onClose: () => void;
  onSave: (item: MappingItem) => void;
  item?: MappingItem;
  categoryName: string;
  categoryId: string;
  isLiability: boolean;
}

// Categories where contribution room / annual contribution make sense
const REGISTERED_ACCOUNT_IDS = ['tfsa', 'rrsp', 'fhsa', 'resp', 'rdsp'];
// Categories where interest rate matters most
const INTEREST_RELEVANT_IDS = [
  'credit-debt',
  'student-loans',
  'car-loans',
  'other-loans',
  'mortgage',
  'cash-savings',
  'non-registered',
];
// Categories where monthly income may apply
const INCOME_RELEVANT_IDS = ['real-estate', 'non-registered', 'business-equity'];

interface FormState {
  label: string;
  amount: string;
  accountType: string;
  notes: string;
  interestRate: string;
  monthlyPayment: string;
  annualContribution: string;
  contributionRoom: string;
  institution: string;
  maturityDate: string;
  monthlyIncome: string;
}

const emptyForm: FormState = {
  label: '',
  amount: '',
  accountType: '',
  notes: '',
  interestRate: '',
  monthlyPayment: '',
  annualContribution: '',
  contributionRoom: '',
  institution: '',
  maturityDate: '',
  monthlyIncome: '',
};

export default function ItemEditor({
  visible,
  onClose,
  onSave,
  item,
  categoryName,
  categoryId,
  isLiability,
}: ItemEditorProps) {
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isRegistered = REGISTERED_ACCOUNT_IDS.includes(categoryId);
  const interestRelevant = INTEREST_RELEVANT_IDS.includes(categoryId);
  const incomeRelevant = INCOME_RELEVANT_IDS.includes(categoryId);

  useEffect(() => {
    if (item) {
      setFormData({
        label: item.label,
        amount: item.amount.toString(),
        accountType: item.accountType || '',
        notes: item.notes || '',
        interestRate: item.interestRate?.toString() || '',
        monthlyPayment: item.monthlyPayment?.toString() || '',
        annualContribution: item.annualContribution?.toString() || '',
        contributionRoom: item.contributionRoom?.toString() || '',
        institution: item.institution || '',
        maturityDate: item.maturityDate || '',
        monthlyIncome: item.monthlyIncome?.toString() || '',
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
  }, [item, visible]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.label.trim()) newErrors.label = 'Label is required';
    const amount = parseFloat(formData.amount);
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount) || amount < 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const amount = parseFloat(formData.amount);
    const numOrUndefined = (v: string): number | undefined => {
      if (!v.trim()) return undefined;
      const n = parseFloat(v);
      return isNaN(n) ? undefined : n;
    };
    const savedItem: MappingItem = {
      id: item?.id || generateId(),
      label: formData.label.trim(),
      amount,
      accountType: formData.accountType.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      interestRate: numOrUndefined(formData.interestRate),
      monthlyPayment: numOrUndefined(formData.monthlyPayment),
      annualContribution: numOrUndefined(formData.annualContribution),
      contributionRoom: numOrUndefined(formData.contributionRoom),
      institution: formData.institution.trim() || undefined,
      maturityDate: formData.maturityDate.trim() || undefined,
      monthlyIncome: numOrUndefined(formData.monthlyIncome),
    };
    onSave(savedItem);
    onClose();
  };

  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const formatAmountInput = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('');
    return cleaned;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{item ? 'Edit Item' : 'Add Item'}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryLabel}>Adding to:</Text>
            <Text style={styles.categoryName}>{categoryName}</Text>
          </View>

          <View style={styles.form}>
            {/* Label */}
            <LabeledInput
              label="Item Name *"
              icon={<Tag size={20} color={Colors.textSecondary} />}
              value={formData.label}
              onChangeText={(v) => handleInputChange('label', v)}
              placeholder={isLiability ? 'e.g., Visa Credit Card' : 'e.g., TD Chequing Account'}
              error={errors.label}
            />

            {/* Amount */}
            <LabeledInput
              label={isLiability ? 'Amount Owed *' : 'Current Value *'}
              icon={<DollarSign size={20} color={Colors.textSecondary} />}
              value={formData.amount}
              onChangeText={(v) => handleInputChange('amount', formatAmountInput(v))}
              placeholder="0.00"
              keyboardType="decimal-pad"
              error={errors.amount}
            />

            {/* Institution */}
            <LabeledInput
              label="Institution (Optional)"
              icon={<Building size={20} color={Colors.textSecondary} />}
              value={formData.institution}
              onChangeText={(v) => handleInputChange('institution', v)}
              placeholder="e.g., TD, RBC, Wealthsimple"
            />

            {/* Account Type */}
            <LabeledInput
              label="Account Type (Optional)"
              icon={<FileText size={20} color={Colors.textSecondary} />}
              value={formData.accountType}
              onChangeText={(v) => handleInputChange('accountType', v)}
              placeholder={
                isLiability
                  ? 'e.g., Credit Card, Line of Credit'
                  : 'e.g., High Interest Savings, GIC'
              }
            />

            {/* Interest Rate - for liabilities & interest-bearing assets */}
            {interestRelevant && (
              <LabeledInput
                label={isLiability ? 'Interest Rate (APR %)' : 'Interest Rate (%)'}
                icon={<Percent size={20} color={Colors.textSecondary} />}
                value={formData.interestRate}
                onChangeText={(v) => handleInputChange('interestRate', formatAmountInput(v))}
                placeholder="e.g., 19.99"
                keyboardType="decimal-pad"
              />
            )}

            {/* Monthly Payment - for liabilities */}
            {isLiability && (
              <LabeledInput
                label="Monthly Payment (Optional)"
                icon={<Repeat size={20} color={Colors.textSecondary} />}
                value={formData.monthlyPayment}
                onChangeText={(v) => handleInputChange('monthlyPayment', formatAmountInput(v))}
                placeholder="e.g., 250"
                keyboardType="decimal-pad"
              />
            )}

            {/* Monthly Income - for income-generating assets */}
            {incomeRelevant && (
              <LabeledInput
                label="Monthly Income Generated (Optional)"
                icon={<TrendingUp size={20} color={Colors.textSecondary} />}
                value={formData.monthlyIncome}
                onChangeText={(v) => handleInputChange('monthlyIncome', formatAmountInput(v))}
                placeholder="e.g., rent, dividends"
                keyboardType="decimal-pad"
              />
            )}

            {/* Registered account fields */}
            {isRegistered && (
              <>
                <LabeledInput
                  label="Annual Contribution (Optional)"
                  icon={<TrendingUp size={20} color={Colors.textSecondary} />}
                  value={formData.annualContribution}
                  onChangeText={(v) =>
                    handleInputChange('annualContribution', formatAmountInput(v))
                  }
                  placeholder="e.g., 7000"
                  keyboardType="decimal-pad"
                />
                <LabeledInput
                  label="Remaining Contribution Room (Optional)"
                  icon={<DollarSign size={20} color={Colors.textSecondary} />}
                  value={formData.contributionRoom}
                  onChangeText={(v) =>
                    handleInputChange('contributionRoom', formatAmountInput(v))
                  }
                  placeholder="e.g., 35000"
                  keyboardType="decimal-pad"
                />
              </>
            )}

            {/* Maturity Date - for GICs / term deposits */}
            <LabeledInput
              label="Maturity Date (Optional)"
              icon={<Calendar size={20} color={Colors.textSecondary} />}
              value={formData.maturityDate}
              onChangeText={(v) => handleInputChange('maturityDate', v)}
              placeholder="YYYY-MM-DD"
            />

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.notes}
                  onChangeText={(v) => handleInputChange('notes', v)}
                  placeholder="Any additional details..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{item ? 'Update Item' : 'Add Item'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function LabeledInput({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  error,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  error?: string;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {icon}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize="words"
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  categoryInfo: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: Colors.accentLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accent,
  },
  categoryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '400' as const,
    marginLeft: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    marginLeft: 0,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.background,
    letterSpacing: -0.2,
  },
});
