import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const GATE_STORAGE_KEY = 'mclaughlin_gate_passed';
const GATE_EXPIRY_DAYS = 30;

export interface GateData {
  passed: boolean;
  timestamp: number;
  name: string;
  email: string;
  phone?: string;
  interest: string;
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

export const getGateStatus = async (): Promise<GateData | null> => {
  try {
    const storage = getStorage();
    const data = await storage.getItem(GATE_STORAGE_KEY);
    if (!data) return null;
    
    const gateData: GateData = JSON.parse(data);
    const now = Date.now();
    const expiryTime = gateData.timestamp + (GATE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    
    if (now > expiryTime) {
      await storage.removeItem(GATE_STORAGE_KEY);
      return null;
    }
    
    return gateData;
  } catch (error) {
    console.error('Error getting gate status:', error);
    return null;
  }
};

export const setGateStatus = async (data: Omit<GateData, 'timestamp'>): Promise<void> => {
  try {
    const storage = getStorage();
    const gateData: GateData = {
      ...data,
      timestamp: Date.now()
    };
    await storage.setItem(GATE_STORAGE_KEY, JSON.stringify(gateData));
  } catch (error) {
    console.error('Error setting gate status:', error);
  }
};

export const clearGateStatus = async (): Promise<void> => {
  try {
    const storage = getStorage();
    await storage.removeItem(GATE_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing gate status:', error);
  }
};