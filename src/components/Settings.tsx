import { useState } from 'react';
import type { Settings as SettingsType, HistoryItem } from '../utils/storage';
import { AVAILABLE_FUNCTIONS } from '../utils/functions';
import './Settings.css';

interface SettingsProps {
  settings: SettingsType;
  history: HistoryItem[];
  onUpdateSettings: (settings: Partial<SettingsType>) => void;
  onClearHistory: () => void;
  onSelectHistory: (item: HistoryItem) => void;
  onBack: () => void;
}

export function Settings({
  settings,
  history,
  onUpdateSettings,
  onClearHistory,
  onSelectHistory,
  onBack,
}: SettingsProps) {
  const [isFunctionsOpen, setIsFunctionsOpen] = useState(false);

  return (
    <div className="settings">
      <header className="settings-header">
        <button className="back-button" onClick={onBack} aria-label="戻る">
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="settings-title">設定</h1>
      </header>

      <div className="settings-content">
        <section className="settings-section">
          <h2 className="section-title">表示</h2>

          <div className="setting-item">
            <label htmlFor="theme">テーマ</label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) =>
                onUpdateSettings({ theme: e.target.value as 'light' | 'dark' })
              }
            >
              <option value="light">ライト</option>
              <option value="dark">ダーク</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="precision">計算精度（小数点以下桁数）</label>
            <select
              id="precision"
              value={settings.precision}
              onChange={(e) =>
                onUpdateSettings({ precision: Number(e.target.value) })
              }
            >
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i}>
                  {i}桁
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="settings-section">
          <button
            className="section-title-button"
            onClick={() => setIsFunctionsOpen(!isFunctionsOpen)}
            aria-expanded={isFunctionsOpen}
          >
            <h2 className="section-title">利用可能な関数</h2>
            <svg
              className={`collapse-icon ${isFunctionsOpen ? 'open' : ''}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {isFunctionsOpen && (
            <div className="function-list">
              {AVAILABLE_FUNCTIONS.map((category) => (
                <div key={category.title} className="function-category">
                  <h3 className="category-title">{category.title}</h3>
                  <div className="function-items">
                    {category.functions.map((func) => (
                      <div key={func.name} className="function-item">
                        <code className="function-name">{func.name}</code>
                        <span className="function-description">{func.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="settings-section">
          <h2 className="section-title">履歴</h2>

          <div className="setting-item">
            <label htmlFor="historyEnabled">履歴を保存する</label>
            <input
              type="checkbox"
              id="historyEnabled"
              checked={settings.historyEnabled}
              onChange={(e) =>
                onUpdateSettings({ historyEnabled: e.target.checked })
              }
            />
          </div>

          {history.length > 0 && (
            <>
              <div className="history-list">
                {history.map((item, index) => (
                  <button
                    key={item.timestamp + index}
                    className="history-item"
                    onClick={() => onSelectHistory(item)}
                  >
                    <span className="history-expression">{item.expression}</span>
                    <span className="history-result">= {item.result}</span>
                  </button>
                ))}
              </div>

              <button className="clear-history-button" onClick={onClearHistory}>
                履歴をクリア
              </button>
            </>
          )}

          {history.length === 0 && (
            <p className="no-history">履歴はありません</p>
          )}
        </section>
      </div>
    </div>
  );
}
