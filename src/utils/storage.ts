/// <reference types="chrome" />

export const AVAILABLE_THEMES = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
] as const;

export type Theme = (typeof AVAILABLE_THEMES)[number];

export interface Settings {
  precision: number;
  historyEnabled: boolean;
  theme: Theme;
}

export interface HistoryItem {
  expression: string;
  result: string;
  timestamp: number;
}

export const DEFAULT_SETTINGS: Settings = {
  precision: 10,
  historyEnabled: true,
  theme: 'dark',
};

const SETTINGS_KEY = 'calculator_settings';
const HISTORY_KEY = 'calculator_history';

const isExtension = typeof chrome !== 'undefined' && chrome.storage !== undefined;

async function get<T>(key: string): Promise<T | null> {
  if (isExtension) {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => resolve((result[key] as T) ?? null));
    });
  }
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
}

async function set(key: string, value: unknown): Promise<void> {
  if (isExtension) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
  }
  localStorage.setItem(key, JSON.stringify(value));
}

async function remove(key: string): Promise<void> {
  if (isExtension) {
    return new Promise((resolve) => {
      chrome.storage.local.remove(key, resolve);
    });
  }
  localStorage.removeItem(key);
}

export async function loadSettings(): Promise<Settings> {
  const stored = await get<Partial<Settings>>(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await set(SETTINGS_KEY, settings);
}

export async function loadHistory(): Promise<HistoryItem[]> {
  return (await get<HistoryItem[]>(HISTORY_KEY)) ?? [];
}

export async function saveHistory(history: HistoryItem[]): Promise<void> {
  await set(HISTORY_KEY, history);
}

export async function clearHistory(): Promise<void> {
  await remove(HISTORY_KEY);
}