import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { 
  PiggyBank, 
  Home, 
  Car, 
  ShoppingCart, 
  Coffee, 
  Gamepad2, 
  Heart, 
  Zap,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Target,
  BookOpen,
  Lightbulb,
  Award
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { formatCurrency } from "@/utils/calculations";
import { useBudgetStore, type BudgetCategory } from "@/store/budgetStore";
import { useCalculatorStore } from "@/store/calculatorStore";

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

interface InteractiveBudgetSimulatorProps {
  monthlyIncome?: number;
  futureHousingCost?: number;
  currentRent?: number;
  onComplete: () => void;
}

export default function InteractiveBudgetSimulator({
  onComplete,
}: InteractiveBudgetSimulatorProps) {
  const router = useRouter();
  const {
    budgetCategories,
    setBudgetCategories,
    currentWeek,
    setCurrentWeek,
    weeklySpending,
    setWeeklySpending,
    totalSavings,
    setTotalSavings,
    resetBudget,
  } = useBudgetStore();

  // Get calculator data
  const calculatorStore = useCalculatorStore();
  const monthlyIncome = calculatorStore.annualIncome / 12;
  const futureHousingCost = calculatorStore.biWeeklyTotalCostOfOwnership;
  const currentRent = calculatorStore.currentBiWeeklyRent;

  const [simulationStarted, setSimulationStarted] = useState(false);
  const [weeklyBudget, setWeeklyBudget] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showEducationalTip, setShowEducationalTip] = useState<string | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  // Calculate weekly amounts from calculator store
  const weeklyIncome = monthlyIncome / 4.33; // Average weeks per month
  const weeklyHousingCost = futureHousingCost; // Already bi-weekly
  const weeklyCurrentRent = currentRent; // Already bi-weekly

  // Educational tips for each category
  const educationalTips = {
    housing: "Housing costs should ideally be no more than 30% of your income. This includes mortgage, property taxes, insurance, and utilities.",
    groceries: "The average Canadian household spends about 10-15% of income on food. Meal planning can help reduce costs significantly.",
    transportation: "Consider all costs: car payments, insurance, gas, maintenance, and parking. Public transit might be more economical.",
    utilities: "Energy-efficient appliances and good insulation can reduce utility costs by 20-30% annually.",
    healthcare: "Budget for both insurance premiums and out-of-pocket expenses like dental care and prescriptions.",
    dining: "Eating out frequently can quickly add up. Try the 80/20 rule: cook at home 80% of the time, dine out 20%.",
    entertainment: "Entertainment is important for quality of life, but look for free or low-cost activities like hiking or community events.",
    savings: "Aim to save at least 20% of your income. Pay yourself first by automating savings transfers."
  };

  // Budget challenges for engagement
  const budgetChallenges = [
    { id: "emergency", title: "Emergency Fund Challenge", description: "Allocate enough to build a 3-month emergency fund", target: weeklyIncome * 0.15 },
    { id: "housing", title: "Housing Reality Check", description: "Keep housing costs under 35% of income", target: weeklyIncome * 0.35 },
    { id: "savings", title: "Future Millionaire", description: "Save at least 20% of your income", target: weeklyIncome * 0.20 },
  ];

  // Initialize budget categories with calculator data
  useEffect(() => {
    const initialCategories: BudgetCategory[] = [
      {
        id: "housing",
        name: "Housing",
        amount: weeklyHousingCost,
        maxAmount: weeklyHousingCost,
        color: "#4CAF50",
        isEssential: true,
        icon: "home",
      },
      {
        id: "groceries",
        name: "Groceries",
        amount: 0,
        maxAmount: weeklyIncome * 0.15,
        color: "#FF9800",
        isEssential: true,
        icon: "shopping-cart",
      },
      {
        id: "transportation",
        name: "Transportation",
        amount: 0,
        maxAmount: weeklyIncome * 0.15,
        color: "#2196F3",
        isEssential: true,
        icon: "car",
      },
      {
        id: "utilities",
        name: "Utilities",
        amount: 0,
        maxAmount: weeklyIncome * 0.08,
        color: "#9C27B0",
        isEssential: true,
        icon: "zap",
      },
      {
        id: "healthcare",
        name: "Healthcare",
        amount: 0,
        maxAmount: weeklyIncome * 0.08,
        color: "#E91E63",
        isEssential: true,
        icon: "heart",
      },
      {
        id: "dining",
        name: "Dining Out",
        amount: 0,
        maxAmount: weeklyIncome * 0.1,
        color: "#795548",
        isEssential: false,
        icon: "coffee",
      },
      {
        id: "entertainment",
        name: "Entertainment",
        amount: 0,
        maxAmount: weeklyIncome * 0.08,
        color: "#607D8B",
        isEssential: false,
        icon: "gamepad-2",
      },
      {
        id: "savings",
        name: "Savings",
        amount: 0,
        maxAmount: weeklyIncome * 0.25,
        color: "#4CAF50",
        isEssential: true,
        icon: "piggy-bank",
      },
    ];

    setBudgetCategories(initialCategories);
    const totalBudget = weeklyIncome - weeklyHousingCost;
    setWeeklyBudget(totalBudget);
    setRemainingBudget(totalBudget);
  }, [weeklyIncome, weeklyHousingCost]);

  const startSimulation = () => {
    setSimulationStarted(true);
    setCurrentWeek(1);
    setWeeklySpending([]);
    setTotalSavings(0);
    setCompletedChallenges([]);
  };

  const allocateBudget = (categoryId: string, amount: number) => {
    const updatedCategories = budgetCategories.map(cat => {
      if (cat.id === categoryId) {
        const newAmount = Math.min(Math.max(0, amount), cat.maxAmount);
        const difference = newAmount - cat.amount;
        setRemainingBudget(prev => prev - difference);
        return { ...cat, amount: newAmount };
      }
      return cat;
    });
    setBudgetCategories(updatedCategories);
    
    // Check for completed challenges
    checkChallenges(updatedCategories);
  };

  const checkChallenges = (categories: BudgetCategory[]) => {
    const newCompletedChallenges = [...completedChallenges];
    
    budgetChallenges.forEach(challenge => {
      if (!completedChallenges.includes(challenge.id)) {
        let isCompleted = false;
        
        switch (challenge.id) {
          case "emergency":
            const savingsCategory = categories.find(cat => cat.id === "savings");
            isCompleted = savingsCategory ? savingsCategory.amount >= challenge.target : false;
            break;
          case "housing":
            const housingCategory = categories.find(cat => cat.id === "housing");
            isCompleted = housingCategory ? housingCategory.amount <= challenge.target : false;
            break;
          case "savings":
            const savings = categories.find(cat => cat.id === "savings");
            isCompleted = savings ? savings.amount >= challenge.target : false;
            break;
        }
        
        if (isCompleted) {
          newCompletedChallenges.push(challenge.id);
          Alert.alert("Challenge Completed! 🎉", `You have completed the ${challenge.title}!`);
        }
      }
    });
    
    setCompletedChallenges(newCompletedChallenges);
  };

  const simulateWeek = () => {
    if (currentWeek > 4) {
      completeSimulation();
      return;
    }

    // Simulate random expenses within allocated budgets
    const weekExpenses: { [key: string]: number } = {};
    let totalWeekSpending = 0;

    budgetCategories.forEach(category => {
      if (category.id !== "housing" && category.amount > 0) {
        // Simulate spending 70-100% of allocated amount
        const spendingFactor = 0.7 + Math.random() * 0.3;
        const spent = category.amount * spendingFactor;
        weekExpenses[category.id] = spent;
        totalWeekSpending += spent;
      }
    });

    // Add housing cost
    weekExpenses["housing"] = weeklyHousingCost;
    totalWeekSpending += weeklyHousingCost;

    // Calculate savings for the week
    const weeklySavingsAmount = weeklyIncome - totalWeekSpending;
    weekExpenses["savings"] = Math.max(0, weeklySavingsAmount);

    const newWeeklySpending = [...weeklySpending, weekExpenses];
    setWeeklySpending(newWeeklySpending);
    setTotalSavings(totalSavings + weekExpenses["savings"]);
    setCurrentWeek(currentWeek + 1);
  };

  const completeSimulation = () => {
    const monthlyTotalSavings = totalSavings * 4.33; // Convert to monthly
    const savingsRate = (monthlyTotalSavings / monthlyIncome) * 100;

    let message = "";
    let title = "";

    if (savingsRate >= 20) {
      title = "Excellent Budget Management! 🎉";
      message = `You saved ${savingsRate.toFixed(1)}% of your income. You are well-prepared for homeownership and building wealth!`;
    } else if (savingsRate >= 10) {
      title = "Good Budget Management! 👍";
      message = `You saved ${savingsRate.toFixed(1)}% of your income. With some adjustments, you can be even better prepared for homeownership.`;
    } else {
      title = "Budget Needs Improvement 📊";
      message = `You only saved ${savingsRate.toFixed(1)}% of your income. Consider reducing discretionary spending to better prepare for homeownership.`;
    }

    Alert.alert(title, message, [
      {
        text: "Try Again",
        onPress: () => {
          resetBudget();
          setSimulationStarted(false);
          setCurrentWeek(0);
          setCompletedChallenges([]);
        },
      },
      {
        text: "Continue to Results",
        onPress: onComplete,
      },
    ]);
  };

  const getBudgetStatus = () => {
    const totalAllocated = budgetCategories.reduce((sum, cat) => sum + cat.amount, 0);
    const essentialAllocated = budgetCategories
      .filter(cat => cat.isEssential)
      .reduce((sum, cat) => sum + cat.amount, 0);

    if (totalAllocated > weeklyIncome) {
      return { status: "over", message: "Over budget! Reduce spending." };
    } else if (essentialAllocated < weeklyIncome * 0.6) {
      return { status: "under", message: "Allocate more to essentials." };
    } else {
      return { status: "good", message: "Budget looks balanced!" };
    }
  };

  const budgetStatus = getBudgetStatus();

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "housing": return <Home size={26} color="#4CAF50" />;
      case "groceries": return <ShoppingCart size={26} color="#FF9800" />;
      case "transportation": return <Car size={26} color="#2196F3" />;
      case "utilities": return <Zap size={26} color="#9C27B0" />;
      case "healthcare": return <Heart size={26} color="#E91E63" />;
      case "dining": return <Coffee size={26} color="#795548" />;
      case "entertainment": return <Gamepad2 size={26} color="#607D8B" />;
      case "savings": return <PiggyBank size={26} color="#4CAF50" />;
      default: return <Target size={26} color={Colors.primary} />;
    }
  };

  if (!simulationStarted) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Target size={36} color={Colors.primary} />
          <Text style={styles.title}>Budget Like a Homeowner</Text>
          <Text style={styles.subtitle}>
            Practice managing your budget with your future mortgage payment before you buy
          </Text>
        </View>

        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Current Weekly Rent</Text>
            <Text style={styles.comparisonValue}>{formatCurrency(weeklyCurrentRent)}</Text>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Future Weekly Housing</Text>
            <Text style={styles.comparisonValueHighlight}>{formatCurrency(weeklyHousingCost)}</Text>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Weekly Income</Text>
            <Text style={styles.comparisonValue}>{formatCurrency(weeklyIncome)}</Text>
          </View>
        </View>

        <View style={styles.instructionsContainer}>
          <BookOpen size={26} color={Colors.primary} style={styles.instructionIcon} />
          <Text style={styles.instructionsTitle}>How it works:</Text>
          <Text style={styles.instructionText}>
            1. Allocate your weekly budget across different categories{"\n"}
            2. Learn budgeting tips and complete challenges{"\n"}
            3. Simulate 4 weeks of spending with your future housing costs{"\n"}
            4. See how well you can manage your money as a homeowner{"\n"}
            5. Get personalized recommendations for improvement
          </Text>
        </View>

        <View style={styles.challengesContainer}>
          <Award size={26} color={Colors.primary} style={styles.challengeIcon} />
          <Text style={styles.challengesTitle}>Budget Challenges:</Text>
          {budgetChallenges.map(challenge => (
            <View key={challenge.id} style={styles.challengeItem}>
              <Text style={styles.challengeItemTitle}>{challenge.title}</Text>
              <Text style={styles.challengeItemDescription}>{challenge.description}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startSimulation}>
          <Text style={styles.startButtonText}>Start Budget Simulation</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.simulationHeader}>
        <Text style={styles.weekTitle}>Week {currentWeek} of 4</Text>
        <Text style={styles.budgetRemaining}>
          Remaining: {formatCurrency(remainingBudget)}
        </Text>
      </View>

      <View style={[
        styles.statusContainer,
        budgetStatus.status === "good" && styles.statusGood,
        budgetStatus.status === "over" && styles.statusOver,
        budgetStatus.status === "under" && styles.statusUnder,
      ]}>
        {budgetStatus.status === "good" && <CheckCircle size={22} color="#4CAF50" />}
        {budgetStatus.status !== "good" && <AlertCircle size={22} color="#FF5722" />}
        <Text style={styles.statusText}>{budgetStatus.message}</Text>
      </View>

      {completedChallenges.length > 0 && (
        <View style={styles.achievementsContainer}>
          <Award size={22} color={Colors.primary} style={styles.achievementIcon} />
          <Text style={styles.achievementsText}>
            Challenges completed: {completedChallenges.length}/{budgetChallenges.length}
          </Text>
        </View>
      )}

      <View style={styles.categoriesContainer}>
        {budgetCategories.map((category) => (
          <View key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              {getCategoryIcon(category.id)}
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryBudget}>
                  Max: {formatCurrency(category.maxAmount)}
                </Text>
              </View>
              {category.isEssential && (
                <View style={styles.essentialBadge}>
                  <Text style={styles.essentialText}>Essential</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.tipButton}
                onPress={() => setShowEducationalTip(showEducationalTip === category.id ? null : category.id)}
              >
                <Lightbulb size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {showEducationalTip === category.id && (
              <View style={styles.educationalTip}>
                <Text style={styles.educationalTipText}>{educationalTips[category.id as keyof typeof educationalTips]}</Text>
              </View>
            )}

            <View style={styles.allocationContainer}>
              <Text style={styles.allocationText}>
                Allocated: {formatCurrency(category.amount)}
              </Text>
              <View style={styles.allocationButtons}>
                <TouchableOpacity
                  style={styles.allocationButton}
                  onPress={() => allocateBudget(category.id, category.amount - 50)}
                >
                  <Text style={styles.allocationButtonText}>-$50</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.allocationButton}
                  onPress={() => allocateBudget(category.id, category.amount + 50)}
                >
                  <Text style={styles.allocationButtonText}>+$50</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min((category.amount / category.maxAmount) * 100, 100)}%`,
                    backgroundColor: category.color,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.simulationActions}>
        <TouchableOpacity
          style={[
            styles.simulateButton,
            budgetStatus.status === "over" && styles.simulateButtonDisabled,
          ]}
          onPress={simulateWeek}
          disabled={budgetStatus.status === "over"}
        >
          <Text style={styles.simulateButtonText}>
            {currentWeek <= 4 ? `Simulate Week ${currentWeek}` : "Complete Simulation"}
          </Text>
        </TouchableOpacity>
      </View>

      {weeklySpending.length > 0 && (
        <View style={styles.spendingHistory}>
          <Text style={styles.spendingTitle}>Spending History</Text>
          {weeklySpending.map((week, index) => (
            <View key={index} style={styles.weekSummary}>
              <Text style={styles.weekSummaryTitle}>Week {index + 1}</Text>
              <Text style={styles.weekSummaryAmount}>
                Saved: {formatCurrency(week.savings || 0)}
              </Text>
            </View>
          ))}
          <View style={styles.totalSavings}>
            <Text style={styles.totalSavingsText}>
              Total Savings: {formatCurrency(totalSavings)}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  headerContainer: {
    alignItems: "center",
    padding: 28,
    backgroundColor: Colors.background,
    borderRadius: 20,
    margin: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  title: {
    fontSize: isSmallScreen ? 24 : 26,
    fontWeight: "700",
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: isSmallScreen ? 15 : 17,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
  },
  comparisonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: Colors.background,
    margin: 20,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  comparisonItem: {
    alignItems: "center",
    flex: 1,
  },
  comparisonLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
    textAlign: "center",
    fontWeight: "500",
  },
  comparisonValue: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.text,
  },
  comparisonValueHighlight: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.primary,
  },
  instructionsContainer: {
    padding: 20,
    margin: 20,
    backgroundColor: Colors.infoLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.accentMedium,
  },
  instructionIcon: {
    marginBottom: 12,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  instructionText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontWeight: "500",
  },
  challengesContainer: {
    padding: 20,
    margin: 20,
    backgroundColor: Colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  challengeIcon: {
    marginBottom: 12,
  },
  challengesTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  challengeItem: {
    marginBottom: 12,
  },
  challengeItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  challengeItemDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontWeight: "500",
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    margin: 20,
    marginBottom: 40,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  simulationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  weekTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: -0.2,
  },
  budgetRemaining: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.text,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusGood: {
    backgroundColor: Colors.successLight,
    borderColor: "#4CAF50",
  },
  statusOver: {
    backgroundColor: Colors.errorLight,
    borderColor: "#FF5722",
  },
  statusUnder: {
    backgroundColor: Colors.warningLight,
    borderColor: "#FF9800",
  },
  statusText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  achievementsContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    margin: 20,
    backgroundColor: Colors.successLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  achievementIcon: {
    marginRight: 12,
  },
  achievementsText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },
  categoriesContainer: {
    padding: 20,
  },
  categoryCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 16,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  categoryBudget: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  essentialBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  essentialText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: "700",
  },
  tipButton: {
    padding: 6,
  },
  educationalTip: {
    backgroundColor: Colors.infoLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.accentMedium,
  },
  educationalTipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontWeight: "500",
  },
  allocationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  allocationText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  allocationButtons: {
    flexDirection: "row",
    gap: 10,
  },
  allocationButton: {
    backgroundColor: Colors.backgroundGray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  allocationButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  simulationActions: {
    padding: 20,
  },
  simulateButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  simulateButtonDisabled: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.6,
  },
  simulateButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  spendingHistory: {
    padding: 20,
    backgroundColor: Colors.background,
    margin: 20,
    borderRadius: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  spendingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  weekSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  weekSummaryTitle: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: "500",
  },
  weekSummaryAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
  },
  totalSavings: {
    paddingTop: 16,
    alignItems: "center",
  },
  totalSavingsText: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: -0.2,
  },
});