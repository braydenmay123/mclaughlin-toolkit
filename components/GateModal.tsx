import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check, Mail, User, Phone, MessageSquare } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { setGateStatus } from '@/utils/gateStorage';
import { trackEvent, AnalyticsEvents } from '@/utils/analytics';

interface GateModalProps {
  visible: boolean;
  onSuccess: () => void;
  onClose: () => void;
  pageSource: string;
  title: string;
  subtitle: string;
}

const interestOptions = [
  'Investment Planning',
  'Retirement Planning',
  'Tax Strategies',
  'Insurance Planning',
  'Estate Planning',
  'Education Savings',
  'First Home Purchase',
  'General Financial Advice',
];

export default function GateModal({
  visible,
  onSuccess,
  onClose,
  pageSource,
  title,
  subtitle,
}: GateModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    notes: '',
    honeypot: '', // Hidden spam protection field
    acceptedTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.interest) {
      newErrors.interest = 'Please select your area of interest';
    }

    if (!formData.acceptedTerms) {
      newErrors.acceptedTerms = 'You must accept the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    trackEvent(AnalyticsEvents.GATE_SUBMITTED, {
      pageSource,
      interest: formData.interest,
      hasPhone: !!formData.phone,
      hasNotes: !!formData.notes,
    });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          interest: formData.interest,
          notes: formData.notes || undefined,
          pageSource,
          honeypot: formData.honeypot,
        }),
      });

      const result = await response.json();

      if (result.ok) {
        // Save gate status locally
        await setGateStatus({
          passed: true,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          interest: formData.interest,
        });

        onSuccess();
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Gate submission error:', error);
      Alert.alert(
        'Submission Error',
        'There was an issue submitting your information. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInterestSelect = (interest: string) => {
    setFormData(prev => ({ ...prev, interest }));
    if (errors.interest) {
      setErrors(prev => ({ ...prev, interest: '' }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  React.useEffect(() => {
    if (visible) {
      trackEvent(AnalyticsEvents.GATE_SHOWN, { pageSource });
    }
  }, [visible, pageSource]);

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
          <Text style={styles.headerTitle}>Welcome</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <View style={styles.form}>
            {/* Hidden honeypot field for spam protection */}
            <TextInput
              style={styles.honeypot}
              value={formData.honeypot}
              onChangeText={(value) => setFormData(prev => ({ ...prev, honeypot: value }))}
              autoComplete="off"
              tabIndex={-1}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <View style={styles.inputContainer}>
                <User size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="Enter your email address"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number (Optional)</Text>
              <View style={styles.inputContainer}>
                <Phone size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  placeholder="Enter your phone number"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>What are you most interested in? *</Text>
              <View style={styles.interestGrid}>
                {interestOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.interestOption,
                      formData.interest === option && styles.interestOptionSelected,
                    ]}
                    onPress={() => handleInterestSelect(option)}
                  >
                    <Text
                      style={[
                        styles.interestOptionText,
                        formData.interest === option && styles.interestOptionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.interest && <Text style={styles.errorText}>{errors.interest}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Additional Notes (Optional)</Text>
              <View style={styles.inputContainer}>
                <MessageSquare size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.notes}
                  onChangeText={(value) => handleInputChange('notes', value)}
                  placeholder="Any specific questions or areas you'd like to discuss?"
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => {
                  setFormData(prev => ({ ...prev, acceptedTerms: !prev.acceptedTerms }));
                  if (errors.acceptedTerms) {
                    setErrors(prev => ({ ...prev, acceptedTerms: '' }));
                  }
                }}
              >
                <View style={[styles.checkboxBox, formData.acceptedTerms && styles.checkboxBoxChecked]}>
                  {formData.acceptedTerms && <Check size={16} color={Colors.background} />}
                </View>
                <Text style={styles.termsText}>
                  I accept the{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
              {errors.acceptedTerms && <Text style={styles.errorText}>{errors.acceptedTerms}</Text>}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={Colors.background} />
            ) : (
              <Text style={styles.submitButtonText}>Continue</Text>
            )}
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
  titleContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '90%',
  },
  form: {
    paddingHorizontal: 24,
  },
  honeypot: {
    position: 'absolute',
    left: -9999,
    opacity: 0,
    height: 0,
    width: 0,
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
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
  interestOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  interestOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  interestOptionTextSelected: {
    color: Colors.background,
  },
  termsContainer: {
    marginTop: 8,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxBoxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600',
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
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.background,
    letterSpacing: -0.2,
  },
});