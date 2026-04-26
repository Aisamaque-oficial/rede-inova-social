
"use client";

import React, { useEffect } from 'react';
import { useAccessibility } from '@/context/accessibility-context';

export const ReadingAids = () => {
  const { readingMaskMode, isReadingGuideActive } = useAccessibility();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const topRef = React.useRef<HTMLDivElement>(null);
  const focusRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const guideRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (readingMaskMode === 'off' && !isReadingGuideActive) return;

    const maskHeights = { small: 60, medium: 120, large: 240, off: 0 };
    const h = maskHeights[readingMaskMode as keyof typeof maskHeights] || 0;

    const handleMouseMove = (e: MouseEvent) => {
        const y = e.clientY;
        
        if (topRef.current) topRef.current.style.height = `${Math.max(0, y - h/2)}px`;
        if (focusRef.current) {
            focusRef.current.style.top = `${y - h/2}px`;
            focusRef.current.style.height = `${h}px`;
        }
        if (bottomRef.current) bottomRef.current.style.height = `${Math.max(0, window.innerHeight - (y + h/2))}px`;
        if (guideRef.current) guideRef.current.style.top = `${y}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingMaskMode, isReadingGuideActive]);

  if (readingMaskMode === 'off' && !isReadingGuideActive) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100000] pointer-events-none overflow-hidden h-screen w-screen">
      {/* Reading Mask Implementation with 3 Layers */}
      {readingMaskMode !== 'off' && (
        <>
            <div ref={topRef} className="absolute top-0 left-0 right-0 bg-black/60" />
            <div ref={focusRef} className="absolute left-0 right-0 border-y-[3px] border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.3)] bg-transparent" />
            <div ref={bottomRef} className="absolute bottom-0 left-0 right-0 bg-black/60" />
        </>
      )}

      {/* Reading Guide (Single Focus Line if active) */}
      {isReadingGuideActive && (
        <div ref={guideRef} className="absolute left-0 right-0 h-1 bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.8)] z-[100001]" />
      )}
    </div>
  );
};
