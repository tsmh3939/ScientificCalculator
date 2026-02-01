import { create, all } from 'mathjs';

const math = create(all);

math.config({
  number: 'number',
});

export type EvaluateResult =
  | { success: true; result: string }
  | { success: false };

export function evaluate(expression: string, precision: number = 10): EvaluateResult {
  if (!expression.trim()) {
    return { success: true, result: '' };
  }

  try {
    const result = math.evaluate(expression);

    // 関数が返された場合（関数名のみが入力された場合）は何も表示しない
    if (typeof result === 'function') {
      return { success: false };
    }

    if (typeof result === 'number') {
      if (!isFinite(result) || isNaN(result)) {
        return { success: false };
      }

      const rounded = Number(result.toFixed(precision));
      const formatted = rounded.toString();
      return { success: true, result: formatted };
    }

    return { success: true, result: String(result) };
  } catch {
    return { success: false };
  }
}
