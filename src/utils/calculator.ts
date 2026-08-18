import { AngleMode, LanguageMode } from '../types';

export const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export const EN_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function toBengaliNumber(val: string | number): string {
  const str = String(val);
  return str.replace(/[0-9]/g, (d) => BN_DIGITS[parseInt(d, 10)]);
}

export function toEnglishNumber(val: string): string {
  let res = val;
  for (let i = 0; i < 10; i++) {
    res = res.replaceAll(BN_DIGITS[i], EN_DIGITS[i]);
  }
  return res;
}

export function formatNumberWithLanguage(val: string | number, lang: LanguageMode): string {
  const numStr = String(val);
  if (numStr === 'Error' || numStr === 'Infinity' || numStr === '-Infinity' || numStr === 'NaN') {
    if (lang === 'bn') {
      if (numStr === 'Error') return 'ভুল ইনপুট';
      if (numStr === 'Infinity') return 'অসীম (∞)';
      if (numStr === '-Infinity') return '-অসীম (-∞)';
      if (numStr === 'NaN') return 'অনির্ণেয়';
    }
    return numStr;
  }

  // Handle scientific notation like 1.2e+15
  if (numStr.includes('e') || numStr.includes('E')) {
    return lang === 'bn' ? toBengaliNumber(numStr) : numStr;
  }

  const parts = numStr.split('.');
  const intPart = parts[0];
  const decPart = parts.length > 1 ? '.' + parts[1] : '';

  // Add thousand separators to integer part
  const isNegative = intPart.startsWith('-');
  const cleanInt = isNegative ? intPart.slice(1) : intPart;
  
  let formattedInt = '';
  if (lang === 'bn') {
    // South Asian numbering format: 3,2,2 (e.g. 1,00,000)
    if (cleanInt.length > 3) {
      const lastThree = cleanInt.substring(cleanInt.length - 3);
      const otherNumbers = cleanInt.substring(0, cleanInt.length - 3);
      const withCommas = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
      formattedInt = withCommas + ',' + lastThree;
    } else {
      formattedInt = cleanInt;
    }
  } else {
    // Standard international numbering format: 3,3 (e.g. 100,000)
    formattedInt = cleanInt.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const resultStr = (isNegative ? '-' : '') + formattedInt + decPart;
  return lang === 'bn' ? toBengaliNumber(resultStr) : resultStr;
}

// Factorial calculation
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity; // JS max float limitation
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Evaluate mathematical expression safely
export function evaluateExpression(rawExpr: string, angleMode: AngleMode = 'deg'): { result: string; isError: boolean } {
  if (!rawExpr || rawExpr.trim() === '') {
    return { result: '0', isError: false };
  }

  try {
    let expr = rawExpr;

    // Normalize operators
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

    // Handle constants
    expr = expr.replace(/π/g, `${Math.PI}`);
    expr = expr.replace(/\be\b/g, `${Math.E}`);

    // Handle factorial `5!` -> factorial(5)
    expr = expr.replace(/(\d+(\.\d+)?)!/g, (_, num) => `${factorial(Number(num))}`);

    // Handle percentage `50%` -> (50/100)
    expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    // Handle Power `^` -> `**`
    expr = expr.replace(/\^/g, '**');

    // Handle functions with angle mode adjustments
    const degToRad = (deg: number) => (deg * Math.PI) / 180;
    const radToDeg = (rad: number) => (rad * 180) / Math.PI;

    // Helper functions in sandbox scope
    const trig = {
      sin: (x: number) => {
        const rad = angleMode === 'deg' ? degToRad(x) : x;
        // Fix floating precision e.g. sin(180) should be 0
        const val = Math.sin(rad);
        return Math.abs(val) < 1e-12 ? 0 : val;
      },
      cos: (x: number) => {
        const rad = angleMode === 'deg' ? degToRad(x) : x;
        const val = Math.cos(rad);
        return Math.abs(val) < 1e-12 ? 0 : val;
      },
      tan: (x: number) => {
        const rad = angleMode === 'deg' ? degToRad(x) : x;
        if (angleMode === 'deg' && Math.abs(x % 180) === 90) return Infinity;
        const val = Math.tan(rad);
        return Math.abs(val) < 1e-12 ? 0 : val;
      },
      asin: (x: number) => {
        const val = Math.asin(x);
        return angleMode === 'deg' ? radToDeg(val) : val;
      },
      acos: (x: number) => {
        const val = Math.acos(x);
        return angleMode === 'deg' ? radToDeg(val) : val;
      },
      atan: (x: number) => {
        const val = Math.atan(x);
        return angleMode === 'deg' ? radToDeg(val) : val;
      },
      sinh: Math.sinh,
      cosh: Math.cosh,
      tanh: Math.tanh,
      sqrt: Math.sqrt,
      cbrt: Math.cbrt,
      log: Math.log10,
      ln: Math.log,
      abs: Math.abs,
      exp: Math.exp,
      fact: factorial,
    };

    // Replace function calls: e.g. sin( -> trig.sin(
    const funcNames = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'sqrt', 'cbrt', 'log', 'ln', 'abs', 'exp', 'fact'];
    for (const fn of funcNames) {
      const regex = new RegExp(`\\b${fn}\\(`, 'g');
      expr = expr.replace(regex, `trig.${fn}(`);
    }

    // Auto-close missing trailing parentheses
    const openParenCount = (expr.match(/\(/g) || []).length;
    const closeParenCount = (expr.match(/\)/g) || []).length;
    if (openParenCount > closeParenCount) {
      expr += ')'.repeat(openParenCount - closeParenCount);
    }

    // Evaluate safely with restricted arguments
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const evalFn = new Function('trig', `"use strict"; return (${expr});`);
    const num = evalFn(trig);

    if (num === undefined || num === null) {
      return { result: '0', isError: false };
    }

    if (isNaN(num)) {
      return { result: 'Error', isError: true };
    }

    if (!isFinite(num)) {
      return { result: num > 0 ? 'Infinity' : '-Infinity', isError: false };
    }

    // Round clean numbers to avoid 0.1 + 0.2 = 0.30000000000000004
    const rounded = Number(Math.round(Number(num + 'e+12')) + 'e-12');
    return { result: String(rounded), isError: false };
  } catch {
    return { result: 'Error', isError: true };
  }
}
