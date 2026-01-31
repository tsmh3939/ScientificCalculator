/// <reference types="chrome" />

export interface Settings {
  precision: number;
  historyEnabled: boolean;
  theme: 'light' | 'dark';
}

export interface HistoryItem {
  expression: string;
  result: string;
  timestamp: number;
}

const DEFAULT_SETTINGS: Settings = {
  precision: 10,
  historyEnabled: true,
  theme: 'light',
};

const SETTINGS_KEY = 'calculator_settings';
const HISTORY_KEY = 'calculator_history';

function isExtensionContext(): boolean {
  return typeof chrome !== 'undefined' && chrome.storage !== undefined;
}

export async function loadSettings(): Promise<Settings> {
  if (isExtensionContext()) {
    return new Promise((resolve) => {
      chrome.storage.local.get(SETTINGS_KEY, (result: Record<string, unknown>) => {
        const stored = result[SETTINGS_KEY] as Partial<Settings> | undefined;
        resolve({ ...DEFAULT_SETTINGS, ...stored });
      });
    });
  }
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Settings): Promise<void> {
  if (isExtensionContext()) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [SETTINGS_KEY]: settings }, resolve);
    });
  }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function loadHistory(): Promise<HistoryItem[]> {
  if (isExtensionContext()) {
    return new Promise((resolve) => {
      chrome.storage.local.get(HISTORY_KEY, (result: Record<string, unknown>) => {
        const stored = result[HISTORY_KEY] as HistoryItem[] | undefined;
        resolve(stored || []);
      });
    });
  }
  const stored = localStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
}

export async function saveHistory(history: HistoryItem[]): Promise<void> {
  if (isExtensionContext()) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [HISTORY_KEY]: history }, resolve);
    });
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export async function clearHistory(): Promise<void> {
  if (isExtensionContext()) {
    return new Promise((resolve) => {
      chrome.storage.local.remove(HISTORY_KEY, resolve);
    });
  }
  localStorage.removeItem(HISTORY_KEY);
}
