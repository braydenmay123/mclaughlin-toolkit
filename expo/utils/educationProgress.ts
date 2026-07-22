import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const PROGRESS_KEY = 'mfg_education_progress';

type StorageShape = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const getStorage = (): StorageShape => {
  if (
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    typeof window.localStorage !== 'undefined'
  ) {
    return {
      getItem: (key: string) => Promise.resolve(window.localStorage.getItem(key)),
      setItem: (key: string, value: string) => {
        window.localStorage.setItem(key, value);
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        window.localStorage.removeItem(key);
        return Promise.resolve();
      },
    };
  }
  return AsyncStorage as unknown as StorageShape;
};

export const getCompletedChapters = async (): Promise<string[]> => {
  try {
    const storage = getStorage();
    const raw = await storage.getItem(PROGRESS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading education progress:', error);
    return [];
  }
};

export const markChapterComplete = async (chapterId: string): Promise<void> => {
  try {
    const storage = getStorage();
    const current = await getCompletedChapters();
    if (!current.includes(chapterId)) {
      const updated = [...current, chapterId];
      await storage.setItem(PROGRESS_KEY, JSON.stringify(updated));
    }
  } catch (error) {
    console.error('Error saving education progress:', error);
  }
};

export const markChapterIncomplete = async (chapterId: string): Promise<void> => {
  try {
    const storage = getStorage();
    const current = await getCompletedChapters();
    const updated = current.filter((id) => id !== chapterId);
    await storage.setItem(PROGRESS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating education progress:', error);
  }
};

export const clearEducationProgress = async (): Promise<void> => {
  try {
    const storage = getStorage();
    await storage.removeItem(PROGRESS_KEY);
  } catch (error) {
    console.error('Error clearing education progress:', error);
  }
};
