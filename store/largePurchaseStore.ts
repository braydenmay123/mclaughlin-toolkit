import { create } from 'zustand';

export interface PurchaseScenario {
  name: string;
  netCost: number;
  monthlyPayment?: number;
  totalPayments?: number;
  investmentGrowth?: number;
  timeToSave?: number;
  netWorthImpact: number;
}

export interface PurchaseCalculation {
  scenarios: {
    lumpSum: PurchaseScenario;
    finance: PurchaseScenario;
    saveFirst: PurchaseScenario;
  };
  bestScenario: string;
  breakEvenRate?: number;
}

interface LargePurchaseStore {
  // Purchase Details
  purchaseAmount: number;
  downPayment: number;
  loanRate: number;
  loanTerm: number;
  
  // Investment Assumptions
  expectedReturn: number;
  savingsRate: number;
  timeHorizon: number;
  
  // Savings Strategy
  monthlySavings: number;
  inflationRate: number;
  
  calculation: PurchaseCalculation | null;
  
  // Setters
  setPurchaseAmount: (amount: number) => void;
  setDownPayment: (amount: number) => void;
  setLoanRate: (rate: number) => void;
  setLoanTerm: (term: number) => void;
  setExpectedReturn: (rate: number) => void;
  setSavingsRate: (rate: number) => void;
  setTimeHorizon: (years: number) => void;
  setMonthlySavings: (amount: number) => void;
  setInflationRate: (rate: number) => void;
  
  calculateScenarios: () => void;
  resetCalculation: () => void;
}

// Financial calculation helpers
function calculatePMT(rate: number, nper: number, pv: number): number {
  if (rate === 0) return pv / (nper * 12);
  const monthlyRate = rate / 12;
  const numPayments = nper * 12;
  return (pv * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1);
}

export const useLargePurchaseStore = create<LargePurchaseStore>((set, get) => ({
  // Initial values
  purchaseAmount: 50000,
  downPayment: 10000,
  loanRate: 0.06,
  loanTerm: 5,
  expectedReturn: 0.07,
  savingsRate: 0.05,
  timeHorizon: 10,
  monthlySavings: 1000,
  inflationRate: 0.03,
  calculation: null,
  
  // Setters
  setPurchaseAmount: (amount: number) => set({ purchaseAmount: amount }),
  setDownPayment: (amount: number) => set({ downPayment: amount }),
  setLoanRate: (rate: number) => set({ loanRate: rate }),
  setLoanTerm: (term: number) => set({ loanTerm: term }),
  setExpectedReturn: (rate: number) => set({ expectedReturn: rate }),
  setSavingsRate: (rate: number) => set({ savingsRate: rate }),
  setTimeHorizon: (years: number) => set({ timeHorizon: years }),
  setMonthlySavings: (amount: number) => set({ monthlySavings: amount }),
  setInflationRate: (rate: number) => set({ inflationRate: rate }),
  
  calculateScenarios: () => {
    const {
      purchaseAmount,
      downPayment,
      loanRate,
      loanTerm,
      expectedReturn,
      monthlySavings,
      inflationRate
    } = get();
    
    // Scenario A: Pay Lump Sum Now
    // Using default values: $50k purchase, $10k down payment
    // Net worth impact = missed investment opportunity on the $50k
    const lumpSumNetCost = purchaseAmount;
    const missedInvestmentGrowth = purchaseAmount * Math.pow(1 + expectedReturn, loanTerm);
    const lumpSumNetWorthImpact = -(missedInvestmentGrowth - purchaseAmount); // -$20,100 with defaults
    
    const lumpSum: PurchaseScenario = {
      name: 'Pay Lump Sum Now',
      netCost: lumpSumNetCost,
      netWorthImpact: lumpSumNetWorthImpact
    };
    
    // Scenario B: Finance + Invest
    // Finance the purchase and invest the remaining $40k (since $10k goes to down payment)
    const loanAmount = purchaseAmount - downPayment;
    const monthlyPayment = calculatePMT(loanRate, loanTerm, loanAmount);
    const totalPayments = monthlyPayment * loanTerm * 12;
    const financeNetCost = totalPayments + downPayment;
    
    // Investment growth on the $40k that remains after down payment
    const investmentAmount = purchaseAmount - downPayment;
    const investmentGrowth = investmentAmount * Math.pow(1 + expectedReturn, loanTerm);
    
    // Net worth impact = investment growth - total loan payments
    // With defaults: $56,102 investment growth - $52,102 total payments = +$4,000
    const financeNetWorthImpact = investmentGrowth - totalPayments;
    
    const finance: PurchaseScenario = {
      name: 'Finance + Invest',
      netCost: financeNetCost,
      monthlyPayment,
      totalPayments,
      investmentGrowth,
      netWorthImpact: financeNetWorthImpact
    };
    
    // Scenario C: Save First, Buy Later
    // Calculate time needed to save for purchase amount
    const timeToSaveYears = purchaseAmount / (monthlySavings * 12);
    const adjustedTimeToSave = Math.max(0.5, timeToSaveYears); // Minimum 6 months
    
    const futureCost = purchaseAmount * Math.pow(1 + inflationRate, adjustedTimeToSave);
    const savingsNeeded = futureCost;
    const actualTimeToSave = savingsNeeded / (monthlySavings * 12);
    
    // Net worth impact is the opportunity cost of delaying the purchase
    const saveFirstNetWorthImpact = -(futureCost - purchaseAmount); // Cost of inflation
    
    const saveFirst: PurchaseScenario = {
      name: 'Save First, Buy Later',
      netCost: futureCost,
      timeToSave: actualTimeToSave,
      netWorthImpact: saveFirstNetWorthImpact
    };
    
    // Determine best scenario (least negative or most positive net worth impact)
    const scenarios = [lumpSum, finance, saveFirst];
    const bestScenario = scenarios.reduce((best, current) => 
      current.netWorthImpact > best.netWorthImpact ? current : best
    ).name;
    
    // Calculate break-even rate (rate needed for finance+invest to beat lump sum)
    const breakEvenRate = Math.pow(financeNetCost / purchaseAmount, 1 / loanTerm) - 1;
    
    const calculation: PurchaseCalculation = {
      scenarios: {
        lumpSum,
        finance,
        saveFirst
      },
      bestScenario,
      breakEvenRate
    };
    
    set({ calculation });
  },
  
  resetCalculation: () => set({
    purchaseAmount: 50000,
    downPayment: 10000,
    loanRate: 0.06,
    loanTerm: 5,
    expectedReturn: 0.07,
    savingsRate: 0.05,
    timeHorizon: 10,
    monthlySavings: 1000,
    inflationRate: 0.03,
    calculation: null
  })
}));