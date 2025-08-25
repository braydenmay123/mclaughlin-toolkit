import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCalculatorStore } from "@/store/calculatorStore";
import InteractiveBudgetSimulator from "@/components/InteractiveBudgetSimulator";
import Colors from "@/constants/colors";
import ToolkitHeader from "@/components/ToolkitHeader";

export default function BudgetSimulatorScreen() {
  const router = useRouter();
  const {
    annualIncome,
    biWeeklyTotalCostOfOwnership,
    monthlyInsurance,
    currentBiWeeklyRent,
  } = useCalculatorStore();

  const monthlyIncome = annualIncome / 12;
  const futureHousingCost = biWeeklyTotalCostOfOwnership + (monthlyInsurance / 2);

  const handleComplete = () => {
    router.push("/calculator/results");
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ToolkitHeader />
      <InteractiveBudgetSimulator
        monthlyIncome={monthlyIncome}
        futureHousingCost={futureHousingCost}
        currentRent={currentBiWeeklyRent}
        onComplete={handleComplete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});