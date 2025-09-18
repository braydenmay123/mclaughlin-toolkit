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
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
      removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key))
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
  householdIncome?: number;
  province: string;
  targetRetirementAge?: number;
  targetRetirementIncome?: number;
  isHomeowner: boolean;
}

// Step 3: Insurance Information
export interface InsuranceInfo {
  lifeCoverage?: number;
  lifeType: 'term' | 'whole' | 'ul' | 'mix' | 'none';
  disabilityBenefit?: number;
  disabilityEliminationPeriod?: number;
  criticalIllnessCoverage?: number;
  homeCoverage?: number;
  autoLiabilityLimit?: number;
  umbrellaCoverage?: number;
  hasGroupBenefits: boolean;
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