
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/context/accessibility-context';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LibrasOverlay = () => {
  const { isHearingAidActive } = useAccessibility();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 20, y: -20 }); // Anchored from bottom if we change CSS
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Ref for the video container to allow dragging (simple implementation)
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isStudio = typeof window !== 'undefined' && window.location.pathname.includes('/gerenciar/estudio');
    
    if (!isHearingAidActive && !isStudio) {
      setActiveVideo(null);
      return;
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Ignore clicks on the overlay itself or the toolbar
      if (target.closest('.libras-ignore') || target.closest('button')) return;

      const text = target.innerText?.trim();
      if (text && text.length > 1) {
        e.preventDefault();
        e.stopPropagation();
        
        // In a real app, we'd look up the video ID based on text or data attribute
        const videoUrl = target.getAttribute('data-libras-video') || "https://www.youtube.com/embed/zOdfiG7C6Z0?autoplay=1&mute=1&loop=1&playlist=zOdfiG7C6Z0";
        
        setDisplayText(text.substring(0, 50) + (text.length > 50 ? '...' : ''));
        setActiveVideo(videoUrl);
      }
    };

    document.addEventListener('click', handleClick, true);
    
    // Add visual feedback to interactive elements
    const style = document.createElement('style');
    style.id = 'libras-cursor-style';
    style.innerHTML = `
      .hearing-aid-active *:not(.libras-ignore):hover {
        outline: 2px dashed #f59e0b !important;
        cursor: help !important;
        background-color: rgba(245, 158, 11, 0.05) !important;
      }
    `;
    document.head.appendChild(style);
    document.documentElement.classList.add('hearing-aid-active');

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.getElementById('libras-cursor-style')?.remove();
      document.documentElement.classList.remove('hearing-aid-active');
    };
  }, [isHearingAidActive]);

  if (!isHearingAidActive || !activeVideo) return null;

  return (
    <AnimatePresence>
      <motion.div
        drag
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.8, x: position.x, y: position.y }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed bottom-12 left-12 z-[110] libras-ignore shadow-2xl rounded-2xl overflow-hidden border-2 border-primary bg-background flex flex-col"
        style={{ width: isExpanded ? '400px' : '280px' }}
      >
        <div className="bg-primary text-primary-foreground p-2 flex items-center justify-between cursor-move">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider overflow-hidden whitespace-nowrap">
            <Move className="h-3 w-3" />
            <span>Tradução Libras</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-white/20" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-white/20" onClick={() => setActiveVideo(null)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="aspect-video bg-black relative">
          <iframe
            src={activeVideo}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            title="Tradução para Libras"
          ></iframe>
        </div>
        
        <div className="p-3 bg-muted/50 text-[10px] font-medium leading-tight">
          <span className="opacity-70 block mb-1">Traduzindo:</span>
          <p className="italic">"{displayText}"</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
