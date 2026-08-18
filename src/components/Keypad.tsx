import React from 'react';
import { motion } from 'motion/react';
import { Delete, RotateCcw } from 'lucide-react';
import { CalculatorMode, LanguageMode, AngleMode } from '../types';
import { BN_DIGITS } from '../utils/calculator';

interface KeypadProps {
  mode: CalculatorMode;
  language: LanguageMode;
  angleMode: AngleMode;
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onFunction: (fn: string) => void;
  onClear: () => void;
  onAllClear: () => void;
  onBackspace: () => void;
  onEqual: () => void;
  onToggleSign: () => void;
  onToggleAngleMode: () => void;
  hasInput: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  mode,
  language,
  angleMode,
  onDigit,
  onOperator,
  onFunction,
  onClear,
  onAllClear,
  onBackspace,
  onEqual,
  onToggleSign,
  onToggleAngleMode,
  hasInput,
}) => {
  const getDigitLabel = (d: string) => {
    if (language === 'bn') {
      const idx = parseInt(d, 10);
      if (!isNaN(idx) && idx >= 0 && idx <= 9) return BN_DIGITS[idx];
      if (d === '00') return `${BN_DIGITS[0]}${BN_DIGITS[0]}`;
    }
    return d;
  };

  return (
    <div id="calc-keypad-container" className="flex flex-col gap-2 select-none">
      {/* Scientific Keypad Section (When in scientific mode) */}
      {mode === 'scientific' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          id="scientific-pad"
          className="grid grid-cols-5 gap-1.5 sm:gap-2 pb-2 border-b border-neutral-800/80"
        >
          <button
            id="btn-angle-mode-toggle"
            type="button"
            onClick={onToggleAngleMode}
            className="py-2.5 rounded-xl font-medium text-xs bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/40 transition-colors"
          >
            {angleMode.toUpperCase()}
          </button>
          <button
            id="btn-fn-sin"
            type="button"
            onClick={() => onFunction('sin')}
            className="py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/50 transition-colors"
          >
            sin
          </button>
          <button
            id="btn-fn-cos"
            type="button"
            onClick={() => onFunction('cos')}
            className="py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/50 transition-colors"
          >
            cos
          </button>
          <button
            id="btn-fn-tan"
            type="button"
            onClick={() => onFunction('tan')}
            className="py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/50 transition-colors"
          >
            tan
          </button>
          <button
            id="btn-fn-fact"
            type="button"
            onClick={() => onFunction('!')}
            className="py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/50 transition-colors"
          >
            x!
          </button>

          <button
            id="btn-fn-ln"
            type="button"
            onClick={() => onFunction('ln')}
            className="py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/50 transition-colors"
          >
            ln
          </button>
          <button
            id="btn-fn-log"
            type="button"
            onClick={() => onFunction('log')}
            className="py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/50 transition-colors"
          >
            log
          </button>
          <button
            id="btn-fn-pi"
            type="button"
            onClick={() => onFunction('π')}
            className="py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-neutral-800/90 hover:bg-neutral-700 text-amber-300 border border-neutral-700/50 transition-colors"
          >
            π
          </button>
          <button
            id="btn-fn-e"
            type="button"
            onClick={() => onFunction('e')}
            className="py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-neutral-800/90 hover:bg-neutral-700 text-amber-300 border border-neutral-700/50 transition-colors"
          >
            e
          </button>
          <button
            id="btn-fn-pow"
            type="button"
            onClick={() => onOperator('^')}
            className="py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/50 transition-colors"
          >
            xʸ
          </button>

          <button
            id="btn-paren-open"
            type="button"
            onClick={() => onFunction('(')}
            className="py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/50 transition-colors"
          >
            (
          </button>
          <button
            id="btn-paren-close"
            type="button"
            onClick={() => onFunction(')')}
            className="py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/50 transition-colors"
          >
            )
          </button>
          <button
            id="btn-fn-sqrt"
            type="button"
            onClick={() => onFunction('sqrt')}
            className="py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/50 transition-colors"
          >
            √x
          </button>
          <button
            id="btn-fn-sqr"
            type="button"
            onClick={() => onFunction('sqr')}
            className="py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/50 transition-colors"
          >
            x²
          </button>
          <button
            id="btn-fn-inv"
            type="button"
            onClick={() => onFunction('inv')}
            className="py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/50 transition-colors"
          >
            1/x
          </button>
        </motion.div>
      )}

      {/* Main Calculator Grid (4 Columns) */}
      <div id="main-keypad-grid" className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* Row 1: Clear / Backspace / Percent / Divide */}
        <motion.button
          id="btn-clear-all"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={hasInput ? onClear : onAllClear}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-base sm:text-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 active:bg-rose-500/40 transition-colors flex items-center justify-center cursor-pointer"
        >
          {hasInput ? (language === 'bn' ? 'সি' : 'C') : (language === 'bn' ? 'এসি' : 'AC')}
        </motion.button>

        <motion.button
          id="btn-backspace"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={onBackspace}
          aria-label="Backspace"
          className="h-14 sm:h-16 rounded-2xl font-semibold bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700/50 active:bg-neutral-600 transition-colors flex items-center justify-center cursor-pointer"
        >
          <Delete className="w-5 h-5" />
        </motion.button>

        <motion.button
          id="btn-percent"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => onOperator('%')}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-lg bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700/50 active:bg-neutral-600 transition-colors flex items-center justify-center cursor-pointer"
        >
          %
        </motion.button>

        <motion.button
          id="btn-op-divide"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => onOperator('÷')}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 active:bg-amber-500/40 transition-colors flex items-center justify-center cursor-pointer"
        >
          ÷
        </motion.button>

        {/* Row 2: 7, 8, 9, Multiply */}
        <motion.button
          id="btn-digit-7"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => onDigit('7')}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-xl sm:text-2xl bg-neutral-800/90 text-neutral-100 hover:bg-neutral-700 border border-neutral-700/40 active:bg-neutral-600 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
        >
          {getDigitLabel('7')}
        </motion.button>

        <motion.button
          id="btn-digit-8"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => onDigit('8')}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-xl sm:text-2xl bg-neutral-800/90 text-neutral-100 hover:bg-neutral-700 border border-neutral-700/40 active:bg-neutral-600 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
        >
          {getDigitLabel('8')}
        </motion.button>

        <motion.button
          id="btn-digit-9"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => onDigit('9')}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-xl sm:text-2xl bg-neutral-800/90 text-neutral-100 hover:bg-neutral-700 border border-neutral-700/40 active:bg-neutral-600 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
        >
          {getDigitLabel('9')}
        </motion.button>

        <motion.button
          id="btn-op-multiply"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => onOperator('×')}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 active:bg-amber-500/40 transition-colors flex items-center justify-center cursor-pointer"
        >
          ×
        </motion.button>

        {/* Row 3: 4, 5, 6, Subtract */}
        <motion.button
          id="btn-digit-4"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => onDigit('4')}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-xl sm:text-2xl bg-neutral-800/90 text-neutral-100 hover:bg-neutral-700 border border-neutral-700/40 active:bg-neutral-600 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
        >
          {getDigitLabel('4')}
        </motion.button>

        <motion.button
          id="btn-digit-5"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => onDigit('5')}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-xl sm:text-2xl bg-neutral-800/90 text-neutral-100 hover:bg-neutral-700 border border-neutral-700/40 active:bg-neutral-600 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
        >
          {getDigitLabel('5')}
        </motion.button>

        <motion.button
          id="btn-digit-6"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => onDigit('6')}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-xl sm:text-2xl bg-neutral-800/90 text-neutral-100 hover:bg-neutral-700 border border-neutral-700/40 active:bg-neutral-600 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
        >
          {getDigitLabel('6')}
        </motion.button>

        <motion.button
          id="btn-op-subtract"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => onOperator('−')}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-2xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 active:bg-amber-500/40 transition-colors flex items-center justify-center cursor-pointer"
        >
          −
        </motion.button>

        {/* Row 4: 1, 2, 3, Add */}
        <motion.button
          id="btn-digit-1"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => onDigit('1')}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-xl sm:text-2xl bg-neutral-800/90 text-neutral-100 hover:bg-neutral-700 border border-neutral-700/40 active:bg-neutral-600 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
        >
          {getDigitLabel('1')}
        </motion.button>

        <motion.button
          id="btn-digit-2"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => onDigit('2')}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-xl sm:text-2xl bg-neutral-800/90 text-neutral-100 hover:bg-neutral-700 border border-neutral-700/40 active:bg-neutral-600 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
        >
          {getDigitLabel('2')}
        </motion.button>

        <motion.button
          id="btn-digit-3"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => onDigit('3')}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-xl sm:text-2xl bg-neutral-800/90 text-neutral-100 hover:bg-neutral-700 border border-neutral-700/40 active:bg-neutral-600 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
        >
          {getDigitLabel('3')}
        </motion.button>

        <motion.button
          id="btn-op-add"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => onOperator('+')}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-2xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 active:bg-amber-500/40 transition-colors flex items-center justify-center cursor-pointer"
        >
          +
        </motion.button>

        {/* Row 5: +/- , 0, . , Equal */}
        <motion.button
          id="btn-toggle-sign"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={onToggleSign}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-lg bg-neutral-800/90 text-neutral-200 hover:bg-neutral-700 border border-neutral-700/40 active:bg-neutral-600 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
        >
          ±
        </motion.button>

        <motion.button
          id="btn-digit-0"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => onDigit('0')}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-xl sm:text-2xl bg-neutral-800/90 text-neutral-100 hover:bg-neutral-700 border border-neutral-700/40 active:bg-neutral-600 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
        >
          {getDigitLabel('0')}
        </motion.button>

        <motion.button
          id="btn-dot"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => onDigit('.')}
          className="h-14 sm:h-16 rounded-2xl font-semibold text-2xl bg-neutral-800/90 text-neutral-100 hover:bg-neutral-700 border border-neutral-700/40 active:bg-neutral-600 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
        >
          .
        </motion.button>

        <motion.button
          id="btn-equal"
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={onEqual}
          className="h-14 sm:h-16 rounded-2xl font-bold text-2xl bg-amber-500 text-neutral-950 hover:bg-amber-400 border border-amber-400 active:bg-amber-600 transition-all flex items-center justify-center cursor-pointer shadow-lg shadow-amber-500/20"
        >
          =
        </motion.button>
      </div>
    </div>
  );
};
