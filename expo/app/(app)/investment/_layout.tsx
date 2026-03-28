import React from "react";
import { Stack } from "expo-router";
import Colors from "@/constants/colors";

export default function InvestmentLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTitleStyle: {
          color: Colors.navy,
          fontWeight: "600",
        },
        headerTintColor: Colors.navy,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Investment Calculator",
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          title: "Investment Results",
        }}
      />
    </Stack>
  );
}