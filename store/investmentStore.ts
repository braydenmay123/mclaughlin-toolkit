import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

interface YearlyProjection {
  year: number;
  investmentValue: number;
  taxableValue: number;
  contributions: number;
  cumulativeContributions: number;
}

type RiskProfile = "conservative" | "balanced" | "growth";

interface InvestmentState {
  // Investment details
  initialInvestment: number;
  monthlyContribution: number;
  yearsToInvest: number;
  riskProfile: RiskProfile;
  
  // Calculated values
  projectedValue: number;
  yearlyProjections: YearlyProjection[];
  
  // Actions
  setInitialInvestment: (value: number) => void;
  setMonthlyContribution: (value: number) => void;
  setYearsToInvest: (value: number) => void;
  setRiskProfile: (value: RiskProfile) => void;
  calculateResults: () => void;
  resetCalculator: () => void;
}

const initialState = {
  // Investment details
  initialInvestment: 5000,
  monthlyContribution: 500,
  yearsToInvest: 20,
  riskProfile: "balanced" as RiskProfile,
  
  // Calculated values
  projectedValue: 0,
  yearlyProjections: [] as YearlyProjection[],
};

// Return rates based on risk profile
const getReturnRate = (riskProfile: RiskProfile) => {
  switch (riskProfile) {
    case "conservative":
      return 0.025; // 2.5%
    case "balanced":
      return 0.05; // 5%
    case "growth":
      return 0.075; // 7.5%
    default:
      return 0.05;
  }
};



export const useInvestmentStore = create<InvestmentState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setInitialInvestment: (value: number) => set({ initialInvestment: value }),
      
      setMonthlyContribution: (value: number) => set({ monthlyContribution: value }),
      
      setYearsToInvest: (value: number) => set({ yearsToInvest: value }),
      
      setRiskProfile: (value: RiskProfile) => set({ riskProfile: value }),
      
      calculateResults: () => {
        const {
          initialInvestment,
          monthlyContribution,
          yearsToInvest,
          riskProfile,
        } = get();
        
        const returnRate = getReturnRate(riskProfile);
        const annualContribution = monthlyContribution * 12;
        const currentYear = new Date().getFullYear();
        
        // Calculate investment growth
        let investmentValue = initialInvestment;
        const yearlyProjections: YearlyProjection[] = [];
        
        for (let year = 1; year <= yearsToInvest; year++) {
          const projectionYear = currentYear + year;
          
          // Calculate investment growth with compound interest
          investmentValue = (investmentValue + annualContribution) * (1 + returnRate);
          
          yearlyProjections.push({
            year: projectionYear,
            investmentValue,
            taxableValue: 0, // Not used in simplified version
            contributions: annualContribution,
            cumulativeContributions: initialInvestment + (annualContribution * year),
          });
        }
        
        set({
          projectedValue: investmentValue,
          yearlyProjections,
        });
      },
      
      resetCalculator: () => set(initialState),
    }),
    {
      name: "investment-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);