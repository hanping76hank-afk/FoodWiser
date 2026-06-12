/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Radio, AlertOctagon } from 'lucide-react';
import { startScannerSound, stopScannerSound, playChoiceSound } from '../utils/audio';

interface ScanPopupProps {
  item: string;
  img?: string;
  result: string;
  isHazardous?: boolean;
  onClose: () => void;
}

export default function ScanPopup({ item, img, result, isHazardous: isHazardousProp, onClose }: ScanPopupProps) {
  // Check if target is highly hazardous (e.g., contains blackened lamp indicators or heavy warnings)
  const isHazardous = 
    isHazardousProp !== undefined
      ? isHazardousProp
      : (result.includes('⚫') || 
         result.includes('黑燈') || 
         result.includes('⚠') || 
         result.includes('警告') || 
         result.includes('不可食用') || 
         result.includes('劇毒') ||
         item === '供果' ||
         item === '麵包蟲');

  useEffect(() => {
    // Start scanner beeps - pass isHazardous flag to trigger rapid heartbeat sirens!
    startScannerSound(isHazardous);
    return () => {
      stopScannerSound();
    };
  }, [isHazardous]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#050104]/94 font-sans select-none overflow-hidden">
      
      {/* Dynamic ambient backing glow based on danger severity */}
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-1000"
        style={{
          background: isHazardous
            ? 'radial-gradient(circle at center, rgba(239,68,68,0.18) 0%, transparent 80%)'
            : 'radial-gradient(circle at center, rgba(16,185,129,0.15) 0%, transparent 80%)'
        }}
      />

      {/* Styled Holographic Scan Board */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className={`relative w-full max-w-lg md:max-w-2xl border rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col transition-all duration-500 bg-opacity-95 ${
          isHazardous
            ? 'border-rose-500/50 bg-[#250811] shadow-[0_0_40px_rgba(244,63,94,0.35)]'
            : 'border-emerald-500/40 bg-[#031d0d] shadow-[0_0_40px_rgba(16,185,129,0.3)]'
        }`}
      >
        {/* Animated matrix lines decoration */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none rounded-2xl" />

        {/* Dynamic moving laser scanner line: slides twice as fast in hazardous states */}
        <div 
          className={`absolute inset-x-0 h-[2px] pointer-events-none shadow-lg`}
          style={{
            background: isHazardous 
              ? 'linear-gradient(to right, transparent, #ef4444, #f43f5e, #ef4444, transparent)' 
              : 'linear-gradient(to right, transparent, #34d399, #10b981, #34d399, transparent)',
            boxShadow: isHazardous ? '0 0 16px #f43f5e' : '0 0 12px #34d399',
            animation: `scanline ${isHazardous ? '1.1s' : '2.2s'} linear infinite`
          }}
        />

        {/* Header with spinning device frequency indicator */}
        <div className={`flex items-center justify-between border-b pb-2 mb-3 transition-colors ${
          isHazardous ? 'border-rose-500/20 text-rose-400' : 'border-emerald-500/20 text-emerald-400'
        }`}>
          <div className="flex items-center gap-1.5">
            {isHazardous ? (
              <AlertOctagon className="w-4 h-4 animate-[bounce_1s_infinite]" />
            ) : (
              <Radio className="w-4 h-4 animate-pulse" />
            )}
            <span className="text-[11px] md:text-xs font-mono font-black tracking-[0.2em] uppercase">
              {isHazardous ? '☣️ 偵測到狂暴瘴氣-黑燈 ☣️' : '探測儀偵測中'}
            </span>
          </div>
          <span className="text-[9px] md:text-[10px] font-mono opacity-60">FREQ: {isHazardous ? '99.96' : '18.95'} MHz</span>
        </div>

        {/* Scanned Material Image Asset */}
        {img && (
          <div className={`relative w-full h-44 md:h-56 border rounded-xl overflow-hidden flex items-center justify-center mb-4 shadow-inner transition-colors ${
            isHazardous ? 'bg-[#0f0105]/90 border-rose-500/10' : 'bg-[#010803]/85 border-emerald-500/10'
          }`}>
            <img
              src={img}
              alt={item}
              referrerPolicy="no-referrer"
              className={`max-w-full max-h-full object-contain filter max-h-[160px] md:max-h-[210px] transition-all duration-350 ${
                isHazardous ? 'brightness-105 saturate-[1.2] hue-rotate-[340deg]' : 'brightness-95'
              }`}
            />
            {/* Overlay grid overlaying the image */}
            <div className={`absolute inset-0 pointer-events-none ${
              isHazardous 
                ? 'bg-[radial-gradient(circle_at_center,transparent_45%,rgba(37,8,17,0.55)_95%)]' 
                : 'bg-[radial-gradient(circle_at_center,transparent_45%,rgba(3,29,13,0.5)_95%)]'
            }`} />
          </div>
        )}

        {/* Analysis Titles and Details */}
        <div className={`text-left border p-4 md:p-5 rounded-xl transition-colors ${
          isHazardous 
            ? 'bg-[#18030b]/80 border-rose-500/15' 
            : 'bg-[#021307]/75 border-emerald-500/15'
        }`}>
          <h3 className={`text-xs md:text-sm font-bold tracking-wider mb-2 flex items-center gap-1.5 ${
            isHazardous ? 'text-rose-400' : 'text-emerald-300'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isHazardous ? 'bg-rose-500 animate-[ping_0.5s_infinite]' : 'bg-emerald-400 animate-ping'
            }`} />
            分析標的：{item}
          </h3>
          <p className={`text-xs md:text-sm leading-relaxed font-sans font-medium whitespace-pre-wrap ${
            isHazardous ? 'text-rose-100' : 'text-[#dfecd7]'
          }`}>
            {result}
          </p>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            playChoiceSound();
            onClose();
          }}
          className={`mt-5 w-full py-3 border font-serif text-xs md:text-sm font-bold tracking-[0.25em] pl-[0.25em] cursor-pointer rounded-xl transition-all ease-out ${
            isHazardous
              ? 'bg-gradient-to-r from-rose-700 to-red-600 border-rose-400/40 text-rose-50 hover:text-white shadow-[0_4px_16px_rgba(244,63,94,0.3)]'
              : 'bg-gradient-to-r from-emerald-600/80 to-teal-600/80 border-emerald-400/40 text-emerald-100 hover:text-white shadow-[0_4px_16px_rgba(16,185,129,0.2)]'
          }`}
        >
          {isHazardous ? '確認危害' : '確認探測'}
        </motion.button>
      </motion.div>

      {/* Styled global style definition for scanner animation injected natively */}
      <style>{`
        @keyframes scanline {
          0% { top: 0%; opacity: 0.2; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
