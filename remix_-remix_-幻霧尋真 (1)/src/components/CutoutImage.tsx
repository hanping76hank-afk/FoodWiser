import React, { useState, useEffect, useRef } from 'react';

interface CutoutImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  bypassCutout?: boolean;
}

// Global cache to avoid processing the same image multiple times
const cutoutCache: Record<string, string> = {};

export default function CutoutImage({ src, alt = '', className = '', style, bypassCutout = false }: CutoutImageProps) {
  const [processedSrc, setProcessedSrc] = useState<string>(src);
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!src) return;

    // Direct Google Drive URLs through our local high-speed proxy to bypass browser CORS restrictions and enable clean pixel manipulation
    const match = src.match(/https:\/\/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
    const srcToLoad = match ? `/images/${match[1]}.png` : src;

    if (bypassCutout) {
      setProcessedSrc(srcToLoad);
      return;
    }

    // Check if we have processed this image already
    if (cutoutCache[srcToLoad]) {
      setProcessedSrc(cutoutCache[srcToLoad]);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = srcToLoad;

    img.onload = () => {
      try {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const totalPixels = width * height;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          if (isMounted.current) setProcessedSrc(srcToLoad);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // BFS Helper Arrays
        const isBg = new Uint8Array(totalPixels);
        const queue: number[] = [];

        // Sample the base transparent/colored corners to detect background profile
        const cornerR = data[0];
        const cornerG = data[1];
        const cornerB = data[2];
        const cornerA = data[3];
        const isCornerOpaque = cornerA > 150;

        // Check if pixel at specific channel is near-white or matches outer border tone
        const isPixelBgCompatible = (idx: number) => {
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];

          // Already transparent
          if (a < 50) return true;

          // 1. Near-white Check
          if (r > 220 && g > 220 && b > 220) {
            return true;
          }

          // 2. Corner Similarity Check
          if (isCornerOpaque) {
            const diff = Math.abs(r - cornerR) + Math.abs(g - cornerG) + Math.abs(b - cornerB);
            if (diff < 45) {
              return true;
            }
          }

          return false;
        };

        // Push all border positions into standard BFS queue to begin outer detection
        for (let x = 0; x < width; x++) {
          // Top row
          const topPos = x;
          if (isPixelBgCompatible(topPos * 4)) {
            if (!isBg[topPos]) {
              isBg[topPos] = 1;
              queue.push(topPos);
            }
          }
          // Bottom row
          const botPos = (height - 1) * width + x;
          if (isPixelBgCompatible(botPos * 4)) {
            if (!isBg[botPos]) {
              isBg[botPos] = 1;
              queue.push(botPos);
            }
          }
        }

        for (let y = 0; y < height; y++) {
          // Left side
          const leftPos = y * width;
          if (isPixelBgCompatible(leftPos * 4)) {
            if (!isBg[leftPos]) {
              isBg[leftPos] = 1;
              queue.push(leftPos);
            }
          }
          // Right side
          const rightPos = y * width + (width - 1);
          if (isPixelBgCompatible(rightPos * 4)) {
            if (!isBg[rightPos]) {
              isBg[rightPos] = 1;
              queue.push(rightPos);
            }
          }
        }

        // Run non-recursive BFS to mark connected outer-background only
        let head = 0;
        while (head < queue.length) {
          const pos = queue[head++];
          const cx = pos % width;
          const cy = Math.floor(pos / width);

          // Check 4-Neighbors
          const neighbors = [
            { nx: cx - 1, ny: cy },
            { nx: cx + 1, ny: cy },
            { nx: cx, ny: cy - 1 },
            { nx: cx, ny: cy + 1 }
          ];

          for (const { nx, ny } of neighbors) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nPos = ny * width + nx;
              if (!isBg[nPos]) {
                if (isPixelBgCompatible(nPos * 4)) {
                  isBg[nPos] = 1;
                  queue.push(nPos);
                }
              }
            }
          }
        }

        // Dissolve outer background pixels (marked in BFS)
        for (let i = 0; i < totalPixels; i++) {
          if (isBg[i]) {
            data[i * 4 + 3] = 0; // Transparent
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');

        cutoutCache[srcToLoad] = dataUrl;
        if (isMounted.current) {
          setProcessedSrc(dataUrl);
        }
      } catch (e) {
        console.warn('Canvas pixel BFS cutout failed, fallback to direct rendering:', e);
        if (isMounted.current) {
          setProcessedSrc(srcToLoad);
        }
      }
    };

    img.onerror = () => {
      if (isMounted.current) {
        setProcessedSrc(srcToLoad);
      }
    };
  }, [src]);

  return (
    <img
      src={processedSrc}
      alt={alt}
      className={className}
      style={{
        ...style,
        mixBlendMode: 'normal',
        filter: bypassCutout
          ? (style?.filter || undefined)
          : style?.filter 
            ? `${style.filter} drop-shadow(1px 0px 0px rgba(255, 255, 255, 0.95)) drop-shadow(-1px 0px 0px rgba(255, 255, 255, 0.95)) drop-shadow(0px 1px 0px rgba(255, 255, 255, 0.95)) drop-shadow(0px -1px 0px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 4px rgba(0, 0, 0, 0.85))` 
            : 'drop-shadow(1px 0px 0px rgba(255, 255, 255, 0.95)) drop-shadow(-1px 0px 0px rgba(255, 255, 255, 0.95)) drop-shadow(0px 1px 0px rgba(255, 255, 255, 0.95)) drop-shadow(0px -1px 0px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 4px rgba(0, 0, 0, 0.85))'
      }}
      referrerPolicy="no-referrer"
      onError={() => {
        if (processedSrc !== src) {
          setProcessedSrc(src);
        }
      }}
    />
  );
}
