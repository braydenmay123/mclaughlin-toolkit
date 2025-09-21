import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Colors from "@/constants/colors";
import { Link } from "expo-router";

export default function AssetMappingScreen() {
  return (
    <View style={styles.container} testID="asset-mapping-static">
      <View style={styles.header} />
      <View style={styles.content}>
        <Text style={styles.emoji}>🗺️</Text>
        <Text style={styles.title}>Interactive Asset Mapping</Text>
        <Text style={styles.subtitle}>Coming Soon</Text>
        <Text style={styles.description}>
          We’re building a powerful visual portfolio tool. Check back soon.
        </Text>
        <Link href="/" asChild>
          <Text accessibilityRole="link" style={styles.link} testID="asset-mapping-home-link">
            Go Home
          </Text>
        </Link>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 56, marginBottom: 12 },
  title: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 360,
  },
  link: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "700" as const,
  },
});
