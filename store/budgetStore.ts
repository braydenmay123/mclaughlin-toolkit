import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  maxAmount: number;
  color: string;
  isEssential: boolean;
  icon: string;
}

interface BudgetState {
  budgetCategories: BudgetCategory[];
  currentWeek: number;
  weeklySpending: { [key: string]: number }[];
  totalSavings: number;
  
  // Actions
  setBudgetCategories: (categories: BudgetCategory[]) => void;
  setCurrentWeek: (week: number) => void;
  setWeeklySpending: (spending: { [key: string]: number }[]) => void;
  setTotalSavings: (savings: number) => void;
  resetBudget: () => void;
}

const initialState = {
  budgetCategories: [],
  currentWeek: 0,
  weeklySpending: [],
  totalSavings: 0,
};

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setBudgetCategories: (categories) => set({ budgetCategories: categories }),
      setCurrentWeek: (week) => set({ currentWeek: week }),
      setWeeklySpending: (spending) => set({ weeklySpending: spending }),
      setTotalSavings: (savings) => set({ totalSavings: savings }),
      resetBudget: () => set(initialState),
    }),
    {
      name: "budget-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);