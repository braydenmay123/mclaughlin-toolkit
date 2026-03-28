import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/colors";
import { formatCurrency } from "@/utils/calculations";

interface LongTermImpactDetailProps {
  homePrice: number;
  biWeeklyMortgagePayment: number;
  retirementImpact: number;
  downPaymentAmount: number;
}

export default function LongTermImpactDetail({
  homePrice,
  biWeeklyMortgagePayment,
  retirementImpact,
  downPaymentAmount,
}: LongTermImpactDetailProps) {
  // Calculate estimated home values with appreciation
  const fiveYearHomeValue = homePrice * 1.15; // Assuming 3% annual appreciation
  const tenYearHomeValue = homePrice * 1.34; // Assuming 3% annual appreciation
  const twentyYearHomeValue = homePrice * 1.8; // Assuming 3% annual appreciation
  
  // Calculate equity after different time periods
  const fiveYearEquity = (homePrice * 0.1) + (biWeeklyMortgagePayment * 26 * 5 * 0.3);
  const tenYearEquity = (homePrice * 0.2) + (biWeeklyMortgagePayment * 26 * 10 * 0.4);
  const twentyYearEquity = (homePrice * 0.5) + (biWeeklyMortgagePayment * 26 * 20 * 0.6);
  
  // Calculate alternative investment scenarios
  const conservativeReturn = 0.025; // 2.5% for HISA
  const balancedReturn = 0.05; // 5% for balanced portfolio
  const growthReturn = 0.075; // 7.5% for growth portfolio
  
  const calculateFutureValue = (principal: number, rate: number, years: number) => {
    return principal * Math.pow(1 + rate, years);
  };
  
  const hisa30Year = calculateFutureValue(downPaymentAmount, conservativeReturn, 30);
  const balanced30Year = calculateFutureValue(downPaymentAmount, balancedReturn, 30);
  const growth30Year = calculateFutureValue(downPaymentAmount, growthReturn, 30);
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Long-Term Financial Impact of Homeownership</Text>
      <Text style={styles.paragraph}>
        Buying a home is not just about having a place to live—it's also a significant financial investment that can impact your wealth over time. This analysis explores how homeownership might affect your financial future.
      </Text>

      <Text style={styles.sectionTitle}>Home Equity Growth</Text>
      <Text style={styles.paragraph}>
        Home equity is the portion of your property that you truly "own." It's the difference between the market value of your home and the amount you still owe on your mortgage. Your equity grows in two ways: as you pay down your mortgage and as your home appreciates in value.
      </Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Projected Equity Growth</Text>
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Text style={styles.label}>Initial Down Payment:</Text>
          <Text style={styles.value}>{formatCurrency(downPaymentAmount)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>5-Year Equity (Est.):</Text>
          <Text style={styles.value}>{formatCurrency(fiveYearEquity)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>10-Year Equity (Est.):</Text>
          <Text style={styles.value}>{formatCurrency(tenYearEquity)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>20-Year Equity (Est.):</Text>
          <Text style={styles.value}>{formatCurrency(twentyYearEquity)}</Text>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Home Value Appreciation</Text>
      <Text style={styles.paragraph}>
        Historically, real estate has appreciated over time, though rates vary by location and economic conditions. Here's how your home's value might grow, assuming a conservative average annual appreciation rate of 3%.
      </Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Projected Home Value</Text>
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Text style={styles.label}>Initial Purchase Price:</Text>
          <Text style={styles.value}>{formatCurrency(homePrice)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>5-Year Value (Est.):</Text>
          <Text style={styles.value}>{formatCurrency(fiveYearHomeValue)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>10-Year Value (Est.):</Text>
          <Text style={styles.value}>{formatCurrency(tenYearHomeValue)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>20-Year Value (Est.):</Text>
          <Text style={styles.value}>{formatCurrency(twentyYearHomeValue)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Alternative Investment Scenarios</Text>
      <Text style={styles.paragraph}>
        If you invested your down payment amount in different types of investments instead of buying a home, here's how it might grow over 30 years:
      </Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>30-Year Investment Growth</Text>
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Text style={styles.label}>High-Interest Savings (2.5%):</Text>
          <Text style={styles.value}>{formatCurrency(hisa30Year)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Balanced Portfolio (5%):</Text>
          <Text style={styles.value}>{formatCurrency(balanced30Year)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Growth Portfolio (7.5%):</Text>
          <Text style={styles.value}>{formatCurrency(growth30Year)}</Text>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Balancing Homeownership and Retirement</Text>
      <Text style={styles.paragraph}>
        While homeownership can build wealth through equity, it's important to maintain a balanced approach to your financial future:
      </Text>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          <Text style={styles.bold}>Continue retirement contributions:</Text> Even while saving for and paying a mortgage, try to maintain contributions to retirement accounts.
        </Text>
      </View>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          <Text style={styles.bold}>Diversify investments:</Text> Don't view your home as your only investment. Maintain a diversified portfolio of other assets.
        </Text>
      </View>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          <Text style={styles.bold}>Consider housing as consumption and investment:</Text> Your home provides both a place to live (consumption) and potential appreciation (investment).
        </Text>
      </View>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          <Text style={styles.bold}>Plan for liquidity:</Text> Unlike retirement accounts, home equity isn't easily accessible. Maintain an emergency fund and liquid investments.
        </Text>
      </View>
      
      <Text style={styles.sectionTitle}>Leveraging Life Insurance in Your Financial Plan</Text>
      <Text style={styles.paragraph}>
        Permanent life insurance can be a valuable component of your overall financial strategy, offering both protection and potential cash value growth:
      </Text>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          <Text style={styles.bold}>Mortgage protection:</Text> Life insurance can ensure your family can keep the home if something happens to you.
        </Text>
      </View>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          <Text style={styles.bold}>Cash value growth:</Text> Permanent policies build cash value that can be borrowed against for home renovations or other needs.
        </Text>
      </View>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          <Text style={styles.bold}>Tax advantages:</Text> Cash value grows tax-deferred, and death benefits are generally tax-free.
        </Text>
      </View>
      
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          <Text style={styles.bold}>Retirement supplement:</Text> Cash value can provide supplemental retirement income through policy loans or withdrawals.
        </Text>
      </View>
      
      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          Note: These projections are estimates based on historical averages and assumptions. Actual results will vary based on market conditions, location, maintenance costs, and other factors. For personalized financial planning that integrates homeownership with your retirement goals, schedule a consultation with Joe at McLaughlin Financial Group.
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
    marginVertical: 16,
  },
  highlightLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
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