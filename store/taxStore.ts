import { create } from 'zustand';

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export interface ProvincialTaxData {
  name: string;
  brackets: TaxBracket[];
  surtax?: {
    threshold: number;
    rate: number;
  };
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

// Federal tax brackets for 2025 (indexed with 2.7% increase)
const FEDERAL_BRACKETS: TaxBracket[] = [
  { min: 0, max: 57375, rate: 0.15 },
  { min: 57375, max: 114750, rate: 0.205 },
  { min: 114750, max: 177882, rate: 0.26 },
  { min: 177882, max: 253414, rate: 0.29 },
  { min: 253414, max: null, rate: 0.33 }
];

// Provincial/Territorial tax data for 2025
const PROVINCIAL_TAX_DATA: Record<string, ProvincialTaxData> = {
  'BC': {
    name: 'British Columbia',
    brackets: [
      { min: 0, max: 49279, rate: 0.0506 },
      { min: 49279, max: 98560, rate: 0.077 },
      { min: 98560, max: 120094, rate: 0.105 },
      { min: 120094, max: 162832, rate: 0.1229 },
      { min: 162832, max: 227091, rate: 0.147 },
      { min: 227091, max: null, rate: 0.205 }
    ]
  },
  'AB': {
    name: 'Alberta',
    brackets: [
      { min: 0, max: 151234, rate: 0.10 },
      { min: 151234, max: 181498, rate: 0.12 },
      { min: 181498, max: 241664, rate: 0.13 },
      { min: 241664, max: 302043, rate: 0.14 },
      { min: 302043, max: null, rate: 0.15 }
    ]
  },
  'ON': {
    name: 'Ontario',
    brackets: [
      { min: 0, max: 52886, rate: 0.0505 },
      { min: 52886, max: 105775, rate: 0.0915 },
      { min: 105775, max: 150000, rate: 0.1116 },
      { min: 150000, max: 220000, rate: 0.1216 },
      { min: 220000, max: null, rate: 0.1316 }
    ],
    surtax: {
      threshold: 5554,
      rate: 0.20
    },
    healthPremium: {
      brackets: [
        { min: 0, max: 25000, rate: 0 },
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
      { min: 0, max: 53255, rate: 0.14 },
      { min: 53255, max: 106495, rate: 0.19 },
      { min: 106495, max: 129590, rate: 0.24 },
      { min: 129590, max: null, rate: 0.2575 }
    ]
  },
  'SK': {
    name: 'Saskatchewan',
    brackets: [
      { min: 0, max: 52057, rate: 0.105 },
      { min: 52057, max: 148734, rate: 0.125 },
      { min: 148734, max: null, rate: 0.145 }
    ]
  },
  'MB': {
    name: 'Manitoba',
    brackets: [
      { min: 0, max: 47000, rate: 0.108 },
      { min: 47000, max: 100000, rate: 0.1275 },
      { min: 100000, max: null, rate: 0.174 }
    ]
  },
  'NB': {
    name: 'New Brunswick',
    brackets: [
      { min: 0, max: 49958, rate: 0.094 },
      { min: 49958, max: 99916, rate: 0.14 },
      { min: 99916, max: 162383, rate: 0.16 },
      { min: 162383, max: null, rate: 0.195 }
    ]
  },
  'NS': {
    name: 'Nova Scotia',
    brackets: [
      { min: 0, max: 29590, rate: 0.0879 },
      { min: 29590, max: 59180, rate: 0.1495 },
      { min: 59180, max: 93000, rate: 0.1667 },
      { min: 93000, max: 150000, rate: 0.175 },
      { min: 150000, max: null, rate: 0.21 }
    ]
  },
  'PE': {
    name: 'Prince Edward Island',
    brackets: [
      { min: 0, max: 32656, rate: 0.098 },
      { min: 32656, max: 65312, rate: 0.138 },
      { min: 65312, max: null, rate: 0.167 }
    ]
  },
  'NL': {
    name: 'Newfoundland and Labrador',
    brackets: [
      { min: 0, max: 43198, rate: 0.087 },
      { min: 43198, max: 86395, rate: 0.145 },
      { min: 86395, max: 154244, rate: 0.158 },
      { min: 154244, max: 215943, rate: 0.178 },
      { min: 215943, max: null, rate: 0.198 }
    ]
  },
  'YT': {
    name: 'Yukon',
    brackets: [
      { min: 0, max: 57375, rate: 0.064 },
      { min: 57375, max: 114750, rate: 0.09 },
      { min: 114750, max: 177882, rate: 0.109 },
      { min: 177882, max: 500000, rate: 0.128 },
      { min: 500000, max: null, rate: 0.15 }
    ]
  },
  'NT': {
    name: 'Northwest Territories',
    brackets: [
      { min: 0, max: 50597, rate: 0.059 },
      { min: 50597, max: 101198, rate: 0.086 },
      { min: 101198, max: 164525, rate: 0.122 },
      { min: 164525, max: null, rate: 0.1405 }
    ]
  },
  'NU': {
    name: 'Nunavut',
    brackets: [
      { min: 0, max: 53268, rate: 0.04 },
      { min: 53268, max: 106537, rate: 0.07 },
      { min: 106537, max: 173205, rate: 0.09 },
      { min: 173205, max: null, rate: 0.115 }
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
    
    // Add Ontario surtax if applicable
    if (selectedProvince === 'ON' && provincialData.surtax && provincialResult.tax > provincialData.surtax.threshold) {
      const surtax = (provincialResult.tax - provincialData.surtax.threshold) * provincialData.surtax.rate;
      totalTax += surtax;
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