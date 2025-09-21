import React from "react";
import { View, StyleSheet, Text, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Map, ArrowLeft } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useRouter } from "expo-router";

export default function AssetMappingScreen() {
  const router = useRouter();
  const [isLogoLoading, setIsLogoLoading] = React.useState(true);
  const [hasLogoError, setHasLogoError] = React.useState(false);

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
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

        <View style={styles.iconContainer}>
          <Map size={80} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Interactive Asset Mapping</Text>
        
        <Text style={styles.subtitle}>Coming Soon</Text>
        
        <Text style={styles.description}>
          We&apos;re developing an innovative interactive tool that will help you visualize and optimize your complete financial portfolio. This comprehensive asset mapping feature will include:
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
    </SafeAreaView>
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
    fontWeight: "700",
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
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
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
    fontWeight: "bold",
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
    fontWeight: "700",
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