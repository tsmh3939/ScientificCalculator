import { useState, useRef, useEffect, useCallback } from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { Settings } from './Settings';

function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { copied, copy };
}

function checkBracketBalance(expr: string): { open: number; close: number; balance: number } {
  let open = 0;
  let close = 0;
  for (const char of expr) {
    if (char === '(') open++;
    if (char === ')') close++;
  }
  return { open, close, balance: open - close };
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
  const bracketStatus = checkBracketBalance(expression);

  const handleCopyResult = () => {
    if (result && !error) {
      copy(result);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPos = input.selectionStart ?? 0;

    if (e.key === 'Enter' && result) {
      addToHistory();
    }
    if (e.key === 'Escape') {
      setExpression('');
    }
    if (e.ctrlKey && e.key === 'c' && result && !error && !window.getSelection()?.toString()) {
      e.preventDefault();
      copy(result);
    }

    // 括弧の自動補完
    if (e.key === '(') {
      e.preventDefault();
      const before = expression.slice(0, cursorPos);
      const after = expression.slice(cursorPos);
      setExpression(before + '()' + after);
      // カーソルを括弧の間に配置
      setTimeout(() => {
        input.setSelectionRange(cursorPos + 1, cursorPos + 1);
      }, 0);
    }

    // 閉じ括弧をスキップ（既に閉じ括弧がある場合）
    if (e.key === ')' && expression[cursorPos] === ')') {
      e.preventDefault();
      input.setSelectionRange(cursorPos + 1, cursorPos + 1);
    }

    // Backspaceで括弧ペアを削除
    if (e.key === 'Backspace' && cursorPos > 0) {
      const charBefore = expression[cursorPos - 1];
      const charAfter = expression[cursorPos];
      if (charBefore === '(' && charAfter === ')') {
        e.preventDefault();
        const before = expression.slice(0, cursorPos - 1);
        const after = expression.slice(cursorPos + 1);
        setExpression(before + after);
        setTimeout(() => {
          input.setSelectionRange(cursorPos - 1, cursorPos - 1);
        }, 0);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-4 bg-bg-primary text-text-primary flex items-center justify-center min-h-50">
        読み込み中...
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
    <div className="w-full max-w-md mx-auto p-4 bg-bg-primary text-text-primary">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold m-0 text-text-primary">Calculator</h1>
        <button
          className="flex items-center justify-center w-8 h-8 p-0 bg-transparent border-none rounded-md text-text-secondary cursor-pointer transition-colors duration-200 hover:bg-bg-hover hover:text-text-primary"
          onClick={() => setShowSettings(true)}
          aria-label="設定"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </header>

      <div className="mb-3">
        <input
          ref={inputRef}
          type="text"
          className="w-full p-3 text-base font-mono bg-bg-input border border-border rounded-lg text-text-primary outline-none transition-all duration-200 box-border placeholder:text-text-placeholder focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-shadow)]"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoFocus
        />
        {expression && bracketStatus.balance !== 0 && (
          <div className="flex items-center gap-2 mt-1.5 px-1">
            <span className="text-xs text-text-secondary">
              {bracketStatus.balance > 0 ? (
                <span className="text-warning flex items-center gap-1">
                  <span className="font-mono">)</span> が {bracketStatus.balance} つ不足
                </span>
              ) : (
                <span className="text-warning flex items-center gap-1">
                  <span className="font-mono">(</span> が {Math.abs(bracketStatus.balance)} つ不足
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      <div
        className={`flex items-center gap-3 p-4 rounded-xl min-h-14 relative ${
          error ? 'bg-bg-error' : 'bg-bg-result'
        } ${result && !error ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
        onClick={handleCopyResult}
        title={result && !error ? 'クリックでコピー' : undefined}
        role={result && !error ? 'button' : undefined}
        tabIndex={result && !error ? 0 : undefined}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && result && !error) {
            handleCopyResult();
          }
        }}
      >
        <span className="text-xl font-medium text-text-secondary">=</span>
        <span
          className={`break-all tracking-wide ${
            error
              ? 'text-error text-base font-medium'
              : 'text-xl font-bold text-text-primary tabular-nums'
          }`}
          style={{ fontFamily: "'SF Mono', 'Fira Code', 'JetBrains Mono', Consolas, monospace" }}
        >
          {error || result || ''}
        </span>
        {copied && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-accent font-medium bg-bg-primary px-2 py-1 rounded">
            コピー済み
          </span>
        )}
      </div>
    </div>
  );
}