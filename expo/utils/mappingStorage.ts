import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const MAPPING_STORAGE_KEY = 'mfg_asset_mapping';
const PROVINCES = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'YT', label: 'Yukon' },
];

export { PROVINCES };

export interface MappingItem {
  id: string;
  label: string;
  amount: number;
  accountType?: string;
  notes?: string;
  // Enhanced metadata for deeper analysis
  interestRate?: number;        // % APR, applies to liabilities & interest-bearing assets
  monthlyPayment?: number;      // For liabilities & debt (monthly)
  annualContribution?: number;  // For registered savings (TFSA/RRSP/FHSA/RESP/RDSP)
  contributionRoom?: number;    // Available room for registered accounts
  institution?: string;         // Where the account is held
  maturityDate?: string;         // For GICs / term deposits (YYYY-MM-DD)
  monthlyIncome?: number;        // For income-generating assets (rental, dividends)
}

export interface MappingCategory {
  id: string;
  name: string;
  type: 'asset' | 'liability';
  items: MappingItem[];
}

export interface MappingData {
  categories: MappingCategory[];
  lastUpdated: number;
}

const getStorage = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    return {
      getItem: (key: string) => Promise.resolve(window.localStorage.getItem(key)),
      setItem: (key: string, value: string) => Promise.resolve(window.localStorage.setItem(key, value)),
      removeItem: (key: string) => Promise.resolve(window.localStorage.removeItem(key)),
    };
  }
  return AsyncStorage;
};

const getDefaultCategories = (): MappingCategory[] => [
  {
    id: 'cash-savings',
    name: 'Cash/Chequing/Savings',
    type: 'asset',
    items: [],
  },
  {
    id: 'tfsa',
    name: 'TFSA',
    type: 'asset',
    items: [],
  },
  {
    id: 'rrsp',
    name: 'RRSP',
    type: 'asset',
    items: [],
  },
  {
    id: 'fhsa',
    name: 'FHSA',
    type: 'asset',
    items: [],
  },
  {
    id: 'resp',
    name: 'RESP',
    type: 'asset',
    items: [],
  },
  {
    id: 'rdsp',
    name: 'RDSP',
    type: 'asset',
    items: [],
  },
  {
    id: 'non-registered',
    name: 'Non-Registered',
    type: 'asset',
    items: [],
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    type: 'asset',
    items: [],
  },
  {
    id: 'business-equity',
    name: 'Business Equity',
    type: 'asset',
    items: [],
  },
  {
    id: 'mortgage',
    name: 'Mortgage',
    type: 'liability',
    items: [],
  },
  {
    id: 'credit-debt',
    name: 'Credit Cards/Lines of Credit',
    type: 'liability',
    items: [],
  },
  {
    id: 'student-loans',
    name: 'Student Loans',
    type: 'liability',
    items: [],
  },
  {
    id: 'car-loans',
    name: 'Car Loans',
    type: 'liability',
    items: [],
  },
  {
    id: 'other-loans',
    name: 'Other Loans',
    type: 'liability',
    items: [],
  },
];

export const getMappingData = async (): Promise<MappingData> => {
  try {
    const storage = getStorage();
    const stored = await storage.getItem(MAPPING_STORAGE_KEY);
    
    if (!stored) {
      const defaultData: MappingData = {
        categories: getDefaultCategories(),
        lastUpdated: Date.now(),
      };
      return defaultData;
    }
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error getting mapping data:', error);
    return {
      categories: getDefaultCategories(),
      lastUpdated: Date.now(),
    };
  }
};

export const saveMappingData = async (data: MappingData): Promise<void> => {
  try {
    const storage = getStorage();
    const updatedData = {
      ...data,
      lastUpdated: Date.now(),
    };
    await storage.setItem(MAPPING_STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving mapping data:', error);
    throw error;
  }
};

export const clearMappingData = async (): Promise<void> => {
  try {
    const storage = getStorage();
    await storage.removeItem(MAPPING_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing mapping data:', error);
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const calculateTotals = (categories: MappingCategory[]) => {
  const assets = categories.filter(cat => cat.type === 'asset');
  const liabilities = categories.filter(cat => cat.type === 'liability');
  
  const totalAssets = assets.reduce((sum, category) => 
    sum + category.items.reduce((catSum, item) => catSum + item.amount, 0), 0
  );
  
  const totalLiabilities = liabilities.reduce((sum, category) => 
    sum + category.items.reduce((catSum, item) => catSum + item.amount, 0), 0
  );
  
  const netWorth = totalAssets - totalLiabilities;
  
  return {
    totalAssets,
    totalLiabilities,
    netWorth,
  };
};

// Extended Asset Map Data for multi-step flow
const ASSET_MAP_STORAGE_KEY = 'mfg_asset_map_extended';

// Step 2: Personal Information
export interface PersonalInfo {
  age?: number;
  hasSpouse: boolean;
  spouseAge?: number;
  dependents: number;
  householdIncome?: number;       // Gross annual household income
  monthlyTakeHome?: number;        // Net monthly household income (after tax)
  monthlyExpenses?: number;        // Total essential monthly living expenses
  monthlyDebtPayments?: number;    // Total monthly debt obligations (rent, loan, cc min)
  monthlySavings?: number;         // Amount currently saved/invested per month
  province: string;
  targetRetirementAge?: number;
  targetRetirementIncome?: number;
  isHomeowner: boolean;
  // Optional advanced inputs for retirement projection
  expectedReturnRate?: number;    // Expected annual investment return % (default 6)
  expectedInflationRate?: number; // Expected annual inflation % (default 2.5)
}

// Step 3: Insurance Information
export interface InsuranceInfo {
  lifeCoverage?: number;
  lifeType: 'term' | 'whole' | 'ul' | 'mix' | 'none';
  lifeMonthlyPremium?: number;       // Monthly premium for life insurance
  disabilityBenefit?: number;
  disabilityEliminationPeriod?: number;
  disabilityMonthlyPremium?: number; // Monthly premium for disability coverage
  criticalIllnessCoverage?: number;
  criticalIllnessMonthlyPremium?: number;
  homeCoverage?: number;
  homeMonthlyPremium?: number;
  autoLiabilityLimit?: number;
  autoMonthlyPremium?: number;
  umbrellaCoverage?: number;
  umbrellaMonthlyPremium?: number;
  hasGroupBenefits: boolean;
  groupBenefitsCoverage?: string;    // Brief description of group coverage
}

export interface AssetMapData {
  // Step 1: Finances (reuse existing MappingData)
  mappingData: MappingData;
  
  // Step 2: Personal
  personalInfo: PersonalInfo;
  
  // Step 3: Insurance
  insuranceInfo: InsuranceInfo;
  
  // Navigation
  currentStep: number;
  lastUpdated: number;
}

const getDefaultPersonalInfo = (): PersonalInfo => ({
  hasSpouse: false,
  dependents: 0,
  province: 'ON',
  isHomeowner: false,
});

const getDefaultInsuranceInfo = (): InsuranceInfo => ({
  lifeType: 'none',
  hasGroupBenefits: false,
});

export const getAssetMapData = async (): Promise<AssetMapData> => {
  try {
    const storage = getStorage();
    const stored = await storage.getItem(ASSET_MAP_STORAGE_KEY);
    
    if (!stored) {
      const mappingData = await getMappingData();
      const defaultData: AssetMapData = {
        mappingData,
        personalInfo: getDefaultPersonalInfo(),
        insuranceInfo: getDefaultInsuranceInfo(),
        currentStep: 1,
        lastUpdated: Date.now(),
      };
      return defaultData;
    }
    
    const data = JSON.parse(stored);
    // Ensure we have the latest mapping data
    const mappingData = await getMappingData();
    
    return {
      ...data,
      mappingData, // Always use the latest mapping data
    };
  } catch (error) {
    console.error('Error getting asset map data:', error);
    const mappingData = await getMappingData();
    return {
      mappingData,
      personalInfo: getDefaultPersonalInfo(),
      insuranceInfo: getDefaultInsuranceInfo(),
      currentStep: 1,
      lastUpdated: Date.now(),
    };
  }
};

export const saveAssetMapData = async (data: AssetMapData): Promise<void> => {
  try {
    const storage = getStorage();
    
    // Save the mapping data separately
    await saveMappingData(data.mappingData);
    
    // Save the extended asset map data
    const updatedData = {
      ...data,
      lastUpdated: Date.now(),
    };
    await storage.setItem(ASSET_MAP_STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving asset map data:', error);
    throw error;
  }
};

export const clearAssetMapData = async (): Promise<void> => {
  try {
    const storage = getStorage();
    await storage.removeItem(ASSET_MAP_STORAGE_KEY);
    await clearMappingData();
  } catch (error) {
    console.error('Error clearing asset map data:', error);
  }
};

// Helper functions for calculations
export const calculateSavingsRate = (personalInfo: PersonalInfo, categories: MappingCategory[]) => {
  if (!personalInfo.householdIncome || !categories) return null;
  
  // Simple estimation: assume 10% of assets were added this year
  const totals = calculateTotals(categories);
  const estimatedAnnualSavings = totals.totalAssets * 0.1;
  
  return (estimatedAnnualSavings / personalInfo.householdIncome) * 100;
};

export const calculateDebtToIncome = (personalInfo: PersonalInfo, categories: MappingCategory[]) => {
  if (!personalInfo.householdIncome || !categories) return null;
  
  const totals = calculateTotals(categories);
  return (totals.totalLiabilities / personalInfo.householdIncome) * 100;
};

export const getProtectionSnapshot = (insuranceInfo: InsuranceInfo, personalInfo: PersonalInfo) => {
  const hasLife = insuranceInfo.lifeType !== 'none' && (insuranceInfo.lifeCoverage || 0) > 0;
  const hasDisability = (insuranceInfo.disabilityBenefit || 0) > 0;
  const hasDependents = personalInfo.hasSpouse || personalInfo.dependents > 0;
  
  return {
    hasLife,
    hasDisability,
    hasDependents,
    adequateLife: hasLife && hasDependents,
    adequateDisability: hasDisability && personalInfo.householdIncome ? 
      (insuranceInfo.disabilityBenefit || 0) >= (personalInfo.householdIncome * 0.6 / 12) : false,
  };
};

export const getTaxConsiderations = (categories: MappingCategory[]) => {
  if (!categories) return [];
  
  const considerations: string[] = [];
  
  const nonRegistered = categories.find(cat => cat.id === 'non-registered');
  if (nonRegistered && nonRegistered.items.length > 0) {
    const hasGains = nonRegistered.items.some(item => 
      item.notes?.toLowerCase().includes('gain') || item.amount > 10000
    );
    if (hasGains) {
      considerations.push('Capital gains exposure likely in non-registered accounts.');
    }
  }
  
  const tfsa = categories.find(cat => cat.id === 'tfsa');
  const rrsp = categories.find(cat => cat.id === 'rrsp');
  const tfsaTotal = tfsa?.items.reduce((sum, item) => sum + item.amount, 0) || 0;
  const rrspTotal = rrsp?.items.reduce((sum, item) => sum + item.amount, 0) || 0;
  
  if (tfsaTotal + rrspTotal < 50000) {
    considerations.push('Consider maximizing TFSA and RRSP contributions for tax efficiency.');
  }
  
  return considerations;
};

export const getAreasOfConcern = (personalInfo: PersonalInfo, insuranceInfo: InsuranceInfo, categories: MappingCategory[]) => {
  if (!categories) return [];
  
  const concerns: string[] = [];
  
  // High-rate debt
  const creditCards = categories.find(cat => cat.id === 'credit-debt');
  if (creditCards && creditCards.items.length > 0) {
    const highRateDebt = creditCards.items.some(item => 
      item.notes?.toLowerCase().includes('high') || item.amount > 5000
    );
    if (highRateDebt) {
      concerns.push('High-rate debt present - consider prioritizing payoff.');
    }
  }
  
  // No life insurance with dependents
  const protection = getProtectionSnapshot(insuranceInfo, personalInfo);
  if (protection.hasDependents && !protection.hasLife) {
    concerns.push('No life insurance coverage with dependents or spouse.');
  }
  
  // Inadequate disability coverage
  if (!protection.adequateDisability && personalInfo.householdIncome) {
    concerns.push('Disability coverage may be insufficient (target ~60% of income).');
  }
  
  return concerns;
};

/* =====================================================================
 *  DEEP ANALYTICS
 * New, richer functions powering the upgraded Review screen.
 * ===================================================================== */

/**
 * Liquidity snapshot - what's liquid vs locked vs real-estate.
 */
export const getLiquidityBreakdown = (categories: MappingCategory[]) => {
  const LIQUID_IDS = ['cash-savings', 'tfsa', 'fhsa', 'non-registered'];
  const SEMI_LIQUID_IDS = ['rrsp', 'resp', 'rdsp'];
  const ILLIQUID_IDS = ['real-estate', 'business-equity'];

  const sumByIds = (ids: string[]) =>
    categories
      .filter((c) => ids.includes(c.id))
      .reduce((s, c) => s + c.items.reduce((cs, it) => cs + it.amount, 0), 0);

  const liquid = sumByIds(LIQUID_IDS);
  const semiLiquid = sumByIds(SEMI_LIQUID_IDS);
  const illiquid = sumByIds(ILLIQUID_IDS);
  const totalAssets = liquid + semiLiquid + illiquid;

  return {
    liquid,
    semiLiquid,
    illiquid,
    totalAssets,
    liquidShare: totalAssets > 0 ? liquid / totalAssets : 0,
    semiLiquidShare: totalAssets > 0 ? semiLiquid / totalAssets : 0,
    illiquidShare: totalAssets > 0 ? illiquid / totalAssets : 0,
  };
};

/**
 * Emergency fund ratio = liquid assets / monthly expenses.
 * Ideal = 3–6 months. Uses monthlyExpenses if provided, else falls back
 * to a rough estimate from take-home income.
 */
export const getEmergencyFundMonths = (
  categories: MappingCategory[],
  personalInfo: PersonalInfo
): number | null => {
  const liquid = getLiquidityBreakdown(categories).liquid;
  const monthlyBurn =
    personalInfo.monthlyExpenses ??
    (personalInfo.monthlyTakeHome ? personalInfo.monthlyTakeHome * 0.6 : null);
  if (!monthlyBurn || monthlyBurn <= 0) return null;
  return liquid / monthlyBurn;
};

/**
 * Net worth to income ratio — a measure of wealth accumulation progress.
 * Common rule of thumb (from The Millionaire Next Door): net worth >= age * income / 10.
 */
export const getWealthAccumulationScore = (
  totals: { netWorth: number },
  personalInfo: PersonalInfo
): { ratio: number | null; expected: number | null; status: 'prodigy' | 'on-track' | 'behind' | 'unknown' } => {
  if (!personalInfo.age || !personalInfo.householdIncome || personalInfo.householdIncome <= 0) {
    return { ratio: null, expected: null, status: 'unknown' };
  }
  const expected = (personalInfo.age * personalInfo.householdIncome) / 10;
  const ratio = totals.netWorth / expected;
  let status: 'prodigy' | 'on-track' | 'behind' | 'unknown' = 'behind';
  if (ratio >= 2) status = 'prodigy';
  else if (ratio >= 1) status = 'on-track';
  return { ratio, expected, status };
};

/**
 * Debt-to-Asset ratio — solvency check. < 50% is healthy.
 */
export const getDebtToAssetRatio = (categories: MappingCategory[]): number | null => {
  const totals = calculateTotals(categories);
  if (totals.totalAssets <= 0) return null;
  return (totals.totalLiabilities / totals.totalAssets) * 100;
};

/**
 * Monthly debt service ratio — debt payments / gross monthly income.
 * < 36% is healthy, < 20% is strong.
 */
export const getDebtServiceRatio = (
  categories: MappingCategory[],
  personalInfo: PersonalInfo
): number | null => {
  if (!personalInfo.householdIncome || personalInfo.householdIncome <= 0) return null;
  // Sum explicit monthly payments on liabilities, fallback to estimate
  const liabilityCats = categories.filter((c) => c.type === 'liability');
  let monthlyDebt = 0;
  let usedExplicit = false;
  liabilityCats.forEach((cat) => {
    cat.items.forEach((item) => {
      if (item.monthlyPayment && item.monthlyPayment > 0) {
        monthlyDebt += item.monthlyPayment;
        usedExplicit = true;
      } else if (item.interestRate && item.amount > 0) {
        // Estimate minimum payment as interest + 1% principal (typical revolving)
        monthlyDebt += (item.amount * (item.interestRate / 100)) / 12 + item.amount * 0.01;
        usedExplicit = true;
      } else if (cat.id === 'mortgage' && item.amount > 0) {
        // Approximate mortgage payment at 5% over 25 years
        const r = 0.05 / 12;
        const n = 25 * 12;
        monthlyDebt += (item.amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        usedExplicit = true;
      }
    });
  });
  if (!usedExplicit && personalInfo.monthlyDebtPayments && personalInfo.monthlyDebtPayments > 0) {
    monthlyDebt = personalInfo.monthlyDebtPayments;
  }
  if (!usedExplicit && monthlyDebt === 0) return null;
  const monthlyGrossIncome = personalInfo.householdIncome / 12;
  return (monthlyDebt / monthlyGrossIncome) * 100;
};

/**
 * Current savings rate = monthly savings / monthly take-home (if provided).
 * Otherwise falls back to the old asset-based estimate.
 */
export const getSavingsRateDetailed = (
  categories: MappingCategory[],
  personalInfo: PersonalInfo
): { rate: number | null; source: 'direct' | 'estimated' } => {
  if (personalInfo.monthlySavings && personalInfo.monthlyTakeHome && personalInfo.monthlyTakeHome > 0) {
    return { rate: (personalInfo.monthlySavings / personalInfo.monthlyTakeHome) * 100, source: 'direct' };
  }
  const estimated = calculateSavingsRate(personalInfo, categories);
  return { rate: estimated, source: 'estimated' };
};

/**
 * Compound-interest retirement projection.
 * Projects current investable assets + ongoing monthly contributions until
 * target retirement age, returning a year-by-year trajectory.
 */
export const projectRetirement = (
  categories: MappingCategory[],
  personalInfo: PersonalInfo
): {
  startingAssets: number;
  monthlyContribution: number;
  annualReturn: number;
  yearsToRetirement: number | null;
  projectedAtRetirement: number | null;
  trajectory: { age: number; year: number; balance: number }[];
  targetMet: boolean | null;
 targetShortfall: number | null;
} => {
  const liquidity = getLiquidityBreakdown(categories);
  const startingAssets = liquidity.liquid + liquidity.semiLiquid; // exclude real estate & business
  const annualReturn = (personalInfo.expectedReturnRate ?? 6) / 100;
  const monthlyContribution =
    personalInfo.monthlySavings ??
    (personalInfo.monthlyTakeHome ? personalInfo.monthlyTakeHome * 0.15 : 0);
  const currentAge = personalInfo.age ?? null;
  const retirementAge = personalInfo.targetRetirementAge ?? null;
  const yearsToRetirement =
    currentAge && retirementAge && retirementAge > currentAge ? retirementAge - currentAge : null;

  const trajectory: { age: number; year: number; balance: number }[] = [];
  let balance = startingAssets;
  const startYear = new Date().getFullYear();

  const projectionYears = yearsToRetirement ?? 30;
  for (let i = 0; i <= projectionYears; i++) {
    trajectory.push({
      age: (currentAge ?? 30) + i,
      year: startYear + i,
      balance: Math.round(balance),
    });
    // Compound monthly for the year
    const monthlyR = annualReturn / 12;
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyR) + monthlyContribution;
    }
  }

  const projectedAtRetirement = yearsToRetirement !== null ? trajectory[yearsToRetirement].balance : null;
  const target = personalInfo.targetRetirementIncome ?? null;
  // A common rule: retirement capital needed ~ 25x annual target income (4% rule)
  const targetCapital = target ? target * 25 : null;
  const targetMet = projectedAtRetirement !== null && targetCapital !== null ? projectedAtRetirement >= targetCapital : null;
  const targetShortfall = projectedAtRetirement !== null && targetCapital !== null ? targetCapital - projectedAtRetirement : null;

  return {
    startingAssets,
    monthlyContribution,
    annualReturn,
    yearsToRetirement,
    projectedAtRetirement,
    trajectory,
    targetMet,
    targetShortfall,
  };
};

/**
 * DIME life insurance need = Debt + Income replacement + Mortgage + Education.
 * Returns recommended minimum coverage & gap vs current.
 */
export const getLifeInsuranceDIME = (
  categories: MappingCategory[],
  personalInfo: PersonalInfo,
  insuranceInfo: InsuranceInfo
): { recommended: number | null; current: number; gap: number | null; components: { label: string; value: number }[] } => {
  if (!personalInfo.householdIncome) {
    return { recommended: null, current: insuranceInfo.lifeCoverage ?? 0, gap: null, components: [] };
  }
  const totals = calculateTotals(categories);
  const debt = totals.totalLiabilities;
  // Income replacement: 10x gross income, but reduced by spouse income assumption
  const incomeMultiple = personalInfo.hasSpouse ? 8 : 10;
  const incomeReplacement = personalInfo.householdIncome * incomeMultiple;
  // Mortgage - isolate it from total debt
  const mortgageCat = categories.find((c) => c.id === 'mortgage');
  const mortgage = mortgageCat?.items.reduce((s, it) => s + it.amount, 0) ?? 0;
  // Education - rough $50k per dependent per year for 4 years
  const education = personalInfo.dependents > 0 ? personalInfo.dependents * 50000 * 4 : 0;
  // DIME recommends Debt + Income + Mortgage + Education, but Mortgage is already
  // included in Debt. We avoid double-counting by excluding mortgage from debt.
  const nonMortgageDebt = debt - mortgage;
  const recommended = nonMortgageDebt + incomeReplacement + mortgage + education;
  const current = insuranceInfo.lifeCoverage ?? 0;
  return {
    recommended,
    current,
    gap: Math.max(0, recommended - current),
    components: [
      { label: 'Debt (non-mortgage)', value: nonMortgageDebt },
      { label: 'Income replacement', value: incomeReplacement },
      { label: 'Mortgage payoff', value: mortgage },
      { label: 'Education fund', value: education },
    ],
  };
};

/**
 * Diversification score — how spread across asset classes.
 * Penalizes concentration above 50% in a single category.
 * Returns 0-100 and a qualitative label.
 */
export const getDiversificationScore = (
  categories: MappingCategory[]
): { score: number; label: 'Concentrated' | 'Moderate' | 'Diversified' | 'No data'; largestShare: number; largestCategory: string | null } => {
  const assetCats = categories.filter((c) => c.type === 'asset');
  const values = assetCats.map((c) => ({
    id: c.id,
    name: c.name,
    value: c.items.reduce((s, it) => s + it.amount, 0),
  })).filter((v) => v.value > 0);
  const total = values.reduce((s, v) => s + v.value, 0);
  if (total === 0) return { score: 0, label: 'No data', largestShare: 0, largestCategory: null };

  const withShares = values.map((v) => ({ ...v, share: v.value / total }));
  withShares.sort((a, b) => b.share - a.share);
  const largest = withShares[0];

  // Herfindahl-Hirschman Index for concentration
  const hhi = withShares.reduce((s, v) => s + v.share * v.share, 0);
  // HHI 1 = perfectly concentrated, 1/N = perfectly diversified
  // Convert to a 0-100 score: 100 = max diversified (low HHI)
  const diversificationScore = Math.round((1 - hhi) * 100);

  let label: 'Concentrated' | 'Moderate' | 'Diversified' = 'Concentrated';
  if (largest.share > 0.5) label = 'Concentrated';
  else if (diversificationScore >= 70) label = 'Diversified';
  else label = 'Moderate';

  return {
    score: diversificationScore,
    label,
    largestShare: largest.share,
    largestCategory: largest.name,
  };
};

/**
 * Contribution room usage — for TFSA / RRSP / FHSA.
 */
export const getContributionRoomAnalysis = (categories: MappingCategory[]) => {
  const ids = ['tfsa', 'rrsp', 'fhsa', 'resp', 'rdsp'];
  return categories
    .filter((c) => ids.includes(c.id))
    .map((c) => {
      const used = c.items.reduce((s, it) => s + it.amount, 0);
      const room = c.items.reduce((s, it) => s + (it.contributionRoom ?? 0), 0);
      const annual = c.items.reduce((s, it) => s + (it.annualContribution ?? 0), 0);
      return {
        id: c.id,
        name: c.name,
        used,
        room,
        annual,
        utilization: room > 0 ? (used / (used + room)) * 100 : used > 0 ? 100 : 0,
      };
    })
    .filter((r) => r.used > 0 || r.room > 0);
};

/**
 * Cash flow summary - income vs expenses vs savings vs debt service.
 */
export const getCashFlowSummary = (personalInfo: PersonalInfo, categories: MappingCategory[]) => {
  const takeHome = personalInfo.monthlyTakeHome ?? 0;
  const expenses = personalInfo.monthlyExpenses ?? 0;
  const savings = personalInfo.monthlySavings ?? 0;
  // Derive debt payments if not provided
  let debtPayments = personalInfo.monthlyDebtPayments ?? 0;
  if (debtPayments === 0) {
    categories
      .filter((c) => c.type === 'liability')
      .forEach((cat) => {
        cat.items.forEach((item) => {
          if (item.monthlyPayment) debtPayments += item.monthlyPayment;
          else if (cat.id === 'mortgage' && item.amount > 0) {
            const r = 0.05 / 12;
            const n = 25 * 12;
            debtPayments += (item.amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
          }
        });
      });
  }
  // Investment income from assets
  const investmentIncome = categories
    .filter((c) => c.type === 'asset')
    .reduce((s, c) => s + c.items.reduce((cs, it) => cs + (it.monthlyIncome ?? 0), 0), 0);

  const totalIncome = takeHome + investmentIncome;
  const totalOutflows = expenses + debtPayments + savings;
  const surplus = totalIncome - totalOutflows;

  return {
    takeHome,
    investmentIncome,
    totalIncome,
    expenses,
    debtPayments,
    savings,
    totalOutflows,
    surplus,
    savingsRate: takeHome > 0 ? (savings / takeHome) * 100 : null,
  };
};

export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low';

export interface Recommendation {
  id: string;
  title: string;
  detail: string;
  priority: RecommendationPriority;
  category: 'debt' | 'savings' | 'insurance' | 'tax' | 'diversification' | 'retirement' | 'cashflow';
  actionLabel?: string;
}

/**
 * Synthesized, prioritized recommendations drawing on every analytics function.
 */
export const getRecommendations = (
  categories: MappingCategory[],
  personalInfo: PersonalInfo,
  insuranceInfo: InsuranceInfo
): Recommendation[] => {
  const recs: Recommendation[] = [];
  const totals = calculateTotals(categories);
  const liquidity = getLiquidityBreakdown(categories);
  const emergencyMonths = getEmergencyFundMonths(categories, personalInfo);
  const debtToAssets = getDebtToAssetRatio(categories);
  const debtService = getDebtServiceRatio(categories, personalInfo);
  const savings = getSavingsRateDetailed(categories, personalInfo);
  const protection = getProtectionSnapshot(insuranceInfo, personalInfo);
  const dime = getLifeInsuranceDIME(categories, personalInfo, insuranceInfo);
  const diversification = getDiversificationScore(categories);
  const wealth = getWealthAccumulationScore(totals, personalInfo);
  const retirement = projectRetirement(categories, personalInfo);
  const cashFlow = getCashFlowSummary(personalInfo, categories);

  // 1. Emergency fund
  if (emergencyMonths !== null) {
    if (emergencyMonths < 1) {
      recs.push({
        id: 'ef-critical',
        title: 'Build an emergency fund urgently',
        detail: `You have less than 1 month of expenses saved in liquid assets. Aim for 3 months minimum (~${formatCurrencyBrief(personalInfo.monthlyExpenses ? personalInfo.monthlyExpenses * 3 : 0)}).`,
        priority: 'critical',
        category: 'savings',
        actionLabel: 'Start with $1,000',
      });
    } else if (emergencyMonths < 3) {
      recs.push({
        id: 'ef-low',
        title: 'Grow your emergency fund to 3 months',
        detail: `You currently have ${emergencyMonths.toFixed(1)} months of liquid savings. Push to 3 months for basic security.`,
        priority: 'high',
        category: 'savings',
      });
    } else if (emergencyMonths < 6) {
      recs.push({
        id: 'ef-medium',
        title: 'Extend emergency fund to 6 months',
        detail: `At ${emergencyMonths.toFixed(1)} months you have basic coverage. Homeowners, self-employed, or single-income households should target 6 months.`,
        priority: 'medium',
        category: 'savings',
      });
    }
  }

  // 2. High-interest debt
  const creditCards = categories.find((c) => c.id === 'credit-debt');
  if (creditCards) {
    const highRateItems = creditCards.items.filter(
      (it) => (it.interestRate ?? 0) >= 15 || it.amount > 5000
    );
    if (highRateItems.length > 0) {
      const totalHigh = highRateItems.reduce((s, it) => s + it.amount, 0);
      recs.push({
        id: 'debt-high-rate',
        title: 'Pay off high-interest debt aggressively',
        detail: `${formatCurrencyBrief(totalHigh)} of credit debt at high rates is costing you heavily. Use avalanche (highest rate first) or snowball (smallest balance first) method.`,
        priority: 'critical',
        category: 'debt',
        actionLabel: 'Avalanche strategy',
      });
    }
  }

  // 3. Debt-to-asset ratio
  if (debtToAssets !== null && debtToAssets > 50) {
    recs.push({
      id: 'debt-ratio',
      title: 'Reduce overall debt load',
      detail: `Your debt-to-asset ratio is ${debtToAssets.toFixed(0)}%. Above 50% indicates solvency risk. Focus on debt reduction before new investments.`,
      priority: 'high',
      category: 'debt',
    });
  }

  // 4. Debt service ratio
  if (debtService !== null && debtService > 36) {
    recs.push({
      id: 'debt-service',
      title: 'Lower monthly debt payments',
      detail: `Debt service ratio is ${debtService.toFixed(0)}% of gross income (target <36%). Consider consolidation, refinancing, or extending amortization.`,
      priority: 'high',
      category: 'debt',
    });
  }

  // 5. Life insurance gap (DIME)
  if (dime.recommended !== null && dime.gap !== null && dime.gap > 0) {
    const hasDependents = personalInfo.hasSpouse || personalInfo.dependents > 0;
    if (hasDependents) {
      recs.push({
        id: 'life-insurance-gap',
        title: `Increase life insurance by ${formatCurrencyBrief(dime.gap)}`,
        detail: `DIME analysis suggests ${formatCurrencyBrief(dime.recommended)} of coverage; you have ${formatCurrencyBrief(dime.current)}. Gap: ${formatCurrencyBrief(dime.gap)}.`,
        priority: 'critical',
        category: 'insurance',
        actionLabel: 'Get quotes',
      });
    }
  }

  // 6. Disability coverage
  if (personalInfo.householdIncome && !protection.adequateDisability) {
    recs.push({
      id: 'disability-gap',
      title: 'Strengthen disability coverage',
      detail: `Your disability benefit should replace ~60% of income (~${formatCurrencyBrief((personalInfo.householdIncome * 0.6) / 12)}/mo). You're below this threshold.`,
      priority: 'high',
      category: 'insurance',
    });
  }

  // 7. Savings rate
  if (savings.rate !== null) {
    if (savings.rate < 10) {
      recs.push({
        id: 'savings-low',
        title: 'Increase your savings rate',
        detail: `You're saving ${savings.rate.toFixed(1)}% of take-home pay. Aim for at least 15-20% to build long-term wealth.`,
        priority: 'high',
        category: 'savings',
        actionLabel: 'Automate savings',
      });
    } else if (savings.rate < 15) {
      recs.push({
        id: 'savings-medium',
        title: 'Push savings rate above 15%',
        detail: `At ${savings.rate.toFixed(1)}% you're saving, but 15-20% is the proven wealth-building target.`,
        priority: 'medium',
        category: 'savings',
      });
    }
  }

  // 8. Diversification
  if (diversification.label === 'Concentrated' && diversification.largestCategory) {
    recs.push({
      id: 'diversification',
      title: `Diversify away from ${diversification.largestCategory}`,
      detail: `${(diversification.largestShare * 100).toFixed(0)}% of your assets are in ${diversification.largestCategory}. Consider rebalancing across asset classes.`,
      priority: 'medium',
      category: 'diversification',
    });
  }

  // 9. Retirement projection
  if (retirement.targetMet === false && retirement.projectedAtRetirement !== null) {
    const bump = retirement.targetShortfall ?? 0;
    // Solve for additional monthly contribution needed
    const years = retirement.yearsToRetirement ?? 0;
    const r = retirement.annualReturn / 12;
    const n = years * 12;
    const additionalMonthly = n > 0 ? bump / (((Math.pow(1 + r, n) - 1) / r)) : 0;
    recs.push({
      id: 'retirement-gap',
      title: 'Close your retirement gap',
      detail: `Projected ${formatCurrencyBrief(retirement.projectedAtRetirement)} at retirement vs target ${formatCurrencyBrief((personalInfo.targetRetirementIncome ?? 0) * 25)}. Save an extra ${formatCurrencyBrief(additionalMonthly)}/mo to close the gap.`,
      priority: 'high',
      category: 'retirement',
      actionLabel: 'See projection',
    });
  }

  // 10. Wealth accumulation
  if (wealth.status === 'behind' && wealth.expected !== null) {
    recs.push({
      id: 'wealth-behind',
      title: 'Accelerate wealth accumulation',
      detail: `Your net worth is below the expected milestone for your age & income (${formatCurrencyBrief(wealth.expected)}). Focus on increasing savings rate and investment returns.`,
      priority: 'medium',
      category: 'retirement',
    });
  }

  // 11. Cash flow negative
  if (cashFlow.surplus < 0) {
    recs.push({
      id: 'cashflow-negative',
      title: 'Your monthly cash flow is negative',
      detail: `You're spending ${formatCurrencyBrief(Math.abs(cashFlow.surplus))} more per month than you earn. Cut discretionary spending or boost income.`,
      priority: 'critical',
      category: 'cashflow',
    });
  }

  // 12. Tax considerations (re-use existing logic but enrich)
  const taxConsiderations = getTaxConsiderations(categories);
  taxConsiderations.forEach((consideration, idx) => {
    recs.push({
      id: `tax-${idx}`,
      title: consideration,
      detail: 'Tax-efficient account usage can meaningfully reduce your lifetime tax burden.',
      priority: 'low',
      category: 'tax',
    });
  });

  // 13. Contribution room reminder
  const roomAnalysis = getContributionRoomAnalysis(categories);
  const underused = roomAnalysis.filter((r) => r.room > 0 && r.utilization < 80);
  if (underused.length > 0) {
    const names = underused.map((r) => r.name).join(', ');
    recs.push({
      id: 'contribution-room',
      title: `Maximize ${names} contribution room`,
      detail: 'Unused registered account room is lost or carries forward. Prioritize filling these tax-advantaged spaces.',
      priority: 'medium',
      category: 'tax',
    });
  }

  // Sort by priority
  const order: Record<RecommendationPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  recs.sort((a, b) => order[a.priority] - order[b.priority]);
  return recs;
};

const formatCurrencyBrief = (amount: number): string =>
  new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));