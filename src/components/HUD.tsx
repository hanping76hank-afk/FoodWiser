/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Zap } from 'lucide-react';
import { GameState } from '../types';

interface HUDProps {
  state: GameState;
  onOpenInventory: () => void;
  locationName: string;
  currentStage: number;
  uiScale?: 'small' | 'medium' | 'large';
}

export default function HUD({ state, onOpenInventory, locationName, currentStage, uiScale = 'medium' }: HUDProps) {
  const { hp, maxHp, energy, grass, lockedHearts } = state;

  const redHearts = Math.max(0, hp);
  const lockedCount = Math.max(0, lockedHearts);
  const emptyHearts = Math.max(0, maxHp - redHearts - lockedCount);

  // Heart shatter animation tracking
  const prevHpRef = useRef(hp);
  const [shatteringIndices, setShatteringIndices] = useState<number[]>([]);

  useEffect(() => {
    if (hp < prevHpRef.current) {
      // Find all indices of hearts that were lost in this transition
      const newlyLost: number[] = [];
      for (let i = hp; i < prevHpRef.current; i++) {
        newlyLost.push(i);
      }
      if (newlyLost.length > 0) {
        setShatteringIndices((prev) => [...prev, ...newlyLost]);
        const timer = setTimeout(() => {
          setShatteringIndices((prev) => prev.filter(x => !newlyLost.includes(x)));
        }, 900);
        return () => clearTimeout(timer);
      }
    }
    prevHpRef.current = hp;
  }, [hp]);

  const leftPanelStyle: React.CSSProperties = {
    transform: uiScale === 'small' ? 'scale(0.85)' : uiScale === 'large' ? 'scale(1.15)' : 'scale(1)',
    transformOrigin: 'top left',
    transition: 'transform 0.3s ease-out',
  };

  const rightPanelStyle: React.CSSProperties = {
    transform: uiScale === 'small' ? 'scale(0.85)' : uiScale === 'large' ? 'scale(1.15)' : 'scale(1)',
    transformOrigin: 'top right',
    transition: 'transform 0.3s ease-out',
  };

  return (
    <div className="relative w-full z-30 select-none">
      {/* Top Gradient Overlay */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#0a0608]/95 via-[#0a0608]/60 to-transparent pointer-events-none" />

      {/* Primary HUD Matrix Row: Positions Top-Left (左上) and Top-Right (右上) data securely */}
      <div className="relative flex flex-row items-start justify-between gap-4 px-4 md:px-6 py-3.5">
         {/* ========================================================
            [TOP-LEFT / 左上] - 生命, 精力指針儀, 禾火草與關卡星印資料
           ======================================================== */}
        <div 
          style={leftPanelStyle}
          className="flex flex-col gap-2.5 bg-[#12080a]/90 border border-[#3d1a3a]/40 p-3 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.85)] w-52 md:w-64 max-w-[280px]"
        >
          
          {/* A. Elegant Hearts Matrix on TOP (最上面) */}
          <div className="flex flex-col gap-1 pb-1.5 border-b border-[#3d1a3a]/25">
            <div className="flex items-start gap-1.5">
              <span className="text-[9px] text-[#8b7869] tracking-wider font-sans font-bold uppercase shrink-0 w-8 text-left mt-0.5">生命:</span>
              <div className="grid grid-cols-10 gap-x-[1px] gap-y-[1px] w-fit">
                {/* Array rendering with conditional shatter particles */}
                {Array.from({ length: maxHp }).map((_, i) => {
                  // Determine status consecutively so they are always continuous with NO gaps!
                  const isRed = i < redHearts;
                  const isLocked = !isRed && (i < redHearts + lockedCount);
                  const isEmpty = i >= redHearts + lockedCount;
                  
                  const isShattering = shatteringIndices.includes(i);

                  return (
                    <div key={`heart-cell-${i}`} className="relative w-3 h-3 flex items-center justify-center">
                      
                      {/* Exploding heart fracture particles if active damaged */}
                      <AnimatePresence>
                        {isShattering && (
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40">
                            {Array.from({ length: 6 }).map((_, fragIdx) => {
                              const angle = (fragIdx / 6) * Math.PI * 2;
                              const randX = Math.cos(angle) * (20 + Math.random() * 15);
                              const randY = Math.sin(angle) * (20 + Math.random() * 15) - 5;
                              const randScale = 0.2 + Math.random() * 0.3;
                              const randRotate = (Math.random() - 0.5) * 360;

                              return (
                                <motion.span
                                  key={`shatter-particle-${fragIdx}`}
                                  initial={{ opacity: 1, scale: 1.1, x: 0, y: 0, rotate: 0 }}
                                  animate={{ opacity: 0, scale: randScale, x: randX, y: randY, rotate: randRotate }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.85, ease: 'easeOut' }}
                                  className="absolute text-[5px] font-sans pointer-events-none text-rose-500"
                                >
                                  {fragIdx % 2 === 0 ? '💔' : '🔺'}
                                </motion.span>
                              );
                            })}
                          </div>
                        )}
                      </AnimatePresence>

                      {/* Active Red Heart with high-quality staggered wave flickering */}
                      {isRed && !isShattering && (
                        <motion.span
                          animate={{ 
                            scale: [1, 1.2, 0.95, 1.1, 1],
                            opacity: [1, 0.45, 0.9, 0.25, 1, 0.8, 1]
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 4.8,
                            ease: "easeInOut",
                            delay: i * 0.35, // staggered running wave!
                          }}
                          className="text-[#ef4444] text-[9px] filter drop-shadow-[0_0_4px_rgba(239,68,68,0.95)] cursor-default leading-none font-sans"
                          title="生命值"
                        >
                          ❤️
                        </motion.span>
                      )}

                      {/* Locked Heart - animated vibrant emerald green heart */}
                      {isLocked && (
                        <motion.span
                          animate={{ 
                            scale: [1, 1.15, 0.95, 1.1, 1],
                            opacity: [1, 0.85, 1]
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 3.2,
                            ease: "easeInOut",
                            delay: i * 0.2,
                          }}
                          className="text-[10px] filter drop-shadow-[0_0_4px_rgba(16,185,129,0.95)] cursor-default relative leading-none font-sans"
                          title="陽氣鎖定"
                        >
                          💚
                        </motion.span>
                      )}

                      {/* No semi-transparent placeholder is shown when hearts are depleted/lost */}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* B. Retro Steampunk-styled pointer Voltmeter Energy Analogue (橫向指針式電壓表) in the MIDDLE (中間) */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-[9px] text-[#8b7869] tracking-wider font-sans font-bold uppercase shrink-0 w-8 text-left">精力:</span>
            
            <div className="relative w-28 md:w-36 h-7 bg-[#170e14] border border-[#522958] rounded-lg p-1 px-1.5 flex flex-col justify-between overflow-hidden shadow-[inset_0_2px_6px_rgba(0,0,0,0.95)]">
              {/* Dynamic warm backing light based on Energy levels */}
              <div 
                className="absolute inset-0 opacity-[0.24] blur-[3px] transition-all duration-300 pointer-events-none" 
                style={{
                  backgroundImage: energy >= 50 
                    ? 'radial-gradient(circle at center, #10b981, transparent 75%)' 
                    : energy >= 30 
                    ? 'radial-gradient(circle at center, #fbbf24, transparent 75%)' 
                    : 'radial-gradient(circle at center, #ef4444, transparent 75%)'
                }}
              />
              
              {/* Instrument Tick Divisions */}
              <div className="flex justify-between w-full h-[4px] opacity-40 border-b border-[#522958]/35 relative px-1">
                {Array.from({ length: 9 }).map((_, idx) => (
                  <div key={idx} className={`w-[1px] bg-amber-400 ${idx % 2 === 0 ? 'h-1' : 'h-0.5'}`} />
                ))}
              </div>
              
              {/* Voltmeter calibrations */}
              <div className="absolute top-[6px] left-1 flex justify-between text-[5px] text-amber-500/40 font-mono scale-[0.8] font-bold select-none w-full pr-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              
              {/* Red/Dynamic pointer needle pivoting and sweeping across scope */}
              <motion.div
                className={`absolute top-0.5 bottom-0.5 w-[1.5px] rounded-full flex items-center justify-center pointer-events-none ${
                  energy >= 50 ? 'bg-emerald-500' : energy >= 30 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ left: `calc(8px + (100% - 18px) * ${Math.min(100, Math.max(0, energy))} / 100)` }}
                animate={{ rotate: [0, -1.2, 1.2, 0] }}
                transition={{
                  x: { type: 'spring', stiffness: 90, damping: 14 },
                  rotate: { repeat: Infinity, duration: energy > 50 ? 3.5 : energy > 30 ? 1.8 : 0.6, repeatType: "reverse" }
                }}
              >
                {/* Copper head rivet indicator */}
                <div className="w-[3px] h-[3px] bg-amber-600 rounded-full border border-black shadow-md -mt-0.5" />
              </motion.div>
              
              {/* Number display follows the needle, bounded inside, shaking worse as energy gets lower */}
              <motion.div
                className={`absolute bottom-0.5 text-[8.5px] font-mono font-black tracking-wide z-20 pointer-events-none select-none transition-colors duration-300 ${
                  energy >= 50
                    ? 'text-emerald-400'
                    : energy >= 30
                    ? 'text-amber-400'
                    : 'text-red-500 font-extrabold animate-pulse'
                }`}
                style={{
                  left: `calc(3px + (100% - 30px) * ${Math.min(100, Math.max(0, energy))} / 100)`
                }}
                animate={{
                  x: [
                    0,
                    -(energy >= 50 ? 0.35 : energy >= 30 ? 1.5 : 4.5),
                    (energy >= 50 ? 0.35 : energy >= 30 ? 1.5 : 4.5),
                    -(energy >= 50 ? 0.35 : energy >= 30 ? 1.5 : 4.5),
                    0
                  ]
                }}
                transition={{
                  repeat: Infinity,
                  duration: energy >= 50 ? 0.45 : energy >= 30 ? 0.22 : 0.085,
                  ease: "linear"
                }}
              >
                {Math.round(energy)}%
              </motion.div>
 
              {/* Gauges stats row - word ENERGY is eliminated, spacer only */}
              <div className="flex items-center justify-between z-10 px-0.5 leading-none">
                <span className="text-[5px] text-[#8b7869] tracking-wider uppercase font-mono font-bold select-none"></span>
              </div>
            </div>
          </div>

          {/* C. Bottom row with Grass (Bottom-Left) */}
          <div className="flex flex-col gap-1 border-t border-[#3d1a3a]/25 pt-2 text-left">
            {/* Row 1: Grass tokens with multi-line wrapping capability */}
            <div className="flex items-start gap-1 flex-wrap">
              <span className="text-[9px] text-[#8b7869] tracking-wider font-sans font-bold uppercase shrink-0 mt-0.5">禾火草:</span>
              <div className="flex flex-wrap items-center gap-1 min-h-[16px] flex-1">
                {grass > 0 ? (
                  Array.from({ length: Math.min(6, grass) }).map((_, i) => (
                    <motion.span
                      key={`grass-token-${i}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 9, stiffness: 120 }}
                      className="text-xs filter drop-shadow-[0_0_3px_rgba(249,115,22,0.9)]"
                      title="已收集的禾火草"
                    >
                      🌿
                    </motion.span>
                  ))
                ) : (
                  <span className="text-[9px] text-zinc-500 italic font-sans pr-0.5">無</span>
                )}
                {grass >= 5 && (
                  <span className="inline-flex items-center gap-0.5 text-[7px] text-rose-500 font-sans border border-rose-500/30 bg-rose-500/10 px-0.5 rounded animate-pulse font-bold">
                    反噬
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================
            [TOP-RIGHT / 右上] - 目前所在位置 banner
           ======================================================== */}
        <div 
          style={rightPanelStyle}
          className="flex flex-col items-end text-right bg-[#10070d]/90 border border-[#3d1d32]/35 p-2 px-3 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.7)] max-w-[150px] md:max-w-[200px]"
        >
          {/* Level indicator placed above location */}
          <div className="flex items-center gap-1 justify-end mb-1">
            <span className="text-[8px] md:text-[9px] text-[#8b7869] tracking-wider uppercase font-sans font-bold">關卡層次:</span>
            <span className="text-[10px] text-amber-400 font-mono font-bold bg-[#1d120a] border border-[#d97706]/30 px-1.5 py-0.5 rounded leading-none">
              {currentStage + 1} / 10
            </span>
          </div>

          <span className="text-[8px] md:text-[9px] text-[#8b7869] uppercase tracking-[0.25em] font-sans font-bold border-t border-[#3d1d32]/25 pt-1 w-full text-right">
            目前位置
          </span>
          <span className="text-xs md:text-sm text-[#ebd9c5] font-serif font-black tracking-widest pl-[0.1em] mt-0.5 truncate leading-none">
            {locationName}
          </span>
        </div>

      </div>
    </div>
  );
}
