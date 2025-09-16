import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import { Mail, User, X, FileText, CheckSquare, Square, Shield, Calculator } from "lucide-react-native";
import Colors from "@/constants/colors";
import { storeUserAnalytics } from "@/utils/emailService";

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

interface UserInfoModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name?: string, email?: string) => void;
  calculatorType?: string;
  results?: any;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
}

export default function UserInfoModal({
  visible,
  onClose,
  onSubmit,
  calculatorType,
  results,
  title,
  subtitle,
}: UserInfoModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; terms?: string }>({});
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [hasLogoError, setHasLogoError] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible) {
      setName("");
      setEmail("");
      setAcceptedTerms(false);
      setErrors({});
      setIsSubmitting(false);
      setFocusedField(null);
    }
  }, [visible]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2 && /^[a-zA-Z\s'-\.]+$/.test(name.trim());
  };

  const handleSubmit = async () => {
    const newErrors: { name?: string; email?: string; terms?: string } = {};

    // Enhanced validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (!validateName(name)) {
      newErrors.name = "Please enter a valid name (letters, spaces, hyphens, and apostrophes only)";
    } else if (name.trim().length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    } else if (email.trim().length > 100) {
      newErrors.email = "Email must be less than 100 characters";
    }

    if (!acceptedTerms) {
      newErrors.terms = "You must accept the terms and conditions to continue";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      
      try {
        console.log('Submitting user info:', { 
          name: name.trim(), 
          email: email.trim(), 
          calculatorType: calculatorType || 'Calculator' 
        });
        
        // Store user analytics for advisor tracking
        await storeUserAnalytics({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          calculatorType: calculatorType || 'Calculator',
          results,
          timestamp: new Date().toISOString()
        });
        
        console.log('User analytics stored successfully');
        
        // Proceed to results
        onSubmit(name.trim(), email.trim().toLowerCase());
        resetForm();
        
      } catch (error) {
        console.error('Failed to store user analytics:', error);
        
        // Show error but still allow user to proceed
        Alert.alert(
          "Warning",
          "There was an issue saving your information for our records, but you can still view your results. Would you like to continue?",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Continue", 
              onPress: () => {
                onSubmit(name.trim(), email.trim().toLowerCase());
                resetForm();
              }
            }
          ]
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const resetForm = () => {
    setName("");
    setEmail("");
    setAcceptedTerms(false);
    setErrors({});
  };
  

  
  const handleClose = () => {
    if (isSubmitting) {
      Alert.alert(
        "Processing",
        "Please wait while we process your information.",
        [{ text: "OK" }]
      );
      return;
    }
    
    resetForm();
    onClose();
  };

  const getCalculatorDisplayName = (type?: string): string => {
    if (!type) return 'calculator';
    
    const displayNames: Record<string, string> = {
      'Home Affordability Calculator': 'home affordability',
      'Investment Growth Calculator': 'investment growth',
      'TFSA Contribution Calculator': 'TFSA contribution',
      'Income Tax Calculator': 'income tax',
      'Large Purchase Calculator': 'large purchase',
      'Investment ROI vs Life Insurance': 'investment vs insurance'
    };
    return displayNames[type] || type.toLowerCase();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.centeredView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View style={styles.modalContainer}>
            <ScrollView 
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              <View style={styles.modalView}>
                <View style={styles.header}>
                  <Text style={styles.title}>{title || "Get Your Results"}</Text>
                  <TouchableOpacity 
                    onPress={handleClose} 
                    style={styles.closeButton}
                    activeOpacity={0.7}
                  >
                    <X size={20} color={Colors.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.logoContainer}>
                  {isLogoLoading && <ActivityIndicator size="small" color={Colors.primary} />}
                  
                  <Image
                    source={{ 
                      uri: "https://mclaughlinfinancial.ca/wp-content/uploads/2024/11/logo.png",
                      cache: "force-cache"
                    }}
                    style={[styles.logo, hasLogoError && styles.hidden]}
                    resizeMode="contain"
                    onLoadStart={() => setIsLogoLoading(true)}
                    onLoadEnd={() => setIsLogoLoading(false)}
                    onError={() => {
                      setHasLogoError(true);
                      setIsLogoLoading(false);
                    }}
                  />
                  
                  {hasLogoError && (
                    <Text style={styles.fallbackText}>McLaughlin Financial Group</Text>
                  )}
                </View>

                <Text style={styles.subtitle}>
                  {subtitle || `Enter your details to view your ${getCalculatorDisplayName(calculatorType)} results and receive a PDF copy`}
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name *</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedField === "name" && styles.inputContainerFocused,
                    errors.name && styles.inputContainerError
                  ]}>
                    <View style={styles.iconContainer}>
                      <User size={18} color={errors.name ? Colors.error : Colors.primary} />
                    </View>
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={(text) => {
                        setName(text);
                        if (errors.name) {
                          setErrors(prev => ({ ...prev, name: undefined }));
                        }
                      }}
                      placeholder="Enter your full name"
                      placeholderTextColor={Colors.textLight}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      autoCapitalize="words"
                      returnKeyType="next"
                      editable={!isSubmitting}
                      maxLength={50}
                    />
                  </View>
                  {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address *</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedField === "email" && styles.inputContainerFocused,
                    errors.email && styles.inputContainerError
                  ]}>
                    <View style={styles.iconContainer}>
                      <Mail size={18} color={errors.email ? Colors.error : Colors.primary} />
                    </View>
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        if (errors.email) {
                          setErrors(prev => ({ ...prev, email: undefined }));
                        }
                      }}
                      placeholder="Enter your email address"
                      placeholderTextColor={Colors.textLight}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                      editable={!isSubmitting}
                      maxLength={100}
                    />
                  </View>
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                <View style={styles.termsContainer}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => {
                      setAcceptedTerms(!acceptedTerms);
                      if (errors.terms) {
                        setErrors(prev => ({ ...prev, terms: undefined }));
                      }
                    }}
                    activeOpacity={0.7}
                    disabled={isSubmitting}
                  >
                    {acceptedTerms ? (
                      <CheckSquare size={20} color={Colors.primary} />
                    ) : (
                      <Square size={20} color={errors.terms ? Colors.error : Colors.border} />
                    )}
                    <Text style={[
                      styles.checkboxText,
                      errors.terms && styles.checkboxTextError
                    ]}>
                      I accept the terms and conditions *
                    </Text>
                  </TouchableOpacity>
                  
                  <View style={styles.termsTextContainer}>
                    <Text style={styles.termsText}>
                      By submitting this form, you acknowledge that:
                    </Text>
                    <Text style={styles.termsBullet}>
                      • McLaughlin Financial Group may collect and store your information
                    </Text>
                    <Text style={styles.termsBullet}>
                      • We may contact you regarding our financial services
                    </Text>
                    <Text style={styles.termsBullet}>
                      • Calculator results are estimates and not financial advice
                    </Text>
                    <Text style={styles.termsBullet}>
                      • Actual results may vary and professional advice is recommended
                    </Text>
                  </View>
                  
                  {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
                </View>
                


                <View style={styles.benefitsContainer}>
                  <Text style={styles.benefitsTitle}>📋 What you&apos;ll receive:</Text>
                  
                  <View style={styles.benefitItem}>
                    <Calculator size={16} color={Colors.primary} style={styles.benefitIcon} />
                    <Text style={styles.benefitText}>Detailed calculation results and analysis</Text>
                  </View>
                  
                  <View style={styles.benefitItem}>
                    <FileText size={16} color={Colors.primary} style={styles.benefitIcon} />
                    <Text style={styles.benefitText}>Downloadable PDF report for your records</Text>
                  </View>
                  
                  <View style={styles.benefitItem}>
                    <Shield size={16} color={Colors.primary} style={styles.benefitIcon} />
                    <Text style={styles.benefitText}>Optional consultation with our financial advisor</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  activeOpacity={0.8}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <FileText size={18} color="white" style={styles.buttonIcon} />
                  )}
                  <Text style={styles.submitButtonText}>
                    {isSubmitting ? "Processing..." : "📊 Get My Results"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.privacyContainer}>
                  <Shield size={14} color={Colors.textSecondary} style={styles.privacyIcon} />
                  <Text style={styles.privacyText}>
                    Your information is secure and will only be used to provide your results and optional consultation.
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(4, 35, 58, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 420,
    maxHeight: screenHeight * 0.8,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  modalView: {
    width: "100%",
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: isSmallScreen ? 20 : 28,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: -0.3,
    flex: 1,
  },
  closeButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: Colors.backgroundGray,
  },
  logoContainer: {
    alignItems: "center",
    height: 50,
    justifyContent: "center",
    marginBottom: 24,
  },
  logo: {
    width: 160,
    height: 50,
  },
  hidden: {
    display: "none",
  },
  fallbackText: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.primary,
    textAlign: "center",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 28,
    lineHeight: 22,
    textAlign: "center",
    fontWeight: "500",
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
    backgroundColor: Colors.backgroundGray,
    overflow: "hidden",
    minHeight: 56,
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
  errorText: {
    color: Colors.error,
    fontSize: 13,
    marginTop: 8,
    marginLeft: 6,
    fontWeight: "500",
  },
  termsContainer: {
    marginBottom: 28,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  checkboxText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "600",
    marginLeft: 12,
  },
  checkboxTextError: {
    color: Colors.error,
  },
  benefitsContainer: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  benefitIcon: {
    marginRight: 10,
  },
  benefitText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  privacyContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
    paddingHorizontal: 4,
  },
  privacyIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  privacyText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 16,
    fontStyle: "italic",
  },
  termsTextContainer: {
    backgroundColor: Colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  termsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "600",
    marginBottom: 8,
  },
  termsBullet: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.backgroundGray,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  previewButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.textLight,
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
});