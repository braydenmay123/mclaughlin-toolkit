import React, { useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";

export default function AssetMappingRedirect() {
  const router = useRouter();
  const isSSR = typeof window === "undefined";

  useEffect(() => {
    if (!isSSR) {
      router.replace("/asset-map" as any);
    }
  }, [router, isSSR]);

  return (
    <View style={styles.container} testID="asset-mapping-redirect">
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>Opening your asset map…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 16,
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: "600" as const,
  },
});
