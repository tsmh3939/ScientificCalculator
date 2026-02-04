import { useState } from 'react';
import type { Settings as SettingsType, HistoryItem } from '../utils/storage';
import { AVAILABLE_THEMES } from '../utils/storage';
import { AVAILABLE_FUNCTIONS } from '../utils/functions';
import { BackIcon } from './ui/Icons';

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
    <div className="w-full max-w-md mx-auto p-4">
      <header className="flex items-center gap-3 mb-5">
        <button className="btn btn-ghost btn-sm btn-square" onClick={onBack} aria-label="戻る">
          <BackIcon />
        </button>
        <h1 className="text-lg font-semibold">設定</h1>
      </header>

      <div className="flex flex-col gap-4">
        {/* 表示設定 */}
        <div className="card bg-base-200">
          <div className="card-body p-4">
            <h2 className="card-title text-sm opacity-70">表示</h2>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">テーマ</span>
                <select
                  className="select select-bordered select-sm w-32"
                  value={settings.theme}
                  onChange={(e) => onUpdateSettings({ theme: e.target.value as SettingsType['theme'] })}
                >
                  {AVAILABLE_THEMES.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">計算精度（小数点以下桁数）</span>
                <select
                  className="select select-bordered select-sm w-24"
                  value={settings.precision}
                  onChange={(e) => onUpdateSettings({ precision: Number(e.target.value) })}
                >
                  {[...Array(11)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}桁
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        {/* 利用可能な関数 */}
        <div className="collapse collapse-arrow bg-base-200">
          <input
            type="checkbox"
            checked={isFunctionsOpen}
            onChange={(e) => setIsFunctionsOpen(e.target.checked)}
          />
          <div className="collapse-title text-sm font-semibold opacity-70">
            利用可能な関数
          </div>
          <div className="collapse-content">
            <div className="flex flex-col gap-3 max-h-75 overflow-y-auto pt-2">
              {AVAILABLE_FUNCTIONS.map((category) => (
                <div key={category.title} className="flex flex-col gap-1.5">
                  <h3 className="text-xs font-semibold text-primary">{category.title}</h3>
                  <div className="flex flex-col gap-1">
                    {category.functions.map((func) => (
                      <div
                        key={func.name}
                        className="flex items-center justify-between px-2.5 py-1.5 bg-base-300 rounded-lg"
                      >
                        <code className="text-[13px] font-mono">{func.name}</code>
                        <span className="text-xs opacity-60">{func.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ショートカットキー */}
        <div className="card bg-base-200">
          <div className="card-body p-4">
            <h2 className="card-title text-sm opacity-70">ショートカットキー</h2>
            <div className="flex flex-col gap-1.5">
              {[
                { key: 'Enter', description: '履歴に追加' },
                { key: 'Esc', description: 'クリア' },
                { key: 'Ctrl+C', description: '結果をコピー' },
              ].map((shortcut) => (
                <div
                  key={shortcut.key}
                  className="flex items-center justify-between px-2.5 py-1.5 bg-base-300 rounded-lg"
                >
                  <kbd className="kbd kbd-sm">{shortcut.key}</kbd>
                  <span className="text-xs opacity-60">{shortcut.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 履歴 */}
        <div className="card bg-base-200">
          <div className="card-body p-4">
            <h2 className="card-title text-sm opacity-70">履歴</h2>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">履歴を保存する</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-sm"
                  checked={settings.historyEnabled}
                  onChange={(e) => onUpdateSettings({ historyEnabled: e.target.checked })}
                />
              </label>
            </div>

            {history.length > 0 && (
              <>
                <div className="flex flex-col gap-1 max-h-50 overflow-y-auto">
                  {history.map((item, index) => (
                    <button
                      key={item.timestamp + index}
                      className="btn btn-ghost btn-sm justify-start h-auto py-2 text-left"
                      onClick={() => onSelectHistory(item)}
                    >
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="text-[13px] font-mono">{item.expression}</span>
                        <span className="text-xs opacity-60">= {item.result}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <button className="btn btn-error btn-sm" onClick={onClearHistory}>
                  履歴をクリア
                </button>
              </>
            )}

            {history.length === 0 && (
              <p className="text-sm opacity-60 text-center py-4">履歴はありません</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}