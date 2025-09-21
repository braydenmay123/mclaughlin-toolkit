import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Calculator, BarChart3, Shield, Users, ChevronRight, Lock, TrendingUp } from "lucide-react-native";
import Colors from "@/constants/colors";
import ToolkitHeader from "@/components/ToolkitHeader";

export default function AdvisorToolsScreen() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const ADVISOR_PASSWORD = "McLaughlin";

  const handlePasswordSubmit = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (password === ADVISOR_PASSWORD) {
        setIsAuthenticated(true);
      } else {
        Alert.alert("Access Denied", "Incorrect password. Please try again.");
        setPassword("");
      }
      setIsLoading(false);
    }, 500);
  };

  const navigateToTool = (route: string) => {
    router.push(route as any);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={["right", "left"]}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ToolkitHeader />
          
          <View style={styles.authContainer}>
            <View style={styles.lockIconContainer}>
              <Lock size={48} color={Colors.primary} />
            </View>
            
            <Text style={styles.authTitle}>Advisor Access Required</Text>
            <Text style={styles.authSubtitle}>
              Please enter the advisor password to access professional tools
            </Text>
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter advisor password"
                secureTextEntry
                autoCapitalize="none"
                onSubmitEditing={handlePasswordSubmit}
              />
              
              <TouchableOpacity 
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handlePasswordSubmit}
                disabled={isLoading || !password.trim()}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? "Verifying..." : "Access Tools"}
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.backButtonText}>Back to Main Menu</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ToolkitHeader />
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Advisor Tools</Text>
          <Text style={styles.subtitle}>
            Professional calculators and tools designed for financial advisors
          </Text>
        </View>

        <View style={styles.toolsContainer}>
          <TouchableOpacity 
            style={styles.toolCard} 
            onPress={() => navigateToTool("/(app)/advisor/investment-vs-insurance")}
            activeOpacity={0.7}
          >
            <View style={styles.toolIconContainer}>
              <BarChart3 size={26} color={Colors.primary} />
            </View>
            <View style={styles.toolContent}>
              <View style={styles.toolHeaderRow}>
                <Text style={styles.toolTitle}>Investment ROI vs Life Insurance</Text>
                <ChevronRight size={20} color={Colors.primary} />
              </View>
              <Text style={styles.toolDescription}>
                Compare what investment return is needed to match life insurance death benefits for estate planning.
              </Text>
              <View style={styles.toolFeatures}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>ROI Analysis</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Death Benefit Comparison</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Risk Assessment</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.toolCard} 
            onPress={() => navigateToTool("/(app)/advisor/segregated-funds")}
            activeOpacity={0.7}
          >
            <View style={styles.toolIconContainer}>
              <Shield size={26} color={Colors.primary} />
            </View>
            <View style={styles.toolContent}>
              <View style={styles.toolHeaderRow}>
                <Text style={styles.toolTitle}>Segregated Funds Calculator</Text>
                <ChevronRight size={20} color={Colors.primary} />
              </View>
              <Text style={styles.toolDescription}>
                Calculate the value of segregated fund guarantees and compare with traditional mutual funds.
              </Text>
              <View style={styles.toolFeatures}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Guarantee Value</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Protection Benefits</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Cost Analysis</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.toolCard} 
            onPress={() => navigateToTool("/(app)/advisor/analytics")}
            activeOpacity={0.7}
          >
            <View style={styles.toolIconContainer}>
              <TrendingUp size={26} color={Colors.primary} />
            </View>
            <View style={styles.toolContent}>
              <View style={styles.toolHeaderRow}>
                <Text style={styles.toolTitle}>Usage Analytics Dashboard</Text>
                <ChevronRight size={20} color={Colors.primary} />
              </View>
              <Text style={styles.toolDescription}>
                Track calculator usage, user engagement, and client contact information for follow-up.
              </Text>
              <View style={styles.toolFeatures}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Usage Statistics</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Client Contacts</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Activity Tracking</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonTitle}>Coming Soon</Text>

            <View style={[styles.toolCard, styles.comingSoonCard]}>
              <View style={[styles.toolIconContainer, styles.comingSoonIcon]}>
                <Users size={26} color={Colors.textLight} />
              </View>
              <View style={styles.toolContent}>
                <Text style={styles.comingSoonItemTitle}>Client Portfolio Dashboard</Text>
                <Text style={styles.comingSoonDescription}>
                  Comprehensive dashboard to track all client portfolios, performance metrics, and rebalancing needs.
                </Text>
              </View>
            </View>

            <View style={[styles.toolCard, styles.comingSoonCard]}>
              <View style={[styles.toolIconContainer, styles.comingSoonIcon]}>
                <Calculator size={26} color={Colors.textLight} />
              </View>
              <View style={styles.toolContent}>
                <Text style={styles.comingSoonItemTitle}>Estate Planning Calculator</Text>
                <Text style={styles.comingSoonDescription}>
                  Advanced estate planning tools including tax optimization, trust structures, and succession planning.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Professional Tools</Text>
          <Text style={styles.infoText}>
            These tools are designed specifically for financial advisors to help demonstrate concepts, 
            compare strategies, and provide clear visualizations for client meetings.
          </Text>
          <Text style={styles.infoText}>
            All calculations are based on current tax rates and regulations. Always verify with 
            current legislation and consider individual client circumstances.
          </Text>
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.backButtonText}>Back to Main Menu</Text>
          </TouchableOpacity>
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
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: "90%",
  },
  toolsContainer: {
    paddingHorizontal: 24,
  },
  toolCard: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toolIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: Colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  toolContent: {
    flex: 1,
  },
  toolHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  toolTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    flex: 1,
    paddingRight: 8,
    letterSpacing: 0.2,
  },
  toolDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  toolFeatures: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  featureItem: {
    backgroundColor: Colors.accentLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  featureText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
  comingSoonContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  comingSoonCard: {
    opacity: 0.7,
    backgroundColor: Colors.backgroundAlt,
  },
  comingSoonIcon: {
    backgroundColor: Colors.backgroundGray,
  },
  comingSoonItemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  comingSoonDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  infoContainer: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: Colors.accentLight,
    borderTopWidth: 1,
    borderTopColor: Colors.accent,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  infoText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  lockIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 12,
  },
  authSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: "90%",
  },
  passwordContainer: {
    width: "100%",
    maxWidth: 320,
    marginBottom: 40,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: Colors.background,
    marginBottom: 16,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: Colors.textLight,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footerContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  backButton: {
    backgroundColor: Colors.backgroundGray,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backButtonText: {
    color: Colors.navy,
    fontSize: 16,
    fontWeight: "600",
  },
});