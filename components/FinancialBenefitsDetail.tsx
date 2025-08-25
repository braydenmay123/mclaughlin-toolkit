import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/colors";
import { formatCurrency } from "@/utils/calculations";

interface FinancialBenefitsDetailProps {
  annualTaxSavings: number;
  annualIncome: number;
  mortgagePreQualification: number;
  annualMortgagePayment: number;
}

export default function FinancialBenefitsDetail({
  annualTaxSavings,
  annualIncome,
  mortgagePreQualification,
  annualMortgagePayment,
}: FinancialBenefitsDetailProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Tax Benefits of Homeownership</Text>
      <Text style={styles.paragraph}>
        As a homeowner, you may be eligible for various tax benefits that can significantly reduce your overall tax burden. These benefits can make homeownership more affordable in the long run.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Estimated Tax Benefits</Text>
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Text style={styles.label}>Annual Tax Savings:</Text>
          <Text style={styles.value}>{formatCurrency(annualTaxSavings)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Monthly Tax Benefit:</Text>
          <Text style={styles.value}>{formatCurrency(annualTaxSavings / 12)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Bi-Weekly Tax Benefit:</Text>
          <Text style={styles.value}>{formatCurrency(annualTaxSavings / 26)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>5-Year Tax Savings:</Text>
          <Text style={styles.value}>{formatCurrency(annualTaxSavings * 5)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>How Tax Benefits Work</Text>
      <Text style={styles.paragraph}>
        The tax benefits of homeownership primarily come from the ability to deduct mortgage interest and property taxes from your taxable income. Here's how it works:
      </Text>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          <Text style={styles.bold}>Mortgage Interest Deduction:</Text> You can deduct the interest paid on your mortgage from your taxable income, reducing your overall tax liability.
        </Text>
      </View>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          <Text style={styles.bold}>Property Tax Deduction:</Text> Property taxes paid on your primary residence can be deducted from your taxable income.
        </Text>
      </View>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          <Text style={styles.bold}>Home Office Deduction:</Text> If you work from home, you may be eligible to deduct a portion of your housing expenses.
        </Text>
      </View>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          <Text style={styles.bold}>Capital Gains Exclusion:</Text> When you sell your primary residence, you may exclude up to $250,000 ($500,000 for married couples) of capital gains from your income.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>First Home Savings Account (FHSA)</Text>
      <Text style={styles.paragraph}>
        The Tax-Free First Home Savings Account (FHSA) is a powerful tool for first-time homebuyers in Canada:
      </Text>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          <Text style={styles.bold}>Tax-deductible contributions:</Text> Contribute up to $8,000 per year (lifetime limit of $40,000) and deduct this amount from your taxable income.
        </Text>
      </View>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          <Text style={styles.bold}>Tax-free growth:</Text> Investments grow tax-free within the account.
        </Text>
      </View>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          <Text style={styles.bold}>Tax-free withdrawals:</Text> Withdraw funds tax-free when used to purchase your first home.
        </Text>
      </View>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          <Text style={styles.bold}>Flexibility:</Text> If not used for a home purchase, funds can be transferred to an RRSP without affecting contribution room.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Mortgage Pre-Qualification</Text>
      <Text style={styles.paragraph}>
        Based on your annual income of {formatCurrency(annualIncome)}, you may qualify for a mortgage of approximately:
      </Text>
      
      <View style={styles.highlightBox}>
        <Text style={styles.highlightText}>{formatCurrency(mortgagePreQualification)}</Text>
      </View>
      
      <Text style={styles.paragraph}>
        This estimate is based on standard lending criteria that typically allow 28-36% of your gross income for housing expenses. Your actual qualification amount may vary based on your credit score, existing debt, and other factors.
      </Text>
      
      <Text style={styles.sectionTitle}>Maximizing Your Tax Benefits</Text>
      <Text style={styles.paragraph}>
        To maximize your tax benefits as a homeowner:
      </Text>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          Keep detailed records of all home-related expenses
        </Text>
      </View>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          Consider itemizing deductions instead of taking the standard deduction
        </Text>
      </View>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          Consult with Joe at McLaughlin Financial Group for personalized tax planning strategies
        </Text>
      </View>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          Review your tax strategy annually as tax laws and your financial situation change
        </Text>
      </View>
      
      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          Note: Tax benefits are based on current tax laws and may change. This information is provided for educational purposes only and is not tax advice. Please consult with a tax professional for advice specific to your situation.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.navy,
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.secondary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.navyLight,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(10, 36, 99, 0.2)",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.secondary,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.navy,
  },
  bulletContainer: {
    flexDirection: "row",
    marginBottom: 10,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: Colors.navy,
    marginRight: 8,
    width: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.secondary,
  },
  bold: {
    fontWeight: "600",
    color: Colors.navy,
  },
  highlightBox: {
    backgroundColor: Colors.navy,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginVertical: 16,
  },
  highlightText: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
  },
  noteBox: {
    backgroundColor: "rgba(10, 36, 99, 0.05)",
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.navy,
  },
  noteText: {
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
    color: Colors.secondary,
  },
});