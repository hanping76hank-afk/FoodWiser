/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, ChevronRight, HelpCircle, AlertTriangle } from 'lucide-react';

import { GameState, DialogueStep, SceneType } from './types';
import { GAME_STAGES, CHAR_IMG, CHAR_COLOR, IMG, WEAPONS_DATA } from './data';

// Import modular components
import TitleScreen from './components/TitleScreen';
import HUD from './components/HUD';
import FoodScreen from './components/FoodScreen';
import CombatScreen from './components/CombatScreen';
import BattleLogger, { LogEvent } from './components/BattleLogger';
import ScanPopup from './components/ScanPopup';
import GrassPopup from './components/GrassPopup';
import InventoryPanel from './components/InventoryPanel';
import GameOverScreen from './components/GameOverScreen';
import CutoutImage from './components/CutoutImage';
import { 
  playClickSound, 
  playVictorySound, 
  playSparkleSound,
  setSfxEnabled,
  setBgmEnabled,
  startBgmSound,
  stopBgmSound,
  playCockpitWarningSound,
  playHeartbeatSound,
  playBgm
} from './utils/audio';

export default function App() {
  // Global settings state synced with persistence
  const [settings, setSettings] = useState(() => {
    let dev = 'pc-16-9';
    let port = false;
    let sfx = true;
    let bgm = true;
    let fs = 'medium';
    let tw = true;
    let uis = 'medium';    // UI Scaling (small / medium / large)
    let bga = true;        // Background image panning/zoom animation enabled

    if (typeof window !== 'undefined') {
      try {
        dev = localStorage.getItem('game_device_ratio') || 'pc-16-9';
        port = localStorage.getItem('game_is_portrait') === 'true';
        sfx = localStorage.getItem('game_sfx_enabled') !== 'false';
        bgm = localStorage.getItem('game_bgm_enabled') !== 'false';
        fs = localStorage.getItem('game_font_size') || 'medium';
        tw = localStorage.getItem('game_typewriter_enabled') !== 'false';
        uis = localStorage.getItem('game_ui_scale') || 'medium';
        bga = localStorage.getItem('game_bganim_enabled') !== 'false';
      } catch (e) {}
    }
    return {
      deviceRatio: dev,
      isPortrait: port,
      bgmOn: bgm,
      sfxOn: sfx,
      fontSize: fs,
      typewriterOn: tw,
      uiScale: uis,
      bgAnimOn: bga,
    };
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [assetStatus, setAssetStatus] = useState<any>(null);
  const [showAssetDetails, setShowAssetDetails] = useState(false);
  const [activeAssetType, setActiveAssetType] = useState<'bgm' | 'image'>('bgm');

  const fetchAssetStatus = async () => {
    try {
      const res = await fetch('/api/assets-status');
      const data = await res.json();
      if (data && data.success) {
        setAssetStatus(data);
      }
    } catch (e) {
      console.error("Failed to query asset cache status:", e);
    }
  };

  useEffect(() => {
    if (isSettingsOpen) {
      fetchAssetStatus();
      const interval = setInterval(fetchAssetStatus, 2500);
      return () => clearInterval(interval);
    }
  }, [isSettingsOpen]);

  const triggerAssetSync = async () => {
    try {
      playClickSound();
      await fetch('/api/assets-sync', { method: 'POST' });
      fetchAssetStatus();
    } catch (e) {
      console.error("Error triggering asset sync:", e);
    }
  };

  // Background random ambient state (for overall/local brightness, zoom panning focus)
  const [bgStyleState, setBgStyleState] = useState({
    brightness: 1.0,     // 0.85 to 1.15
    spotlightX: 50,      // focal center x% (20% - 80%)
    spotlightY: 50,      // focal center y% (20% - 80%)
    spotlightRadius: 40, // spotlight radius %
    scale: 1.03,         // zoom factor (1.02 to 1.10)
    translateX: 0,       // pan x offset % (-3% to 3%)
    translateY: 0,       // pan y offset % (-3% to 3%)
    spotlightAlpha: 0.3  // opacity of dark overlay vignette
  });

  const randomizeBackgroundStyle = () => {
    const brightness = 0.82 + Math.random() * 0.3; // 0.82 to 1.12
    const spotlightX = 20 + Math.random() * 60; // 20% to 80%
    const spotlightY = 20 + Math.random() * 60; // 20% to 80%
    const spotlightRadius = 30 + Math.random() * 25; // 30% to 55%
    const scale = 1.02 + Math.random() * 0.08; // 1.02 to 1.10
    const translateX = (Math.random() - 0.5) * 6; // -3% to 3%
    const translateY = (Math.random() - 0.5) * 6; // -3% to 3%
    const spotlightAlpha = 0.2 + Math.random() * 0.25; // 0.2 to 0.45

    setBgStyleState({
      brightness,
      spotlightX,
      spotlightY,
      spotlightRadius,
      scale,
      translateX,
      translateY,
      spotlightAlpha
    });
  };

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Refs to guarantee absolute latest state is read during any async calls or timeouts
  const currentStageRef = React.useRef<number>(0);
  const stepIndexRef = React.useRef<number>(0);
  const prevGrassRef = React.useRef<number>(0);
  const prevIsPlayingRef = React.useRef<boolean>(false);

  // Sync state values to refs automatically
  React.useEffect(() => {
    currentStageRef.current = currentStage;
  }, [currentStage]);

  React.useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);

  // Handle settings synchronization to audio engine & local-storage
  useEffect(() => {
    setSfxEnabled(settings.sfxOn);
    setBgmEnabled(settings.bgmOn);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('game_device_ratio', settings.deviceRatio);
        localStorage.setItem('game_is_portrait', String(settings.isPortrait));
        localStorage.setItem('game_sfx_enabled', String(settings.sfxOn));
        localStorage.setItem('game_bgm_enabled', String(settings.bgmOn));
        localStorage.setItem('game_font_size', settings.fontSize);
        localStorage.setItem('game_typewriter_enabled', String(settings.typewriterOn));
        localStorage.setItem('game_ui_scale', settings.uiScale);
        localStorage.setItem('game_bganim_enabled', String(settings.bgAnimOn));
      } catch (e) {}
    }
  }, [settings]);

  // Core Game State
  const [state, setState] = useState<GameState>({
    hp: 10,
    maxHp: 10,
    energy: 100, // percentage based (0-100%)
    grass: 0,
    inventory: ['探測機 🔍'],
    weapons: ['木棍'],
    firstCombatHit: true,
    lockedHearts: 0,
  });

  // Current Scene Background & Location Label
  const [sceneType, setSceneType] = useState<SceneType>('shida');

  // Trigger background focal shift & localized lighting random parameters on stage index, step, or scene transitions
  useEffect(() => {
    if (isPlaying) {
      randomizeBackgroundStyle();
    }
  }, [stepIndex, sceneType, isPlaying]);

  // Global Logs State for BattleLogger
  const [globalLogs, setGlobalLogs] = useState<LogEvent[]>([]);

  const addLogEvent = (text: string, type: string = 'info') => {
    const timestamp = new Date().toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEvent: LogEvent = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp,
      text,
      type
    };
    setGlobalLogs((prev) => [...prev, newEvent].slice(-100));
  };
  
  // Custom HUD Toast Toaster
  const [toast, setToast] = useState<{ msg: string; type: 'green' | 'orange' | 'red' } | null>(null);

  // Active dialogue line states
  const [dialogueText, setDialogueText] = useState<string>('');
  const [speaker, setSpeaker] = useState<string | null>(null);
  const [charPortrait, setCharPortrait] = useState<string | null>(null);
  const [isNarration, setIsNarration] = useState<boolean>(true);
  const [waitingClick, setWaitingClick] = useState<boolean>(false);

  // Dialogue typewriter state machine
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(true);

  useEffect(() => {
    if (!dialogueText) {
      setDisplayedText('');
      setIsTypingComplete(true);
      return;
    }

    if (!settings.typewriterOn) {
      setDisplayedText(dialogueText);
      setIsTypingComplete(true);
      return;
    }

    setIsTypingComplete(false);
    let currentIdx = 0;
    setDisplayedText('');

    const intervalId = setInterval(() => {
      currentIdx++;
      if (currentIdx <= dialogueText.length) {
        setDisplayedText(dialogueText.slice(0, currentIdx));
      } else {
        setIsTypingComplete(true);
        clearInterval(intervalId);
      }
    }, 22); // super smooth crisp typing speed

    return () => clearInterval(intervalId);
  }, [dialogueText, settings.typewriterOn]);

  // Modals & Panels toggle controllers
  const [showInventory, setShowInventory] = useState<boolean>(false);
  const [isDiaryOpen, setIsDiaryOpen] = useState<boolean>(false);
  const [activeScan, setActiveScan] = useState<{ item: string; img?: string; result: string; isHazardous?: boolean } | null>(null);
  const [activeCG, setActiveCG] = useState<string | null>(null);
  const [activeGrassEvent, setActiveGrassEvent] = useState<boolean>(false);
  const [activeFoodEvent, setActiveFoodEvent] = useState<{ location: string } | null>(null);
  const [activeCombat, setActiveCombat] = useState<{ enemy: string; hp: number; enemyImg: string } | null>(null);
  const [activeStageClear, setActiveStageClear] = useState<number | null>(null);
  const [pendingStageTransition, setPendingStageTransition] = useState<number | null>(null);
  
  // Terminal endings
  const [gameOver, setGameOver] = useState<{ isVictory: boolean; msg: string } | null>(null);

  // Reactive background music controller dynamically choosing the track
  useEffect(() => {
    if (!settings.bgmOn) {
      stopBgmSound();
      prevIsPlayingRef.current = isPlaying;
      return;
    }

    // If transitioned from cover to game, stop the old music entirely to ensure a clean switch.
    if (isPlaying && !prevIsPlayingRef.current) {
      stopBgmSound();
    }
    prevIsPlayingRef.current = isPlaying;

    // 1. Cover Screen (Title/Splash Screen)
    if (!isPlaying) {
      playBgm('cover');
      return;
    }

    // 2. Clear / Ending Screens
    if (gameOver) {
      if (gameOver.isVictory) {
        playBgm('ending');
      } else {
        stopBgmSound(); // Stop BGM on player death
      }
      return;
    }

    // 3. Selection of Food overlay
    if (activeFoodEvent) {
      playBgm('food');
      return;
    }

    // 4. Combat / Battle BGM
    if (activeCombat) {
      const enemy = activeCombat.enemy;
      if (enemy.includes('尤幹')) {
        playBgm('battle_uganda');
      } else if (enemy.includes('方水玉')) {
        playBgm('battle_fang');
      } else if (enemy.includes('山本')) {
        playBgm('battle_yamamoto');
      } else if (enemy.includes('村下')) {
        playBgm('battle_murashita');
      } else {
        playBgm('battle_uganda');
      }
      return;
    }

    // 5. Normal Story Location BGM and extra locations
    if (sceneType === 'shida' || sceneType === 'canteen' || sceneType === 'cook') {
      playBgm('baoshan');
    } else if (sceneType === 'transit' || sceneType === 'shrine' || sceneType === 'shrine_plain') {
      playBgm('shrine');
    } else if (sceneType === 'ch_walking' || sceneType === 'ch_wandering' || sceneType === 'ch_welcoming' || sceneType === 'ch_sword') {
      playBgm('ch_high');
    } else if (sceneType === 'huayang_market' || sceneType === 'huayang_fight') {
      playBgm('huayang');
    } else if (sceneType === 'council') {
      playBgm('council');
    } else if (sceneType === 'zhongshan_ele') {
      playBgm('zhongshan_ele');
    } else if (sceneType === 'seafood_supermarket') {
      playBgm('seafood_supermarket');
    } else if (sceneType === 'zhongshan_soy') {
      playBgm('zhongshan_soy');
    } else if (sceneType === 'jinde') {
      playBgm('jinde');
    } else {
      // Fallback BGM
      playBgm('baoshan');
    }
  }, [settings.bgmOn, isPlaying, gameOver, activeFoodEvent, activeCombat, sceneType]);

  // Global Keyboard Shortcuts Effect
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Safe guard when input fields / game configurations are actively typing
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (!isPlaying) return;

      const key = e.key.toLowerCase();

      // Spacebar (Space)
      if (e.key === ' ' || e.code === 'Space') {
        // Guard to make sure spacebar in combat keeps working to charge the weapon
        if (activeCombat !== null) {
          return; 
        }
        e.preventDefault();

        // 1. Chapter complete stage clear
        if (activeStageClear !== null) {
          const continueBtn = document.getElementById('continue-stage-btn');
          if (continueBtn) {
            continueBtn.click();
            return;
          }
        }

        // 2. Roadside grass event popup
        if (activeGrassEvent) {
          const pickBtn = document.getElementById('pick-grass-btn');
          if (pickBtn) {
            pickBtn.click();
            return;
          }
        }

        // 3. Normal dialogue push
        const dialogBox = document.getElementById('dialogue-box');
        if (dialogBox) {
          dialogBox.click();
        }
        return;
      }

      // D key: Toggle Diary
      if (key === 'd') {
        e.preventDefault();
        setIsDiaryOpen((prev) => !prev);
        return;
      }

      // B key: Toggle Pouch / Inventory
      if (key === 'b') {
        e.preventDefault();
        setShowInventory((prev) => !prev);
        return;
      }

      // S key: Toggle Settings
      if (key === 's') {
        e.preventDefault();
        setIsSettingsOpen((prev) => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isPlaying, activeCombat, activeStageClear, activeGrassEvent]);

  // Trigger Notifications
  const showToast = (msg: string, type: 'green' | 'orange' | 'red' = 'green') => {
    setToast({ msg, type });
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  };

  // Helper to determine which protagonist is active / highlighted in current step
  const getHighlightedCharacter = () => {
    if (!isPlaying) return null;
    if (!isNarration && speaker && ['安婷', '秉任', '夢恩', '翰倫'].includes(speaker)) {
      return speaker;
    }
    // If it's a narration and specifies a char, highlight them!
    const stageData = GAME_STAGES[currentStage];
    const step = stageData ? stageData[stepIndex - 1] : null;
    if (step && step.type === 'narration' && step.char && step.char !== 'none' && ['安婷', '秉任', '夢恩', '翰倫'].includes(step.char)) {
      return step.char;
    }
    return null;
  };

  // Helper to resolve the customized speaker branding color
  const getSpeakerColor = (name: string): string => {
    if (!name) return '#ffffff';
    if (name === '翰倫') return '#00ffff'; // Electric Cyan
    if (name === '秉任') return '#f97316'; // Vivid Orange
    if (name === '夢恩') return '#f472b6'; // Blossom Pink
    if (name === '安婷') return '#10b981'; // Leaf Green (Matching clothes)
    if (name.includes('惡靈') || name.includes('山本')) return '#c084fc'; // Purple for spectral entities
    if (name === '姜鳳興') return '#fbbf24'; // Old General Gold
    if (name === '木島') return '#a78bfa'; // Mysterious antagonist purple
    return '#ffffff'; // White for other roles
  };

  // Setup locked hearts automatically based on grass count (4 -> 10 HP locked/Check Game Over, 5 -> half locked/ceil, 6 -> all but 1 locked, 7 -> DEAD)
  useEffect(() => {
    if (!isPlaying) return;
    
    let lockCount = 0;
    if (state.grass === 4) {
      if (state.maxHp <= 10) {
        triggerGameOver(
          false,
          '禾火草的靈氣失控，在背包裡化為紅蓮之焰，熾熱的火焰 and 冤魂的噪語把你淹沒了。'
        );
        return;
      }
      lockCount = 10;
    } else if (state.grass === 5) {
      lockCount = Math.ceil(state.maxHp / 2);
    } else if (state.grass === 6) {
      lockCount = state.maxHp - 1;
    } else if (state.grass >= 7) {
      triggerGameOver(
        false,
        '禾火草的靈氣失控，在背包裡化為紅蓮之焰，熾熱的火焰和冤魂的噪語把你淹沒了。'
      );
      return;
    }

    // Play warning sound effects and toasts on grass transitions
    if (state.grass > prevGrassRef.current) {
      if (state.grass === 4) {
        // Disabled alarm warning sound per request
      } else if (state.grass === 5) {
        playHeartbeatSound();
        setTimeout(() => playCockpitWarningSound(), 300);
        showToast('🔥 攻勢提昇！禾火草純陽沸騰，攻擊敵人一次扣兩顆敵人的星星！', 'orange');
        addLogEvent?.('🔥 禾火草純陽沸騰：攻勢提升，每次攻擊打擊敵方扣除 2 顆星星！', 'success');
      } else if (state.grass === 6) {
        playHeartbeatSound();
        setTimeout(() => playCockpitWarningSound(), 350);
        showToast('🔥 攻勢提昇！禾火草極陽爆發，攻擊敵人一次扣三顆敵人的星星！', 'red');
        addLogEvent?.('🔥 禾火草極陽爆發：攻勢極致提升，每次攻擊打擊敵方扣除 3 顆星星！', 'success');
      }
    }
    prevGrassRef.current = state.grass;

    setState((prev) => {
      // Adjust HP if it exceeds allowed maximum after locking
      const allowedMax = prev.maxHp - lockCount;
      const validHp = prev.hp > allowedMax ? allowedMax : prev.hp;
      return {
        ...prev,
        lockedHearts: lockCount,
        hp: validHp,
      };
    });
  }, [state.grass, isPlaying]);

  // Energy & Death Checks
  useEffect(() => {
    if (!isPlaying) return;
    
    if (state.energy <= 0) {
      setState((prev) => {
        // Prevent concurrent double triggers
        if (prev.energy > 0) return prev;
        
        const nextHp = Math.max(0, prev.hp - 3);
        if (nextHp <= 0) {
          setTimeout(() => {
            triggerGameOver(
              false,
              '<b>☠ 力竭氣盡命喪……</b><br /><br />你的行動精力全部耗竭！在極度虛弱下，體內殘餘的最後護星印記被強迫震裂 3 顆以試圖激發體能，不幸引爆了心脈衰弱。你的生命星印徹徹底底熄滅，倒地不起。'
            );
          }, 100);
        } else {
          setTimeout(() => {
            showToast('⚡ 行動精力透支耗盡！自動消耗 3 顆生命心星，強制回補 100% 精力！', 'red');
            addLogEvent('🚨 精力枯竭警告：抽取 3 顆生命心星轉化為 100% 行動能源！', 'warn');
          }, 100);
        }
        
        return {
          ...prev,
          hp: nextHp,
          energy: 100, // Recover 100%!
        };
      });
    }


  }, [state.energy, isPlaying]);

  const triggerGameOver = (isVictory: boolean, msg: string) => {
    setGameOver({ isVictory, msg });
  };

  const executeStageTransition = (cleared: number) => {
    setActiveCG(null);
    if (cleared === 0) {
      // Load STAGE 1 (忠靈祠)
      setCurrentStage(1);
      setStepIndex(0);
      currentStageRef.current = 1;
      stepIndexRef.current = 0;
      setSceneType('transit');
      setTimeout(() => {
        advanceDialogue();
      }, 120);
    } else if (cleared === 1) {
      // Load STAGE 2 (彰化高中)
      setCurrentStage(2);
      setStepIndex(0);
      currentStageRef.current = 2;
      stepIndexRef.current = 0;
      setSceneType('ch_walking');
      setTimeout(() => {
        advanceDialogue();
      }, 120);
    } else if (cleared === 2) {
      // Load STAGE 3 (華陽市場)
      setCurrentStage(3);
      setStepIndex(0);
      currentStageRef.current = 3;
      stepIndexRef.current = 0;
      setSceneType('huayang_market');
      setTimeout(() => {
        advanceDialogue();
      }, 120);
    } else if (cleared === 3) {
      // Load STAGE 4 (彰化縣議會)
      setCurrentStage(4);
      setStepIndex(0);
      currentStageRef.current = 4;
      stepIndexRef.current = 0;
      setSceneType('council');
      setTimeout(() => {
        advanceDialogue();
      }, 120);
    } else if (cleared === 4) {
      // Load STAGE 5 (中山國小)
      setCurrentStage(5);
      setStepIndex(0);
      currentStageRef.current = 5;
      stepIndexRef.current = 0;
      setSceneType('zhongshan_ele');
      setTimeout(() => {
        advanceDialogue();
      }, 120);
    } else if (cleared === 5) {
      // Load STAGE 6 (海鮮店)
      setCurrentStage(6);
      setStepIndex(0);
      currentStageRef.current = 6;
      stepIndexRef.current = 0;
      setSceneType('seafood_supermarket');
      setTimeout(() => {
        advanceDialogue();
      }, 120);
    } else if (cleared === 6) {
      // Load STAGE 7 (中山豆漿)
      setCurrentStage(7);
      setStepIndex(0);
      currentStageRef.current = 7;
      stepIndexRef.current = 0;
      setSceneType('zhongshan_soy');
      setTimeout(() => {
        advanceDialogue();
      }, 120);
    } else if (cleared === 7) {
      // Load STAGE 8 (喜美超市)
      setCurrentStage(8);
      setStepIndex(0);
      currentStageRef.current = 8;
      stepIndexRef.current = 0;
      setSceneType('seafood_supermarket');
      setTimeout(() => {
        advanceDialogue();
      }, 120);
    } else {
      // Final Victory complete!
      triggerGameOver(
        true,
        '<b>✨ 乙未異變 · 八卦破曉真結局達成！ ✨</b><br /><br />在你們英勇的配合、探測和堅韌的抗擊下，彰化師大寶山校區、學食大堂、八卦軍人忠靈祠、彰化高中、華陽市場、彰化縣議會、中山國小、海鮮店、中山豆漿店以及喜美超市被徹底淨化！山本少尉、方水玉、村下速志中佐與木島的怨魂執念終得安息超昇，不再霍亂人間。<br /><br />你們守住了心愛的人，也守住了校園的安寧與和平。<br /><br /><b>感謝您的細心玩賞與操作！</b>'
      );
    }
  };

  // Progression runner
  const advanceDialogue = () => {
    const stage = currentStageRef.current;
    const index = stepIndexRef.current;
    const stageData = GAME_STAGES[stage];

    if (!stageData || index >= stageData.length) {
      return;
    }

    const step = stageData[index];
    const nextIndex = index + 1;
    stepIndexRef.current = nextIndex;
    setStepIndex(nextIndex);
    setWaitingClick(false);

    switch (step.type) {
      case 'narration':
        setDialogueText(step.text);
        addLogEvent(step.text, 'story');
        setSpeaker(null);
        setIsNarration(true);
        if (step.char && step.char !== 'none') {
          setCharPortrait(CHAR_IMG[step.char] || null);
        } else if (step.char === 'none') {
          setCharPortrait(null);
        }
        setWaitingClick(true);
        break;

      case 'dialogue':
        setDialogueText(step.text);
        addLogEvent(`${step.speaker}：「${step.text}」`, 'story');
        setSpeaker(step.speaker);
        setIsNarration(false);
        setCharPortrait(CHAR_IMG[step.speaker] || null);
        setWaitingClick(true);
        break;

      case 'setscene':
        setSceneType(step.scene);
        setActiveCG(null);
        // Auto step again
        setTimeout(() => {
          advanceDialogue();
        }, 50);
        break;

      case 'cg':
        setActiveCG(step.img);
        // Auto step again for the narration overlay
        setTimeout(() => {
          advanceDialogue();
        }, 50);
        break;

      case 'scan':
        // Warn scan key triggers
        setSpeaker(null);
        setIsNarration(true);
        setDialogueText(`（分析探測器響起，照準標的物「${step.item}」）`);
        setActiveScan({ item: step.item, img: step.img, result: step.result, isHazardous: step.isHazardous });
        break;

      case 'food':
        addLogEvent(`📍 口糧短缺！到達地點【${step.location}】，開始物色並配膳採取草木營養。`, 'system');
        setActiveFoodEvent({ location: step.location });
        break;

      case 'grass_event':
        setActiveGrassEvent(true);
        break;

      case 'additem':
        setState((prev) => {
          const invSet = new Set(prev.inventory);
          const weapSet = new Set(prev.weapons);

          invSet.add(step.item);
          
          // Automatically add any weapon identified in WEAPONS_DATA matching the item name
          if (typeof WEAPONS_DATA !== 'undefined' && WEAPONS_DATA) {
            for (const key of Object.keys(WEAPONS_DATA)) {
              if (step.item.includes(key)) {
                weapSet.add(key);
              }
            }
          }

          if (step.item.includes('鐵鍋')) weapSet.add('鐵鍋');
          if (step.item.includes('武士刀')) weapSet.add('生鏽武士刀');

          return {
            ...prev,
            inventory: Array.from(invSet),
            weapons: Array.from(weapSet),
          };
        });
        playSparkleSound();
        showToast(`📦 獲得重要裝備：${step.item}`, 'green');
        addLogEvent(`🎒 獲得重要裝備：【${step.item}】！已添加入我方道具袋。`, 'item');
        
        // Show in dialogue box to explain and wait for player's click to prevent race condition desyncs
        setDialogueText(`🎉 獲得重要裝備：【${step.item}】！已被放入道具袋 🎒`);
        setSpeaker(null);
        setIsNarration(true);
        setCharPortrait(null);
        setWaitingClick(true);
        break;

      case 'combat':
        setSpeaker(null);
        setIsNarration(true);
        setActiveCombat({ enemy: step.enemy, hp: step.hp, enemyImg: step.enemyImg || IMG.山本少尉 });
        addLogEvent(`⚔️ 警告：生死交鋒！幽魔將領【${step.enemy}】現身！與之決一死戰！`, 'alert');
        // Pre-advance to the first step of the victory plot so that we skip any "生死交鋒" blank dialog step!
        advanceDialogue();
        break;

      case 'stageclear':
        setActiveStageClear(step.stage);
        break;

      default:
        // skip unrecognized
        advanceDialogue();
    }
  };

  // Launch Game
  const startGame = () => {
    setIsPlaying(true);
    setCurrentStage(0);
    setStepIndex(0);
    currentStageRef.current = 0;
    stepIndexRef.current = 0;
    setSceneType('shida');
    setSpeaker(null);
    setCharPortrait(null);
    setDialogueText('西元2026年，異變籠罩了這片古戰場……點擊此對話盒，開始探索。');
    setIsNarration(true);
    setWaitingClick(true);

    // Reset layout containers
    setActiveCG(null);
    setActiveCombat(null);
    setActiveFoodEvent(null);
    setActiveGrassEvent(false);
    setActiveStageClear(null);
    setActiveScan(null);
    setPendingStageTransition(null);

    // Force trigger sound engine on user interaction to guarantee bypass of browser constraints
    if (settings.bgmOn) {
      stopBgmSound();
      playBgm('baoshan');
    }
  };

  const handleNextClick = () => {
    if (!isTypingComplete) {
      // Instantly finish typewriter and full text projection
      setDisplayedText(dialogueText);
      setIsTypingComplete(true);
      playClickSound();
      return;
    }
    if (waitingClick) {
      playClickSound();
      advanceDialogue();
    }
  };

  const restartAndReset = () => {
    prevGrassRef.current = 0;
    setState({
      hp: 10,
      maxHp: 10,
      energy: 100,
      grass: 0,
      inventory: ['探測機 🔍'],
      weapons: ['木棍'],
      firstCombatHit: true,
      lockedHearts: 0,
    });
    setGlobalLogs([]);
    setIsDiaryOpen(false);
    setStepIndex(0);
    setCurrentStage(0);
    currentStageRef.current = 0;
    stepIndexRef.current = 0;
    setGameOver(null);
    setIsPlaying(false);

    // Explicitly reset on-screen event states and active CGs
    setActiveCG(null);
    setActiveCombat(null);
    setActiveFoodEvent(null);
    setActiveGrassEvent(false);
    setActiveStageClear(null);
    setActiveScan(null);
    setPendingStageTransition(null);
    setSpeaker(null);
    setCharPortrait(null);
    setSceneType('shida');
    setDialogueText('');
    setDisplayedText('');
    setIsTypingComplete(true);
  };

  // Get current region title
  const getLocationTitle = () => {
    if (sceneType === 'shida') return '彰化師大寶山校區 · 樹蔭';
    if (sceneType === 'canteen') return '寶山校區 · 學營商場 (學餐)';
    if (sceneType === 'cook') return '學餐廚房 · 灶爐邊';
    if (sceneType === 'transit') return '八卦山抗日古道 · 朝陽台';
    if (sceneType === 'shrine') return '彰化軍人忠靈祠 · 怨靈幻境';
    if (sceneType === 'shrine_plain') return '彰化軍人忠靈祠 · 祠堂殿前';
    if (sceneType === 'ch_walking') return '八卦山山道 · 趕路中';
    if (sceneType === 'ch_wandering') return '彰化高中 · 校園遊蕩';
    if (sceneType === 'ch_welcoming') return '彰化高中 · 活動中心門前';
    if (sceneType === 'ch_sword') return '彰化高中 · 活動中心內';
    if (sceneType === 'huayang_market') return '華陽市場 · 入口廣場';
    if (sceneType === 'huayang_fight') return '華陽市場 · 混亂通道';
    if (sceneType === 'council') return '彰化縣議會';
    if (sceneType === 'zhongshan_ele') return '中山國小 · 校園廣場';
    if (sceneType === 'seafood_supermarket') return currentStage === 8 ? '喜美超市 · 進德門口' : '海鮮店';
    if (sceneType === 'zhongshan_soy') return '中山豆 · 豆漿店';
    if (sceneType === 'jinde') return '彰化師大進德校區 · 參天大樹';
    return '彰化師大校區';
  };

  // Safe physical aspect ratio style generator
  const getAspectRatioStyle = () => {
    return {
      aspectRatio: '16/9',
    };
  };

  return (
    <div className="w-full h-screen bg-[#070406] flex items-center justify-center p-2 sm:p-4 md:p-6 relative overflow-hidden text-[#ebd9c5] font-sans">
      <div className="absolute inset-0 bg-[#070305] bg-[radial-gradient(ellipse_at_center,rgba(40,20,50,0.18)_0%,rgba(4,2,4,1)_100%)] pointer-events-none" />

      {/* Adaptive Virtual Device Frame Wrapper */}
      <div 
        style={getAspectRatioStyle()} 
        className="w-full max-w-full max-h-full h-auto border-[5px] border-[#382635] bg-[#0a0609] shadow-[0_24px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(107,35,120,0.06)] rounded-3xl relative flex flex-col justify-between overflow-hidden transition-all duration-300"
      >
        
        {/* 1. TITLE PAGE OVERLAY */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              key="title-screen-wrapper"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-50 pointer-events-auto"
            >
              <TitleScreen onStart={startGame} onOpenSettings={() => setIsSettingsOpen(true)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. GAME PLAYING CONTAINER */}
        {isPlaying && (
          <div className="w-full h-full relative flex flex-col justify-between overflow-hidden">
            
             {/* BACKGROUND SCENE RENDERING */}
             <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden transition-all duration-1000">
               {activeCG ? (
                 <img
                   src={activeCG}
                   alt="劇情插圖"
                   referrerPolicy="no-referrer"
                   style={settings.bgAnimOn ? {
                     filter: `brightness(${bgStyleState.brightness}) saturate(1.02) contrast(1.04)`,
                     transform: `scale(${bgStyleState.scale}) translate(${bgStyleState.translateX}%, ${bgStyleState.translateY}%)`,
                     transition: 'transform 8s cubic-bezier(0.25, 1, 0.5, 1), filter 5s ease-in-out',
                     transformOrigin: 'center center'
                   } : {
                     filter: 'brightness(0.9) saturate(1.0) contrast(1.0)',
                     transform: 'scale(1) translate(0%, 0%)',
                     transition: 'transform 1s ease-out, filter 1s ease-out',
                     transformOrigin: 'center center'
                   }}
                   className="w-full h-full object-cover"
                 />
               ) : (
                 <>
                   {sceneType === 'shida' && (
                 <img
                   src={IMG.日軍遊魂飛散}
                   alt="日軍遊魂飛散"
                   referrerPolicy="no-referrer"
                   style={settings.bgAnimOn ? {
                     filter: `brightness(${bgStyleState.brightness}) saturate(1.02) contrast(1.04)`,
                     transform: `scale(${bgStyleState.scale}) translate(${bgStyleState.translateX}%, ${bgStyleState.translateY}%)`,
                     transition: 'transform 8s cubic-bezier(0.25, 1, 0.5, 1), filter 5s ease-in-out',
                     transformOrigin: 'center center'
                   } : {
                     filter: 'brightness(0.9) saturate(1.0) contrast(1.0)',
                     transform: 'scale(1) translate(0%, 0%)',
                     transition: 'transform 1s ease-out, filter 1s ease-out',
                     transformOrigin: 'center center'
                   }}
                   className="w-full h-full object-cover"
                 />
               )}
               {sceneType === 'canteen' && (
                 <img
                   src={IMG.學餐背景}
                   alt="學餐背景"
                   referrerPolicy="no-referrer"
                   style={settings.bgAnimOn ? {
                     filter: `brightness(${bgStyleState.brightness}) saturate(1.02) contrast(1.04)`,
                     transform: `scale(${bgStyleState.scale}) translate(${bgStyleState.translateX}%, ${bgStyleState.translateY}%)`,
                     transition: 'transform 8s cubic-bezier(0.25, 1, 0.5, 1), filter 5s ease-in-out',
                     transformOrigin: 'center center'
                   } : {
                     filter: 'brightness(0.9) saturate(1.0) contrast(1.0)',
                     transform: 'scale(1) translate(0%, 0%)',
                     transition: 'transform 1s ease-out, filter 1s ease-out',
                     transformOrigin: 'center center'
                   }}
                   className="w-full h-full object-cover"
                 />
               )}
               {sceneType === 'cook' && (
                 <img
                   src={IMG.廚師鐵鍋}
                   alt="廚師鐵鍋"
                   referrerPolicy="no-referrer"
                   style={settings.bgAnimOn ? {
                     filter: `brightness(${bgStyleState.brightness * 0.95}) saturate(1.02) contrast(1.04)`,
                     transform: `scale(${bgStyleState.scale * 1.02}) translate(${bgStyleState.translateX}%, ${bgStyleState.translateY}%)`,
                     transition: 'transform 8s cubic-bezier(0.25, 1, 0.5, 1), filter 5s ease-in-out',
                     transformOrigin: 'center center'
                   } : {
                     filter: 'brightness(0.85) saturate(1.0) contrast(1.0)',
                     transform: 'scale(1) translate(0%, 0%)',
                     transition: 'transform 1s ease-out, filter 1s ease-out',
                     transformOrigin: 'center center'
                   }}
                   className="w-full h-full object-cover animate-pulse"
                 />
               )}
               {sceneType === 'transit' && (
                 <img
                   src={IMG.過關途中}
                   alt="過關途中"
                   referrerPolicy="no-referrer"
                   style={settings.bgAnimOn ? {
                     filter: `brightness(${bgStyleState.brightness}) saturate(1.02) contrast(1.04)`,
                     transform: `scale(${bgStyleState.scale}) translate(${bgStyleState.translateX}%, ${bgStyleState.translateY}%)`,
                     transition: 'transform 8s cubic-bezier(0.25, 1, 0.5, 1), filter 5s ease-in-out',
                     transformOrigin: 'center center'
                   } : {
                     filter: 'brightness(0.9) saturate(1.0) contrast(1.0)',
                     transform: 'scale(1) translate(0%, 0%)',
                     transition: 'transform 1s ease-out, filter 1s ease-out',
                     transformOrigin: 'center center'
                   }}
                   className="w-full h-full object-cover"
                 />
               )}
               {sceneType === 'shrine' && (
                 <img
                   src={IMG.初見山本}
                   alt="初見山本"
                   referrerPolicy="no-referrer"
                   style={settings.bgAnimOn ? {
                     filter: `brightness(${bgStyleState.brightness}) saturate(1.02) contrast(1.04)`,
                     transform: `scale(${bgStyleState.scale}) translate(${bgStyleState.translateX}%, ${bgStyleState.translateY}%)`,
                     transition: 'transform 8s cubic-bezier(0.25, 1, 0.5, 1), filter 5s ease-in-out',
                     transformOrigin: 'center center'
                   } : {
                     filter: 'brightness(0.9) saturate(1.0) contrast(1.0)',
                     transform: 'scale(1) translate(0%, 0%)',
                     transition: 'transform 1s ease-out, filter 1s ease-out',
                     transformOrigin: 'center center'
                   }}
                   className="w-full h-full object-cover"
                 />
               )}
               {sceneType === 'shrine_plain' && (
                  <img
                    src={IMG.戰勝山本}
                   alt="初見山本"
                   referrerPolicy="no-referrer"
                   style={settings.bgAnimOn ? {
                     filter: `brightness(${bgStyleState.brightness}) saturate(1.02) contrast(1.04)`,
                     transform: `scale(${bgStyleState.scale}) translate(${bgStyleState.translateX}%, ${bgStyleState.translateY}%)`,
                     transition: 'transform 8s cubic-bezier(0.25, 1, 0.5, 1), filter 5s ease-in-out',
                     transformOrigin: 'center center'
                   } : {
                     filter: 'brightness(0.9) saturate(1.0) contrast(1.0)',
                     transform: 'scale(1) translate(0%, 0%)',
                     transition: 'transform 1s ease-out, filter 1s ease-out',
                     transformOrigin: 'center center'
                   }}
                   className="w-full h-full object-cover"
                 />
               )}
               {sceneType === 'ch_walking' && (
                 <img
                   src={IMG.趕路}
                   alt="趕路"
                   referrerPolicy="no-referrer"
                   style={settings.bgAnimOn ? {
                     filter: `brightness(${bgStyleState.brightness}) saturate(1.02) contrast(1.04)`,
                     transform: `scale(${bgStyleState.scale}) translate(${bgStyleState.translateX}%, ${bgStyleState.translateY}%)`,
                     transition: 'transform 8s cubic-bezier(0.25, 1, 0.5, 1), filter 5s ease-in-out',
                     transformOrigin: 'center center'
                   } : {
                     filter: 'brightness(0.9) saturate(1.0) contrast(1.0)',
                     transform: 'scale(1) translate(0%, 0%)',
                     transition: 'transform 1s ease-out, filter 1s ease-out',
                     transformOrigin: 'center center'
                   }}
                   className="w-full h-full object-cover"
                 />
               )}
               {sceneType === 'ch_wandering' && (
                 <img
                   src={IMG.彰中_學生遊蕩}
                   alt="彰中_學生遊蕩"
                   referrerPolicy="no-referrer"
                   style={settings.bgAnimOn ? {
                     filter: `brightness(${bgStyleState.brightness}) saturate(1.02) contrast(1.04)`,
                     transform: `scale(${bgStyleState.scale}) translate(${bgStyleState.translateX}%, ${bgStyleState.translateY}%)`,
                     transition: 'transform 8s cubic-bezier(0.25, 1, 0.5, 1), filter 5s ease-in-out',
                     transformOrigin: 'center center'
                   } : {
                     filter: 'brightness(0.9) saturate(1.0) contrast(1.0)',
                     transform: 'scale(1) translate(0%, 0%)',
                     transition: 'transform 1s ease-out, filter 1s ease-out',
                     transformOrigin: 'center center'
                   }}
                   className="w-full h-full object-cover"
                 />
               )}
               {sceneType === 'ch_welcoming' && (
                 <img
                   src={IMG.彰中_校長迎接}
                   alt="彰中_校長迎接"
                   referrerPolicy="no-referrer"
                   style={settings.bgAnimOn ? {
                     filter: `brightness(${bgStyleState.brightness}) saturate(1.02) contrast(1.04)`,
                     transform: `scale(${bgStyleState.scale}) translate(${bgStyleState.translateX}%, ${bgStyleState.translateY}%)`,
                     transition: 'transform 8s cubic-bezier(0.25, 1, 0.5, 1), filter 5s ease-in-out',
                     transformOrigin: 'center center'
                   } : {
                     filter: 'brightness(0.9) saturate(1.0) contrast(1.0)',
                     transform: 'scale(1) translate(0%, 0%)',
                     transition: 'transform 1s ease-out, filter 1s ease-out',
                     transformOrigin: 'center center'
                   }}
                   className="w-full h-full object-cover"
                 />
               )}
               {sceneType === 'huayang_market' && (
                 <img
                   src={IMG.華陽市場}
                   alt="華陽市場"
                   referrerPolicy="no-referrer"
                   style={settings.bgAnimOn ? {
                     filter: `brightness(${bgStyleState.brightness}) saturate(1.02) contrast(1.04)`,
                     transform: `scale(${bgStyleState.scale}) translate(${bgStyleState.translateX}%, ${bgStyleState.translateY}%)`,
                     transition: 'transform 8s cubic-bezier(0.25, 1, 0.5, 1), filter 5s ease-in-out',
                     transformOrigin: 'center center'
                   } : {
                     filter: 'brightness(0.9) saturate(1.0) contrast(1.0)',
                     transform: 'scale(1) translate(0%, 0%)',
                     transition: 'transform 1s ease-out, filter 1s ease-out',
                     transformOrigin: 'center center'
                   }}
                   className="w-full h-full object-cover"
                 />
               )}
               {sceneType === 'huayang_fight' && (
                 <img
                   src={IMG.婆媽打架}
                   alt="婆媽打架"
                   referrerPolicy="no-referrer"
                   style={settings.bgAnimOn ? {
                     filter: `brightness(${bgStyleState.brightness}) saturate(1.02) contrast(1.04)`,
                     transform: `scale(${bgStyleState.scale}) translate(${bgStyleState.translateX}%, ${bgStyleState.translateY}%)`,
                     transition: 'transform 8s cubic-bezier(0.25, 1, 0.5, 1), filter 5s ease-in-out',
                     transformOrigin: 'center center'
                   } : {
                     filter: 'brightness(0.9) saturate(1.0) contrast(1.0)',
                     transform: 'scale(1) translate(0%, 0%)',
                     transition: 'transform 1s ease-out, filter 1s ease-out',
                     transformOrigin: 'center center'
                   }}
                   className="w-full h-full object-cover"
                 />
               )}
               {sceneType === 'council' && (
                 <img
                   src={IMG.議會背景}
                   alt="彰化縣議會"
                   referrerPolicy="no-referrer"
                   style={settings.bgAnimOn ? {
                     filter: `brightness(${bgStyleState.brightness}) saturate(1.02) contrast(1.04)`,
                     transform: `scale(${bgStyleState.scale}) translate(${bgStyleState.translateX}%, ${bgStyleState.translateY}%)`,
                     transition: 'transform 8s cubic-bezier(0.25, 1, 0.5, 1), filter 5s ease-in-out',
                     transformOrigin: 'center center'
                   } : {
                     filter: 'brightness(0.9) saturate(1.0) contrast(1.0)',
                     transform: 'scale(1) translate(0%, 0%)',
                     transition: 'transform 1s ease-out, filter 1s ease-out',
                     transformOrigin: 'center center'
                   }}
                   className="w-full h-full object-cover"
                 />
               )}
               {sceneType === 'ch_sword' && (
                 <img
                   src={IMG.彰中_校長給劍}
                   alt="彰中_校長給劍"
                   referrerPolicy="no-referrer"
                   style={settings.bgAnimOn ? {
                     filter: `brightness(${bgStyleState.brightness}) saturate(1.02) contrast(1.04)`,
                     transform: `scale(${bgStyleState.scale}) translate(${bgStyleState.translateX}%, ${bgStyleState.translateY}%)`,
                     transition: 'transform 8s cubic-bezier(0.25, 1, 0.5, 1), filter 5s ease-in-out',
                     transformOrigin: 'center center'
                   } : {
                     filter: 'brightness(0.9) saturate(1.0) contrast(1.0)',
                     transform: 'scale(1) translate(0%, 0%)',
                     transition: 'transform 1s ease-out, filter 1s ease-out',
                     transformOrigin: 'center center'
                   }}
                   className="w-full h-full object-cover"
                 />
               )}
               </>
               )}

               {/* Localized Spotlight dynamic overlay or general vignette background overlay */}
               {settings.bgAnimOn ? (
                 <div 
                   className="absolute inset-0 pointer-events-none transition-all duration-500"
                   style={{
                     background: `radial-gradient(circle at ${bgStyleState.spotlightX}% ${bgStyleState.spotlightY}%, transparent 12%, rgba(10, 6, 8, ${bgStyleState.spotlightAlpha + 0.48}) ${bgStyleState.spotlightRadius}%)`,
                     transition: 'background 5s ease-in-out'
                   }}
                 />
               ) : (
                 <div className="absolute inset-0 bg-gradient-to-b from-[#0a0608]/40 via-transparent to-[#0a0608]/90 pointer-events-none" />
               )}
             </div>

             {/* HUD OVERLAY (TOP) */}
             <HUD
               state={state}
               onOpenInventory={() => setShowInventory(true)}
               locationName={getLocationTitle()}
               currentStage={currentStage}
               uiScale={settings.uiScale as any}
             />

          {/* DYNAMIC MIDDLE CHARACTER PORTRAITS */}
          <div className="flex-1 w-full max-w-5xl mx-auto relative flex flex-row items-end justify-center pb-1 md:pb-4 z-10 px-4">
            {/* PROTAGONISTS LINEUP */}
            <div className="flex flex-row items-end justify-center -space-x-10 sm:-space-x-16 md:-space-x-22 lg:-space-x-26 xl:-space-x-32 w-fit transition-all duration-300">
              {['安婷', '秉任', '夢恩', '翰倫'].map((name) => {
                const imgUrl = CHAR_IMG[name];
                if (!imgUrl) return null;

                const activeSpeaker = getHighlightedCharacter();
                const isHighlight = activeSpeaker === name;
                const isBossSpeaking = speaker && !['安婷', '秉任', '夢恩', '翰倫'].includes(speaker);

                // Dynamic VN-game scale, position, brightness filters, and zIndices
                let scaleVal = 1.0;
                let brightnessVal = 'brightness(100%)';
                let opacityVal = 1.0;
                let yVal = 0;
                let zVal = 2;

                if (isHighlight) {
                  // Active speaker gets spotlight
                  scaleVal = 1.15;
                  brightnessVal = 'brightness(105%)';
                  opacityVal = 1.0;
                  yVal = -16;
                  zVal = 10;
                } else if (activeSpeaker || isBossSpeaking) {
                  // Someone else (another protagonist or the boss) is speaking -> make this character small and subtle
                  scaleVal = 0.8;
                  brightnessVal = 'brightness(55%) grayscale(30%)';
                  opacityVal = 0.55;
                  yVal = 14;
                  zVal = 1;
                } else {
                  // Unified state during generic narration steps where no single character is speaking
                  scaleVal = 0.92;
                  brightnessVal = 'brightness(75%)';
                  opacityVal = 0.82;
                  yVal = 4;
                  zVal = 2;
                }

                return (
                  <motion.div
                    key={name}
                    animate={{
                      scale: scaleVal,
                      y: yVal,
                      opacity: opacityVal,
                      zIndex: zVal,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 140,
                      damping: 18,
                    }}
                    className="w-24 sm:w-36 md:w-48 lg:w-56 xl:w-64 relative flex flex-col items-center justify-end"
                    style={{
                      transformOrigin: 'bottom center',
                    }}
                  >
                    <CutoutImage
                      src={imgUrl}
                      alt={name}
                      bypassCutout={false}
                      className="w-full h-auto object-contain transition-all duration-300 pointer-events-none select-none max-h-[58vh] sm:max-h-[64vh] md:max-h-[68vh] lg:max-h-[72vh] xl:max-h-[75vh]"
                      style={{
                        filter: brightnessVal,
                      }}
                    />
                    
                    {/* Character active base neon indicator */}
                    {isHighlight && (
                      <motion.div
                        layoutId="active-base-glow"
                        className="absolute bottom-0 left-1/4 right-1/4 h-2.5 bg-gradient-to-r from-amber-500/0 via-amber-400 to-amber-500/0 blur-md rounded-full shadow-[0_0_24px_rgba(245,158,11,0.9)]"
                        transition={{ type: 'spring', stiffness: 120 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM INTERACTIVE INTERFACE (DIALOG BOX) */}
          <div className="relative w-full z-20 px-4 pb-4 md:px-6 md:pb-6 flex flex-col gap-2.5">
            
            {/* The 2 Bottom Corners Bar - Left: Diary & Pouch, Right: System Settings */}
            <div className="flex items-center justify-between w-full max-w-2xl mx-auto px-1 select-none font-sans">
              
              {/* Bottom-Left: 📓 日記 & 🎒 道具袋 */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playClickSound();
                    setIsDiaryOpen(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 border border-[#3d2040]/80 bg-[#0e0a10]/95 hover:bg-[#211126]/95 text-pink-450 hover:text-pink-300 text-[11px] font-black rounded-lg shadow-l cursor-pointer transition-colors"
                >
                  <span>📓 日記</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playClickSound();
                    setShowInventory(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 border border-[#4d2952]/80 bg-[#160d17]/95 hover:bg-[#251327]/95 text-[#fbbf24] text-[11px] font-black rounded-lg shadow-lg cursor-pointer transition-colors"
                >
                  <span>🎒 道具袋</span>
                </motion.button>
              </div>

              {/* Bottom-Right: ⚙️ 系統設定 gear */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playClickSound();
                  setIsSettingsOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 border border-zinc-700/80 bg-[#140f11]/95 text-zinc-350 text-[11px] font-bold rounded-lg shadow-lg hover:border-amber-400 hover:text-amber-300 transition-all cursor-pointer"
              >
                <span>⚙️ 系統設定</span>
              </motion.button>

            </div>

            <motion.div
              id="dialogue-box"
              whileHover={{ scale: waitingClick ? 1.005 : 1 }}
              whileTap={{ scale: waitingClick ? 0.995 : 1 }}
              onClick={handleNextClick}
              className={`w-full max-w-2xl mx-auto border rounded-xl backdrop-blur-md p-4 md:p-5 relative cursor-pointer shadow-2xl transition-all duration-300 ${
                isNarration
                  ? 'border-[#3d2040]/30 bg-[#0e0a10]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]'
                  : 'border-[#552e67]/50 bg-[#160d1b]/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_12px_rgba(107,47,160,0.1)]'
              }`}
            >
              <div className="flex flex-col gap-2">
                {/* Speaker avatar tag inside text box */}
                {!isNarration && speaker && (
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-7 h-7 rounded-full border overflow-hidden bg-black/85 flex-shrink-0"
                      style={{ borderColor: getSpeakerColor(speaker) }}
                    >
                      {CHAR_IMG[speaker] ? (
                        <img
                          src={CHAR_IMG[speaker]}
                          alt={speaker}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-650 bg-[#12080f]/90">
                          👤
                        </div>
                      )}
                    </div>
                    <span
                      className="text-xs md:text-sm font-black tracking-widest pl-1"
                      style={{ color: getSpeakerColor(speaker) }}
                    >
                      【 {speaker} 】
                    </span>
                  </div>
                )}

                {/* Subtitle Text (Line breakdown list structure with settings-defined fontSize adjustments) */}
                <p className={`leading-relaxed tracking-wider ${
                  settings.fontSize === 'small' 
                    ? 'text-[11px] md:text-xs' 
                    : settings.fontSize === 'large' 
                    ? 'text-sm md:text-base font-black' 
                    : 'text-xs md:text-sm'
                } ${isNarration ? 'text-[#b8a898] italic font-sans' : 'text-[#f4eae0] font-sans font-medium'}`}>
                  {displayedText}
                </p>
              </div>

              {/* Enter Clicker Prompt */}
              {waitingClick && (
                <span className="absolute bottom-3 right-4 text-[9px] text-[#8b7869] tracking-wider font-mono animate-bounce flex items-center gap-0.5 select-none pointer-events-none">
                  點擊對話盒繼續
                  <ChevronRight className="w-3 h-3" />
                </span>
              )}
            </motion.div>
          </div>

        </div>
      )}

      {/* Close the virtual device wrapper frame container */}
      </div>

      {/* ==================== 3. MODAL POPUPS & INTERACTIVE BOXES ==================== */}

      {/* AA. GLOBAL CONFIGURATOR SETTINGS PANEL OVERLAY */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050305]/95 select-none font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm border border-[#522958]/50 bg-[#160d1b] rounded-2xl p-5 shadow-[0_0_35px_rgba(107,47,160,0.25)] flex flex-col relative text-[#ebd9c5]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#3d1d32] pb-3 mb-4 text-[#fbbf24]">
                <span className="text-sm font-bold tracking-[0.2em] font-serif pr-2">⚙️ 系統設定儀</span>
                <button
                  onClick={() => {
                    playClickSound();
                    setIsSettingsOpen(false);
                  }}
                  className="text-xs text-[#fbbf24] hover:text-white cursor-pointer px-3 py-1 border border-amber-600/50 hover:border-amber-400 rounded-lg bg-[#210f27] transition-colors"
                >
                  確認返回
                </button>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] pr-1">

                {/* 1. Audio settings */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-[#8b7869] font-bold tracking-wider uppercase">1. 聲頻音量設定</span>
                  <div className="grid grid-cols-2 gap-3 pb-1">
                    <div>
                      <span className="text-[9px] text-zinc-400 block mb-1">音樂:</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: true, label: '開啟' },
                          { id: false, label: '關閉' }
                        ].map((opt) => (
                          <button
                            key={String(opt.id)}
                            onClick={() => {
                              playClickSound();
                              setSettings(p => ({ ...p, bgmOn: opt.id }));
                            }}
                            className={`py-1 text-[10px] rounded border cursor-pointer transition-colors ${
                              settings.bgmOn === opt.id
                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold'
                                : 'bg-zinc-900 border-zinc-800/80 text-zinc-500'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] text-zinc-400 block mb-1">音效:</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: true, label: '開啟' },
                          { id: false, label: '關閉' }
                        ].map((opt) => (
                          <button
                            key={String(opt.id)}
                            onClick={() => {
                              playClickSound();
                              setSettings(p => ({ ...p, sfxOn: opt.id }));
                            }}
                            className={`py-1 text-[10px] rounded border cursor-pointer transition-colors ${
                              settings.sfxOn === opt.id
                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold'
                                : 'bg-zinc-900 border-zinc-800/80 text-zinc-500'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Text & Layout (字型字幕) */}
                <div className="flex flex-col gap-2 border-t border-[#3d1d32]/30 pt-3">
                  <span className="text-[10px] text-[#8b7869] font-bold tracking-wider uppercase">2. 靈波字體傳輸</span>
                  
                  {/* Typewriter Switcher */}
                  <div>
                    <span className="text-[9px] text-zinc-400 block mb-1">字幕顯化特效 (Subtitles Typo):</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: true, label: '⚡ 逐字跑出 (VN Type)' },
                        { id: false, label: '🚀 一次跑完 (Plain)' }
                      ].map((opt) => (
                        <button
                          key={String(opt.id)}
                          onClick={() => {
                            playClickSound();
                            setSettings(p => ({ ...p, typewriterOn: opt.id }));
                          }}
                          className={`py-1.5 text-[10px] rounded border cursor-pointer transition-colors ${
                            settings.typewriterOn === opt.id
                              ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold shadow-md'
                              : 'bg-zinc-900 border-zinc-800/80 text-zinc-500'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Sizes */}
                  <div className="mt-1">
                    <span className="text-[9px] text-zinc-400 block mb-1">神識字體大小 (Font Scaling):</span>
                    <div className="grid grid-cols-3 gap-2">
                       {[
                        { id: 'small', label: '🔤 小' },
                        { id: 'medium', label: '🔤 中' },
                        { id: 'large', label: '🔤 大' }
                      ].map((size) => (
                        <button
                          key={size.id}
                          onClick={() => {
                            playClickSound();
                            setSettings(p => ({ ...p, fontSize: size.id }));
                          }}
                          className={`py-1.5 text-[10px] rounded border cursor-pointer transition-colors ${
                            settings.fontSize === size.id
                              ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold shadow-md'
                              : 'bg-zinc-900 border-zinc-800/80 text-zinc-500'
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* UI Sizing - User Interface Scale (使用者介面) */}
                  <div className="mt-2.5">
                    <span className="text-[9px] text-zinc-400 block mb-1">使用者介面 (UI Scaling):</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'small', label: '📱 小' },
                        { id: 'medium', label: '📱 中' },
                        { id: 'large', label: '📱 大' }
                      ].map((size) => (
                        <button
                          key={size.id}
                          onClick={() => {
                            playClickSound();
                            setSettings(p => ({ ...p, uiScale: size.id }));
                          }}
                          className={`py-1.5 text-[10px] rounded border cursor-pointer transition-colors ${
                            settings.uiScale === size.id
                              ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold shadow-md'
                              : 'bg-zinc-900 border-zinc-800/80 text-zinc-500'
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Panning & Zoom Focus Animation (圖片的動畫開啟以及關閉) */}
                  <div className="mt-2.5">
                    <span className="text-[9px] text-zinc-400 block mb-1">背景圖片動畫開啟/關閉:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: true, label: '🎬 動畫開啟' },
                        { id: false, label: '🎬 動畫關閉' }
                      ].map((opt) => (
                        <button
                          key={String(opt.id)}
                          onClick={() => {
                            playClickSound();
                            setSettings(p => ({ ...p, bgAnimOn: opt.id }));
                          }}
                          className={`py-1.5 text-[10px] rounded border cursor-pointer transition-colors ${
                            settings.bgAnimOn === opt.id
                              ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold shadow-md'
                              : 'bg-zinc-900 border-zinc-800/80 text-zinc-500'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* 3. Model Assets download check status section */}
                <div className="flex flex-col gap-2 border-t border-[#3d1d32]/30 pt-3">
                  <span className="text-[10px] text-[#8b7869] font-bold tracking-wider uppercase">3. 邪氣物質模型資源庫 ({assetStatus?.stats?.allCached ? '🟢 已足量' : '🟡 部分待補'})</span>
                  
                  {/* Summary progress bars */}
                  {assetStatus ? (
                    <div className="bg-zinc-950/80 p-2 rounded-lg border border-[#522958]/20 flex flex-col gap-1.5 text-[10px]">
                      <div className="flex justify-between items-center text-zinc-300">
                        <span>音訊音軌 mp3:</span>
                        <span className="font-mono text-emerald-400 font-bold">{assetStatus.stats.cachedBgm} / {assetStatus.stats.totalBgm}</span>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-300" 
                          style={{ width: `${(assetStatus.stats.cachedBgm / assetStatus.stats.totalBgm) * 100}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-zinc-300 mt-1">
                        <span>圖片素材 png:</span>
                        <span className="font-mono text-emerald-400 font-bold">{assetStatus.stats.cachedImages} / {assetStatus.stats.totalImages}</span>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-300" 
                          style={{ width: `${(assetStatus.stats.cachedImages / assetStatus.stats.totalImages) * 100}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-zinc-500 italic text-center py-2">讀取內部模型資源狀態中...</div>
                  )}

                  {/* Sync Action Trigger buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={triggerAssetSync}
                      disabled={assetStatus?.isSyncing}
                      className={`flex-1 py-1.5 text-[10px] rounded border font-bold cursor-pointer transition-colors text-center ${
                        assetStatus?.isSyncing
                          ? 'bg-amber-600/20 border-amber-500/40 text-amber-300 animate-pulse'
                          : 'bg-[#ff9800]/10 hover:bg-[#ff9800]/20 border-amber-500/60 text-amber-400'
                      }`}
                    >
                      {assetStatus?.isSyncing ? '⚡ 模型背景同步中...' : '📥 立即同步下載所有素材'}
                    </button>
                    
                    <button
                      onClick={() => {
                        playClickSound();
                        setShowAssetDetails(!showAssetDetails);
                      }}
                      className="px-2 py-1.5 text-[10px] rounded border border-zinc-700 hover:border-zinc-500 bg-zinc-950/50 text-zinc-300 cursor-pointer text-center"
                    >
                      {showAssetDetails ? '▲ 隱藏清單' : '▼ 查看清單'}
                    </button>
                  </div>

                  {/* Detailed Collapsible status table section */}
                  {showAssetDetails && assetStatus && (
                    <div className="flex flex-col gap-2 mt-1 bg-zinc-950/90 p-2.5 rounded-lg border border-[#522958]/30 max-h-[180px] overflow-y-auto">
                      {/* Tabs */}
                      <div className="grid grid-cols-2 gap-1 border-b border-zinc-900 pb-1.5 mb-1.5">
                        <button
                          onClick={() => { playClickSound(); setActiveAssetType('bgm'); }}
                          className={`text-[9px] pb-1 text-center font-bold ${
                            activeAssetType === 'bgm' ? 'text-amber-400 border-b border-amber-400' : 'text-zinc-500'
                          }`}
                        >
                          音軌清單 ({assetStatus.stats.totalBgm})
                        </button>
                        <button
                          onClick={() => { playClickSound(); setActiveAssetType('image'); }}
                          className={`text-[9px] pb-1 text-center font-bold ${
                            activeAssetType === 'image' ? 'text-amber-400 border-b border-amber-400' : 'text-zinc-500'
                          }`}
                        >
                          圖片素材 ({assetStatus.stats.totalImages})
                        </button>
                      </div>

                      {/* tab content BGM */}
                      {activeAssetType === 'bgm' && (
                        <div className="flex flex-col gap-1 font-mono text-[9px]">
                          {assetStatus.bgmList.map((track: any) => (
                            <div key={track.key} className="flex justify-between items-center py-0.5 border-b border-zinc-900 text-zinc-300">
                              <span className="truncate max-w-[150px] font-sans text-left" title={track.name}>{track.name}</span>
                              <div className="flex items-center gap-1">
                                {track.size ? <span className="text-[8px] text-zinc-500">{(track.size / 1024 / 1024).toFixed(1)}M</span> : null}
                                <span className={track.status === 'local' ? 'text-emerald-400 font-bold' : 'text-amber-500 animate-pulse font-bold'}>
                                  {track.status === 'local' ? '● 已存' : '○ 待補'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* tab content Images */}
                      {activeAssetType === 'image' && (
                        <div className="flex flex-col gap-1 font-mono text-[9px]">
                          {assetStatus.imagesList.map((img: any, idx: number) => (
                            <div key={img.id} className="flex justify-between items-center py-0.5 border-b border-zinc-900 text-zinc-400">
                              <span className="text-left font-sans">圖檔 {idx + 1} ({img.id.substring(0,6)}...)</span>
                              <div className="flex items-center gap-1">
                                {img.size ? <span className="text-[8px] text-zinc-500">{(img.size / 1024).toFixed(0)}K</span> : null}
                                <span className={img.status === 'local' ? 'text-emerald-400 font-bold' : 'text-amber-500 animate-pulse font-bold'}>
                                  {img.status === 'local' ? '● 已存' : '○ 待補'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 4. Reset & Return Section */}
                {isPlaying && (
                  <div className="flex flex-col gap-2 border-t border-[#3d1d32]/30 pt-3 pb-1">
                    <span className="text-[10px] text-[#8b7869] font-bold tracking-wider uppercase">4. 重設與返回</span>
                    <button
                      onClick={() => {
                        playClickSound();
                        restartAndReset();
                        setIsSettingsOpen(false);
                      }}
                      className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/40 hover:border-rose-450 text-rose-300 hover:text-white rounded-lg text-xs font-bold tracking-[0.2em] pl-[0.2em] cursor-pointer transition-colors text-center flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(239,68,68,0.1)]"
                    >
                      <span>🔄 返回主畫面</span>
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* A. NOTIFICATION TOAST OVERLAY */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -25, x: '-50%' }}
            className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 border rounded-full text-xs font-sans font-bold shadow-2xl tracking-wide ${
              toast.type === 'green'
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                : toast.type === 'orange'
                ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* B. INSPECTION SCANNER PANEL */}
      <AnimatePresence>
        {activeScan && (
          <ScanPopup
            item={activeScan.item}
            img={activeScan.img}
            result={activeScan.result}
            isHazardous={activeScan.isHazardous}
            onClose={() => {
              setActiveScan(null);
              advanceDialogue();
            }}
          />
        )}
      </AnimatePresence>

      {/* C. GRASS EVENT POPUP */}
      <AnimatePresence>
        {activeGrassEvent && (
          <GrassPopup
            currentGrass={state.grass}
            img={IMG.禾火草}
            onPick={() => {
              setActiveGrassEvent(false);
              
              // Increment grass
              setState((prev) => {
                const updatedGrass = prev.grass + 1;
                const limit = 100 + updatedGrass * 10;
                const newEnergy = Math.min(limit, prev.energy + 10);
                return {
                  ...prev,
                  grass: updatedGrass,
                  energy: newEnergy,
                };
              });

              playSparkleSound();
              showToast('🌿 拾取禾火草，行動精力增加 10%！', 'orange');
              
              // Proceed next
              setTimeout(() => {
                if (pendingStageTransition !== null) {
                  const cleared = pendingStageTransition;
                  setPendingStageTransition(null);
                  executeStageTransition(cleared);
                } else {
                  advanceDialogue();
                }
              }, 120);
            }}
            onSkip={() => {
              setActiveGrassEvent(false);
              showToast('🌾 放下禾火草，避開干擾。', 'orange');
              setTimeout(() => {
                if (pendingStageTransition !== null) {
                  const cleared = pendingStageTransition;
                  setPendingStageTransition(null);
                  executeStageTransition(cleared);
                } else {
                  advanceDialogue();
                }
              }, 100);
            }}
          />
        )}
      </AnimatePresence>

      {/* D. MEAL FEAST CHANGER SCREEN */}
      <AnimatePresence>
        {activeFoodEvent && (
          <FoodScreen
            location={activeFoodEvent.location}
            onDone={(energyRecovered, lostHp, logMsg) => {
              setActiveFoodEvent(null);
              
              let isBlocked = false;
              setState((p) => {
                const maxLimit = 100 + p.grass * 10;
                const finalEnergy = Math.min(maxLimit, Math.max(0, p.energy + energyRecovered));
                
                let nextMaxHp = p.maxHp;
                let nextHp = p.hp;
                let nextLocked = p.lockedHearts;

                if (lostHp > 0) {
                  if (p.lockedHearts > 0 || p.grass >= 4) {
                    isBlocked = true;
                  } else {
                    // Direct heart expansion (maxHp + positive effect value)
                    nextMaxHp = Math.min(30, p.maxHp + lostHp);
                    nextHp = Math.min(nextMaxHp - p.lockedHearts, p.hp + lostHp);
                  }
                } else if (lostHp < 0) {
                  // Damage subduction and consecutive recalculation of maxHp and lockedCount to prevent gaps (斷層)
                  // 1. Subtract lostHp (which is negative, so it decreases nextMaxHp) from maxHp
                  nextMaxHp = Math.max(1, p.maxHp + lostHp);
                  
                  // 2. Recalculate locked count for the new nextMaxHp and current grass
                  let lockCount = 0;
                  if (p.grass === 4) {
                    lockCount = 10;
                  } else if (p.grass === 5) {
                    lockCount = Math.ceil(nextMaxHp / 2);
                  } else if (p.grass === 6) {
                    lockCount = nextMaxHp - 1;
                  }
                  nextLocked = lockCount;
                  
                  // 3. Compute the allowed max active red hearts
                  const allowedMax = nextMaxHp - nextLocked;
                  
                  // 4. Subtract from current active red hearts and clip values
                  const rawHp = p.hp + lostHp; // Since lostHp is negative, this reduces hp
                  nextHp = Math.max(0, Math.min(rawHp, allowedMax));
                }

                if (nextHp <= 0) {
                  setTimeout(() => {
                    triggerGameOver(
                      false,
                      '<b>☠ 幽冥毒瘴發作……</b><br /><br />你服用了陰煞瘴氣深度侵蝕染毒的軍用黑紅乾糧，狂暴毒性瞬間摧毀了你體內所有殘存 of 的護命真陽星魄。生命星印傾刻破裂覆滅，你痛苦地不支倒地，宣告死亡。'
                    );
                  }, 150);
                }

                return {
                  ...p,
                  maxHp: nextMaxHp,
                  hp: nextHp,
                  energy: finalEnergy,
                  lockedHearts: nextLocked,
                };
              });

              if (isBlocked) {
                addLogEvent(`🍏 配膳結果：${logMsg}（⚠️ 禾火草鎖定：無法增加生命星印）`, 'alert');
                showToast?.('⚠️ 禾火草純陽鎖定中，生命無法增加！', 'orange');
              } else {
                addLogEvent(`🍏 配膳結果：${logMsg}`, energyRecovered > 0 ? 'success' : 'alert');
              }
              
              // Proceed dialog step after ingestion complete
              setTimeout(() => {
                advanceDialogue();
              }, 300);
            }}
          />
        )}
      </AnimatePresence>

      {/* E. HEAVY COMBAT PANEL */}
      <AnimatePresence>
        {activeCombat && (
          <CombatScreen
            enemyName={activeCombat.enemy}
            initialHp={activeCombat.hp}
            enemyImg={activeCombat.enemyImg}
            weapons={state.weapons}
            heldGrass={state.grass}
            addLogEvent={addLogEvent}
            playerHp={state.hp}
            playerMaxHp={state.maxHp}
            playerEnergy={state.energy}
            onSpendEnergy={(amount) => {
              setState((prev) => ({
                ...prev,
                energy: Math.max(0, prev.energy - amount),
              }));
            }}
            onPlayerHurt={(hearts) => {
              if (hearts === -100) {
                // SPECIAL TRIGGER CODE: First Hit Shield Activated (Drains all grasses to 0)
                setState((prev) => ({
                  ...prev,
                  grass: 0,
                  lockedHearts: 0,
                  firstCombatHit: false,
                }));
                showToast('🛡 禾火草神聖陽氣震散！格擋成功，封印心心全部解除！', 'orange');
              } else {
                // Normal damage infliction
                setState((prev) => {
                  const newHp = Math.max(0, prev.hp - hearts);
                  if (newHp <= 0) {
                    // Close combat and trigger game over
                    setActiveCombat(null);
                    triggerGameOver(
                      false,
                      '<b>☠ 心脈衰竭身亡……</b><br /><br />在山本太一郎少尉兇暴的「近衛軍刀流」魔刃重斬下，你的抵抗崩潰，生命值耗為零。冷冽 of the blade markers cross your soul, fading your consciousness into the eternal quiet night.'
                    );
                  }
                  return {
                    ...prev,
                    hp: newHp,
                    firstCombatHit: false, // shield can only cover the first strike
                  };
                });
                showToast(`💥 受到山本軍刀反擊！損失 ${hearts} 顆心！`, 'red');
              }
            }}
            onWin={() => {
              setActiveCombat(null);
              // Recover 2 heart cells as transition bonus
              setState((prev) => {
                const safeHp = Math.min(prev.maxHp - prev.lockedHearts, prev.hp + 2);
                return {
                  ...prev,
                  hp: safeHp,
                };
              });
              showToast('🏆 戰勝敵手！生命回復 2！', 'green');
              addLogEvent('🏆 戰火熄滅：戰勝敵方，奪回局勢。', 'success');
            }}
            onEscape={() => {
              setActiveCombat(null);
              showToast('💨 你已從戰鬥中撤退！暫時避其鋒芒。', 'orange');
              addLogEvent('💨 走為上策：在危急中脫離了戰場。', 'alert');
            }}
            onRestartCombat={(hp, energy, grass) => {
              setState((prev) => ({
                ...prev,
                hp,
                energy,
                grass,
                firstCombatHit: grass > 0,
              }));
              showToast('🔄 戰鬥重新開始！狀態及生命已回復。', 'orange');
            }}
          />
        )}
      </AnimatePresence>

      {/* H. CHAPTER COMPLETE STAGE BOX */}
      <AnimatePresence>
        {activeStageClear !== null && (
          <div className="fixed inset-0 z-50 bg-[#050305]/98 text-center font-serif flex flex-col items-center justify-center p-6 select-none overflow-hidden">
            {/* Immersive background image underlay based on the cleared stage */}
            <img
              src={activeStageClear === 0 ? IMG.過關途中 : activeStageClear === 1 ? IMG.趕路 : activeStageClear === 2 ? IMG.戰勝山本 : IMG.華陽市場}
              alt="Stage Clear Background"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none scale-105 transition-opacity duration-1000"
              style={{ 
                filter: 'brightness(0.35) saturate(0.8) contrast(1.1) blur(0.5px)'
              }}
            />
            {/* Background accent glow */}
            <div className="absolute inset-0 bg-radial-at-c-b from-[#251542]/25 via-transparent to-transparent pointer-events-none" />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center justify-center mb-6 font-sans text-xl font-black">
                {activeStageClear === 0 ? 'Ⅰ' : activeStageClear === 1 ? 'Ⅱ' : activeStageClear === 2 ? 'Ⅲ' : 'Ⅳ'}
              </div>

              <h2 className="text-2xl font-black text-amber-300 tracking-[0.2em] pl-[0.2em] mb-4">
                關卡完成
              </h2>

              <div className="w-full bg-[#110912]/75 border border-[#3d2040]/35 rounded-xl p-5 mb-8 text-left text-xs md:text-sm text-[#e8ddd0]/90 leading-relaxed font-sans shadow-inner">
                {activeStageClear === 0 ? (
                  <>
                    <p className="font-bold text-amber-400 mb-2 border-b border-amber-955/20 pb-1">第一關完成：師大校區、新冒險開啟！</p>
                    帶著探測機與重型純鑄大鐵鍋，四個夥伴堅定地邁出了彰師大的校區牌坊。
                    <br /><br />
                    眼見前方古木蕭索、山谷黑紫色濃霧如同巨浪，一隻百年冤魂的咆哮從「彰化軍人忠靈祠」的方向隱隱震響。前方還有怎樣的宿怨與惡鬥在等待著大家？
                    <br /><br />
                    <span className="text-emerald-400 font-bold">★ 通關餽贈：生命回復 2！</span>
                  </>
                ) : activeStageClear === 1 ? (
                  <>
                    <p className="font-bold text-amber-400 mb-2 border-b border-amber-955/20 pb-1">第二關完成：超淨怨氣、迎接新天！</p>
                    山本少尉戰死百年的幽魔厲靈，在村民起義戰士與英勇英靈的金色金光怒潮下終告平息。
                    <br /><br />
                    怨結驅散、山風吹拂，忠靈祠恢復了一片乾淨。而安婷、夢恩、秉任和翰倫正要往彰化高中繼續前進，查探異變的餘波……
                    <br /><br />
                    <span className="text-emerald-400 font-bold">★ 通關餽贈：生命回復 2！</span>
                  </>
                ) : activeStageClear === 2 ? (
                  <>
                    <p className="font-bold text-amber-400 mb-2 border-b border-amber-955/20 pb-1">第三關完成：查探真相、轉入鬧市！</p>
                    大家成功查明了部分異變原因。在經歷了彰化高中的對話和探索後，為繼續清算邪煞之源，四人準備經過人氣喧囂的華陽市場！
                    <br /><br />
                    市場內正因危機而混亂一片，各色人等搶奪食物與資源。他們能否在混亂的集市中找到安立之所？
                    <br /><br />
                    <span className="text-emerald-400 font-bold">★ 通關餽贈：生命回復 2！</span>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-amber-400 mb-2 border-b border-amber-955/20 pb-1">第四關完成：市場突圍、前進進德！</p>
                    在華陽市場的喧擾與推擠中，四人終於克制了食肆瘴氣、避開了打鬥中的人群。
                    <br /><br />
                    看著眼前逐漸平息的騷亂，四人深深吸一口氣，將希望的目光投向了最終的目的地——進德校區！
                    <br /><br />
                    <span className="text-emerald-400 font-bold">★ 通關餽贈：生命回復 2！</span>
                  </>
                )}
              </div>

              <div className="w-full flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const cleared = activeStageClear;
                    setActiveStageClear(null);

                    // Restate energy/hp parameters on stage transitions (heal 2 HP, but do NOT increase max limits or award permanent stars)
                    setState((p) => {
                      const bonusHp = Math.min(p.maxHp - p.lockedHearts, p.hp + 2);
                      const cost = p.grass === 5 ? 70 : 65;
                      const transitEnergy = Math.max(0, p.energy - cost);
                      return {
                        ...p,
                        hp: bonusHp,
                        energy: transitEnergy,
                      };
                    });

                    // Queue transition and open He-Huo-Cao query screen!
                    setPendingStageTransition(cleared);
                    setActiveGrassEvent(true);
                  }}
                  id="continue-stage-btn"
                  className="py-2.5 px-10 bg-gradient-to-r from-amber-600 to-amber-500 border border-amber-400/35 text-amber-50 font-serif text-sm font-bold tracking-[0.25em] cursor-pointer rounded-lg shadow-lg text-center flex items-center justify-center"
                >
                  繼續前進
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* J. INVENTORY PANEL MODAL */}
      <InventoryPanel
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
        inventory={state.inventory}
        weapons={state.weapons}
      />

      {/* I. MASTER TERMINAL GAME OVER / VICTORY OVERLAYS */}
      <AnimatePresence>
        {gameOver && (
          <GameOverScreen
            isVictory={gameOver.isVictory}
            message={gameOver.msg}
            onRestart={restartAndReset}
          />
        )}
      </AnimatePresence>

      {/* Global Persistently Displayed Battle/Energy/Story Records in Bottom-Left Corner */}
      {isPlaying && (
        <BattleLogger 
          logs={globalLogs} 
          isInCombat={!!activeCombat} 
          isExternalExpanded={isDiaryOpen}
          onExternalExpandedClose={() => setIsDiaryOpen(false)}
        />
      )}

    </div>
  );
}
