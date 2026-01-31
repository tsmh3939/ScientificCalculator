export interface FunctionInfo {
  name: string;
  description: string;
}

export interface FunctionCategory {
  title: string;
  functions: FunctionInfo[];
}

export const AVAILABLE_FUNCTIONS: FunctionCategory[] = [
  {
    title: '基本演算',
    functions: [
      { name: '+', description: '加算' },
      { name: '-', description: '減算' },
      { name: '*', description: '乗算' },
      { name: '/', description: '除算' },
      { name: '^', description: 'べき乗' },
    ],
  },
  {
    title: '三角関数',
    functions: [
      { name: 'sin(x)', description: '正弦' },
      { name: 'cos(x)', description: '余弦' },
      { name: 'tan(x)', description: '正接' },
      { name: 'asin(x)', description: '逆正弦' },
      { name: 'acos(x)', description: '逆余弦' },
      { name: 'atan(x)', description: '逆正接' },
    ],
  },
  {
    title: '対数・指数',
    functions: [
      { name: 'log(x)', description: '自然対数' },
      { name: 'log10(x)', description: '常用対数' },
      { name: 'exp(x)', description: '指数関数' },
      { name: 'sqrt(x)', description: '平方根' },
    ],
  },
  {
    title: 'その他の関数',
    functions: [
      { name: 'abs(x)', description: '絶対値' },
      { name: 'ceil(x)', description: '切り上げ' },
      { name: 'floor(x)', description: '切り捨て' },
      { name: 'round(x)', description: '四捨五入' },
      { name: 'min(a,b)', description: '最小値' },
      { name: 'max(a,b)', description: '最大値' },
    ],
  },
  {
    title: '定数',
    functions: [
      { name: 'pi', description: '円周率 (3.14159...)' },
      { name: 'e', description: '自然対数の底 (2.71828...)' },
    ],
  },
];