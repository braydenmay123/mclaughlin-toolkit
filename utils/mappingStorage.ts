import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const MAPPING_STORAGE_KEY = 'mfg_asset_mapping';

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