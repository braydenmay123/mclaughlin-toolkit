import React from "react";
import { View, StyleSheet, ScrollView, Text, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CalculatorForm from "@/components/CalculatorForm";
import Colors from "@/constants/colors";
import EducationalTips from "@/components/EducationalTips";
import ToolkitHeader from "@/components/ToolkitHeader";

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isVerySmallScreen = screenWidth < 350;

export default function CalculatorScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ToolkitHeader />
        <View style={styles.headerContainer}>
          <Text style={styles.subtitle}>First Home Buyer Calculator</Text>
          <Text style={styles.description}>
            Plan your path to homeownership with our comprehensive calculator
          </Text>
        </View>
        <CalculatorForm />
        <EducationalTips />
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
  },
  headerContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: isVerySmallScreen ? 20 : isSmallScreen ? 22 : 24,
    fontWeight: "700",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: isVerySmallScreen ? 14 : isSmallScreen ? 15 : 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
});