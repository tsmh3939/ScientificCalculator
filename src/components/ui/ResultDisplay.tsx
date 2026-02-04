interface ResultDisplayProps {
  result: string;
  error: string;
  copied: boolean;
  onCopy: () => void;
}

export function ResultDisplay({ result, error, copied, onCopy }: ResultDisplayProps) {
  const isClickable = result && !error;

  return (
    <div
      className={`card ${error ? 'bg-error/20' : 'bg-primary/10'} ${isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
      onClick={isClickable ? onCopy : undefined}
      title={isClickable ? 'クリックでコピー' : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && isClickable) onCopy();
      }}
    >
      <div className="card-body flex-row items-center gap-3 p-4 min-h-14">
        <span className="text-xl font-medium opacity-60">=</span>
        <span
          className={`break-all tracking-wide font-mono ${error ? 'text-error text-base font-medium' : 'text-xl font-bold tabular-nums'}`}
        >
          {error || result || ''}
        </span>
        {copied && (
          <span className="badge badge-primary ml-auto">コピー済み</span>
        )}
      </div>
    </div>
  );
}