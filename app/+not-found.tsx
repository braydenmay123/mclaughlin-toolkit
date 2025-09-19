// app/+not-found.tsx
import * as React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
  return (
    <View style={styles.container} testID="not-found-screen">
      {/* Set page metadata safely during SSR */}
      <Stack.Screen options={{ title: "Page not found" }} />

      <Text accessibilityRole="header" style={styles.title}>
        404 — Page not found
      </Text>

      <Text style={styles.subtitle}>
        The page you’re looking for doesn’t exist or has moved.
      </Text>

      <Link href="/" asChild>
        <Pressable accessibilityRole="button" testID="go-home-button" style={styles.button}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: "center", justifyContent: "center", padding: 24,
    backgroundColor: "white",
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 14, opacity: 0.8, marginBottom: 20, textAlign: "center" },
  button: {
    paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8,
    borderWidth: 1, borderColor: "#04233a",
  },
  buttonText: { fontWeight: "600", color: "#04233a" },
});
