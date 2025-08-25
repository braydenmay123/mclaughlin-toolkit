import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Colors from "@/constants/colors";

export default function Logo() {
  const [hasError, setHasError] = useState(false);

  return (
    <View style={styles.container}>
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
          <Text style={styles.fallbackText}>McLaughlin Financial Group</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 28,
  },
  logoContainer: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
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
    letterSpacing: -0.3,
  },
});