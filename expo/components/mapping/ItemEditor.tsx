import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, DollarSign, FileText, Tag } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { MappingItem, generateId } from '@/utils/mappingStorage';

interface ItemEditorProps {
  visible: boolean;
  onClose: () => void;
  onSave: (item: MappingItem) => void;
  item?: MappingItem;
  categoryName: string;
  isLiability: boolean;
}

export default function ItemEditor({
  visible,
  onClose,
  onSave,
  item,
  categoryName,
  isLiability,
}: ItemEditorProps) {
  const [formData, setFormData] = useState({
    label: '',
    amount: '',
    accountType: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData({
        label: item.label,
        amount: item.amount.toString(),
        accountType: item.accountType || '',
        notes: item.notes || '',
      });
    } else {
      setFormData({
        label: '',
        amount: '',
        accountType: '',
        notes: '',
      });
    }
    setErrors({});
  }, [item, visible]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.label.trim()) {
      newErrors.label = 'Label is required';
    }

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
    const savedItem: MappingItem = {
      id: item?.id || generateId(),
      label: formData.label.trim(),
      amount,
      accountType: formData.accountType.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    };

    onSave(savedItem);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatAmountInput = (value: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
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
          <Text style={styles.headerTitle}>
            {item ? 'Edit Item' : 'Add Item'}
          </Text>
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
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Item Name *</Text>
              <View style={styles.inputContainer}>
                <Tag size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.label}
                  onChangeText={(value) => handleInputChange('label', value)}
                  placeholder={isLiability ? "e.g., Visa Credit Card" : "e.g., TD Chequing Account"}
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="words"
                />
              </View>
              {errors.label && <Text style={styles.errorText}>{errors.label}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {isLiability ? 'Amount Owed *' : 'Current Value *'}
              </Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.amount}
                  onChangeText={(value) => handleInputChange('amount', formatAmountInput(value))}
                  placeholder="0.00"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                />
              </View>
              {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Type (Optional)</Text>
              <View style={styles.inputContainer}>
                <FileText size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.accountType}
                  onChangeText={(value) => handleInputChange('accountType', value)}
                  placeholder={isLiability ? "e.g., Credit Card, Line of Credit" : "e.g., High Interest Savings, GIC"}
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <View style={styles.inputContainer}>
                <FileText size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.notes}
                  onChangeText={(value) => handleInputChange('notes', value)}
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
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {item ? 'Update Item' : 'Add Item'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
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
    fontWeight: '600',
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
    fontWeight: '700',
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
    fontWeight: '600',
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
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '400',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
    fontWeight: '600',
    color: Colors.background,
    letterSpacing: -0.2,
  },
});