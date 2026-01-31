import { useState, useRef, useEffect } from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { Settings } from './Settings';

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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && result) {
      addToHistory();
    }
  };

  if (isLoading) {
    return (
      <div className="w-80 p-4 bg-bg-primary text-text-primary flex items-center justify-center h-50">
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
    <div className="w-80 p-4 bg-bg-primary text-text-primary">
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
      </div>

      <div
        className={`flex items-center gap-3 p-4 rounded-xl min-h-14 ${
          error ? 'bg-bg-error' : 'bg-bg-result'
        }`}
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
      </div>
    </div>
  );
}