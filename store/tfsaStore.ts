import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

// Define contribution limits by year
const CONTRIBUTION_LIMITS = {
  2009: 5000,
  2010: 5000,
  2011: 5000,
  2012: 5000,
  2013: 5500,
  2014: 5500,
  2015: 10000,
  2016: 5500,
  2017: 5500,
  2018: 5500,
  2019: 6000,
  2020: 6000,
  2021: 6000,
  2022: 6000,
  2023: 6500,
  2024: 7000,
  2025: 7000,
};

// Calculate cumulative contribution room based on birth year
export const calculateCumulativeRoom = (birthYear: number, currentYear = new Date().getFullYear()): number => {
  let eligibilityYear = birthYear + 18;
  
  // If they weren't 18 by 2009 (when TFSA started), use their eligibility year
  eligibilityYear = Math.max(eligibilityYear, 2009);
  
  // Calculate total contribution room
  let totalRoom = 0;
  for (let year = eligibilityYear; year <= currentYear; year++) {
    if (CONTRIBUTION_LIMITS[year as keyof typeof CONTRIBUTION_LIMITS]) {
      totalRoom += CONTRIBUTION_LIMITS[year as keyof typeof CONTRIBUTION_LIMITS];
    }
  }
  
  return totalRoom;
};

interface ContributionRecord {
  year: number;
  amount: number;
}

interface WithdrawalRecord {
  year: number;
  amount: number;
}

interface TFSAState {
  // Personal information
  birthYear: number;
  canadianResidentSince: number;
  
  // Contribution tracking
  currentTFSARoom: number;
  pastContributions: ContributionRecord[];
  pastWithdrawals: WithdrawalRecord[];
  
  // Calculated values
  contributionRoom: number;
  hasOvercontributed: boolean;
  overcontributionAmount: number;
  
  // Actions
  setBirthYear: (value: number) => void;
  setCanadianResidentSince: (value: number) => void;
  setCurrentTFSARoom: (value: number) => void;
  addContribution: (year: number, amount: number) => void;
  addWithdrawal: (year: number, amount: number) => void;
  removeContribution: (index: number) => void;
  removeWithdrawal: (index: number) => void;
  calculateContributionRoom: () => void;
  resetCalculator: () => void;
}

const initialState = {
  // Personal information
  birthYear: new Date().getFullYear() - 30, // Default to 30 years old
  canadianResidentSince: 2009, // Default to TFSA inception
  
  // Contribution tracking
  currentTFSARoom: 0, // User will enter their current room
  pastContributions: [] as ContributionRecord[],
  pastWithdrawals: [] as WithdrawalRecord[],
  
  // Calculated values
  contributionRoom: 0,
  hasOvercontributed: false,
  overcontributionAmount: 0,
};

export const useTFSAStore = create<TFSAState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setBirthYear: (value: number) => {
        set({ birthYear: value });
        get().calculateContributionRoom();
      },
      
      setCanadianResidentSince: (value: number) => {
        set({ canadianResidentSince: value });
        get().calculateContributionRoom();
      },
      
      setCurrentTFSARoom: (value: number) => {
        set({ currentTFSARoom: value });
        get().calculateContributionRoom();
      },
      
      addContribution: (year: number, amount: number) => {
        const pastContributions = [...get().pastContributions, { year, amount }];
        set({ pastContributions });
        get().calculateContributionRoom();
      },
      
      addWithdrawal: (year: number, amount: number) => {
        const pastWithdrawals = [...get().pastWithdrawals, { year, amount }];
        set({ pastWithdrawals });
        get().calculateContributionRoom();
      },
      
      removeContribution: (index: number) => {
        const pastContributions = [...get().pastContributions];
        pastContributions.splice(index, 1);
        set({ pastContributions });
        get().calculateContributionRoom();
      },
      
      removeWithdrawal: (index: number) => {
        const pastWithdrawals = [...get().pastWithdrawals];
        pastWithdrawals.splice(index, 1);
        set({ pastWithdrawals });
        get().calculateContributionRoom();
      },
      
      calculateContributionRoom: () => {
        const { birthYear, canadianResidentSince, pastContributions, pastWithdrawals, currentTFSARoom } = get();
        const currentYear = new Date().getFullYear();
        
        // Calculate base contribution room based on eligibility
        const eligibilityYear = Math.max(birthYear + 18, canadianResidentSince, 2009);
        let totalRoom = calculateCumulativeRoom(birthYear, currentYear);
        
        // If user has entered their current room, use that as the base
        if (currentTFSARoom > 0) {
          totalRoom = currentTFSARoom;
        }
        
        // Subtract all contributions made
        const totalContributions = pastContributions.reduce((sum, record) => sum + record.amount, 0);
        
        // Add back withdrawals from previous years (they restore room in following year)
        const withdrawalsToAdd = pastWithdrawals
          .filter(record => record.year < currentYear) // Only withdrawals from previous years
          .reduce((sum, record) => sum + record.amount, 0);
        
        // Calculate remaining room
        const remainingRoom = totalRoom - totalContributions + withdrawalsToAdd;
        const hasOvercontributed = remainingRoom < 0;
        
        set({ 
          contributionRoom: remainingRoom,
          hasOvercontributed,
          overcontributionAmount: hasOvercontributed ? Math.abs(remainingRoom) : 0,
        });
      },
      
      resetCalculator: () => set(initialState),
    }),
    {
      name: "tfsa-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);