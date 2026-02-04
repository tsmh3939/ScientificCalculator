import { useState, useEffect, useCallback, useMemo } from 'react';
import { evaluate } from '../utils/evaluate';
import type { Settings, HistoryItem } from '../utils/storage';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  loadHistory,
  saveHistory,
  clearHistory,
} from '../utils/storage';

export function useCalculator() {
  const [expression, setExpression] = useState('');
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const [loadedSettings, loadedHistory] = await Promise.all([
        loadSettings(),
        loadHistory(),
      ]);
      setSettings(loadedSettings);
      setHistory(loadedHistory);
      document.documentElement.setAttribute('data-theme', loadedSettings.theme);
      setIsLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  }, [settings.theme, isLoading]);

  const { result, error } = useMemo(() => {
    if (isLoading) return { result: '', error: '' };
    const evalResult = evaluate(expression, settings.precision);
    if (evalResult !== null) {
      return { result: evalResult, error: '' };
    }
    return { result: '', error: 'エラー' };
  }, [expression, settings.precision, isLoading]);

  const addToHistory = useCallback(async () => {
    if (!settings.historyEnabled || !expression.trim() || !result) return;

    const newItem: HistoryItem = {
      expression,
      result,
      timestamp: Date.now(),
    };

    const newHistory = [newItem, ...history].slice(0, 50);
    setHistory(newHistory);
    await saveHistory(newHistory);
  }, [expression, result, history, settings.historyEnabled]);

  const handleClearHistory = useCallback(async () => {
    setHistory([]);
    await clearHistory();
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await saveSettings(updated);
  }, [settings]);

  const selectHistoryItem = useCallback((item: HistoryItem) => {
    setExpression(item.expression);
  }, []);

  return {
    expression,
    setExpression,
    result,
    error,
    settings,
    updateSettings,
    history,
    addToHistory,
    clearHistory: handleClearHistory,
    selectHistoryItem,
    isLoading,
  };
}
