import React from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, FileText, AlertTriangle, Scale, Users, Mail } from "lucide-react-native";
import Colors from "@/constants/colors";
import ToolkitHeader from "@/components/ToolkitHeader";

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ToolkitHeader />
        
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={Colors.primary} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <FileText size={32} color={Colors.primary} />
            <Text style={styles.title}>Terms of Service</Text>
          </View>
          <Text style={styles.subtitle}>
            Last updated: January 14, 2025
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.sectionText}>
              By accessing and using the McLaughlin Toolkit mobile application (&quot;the App&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Description of Service</Text>
            <Text style={styles.sectionText}>
              McLaughlin Toolkit provides financial calculators and planning tools designed to help users make informed financial decisions. Our services include:
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletPoint}>• Home buying and mortgage calculators</Text>
              <Text style={styles.bulletPoint}>• Investment growth and retirement planning tools</Text>
              <Text style={styles.bulletPoint}>• Tax savings and TFSA/RRSP calculators</Text>
              <Text style={styles.bulletPoint}>• Budget simulation and financial planning tools</Text>
              <Text style={styles.bulletPoint}>• Educational resources and financial guidance</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
            <View style={styles.iconTextContainer}>
              <Users size={20} color={Colors.primary} />
              <Text style={styles.iconText}>Your Obligations</Text>
            </View>
            <Text style={styles.sectionText}>
              As a user of our service, you agree to:
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletPoint}>• Provide accurate and truthful information when using our calculators</Text>
              <Text style={styles.bulletPoint}>• Use the App only for lawful purposes and in accordance with these Terms</Text>
              <Text style={styles.bulletPoint}>• Not attempt to gain unauthorized access to any part of the App</Text>
              <Text style={styles.bulletPoint}>• Not use the App to transmit any harmful or malicious code</Text>
              <Text style={styles.bulletPoint}>• Respect the intellectual property rights of McLaughlin Financial Group</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Financial Disclaimer</Text>
            <View style={styles.warningContainer}>
              <AlertTriangle size={24} color={Colors.warning} />
              <Text style={styles.warningTitle}>Important Financial Disclaimer</Text>
            </View>
            <Text style={styles.sectionText}>
              The calculators and tools provided in this App are for informational and educational purposes only. They are not intended to provide specific financial, investment, tax, legal, accounting, or other professional advice.
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletPoint}>• Results are estimates based on the information you provide and certain assumptions</Text>
              <Text style={styles.bulletPoint}>• Actual results may vary significantly from calculated projections</Text>
              <Text style={styles.bulletPoint}>• Past performance does not guarantee future results</Text>
              <Text style={styles.bulletPoint}>• You should consult with qualified professionals before making financial decisions</Text>
              <Text style={styles.bulletPoint}>• McLaughlin Financial Group is not responsible for any financial decisions made based on these calculations</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Intellectual Property Rights</Text>
            <Text style={styles.sectionText}>
              The App and its original content, features, and functionality are and will remain the exclusive property of McLaughlin Financial Group and its licensors. The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Privacy and Data Protection</Text>
            <Text style={styles.sectionText}>
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. By using our App, you agree to the collection and use of information in accordance with our Privacy Policy.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
            <View style={styles.iconTextContainer}>
              <Scale size={20} color={Colors.primary} />
              <Text style={styles.iconText}>Legal Limitations</Text>
            </View>
            <Text style={styles.sectionText}>
              In no event shall McLaughlin Financial Group, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Disclaimer of Warranties</Text>
            <Text style={styles.sectionText}>
              The information on this App is provided on an &quot;as is&quot; basis. To the fullest extent permitted by law, McLaughlin Financial Group excludes all representations, warranties, conditions, and terms whether express, implied, or statutory, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Indemnification</Text>
            <Text style={styles.sectionText}>
              You agree to defend, indemnify, and hold harmless McLaughlin Financial Group and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney&apos;s fees).
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Termination</Text>
            <Text style={styles.sectionText}>
              We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will cease immediately.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Governing Law</Text>
            <Text style={styles.sectionText}>
              These Terms shall be interpreted and governed by the laws of the Province of Ontario, Canada, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. Changes to Terms</Text>
            <Text style={styles.sectionText}>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>13. Contact Information</Text>
            <View style={styles.iconTextContainer}>
              <Mail size={20} color={Colors.primary} />
              <Text style={styles.iconText}>Questions About These Terms?</Text>
            </View>
            <Text style={styles.sectionText}>
              If you have any questions about these Terms of Service, please contact us:
            </Text>
            <View style={styles.contactContainer}>
              <Text style={styles.contactText}>McLaughlin Financial Group</Text>
              <Text style={styles.contactText}>1 Elora Street North, Unit 1</Text>
              <Text style={styles.contactText}>Harriston, Ontario</Text>
              <Text style={styles.contactText}>Phone: 519-510-0411</Text>
              <Text style={styles.contactText}>Email: info@mclaughlinfinancial.ca</Text>
            </View>
          </View>

          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimerTitle}>Acknowledgment</Text>
            <Text style={styles.disclaimerText}>
              By using McLaughlin Toolkit, you acknowledge that you have read these Terms of Service and agree to be bound by them. These terms constitute the entire agreement between you and McLaughlin Financial Group regarding the use of the service.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
    marginLeft: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.primary,
    marginLeft: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  sectionText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletContainer: {
    marginLeft: 16,
  },
  bulletPoint: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 16,
  },
  iconText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
    marginLeft: 8,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.warningLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.warning,
    marginLeft: 12,
  },
  contactContainer: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  contactText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  disclaimerContainer: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});