import React, { useState, useEffect, useCallback } from 'react';
import {
  Calculator as CalcIcon,
  FlaskConical,
  Languages,
  Volume2,
  VolumeX,
  History as HistoryIcon,
  HelpCircle,
} from 'lucide-react';
import { CalculatorMode, LanguageMode, AngleMode, HistoryItem } from './types';
import {
  evaluateExpression,
  toEnglishNumber,
  toBengaliNumber,
} from './utils/calculator';
import { soundManager } from './utils/sound';
import { Display } from './components/Display';
import { MemoryBar } from './components/MemoryBar';
import { Keypad } from './components/Keypad';
import { HistoryDrawer } from './components/HistoryDrawer';

export default function App() {
  // Mode & Preferences state
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [language, setLanguage] = useState<LanguageMode>('bn');
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Calculator State
  const [expression, setExpression] = useState<string>('');
  const [currentInput, setCurrentInput] = useState<string>('0');
  const [isNewNumber, setIsNewNumber] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [memoryValue, setMemoryValue] = useState<number>(0);
  const [hasMemory, setHasMemory] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Sound sync
  useEffect(() => {
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

  // Compute live preview
  const previewResult = React.useMemo(() => {
    if (!expression || isError) return null;
    const fullExpr = expression + (isNewNumber ? '' : currentInput);
    if (!fullExpr || fullExpr === currentInput) return null;
    const { result, isError: err } = evaluateExpression(fullExpr, angleMode);
    return err ? null : result;
  }, [expression, currentInput, isNewNumber, isError, angleMode]);

  // Handle digit input
  const handleDigit = useCallback(
    (digit: string) => {
      soundManager.playClick('num');
      setIsError(false);

      if (isNewNumber) {
        if (digit === '.') {
          setCurrentInput('0.');
        } else if (digit === '00') {
          setCurrentInput('0');
        } else {
          setCurrentInput(digit);
        }
        setIsNewNumber(false);
      } else {
        if (digit === '.') {
          if (currentInput.includes('.')) return;
          setCurrentInput((prev) => prev + '.');
        } else if (digit === '00') {
          if (currentInput === '0') return;
          setCurrentInput((prev) => prev + '00');
        } else {
          if (currentInput === '0') {
            setCurrentInput(digit);
          } else {
            setCurrentInput((prev) => prev + digit);
          }
        }
      }
    },
    [isNewNumber, currentInput]
  );

  // Handle binary operator
  const handleOperator = useCallback(
    (op: string) => {
      soundManager.playClick('op');
      setIsError(false);

      if (expression.endsWith('= ') || expression.includes('=')) {
        setExpression(`${currentInput} ${op} `);
        setIsNewNumber(true);
        return;
      }

      if (isNewNumber && expression.length > 0) {
        // Replace last operator
        setExpression((prev) => prev.replace(/\s[+−×÷%^]\s$/, ` ${op} `));
        return;
      }

      setExpression((prev) => `${prev}${currentInput} ${op} `);
      setIsNewNumber(true);
    },
    [expression, currentInput, isNewNumber]
  );

  // Handle scientific functions & unary operations
  const handleFunction = useCallback(
    (fn: string) => {
      soundManager.playClick('op');
      setIsError(false);

      const num = parseFloat(toEnglishNumber(currentInput));

      if (fn === '(' || fn === ')') {
        if (fn === '(') {
          setExpression((prev) => `${prev}( `);
        } else {
          setExpression((prev) => `${prev}${currentInput} ) `);
          setIsNewNumber(true);
        }
        return;
      }

      if (fn === 'π') {
        setCurrentInput(String(Math.PI));
        setIsNewNumber(false);
        return;
      }

      if (fn === 'e') {
        setCurrentInput(String(Math.E));
        setIsNewNumber(false);
        return;
      }

      if (fn === 'sqr') {
        // x^2
        const res = num * num;
        setCurrentInput(String(res));
        setIsNewNumber(false);
        return;
      }

      if (fn === 'sqrt') {
        // √x
        if (num < 0) {
          setIsError(true);
          setCurrentInput('Error');
          return;
        }
        const res = Math.sqrt(num);
        setCurrentInput(String(res));
        setIsNewNumber(false);
        return;
      }

      if (fn === 'inv') {
        // 1/x
        if (num === 0) {
          setIsError(true);
          setCurrentInput('Infinity');
          return;
        }
        const res = 1 / num;
        setCurrentInput(String(res));
        setIsNewNumber(false);
        return;
      }

      if (fn === '!') {
        // Factorial
        setExpression((prev) => `${prev}${currentInput}! `);
        const { result, isError: err } = evaluateExpression(`${currentInput}!`, angleMode);
        if (err) setIsError(true);
        setCurrentInput(result);
        setIsNewNumber(true);
        return;
      }

      // Trigo / Log functions e.g. sin, cos, tan, ln, log
      if (['sin', 'cos', 'tan', 'ln', 'log'].includes(fn)) {
        const exprToEval = `${fn}(${currentInput})`;
        const { result, isError: err } = evaluateExpression(exprToEval, angleMode);
        if (err) {
          setIsError(true);
        }
        setCurrentInput(result);
        setExpression((prev) => `${prev}${fn}(${currentInput}) `);
        setIsNewNumber(true);
      }
    },
    [currentInput, angleMode]
  );

  // Handle toggle sign (+/-)
  const handleToggleSign = useCallback(() => {
    soundManager.playClick('op');
    if (currentInput === '0' || isError) return;
    if (currentInput.startsWith('-')) {
      setCurrentInput((prev) => prev.slice(1));
    } else {
      setCurrentInput((prev) => '-' + prev);
    }
  }, [currentInput, isError]);

  // Handle Backspace
  const handleBackspace = useCallback(() => {
    soundManager.playClick('num');
    if (isNewNumber || isError) {
      setCurrentInput('0');
      setIsNewNumber(true);
      return;
    }
    if (currentInput.length <= 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
      setCurrentInput('0');
      setIsNewNumber(true);
    } else {
      setCurrentInput((prev) => prev.slice(0, -1));
    }
  }, [isNewNumber, isError, currentInput]);

  // Handle Clear Entry (C)
  const handleClear = useCallback(() => {
    soundManager.playClick('clear');
    setCurrentInput('0');
    setIsNewNumber(true);
    setIsError(false);
  }, []);

  // Handle All Clear (AC)
  const handleAllClear = useCallback(() => {
    soundManager.playClick('clear');
    setExpression('');
    setCurrentInput('0');
    setIsNewNumber(true);
    setIsError(false);
  }, []);

  // Handle Equals (=)
  const handleEqual = useCallback(() => {
    soundManager.playClick('equal');
    if (isError) return;

    let fullExpr = expression;
    if (!expression.endsWith('= ') && !expression.includes('=')) {
      fullExpr = `${expression}${currentInput}`;
    } else {
      fullExpr = currentInput;
    }

    if (!fullExpr || fullExpr.trim() === '') return;

    const { result, isError: err } = evaluateExpression(fullExpr, angleMode);

    if (err) {
      setIsError(true);
      setCurrentInput('Error');
    } else {
      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        expression: fullExpr,
        result: result,
        timestamp: new Date(),
        mode,
      };
      setHistory((prev) => [newItem, ...prev.slice(0, 49)]);

      setExpression(`${fullExpr} =`);
      setCurrentInput(result);
      setIsNewNumber(true);
    }
  }, [expression, currentInput, isError, angleMode, mode]);

  // Handle Memory Operations
  const handleMemoryAction = useCallback(
    (action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => {
      soundManager.playClick('op');
      const val = parseFloat(toEnglishNumber(currentInput));
      const currentVal = isNaN(val) ? 0 : val;

      switch (action) {
        case 'MC':
          setMemoryValue(0);
          setHasMemory(false);
          break;
        case 'MR':
          if (hasMemory) {
            setCurrentInput(String(memoryValue));
            setIsNewNumber(false);
          }
          break;
        case 'MS':
          setMemoryValue(currentVal);
          setHasMemory(true);
          setIsNewNumber(true);
          break;
        case 'M+':
          setMemoryValue((prev) => prev + currentVal);
          setHasMemory(true);
          setIsNewNumber(true);
          break;
        case 'M-':
          setMemoryValue((prev) => prev - currentVal);
          setHasMemory(true);
          setIsNewNumber(true);
          break;
      }
    },
    [currentInput, hasMemory, memoryValue]
  );

  // Copy result
  const handleCopyResult = useCallback(() => {
    navigator.clipboard.writeText(currentInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentInput]);

  // History reuse
  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setCurrentInput(item.result);
    setExpression(`${item.expression} =`);
    setIsNewNumber(true);
    setIsError(false);
  }, []);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(e.key)) {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperator('−');
      } else if (e.key === '*') {
        e.preventDefault();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === '%') {
        e.preventDefault();
        handleOperator('%');
      } else if (e.key === '^') {
        e.preventDefault();
        handleOperator('^');
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handleFunction(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEqual();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleAllClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleDigit,
    handleOperator,
    handleFunction,
    handleEqual,
    handleBackspace,
    handleAllClear,
  ]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-3 sm:p-6 select-none relative overflow-x-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md lg:max-w-4xl flex flex-col lg:flex-row gap-5 items-stretch justify-center z-10">
        {/* Main Calculator Unit */}
        <section
          id="calculator-main-unit"
          className="flex-1 w-full bg-neutral-900/90 border border-neutral-800 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col gap-4"
        >
          {/* Header Controls Bar */}
          <header className="flex items-center justify-between gap-2 pb-1 border-b border-neutral-800/80">
            {/* App Brand & Mode */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <CalcIcon className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-neutral-100 font-['Hind_Siliguri',sans-serif]">
                  {language === 'bn' ? 'ক্যালকুলেটর' : 'Calculator'}
                </h1>
              </div>
            </div>

            {/* Top Toolbar Actions */}
            <div className="flex items-center gap-1.5">
              {/* Language Switch */}
              <button
                id="btn-toggle-language"
                type="button"
                onClick={() => setLanguage((l) => (l === 'bn' ? 'en' : 'bn'))}
                title={language === 'bn' ? 'Switch to English Digits' : 'বাংলা সংখ্যা চালু করুন'}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/50 transition-colors cursor-pointer"
              >
                <Languages className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'bn' ? 'বাংলা (০-৯)' : 'EN (0-9)'}</span>
              </button>

              {/* Mode Switch (Standard / Scientific) */}
              <button
                id="btn-toggle-mode"
                type="button"
                onClick={() =>
                  setMode((m) => (m === 'standard' ? 'scientific' : 'standard'))
                }
                title={
                  mode === 'standard'
                    ? language === 'bn'
                      ? 'বৈজ্ঞানিক মোড চালু করুন'
                      : 'Switch to Scientific Mode'
                    : language === 'bn'
                    ? 'সাধারণ মোড চালু করুন'
                    : 'Switch to Standard Mode'
                }
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                  mode === 'scientific'
                    ? 'bg-indigo-950/60 text-indigo-300 border-indigo-700/50'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white border-neutral-700/50'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {mode === 'scientific'
                    ? language === 'bn'
                      ? 'বৈজ্ঞানিক'
                      : 'Scientific'
                    : language === 'bn'
                    ? 'সাধারণ'
                    : 'Standard'}
                </span>
              </button>

              {/* Sound Toggle */}
              <button
                id="btn-toggle-sound"
                type="button"
                onClick={() => setSoundEnabled((s) => !s)}
                title={
                  soundEnabled
                    ? language === 'bn'
                      ? 'শব্দ বন্ধ করুন'
                      : 'Mute Sound'
                    : language === 'bn'
                    ? 'শব্দ চালু করুন'
                    : 'Unmute Sound'
                }
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-neutral-500" />
                )}
              </button>

              {/* History Toggle (Mobile / Tablet drawer) */}
              <button
                id="btn-toggle-history"
                type="button"
                onClick={() => setShowHistory((h) => !h)}
                title={language === 'bn' ? 'হিসাবের ইতিহাস' : 'History'}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors cursor-pointer lg:hidden relative"
              >
                <HistoryIcon className="w-4 h-4 text-amber-400" />
                {history.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-neutral-900" />
                )}
              </button>
            </div>
          </header>

          {/* Calculator Screen Display */}
          <Display
            expression={expression}
            currentInput={currentInput}
            previewResult={previewResult}
            language={language}
            angleMode={angleMode}
            hasMemory={hasMemory}
            memoryValue={memoryValue}
            isError={isError}
            onCopy={handleCopyResult}
            copied={copied}
          />

          {/* Memory Bar */}
          <MemoryBar
            hasMemory={hasMemory}
            onMemoryAction={handleMemoryAction}
            language={language}
          />

          {/* Keypad */}
          <Keypad
            mode={mode}
            language={language}
            angleMode={angleMode}
            onDigit={handleDigit}
            onOperator={handleOperator}
            onFunction={handleFunction}
            onClear={handleClear}
            onAllClear={handleAllClear}
            onBackspace={handleBackspace}
            onEqual={handleEqual}
            onToggleSign={handleToggleSign}
            onToggleAngleMode={() =>
              setAngleMode((a) => (a === 'deg' ? 'rad' : 'deg'))
            }
            hasInput={currentInput !== '0' || !isNewNumber}
          />

          {/* Bottom Keyboard Hint Bar */}
          <footer className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-800/60">
            <button
              id="btn-keyboard-help"
              type="button"
              onClick={() => setShowShortcuts((s) => !s)}
              className="flex items-center gap-1 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {language === 'bn'
                  ? 'কীবোর্ড শর্টকাট দেখতে ক্লিক করুন'
                  : 'Keyboard shortcuts supported'}
              </span>
            </button>

            <span>
              {language === 'bn' ? 'বাংলা ও ইংরেজি সমর্থন' : 'Standard & Scientific'}
            </span>
          </footer>
        </section>

        {/* History Panel (Always visible side panel on Desktop lg+ screens) */}
        <div className="hidden lg:block w-72">
          <HistoryDrawer
            isOpen={true}
            onClose={() => {}}
            history={history}
            onSelectHistory={handleSelectHistory}
            onClearHistory={() => setHistory([])}
            language={language}
          />
        </div>

        {/* Mobile / Tablet History Drawer */}
        <div className="lg:hidden">
          <HistoryDrawer
            isOpen={showHistory}
            onClose={() => setShowHistory(false)}
            history={history}
            onSelectHistory={(item) => {
              handleSelectHistory(item);
              setShowHistory(false);
            }}
            onClearHistory={() => setHistory([])}
            language={language}
          />
        </div>
      </div>

      {/* Keyboard Shortcuts Dialog Modal */}
      {showShortcuts && (
        <div
          id="shortcuts-modal-backdrop"
          onClick={() => setShowShortcuts(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50"
        >
          <div
            id="shortcuts-modal-card"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
              <h3 className="font-semibold text-neutral-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                {language === 'bn' ? 'কীবোর্ড শর্টকাট' : 'Keyboard Shortcuts'}
              </h3>
              <button
                type="button"
                onClick={() => setShowShortcuts(false)}
                className="text-neutral-400 hover:text-white text-xs px-2 py-1 bg-neutral-800 rounded-lg cursor-pointer"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80 flex justify-between items-center">
                <span className="text-neutral-400">{language === 'bn' ? 'সংখ্যা' : 'Numbers'}</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-amber-300">0-9</kbd>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80 flex justify-between items-center">
                <span className="text-neutral-400">{language === 'bn' ? 'যোগ, বিয়োগ' : 'Operations'}</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-amber-300">+ - * /</kbd>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80 flex justify-between items-center">
                <span className="text-neutral-400">{language === 'bn' ? 'ফলাফল নির্ণয়' : 'Calculate'}</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-amber-300">Enter / =</kbd>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80 flex justify-between items-center">
                <span className="text-neutral-400">{language === 'bn' ? 'মুছে ফেলা' : 'Backspace'}</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-amber-300">⌫ Backspace</kbd>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80 flex justify-between items-center">
                <span className="text-neutral-400">{language === 'bn' ? 'সব মুছুন' : 'All Clear'}</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-amber-300">Escape</kbd>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80 flex justify-between items-center">
                <span className="text-neutral-400">{language === 'bn' ? 'বন্ধনী' : 'Parentheses'}</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-amber-300">( )</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
