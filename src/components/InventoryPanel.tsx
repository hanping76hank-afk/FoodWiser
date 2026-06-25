/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Archive, ShieldQuestion } from 'lucide-react';
import { playChoiceSound } from '../utils/audio';

interface InventoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: string[];
  weapons: string[];
}

export default function InventoryPanel({ isOpen, onClose, inventory, weapons }: InventoryPanelProps) {
  // Normalize items to prevent duplicates and standardise emojis
  const getNormalizedItem = (rawItem: string): { name: string; emoji: string } => {
    // Strip existing emojis/icons or blank spaces to get the pure name
    let name = rawItem.replace(/[\s\u2000-\u3300\ud83c-\udfff\ud83d\ud83e\ud83f\ufe0f]/g, '').trim();
    if (!name) name = rawItem.trim();

    let emoji = '📦';
    if (name.includes('探測機')) {
      name = '探測機';
      emoji = '🔍';
    } else if (name === '木棍') {
      emoji = '🪵';
    } else if (name === '鐵鍋') {
      emoji = '🍳';
    } else if (name.includes('武士刀') || name.includes('生鏽武士刀')) {
      name = '生鏽武士刀';
      emoji = '⚔️';
    } else if (name.includes('儀仗')) {
      name = '儀仗劍';
      emoji = '🗡️';
    } else if (name.includes('骨扇') || name.includes('雲紫')) {
      name = '雲紫骨扇';
      emoji = '🪭';
    } else if (name.includes('蒼影丸')) {
      name = '蒼影丸';
      emoji = '🗡️';
    } else if (name.includes('青龍黃虎劍')) {
      name = '青龍黃虎劍';
      emoji = '⚔️';
    } else if (name.includes('禾火草')) {
      name = '禾火草';
      emoji = '🌿';
    }

    return { name, emoji };
  };

  // Build the unique map of item name -> emoji
  const uniqueMap = new Map<string, string>();

  inventory.forEach((item) => {
    const norm = getNormalizedItem(item);
    uniqueMap.set(norm.name, norm.emoji);
  });

  weapons.forEach((item) => {
    const norm = getNormalizedItem(item);
    uniqueMap.set(norm.name, norm.emoji);
  });

  const uniqueItems = Array.from(uniqueMap.entries()).map(([name, emoji]) => ({ name, emoji }));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0608]/95 font-sans select-none overflow-hidden">
          {/* Radial fog accent overlay */}
          <div className="absolute inset-0 bg-radial-at-c-b from-[#25132a]/30 via-transparent to-transparent pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 18 }}
            className="relative w-full max-w-sm border border-[#3d2040] rounded-xl bg-[#140c11] p-6 shadow-[0_12px_44px_rgba(0,0,0,0.85)] flex flex-col"
          >
            {/* Header Title Bar */}
            <div className="flex items-center justify-between border-b border-[#3d2040] pb-3 mb-5">
              <div className="flex items-center gap-2 text-[#fbbf24]">
                <Archive className="w-4.5 h-4.5" />
                <h2 className="text-sm font-semibold tracking-[0.25em] pl-[0.25em] uppercase font-serif">
                  我的背囊道具
                </h2>
              </div>
              <button
                onClick={() => {
                  playChoiceSound();
                  onClose();
                }}
                className="p-1 rounded-md border border-[#3d2040] hover:border-zinc-500 bg-[#0d070b] text-[#8b7869] hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid Container */}
            <div className="flex-1 min-h-[160px] max-h-72 overflow-y-auto no-scrollbar flex flex-col justify-start">
              {uniqueItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-3.5">
                  {uniqueItems.map((item, idx) => {
                    return (
                      <motion.div
                        key={`item-${idx}`}
                        whileHover={{ scale: 1.03, borderColor: '#5a3060' }}
                        className="flex flex-col items-center justify-center p-3.5 border border-[#2a152d] bg-[#1a0e1b]/70 rounded-lg text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
                      >
                        <span className="text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-1.5 transform group-hover:scale-110 transition-transform">
                          {item.emoji}
                        </span>
                        <span className="text-xs text-[#e8ddd0] font-sans font-medium tracking-wide">
                          {item.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500 flex-1 border border-dashed border-[#2a152d] rounded-lg bg-[#0d070b]/60">
                  <ShieldQuestion className="w-8 h-8 opacity-40 mb-2" />
                  <p className="text-xs tracking-wider">背包是空的，尚未獲得任何求生裝備</p>
                </div>
              )}
            </div>

            {/* Footer Closer */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                playChoiceSound();
                onClose();
              }}
              className="mt-6 w-full py-2 bg-transparent hover:bg-zinc-800/10 border border-[#4a2e52] hover:border-zinc-500 text-[#fbbf24] font-serif text-xs font-bold tracking-[0.25em] pl-[0.25em] cursor-pointer rounded-lg transition-transform"
            >
              收回行囊
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
