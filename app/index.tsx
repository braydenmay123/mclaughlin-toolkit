import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Href } from "expo-router";
import { Calculator, BookOpen, Map, ChevronRight } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function HomeScreen() {
  console.log('HomeScreen rendering...');
  const router = useRouter();
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [hasLogoError, setHasLogoError] = useState(false);

  const navigateToSection = (route: Href) => {
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
          <Text style={styles.title}>McLaughlin Financial Group</Text>
          <Text style={styles.subtitle}>
            Your comprehensive financial planning platform
          </Text>
        </View>

        <View style={styles.sectionsContainer}>
          <TouchableOpacity 
            style={styles.sectionCard} 
            onPress={() => navigateToSection("/go/calculators")}
            activeOpacity={0.7}
          >
            <View style={styles.sectionIconContainer}>
              <Calculator size={32} color={Colors.primary} />
            </View>
            <View style={styles.sectionContent}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Calculators</Text>
                <View style={styles.chevronContainer}>
                  <ChevronRight size={20} color={Colors.primary} />
                </View>
              </View>
              <Text style={styles.sectionDescription}>
                Interactive financial calculators for investments, taxes, home buying, and retirement planning.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sectionCard} 
            onPress={() => navigateToSection("/go/education")}
            activeOpacity={0.7}
          >
            <View style={styles.sectionIconContainer}>
              <BookOpen size={32} color={Colors.primary} />
            </View>
            <View style={styles.sectionContent}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Education Centre</Text>
                <View style={styles.chevronContainer}>
                  <ChevronRight size={20} color={Colors.primary} />
                </View>
              </View>
              <Text style={styles.sectionDescription}>
                Learn about investing, taxes, insurance, and financial planning through our comprehensive guides.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sectionCard} 
            onPress={() => navigateToSection("/mapping")}
            activeOpacity={0.7}
          >
            <View style={styles.sectionIconContainer}>
              <Map size={32} color={Colors.primary} />
            </View>
            <View style={styles.sectionContent}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Interactive Asset Mapping</Text>
                <View style={styles.chevronContainer}>
                  <ChevronRight size={20} color={Colors.primary} />
                </View>
              </View>
              <Text style={styles.sectionDescription}>
                Visualize and optimize your complete financial portfolio with our interactive asset mapping tool.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.contactContainer}>
          <Text style={styles.contactTitle}>McLaughlin Financial Group</Text>
          <Text style={styles.contactInfoText}>1 Elora Street North, Unit 1</Text>
          <Text style={styles.contactInfoText}>Harriston, Ontario</Text>
          <Text style={styles.contactInfoText}>Phone: 519-510-0411</Text>
          <Text style={styles.contactInfoText}>Email: info@mclaughlinfinancial.ca</Text>
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
    marginBottom: 48,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 26,
    maxWidth: "90%",
    fontWeight: "400",
  },
  sectionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionCard: {
    flexDirection: "row",
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  sectionContent: {
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.primary,
    flex: 1,
    paddingRight: 12,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    fontWeight: "400",
  },
  comingSoonCard: {
    opacity: 0.7,
    backgroundColor: Colors.backgroundGray,
  },
  comingSoonIcon: {
    backgroundColor: Colors.backgroundAlt,
    borderColor: Colors.borderLight,
  },
  comingSoonText: {
    color: Colors.textMuted,
  },
  comingSoonBadge: {
    backgroundColor: Colors.accentMedium,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  comingSoonBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
    letterSpacing: 0.2,
  },
  contactContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: Colors.accentLight,
    borderTopWidth: 1,
    borderTopColor: Colors.accent,
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  contactInfoText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 6,
    textAlign: "center",
    fontWeight: "400",
  },
});