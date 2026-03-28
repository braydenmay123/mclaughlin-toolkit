import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  calculateDownPayment,
  calculateBiWeeklySavings,
  calculateMortgagePayment,
  calculateAnnualMortgagePayment,
  calculateTotalCostOfOwnership,
  calculateAffordability,
  calculateTaxSavings,
  calculateRetirementImpact,
  calculateMortgagePreQualification,
} from "@/utils/calculations";

interface CalculatorState {
  // Input values
  homePrice: number;
  interestRate: number;
  downPaymentPercent: number;
  mortgageTermYears: number;
  biWeeklyUtilitiesAndTaxes: number;
  currentBiWeeklyRent: number;
  monthlyInsurance: number;
  annualIncome: number;
  currentSavings: number;
  monthlyExpenses: number;
  monthlyDebtPayments: number;
  
  // User info
  userInfo: { name: string; email: string } | null;
  
  // Calculated values
  downPaymentAmount: number;
  biWeeklySavings3Years: number;
  biWeeklySavings5Years: number;
  mortgageAmount: number;
  biWeeklyMortgagePayment: number;
  annualMortgagePayment: number;
  biWeeklyTotalCostOfOwnership: number;
  biWeeklyAffordabilityGap: number;
  annualTaxSavings: number;
  retirementImpact: number;
  mortgagePreQualification: number;
  timeToReachDownPayment: number;
  practicePaymentAmount: number;
  
  // Actions
  setHomePrice: (value: number) => void;
  setInterestRate: (value: number) => void;
  setDownPaymentPercent: (value: number) => void;
  setMortgageTermYears: (value: number) => void;
  setBiWeeklyUtilitiesAndTaxes: (value: number) => void;
  setCurrentBiWeeklyRent: (value: number) => void;
  setMonthlyInsurance: (value: number) => void;
  setAnnualIncome: (value: number) => void;
  setCurrentSavings: (value: number) => void;
  setMonthlyExpenses: (value: number) => void;
  setMonthlyDebtPayments: (value: number) => void;
  setUserInfo: (info: { name: string; email: string }) => void;
  calculateResults: () => void;
  resetCalculator: () => void;
}

const initialState = {
  // Input values
  homePrice: 600000,
  interestRate: 3.99,
  downPaymentPercent: 10,
  mortgageTermYears: 30,
  biWeeklyUtilitiesAndTaxes: 353,
  currentBiWeeklyRent: 1000,
  monthlyInsurance: 150,
  annualIncome: 90000,
  currentSavings: 10000,
  monthlyExpenses: 2500,
  monthlyDebtPayments: 500,
  
  // User info
  userInfo: null,
  
  // Calculated values
  downPaymentAmount: 0,
  biWeeklySavings3Years: 0,
  biWeeklySavings5Years: 0,
  mortgageAmount: 0,
  biWeeklyMortgagePayment: 0,
  annualMortgagePayment: 0,
  biWeeklyTotalCostOfOwnership: 0,
  biWeeklyAffordabilityGap: 0,
  annualTaxSavings: 0,
  retirementImpact: 0,
  mortgagePreQualification: 0,
  timeToReachDownPayment: 0,
  practicePaymentAmount: 0,
};

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setHomePrice: (value: number) => set({ homePrice: value }),
      setInterestRate: (value: number) => set({ interestRate: value }),
      setDownPaymentPercent: (value: number) => set({ downPaymentPercent: value }),
      setMortgageTermYears: (value: number) => set({ mortgageTermYears: value }),
      setBiWeeklyUtilitiesAndTaxes: (value: number) => set({ biWeeklyUtilitiesAndTaxes: value }),
      setCurrentBiWeeklyRent: (value: number) => set({ currentBiWeeklyRent: value }),
      setMonthlyInsurance: (value: number) => set({ monthlyInsurance: value }),
      setAnnualIncome: (value: number) => set({ annualIncome: value }),
      setCurrentSavings: (value: number) => set({ currentSavings: value }),
      setMonthlyExpenses: (value: number) => set({ monthlyExpenses: value }),
      setMonthlyDebtPayments: (value: number) => set({ monthlyDebtPayments: value }),
      setUserInfo: (info: { name: string; email: string }) => set({ userInfo: info }),
      
      calculateResults: () => {
        const {
          homePrice,
          interestRate,
          downPaymentPercent,
          mortgageTermYears,
          biWeeklyUtilitiesAndTaxes,
          currentBiWeeklyRent,
          monthlyInsurance,
          annualIncome,
          currentSavings,
        } = get();
        
        // Calculate down payment
        const downPaymentAmount = calculateDownPayment(homePrice, downPaymentPercent);
        
        // Calculate bi-weekly savings needed
        const biWeeklySavings3Years = calculateBiWeeklySavings(downPaymentAmount, 3);
        const biWeeklySavings5Years = calculateBiWeeklySavings(downPaymentAmount, 5);
        
        // Calculate mortgage amount
        const mortgageAmount = homePrice - downPaymentAmount;
        
        // Calculate mortgage payments
        const biWeeklyMortgagePayment = calculateMortgagePayment(
          mortgageAmount,
          interestRate,
          mortgageTermYears,
          "biweekly"
        );
        
        const annualMortgagePayment = calculateAnnualMortgagePayment(biWeeklyMortgagePayment);
        
        // Calculate total cost of ownership
        const biWeeklyTotalCostOfOwnership = calculateTotalCostOfOwnership(
          biWeeklyMortgagePayment,
          biWeeklyUtilitiesAndTaxes
        );
        
        // Calculate affordability gap
        const biWeeklyAffordabilityGap = calculateAffordability(
          currentBiWeeklyRent,
          biWeeklyTotalCostOfOwnership
        );
        
        // Calculate tax savings (if income is provided)
        const annualTaxSavings = annualIncome > 0 
          ? calculateTaxSavings(annualMortgagePayment, annualIncome) 
          : 0;
        
        // Calculate retirement impact
        const retirementImpact = calculateRetirementImpact(
          biWeeklySavings3Years,
          downPaymentAmount
        );
        
        // Calculate mortgage pre-qualification
        const mortgagePreQualification = annualIncome > 0
          ? calculateMortgagePreQualification(annualIncome)
          : 0;
        
        // Calculate time to reach down payment with current savings
        const remainingDownPayment = Math.max(0, downPaymentAmount - currentSavings);
        const timeToReachDownPayment = remainingDownPayment > 0
          ? (remainingDownPayment / (biWeeklySavings3Years * 26)) * 12 // in months
          : 0;
        
        // Calculate practice payment amount (mortgage + utilities + insurance - current rent)
        const practicePaymentAmount = biWeeklyTotalCostOfOwnership + (monthlyInsurance / 2) - currentBiWeeklyRent;
        
        set({
          downPaymentAmount,
          biWeeklySavings3Years,
          biWeeklySavings5Years,
          mortgageAmount,
          biWeeklyMortgagePayment,
          annualMortgagePayment,
          biWeeklyTotalCostOfOwnership,
          biWeeklyAffordabilityGap,
          annualTaxSavings,
          retirementImpact,
          mortgagePreQualification,
          timeToReachDownPayment,
          practicePaymentAmount,
        });
      },
      
      resetCalculator: () => set(initialState),
    }),
    {
      name: "calculator-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);