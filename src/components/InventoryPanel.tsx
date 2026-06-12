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
  // Combine custom weapons and generic inventory tags with visual icons
  const allItems = [
    ...inventory,
    ...weapons.map((w) => {
      if (w === '木棍') return '木棍 🪵';
      if (w === '鐵鍋') return '鐵鍋 🍳';
      if (w === '生鏽武士刀') return '生鏽武士刀 ⚔️';
      if (w === '儀仗劍' || w.includes('儀仗')) return '儀仗劍 🗡️';
      if (w === '雲紫骨扇' || w.includes('骨扇') || w.includes('雲紫')) return '雲紫骨扇 🪭';
      return `${w} 📦`;
    }),
  ];

  // De-duplicate items for cleaner display
  const uniqueItems = Array.from(new Set(allItems));

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
                    const parts = item.split(' ');
                    const icon = parts[parts.length - 1];
                    const name = parts.slice(0, parts.length - 1).join(' ') || item;

                    return (
                      <motion.div
                        key={`item-${idx}`}
                        whileHover={{ scale: 1.03, borderColor: '#5a3060' }}
                        className="flex flex-col items-center justify-center p-3.5 border border-[#2a152d] bg-[#1a0e1b]/70 rounded-lg text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
                      >
                        <span className="text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-1.5 transform group-hover:scale-110 transition-transform">
                          {icon || '💼'}
                        </span>
                        <span className="text-xs text-[#e8ddd0] font-sans font-medium tracking-wide">
                          {name}
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
