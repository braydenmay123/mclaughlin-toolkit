import * as React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function NotFoundScreen() {
  return (
    <View style={styles.cn}>
      <Text accessibilityRole="header" style={styles.h1}>Page not found</Text>
      <Text style={styles.body}>The page you&apos;re looking for doesn&apos;t exist.</Text>
      <Link href="/" asChild>
        <Pressable accessibilityRole="button" style={styles.btn} testID="go-home-button">
          <Text style={styles.btnText}>Go Home</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  cn: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  h1: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  body: { fontSize: 16, opacity: 0.8, marginBottom: 20, textAlign: "center" },
  btn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1 },
  btnText: { fontSize: 16, fontWeight: "600" }
});