import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Href } from "expo-router";
import { Home, PiggyBank, TrendingUp, BarChart4, DollarSign, Lock, Percent, ChevronRight, Receipt, ShoppingCart } from "lucide-react-native";
import Colors from "@/constants/colors";
import AdvisorCTA from "@/components/AdvisorCTA";



export default function MainMenuScreen() {
  console.log('MainMenuScreen rendering...');
  const router = useRouter();
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [hasLogoError, setHasLogoError] = useState(false);

  const navigateToCalculator = (route: Href) => {
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          {isLogoLoading && (
            <ActivityIndicator size="small" color={Colors.primary} style={styles.loader} />
          )}
          
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

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Financial Toolkit</Text>
          <Text style={styles.subtitle}>
            Interactive calculators and tools to help you make informed financial decisions
          </Text>
        </View>

        <View style={styles.calculatorsContainer}>
          <Text style={styles.sectionTitle}>Available Calculators</Text>

          <TouchableOpacity 
            style={styles.calculatorCard} 
            onPress={() => navigateToCalculator("/investment")}
            activeOpacity={0.7}
          >
            <View style={styles.calculatorIconContainer}>
              <TrendingUp size={28} color={Colors.primary} />
            </View>
            <View style={styles.calculatorContent}>
              <View style={styles.calculatorHeaderRow}>
                <Text style={styles.calculatorTitle}>Investment Growth Calculator</Text>
                <View style={styles.chevronContainer}>
                  <ChevronRight size={20} color={Colors.primary} />
                </View>
              </View>
              <Text style={styles.calculatorDescription}>
                Visualize how your investments could grow over time with different contribution amounts, time horizons, and rates of return.
              </Text>
              <View style={styles.calculatorFeatures}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Portfolio Projections</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Risk Analysis</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Compound Interest</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.calculatorCard} 
            onPress={() => navigateToCalculator("/calculator")}
            activeOpacity={0.7}
          >
            <View style={styles.calculatorIconContainer}>
              <Home size={28} color={Colors.primary} />
            </View>
            <View style={styles.calculatorContent}>
              <View style={styles.calculatorHeaderRow}>
                <Text style={styles.calculatorTitle}>First Home Buyer Calculator</Text>
                <View style={styles.chevronContainer}>
                  <ChevronRight size={20} color={Colors.primary} />
                </View>
              </View>
              <Text style={styles.calculatorDescription}>
                Plan your path to homeownership with our comprehensive calculator that helps you understand costs, savings goals, and affordability.
              </Text>
              <View style={styles.calculatorFeatures}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Down Payment Planning</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Mortgage Estimates</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Affordability Analysis</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.calculatorCard} 
            onPress={() => navigateToCalculator("/tfsa")}
            activeOpacity={0.7}
          >
            <View style={styles.calculatorIconContainer}>
              <DollarSign size={28} color={Colors.primary} />
            </View>
            <View style={styles.calculatorContent}>
              <View style={styles.calculatorHeaderRow}>
                <Text style={styles.calculatorTitle}>TFSA Contribution Calculator</Text>
                <View style={styles.chevronContainer}>
                  <ChevronRight size={20} color={Colors.primary} />
                </View>
              </View>
              <Text style={styles.calculatorDescription}>
                Track your TFSA contribution room, avoid over-contribution penalties, and understand how withdrawals affect your future contribution limits.
              </Text>
              <View style={styles.calculatorFeatures}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Contribution Tracking</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Room Calculation</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Withdrawal Planning</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.calculatorCard} 
            onPress={() => navigateToCalculator("/rrsp-tax-savings")}
            activeOpacity={0.7}
          >
            <View style={styles.calculatorIconContainer}>
              <Percent size={28} color={Colors.primary} />
            </View>
            <View style={styles.calculatorContent}>
              <View style={styles.calculatorHeaderRow}>
                <Text style={styles.calculatorTitle}>RRSP Tax Savings Calculator</Text>
                <View style={styles.chevronContainer}>
                  <ChevronRight size={20} color={Colors.primary} />
                </View>
              </View>
              <Text style={styles.calculatorDescription}>
                Calculate the tax savings from RRSP contributions based on 2025 tax brackets for Ontario residents.
              </Text>
              <View style={styles.calculatorFeatures}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Tax Bracket Analysis</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Contribution Planning</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Savings Visualization</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.calculatorCard} 
            onPress={() => navigateToCalculator("/withdrawal-strategy")}
            activeOpacity={0.7}
          >
            <View style={styles.calculatorIconContainer}>
              <PiggyBank size={28} color={Colors.primary} />
            </View>
            <View style={styles.calculatorContent}>
              <View style={styles.calculatorHeaderRow}>
                <Text style={styles.calculatorTitle}>Sustainable Withdrawal Strategy</Text>
                <View style={styles.chevronContainer}>
                  <ChevronRight size={20} color={Colors.primary} />
                </View>
              </View>
              <Text style={styles.calculatorDescription}>
                Compare living off income vs. capital drawdown to see the impact on long-term wealth.
              </Text>
              <View style={styles.calculatorFeatures}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Retirement Planning</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Income Strategies</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Capital Preservation</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.calculatorCard} 
            onPress={() => navigateToCalculator("/tax-calculator")}
            activeOpacity={0.7}
          >
            <View style={styles.calculatorIconContainer}>
              <Receipt size={28} color={Colors.primary} />
            </View>
            <View style={styles.calculatorContent}>
              <View style={styles.calculatorHeaderRow}>
                <Text style={styles.calculatorTitle}>Income Tax Calculator</Text>
                <View style={styles.chevronContainer}>
                  <ChevronRight size={20} color={Colors.primary} />
                </View>
              </View>
              <Text style={styles.calculatorDescription}>
                Calculate your federal and provincial income tax for 2025 with detailed breakdown by tax bracket.
              </Text>
              <View style={styles.calculatorFeatures}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>2025 Tax Brackets</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>All Provinces</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Marginal Rates</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.calculatorCard} 
            onPress={() => navigateToCalculator("/large-purchase")}
            activeOpacity={0.7}
          >
            <View style={styles.calculatorIconContainer}>
              <ShoppingCart size={28} color={Colors.primary} />
            </View>
            <View style={styles.calculatorContent}>
              <View style={styles.calculatorHeaderRow}>
                <Text style={styles.calculatorTitle}>Large Purchase Calculator</Text>
                <View style={styles.chevronContainer}>
                  <ChevronRight size={20} color={Colors.primary} />
                </View>
              </View>
              <Text style={styles.calculatorDescription}>
                Compare lump sum vs financing vs saving strategies for major purchases like cars, boats, or renovations.
              </Text>
              <View style={styles.calculatorFeatures}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Scenario Analysis</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Net Worth Impact</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>Optimal Strategy</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>



          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonTitle}>Coming Soon</Text>

            <View style={[styles.calculatorCard, styles.comingSoonCard]}>
              <View style={[styles.calculatorIconContainer, styles.comingSoonIcon]}>
                <BarChart4 size={28} color={Colors.textMuted} />
              </View>
              <View style={styles.calculatorContent}>
                <Text style={styles.comingSoonItemTitle}>Tax-Free First Home Savings Account (FHSA) Calculator</Text>
                <Text style={styles.comingSoonDescription}>
                  Maximize your FHSA benefits and see how this tax-advantaged account can accelerate your home buying journey.
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.advisorToolsButton} 
            onPress={() => navigateToCalculator("/advisor")}
            activeOpacity={0.7}
          >
            <Lock size={20} color={Colors.primary} style={styles.advisorToolsIcon} />
            <Text style={styles.advisorToolsText}>Advisor Tools</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactContainer}>
          <AdvisorCTA />
          
          <View style={styles.contactInfoContainer}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
    position: "relative",
    height: 70,
  },
  loader: {
    position: "absolute",
    top: 25,
  },
  logo: {
    width: 260,
    height: 70,
  },
  hidden: {
    display: "none",
  },
  fallbackText: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  titleContainer: {
    paddingHorizontal: 24,
    marginBottom: 36,
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 26,
    maxWidth: "90%",
    fontWeight: "400",
  },
  calculatorsContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  calculatorCard: {
    flexDirection: "row",
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  calculatorIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: Colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  calculatorContent: {
    flex: 1,
  },
  calculatorHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  calculatorTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: Colors.primary,
    flex: 1,
    paddingRight: 12,
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -4,
  },
  calculatorDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: "400",
  },
  calculatorFeatures: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  featureItem: {
    backgroundColor: Colors.accentLight,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.accentMedium,
  },
  featureText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  comingSoonContainer: {
    marginTop: 32,
    marginBottom: 24,
  },
  comingSoonTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  comingSoonCard: {
    opacity: 0.6,
    backgroundColor: Colors.backgroundGray,
  },
  comingSoonIcon: {
    backgroundColor: Colors.backgroundAlt,
    borderColor: Colors.borderLight,
  },
  comingSoonItemTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  comingSoonDescription: {
    fontSize: 15,
    color: Colors.textLight,
    lineHeight: 22,
  },
  advisorToolsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 48,
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 16,
    backgroundColor: Colors.background,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  advisorToolsIcon: {
    marginRight: 12,
  },
  advisorToolsText: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: -0.2,
  },
  contactContainer: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 36,
    backgroundColor: Colors.accentLight,
    borderTopWidth: 1,
    borderTopColor: Colors.accent,
  },
  contactInfoContainer: {
    paddingTop: 24,
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(4, 35, 58, 0.2)",
  },
  contactInfoText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 24,
    fontWeight: "400",
  },
});