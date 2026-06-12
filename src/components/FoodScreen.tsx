/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, HelpCircle, AlertOctagon, Eye } from 'lucide-react';
import { Food } from '../types';
import { FOOD_DATA, LAMP_EFFECTS, IMG } from '../data';
import ScanPopup from './ScanPopup';
import { playChoiceSound } from '../utils/audio';

interface FoodScreenProps {
  location: string;
  onDone: (recoveredEnergy: number, lostHp: number, logMsg: string) => void;
}

export default function FoodScreen({ location, onDone }: FoodScreenProps) {
  const foodPool = FOOD_DATA[location] || [];

  // Local state
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [scannedIndices, setScannedIndices] = useState<Record<number, boolean>>({});
  const [scanningIndex, setScanningIndex] = useState<number | null>(null);
  const [phase2Select, setPhase2Select] = useState<number | null>(null);
  const [visitedIndices, setVisitedIndices] = useState<number[]>([]);

  // Dynamic food resolver based on scanning state
  const getResolvedFood = (food: Food, idx: number): Food => {
    if (scannedIndices[idx]) {
      const resolved = { ...food };
      if (food.scanName) resolved.name = food.scanName;
      if (food.scanEmoji) resolved.emoji = food.scanEmoji;
      if (food.scanDesc) resolved.desc = food.scanDesc;
      if (resolved.lamp === 'hidden' && food.realLamp) {
        resolved.lamp = food.realLamp;
      }
      return resolved;
    }
    return food;
  };

  // Checks and computations
  const getFoodLamp = (food: Food, idx: number) => {
    if (food.lamp === 'hidden') {
      return scannedIndices[idx] ? (food.realLamp || 'yellow') : 'hidden';
    }
    return food.lamp;
  };

  const isSelected = (idx: number) => selectedIndices.includes(idx);

  const handleCardClick = (idx: number) => {
    if (phase !== 1) return;
    const food = foodPool[idx];

    // Trigger Scan first if device is hidden
    if (food.lamp === 'hidden' && !scannedIndices[idx]) {
      setScanningIndex(idx);
      return;
    }

    playChoiceSound();
    if (isSelected(idx)) {
      setSelectedIndices(selectedIndices.filter((x) => x !== idx));
    } else {
      if (selectedIndices.length >= 3) {
        return; // limit 3
      }
      setSelectedIndices([...selectedIndices, idx]);
    }
  };

  const handleGoToPhase2 = () => {
    if (selectedIndices.length !== 3) return;
    playChoiceSound();
    setPhase(2);
    // Persist visited food indices as selected to hide their (!) markers if returning
    setVisitedIndices((prev) => Array.from(new Set([...prev, ...selectedIndices])));
  };

  const handleResetPhase1 = () => {
    playChoiceSound();
    setPhase(1);
    setPhase2Select(null);
  };

  const handleGoToPhase3 = () => {
    if (phase2Select === null) return;
    playChoiceSound();
    setPhase(3);
  };

  // Lamp classes for circles and glows in Step 3
  const getLampBadgeStyles = (lamp: string) => {
    switch (lamp) {
      case 'green':
        return 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]';
      case 'yellow':
        return 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]';
      case 'red':
        return 'bg-rose-500/20 border-rose-400 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.3)]';
      case 'black':
        return 'bg-neutral-900 border-neutral-700 text-neutral-400 ring-2 ring-red-900 shadow-[0_0_12px_#ef4444]';
      case 'hidden':
        return 'bg-amber-500/25 border border-yellow-500/50 text-yellow-200 animate-pulse font-black text-[9px] uppercase tracking-wider';
      default:
        return 'bg-zinc-800 border-zinc-700 text-purple-400 animate-pulse';
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#060407]/98 select-none flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Background radial overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c0512] via-[#050307] to-[#120808] opacity-90 pointer-events-none" />

      <div className={`relative z-10 w-full min-h-0 flex flex-col items-center justify-center py-2 md:py-4 px-2 md:px-4 mx-auto gap-2.5 md:gap-3 transition-all duration-300 ${
        phase === 1 ? 'max-w-3xl' : phase === 2 ? 'max-w-xl' : 'max-w-md'
      }`}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-[10px] text-orange-400 tracking-[0.3em] font-mono leading-none flex items-center justify-center gap-1 uppercase">
            <Eye className="w-3.5 h-3.5" />
            食物探測健康評估
          </span>
          <h2 className="text-base md:text-lg font-black text-[#e8ddd0] tracking-widest font-serif mt-0.5">
            與心愛的人共餐
          </h2>
          <p className="text-[10px] md:text-[11px] text-[#8b7869] mt-0.5 font-medium font-sans max-w-sm mx-auto leading-normal">
            {phase === 1
              ? `在【${location}】選擇三樣想吃的食物，用探測機交叉比對邪氣：`
              : phase === 2
              ? '請從先前挑選的三樣餐品中，探測並抉擇一樣服下：'
              : '餐品邪煞濃度及生命氣息深度解析報告已生成：'}
          </p>
        </motion.div>

        {/* ==================== PROGRESS COUNTER INLINE BADGE ==================== */}
        {phase === 1 && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-3 py-1 bg-[#200c22]/90 border border-amber-400/30 rounded-full text-[11px] text-amber-300 font-bold font-sans flex items-center gap-1.5"
          >
            <span>配餐進度 (六選三)：已選</span>
            <span className="px-1.5 py-0.5 bg-amber-500/20 text-white rounded font-black text-xs leading-none">
              {selectedIndices.length}
            </span>
            <span>/ 3</span>
            {selectedIndices.length === 3 && (
              <span className="text-emerald-400 font-bold ml-1">✓ 已滿</span>
            )}
          </motion.div>
        )}

        {/* ==================== PHASE 1: SELECTION GRID ==================== */}
        <AnimatePresence mode="wait">
          {phase === 1 ? (
            <motion.div
              key="phase-1-grid"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-3 gap-2 md:gap-3 w-full mt-1.5"
            >
              {foodPool.map((rawFood, idx) => {
                const food = getResolvedFood(rawFood, idx);
                const lamp = getFoodLamp(food, idx);
                const selected = isSelected(idx);
                const isHidden = lamp === 'hidden';

                return (
                  <motion.div
                    key={`food-${idx}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCardClick(idx)}
                    className={`relative flex flex-col items-center justify-between p-2 pb-2.5 border rounded-2xl cursor-pointer transition-all w-full group ${
                      selected
                        ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                        : isHidden
                        ? 'border border-dashed border-purple-900/50 bg-[#120715]/40 hover:border-amber-500/40'
                        : 'border-[#301633] bg-[#0c040d]/85 hover:border-[#522557] shadow-sm'
                    }`}
                  >
                    {/* Exclamation mark if food has a description and is not yet cleared */}
                    {food.desc && !visitedIndices.includes(idx) && (
                      <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-amber-500/95 text-neutral-950 flex items-center justify-center text-[10px] font-black pointer-events-none select-none z-10">
                        !
                      </div>
                    )}

                    {/* Item icon / enlarged image */}
                    <div className="w-full aspect-[4/3] rounded-xl bg-[#030105] flex items-center justify-center overflow-hidden border border-amber-500/10 shrink-0 select-none">
                      {food.img ? (
                        <img 
                          src={food.img} 
                          alt={food.name} 
                          referrerPolicy="no-referrer"
                          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${isHidden ? 'blur-[4px] grayscale opacity-30' : ''}`}
                        />
                      ) : (
                        <span className={`text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${isHidden ? 'blur-sm grayscale opacity-50' : ''}`}>
                          {food.emoji}
                        </span>
                      )}
                    </div>

                    {/* Food text name */}
                    <span className="text-[11px] md:text-xs text-[#e8ddd0] font-sans font-black text-center leading-tight line-clamp-1 mt-1.5 mb-1">
                      {food.name}
                    </span>

                    {/* Device light label badge - only shown if isHidden to represent scanning required */}
                    {isHidden ? (
                      <div className={`px-1.5 py-0.5 rounded text-[8px] font-mono border uppercase tracking-wider ${getLampBadgeStyles(lamp)}`}>
                        🔒 待探測
                      </div>
                    ) : (
                      <div className="h-4" />
                    )}

                    {/* Selected overlay dot */}
                    {selected && (
                      <div className="absolute top-1.5 right-1.5 w-4.5 h-4.5 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-bold shadow-md z-15">
                        ✓
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : phase === 2 ? (
            /* ==================== PHASE 2: INGESTION SCREEN (3選1) ==================== */
            <motion.div
              key="phase-2-list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-3 w-full max-w-md mt-2"
            >
              {selectedIndices.map((idx) => {
                const food = getResolvedFood(foodPool[idx], idx);
                const selected = phase2Select === idx;

                return (
                  <motion.div
                    key={`p2-${idx}`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      playChoiceSound();
                      setPhase2Select(idx);
                    }}
                    className={`flex items-center gap-4 p-3 border rounded-2xl cursor-pointer transition-all ${
                      selected
                        ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'border-[#2d1b30] bg-[#0e0610]/85 hover:border-[#4d2d52]'
                    }`}
                  >
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-xl bg-[#050206] flex items-center justify-center flex-shrink-0 overflow-hidden border border-amber-500/10">
                      {food.img ? (
                        <img 
                          src={food.img} 
                          alt={food.name} 
                          referrerPolicy="no-referrer" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-3xl">{food.emoji}</span>
                      )}
                    </div>

                    {/* Detail block */}
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="text-xs md:text-sm font-black text-[#e8ddd0]">
                        {food.name}
                      </h4>
                      <p className="text-[10px] md:text-xs text-[#8b7869] font-medium leading-relaxed line-clamp-2 mt-0.5">
                        {food.desc}
                      </p>
                    </div>

                    {/* Selection status circle */}
                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center font-bold text-[10px] shrink-0 ${
                      selected 
                        ? 'border-amber-400 bg-amber-400 text-black shadow' 
                        : 'border-zinc-700 bg-black/40 text-transparent'
                    }`}>
                      ✓
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* ==================== PHASE 3: FOOD RESOLUTION AND ANALYSIS (1燈+特效) ==================== */
            <motion.div
              key="phase-3-analysis"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm mt-3 flex flex-col"
            >
              {(() => {
                const food = getResolvedFood(foodPool[phase2Select!], phase2Select!);
                const selectedLamp = getFoodLamp(food, phase2Select!);
                const eff = LAMP_EFFECTS[selectedLamp] || LAMP_EFFECTS.green;

                const borderColors = {
                  green: 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
                  yellow: 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]',
                  red: 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]',
                  black: 'border-red-950 ring-1 ring-red-700 shadow-[0_0_25px_#ef4444]',
                };

                const lampMeta = {
                  green: { dot: 'bg-emerald-400', name: '綠燈 — 安心良品', glow: 'shadow-[0_0_12px_#10b981]' },
                  yellow: { dot: 'bg-amber-400', name: '黃燈 — 調和一般', glow: 'shadow-[0_0_12px_#f59e0b]' },
                  red: { dot: 'bg-rose-500 animate-pulse', name: '紅燈 — 瘴氣偏高', glow: 'shadow-[0_0_12px_#f43f5e]' },
                  black: { dot: 'bg-red-650 animate-pulse', name: '黑燈 — 邪煞劇毒', glow: 'shadow-[0_0_15px_#ef4444]' },
                };
                const meta = lampMeta[selectedLamp] || lampMeta.green;
                const isPositiveHp = eff.hp > 0;

                return (
                  <div className={`w-full rounded-2xl border p-4 bg-[#130715]/95 flex flex-col transition-all duration-500 ${borderColors[selectedLamp]}`}>
                    
                    {/* Top-Center Elegant Glowing Lamp Indicator (Single Light) */}
                    <div className="flex items-center gap-2 px-3.5 py-1.5 bg-black/60 rounded-full border border-neutral-800/80 w-fit self-center mx-auto mb-4 shadow-inner">
                      <div className="relative flex h-3 w-3 items-center justify-center">
                        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping duration-1000 ${
                          selectedLamp === 'green' ? 'bg-emerald-400' :
                          selectedLamp === 'yellow' ? 'bg-amber-400' :
                          selectedLamp === 'red' ? 'bg-rose-450' : 'bg-red-500'
                        }`} />
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${meta.dot} ${meta.glow} transition-all duration-300`} />
                      </div>
                      <span className="text-[11px] font-sans font-black tracking-wider text-[#e8ddd0]">{meta.name}</span>
                    </div>

                    {/* Middle: Expanded Food Image & Descriptions */}
                    <div className="flex flex-col items-center justify-center my-2">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-[#050206] flex items-center justify-center overflow-hidden border border-amber-500/10 shadow-lg mb-3">
                        {food.img ? (
                          <img src={food.img} alt={food.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl">{food.emoji}</span>
                        )}
                      </div>

                      <h3 className="text-base md:text-lg font-black text-white tracking-widest text-center mt-1 font-serif">
                        {food.name}
                      </h3>

                      <p className="text-[11px] md:text-xs text-[#ebd9c5]/80 font-medium leading-relaxed text-center mt-2.5 bg-black/30 p-3 rounded-xl border border-purple-950/45 w-full">
                        {food.desc}
                      </p>
                    </div>

                    {/* Bottom: Numeric Recovery Effects */}
                    <div className="mt-3 flex flex-col gap-2 bg-black/40 p-3 rounded-xl border border-purple-950/30">
                      <div className="flex items-center justify-between text-sm font-sans">
                        <span className="text-neutral-300 font-bold">
                          生命
                        </span>
                        <span className={`font-mono font-black text-sm tracking-wider ${isPositiveHp ? 'text-emerald-400' : 'text-rose-500 animate-pulse'}`}>
                          {eff.hp >= 0 ? `+${eff.hp}顆` : `${eff.hp}顆`}
                        </span>
                      </div>
                      <div className="w-full h-[1px] bg-purple-950/20" />
                      <div className="flex items-center justify-between text-sm font-sans">
                        <span className="text-neutral-300 font-bold">
                          精力
                        </span>
                        <span className={`font-mono font-black text-sm tracking-wider ${eff.energy >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                          {eff.energy >= 0 ? `+${eff.energy}%` : `${eff.energy}%`}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons directly placed in Step 3 outer container */}
                    <div className="flex mt-4 w-full">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          playChoiceSound();
                          onDone(
                            eff.energy,
                            eff.hp,
                            `解密並服用了【${food.name}】，${eff.text}`
                          );
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 border border-emerald-400/40 text-white text-center cursor-pointer rounded-xl text-xs font-serif font-bold tracking-[0.2em]"
                      >
                        確認服下
                      </motion.button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== PHASE 1 & 2 ACTIONS ==================== */}
        {phase !== 3 && (
          <div className="mt-3 w-full max-w-sm flex gap-3">
            {phase === 1 ? (
              <motion.button
                whileHover={{ scale: selectedIndices.length === 3 ? 1.02 : 1 }}
                whileTap={{ scale: selectedIndices.length === 3 ? 0.98 : 1 }}
                disabled={selectedIndices.length !== 3}
                onClick={handleGoToPhase2}
                className={`w-full py-2.5 font-serif text-xs font-bold tracking-[0.25em] pl-[0.25em] rounded-xl transition-all duration-300 ${
                  selectedIndices.length === 3
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border border-yellow-300 text-amber-950 shadow-[0_0_15px_rgba(234,179,8,0.5)] cursor-pointer font-black'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
              >
                進行配餐解析
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleResetPhase1}
                  className="flex-1 py-2.5 border border-zinc-805 hover:border-zinc-505 text-zinc-400 hover:text-zinc-200 font-serif text-xs font-bold tracking-[0.25em] pl-[0.25em] cursor-pointer rounded-xl"
                >
                  重選餐品
                </motion.button>

                <motion.button
                  whileHover={{ scale: phase2Select !== null ? 1.02 : 1 }}
                  whileTap={{ scale: phase2Select !== null ? 0.98 : 1 }}
                  disabled={phase2Select === null}
                  onClick={handleGoToPhase3}
                  className={`flex-1 py-2.5 font-serif text-xs font-bold tracking-[0.25em] pl-[0.25em] rounded-xl transition-transform ${
                    phase2Select !== null
                      ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-500 border border-amber-400/40 text-amber-50 cursor-pointer shadow-md'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  分析餐品健康
                </motion.button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ==================== INNER COMPONENT SCAN DIALOGUE ==================== */}
      <AnimatePresence>
        {scanningIndex !== null && (
          <ScanPopup
            item={foodPool[scanningIndex].name}
            img={foodPool[scanningIndex].img || IMG.掃描器}
            isHazardous={foodPool[scanningIndex].realLamp === 'black' || foodPool[scanningIndex].realLamp === 'red' || foodPool[scanningIndex].lamp === 'black' || foodPool[scanningIndex].lamp === 'red' || foodPool[scanningIndex].name === '供果'}
            result={foodPool[scanningIndex].scanResult || '掃描異常。'}
            onClose={() => {
              const prev = { ...scannedIndices };
              prev[scanningIndex] = true;
              setScannedIndices(prev);
              
              const indexToSelect = scanningIndex;
              setScanningIndex(null);

              // Automatically select the food item after successful scan, if we have space (< 3 selected)
              setSelectedIndices((prevSelected) => {
                if (prevSelected.includes(indexToSelect)) return prevSelected;
                if (prevSelected.length >= 3) return prevSelected;
                return [...prevSelected, indexToSelect];
              });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
