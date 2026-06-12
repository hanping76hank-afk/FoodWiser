import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scroll, X } from 'lucide-react';

export interface LogEvent {
  id: string;
  timestamp: string;
  text: string;
  type: string; // 'story' | 'system' | 'combat' | 'item' | 'danger' | 'success' | 'player' | 'enemy' | 'alert'
}

interface BattleLoggerProps {
  logs: LogEvent[];
  isInCombat: boolean;
  isExternalExpanded?: boolean;
  onExternalExpandedClose?: () => void;
}

export default function BattleLogger({ logs, isInCombat, isExternalExpanded, onExternalExpandedClose }: BattleLoggerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const detailScrollRef = useRef<HTMLDivElement>(null);

  const isExpandedActive = isExternalExpanded !== undefined ? isExternalExpanded : isExpanded;
  const setExpandedActive = (val: boolean) => {
    if (isExternalExpanded !== undefined) {
      if (!val && onExternalExpandedClose) onExternalExpandedClose();
    } else {
      setIsExpanded(val);
    }
  };

  // Auto scroll to bottom of logs on new items
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (isExpandedActive && detailScrollRef.current) {
      setTimeout(() => {
        if (detailScrollRef.current) {
          detailScrollRef.current.scrollTop = detailScrollRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [isExpandedActive, logs]);

  // Click handler to toggle expansion (only allowed when not in combat)
  const handleToggleExpand = () => {
    if (isInCombat) return;
    setExpandedActive(!isExpandedActive);
  };

  // Helper to color-code different log types
  const getLogColors = (type: string) => {
    switch (type) {
      case 'player':
        return {
          badge: 'text-emerald-400 bg-emerald-950/45 border-emerald-900/40',
          text: 'text-emerald-100 font-medium',
          symbol: '⚡',
          label: '我方'
        };
      case 'enemy':
        return {
          badge: 'text-red-400 bg-red-950/35 border-red-900/40',
          text: 'text-rose-200',
          symbol: '👹',
          label: '敵方'
        };
      case 'system':
        return {
          badge: 'text-purple-400 bg-purple-950/30 border-purple-900/40',
          text: 'text-purple-100 font-medium',
          symbol: '📡',
          label: '系統'
        };
      case 'alert':
        return {
          badge: 'text-amber-400 bg-amber-950/25 border-amber-900/35',
          text: 'text-amber-200',
          symbol: '⚠️',
          label: '警告'
        };
      case 'success':
        return {
          badge: 'text-teal-400 bg-teal-950/30 border-teal-900/40',
          text: 'text-teal-100 font-bold',
          symbol: '🎉',
          label: '成功'
        };
      case 'story':
        return {
          badge: 'text-blue-400 bg-blue-950/25 border-blue-900/35',
          text: 'text-zinc-200 font-serif',
          symbol: '💬',
          label: '劇情'
        };
      case 'item':
        return {
          badge: 'text-yellow-400 bg-yellow-950/25 border-yellow-905/35',
          text: 'text-yellow-105',
          symbol: '🎒',
          label: '道具'
        };
      default:
        return {
          badge: 'text-zinc-400 bg-zinc-950/40 border-zinc-900',
          text: 'text-zinc-300',
          symbol: '💡',
          label: '紀錄'
        };
    }
  };

  return (
    <>
      {/* 1. SOLID INTEGRATED CONTAINER (Bottom Left, Aligned with HP/Energy Left Edge and Dialog Box Bottom) */}
      {isInCombat && (
        <div 
          id="battle-logger-container" 
          className="fixed bottom-3 left-3 md:bottom-4 md:left-4 z-55 select-none flex flex-col transition-all duration-300 tracking-wide w-[215px] md:w-[240px] h-[110px] border border-red-950 bg-gradient-to-br from-[#12000c]/98 to-[#0a0008]/96 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.2)] pointer-events-none"
        >
          {/* Header rail */}
          <div className="flex items-center justify-between px-2.5 py-1 border-b border-stone-900/90 shrink-0 bg-red-955/20">
            <div className="flex items-center gap-1">
              <Scroll className="w-3 h-3 text-red-500 animate-pulse" />
              <span className="font-sans font-black uppercase text-[8.5px] tracking-widest text-[#d6c3b0]">
                戰役提示
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[7.5px] font-sans text-red-400 font-bold bg-red-955/40 px-1 py-0.2 rounded border border-red-900/35 animate-pulse">
                戰役中
              </span>
            </div>
          </div>

          {/* Minimized or Combat active log rows list */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-1.5 flex flex-col gap-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pointer-events-none select-none"
          >
            {logs.length === 0 ? (
              <div className="text-[9px] font-mono text-zinc-500/80 my-auto text-center italic">
                📓 戰役紀載中...
              </div>
            ) : (
              logs.map((log) => {
                const theme = getLogColors(log.type);
                const fontTextClass = 'text-[10px] font-bold text-rose-100 leading-tight font-sans';
                const fontBadgeClass = 'text-[7px] font-mono';
                const fontTimeClass = 'text-[7px]';

                return (
                  <div
                    key={log.id}
                    className="p-1 border rounded bg-red-955/5 border-red-955/20 flex flex-col gap-0.5"
                  >
                    <div className="flex items-center justify-between text-[7px] font-mono select-none mb-0.5">
                      <span className={`px-1 rounded font-black tracking-wider flex items-center gap-0.5 leading-none ${theme.badge} ${fontBadgeClass}`}>
                        <span>{theme.symbol}</span>
                        <span>{theme.label}</span>
                      </span>
                      <span className={`text-[#8b7869] font-semibold ${fontTimeClass}`}>{log.timestamp}</span>
                    </div>
                    <p className={`whitespace-pre-line ${fontTextClass} ${theme.text}`}>
                      {log.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 2. OVERLAY BACKDROP AND ENLARGED PANEL VIEW */}
      <AnimatePresence>
        {isExpandedActive && (
          <div className="fixed inset-0 bg-[#040103]/85 backdrop-blur-sm z-55 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="relative w-full max-w-2xl h-[85vh] bg-[#140612] border-2 border-amber-600/60 rounded-3xl p-5 shadow-[inset_0_2px_30px_rgba(0,0,0,0.9),0_20px_50px_rgba(0,0,0,0.95)] flex flex-col pointer-events-auto"
            >
              {/* Top Control Bar of enlarged log */}
              <div className="flex items-center justify-between pb-3.5 border-b border-amber-900/20 select-none">
                <div className="flex items-center gap-2">
                  <Scroll className="w-5 h-5 text-amber-500 animate-pulse" />
                  <span className="font-sans font-black tracking-widest text-amber-400 text-sm uppercase">
                    八卦山古道生存日記公文與冒險提示 (全紀錄)
                  </span>
                </div>
                
                <button
                  onClick={() => setExpandedActive(false)}
                  className="p-1.5 bg-amber-950/30 hover:bg-amber-900/50 border border-amber-600/30 rounded-full text-amber-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Main body for logs */}
              <div 
                ref={detailScrollRef}
                className="flex-1 overflow-y-auto py-4 pr-1 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-amber-900/30 scrollbar-track-transparent"
              >
                {logs.length === 0 ? (
                  <div className="text-sm font-mono text-stone-500 my-auto text-center italic">
                    💡 探索日記目前無進度，尚未記錄任何求生足跡。
                  </div>
                ) : (
                  logs.map((log) => {
                    const theme = getLogColors(log.type);
                    return (
                      <div
                        key={`enlarged-${log.id}`}
                        className="flex flex-col gap-1.5 p-3.5 bg-black/45 border border-amber-950/30 rounded-xl transition-all duration-155"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono select-none">
                          <span className={`px-2 py-0.5 rounded-md font-sans font-black tracking-wider flex items-center gap-1.5 leading-none text-xs ${theme.badge}`}>
                            <span>{theme.symbol}</span>
                            <span>{theme.label.toUpperCase()}</span>
                          </span>
                          <span className="text-stone-500 font-bold">{log.timestamp}</span>
                        </div>
                        <p className={`text-xs sm:text-sm font-sans leading-relaxed tracking-normal whitespace-pre-line ${theme.text}`}>
                          {log.text}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom footer bar summary */}
              <div className="border-t border-amber-900/20 pt-3 flex justify-between items-center text-xs text-stone-500 select-none">
                <span>累計寫入日記節點數: {logs.length}</span>
                <span>系統狀態: 日記與生存提示功能運作良好</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
