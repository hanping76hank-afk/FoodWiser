/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface EndingCreditsProps {
  onRestart: () => void;
}

export default function EndingCredits({ onRestart }: EndingCreditsProps) {
  const [creditsFinished, setCreditsFinished] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // States to drive the advanced custom button hovering sequences
  const [isHovered, setIsHovered] = useState(false);
  const [buttonStep, setButtonStep] = useState<number>(0); 
  // 0: idle, 1: center cover expanding, 2: spinner appearing & rotating, 3: spinner expanding to button edge

  useEffect(() => {
    // Transition to "The End" gold screen after credits crawl completes
    const crawlTimer = setTimeout(() => {
      setCreditsFinished(true);
    }, 8500);

    // Show menu button shortly after "The End" is fixed
    const btnTimer = setTimeout(() => {
      setShowButton(true);
    }, 10200);

    return () => {
      clearTimeout(crawlTimer);
      clearTimeout(btnTimer);
    };
  }, []);

  // Control the sequence step timings for the custom hover button
  useEffect(() => {
    if (isHovered) {
      setButtonStep(1);
      
      // Complete center-expanding cover first (takes 350ms)
      const t1 = setTimeout(() => {
        setButtonStep(2);
      }, 350);

      // Once fully covered, show spinner and spin once (takes 850ms)
      const t2 = setTimeout(() => {
        setButtonStep(3);
      }, 1200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setButtonStep(0);
    }
  }, [isHovered]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050306] flex items-center justify-center overflow-hidden select-none">
      
      {/* 16:9 transparent feel background image (displayed in original look) */}
      <div className="absolute inset-0 flex items-center justify-center z-0 bg-black">
        <img
          src="https://lh3.googleusercontent.com/d/1EG6zOjbk-ybegsGDj30o8Q7yziolFfme"
          alt="The End Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain opacity-100 transition-opacity duration-1000 max-w-[100vw] max-h-[100vh]"
        />
        {/* Subtle vignette layer to feather the edges beautifully */}
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/10 to-black/90 pointer-events-none" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-2xl px-6 flex items-center justify-center min-h-[480px]">
        
        <AnimatePresence>
          {!creditsFinished && (
            <motion.div
              key="crawl-container"
              initial={{ y: 280, opacity: 0 }}
              animate={{ y: -150, opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{
                times: [0, 0.12, 0.88, 1],
                duration: 8.5,
                ease: "linear",
              }}
              // Removed backdrop-blur per request
              className="absolute flex flex-col items-center text-center space-y-6 text-[#f5e6d3] bg-black/60 border border-amber-500/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] px-10 py-12 max-w-md w-[92%]"
            >
              <div className="space-y-2">
                <p className="text-amber-400 font-mono text-[10px] tracking-[0.3em] uppercase">僅謝</p>
                <p className="text-sm font-sans font-bold tracking-[0.15em] text-amber-200">
                  願意遊玩此遊戲的每一個玩家
                </p>
              </div>

              <div className="w-12 h-[1px] bg-amber-500/20" />

              <div className="space-y-4">
                <p className="text-amber-400 font-mono text-[10px] tracking-[0.3em] uppercase">特別感謝</p>
                <div className="space-y-3 text-xs md:text-sm font-sans tracking-[0.12em] text-[#ebd9c5]/95 leading-relaxed">
                  <p>為台灣民主奮鬥的先烈</p>
                  <p>為對抗殖民勢力而犧牲的英雄</p>
                  <p>為台灣人權益不斷奔波的烈士</p>
                  <p className="text-amber-300 font-medium pt-2">讓我們有安穩的今天</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Golden "THE END" with Academic Cap */}
        <AnimatePresence>
          {creditsFinished && (
            <motion.div
              key="the-end-container"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              // Removed backdrop blur per request, relying on pristine solid semi-transparent card overlay
              className="flex flex-col items-center text-center bg-black/60 rounded-2xl p-10 border border-amber-500/10 shadow-2xl"
            >
              {/* Gold Cap Icon */}
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 80 }}
                className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center mb-6"
              >
                <GraduationCap className="w-9 h-9 text-amber-400 filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]" />
              </motion.div>

              {/* Cinematic Metallic Gold "THE END" (all uppercase) */}
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-[0.3em] pl-[0.3em] font-serif text-amber-400 filter drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)] bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                THE END
              </h1>

              {/* Action Button Container */}
              <div className="h-20 mt-12 flex items-center justify-center">
                {showButton && (
                  <button
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => {
                      playClickSound();
                      onRestart();
                    }}
                    className="group relative w-60 h-14 border border-amber-400/40 bg-transparent text-amber-300 font-sans text-sm font-bold tracking-[0.25em] cursor-pointer rounded-lg shadow-lg overflow-hidden flex items-center justify-center transition-all duration-300 select-none p-0"
                  >
                    {/* 1. Center expanding background cover (從中間覆蓋向按鈕邊緣延伸) */}
                    <motion.span
                      className="absolute bg-amber-500 rounded-full w-72 h-72 z-0 pointer-events-none origin-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: isHovered ? 1.2 : 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    />

                    {/* 2. Spinner Ring that appears after complete cover, rotates 360 deg, and then expands to button boundary */}
                    <AnimatePresence>
                      {isHovered && buttonStep >= 2 && (
                        <motion.div
                          className="absolute z-10 pointer-events-none flex items-center justify-center"
                          initial={{ opacity: 0, scale: 0.3 }}
                          animate={
                            buttonStep === 2
                              ? {
                                  opacity: 1,
                                  scale: 0.7,
                                  rotate: 360,
                                }
                              : {
                                  opacity: [1, 1, 0],
                                  scale: 2.1, // expands exactly outward to the border edge
                                  rotate: 360,
                                }
                          }
                          exit={{ opacity: 0, scale: 0 }}
                          transition={
                            buttonStep === 2
                              ? {
                                  rotate: { duration: 0.85, ease: "easeInOut" },
                                  scale: { duration: 0.15 },
                                  opacity: { duration: 0.1 }
                                }
                              : {
                                  scale: { duration: 0.45, ease: "easeOut" },
                                  opacity: { duration: 0.45, times: [0, 0.75, 1] }
                                }
                          }
                        >
                          {/* Beautiful golden custom gradient loader ring spinner */}
                          <svg className="w-16 h-16" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="url(#creditsGoldGradient)"
                              strokeWidth="6"
                              fill="transparent"
                              strokeDasharray="180 100"
                              strokeLinecap="round"
                            />
                            <defs>
                              <linearGradient id="creditsGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f59e0b" />
                                <stop offset="50%" stopColor="#fbbf24" />
                                <stop offset="100%" stopColor="#fffbeb" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 3. Button Label Text with beautiful z-index state layer change */}
                    <span className="relative z-20 flex items-center justify-center w-full h-full pointer-events-none">
                      <span className={`absolute transition-all duration-300 tracking-[0.25em] pl-[0.25em] ${isHovered ? 'opacity-0 scale-90' : 'opacity-100 scale-100 text-amber-200'}`}>
                        返回主畫面
                      </span>
                      <span className={`absolute transition-all duration-300 tracking-[0.25em] pl-[0.25em] ${isHovered ? 'opacity-100 scale-100 text-[#050306]' : 'opacity-0 scale-90'}`}>
                        返回主畫面
                      </span>
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
