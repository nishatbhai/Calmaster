import React from 'react';
import { motion } from 'motion/react';
import { LanguageMode } from '../types';

interface MemoryBarProps {
  hasMemory: boolean;
  onMemoryAction: (action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => void;
  language: LanguageMode;
}

export const MemoryBar: React.FC<MemoryBarProps> = ({
  hasMemory,
  onMemoryAction,
  language,
}) => {
  const memoryButtons: Array<{ action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS'; label: string; tooltip: string }> = [
    {
      action: 'MC',
      label: 'MC',
      tooltip: language === 'bn' ? 'মেমরি মুছে ফেলুন (Memory Clear)' : 'Clear Memory',
    },
    {
      action: 'MR',
      label: 'MR',
      tooltip: language === 'bn' ? 'মেমরি থেকে আনুন (Memory Recall)' : 'Recall Memory',
    },
    {
      action: 'M+',
      label: 'M+',
      tooltip: language === 'bn' ? 'মেমরিতে যোগ করুন (Memory Add)' : 'Add to Memory',
    },
    {
      action: 'M-',
      label: 'M-',
      tooltip: language === 'bn' ? 'মেমরি থেকে বিয়োগ করুন (Memory Subtract)' : 'Subtract from Memory',
    },
    {
      action: 'MS',
      label: 'MS',
      tooltip: language === 'bn' ? 'মেমরিতে সংরক্ষণ করুন (Memory Store)' : 'Store in Memory',
    },
  ];

  return (
    <div
      id="calc-memory-bar"
      className="grid grid-cols-5 gap-1.5 sm:gap-2 py-1 select-none"
    >
      {memoryButtons.map(({ action, label, tooltip }) => {
        const disabled = (action === 'MC' || action === 'MR') && !hasMemory;
        return (
          <motion.button
            key={action}
            id={`btn-mem-${action.toLowerCase()}`}
            type="button"
            title={tooltip}
            disabled={disabled}
            whileTap={disabled ? {} : { scale: 0.95 }}
            onClick={() => onMemoryAction(action)}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              disabled
                ? 'text-neutral-600 bg-neutral-900/40 cursor-not-allowed border border-transparent'
                : 'text-neutral-300 bg-neutral-800/80 hover:bg-neutral-700 hover:text-white border border-neutral-700/50 active:border-amber-500/50 cursor-pointer shadow-sm'
            }`}
          >
            {label}
          </motion.button>
        );
      })}
    </div>
  );
};
