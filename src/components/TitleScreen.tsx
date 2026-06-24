/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Volume2, ShieldAlert } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface TitleScreenProps {
  onStart: () => void;
  onOpenSettings: () => void;
}

export default function TitleScreen({ onStart, onOpenSettings }: TitleScreenProps) {
  return (
    <div id="title-screen" className="relative w-full h-full bg-[#0a0608] flex flex-col items-center justify-center overflow-hidden font-serif select-none">
      {/* Immersive background image underlay with ambient filters */}
      <img
        src="https://lh3.googleusercontent.com/d/1ATqhKfLAN46xzbiJKemvNZqKIG5tCdaQ"
        alt="Title Background"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none scale-105 transition-opacity duration-1000"
        style={{ 
          filter: 'brightness(0.7) saturate(0.9) contrast(1.15)'
        }}
      />

      {/* Dynamic Ambient Background Shaders */}
      <div className="absolute inset-0 bg-radial-at-c-b from-[#220731] via-transparent to-transparent opacity-70 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[30vh] h-[30vw] rounded-full bg-[#ef4444] blur-[140px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] rounded-full bg-[#a78bfa] blur-[150px] opacity-[0.12] pointer-events-none" />

      {/* Grid Pattern overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-lg px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full border border-[#8b7869]/30 bg-[#120c10]/80 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#d4a853] animate-pulse" />
          <span className="text-[10px] md:text-xs text-[#8b7869] tracking-[0.25em] font-sans">
            西元 2026 年 · 彰化八卦山
          </span>
        </motion.div>

        {/* Logo Main Title with Dual gradient reflection */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, type: 'spring' }}
          className="text-5xl md:text-7xl font-black tracking-[0.15em] mb-3 leading-tight filter drop-shadow-[0_12px_24px_rgba(107,47,160,0.3)] bg-gradient-to-br from-[#d4a853] via-[#f97316] to-[#c084fc] bg-clip-text text-transparent transform origin-center"
        >
          冥願
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="text-lg md:text-xl text-[#8b7869] tracking-[0.45em] mb-12 pl-[0.45em] font-light"
        >
          彰化師大篇
        </motion.p>

        {/* Start button with glowing hover animation and pulsing base */}
        <div className="flex flex-col gap-4 items-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              playClickSound();
              onStart();
            }}
            className="group relative w-56 h-14 border border-[#d4a853] bg-[#1a1018]/50 text-[#d4a853] text-lg font-medium cursor-pointer transition-all duration-300 rounded overflow-hidden shadow-[0_0_24px_rgba(212,168,83,0.15)] hover:shadow-[0_0_35px_rgba(212,168,83,0.4)] flex items-center justify-center p-0 animate-pulse-slow"
          >
            {/* Internal slider transition reflection */}
            <span className="absolute inset-0 w-full h-full bg-[#d4a853] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
            
            <span className="relative z-10 w-full h-full flex items-center justify-center">
              <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:opacity-0 group-hover:scale-95 tracking-[0.45em] pl-[0.45em] text-[#d4a853]">
                開始遊戲
              </span>
              <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 tracking-[0.45em] pl-[0.45em] text-[#0a0608]">
                踏入戰場
              </span>
            </span>
          </motion.button>

          {/* Quick Setup Gear Button for global config accessibility */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              playClickSound();
              onOpenSettings();
            }}
            className="text-[#8b7869] hover:text-amber-400 font-sans text-xs tracking-wider flex items-center gap-1 cursor-pointer border border-[#8b7869]/20 hover:border-amber-400 bg-[#12080f]/90 px-3 py-1.5 rounded-lg transition-colors shadow-lg"
          >
            <span>⚙️ 系統設定 (系統/音量/螢幕)</span>
          </motion.button>
        </div>
      </div>

      {/* Decorative footer notes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="absolute bottom-6 text-[10px] md:text-xs text-[#8b7869] tracking-widest font-sans flex items-center gap-1.5 opacity-30 select-none pointer-events-none"
      >
        <Volume2 className="w-3.5 h-3.5" />
        請開啟音效與視覺沉浸模式遊玩
      </motion.div>
    </div>
  );
}
