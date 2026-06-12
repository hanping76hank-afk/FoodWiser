/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { playItemObtainedSound, playChoiceSound } from '../utils/audio';

interface GrassPopupProps {
  currentGrass: number;
  img: string;
  onPick: () => void;
  onSkip: () => void;
}

export default function GrassPopup({ currentGrass, img, onPick, onSkip }: GrassPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#050307]/95 font-sans select-none overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial-at-c-b from-[#3a1d0d]/30 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative w-full max-w-sm border border-orange-500/30 rounded-xl bg-[#140b06]/98 p-6 shadow-[0_0_35px_rgba(249,115,22,0.2)] text-center flex flex-col items-center"
      >
        {/* Grass Icon Container with frame removed */}
        <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center p-4 mb-4">
          <motion.img
            src={img}
            alt="禾火草"
            referrerPolicy="no-referrer"
            animate={{ scale: [1.1, 1.15, 1.1], y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="w-64 h-64 md:w-72 md:h-72 object-contain filter drop-shadow-[0_0_16px_#f97316]"
          />
        </div>

        {/* Header Title with Custom Colors */}
        <h2 className="text-lg font-bold text-orange-400 tracking-[0.15em] mb-2 flex items-center gap-1.5 justify-center">
          🌿 路邊的禾火草
        </h2>

        {/* Narrative Description */}
        <p className="text-xs md:text-sm text-[#e8ddd0]/90 leading-relaxed font-sans mb-4 max-w-[280px]">
          泥地邊緣閃爍著橘紅色的微弱螢光。
          一株蘊藏微弱陽氣的「禾火草」正靜靜生長。
          <br />
          <span className="font-bold text-amber-200">是否要拾取路邊的禾火草？</span>
        </p>

        {/* Simple count info container */}
        <div className="w-full p-2.5 rounded-xl border border-orange-500/10 bg-orange-950/20 text-center mb-6 font-sans">
          <p className="text-sm font-bold text-amber-300">目前背包持有：{currentGrass} 株</p>
        </div>

        {/* Action button row */}
        <div className="flex gap-3.5 w-full">
          <motion.button
            id="pick-grass-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              playItemObtainedSound();
              onPick();
            }}
            className="flex-1 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 border border-orange-400/40 text-orange-50 text-xs font-serif font-black tracking-[0.2em] pl-[0.2em] cursor-pointer rounded-lg shadow-lg"
          >
            拾取
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              playChoiceSound();
              onSkip();
            }}
            className="flex-1 py-2.5 border border-[#3d2040] hover:border-zinc-500 bg-[#12080a] text-zinc-400 hover:text-zinc-200 text-xs font-serif font-black tracking-[0.2em] pl-[0.2em] cursor-pointer rounded-lg"
          >
            無視
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
