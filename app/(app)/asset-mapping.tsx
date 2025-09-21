import React from "react";
import { View, StyleSheet, Text, Image, ActivityIndicator, TouchableOpacity, Platform } from "react-native";
import Colors from "@/constants/colors";
import { Link } from "expo-router";

export default function AssetMappingScreen() {
  const [isLogoLoading, setIsLogoLoading] = React.useState<boolean>(true);
  const [hasLogoError, setHasLogoError] = React.useState<boolean>(false);

  const isSSR = typeof window === 'undefined';
  if (isSSR) {
    return (
      <View style={styles.container} testID="asset-mapping-ssr-fallback">
        <View style={styles.header}>
          <View style={styles.backButton} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Interactive Asset Mapping</Text>
          <Text style={styles.subtitle}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity
            testID="asset-mapping-back"
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>{Platform.OS === "web" ? "<" : "←"}</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          {isLogoLoading && (
            <ActivityIndicator
              testID="asset-mapping-logo-loading"
              size="small"
              color={Colors.primary}
              style={styles.loader}
            />
          )}

          <Image
            testID="asset-mapping-logo"
            source={{ uri: "https://mclaughlinfinancial.ca/wp-content/uploads/2024/11/logo.png" }}
            style={[styles.logo, hasLogoError && styles.hidden]}
            resizeMode="contain"
            onLoadStart={() => setIsLogoLoading(true)}
            onLoadEnd={() => setIsLogoLoading(false)}
            onError={() => {
              setHasLogoError(true);
              setIsLogoLoading(false);
            }}
            accessible
            accessibilityLabel="McLaughlin Financial Group Logo"
          />

          {hasLogoError && (
            <Text style={styles.fallbackText}>McLaughlin Financial Group</Text>
          )}
        </View>

        <View style={styles.iconContainer}>
          <Text style={styles.mapEmoji} testID="asset-mapping-icon">🗺️</Text>
        </View>

        <Text style={styles.title}>Interactive Asset Mapping</Text>

        <Text style={styles.subtitle}>Coming Soon</Text>

        <Text style={styles.description}>
          We’re developing an innovative interactive tool that will help you visualize and optimize your complete financial portfolio. This comprehensive asset mapping feature will include:
        </Text>

        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Visual portfolio allocation across all account types</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Asset class diversification analysis</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Risk assessment and optimization recommendations</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Tax-efficient rebalancing strategies</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Goal-based investment tracking</Text>
          </View>
        </View>

        <View style={styles.notifyContainer}>
          <Text style={styles.notifyTitle}>Stay Updated</Text>
          <Text style={styles.notifyText}>
            Contact McLaughlin Financial Group to be notified when this powerful tool becomes available.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: "700" as const,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
    height: 60,
  },
  loader: {
    position: "absolute",
    top: 20,
  },
  logo: {
    width: 200,
    height: 60,
  },
  hidden: {
    display: "none",
  },
  fallbackText: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  mapEmoji: {
    fontSize: 56,
  },
  title: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: "90%",
  },
  featuresList: {
    width: "100%",
    maxWidth: 320,
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  featureBullet: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "700" as const,
    marginRight: 12,
    marginTop: 2,
  },
  featureText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    flex: 1,
  },
  notifyContainer: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 320,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  notifyTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 12,
  },
  notifyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
