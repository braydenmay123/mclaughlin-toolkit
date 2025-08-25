import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Colors from "@/constants/colors";
import { formatCurrency } from "@/utils/calculations";
import { ChevronRight } from "lucide-react-native";

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isVerySmallScreen = screenWidth < 350;

interface ResultsCardProps {
  title: string;
  items: Array<{
    label: string;
    value: string | number;
    isHighlighted?: boolean;
    isCurrency?: boolean;
  }>;
  showChevron?: boolean;
  onPress?: () => void;
}

export default function ResultsCard({ 
  title, 
  items, 
  showChevron = false,
  onPress
}: ResultsCardProps) {
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent 
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>{title}</Text>
        {showChevron && (
          <View style={styles.chevronContainer}>
            <ChevronRight size={20} color={Colors.primary} />
          </View>
        )}
      </View>
      <View style={styles.divider} />
      
      {items.map((item, index) => (
        <View key={index} style={[
          styles.resultRow,
          index === items.length - 1 && styles.lastResultRow
        ]}>
          <Text style={styles.resultLabel}>{item.label}</Text>
          <Text
            style={[
              styles.resultValue,
              item.isHighlighted && styles.highlightedValue,
            ]}
          >
            {item.isCurrency ? formatCurrency(Number(item.value)) : item.value}
          </Text>
        </View>
      ))}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: isVerySmallScreen ? 16 : 20,
    padding: isVerySmallScreen ? 20 : 24,
    marginBottom: isVerySmallScreen ? 16 : 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: isVerySmallScreen ? 12 : 16,
  },
  cardTitle: {
    fontSize: isVerySmallScreen ? 18 : 20,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: -0.3,
    flex: 1,
    paddingRight: 12,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: isVerySmallScreen ? 16 : 20,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: isVerySmallScreen ? 12 : 16,
    paddingBottom: isVerySmallScreen ? 12 : 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  lastResultRow: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  resultLabel: {
    fontSize: isVerySmallScreen ? 14 : 16,
    color: Colors.textSecondary,
    flex: 1,
    paddingRight: 12,
    lineHeight: isVerySmallScreen ? 20 : 24,
    fontWeight: "500",
  },
  resultValue: {
    fontSize: isVerySmallScreen ? 14 : 16,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "right",
    flexShrink: 0,
    lineHeight: isVerySmallScreen ? 20 : 24,
  },
  highlightedValue: {
    fontWeight: "700",
    fontSize: isVerySmallScreen ? 17 : 19,
    color: Colors.primary,
  },
});