import { useState, useEffect, useCallback } from 'react';
import { evaluate } from '../utils/evaluate';
import type { Settings, HistoryItem } from '../utils/storage';
import {
  loadSettings,
  saveSettings,
  loadHistory,
  saveHistory,
  clearHistory,
} from '../utils/storage';

export function useCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<Settings>({
    precision: 10,
    historyEnabled: true
  });
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
      setIsLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const evalResult = evaluate(expression, settings.precision);
      if (evalResult.success) {
        setResult(evalResult.result || '');
        setError('');
      } else {
        setResult('');
        setError(evalResult.error || '');
      }
    }
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
