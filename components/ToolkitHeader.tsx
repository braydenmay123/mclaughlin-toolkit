import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { Home } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function ToolkitHeader() {
  const router = useRouter();
  const [hasError, setHasError] = useState(false);

  const navigateToHome = () => {
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={navigateToHome} 
        style={styles.homeButton}
        activeOpacity={0.7}
      >
        <Home size={22} color={Colors.primary} />
      </TouchableOpacity>
      
      <View style={styles.logoContainer}>
        <Image
          source={{ 
            uri: "https://mclaughlinfinancial.ca/wp-content/uploads/2024/11/logo.png",
            cache: "force-cache"
          }}
          style={[styles.logo, hasError && styles.hidden]}
          resizeMode="contain"
          onError={() => setHasError(true)}
        />
        
        {hasError && (
          <Text style={styles.fallbackText}>McLaughlin Financial</Text>
        )}
      </View>
      
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.background,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 68,
  },
  homeButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.accentLight,
    minWidth: 48,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.accent,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  logoContainer: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: 170,
    height: 40,
  },
  hidden: {
    display: "none",
  },
  fallbackText: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: -0.2,
  },
  placeholder: {
    width: 48,
  },
});