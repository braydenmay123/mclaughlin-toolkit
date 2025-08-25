import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Lightbulb, ArrowRight, Target } from "lucide-react-native";
import Colors from "@/constants/colors";
import { formatCurrency } from "@/utils/calculations";

interface PracticeBeforeBuySectionProps {
  practiceAmount: number;
  currentRent: number;
  totalHousingCost: number;
}

export default function PracticeBeforeBuySection({ 
  practiceAmount, 
  currentRent, 
  totalHousingCost 
}: PracticeBeforeBuySectionProps) {
  const router = useRouter();
  
  const handleBudgetSimulator = () => {
    router.push("/calculator/budget-simulator");
  };
  
  const handleLearnMore = () => {
    router.push("/calculator/education");
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Lightbulb size={24} color={Colors.navy} />
        <Text style={styles.title}>Practice Before You Buy</Text>
      </View>
      
      <Text style={styles.description}>
        One of the best ways to prepare for homeownership is to practice living with your future mortgage payment before you buy.
      </Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Your Practice Plan:</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Current Bi-Weekly Rent:</Text>
          <Text style={styles.infoValue}>{formatCurrency(currentRent)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Future Bi-Weekly Housing Cost:</Text>
          <Text style={styles.infoValue}>{formatCurrency(totalHousingCost)}</Text>
        </View>
        
        <View style={styles.highlightRow}>
          <Text style={styles.highlightLabel}>
            {practiceAmount > 0 ? "Additional Amount to Save:" : "Amount You'll Save:"}
          </Text>
          <Text style={styles.highlightValue}>
            {formatCurrency(Math.abs(practiceAmount))}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.simulatorButton} onPress={handleBudgetSimulator}>
        <Target size={20} color="white" />
        <Text style={styles.simulatorButtonText}>Try Interactive Budget Simulator</Text>
        <ArrowRight size={16} color="white" />
      </TouchableOpacity>
      
      <View style={styles.stepsContainer}>
        <Text style={styles.stepsTitle}>How to Practice:</Text>
        
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepText}>
            Set up an automatic transfer of {formatCurrency(Math.abs(practiceAmount))} bi-weekly to a dedicated savings account
          </Text>
        </View>
        
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepText}>
            Live on your remaining budget for at least 3-6 months
          </Text>
        </View>
        
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>
            If you can comfortably manage this, you are likely ready for the financial responsibility of homeownership
          </Text>
        </View>
        
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <Text style={styles.stepText}>
            Use these savings to boost your down payment or create an emergency fund for home repairs
          </Text>
        </View>
      </View>
      
      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitsTitle}>Benefits of This Approach:</Text>
        
        <View style={styles.benefit}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.benefitText}>
            Test your budget in real-world conditions before committing
          </Text>
        </View>
        
        <View style={styles.benefit}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.benefitText}>
            Build additional savings for closing costs and moving expenses
          </Text>
        </View>
        
        <View style={styles.benefit}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.benefitText}>
            Develop financial discipline needed for successful homeownership
          </Text>
        </View>
        
        <View style={styles.benefit}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.benefitText}>
            Reduce financial stress during the transition to homeownership
          </Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.learnMoreButton} onPress={handleLearnMore}>
        <Text style={styles.learnMoreText}>Learn more about preparing for homeownership</Text>
        <ArrowRight size={16} color={Colors.navy} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.navy,
    marginLeft: 10,
  },
  description: {
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: Colors.navyLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.secondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  highlightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(10, 36, 99, 0.2)",
  },
  highlightLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.navy,
  },
  highlightValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.navy,
  },
  simulatorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    gap: 8,
  },
  simulatorButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  stepsContainer: {
    marginBottom: 16,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 12,
  },
  step: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.navy,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 2,
  },
  stepNumberText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
  },
  benefitsContainer: {
    marginBottom: 16,
    backgroundColor: "rgba(10, 36, 99, 0.05)",
    borderRadius: 8,
    padding: 12,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 8,
  },
  benefit: {
    flexDirection: "row",
    marginBottom: 6,
  },
  bulletPoint: {
    fontSize: 16,
    color: Colors.navy,
    width: 15,
    marginRight: 5,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
  },
  learnMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
  },
  learnMoreText: {
    fontSize: 14,
    color: Colors.navy,
    fontWeight: "500",
  },
});