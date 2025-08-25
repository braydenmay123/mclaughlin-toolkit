import React from "react";
import { Tabs } from "expo-router";
import { Home, BarChart, BookOpen, HelpCircle } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.navy,
        tabBarInactiveTintColor: Colors.accent,
        tabBarStyle: {
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTitleStyle: {
          color: Colors.navy,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "McLaughlin Financial Group First Home Calculator",
          tabBarLabel: "Calculator",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          title: "Results",
          tabBarLabel: "Results",
          tabBarIcon: ({ color, size }) => <BarChart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: "Home Buying Guide",
          tabBarLabel: "Education",
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="advisor"
        options={{
          title: "Talk with Joe",
          tabBarLabel: "Contact Joe",
          tabBarIcon: ({ color, size }) => <HelpCircle size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}