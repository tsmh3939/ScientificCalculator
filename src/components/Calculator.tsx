import { useState, useRef, useEffect } from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { Settings } from './Settings';
import './Calculator.css';

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
    return <div className="calculator loading">読み込み中...</div>;
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
    <div className="calculator">
      <header className="header">
        <h1 className="title">Calculator</h1>
        <button
          className="settings-button"
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

      <div className="input-section">
        <input
          ref={inputRef}
          type="text"
          className="expression-input"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="例: 2^3 + sqrt(16)"
          spellCheck={false}
        />
      </div>

      <div className={`result-section ${error ? 'error' : ''}`}>
        <span className="equals">=</span>
        <span className="result-value">{error || result || '0'}</span>
      </div>
    </div>
  );
}
