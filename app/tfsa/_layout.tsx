import React from "react";
import { Stack } from "expo-router";
import Colors from "@/constants/colors";

export default function TFSALayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTitleStyle: {
          color: Colors.navy,
          fontWeight: "600",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "TFSA Calculator",
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          title: "TFSA Results",
        }}
      />
      <Stack.Screen
        name="education"
        options={{
          title: "TFSA Guide",
        }}
      />
      <Stack.Screen
        name="advisor"
        options={{
          title: "Talk with Joe",
        }}
      />
    </Stack>
  );
}