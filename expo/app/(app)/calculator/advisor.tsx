import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, Mail, Phone, User } from "lucide-react-native";
import Colors from "@/constants/colors";
import ToolkitHeader from "@/components/ToolkitHeader";

export default function AdvisorScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    setErrors(newErrors);
    
    // If no errors, submit form
    if (Object.keys(newErrors).length === 0) {
      Alert.alert(
        "Request Submitted",
        "Thank you for your interest! Joe will contact you within 1 business day.",
        [{ text: "OK" }]
      );
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        preferredDate: "",
        message: "",
      });
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
            <Text style={styles.title}>Talk with Joe</Text>
            <Text style={styles.subtitle}>
              Get personalized guidance for your home buying journey
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Name</Text>
              <View style={styles.inputContainer}>
                <User size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="John Smith"
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  placeholder="john@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <Phone size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholder="(555) 123-4567"
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferred Contact Date (Optional)</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color={Colors.navy} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.preferredDate}
                  onChangeText={(text) => setFormData({ ...formData, preferredDate: text })}
                  placeholder="MM/DD/YYYY"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message (Optional)</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={styles.textArea}
                  value={formData.message}
                  onChangeText={(text) => setFormData({ ...formData, message: text })}
                  placeholder="Tell us about your home buying goals and any specific questions you have..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Request Consultation</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.contactInfoContainer}>
            <Text style={styles.contactInfoTitle}>Contact Information</Text>
            <Text style={styles.contactInfoText}>
              McLaughlin Financial Group
            </Text>
            <Text style={styles.contactInfoText}>
              1 Elora Street North, Unit 1
            </Text>
            <Text style={styles.contactInfoText}>
              Harriston, Ontario
            </Text>
            <Text style={styles.contactInfoText}>
              Phone: 519-510-0411
            </Text>
            <Text style={styles.contactInfoText}>
              Email: info@mclaughlinfinancial.ca
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
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
    fontSize: 24,
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
  formContainer: {
    paddingHorizontal: 20,
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
  textAreaContainer: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  textArea: {
    flex: 1,
    height: 100,
    fontSize: 16,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: Colors.navy,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  contactInfoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: Colors.navyLight,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  contactInfoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 12,
  },
  contactInfoText: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 6,
    lineHeight: 20,
  },
});