import { useState, useRef, useEffect } from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { Settings } from './Settings';
import { CalculatorInput } from './ui/CalculatorInput';
import { ResultDisplay } from './ui/ResultDisplay';

function getBracketBalance(expr: string): number {
  let balance = 0;
  for (const char of expr) {
    if (char === '(') balance++;
    if (char === ')') balance--;
  }
  return balance;
}

export function Calculator() {
  const {
    expression,
    setExpression,
    result,
    error,
    settings,
    updateSettings,
    history,
    addToHistory,
    clearHistory,
    selectHistoryItem,
    isLoading,
  } = useCalculator();

  const [showSettings, setShowSettings] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { copied, copy } = useCopyToClipboard();
  const bracketBalance = getBracketBalance(expression);

  const handleCopyResult = () => {
    if (result && !error) copy(result);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const pos = input.selectionStart ?? 0;

    if (e.key === 'Enter' && result) {
      addToHistory();
      return;
    }
    if (e.key === 'Escape') {
      setExpression('');
      return;
    }
    if (e.ctrlKey && e.key === 'c' && result && !error && !window.getSelection()?.toString()) {
      e.preventDefault();
      copy(result);
      return;
    }

    if (e.key === '(') {
      e.preventDefault();
      setExpression(expression.slice(0, pos) + '()' + expression.slice(pos));
      setTimeout(() => input.setSelectionRange(pos + 1, pos + 1), 0);
      return;
    }

    if (e.key === ')' && expression[pos] === ')') {
      e.preventDefault();
      input.setSelectionRange(pos + 1, pos + 1);
      return;
    }

    if (e.key === 'Backspace' && expression[pos - 1] === '(' && expression[pos] === ')') {
      e.preventDefault();
      setExpression(expression.slice(0, pos - 1) + expression.slice(pos + 1));
      setTimeout(() => input.setSelectionRange(pos - 1, pos - 1), 0);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-4 flex items-center justify-center min-h-50">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  if (showSettings) {
    return (
      <Settings
        settings={settings}
        history={history}
        onUpdateSettings={updateSettings}
        onClearHistory={clearHistory}
        onSelectHistory={(item) => {
          selectHistoryItem(item);
          setShowSettings(false);
        }}
        onBack={() => setShowSettings(false)}
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-3">
      <CalculatorInput
        ref={inputRef}
        value={expression}
        bracketBalance={bracketBalance}
        onChange={setExpression}
        onKeyDown={handleKeyDown}
        onSettingsClick={() => setShowSettings(true)}
      />
      <ResultDisplay
        result={result}
        error={error}
        copied={copied}
        onCopy={handleCopyResult}
      />
    </div>
  );
}