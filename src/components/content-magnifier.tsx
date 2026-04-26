"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useAccessibility } from '@/context/accessibility-context';

export const ContentMagnifier = () => {
  const { isMagnifierActive } = useAccessibility();
  const [hoveredText, setHoveredText] = useState("");
  const magnifierRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMagnifierActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Position magnifier box
      if (magnifierRef.current) {
        const offset = 20;
        magnifierRef.current.style.left = `${x + offset}px`;
        magnifierRef.current.style.top = `${y + offset}px`;
      }

      // Find element under cursor
      const element = document.elementFromPoint(x, y) as HTMLElement;
      if (!element) return;

      // Ignore if it's the magnifier itself or toolbar
      if (element.closest('.z-\\[10000\\]') || element.closest('.magnifier-box')) {
          return;
      }

      // Extract text if it's a text-containing element
      const textTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'SPAN', 'A', 'BUTTON', 'STRONG', 'B', 'EM', 'I'];
      if (textTags.includes(element.tagName) || element.innerText.length < 200) {
          const text = element.innerText || element.getAttribute('aria-label') || "";
          const cleanText = text.trim();
          
          if (cleanText && cleanText.length > 0) {
            setHoveredText(cleanText);
          }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMagnifierActive]);

  if (!isMagnifierActive || !hoveredText) return null;

  return (
    <div 
      ref={magnifierRef}
      className="magnifier-box fixed z-[100001] pointer-events-none bg-slate-900/95 text-white p-6 rounded-3xl shadow-2xl border-2 border-white/20 max-w-md backdrop-blur-md"
    >
      <p className="text-xl md:text-2xl font-bold leading-tight">
        {hoveredText}
      </p>
    </div>
  );
};
