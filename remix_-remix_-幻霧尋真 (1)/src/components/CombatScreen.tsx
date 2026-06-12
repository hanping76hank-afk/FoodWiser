/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Semi-circle Voltage Dial Combat Screen (Redesigned for PC/Desktop)
 * Precise integration with Stars System, 1-second warning locks, cookware items, and shatter effects.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Zap, Shield, Heart, RotateCcw, LogOut, Activity, Sparkles, Sword } from 'lucide-react';
import CutoutImage from './CutoutImage';
import { 
  playHeartbeatSound, 
  playCockpitWarningSound, 
  playPlayerHurtSound, 
  playEnemyHurtSound, 
  playEnemyDeathSound, 
  playPlayerDeathSound, 
  playVictorySound 
} from '../utils/audio';

interface CombatScreenProps {
  enemyName: string;
  initialHp: number;
  enemyImg: string;
  weapons: string[];
  heldGrass: number;
  playerHp?: number;
  playerMaxHp?: number;
  playerEnergy?: number;
  onSpendEnergy?: (amount: number) => void;
  onPlayerHurt: (hearts: number) => void;
  onWin: () => void;
  onEscape?: () => void;
  onRestartCombat?: (hp: number, energy: number, grass: number) => void;
  addLogEvent?: (text: string, type: string) => void;
}

/**
 * Nested Interactive Star Cell (Heart-shaped life indicators with beautiful particle splash)
 */
function StarCell({ isFilled, isLocked = false, isEnemy = false, delayIndex = 0 }: { isFilled: boolean; isLocked?: boolean; isEnemy?: boolean; delayIndex?: number; key?: any }) {
  const [hasShattered, setHasShattered] = useState(false);
  const wasFilledRef = useRef(isFilled);

  useEffect(() => {
    // Detect transition from true (filled) to false (depleted)
    if (wasFilledRef.current && !isFilled) {
      setHasShattered(true);
      const timer = setTimeout(() => {
        setHasShattered(false);
      }, 900);
      return () => clearTimeout(timer);
    }
    wasFilledRef.current = isFilled;
  }, [isFilled]);

  const fragments = Array.from({ length: 14 });

  // Flying transition animation from top-left area for player hearts
  const flyProps = isEnemy
    ? {
        initial: { scale: 0, opacity: 0, y: -40 },
        animate: { scale: 1, opacity: 1, y: 0 },
        transition: { type: 'spring', stiffness: 90, damping: 12, delay: delayIndex * 0.1 }
      }
    : {
        initial: { x: -350, y: -250, scale: 0, opacity: 0, rotate: -35 },
        animate: { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 },
        transition: { type: 'spring', stiffness: 60, damping: 14, delay: delayIndex * 0.08 }
      };

  return (
    <motion.div 
      {...flyProps}
      className="relative w-6 h-6 flex items-center justify-center"
    >
      {/* 360-degree floating particles spray upon star break */}
      <AnimatePresence>
        {hasShattered && (
          <>
            {fragments.map((_, fIdx) => {
              const angle = (fIdx / fragments.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
              const distance = 30 + Math.random() * 45;
              const randX = Math.cos(angle) * distance;
              const randY = Math.sin(angle) * distance;
              const randScale = 0.4 + Math.random() * 0.6;
              const randRotate = (Math.random() - 0.5) * 720;
              return (
                <motion.span
                  key={`star-particle-${fIdx}`}
                  initial={{ opacity: 1, scale: 1.2, x: 0, y: 0, rotate: 0 }}
                  animate={{ 
                    opacity: [1, 0.9, 0], 
                    scale: [1.2, randScale, 0], 
                    x: randX, 
                    y: randY, 
                    rotate: randRotate 
                  }}
                  transition={{ duration: 0.75, ease: 'easeOut' }}
                  className={`absolute font-sans pointer-events-none text-xs z-50 select-none ${isEnemy ? 'text-purple-400' : 'text-red-500'}`}
                  style={{ textShadow: isEnemy ? '0 0 8px rgba(168,85,247,0.95)' : '0 0 8px rgba(239,68,68,0.95)' }}
                >
                  {fIdx % 3 === 0 ? (isEnemy ? '💜' : '❤️') : fIdx % 3 === 1 ? (isEnemy ? '💔' : '💔') : '💥'}
                </motion.span>
              );
            })}
          </>
        )}
      </AnimatePresence>

      <motion.div
        animate={isFilled && !isLocked ? { scale: [0.85, 1.15, 1], rotate: [0, 6, -6, 0] } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative flex items-center justify-center leading-none"
      >
        {isEnemy ? (
          /* Enemy heart representations */
          isFilled ? (
            <span className="text-[13px] filter drop-shadow-[0_0_5px_rgba(168,85,247,0.95)] animate-pulse select-none" title="敵方生命度">
              💜
            </span>
          ) : (
            <span className="text-[13px] filter grayscale-[1] brightness-[0.22] opacity-35 select-none" title="已擊破敵方生命度">
              🖤
            </span>
          )
        ) : (
          /* Player heart representations to match play HUD */
          isFilled ? (
            <span className="text-[13px] filter drop-shadow-[0_0_5px_rgba(239,68,68,0.95)] animate-pulse select-none" title="生命星印">
              ❤️
            </span>
          ) : isLocked ? (
            <span className="text-[13px] text-[#10b981] filter drop-shadow-[0_0_3px_rgba(16,185,129,0.85)] relative select-none leading-none inline-block" title="陽氣鎖定">
              ♥
            </span>
          ) : (
            <span className="text-[13px] opacity-25 select-none" title="已折損生命星印">
              🤍
            </span>
          )
        )}
      </motion.div>
    </motion.div>
  );
}

interface DifficultyConfig {
  pointerPressSpeed: number;    // press speed multiplier
  pointerReleaseSpeed: number;  // release speed multiplier
  maxJumpDistance: number;      // max distance sweetspot zone shifts
  shiftIntervalBase: number;    // base shift time in ms
  targetWidth: number;          // width % of sweetspot
  starDamage: number;           // damage per hit
  attackFrequency: number;      // countdown secs to penalty
  enemyMaxHp: number;           // health stars
  label: string;
}

const DIFFICULTIES: Record<'easy' | 'medium' | 'hard', DifficultyConfig> = {
  easy: {
    pointerPressSpeed: 160,
    pointerReleaseSpeed: 120,
    maxJumpDistance: 20,
    shiftIntervalBase: 4500,
    targetWidth: 24,
    starDamage: 1,
    attackFrequency: 1.5,
    enemyMaxHp: 3,
    label: '簡單'
  },
  medium: {
    pointerPressSpeed: 200,
    pointerReleaseSpeed: 150,
    maxJumpDistance: 40,
    shiftIntervalBase: 3500,
    targetWidth: 16,
    starDamage: 2,
    attackFrequency: 1.0,
    enemyMaxHp: 5,
    label: '中等'
  },
  hard: {
    pointerPressSpeed: 245,
    pointerReleaseSpeed: 185,
    maxJumpDistance: 70,
    shiftIntervalBase: 2200,
    targetWidth: 10,
    starDamage: 3,
    attackFrequency: 0.7,
    enemyMaxHp: 3,
    label: '困難'
  }
};

function getDifficultyByEnemyName(name: string): DifficultyConfig {
  const n = (name || '').toLowerCase();
  if (n.includes('尤幹') || n.includes('達爾朵') || n.includes('尤干') || n.includes('達爾多')) {
    return DIFFICULTIES.hard;
  }
  if (n.includes('方水玉')) {
    return DIFFICULTIES.medium;
  }
  return DIFFICULTIES.easy;
}

export default function CombatScreen({
  enemyName,
  initialHp,
  enemyImg,
  weapons,
  heldGrass,
  playerHp = 10,
  playerMaxHp = 10,
  playerEnergy = 100,
  onSpendEnergy,
  onPlayerHurt,
  onWin,
  onEscape,
  onRestartCombat,
  addLogEvent: propAddLogEvent,
}: CombatScreenProps) {
  // --- Game State Session Replicas (for clean state restart capability) ---
  const difficulty = getDifficultyByEnemyName(enemyName);
  const displayEnemyMax = difficulty.enemyMaxHp;
  const initialCombatHp = heldGrass === 6 ? 1 : playerHp;
  const [playerStars, setPlayerStars] = useState(initialCombatHp);             // 我方心臟型星星 (Combat is lost at 0)
  const [enemyStars, setEnemyStars] = useState(displayEnemyMax);               // 敵方三顆暗紅色心臟型星星
  const [localEnergy, setLocalEnergy] = useState(playerEnergy);  // 精力 (Deducted on item usages, but items are disabled)
  const [needle, setNeedle] = useState(0);                      // 0 to 100
  const [targetCenter, setTargetCenter] = useState(50);          // 15 to 85
  const [consecutiveSecs, setConsecutiveSecs] = useState(0);      // 0 to 15 (Stability overload victory)
  const [accumulatedSecs, setAccumulatedSecs] = useState(0);      // 0 to 3.0 seconds (Spectral pulse)
  const [isPressing, setIsPressing] = useState(false);            // Input active press state
  const [outOfLockSecs, setOutOfLockSecs] = useState(0);          // Countdown to star subtraction when out of alignment zone
 
  // Visual transient effects states
  const [isShifting, setIsShifting] = useState(false);            
  const [pulseHit, setPulseHit] = useState(false);                
  const [backlashFlash, setBacklashFlash] = useState(false);      
  const [shieldActive, setShieldActive] = useState(heldGrass > 0);
  const [showShieldBlock, setShowShieldBlock] = useState(false);  
  const [isWon, setIsWon] = useState(false);                      
  const [isLost, setIsLost] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // --- Real-time Combat Event Logger ---
  interface LogEvent {
    id: string;
    timestamp: string;
    text: string;
    type: string;
  }
  const [combatLog, setCombatLog] = useState<LogEvent[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLogEvent = (text: string, type: string = 'info') => {
    const timestamp = new Date().toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEvent = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp,
      text,
      type
    };
    setCombatLog((prev) => [...prev, newEvent].slice(-40)); // keep last 40 logs for smooth scrolling
    if (propAddLogEvent) {
      propAddLogEvent(text, type);
    }
  };

  // Scroll to bottom on log item updates
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [combatLog]);

  // Initial introductory combat logging on mount
  useEffect(() => {
    setCombatLog([]); 
    addLogEvent(`⚔️ 開始對位【${enemyName}】`, 'system');
    if (heldGrass > 0) {
      addLogEvent(`🛡️ 禾火草 x${heldGrass} 已就位`, 'player');
    } else {
      addLogEvent("⚠️ 未攜帶禾火草！", "alert");
    }
  }, [enemyName]);
 
  // Rollback state capturing
  const initialPlayerHpRef = useRef(playerHp);
  const initialPlayerEnergyRef = useRef(playerEnergy);
  const initialHeldGrassRef = useRef(heldGrass);
 
  useEffect(() => {
    initialPlayerHpRef.current = playerHp;
    initialPlayerEnergyRef.current = playerEnergy;
    initialHeldGrassRef.current = heldGrass;
  }, []);
 
  // Time counting for skipping battles
  useEffect(() => {
    if (isWon || isLost) return;
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isWon, isLost]);
 
  // Synchronized physics loop references to secure from state-traps
  const needleRef = useRef(0);
  const targetCenterRef = useRef(50);
  const consecutiveSecsRef = useRef(0);
  const accumulatedSecsRef = useRef(0);
  const isPressingRef = useRef(false);
  const outOfLockSecsRef = useRef(0);
  const lastAlertPlayTimeRef = useRef(0);
 
  const playerStarsRef = useRef(heldGrass === 6 ? 1 : playerHp);
  const enemyStarsRef = useRef(displayEnemyMax);
  const isWonRef = useRef(false);
  const isLostRef = useRef(false);
  const hasShieldRef = useRef(heldGrass > 0);
  const lastShiftTimeRef = useRef(Date.now());
 
  // Setup initial values to refs
  useEffect(() => {
    playerStarsRef.current = playerStars;
    enemyStarsRef.current = enemyStars;
    isWonRef.current = isWon;
    isLostRef.current = isLost;
  }, [playerStars, enemyStars, isWon, isLost]);
 
  // Helper to restart combat to from scratch state
  const handleRestartCombat = () => {
    if (isWonRef.current || isLostRef.current) return;
    // Reset React state
    setPlayerStars(initialHeldGrassRef.current === 6 ? 1 : initialPlayerHpRef.current);
    setEnemyStars(displayEnemyMax);
    setLocalEnergy(initialPlayerEnergyRef.current);
    setNeedle(0);
    setTargetCenter(50);
    setConsecutiveSecs(0);
    setAccumulatedSecs(0);
    setIsPressing(false);
    setOutOfLockSecs(0);
    setShieldActive(initialHeldGrassRef.current > 0);
    setIsWon(false);
    setIsLost(false);
    setSecondsElapsed(0);
    setCombatLog([]);
 
    // Reset physics Refs
    needleRef.current = 0;
    targetCenterRef.current = 50;
    consecutiveSecsRef.current = 0;
    accumulatedSecsRef.current = 0;
    isPressingRef.current = false;
    outOfLockSecsRef.current = 0;
    lastAlertPlayTimeRef.current = 0;
    playerStarsRef.current = initialHeldGrassRef.current === 6 ? 1 : initialPlayerHpRef.current;
    enemyStarsRef.current = displayEnemyMax;
    isWonRef.current = false;
    isLostRef.current = false;
    hasShieldRef.current = initialHeldGrassRef.current > 0;
    lastShiftTimeRef.current = Date.now();
 
    // Reset parent/global state
    if (onRestartCombat) {
      onRestartCombat(initialPlayerHpRef.current, initialPlayerEnergyRef.current, initialHeldGrassRef.current);
    }

    addLogEvent("🔄 戰鬥已重置", 'system');
    if (initialHeldGrassRef.current > 0) {
      addLogEvent(`🛡️ 禾火草已重置 (x${initialHeldGrassRef.current})`, 'player');
    }
  };

  const TARGET_WIDTH = difficulty.targetWidth; // Width % of target alignment block

  // Polar helper coordinates: 180 degrees is Left, 0/360 degrees is Right.
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY - radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    // Standard semi-circle SVG builder
    const start = polarToCartesian(x, y, radius, startAngle);
    const end = polarToCartesian(x, y, radius, endAngle);
    return [
      'M', start.x, start.y,
      'A', radius, radius, 0, 0, 1, end.x, end.y
    ].join(' ');
  };

  // Physics animation frame loop (60 FPS)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const gameLoop = (time: number) => {
      if (isWonRef.current || isLostRef.current) {
        // Keep loop ticking so if we restart, it can resume!
        lastTime = time;
        animId = requestAnimationFrame(gameLoop);
        return;
      }
      const dt = Math.min(0.04, (time - lastTime) / 1000); 
      lastTime = time;

      // 1. Move Voltage Pointer needle from Left to Right based on hold/press states
      if (isPressingRef.current) {
        needleRef.current += difficulty.pointerPressSpeed * dt;
      } else {
        needleRef.current -= difficulty.pointerReleaseSpeed * dt;
      }
      needleRef.current = Math.max(0, Math.min(100, needleRef.current));

      // 2. Alignment detection
      const halfWidth = TARGET_WIDTH / 2;
      const minTarget = targetCenterRef.current - halfWidth;
      const maxTarget = targetCenterRef.current + halfWidth;
      const isInside = needleRef.current >= minTarget && needleRef.current <= maxTarget;

      // 3. Consecutive stability victory meter
      if (isInside) {
        consecutiveSecsRef.current = Math.min(15.0, consecutiveSecsRef.current + dt);
      } else {
        consecutiveSecsRef.current = Math.max(0, consecutiveSecsRef.current - dt * 2.8);
      }

      // Check if player held lock for 15s continuously
      if (consecutiveSecsRef.current >= 15.0) {
        isWonRef.current = true;
        setIsWon(true);
        setEnemyStars(0);
        playEnemyDeathSound();
        playVictorySound();
        addLogEvent("✨ 完美鎖定 15 秒，淨化勝利！", "success");
        setTimeout(() => {
          onWin();
        }, 1500);
      }

      // 4. Core Star System timing and penalties
      if (isInside) {
        // Reset 1-second warning timer when needle is aligned
        outOfLockSecsRef.current = 0;

        // Populate accumulated spectral pulse towards enemy star break
        accumulatedSecsRef.current += dt;
        if (accumulatedSecsRef.current >= 3.0) {
          accumulatedSecsRef.current = Math.max(0, accumulatedSecsRef.current - 3.0);
          
          let dmg = 1;
          if (heldGrass === 5) {
            dmg = 2;
          } else if (heldGrass === 6) {
            dmg = 3;
          }
          const nextEnemyStars = Math.max(0, enemyStarsRef.current - dmg);
          enemyStarsRef.current = nextEnemyStars;
          setEnemyStars(nextEnemyStars);
          setPulseHit(true);
          if (heldGrass === 5) {
            addLogEvent(`⚔️ 禾火草攻勢上升：${enemyName}受到 2 倍重擊，攻擊敵人一次扣兩顆敵人的星星！`, "success");
          } else if (heldGrass === 6) {
            addLogEvent(`⚔️ 禾火草極陽狂暴：${enemyName}受到 3 倍重擊，攻擊敵人一次扣三顆敵人的星星！`, "success");
          } else {
            addLogEvent(`⚔️ ${enemyName}失去一顆星星`, "success");
          }
          setTimeout(() => setPulseHit(false), 440);

          if (nextEnemyStars <= 0) {
            isWonRef.current = true;
            setIsWon(true);
            playEnemyDeathSound();
            playVictorySound();
            addLogEvent(`🎉 ${enemyName}已消散`, "success");
            setTimeout(() => {
              onWin();
            }, 1500);
          } else {
            playEnemyHurtSound();
          }
        }
      } else {
        // Needle is out of zone! Accumulate warning decay towards Player Star loss
        outOfLockSecsRef.current += dt;

        // Sound trigger logic for low HP countdown indicators
        if (!isWonRef.current && !isLostRef.current) {
          const nowMs = Date.now();
          const threshold = difficulty.attackFrequency;
          if (outOfLockSecsRef.current >= threshold * 0.8) {
            // Countdown <= 20% of window: play rapid warning beeps
            if (nowMs - lastAlertPlayTimeRef.current >= 150) {
              lastAlertPlayTimeRef.current = nowMs;
              playCockpitWarningSound();
            }
          } else if (outOfLockSecsRef.current >= threshold * 0.5) {
            // Countdown <= 50% of window: play low heartbeat sound
            if (nowMs - lastAlertPlayTimeRef.current >= 380) {
              lastAlertPlayTimeRef.current = nowMs;
              playHeartbeatSound();
            }
          }
        }

        if (outOfLockSecsRef.current >= difficulty.attackFrequency) {
          outOfLockSecsRef.current = 0; // reset for next tick
          
          setBacklashFlash(true);
          setTimeout(() => setBacklashFlash(false), 450);

          if (hasShieldRef.current) {
            // Protect player's star from the very first impact slot using Grass
            hasShieldRef.current = false;
            setShieldActive(false);
            setShowShieldBlock(true);
            addLogEvent("🛡️ 禾火草替你阻擋攻擊", "player");
            setTimeout(() => setShowShieldBlock(false), 2200);
            onPlayerHurt(-100); // trigger shield burst inside App.tsx
          } else {
            // Suffer dynamic star damage from difficulty configurations
            const damage = difficulty.starDamage;
            const nextPlayerStars = Math.max(0, playerStarsRef.current - damage);
            playerStarsRef.current = nextPlayerStars;
            setPlayerStars(nextPlayerStars);
            addLogEvent(`💥 你受到反擊，失去 ${damage} 顆生命星印！`, "enemy");

            // Subtract from user's global HP representation
            onPlayerHurt(damage);

            if (nextPlayerStars <= 0) {
              isLostRef.current = true;
              setIsLost(true);
              playPlayerDeathSound();
              addLogEvent("☠ 護命星印皆毀，敗北！", "enemy");
              // Deal final fatal impact after a short delay
              setTimeout(() => {
                onPlayerHurt(10);
              }, 800);
            } else {
              playPlayerHurtSound();
            }
          }
        }
      }

      // 5. Dial target shift frequency depending on remaining enemy stars
      const starRatio = enemyStarsRef.current / displayEnemyMax;
      let shiftInterval = difficulty.shiftIntervalBase; 
      if (starRatio <= 0.67 && starRatio > 0.34) {
        shiftInterval = Math.floor(difficulty.shiftIntervalBase * 0.55);   
      } else if (starRatio <= 0.34) {
        shiftInterval = Math.floor(difficulty.shiftIntervalBase * 0.22);    
      }

      const now = Date.now();
      if (now - lastShiftTimeRef.current >= shiftInterval) {
        lastShiftTimeRef.current = now;
        
        // Dynamic shift jump limits depending on difficulty limits
        const currentCenter = targetCenterRef.current;
        const maxJump = difficulty.maxJumpDistance;
        const sign = Math.random() < 0.5 ? -1 : 1;
        const jump = Math.floor(Math.random() * (maxJump - 5)) + 5; // jump at least 5 units
        let newCenter = currentCenter + sign * jump;
        
        const minLimit = 17;
        const maxLimit = 83;
        if (newCenter < minLimit || newCenter > maxLimit) {
          // If out of bounds or too close to wall, flip the direction
          newCenter = currentCenter - sign * jump;
        }
        
        newCenter = Math.max(minLimit, Math.min(maxLimit, newCenter));
        targetCenterRef.current = newCenter;
        
        setIsShifting(true);
        if (shiftInterval >= 1500) {
          addLogEvent("🌀 對位區已偏移", "alert");
        }
        setTimeout(() => setIsShifting(false), 250);
      }

      // Push physics logs back to component rendering
      setNeedle(needleRef.current);
      setTargetCenter(targetCenterRef.current);
      setConsecutiveSecs(consecutiveSecsRef.current);
      setAccumulatedSecs(accumulatedSecsRef.current);
      setOutOfLockSecs(outOfLockSecsRef.current);

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Keyboard Spacebar input listener triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Safe guard when input fields / game configurations are actively typing
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (isWonRef.current || isLostRef.current) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        isPressingRef.current = true;
        setIsPressing(true);
      } else if (e.key.toLowerCase() === 'e') {
        if (onEscape) {
          e.preventDefault();
          onEscape();
        }
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleRestartCombat();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        isPressingRef.current = false;
        setIsPressing(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onEscape]);

  const handlePointerDown = () => {
    isPressingRef.current = true;
    setIsPressing(true);
  };

  const handlePointerUp = () => {
    isPressingRef.current = false;
    setIsPressing(false);
  };

  // Math helper vectors for the enlarged center dial pointer gauge
  const dialRadius = 140; 
  const dialCX = 160; 
  const dialCY = 150; 

  const angleRange = 180; 
  // Pointer starts on left: needle = 0 is angle 180 (left), needle = 100 is angle 0 (right).
  const currentNeedleAngle = 180 - (needle / 100) * angleRange;

  const targetMinPct = targetCenter - TARGET_WIDTH / 2;
  const targetMaxPct = targetCenter + TARGET_WIDTH / 2;
  const isAligned = needle >= targetMinPct && needle <= targetMaxPct;

  // Track arc goes clockwise from 180 (left) to 0 (right)
  const trackArcD = describeArc(dialCX, dialCY, dialRadius, 180, 0);

  // Target slot arc goes clockwise from start space (min pct) to end space (max pct)
  const targetArcD = describeArc(
    dialCX, 
    dialCY, 
    dialRadius, 
    180 - (targetMinPct / 100) * angleRange, 
    180 - (targetMaxPct / 100) * angleRange
  );

  const needlePointerPt = polarToCartesian(dialCX, dialCY, dialRadius - 15, currentNeedleAngle);

  // Status feedback texts
  const getDialBannerStatusText = () => {
    if (isWon) return '🎉 戰役勝出！怨靈正在消散淨化！';
    if (isLost) return '☠ 護命星印皆毀，精神支撐崩陷……';
    if (showShieldBlock) return '🛡️ 禾火草防禦生效！';
    if (isAligned) return '⚡ 完美對位！心靈共鳴充能中';
    if (outOfLockSecs > 0) return `⚠️ 指針偏離對位！失血倒數 ${Math.max(0, 1.0 - outOfLockSecs).toFixed(2)}s`;
    return '💡 控制指針停留在綠色對位區！';
  };

  return (
    <div id="combat-screen" className="fixed inset-0 z-40 bg-[#080206] text-[#ebd9c5] font-serif select-none flex flex-col justify-between p-4 md:p-6 overflow-hidden">
      
      {/* Background vignette elements underlay */}
      <div className="absolute inset-x-0 inset-y-0 w-full h-full pointer-events-none z-0">
        <img
          src={enemyImg}
          alt="Combat Arena Background underlay"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-[0.06] filter blur-[4px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,10,35,0.22)_0%,rgba(6,2,6,0.98)_100%)]" />
      </div>

      {/* Screen flash feedback layer */}
      <AnimatePresence>
        {backlashFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-955 z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 1. TOP HEADER STATUS BOARD */}
      <header className="relative z-10 w-full flex items-center justify-between border-b border-[#3c1e2f]/50 pb-3 select-none">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
          <span className="text-[11px] font-sans font-bold tracking-[0.25em] text-[#f43f5e] uppercase">
            魔王生死之役 · 八卦山抗日古戰場 (電腦控制端)
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400">
          <span>靈能感知已連線</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
      </header>

      {/* 2. THREE-COLUMN DESKTOP SCREEN LAYOUT */}
      <main className="relative z-10 grid grid-cols-12 gap-5 w-full max-w-6xl mx-auto flex-1 items-center py-4">
        
        {/* ==================== LEFT COLUMN: OUR HUD STATE ==================== */}
        <section className="col-span-3 flex flex-col gap-4 h-full justify-center relative">
          <div className="bg-[#12050f]/85 border border-[#3e1d32]/60 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.7)] flex flex-col gap-3.5 min-h-[360px] h-auto pb-4 justify-between relative overflow-hidden">
            <div>
              <div className="border-b border-[#3e1d32]/35 pb-2 mb-3">
                <span className="text-[9px] font-sans font-black tracking-widest text-[#fbbf24] uppercase">
                  我方
                </span>
                <h3 className="text-base font-black text-amber-100 tracking-wide mt-0.5">
                  主角一行人(You)
                </h3>
              </div>

              {/* 生命值 (Dynamic Heart representing player life, max 30) */}
              <div className="flex flex-col gap-1 mb-2">
                <div className="flex justify-between text-[11px] font-sans text-zinc-400 font-bold">
                  <span>生命值</span>
                  <span className="font-mono text-red-500 font-black">{playerStars} / {playerMaxHp}</span>
                </div>
                <div className="grid grid-cols-10 gap-x-[1px] gap-y-[1px] bg-black/40 py-2 px-1 rounded-xl border border-red-950/30 justify-items-center max-w-[260px] mx-auto w-full">
                  {Array.from({ length: playerMaxHp }).map((_, i) => {
                    let localLockedCount = 0;
                    if (heldGrass === 4) {
                      localLockedCount = 10;
                    } else if (heldGrass === 5) {
                      localLockedCount = Math.ceil(playerMaxHp / 2);
                    } else if (heldGrass === 6) {
                      localLockedCount = playerMaxHp - 1;
                    }
                    const isFilled = i < playerStars;
                    const isLocked = !isFilled && (i < playerStars + localLockedCount);
                    return (
                      <StarCell
                        key={`player-red-star-${i}`}
                        isFilled={isFilled}
                        isLocked={isLocked}
                        isEnemy={false}
                        delayIndex={i}
                      />
                    );
                  })}
                </div>
              </div>

              {/* 精力 (Energy Bar - renamed from 電力精力 and colored green instead of blue) */}
              <div className="flex flex-col gap-1 mb-3">
                <div className="flex justify-between text-[10px] font-sans text-zinc-400">
                  <span>精力</span>
                  <span className={`font-mono font-bold transition-colors duration-300 ${
                    localEnergy < 30 
                      ? 'text-red-400' 
                      : 'text-emerald-400'
                  }`}>{localEnergy}%</span>
                </div>
                <motion.div 
                  className={`w-full h-3 bg-black/50 rounded overflow-hidden p-[1px] transition-all duration-300 border ${
                    localEnergy < 30 
                      ? 'border-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]' 
                      : 'border-zinc-800'
                  }`}
                  animate={(localEnergy < 30) ? {
                    borderColor: [
                      "rgba(239, 68, 68, 0.4)",
                      "rgba(239, 68, 68, 1.0)",
                      "rgba(239, 68, 68, 0.4)"
                    ],
                    boxShadow: [
                      "0 0 2px rgba(239, 68, 68, 0.25)",
                      "0 0 10px rgba(239, 68, 68, 0.75)",
                      "0 0 2px rgba(239, 68, 68, 0.25)"
                    ]
                  } : {}}
                  transition={(localEnergy < 30) ? {
                    repeat: Infinity,
                    duration: 2.0,
                    ease: "easeInOut"
                  } : undefined}
                >
                  <motion.div
                    className={`h-full bg-gradient-to-r ${
                      localEnergy < 30
                        ? 'from-red-600 via-rose-500 to-orange-500'
                        : 'from-emerald-600 via-teal-500 to-emerald-400'
                    }`}
                    animate={{ width: `${localEnergy}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              </div>

              {/* 禾火草 count */}
              <div className="flex justify-between items-center bg-orange-950/25 border border-orange-700/35 px-3 py-1.5 rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-orange-300 font-bold">禾火草</span>
                </div>
                <span className="font-mono font-black text-orange-400">{heldGrass} / 6</span>
              </div>
            </div>

            {/* Shield block overlay feedback for player */}
            <AnimatePresence>
              {showShieldBlock && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-orange-955/95 z-30 flex flex-col items-center justify-center text-center p-2 border border-orange-550 rounded-2xl"
                >
                  <Shield className="w-10 h-10 text-orange-500 animate-bounce" />
                  <span className="text-xs font-black text-orange-100 mt-2">禾火草</span>
                  <span className="text-[9px] text-orange-300 mt-1">神聖能量抵擋傷害！</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ================ ACTIVE TACTICAL COOKWARE PANEL (Passive/Display mode) ================ */}
          <div className="bg-[#12050f]/85 border border-[#3e1d32]/60 rounded-2xl p-4 flex flex-col gap-2 w-full mt-3">
            <span className="text-[9px] font-sans font-bold tracking-widest text-[#fbbf24] flex items-center gap-1">
              <Sword className="w-3" />
              戰裝備道具袋
            </span>
            
            {/* Wooden stick weapon */}
            <div className="w-full py-2 px-3 rounded-lg border border-amber-900/35 bg-amber-950/15 text-amber-200 text-xs flex justify-between items-center opacity-85">
              <span>🪵 廚房木棍 (已配備)</span>
            </div>

            {/* Cookpot cookware weapon status */}
            {weapons.includes('鐵鍋') && (
              <div className="w-full py-2 px-3 rounded-lg border border-rose-900/40 bg-zinc-950/40 text-rose-300 text-xs flex justify-between items-center">
                <span>🍳 食堂大鐵鍋 (已配備)</span>
              </div>
            )}

            {/* Ritual sword weapon status */}
            {(weapons.includes('儀仗劍') || weapons.some(w => w.includes('儀仗'))) && (
              <div className="w-full py-2 px-3 rounded-lg border border-cyan-900/40 bg-cyan-950/20 text-cyan-300 text-xs flex justify-between items-center">
                <span>🗡️ 儀仗劍 (已配備)</span>
              </div>
            )}

            {/* Rusty Katana weapon status */}
            {(weapons.includes('生鏽武士刀') || weapons.some(w => w.includes('武士刀'))) && (
              <div className="w-full py-2 px-3 rounded-lg border border-emerald-900/40 bg-emerald-950/20 text-emerald-300 text-xs flex justify-between items-center border-[1.5px]">
                <span>⚔️ 生鏽武士刀 (已配備)</span>
              </div>
            )}

            {/* Cloud Purple bone fan weapon status */}
            {(weapons.includes('雲紫骨扇') || weapons.some(w => w.includes('骨扇') || w.includes('雲紫'))) && (
              <div className="w-full py-2 px-3 rounded-lg border border-purple-900/45 bg-purple-950/25 text-purple-300 text-xs flex justify-between items-center border-2 animate-pulse">
                <span>🪭 雲紫骨扇 (精裝武器 · 已配備)</span>
              </div>
            )}
          </div>
        </section>

        {/* ==================== CENTER COLUMN: THE MAIN ENLARGED GAUGE ARENA ==================== */}
        <section className="col-span-6 flex flex-col items-center justify-center gap-2 text-center">
          
          {/* Dial warning count overlay */}
          <div className="w-full relative py-5 px-6 border-2 border-[#3c172d]/70 bg-[#140413]/94 rounded-3xl shadow-[inset_0_2px_25px_rgba(0,0,0,0.9),0_12px_45px_rgba(0,0,0,0.8)] flex flex-col items-center">
            
            {/* Status light line */}
            <div className="flex justify-between items-center w-full max-w-md px-1 select-none font-mono text-[10px] tracking-wider mb-2">
              <span className="text-[#8b7869] font-bold">對位穩定度: {Math.round((consecutiveSecs / 15) * 100)}%</span>
              <span className={isAligned ? 'text-teal-400 font-bold animate-pulse' : 'text-rose-500 font-bold'}>
                {isAligned ? '🟢 已鎖定' : '🔴 未對位'}
              </span>
            </div>

            {/* SUPER ENLARGED DIAL POINTER GAUGE */}
            <div id="enlarged-gauge-view" className="relative w-full max-w-md h-52 flex items-center justify-center overflow-hidden bg-[#0a0209]/60 rounded-2xl border border-[#2d0a1f]/40 px-2 pt-4 shadow-inner">
              <svg className="w-full h-full" viewBox="0 0 320 160">
                <defs>
                  {/* Glowing shader neon grad */}
                  <radialGradient id="alignedTargetGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
                  </radialGradient>
                  {/* Needle needle grad */}
                  <linearGradient id="cyberNeedleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                {/* Arc Track */}
                <path
                  d={trackArcD}
                  fill="none"
                  stroke="#220b1b"
                  strokeWidth="15"
                  strokeLinecap="round"
                />

                {/* Target Locked Zone */}
                {!isWon && !isLost && (
                  <path
                    d={targetArcD}
                    fill="none"
                    stroke={isShifting ? '#ef4444' : '#14b8a6'}
                    strokeWidth="15"
                    strokeLinecap="round"
                    className="transition-colors duration-150"
                    style={{
                      filter: isShifting 
                        ? 'drop-shadow(0 0 12px rgba(239,68,68,0.95))' 
                        : 'drop-shadow(0 0 10px rgba(20,184,166,0.85))'
                    }}
                  />
                )}

                {/* Scale divisions ticks */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((t) => {
                  const tickAngle = 180 - (t / 100) * angleRange;
                  const innerPt = polarToCartesian(dialCX, dialCY, dialRadius - 16, tickAngle);
                  const outerPt = polarToCartesian(dialCX, dialCY, dialRadius - 8, tickAngle);
                  return (
                    <line
                      key={`sc-tick-${t}`}
                      x1={innerPt.x}
                      y1={innerPt.y}
                      x2={outerPt.x}
                      y2={outerPt.y}
                      stroke="#4d1b39"
                      strokeWidth="2"
                    />
                  );
                })}

                {/* Status warning rendered inside pointer ring */}
                {outOfLockSecs > 0 && !isWon && !isLost && (
                  <g>
                    <circle cx={dialCX} cy={dialCY} r="65" fill="none" stroke="#ef4444" strokeWidth="2" className="animate-pulse opacity-30" />
                    <text x={dialCX} y={dialCY - 45} textAnchor="middle" fill="#f87171" className="text-[10px] font-sans font-bold tracking-widest fill-red-400">
                      ⚠️ 脫離對位
                    </text>
                  </g>
                )}

                {/* Ultra Enlarged pointer needle */}
                {!isWon && !isLost && (
                  <motion.line
                    x1={dialCX}
                    y1={dialCY}
                    x2={needlePointerPt.x}
                    y2={needlePointerPt.y}
                    stroke="url(#cyberNeedleGrad)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    style={{
                      filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.9))'
                    }}
                  />
                )}

                {/* Base center Spindle Pin */}
                <circle cx={dialCX} cy={dialCY} r="105" fill="none" stroke="#2a0d22" strokeWidth="1" strokeDasharray="3,3" className="opacity-40" />
                <circle cx={dialCX} cy={dialCY} r="10" fill="#fbbf24" stroke="#00000 black" strokeWidth="3" />
              </svg>
            </div>

            {/* Warning Countdown overlay directly below pointer container */}
            <div className="w-full min-h-[38px] flex items-center justify-center mt-2 select-none">
              <AnimatePresence>
                {outOfLockSecs > 0 && !isWon && !isLost && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="px-4 py-1 bg-red-955/90 border border-red-500/40 rounded-lg text-red-400 text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                  >
                    <span className="animate-pulse font-sans">失血倒數 :</span>
                    <span className="text-white bg-red-900/60 px-2 py-0.5 rounded text-sm tracking-widest font-mono">
                      {Math.max(0, 1.0 - outOfLockSecs).toFixed(2)}s
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dynamic Alignment feedback ticker */}
            <div className="w-full mt-1 flex justify-between items-center text-[10px] font-mono select-none px-2 text-zinc-400 border-t border-zinc-950 pt-2.5">
              <span>指針偏振值 : {Math.round(needle)}V</span>
              <span>版本 V12.5</span>
            </div>
          </div>
        </section>

        {/* ==================== RIGHT COLUMN: THE BOSS STATE CARD ==================== */}
        <section className="col-span-3 flex flex-col gap-4 h-full justify-center relative">
          <div className="bg-[#12050f]/85 border border-rose-955/60 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.7)] flex flex-col gap-3 h-[360px] justify-between relative overflow-hidden">
            <div>
              <div className="border-b border-rose-950/50 pb-2 mb-3">
                <span className="text-[9px] font-sans font-black tracking-widest text-[#ef4444] uppercase">
                  敵方
                </span>
                <h3 className="text-base font-black text-rose-200 tracking-wide mt-0.5 flex items-center gap-2">
                  {enemyName}
                  <span className={`text-[9px] font-sans px-1.5 py-0.5 rounded border leading-none font-bold ${
                    difficulty.label === '簡單' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    difficulty.label === '中等' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                    'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    {difficulty.label}
                  </span>
                </h3>
              </div>

              {/* Profile Cutout Image of the boss */}
              <div className="relative w-full h-24 bg-black/90 rounded-xl border border-red-950/50 overflow-hidden flex items-center justify-center mb-3">
                <CutoutImage
                  src={enemyImg}
                  alt={enemyName}
                  className={`w-full h-full object-cover object-top transition-transform duration-300 ${
                    pulseHit ? 'scale-105 saturate-150 brightness-110' : 'scale-100 saturate-50 brightness-85'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10030c] via-transparent to-transparent pointer-events-none" />

                {/* Backlash Skull Overlay feed representation for boss grass */}
                <AnimatePresence>
                  {showShieldBlock && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-orange-955/95 z-30 flex flex-col items-center justify-center text-center p-2 border border-orange-550 rounded-xl"
                    >
                      <span className="text-orange-500 text-4xl animate-pulse">💀</span>
                      <span className="text-xs font-black text-orange-200 mt-2">禾火草</span>
                      <span className="text-[9px] text-orange-400 mt-0.5">傷害反噬已格擋！</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Enemy Narrative cards */}
              <div className="bg-black/40 p-2 rounded-lg border border-red-950/30 text-[11px] flex flex-col gap-1 select-none font-sans leading-snug mb-3">
                <div className="flex justify-between">
                  <span className="text-zinc-500">戰役:</span>
                  <span className="text-red-400 font-bold">歷史戰役</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">地點:</span>
                  <span className="text-zinc-300">八卦山古戰場</span>
                </div>
              </div>

              {/* 敵方生命值 (3 coagulated-blood dark purple Hearts) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[11px] text-purple-300 font-sans font-bold tracking-wide">
                  <span>生命值</span>
                  <span className="font-mono text-purple-400 font-black text-xs">
                    ({enemyStars}/{displayEnemyMax})
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5 bg-black/40 py-2 px-1 rounded-xl border border-purple-950/45 max-w-[260px] mx-auto w-full">
                  {Array.from({ length: displayEnemyMax }).map((_, i) => {
                    const active = i < enemyStars;
                    return (
                      <StarCell
                        key={`enemy-star-${i}`}
                        isFilled={active}
                        isEnemy={true}
                        delayIndex={i}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 3. BOTTOM DIALOGUE BAR AREA (MOUSE/SPACE BUTTON & CHARGE METER) */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto flex flex-col gap-2 bg-[#12040f]/90 border border-[#3e1d32]/50 p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.85)]">
        
        {/* Dynamic Log Textbox Banner status logs */}
        <div className="text-[11px] font-sans text-rose-300/90 text-center h-5 flex items-center justify-center leading-none">
          <motion.p
            key={getDialBannerStatusText()}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            className="truncate font-sans"
          >
            {getDialBannerStatusText()}
          </motion.p>
        </div>

        {/* Dynamic Pulse Charge Meter (能量蓄積條 - Left: 能量條, Center: 將指針維持在範圍內已蓄積能量, Right: 蓄積百分比) */}
        <div className="flex flex-col gap-1.5 pb-2 select-none w-full border-t border-zinc-950/40 pt-2.5">
          <div className="flex justify-between items-center text-[10.5px] font-sans text-amber-200 font-bold w-full px-1">
            <span className="flex items-center gap-1">⚡ 完美的對位蓄積：{(consecutiveSecs).toFixed(1)} / 15.0s</span>
            <span className="text-zinc-400 font-sans font-medium">將指針維持在綠色範圍內！(蓄滿 3 秒打擊敵方生命)</span>
            <span className={`font-mono font-bold transition-colors duration-300 ${
              ((accumulatedSecs / 3.0) * 100) < 30 
                ? 'text-red-400' 
                : ((accumulatedSecs / 3.0) * 100) < 50 
                ? 'text-amber-400' 
                : 'text-amber-300'
            }`}>
              {Math.min(100, Math.round((accumulatedSecs / 3.0) * 100))}%
            </span>
          </div>
          <motion.div 
            className={`w-full h-3 bg-[#080106] rounded-full overflow-hidden p-[1px] shadow-inner border transition-all duration-300 ${
              ((accumulatedSecs / 3.0) * 100) < 30
                ? 'border-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                : 'border-zinc-800'
            }`}
            animate={(((accumulatedSecs / 3.0) * 100) < 30) ? {
              borderColor: [
                "rgba(239, 68, 68, 0.4)",
                "rgba(239, 68, 68, 1.0)",
                "rgba(239, 68, 68, 0.4)"
              ],
              boxShadow: [
                "0 0 2px rgba(239, 68, 68, 0.25)",
                "0 0 10px rgba(239, 68, 68, 0.65)",
                "0 0 2px rgba(239, 68, 68, 0.25)"
              ]
            } : {}}
            transition={(((accumulatedSecs / 3.0) * 100) < 30) ? {
              repeat: Infinity,
              duration: 2.2,
              ease: "easeInOut"
            } : undefined}
          >
            <motion.div
              className={`h-full bg-gradient-to-r shadow-[0_0_8px_rgba(52,211,153,0.5)] ${
                ((accumulatedSecs / 3.0) * 100) < 30 
                  ? "from-red-600 via-rose-500 to-orange-400" 
                  : ((accumulatedSecs / 3.0) * 100) < 50 
                  ? "from-yellow-500 via-amber-400 to-yellow-300" 
                  : "from-emerald-500 via-teal-400 to-amber-300"
              }`}
              style={{ width: `${(accumulatedSecs / 3.0) * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>
        </div>

        {/* TACTILE HOLD/PRESS CONTROLLER BUTTON */}
        <button
          onMouseDown={handlePointerDown}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={(e) => { e.preventDefault(); handlePointerDown(); }}
          onTouchEnd={(e) => { e.preventDefault(); handlePointerUp(); }}
          disabled={isWon || isLost}
          className={`w-full py-4 rounded-xl font-black font-sans uppercase tracking-[0.3em] text-xs relative overflow-hidden transition-all select-none cursor-pointer border ${
            isWon || isLost
              ? 'bg-zinc-950/90 border-zinc-900 text-zinc-640 cursor-not-allowed'
              : isPressing
              ? 'bg-gradient-to-r from-yellow-300 via-orange-500 to-amber-600 text-white shadow-[0_0_35px_rgba(245,158,11,0.95)] border-yellow-300 scale-[0.99]'
              : 'bg-gradient-to-r from-[#421d0a] via-[#1a0c04] to-[#421d0a] text-yellow-300 border-yellow-700/60 hover:border-yellow-200 hover:text-yellow-100 shadow-[0_0_20px_rgba(234,179,8,0.25)]'
          }`}
        >
          {isPressing && (
            <span className="absolute inset-x-0 top-0 h-full bg-orange-400/25 animate-pulse pointer-events-none" />
          )}
          {isWon 
            ? '🏆 戰役勝利' 
            : isLost 
            ? '☠ 護命星印皆毀，精神支撐崩陷……' 
            : isPressing 
            ? '⚡ 正在全力按壓充能中' 
            : '⚪ 滑鼠按住此按鈕 或 長按 [空白鍵] 控制指針 ⚪'}
        </button>
      </footer>

      {/* 4. EXTREME SIDE NAVIGATION CONTROLS */}
      <div className="absolute bottom-6 right-6 z-20 font-sans flex flex-col items-end gap-2.5">
        {/* Escape combat option if provided */}
        {onEscape && (
          <button
            onClick={onEscape}
            className="w-28 px-3 py-2 rounded-xl bg-[#221010]/95 border border-red-950/70 hover:border-red-500/80 hover:bg-[#341414] text-red-350 hover:text-white font-sans font-black text-[11px] shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            title="逃離這場戰鬥 (E)"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>逃離戰鬥 (E)</span>
          </button>
        )}

        {/* Top: 重新開始 */}
        <button
          onClick={handleRestartCombat}
          className="w-28 px-3 py-2 rounded-xl bg-[#291705]/95 border border-yellow-800/60 hover:border-yellow-400 hover:bg-[#3b230a] text-yellow-500 hover:text-white font-sans font-black text-[11px] shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          title="戰鬥重新從頭開始 (R)"
        >
          <RotateCcw className="w-3.5 h-3.5 text-yellow-500" />
          <span>重新開始 (R)</span>
        </button>
      </div>

    </div>
  );
}
