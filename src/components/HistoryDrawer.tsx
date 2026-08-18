import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, X, Clock, ArrowDownLeft } from 'lucide-react';
import { HistoryItem, LanguageMode } from '../types';
import { formatNumberWithLanguage, toBengaliNumber } from '../utils/calculator';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  language: LanguageMode;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
  language,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          />

          {/* Drawer Panel */}
          <motion.div
            id="calc-history-drawer"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed lg:static top-0 right-0 bottom-0 z-50 w-full sm:w-80 lg:w-72 bg-neutral-900 border-l border-neutral-800 p-4 sm:p-5 flex flex-col justify-between shadow-2xl lg:shadow-none lg:rounded-2xl lg:border"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-neutral-200 font-semibold text-sm sm:text-base">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{language === 'bn' ? 'হিসাবের ইতিহাস' : 'History'}</span>
              </div>
              <div className="flex items-center gap-1">
                {history.length > 0 && (
                  <button
                    id="btn-clear-history"
                    type="button"
                    onClick={onClearHistory}
                    title={language === 'bn' ? 'ইতিহাস মুছে ফেলুন' : 'Clear History'}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  id="btn-close-history"
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer lg:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div
              id="calc-history-list"
              className="flex-1 overflow-y-auto my-3 space-y-2.5 pr-1 scrollbar-thin"
            >
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 py-12 px-4">
                  <Clock className="w-8 h-8 stroke-1 text-neutral-600 mb-2" />
                  <p className="text-sm font-medium">
                    {language === 'bn' ? 'কোনো ইতিহাস নেই' : 'No history yet'}
                  </p>
                  <p className="text-xs text-neutral-600 mt-1">
                    {language === 'bn'
                      ? 'আপনার হিসাবগুলো এখানে সংরক্ষিত থাকবে'
                      : 'Your recent calculations will show up here'}
                  </p>
                </div>
              ) : (
                history.map((item) => {
                  const exprText =
                    language === 'bn' ? toBengaliNumber(item.expression) : item.expression;
                  const resText = formatNumberWithLanguage(item.result, language);

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => onSelectHistory(item)}
                      className="group p-3 rounded-xl bg-neutral-950/60 hover:bg-neutral-800/80 border border-neutral-800/60 hover:border-neutral-700 transition-all cursor-pointer text-right flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="text-xs font-mono text-neutral-400 group-hover:text-neutral-300 break-all">
                        {exprText} =
                      </div>
                      <div className="text-lg font-semibold font-['Plus_Jakarta_Sans',sans-serif] text-neutral-100 group-hover:text-amber-400 mt-1">
                        {resText}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-2 bottom-2 text-xs text-neutral-400 flex items-center gap-1 font-sans">
                        <ArrowDownLeft className="w-3 h-3 text-amber-400" />
                        <span className="text-[10px]">
                          {language === 'bn' ? 'ব্যবহার করুন' : 'Use'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer summary */}
            {history.length > 0 && (
              <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-500 text-center">
                {language === 'bn'
                  ? `মোট ${toBengaliNumber(history.length)}টি হিসাব সংরক্ষিত`
                  : `${history.length} saved calculations`}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
