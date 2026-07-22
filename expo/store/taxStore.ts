import { create } from 'zustand';

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export interface SurtaxTier {
  threshold: number;
  rate: number;
}

export interface ProvincialTaxData {
  name: string;
  brackets: TaxBracket[];
  surtax?: SurtaxTier | SurtaxTier[];
  healthPremium?: {
    brackets: { min: number; max: number | null; rate: number; }[];
  };
}

export interface TaxCalculation {
  federalTax: number;
  provincialTax: number;
  totalTax: number;
  marginalRate: number;
  averageRate: number;
  breakdown: {
    federal: { bracket: number; tax: number; }[];
    provincial: { bracket: number; tax: number; }[];
  };
}

interface TaxStore {
  taxableIncome: number;
  selectedProvince: string;
  otherDeductions: number;
  calculation: TaxCalculation | null;
  setTaxableIncome: (income: number) => void;
  setSelectedProvince: (province: string) => void;
  setOtherDeductions: (deductions: number) => void;
  calculateTax: () => void;
  resetCalculation: () => void;
}

// Federal tax brackets for 2026 (indexed 2.0%; lowest rate cut to 14%)
const FEDERAL_BRACKETS: TaxBracket[] = [
  { min: 0, max: 58523, rate: 0.14 },
  { min: 58523, max: 117045, rate: 0.205 },
  { min: 117045, max: 181440, rate: 0.26 },
  { min: 181440, max: 258482, rate: 0.29 },
  { min: 258482, max: null, rate: 0.33 }
];

// Provincial/Territorial tax data for 2026
const PROVINCIAL_TAX_DATA: Record<string, ProvincialTaxData> = {
  'BC': {
    name: 'British Columbia',
    brackets: [
      { min: 0, max: 50363, rate: 0.0506 },
      { min: 50363, max: 100728, rate: 0.077 },
      { min: 100728, max: 115648, rate: 0.105 },
      { min: 115648, max: 140430, rate: 0.1229 },
      { min: 140430, max: 190405, rate: 0.147 },
      { min: 190405, max: 265545, rate: 0.168 },
      { min: 265545, max: null, rate: 0.205 }
    ]
  },
  'AB': {
    name: 'Alberta',
    brackets: [
      { min: 0, max: 61200, rate: 0.08 },
      { min: 61200, max: 154259, rate: 0.10 },
      { min: 154259, max: 185111, rate: 0.12 },
      { min: 185111, max: 246813, rate: 0.13 },
      { min: 246813, max: 370220, rate: 0.14 },
      { min: 370220, max: null, rate: 0.15 }
    ]
  },
  'ON': {
    name: 'Ontario',
    brackets: [
      { min: 0, max: 53891, rate: 0.0505 },
      { min: 53891, max: 107785, rate: 0.0915 },
      { min: 107785, max: 150000, rate: 0.1116 },
      { min: 150000, max: 220000, rate: 0.1216 },
      { min: 220000, max: null, rate: 0.1316 }
    ],
    surtax: [
      { threshold: 5818, rate: 0.20 },
      { threshold: 7446, rate: 0.36 }
    ],
    healthPremium: {
      brackets: [
        { min: 0, max: 20000, rate: 0 },
        { min: 20000, max: 25000, rate: 0 },
        { min: 25000, max: 36000, rate: 300 },
        { min: 36000, max: 48000, rate: 450 },
        { min: 48000, max: 72000, rate: 600 },
        { min: 72000, max: 200000, rate: 750 },
        { min: 200000, max: null, rate: 900 }
      ]
    }
  },
  'QC': {
    name: 'Quebec',
    brackets: [
      { min: 0, max: 54345, rate: 0.14 },
      { min: 54345, max: 108680, rate: 0.19 },
      { min: 108680, max: 132245, rate: 0.24 },
      { min: 132245, max: null, rate: 0.2575 }
    ]
  },
  'SK': {
    name: 'Saskatchewan',
    brackets: [
      { min: 0, max: 54532, rate: 0.105 },
      { min: 54532, max: 155805, rate: 0.125 },
      { min: 155805, max: null, rate: 0.145 }
    ]
  },
  'MB': {
    name: 'Manitoba',
    brackets: [
      { min: 0, max: 47564, rate: 0.108 },
      { min: 47564, max: 101200, rate: 0.1275 },
      { min: 101200, max: null, rate: 0.174 }
    ]
  },
  'NB': {
    name: 'New Brunswick',
    brackets: [
      { min: 0, max: 52333, rate: 0.094 },
      { min: 52333, max: 104666, rate: 0.14 },
      { min: 104666, max: 193861, rate: 0.16 },
      { min: 193861, max: null, rate: 0.195 }
    ]
  },
  'NS': {
    name: 'Nova Scotia',
    brackets: [
      { min: 0, max: 30995, rate: 0.0879 },
      { min: 30995, max: 61991, rate: 0.1495 },
      { min: 61991, max: 97417, rate: 0.1667 },
      { min: 97417, max: 157124, rate: 0.175 },
      { min: 157124, max: null, rate: 0.21 }
    ]
  },
  'PE': {
    name: 'Prince Edward Island',
    brackets: [
      { min: 0, max: 33928, rate: 0.095 },
      { min: 33928, max: 65820, rate: 0.1347 },
      { min: 65820, max: 106890, rate: 0.166 },
      { min: 106890, max: 142250, rate: 0.1762 },
      { min: 142250, max: 200000, rate: 0.19 },
      { min: 200000, max: null, rate: 0.20 }
    ]
  },
  'NL': {
    name: 'Newfoundland and Labrador',
    brackets: [
      { min: 0, max: 44678, rate: 0.087 },
      { min: 44678, max: 89354, rate: 0.145 },
      { min: 89354, max: 159528, rate: 0.158 },
      { min: 159528, max: 223340, rate: 0.178 },
      { min: 223340, max: 285319, rate: 0.198 },
      { min: 285319, max: 570638, rate: 0.208 },
      { min: 570638, max: 1141275, rate: 0.213 },
      { min: 1141275, max: null, rate: 0.218 }
    ]
  },
  'YT': {
    name: 'Yukon',
    brackets: [
      { min: 0, max: 58523, rate: 0.064 },
      { min: 58523, max: 117045, rate: 0.09 },
      { min: 117045, max: 181440, rate: 0.109 },
      { min: 181440, max: 258482, rate: 0.128 },
      { min: 258482, max: 500000, rate: 0.15 },
      { min: 500000, max: null, rate: 0.15 }
    ]
  },
  'NT': {
    name: 'Northwest Territories',
    brackets: [
      { min: 0, max: 53003, rate: 0.059 },
      { min: 53003, max: 106009, rate: 0.086 },
      { min: 106009, max: 172346, rate: 0.122 },
      { min: 172346, max: null, rate: 0.1405 }
    ]
  },
  'NU': {
    name: 'Nunavut',
    brackets: [
      { min: 0, max: 55801, rate: 0.04 },
      { min: 55801, max: 111602, rate: 0.07 },
      { min: 111602, max: 181439, rate: 0.09 },
      { min: 181439, max: null, rate: 0.115 }
    ]
  }
};

function calculateTaxFromBrackets(income: number, brackets: TaxBracket[]): { tax: number; breakdown: { bracket: number; tax: number; }[] } {
  let totalTax = 0;
  const breakdown: { bracket: number; tax: number; }[] = [];
  
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const taxableInBracket = Math.min(
      Math.max(0, income - bracket.min),
      bracket.max ? bracket.max - bracket.min : income - bracket.min
    );
    
    if (taxableInBracket > 0) {
      const tax = taxableInBracket * bracket.rate;
      totalTax += tax;
      breakdown.push({ bracket: i + 1, tax });
    }
  }
  
  return { tax: totalTax, breakdown };
}

function getMarginalRate(income: number, federalBrackets: TaxBracket[], provincialBrackets: TaxBracket[]): number {
  let federalRate = 0;
  let provincialRate = 0;
  
  for (const bracket of federalBrackets) {
    if (income > bracket.min && (bracket.max === null || income <= bracket.max)) {
      federalRate = bracket.rate;
      break;
    }
  }
  
  for (const bracket of provincialBrackets) {
    if (income > bracket.min && (bracket.max === null || income <= bracket.max)) {
      provincialRate = bracket.rate;
      break;
    }
  }
  
  return federalRate + provincialRate;
}

export const useTaxStore = create<TaxStore>((set, get) => ({
  taxableIncome: 0,
  selectedProvince: 'ON',
  otherDeductions: 0,
  calculation: null,
  
  setTaxableIncome: (income: number) => set({ taxableIncome: income }),
  setSelectedProvince: (province: string) => set({ selectedProvince: province }),
  setOtherDeductions: (deductions: number) => set({ otherDeductions: deductions }),
  
  calculateTax: () => {
    const { taxableIncome, selectedProvince, otherDeductions } = get();
    const adjustedIncome = Math.max(0, taxableIncome - otherDeductions);
    
    if (adjustedIncome <= 0) {
      set({ calculation: null });
      return;
    }
    
    const provincialData = PROVINCIAL_TAX_DATA[selectedProvince];
    if (!provincialData) {
      set({ calculation: null });
      return;
    }
    
    const federalResult = calculateTaxFromBrackets(adjustedIncome, FEDERAL_BRACKETS);
    const provincialResult = calculateTaxFromBrackets(adjustedIncome, provincialData.brackets);
    
    let totalTax = federalResult.tax + provincialResult.tax;
    
    // Add Ontario health premium if applicable
    if (selectedProvince === 'ON' && provincialData.healthPremium) {
      for (const bracket of provincialData.healthPremium.brackets) {
        if (adjustedIncome > bracket.min && (bracket.max === null || adjustedIncome <= bracket.max)) {
          totalTax += bracket.rate;
          break;
        }
      }
    }
    
    // Add Ontario surtax if applicable (supports one or more tiers)
    if (selectedProvince === 'ON' && provincialData.surtax) {
      const tiers = Array.isArray(provincialData.surtax) ? provincialData.surtax : [provincialData.surtax];
      for (const tier of tiers) {
        if (provincialResult.tax > tier.threshold) {
          totalTax += (provincialResult.tax - tier.threshold) * tier.rate;
        }
      }
    }
    
    const marginalRate = getMarginalRate(adjustedIncome, FEDERAL_BRACKETS, provincialData.brackets);
    const averageRate = totalTax / adjustedIncome;
    
    const calculation: TaxCalculation = {
      federalTax: federalResult.tax,
      provincialTax: provincialResult.tax,
      totalTax,
      marginalRate,
      averageRate,
      breakdown: {
        federal: federalResult.breakdown,
        provincial: provincialResult.breakdown
      }
    };
    
    set({ calculation });
  },
  
  resetCalculation: () => set({ 
    taxableIncome: 0,
    selectedProvince: 'ON',
    otherDeductions: 0,
    calculation: null 
  })
}));

export const getProvinceOptions = () => {
  return Object.entries(PROVINCIAL_TAX_DATA).map(([code, data]) => ({
    value: code,
    label: data.name
  }));
};