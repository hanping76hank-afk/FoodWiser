/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Skull, RefreshCw, Trophy, Heart, GraduationCap } from 'lucide-react';

interface GameOverScreenProps {
  isVictory: boolean;
  message: string;
  onRestart: () => void;
}

export default function GameOverScreen({ isVictory, message, onRestart }: GameOverScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#050306]/99 text-center font-serif flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Background visual cues */}
      <div className={`absolute inset-0 bg-radial-at-c ${isVictory ? 'from-[#423315]/35' : 'from-[#3a0d10]/35'} via-transparent to-transparent pointer-events-none`} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm flex flex-col items-center"
      >
        {/* Main Badge Anchor */}
        <motion.div
          animate={isVictory ? { y: [0, -6, 0] } : { y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg ${
            isVictory
              ? 'bg-amber-500/10 border border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
              : 'bg-red-500/10 border border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
          }`}
        >
          {isVictory ? (
            <GraduationCap className="w-8 h-8 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] text-amber-400" />
          ) : (
            <Trophy className="w-8 h-8 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] text-red-500" />
          )}
        </motion.div>

        {/* Dynamic Big Label Header */}
        {isVictory ? (
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 2.2, ease: 'easeOut' }}
            className="text-4xl md:text-5xl font-black tracking-[0.3em] pl-[0.3em] mb-6 bg-gradient-to-r from-amber-400 to-[#e8ddd0] bg-clip-text text-transparent filter drop-shadow-[0_0_12px_rgba(245,158,11,0.25)]"
          >
            THE END
          </motion.h1>
        ) : (
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 2.2, ease: 'easeOut' }}
            className="text-4xl md:text-5xl font-black tracking-[0.3em] pl-[0.3em] mb-6 bg-gradient-to-r from-red-500 to-[#e8ddd0] bg-clip-text text-transparent filter drop-shadow-[0_0_12px_rgba(239,68,68,0.25)]"
          >
            GAME OVER
          </motion.h1>
        )}

        {/* Narrative Box Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 2.0 }}
          className="w-full mb-8 text-center px-4"
        >
          <div
            className={`text-xs md:text-sm leading-relaxed font-sans font-medium ${isVictory ? 'text-[#ebd9c5]/95' : 'text-[#f0d8df]/95'}`}
            dangerouslySetInnerHTML={{ __html: message }}
          />
        </motion.div>

        {/* Call to action button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className={`group flex items-center gap-2.5 px-8 py-3.5 border text-sm font-bold tracking-[0.25em] pl-[0.25em] cursor-pointer rounded-lg transition-transform ${
            isVictory
              ? 'border-amber-400 text-amber-400 hover:bg-amber-500/10 shadow-[0_4px_16px_rgba(245,158,11,0.15)]'
              : 'border-red-500 text-red-500 hover:bg-red-500/10 shadow-[0_4px_16px_rgba(239,68,68,0.15)]'
          }`}
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span>{isVictory ? '返回主畫面' : '重新啟動'}</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
