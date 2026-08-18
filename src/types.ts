export type CalculatorMode = 'standard' | 'scientific';

export type LanguageMode = 'bn' | 'en';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
  mode: CalculatorMode;
}

export type AngleMode = 'deg' | 'rad';
