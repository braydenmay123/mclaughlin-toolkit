import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Lightbulb, TrendingUp, Shield, Calculator } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function EducationalTips() {
  const tips = [
    {
      icon: <Calculator size={24} color={Colors.primary} />,
      title: "Down Payment Strategy",
      content: "While 20% down payment avoids CMHC insurance, don't drain all savings. Keep emergency funds separate."
    },
    {
      icon: <TrendingUp size={24} color={Colors.primary} />,
      title: "Interest Rate Impact",
      content: "A 1% interest rate increase can add $200+ to monthly payments on a $500K mortgage."
    },
    {
      icon: <Shield size={24} color={Colors.primary} />,
      title: "Hidden Costs",
      content: "Budget for legal fees ($1,500-$3,000), home inspection ($400-$600), and moving costs."
    },
    {
      icon: <Lightbulb size={24} color={Colors.primary} />,
      title: "First-Time Buyer Programs",
      content: "Explore HBP (Home Buyers' Plan) to withdraw up to $35,000 from RRSP tax-free."
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Buying Tips</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsContainer}>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipCard}>
            <View style={styles.tipIcon}>
              {tip.icon}
            </View>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipContent}>{tip.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  tipsContainer: {
    flexDirection: "row",
  },
  tipCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    width: 280,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  tipIcon: {
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  tipContent: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontWeight: "500",
  },
});