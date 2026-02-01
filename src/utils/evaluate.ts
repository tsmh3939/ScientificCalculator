import { create, all } from 'mathjs';

const math = create(all);

math.config({
  number: 'number',
});

export function evaluate(expression: string, precision: number = 10): string | null {
  if (!expression.trim()) return '';

  try {
    const result = math.evaluate(expression);

    if (typeof result === 'function') return null;

    if (typeof result === 'number') {
      if (!isFinite(result) || isNaN(result)) return null;
      return Number(result.toFixed(precision)).toString();
    }

    return String(result);
  } catch {
    return null;
  }
}
