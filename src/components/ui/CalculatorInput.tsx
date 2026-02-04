import { forwardRef } from 'react';
import { SettingsIcon } from './Icons';

interface CalculatorInputProps {
  value: string;
  bracketBalance: number;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSettingsClick: () => void;
}

export const CalculatorInput = forwardRef<HTMLInputElement, CalculatorInputProps>(
  ({ value, bracketBalance, onChange, onKeyDown, onSettingsClick }, ref) => {
    return (
      <div className="form-control">
        <div className="join w-full">
          <input
            ref={ref}
            type="text"
            className="input input-bordered join-item flex-1 font-mono"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoFocus
          />
          <button
            className="btn btn-ghost join-item"
            onClick={onSettingsClick}
            aria-label="設定"
          >
            <SettingsIcon />
          </button>
        </div>
        {value && bracketBalance !== 0 && (
          <label className="label">
            <span className="label-text-alt text-warning">
              <span className="font-mono">{bracketBalance > 0 ? ')' : '('}</span> が{' '}
              {Math.abs(bracketBalance)} つ不足
            </span>
          </label>
        )}
      </div>
    );
  }
);

CalculatorInput.displayName = 'CalculatorInput';