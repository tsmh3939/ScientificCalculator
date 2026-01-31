import { useState } from 'react';
import type { Settings as SettingsType, HistoryItem } from '../utils/storage';
import { AVAILABLE_FUNCTIONS } from '../utils/functions';

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
    <div className="w-80 p-4 bg-bg-primary text-text-primary">
      <header className="flex items-center gap-3 mb-5">
        <button
          className="flex items-center justify-center w-8 h-8 p-0 bg-transparent border-none rounded-md text-text-secondary cursor-pointer transition-colors duration-200 hover:bg-bg-hover hover:text-text-primary"
          onClick={onBack}
          aria-label="戻る"
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold m-0">設定</h1>
      </header>

      <div className="flex flex-col gap-5">
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text-secondary m-0 pb-2 border-b border-border">
            表示
          </h2>

          <div className="flex items-center justify-between gap-3">
            <label htmlFor="theme" className="text-sm text-text-primary">
              テーマ
            </label>
            <select
              id="theme"
              className="px-2.5 py-1.5 text-sm bg-bg-input border border-border rounded-md text-text-primary cursor-pointer outline-none focus:border-accent"
              value={settings.theme}
              onChange={(e) =>
                onUpdateSettings({ theme: e.target.value as 'light' | 'dark' })
              }
            >
              <option value="light">ライト</option>
              <option value="dark">ダーク</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-3">
            <label htmlFor="precision" className="text-sm text-text-primary">
              計算精度（小数点以下桁数）
            </label>
            <select
              id="precision"
              className="px-2.5 py-1.5 text-sm bg-bg-input border border-border rounded-md text-text-primary cursor-pointer outline-none focus:border-accent"
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

        <section className="flex flex-col gap-3">
          <button
            className="flex items-center justify-between w-full p-0 bg-transparent border-none cursor-pointer"
            onClick={() => setIsFunctionsOpen(!isFunctionsOpen)}
            aria-expanded={isFunctionsOpen}
          >
            <h2 className="text-sm font-semibold text-text-secondary m-0">
              利用可能な関数
            </h2>
            <svg
              className={`text-text-secondary transition-transform duration-200 ${
                isFunctionsOpen ? 'rotate-180' : ''
              }`}
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
            <div className="flex flex-col gap-3 max-h-75 overflow-y-auto">
              {AVAILABLE_FUNCTIONS.map((category) => (
                <div key={category.title} className="flex flex-col gap-1.5">
                  <h3 className="text-xs font-semibold text-accent m-0">
                    {category.title}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {category.functions.map((func) => (
                      <div
                        key={func.name}
                        className="flex items-center justify-between px-2.5 py-1.5 bg-bg-input border border-border rounded-md"
                      >
                        <code className="text-[13px] font-mono text-text-primary bg-transparent">
                          {func.name}
                        </code>
                        <span className="text-xs text-text-secondary">
                          {func.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text-secondary m-0 pb-2 border-b border-border">
            履歴
          </h2>

          <div className="flex items-center justify-between gap-3">
            <label htmlFor="historyEnabled" className="text-sm text-text-primary">
              履歴を保存する
            </label>
            <input
              type="checkbox"
              id="historyEnabled"
              className="w-4.5 h-4.5 cursor-pointer accent-accent"
              checked={settings.historyEnabled}
              onChange={(e) =>
                onUpdateSettings({ historyEnabled: e.target.checked })
              }
            />
          </div>

          {history.length > 0 && (
            <>
              <div className="flex flex-col gap-1 max-h-50 overflow-y-auto">
                {history.map((item, index) => (
                  <button
                    key={item.timestamp + index}
                    className="flex flex-col items-start gap-0.5 w-full px-2.5 py-2 bg-bg-input border border-border rounded-md cursor-pointer transition-colors duration-200 text-left hover:bg-bg-hover"
                    onClick={() => onSelectHistory(item)}
                  >
                    <span className="text-[13px] font-mono text-text-primary">
                      {item.expression}
                    </span>
                    <span className="text-xs text-text-secondary">
                      = {item.result}
                    </span>
                  </button>
                ))}
              </div>

              <button
                className="px-4 py-2 text-sm bg-bg-error border-none rounded-md text-error cursor-pointer transition-opacity duration-200 hover:opacity-80"
                onClick={onClearHistory}
              >
                履歴をクリア
              </button>
            </>
          )}

          {history.length === 0 && (
            <p className="text-sm text-text-secondary text-center p-4 m-0">
              履歴はありません
            </p>
          )}
        </section>
      </div>
    </div>
  );
}