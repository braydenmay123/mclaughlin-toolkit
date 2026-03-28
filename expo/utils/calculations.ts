/**
 * Financial calculations for the First-Time Homebuyer Calculator
 */

// Calculate down payment amount
export const calculateDownPayment = (homePrice: number, downPaymentPercent: number): number => {
  return homePrice * (downPaymentPercent / 100);
};

// Calculate bi-weekly savings needed to reach down payment
export const calculateBiWeeklySavings = (
  downPaymentAmount: number,
  yearsToSave: number
): number => {
  const numberOfPayments = yearsToSave * 26; // 26 bi-weekly payments per year
  return downPaymentAmount / numberOfPayments;
};

// Calculate mortgage payment (bi-weekly)
export const calculateMortgagePayment = (
  principal: number,
  annualInterestRate: number,
  termYears: number,
  paymentFrequency: "biweekly" | "monthly" = "biweekly"
): number => {
  // Convert annual interest rate to per-payment rate
  const periodsPerYear = paymentFrequency === "biweekly" ? 26 : 12;
  const totalPeriods = termYears * periodsPerYear;
  const interestRatePerPeriod = annualInterestRate / 100 / periodsPerYear;
  
  // Mortgage payment formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
  // Where: P = payment, L = loan amount, c = interest rate per period, n = total number of payments
  const payment = 
    (principal * 
      (interestRatePerPeriod * Math.pow(1 + interestRatePerPeriod, totalPeriods))) / 
    (Math.pow(1 + interestRatePerPeriod, totalPeriods) - 1);
  
  return payment;
};

// Calculate annual mortgage payments
export const calculateAnnualMortgagePayment = (biWeeklyPayment: number): number => {
  return biWeeklyPayment * 26; // 26 bi-weekly payments per year
};

// Calculate total cost of ownership (mortgage + utilities + taxes)
export const calculateTotalCostOfOwnership = (
  biWeeklyMortgage: number,
  biWeeklyUtilitiesAndTaxes: number
): number => {
  return biWeeklyMortgage + biWeeklyUtilitiesAndTaxes;
};

// Calculate affordability (comparing current rent to future homeownership costs)
export const calculateAffordability = (
  biWeeklyRent: number,
  biWeeklyTotalCostOfOwnership: number
): number => {
  return biWeeklyTotalCostOfOwnership - biWeeklyRent;
};

// Calculate estimated tax savings from mortgage interest deduction
export const calculateTaxSavings = (
  annualMortgagePayment: number,
  annualIncome: number
): number => {
  // Simplified calculation - assumes 70% of mortgage payment is interest in early years
  // and uses a marginal tax rate based on income
  const estimatedInterest = annualMortgagePayment * 0.7;
  
  // Determine marginal tax rate based on income (simplified)
  let marginalTaxRate = 0.15;
  if (annualIncome > 50000) marginalTaxRate = 0.20;
  if (annualIncome > 100000) marginalTaxRate = 0.25;
  if (annualIncome > 150000) marginalTaxRate = 0.30;
  
  return estimatedInterest * marginalTaxRate;
};

// Calculate retirement savings impact
export const calculateRetirementImpact = (
  biWeeklySavings: number,
  downPaymentAmount: number
): number => {
  // Simplified calculation - assumes investing the down payment amount for 30 years
  // at 7% annual return instead of buying a house
  const annualSavings = biWeeklySavings * 26;
  const years = 30;
  const annualReturnRate = 0.07;
  
  // Future value of investment formula: FV = P(1+r)^n
  // Where: FV = future value, P = principal, r = rate, n = number of periods
  const futureValue = downPaymentAmount * Math.pow(1 + annualReturnRate, years);
  
  // This is the opportunity cost of using the down payment for a house instead of investing
  return Math.round(futureValue - downPaymentAmount);
};

// Calculate mortgage pre-qualification estimate
export const calculateMortgagePreQualification = (annualIncome: number): number => {
  // Simplified calculation - typically banks allow 28-36% of gross income for housing
  // Using 32% as a middle ground
  const monthlyIncome = annualIncome / 12;
  const maxMonthlyPayment = monthlyIncome * 0.32;
  
  // Rough estimate of mortgage amount based on monthly payment
  // Assumes 30-year term at 4% interest
  const estimatedMortgageAmount = maxMonthlyPayment * 209; // Multiplier for 30yr @ 4%
  
  return Math.round(estimatedMortgageAmount);
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};