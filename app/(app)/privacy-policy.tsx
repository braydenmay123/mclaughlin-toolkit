import React from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Shield, Eye, Lock, Database, Mail } from "lucide-react-native";
import Colors from "@/constants/colors";
import ToolkitHeader from "@/components/ToolkitHeader";

export default function PrivacyPolicyScreen() {
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
            <Shield size={32} color={Colors.primary} />
            <Text style={styles.title}>Privacy Policy</Text>
          </View>
          <Text style={styles.subtitle}>
            Last updated: January 14, 2025
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.sectionText}>
              We collect information you provide directly to us when using our financial calculators:
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletPoint}>• Personal Information: Name and email address when you choose to save or share calculator results</Text>
              <Text style={styles.bulletPoint}>• Financial Data: Information you input into our calculators (income, expenses, savings goals, etc.)</Text>
              <Text style={styles.bulletPoint}>• Usage Data: Which calculators you use and when you use them</Text>
              <Text style={styles.bulletPoint}>• Device Information: Basic device and browser information for app functionality</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.sectionText}>
              We use the information we collect to:
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletPoint}>• Provide and improve our financial calculator services</Text>
              <Text style={styles.bulletPoint}>• Generate personalized financial reports and recommendations</Text>
              <Text style={styles.bulletPoint}>• Enable you to save and download your calculation results</Text>
              <Text style={styles.bulletPoint}>• Track usage analytics to improve our services</Text>
              <Text style={styles.bulletPoint}>• Communicate with you about our services (only if you opt-in)</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Data Storage and Security</Text>
            <View style={styles.iconTextContainer}>
              <Database size={20} color={Colors.primary} />
              <Text style={styles.iconText}>Local Storage</Text>
            </View>
            <Text style={styles.sectionText}>
              Your calculator inputs and results are primarily stored locally on your device using secure storage mechanisms. This means your financial data remains on your device and is not transmitted to external servers unless you explicitly choose to share results.
            </Text>
            
            <View style={styles.iconTextContainer}>
              <Lock size={20} color={Colors.primary} />
              <Text style={styles.iconText}>Security Measures</Text>
            </View>
            <Text style={styles.sectionText}>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Information Sharing</Text>
            <Text style={styles.sectionText}>
              We do not sell, trade, or otherwise transfer your personal information to third parties except:
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletPoint}>• When you explicitly request to share your results with McLaughlin Financial Group</Text>
              <Text style={styles.bulletPoint}>• To comply with legal obligations or protect our rights</Text>
              <Text style={styles.bulletPoint}>• With your explicit consent for specific purposes</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Your Rights and Choices</Text>
            <View style={styles.iconTextContainer}>
              <Eye size={20} color={Colors.primary} />
              <Text style={styles.iconText}>Access and Control</Text>
            </View>
            <Text style={styles.sectionText}>
              You have the right to:
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletPoint}>• Access the personal information we have about you</Text>
              <Text style={styles.bulletPoint}>• Correct inaccurate or incomplete information</Text>
              <Text style={styles.bulletPoint}>• Delete your personal information (right to be forgotten)</Text>
              <Text style={styles.bulletPoint}>• Opt-out of communications at any time</Text>
              <Text style={styles.bulletPoint}>• Clear your locally stored data through your device settings</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Data Retention</Text>
            <Text style={styles.sectionText}>
              We retain your information only as long as necessary to provide our services and fulfill the purposes outlined in this policy. Analytics data is automatically limited to the most recent 1,000 entries to prevent excessive data accumulation.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Children&apos;s Privacy</Text>
            <Text style={styles.sectionText}>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected such information, we will take steps to delete it promptly.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
            <Text style={styles.sectionText}>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy in the app and updating the &quot;Last updated&quot; date at the top of this policy.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Contact Information</Text>
            <View style={styles.iconTextContainer}>
              <Mail size={20} color={Colors.primary} />
              <Text style={styles.iconText}>Get in Touch</Text>
            </View>
            <Text style={styles.sectionText}>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
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
            <Text style={styles.disclaimerTitle}>Important Notice</Text>
            <Text style={styles.disclaimerText}>
              This Privacy Policy applies specifically to the McLaughlin Toolkit mobile application. By using our app, you acknowledge that you have read and understood this policy and agree to the collection and use of information in accordance with these terms.
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