import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy } from 'lucide-react';
import { LanguageMode, AngleMode } from '../types';
import { formatNumberWithLanguage, toBengaliNumber } from '../utils/calculator';

interface DisplayProps {
  expression: string;
  currentInput: string;
  previewResult: string | null;
  language: LanguageMode;
  angleMode: AngleMode;
  hasMemory: boolean;
  memoryValue: number;
  isError: boolean;
  onCopy: () => void;
  copied: boolean;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  currentInput,
  previewResult,
  language,
  angleMode,
  hasMemory,
  memoryValue,
  isError,
  onCopy,
  copied,
}) => {
  const exprContainerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll expression and input to right
  useEffect(() => {
    if (exprContainerRef.current) {
      exprContainerRef.current.scrollLeft = exprContainerRef.current.scrollWidth;
    }
    if (inputContainerRef.current) {
      inputContainerRef.current.scrollLeft = inputContainerRef.current.scrollWidth;
    }
  }, [expression, currentInput]);

  // Format expression for display
  const displayExpr = language === 'bn' ? toBengaliNumber(expression) : expression;

  // Format current input/result
  const displayInput = isError
    ? language === 'bn'
      ? 'ভুল ইনপুট'
      : 'Error'
    : formatNumberWithLanguage(currentInput || '0', language);

  // Format preview
  const displayPreview =
    previewResult !== null && !isError
      ? `= ${formatNumberWithLanguage(previewResult, language)}`
      : null;

  return (
    <div
      id="calc-display-panel"
      aria-label="Calculator Screen"
      className="relative w-full rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 sm:p-5 flex flex-col justify-between shadow-inner overflow-hidden"
    >
      {/* Top Status Badges */}
      <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 select-none">
        <div className="flex items-center gap-2">
          <span
            id="badge-angle-mode"
            className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-medium text-[11px] border border-neutral-700/60 uppercase tracking-wider"
          >
            {angleMode}
          </span>
          {hasMemory && (
            <span
              id="badge-memory"
              title={`Memory: ${memoryValue}`}
              className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-medium text-[11px] border border-amber-500/40"
            >
              M ({language === 'bn' ? toBengaliNumber(memoryValue) : memoryValue})
            </span>
          )}
        </div>

        {/* Copy button */}
        <button
          id="btn-copy-result"
          type="button"
          onClick={onCopy}
          title={language === 'bn' ? 'ফলাফল কপি করুন' : 'Copy result'}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] text-emerald-400 font-medium">
                {language === 'bn' ? 'কপি হয়েছে' : 'Copied'}
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium hidden sm:inline">
                {language === 'bn' ? 'কপি' : 'Copy'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Expression line */}
      <div
        ref={exprContainerRef}
        id="calc-expression-line"
        className="w-full overflow-x-auto whitespace-nowrap text-right text-neutral-400 text-sm sm:text-base font-mono tracking-wide scrollbar-none py-1 min-h-[1.75rem]"
      >
        {displayExpr || <span className="opacity-0">0</span>}
      </div>

      {/* Primary Value Input / Result */}
      <div
        ref={inputContainerRef}
        id="calc-primary-display"
        className={`w-full overflow-x-auto whitespace-nowrap text-right font-['Plus_Jakarta_Sans',sans-serif] font-semibold tracking-tight scrollbar-none py-1 select-all ${
          displayInput.length > 12
            ? 'text-2xl sm:text-3xl'
            : displayInput.length > 8
            ? 'text-3xl sm:text-4xl'
            : 'text-4xl sm:text-5xl'
        } ${isError ? 'text-rose-400' : 'text-neutral-50'}`}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayInput}
            initial={{ opacity: 0.8, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            {displayInput}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Live Preview of Calculation */}
      <div
        id="calc-preview-line"
        className="h-5 text-right text-xs sm:text-sm text-neutral-500 font-mono overflow-hidden transition-all duration-150"
      >
        {displayPreview && (
          <span className="text-amber-400/90 font-medium">{displayPreview}</span>
        )}
      </div>
    </div>
  );
};
