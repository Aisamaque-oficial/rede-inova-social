"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wordDatabase } from '@/lib/dictionary-data';

export type ColorMode = 'default' | 'high-contrast' | 'soft-dark' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'grayscale' | 'dark' | 'light' | 'dim';
export type FontStyle = 'sans' | 'serif' | 'dyslexic';
export type SpacingMode = 'default' | 'wide' | 'extra-wide';

const STORAGE_KEY = 'redeinova_accessibility_prefs';

type AccessibilityState = {
  isHearingAidActive: boolean;
  isVisualAidActive: boolean;
  fontSize: number;
  colorMode: ColorMode;
  fontStyle: FontStyle;
  lineSpacing: SpacingMode;
  letterSpacing: SpacingMode;
  isReadingMaskActive: boolean;
  isReadingGuideActive: boolean;
  isHighLightLinksActive: boolean;
  isHighLightHeadersActive: boolean;
  isImagesHidden: boolean;
  isAnimationsPaused: boolean;
  saturation: 'low' | 'default' | 'high';
  isBoldTextActive: boolean;
  isMagnifierActive: boolean;
  isDictionaryActive: boolean;
  selectedWord: {
    word: string;
    synonyms: string[];
    meaning: string;
    examples: string[];
  } | null;
  readingMaskMode: 'off' | 'small' | 'medium' | 'large';
  isReadingFocusActive: boolean;
};

type AccessibilityContextType = AccessibilityState & {
  toggleHearingAid: () => void;
  toggleVisualAid: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  setColorMode: (mode: ColorMode) => void;
  setFontStyle: (style: FontStyle) => void;
  setLineSpacing: (mode: SpacingMode) => void;
  setLetterSpacing: (mode: SpacingMode) => void;
  setIsReadingMaskActive: (active: boolean) => void;
  setIsReadingGuideActive: (active: boolean) => void;
  setIsHighLightLinksActive: (active: boolean) => void;
  setIsHighLightHeadersActive: (active: boolean) => void;
  setIsImagesHidden: (active: boolean) => void;
  setIsAnimationsPaused: (active: boolean) => void;
  setSaturation: (sat: 'low' | 'default' | 'high') => void;
  setIsBoldTextActive: (active: boolean) => void;
  setIsMagnifierActive: (active: boolean) => void;
  setIsDictionaryActive: (active: boolean) => void;
  setSelectedWord: (word: AccessibilityState['selectedWord']) => void;
  setReadingMaskMode: (mode: 'off' | 'small' | 'medium' | 'large') => void;
  setIsReadingFocusActive: (active: boolean) => void;
  resetAccessibility: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const INITIAL_STATE: AccessibilityState = {
  isHearingAidActive: false,
  isVisualAidActive: false,
  fontSize: 100,
  colorMode: 'default',
  fontStyle: 'sans',
  lineSpacing: 'default',
  letterSpacing: 'default',
  isReadingMaskActive: false,
  isReadingGuideActive: false,
  isHighLightLinksActive: false,
  isHighLightHeadersActive: false,
  isImagesHidden: false,
  isAnimationsPaused: false,
  saturation: 'default',
  isBoldTextActive: false,
  isMagnifierActive: false,
  isDictionaryActive: false,
  selectedWord: null,
  readingMaskMode: 'off',
  isReadingFocusActive: false,
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AccessibilityState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState({ ...INITIAL_STATE, ...parsed });
      } catch (e) {
        console.error("Error parsing accessibility prefs", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const updateState = (update: Partial<AccessibilityState>) => setState(prev => ({ ...prev, ...update }));

  const toggleHearingAid = () => updateState({ isHearingAidActive: !state.isHearingAidActive });
  const toggleVisualAid = () => updateState({ isVisualAidActive: !state.isVisualAidActive });
  const increaseFontSize = () => updateState({ fontSize: Math.min(state.fontSize + 10, 200) });
  const decreaseFontSize = () => updateState({ fontSize: Math.max(state.fontSize - 10, 80) });
  const setColorMode = (mode: ColorMode) => updateState({ colorMode: mode });
  const setFontStyle = (style: FontStyle) => updateState({ fontStyle: style });
  const setLineSpacing = (mode: SpacingMode) => updateState({ lineSpacing: mode });
  const setLetterSpacing = (mode: SpacingMode) => updateState({ letterSpacing: mode });
  const setIsReadingMaskActive = (active: boolean) => updateState({ isReadingMaskActive: active });
  const setIsReadingGuideActive = (active: boolean) => updateState({ isReadingGuideActive: active });
  const setIsHighLightLinksActive = (active: boolean) => updateState({ isHighLightLinksActive: active });
  const setIsHighLightHeadersActive = (active: boolean) => updateState({ isHighLightHeadersActive: active });
  const setIsImagesHidden = (active: boolean) => updateState({ isImagesHidden: active });
  const setIsAnimationsPaused = (active: boolean) => updateState({ isAnimationsPaused: active });
  const setSaturation = (sat: 'low' | 'default' | 'high') => updateState({ saturation: sat });
  const setIsBoldTextActive = (active: boolean) => updateState({ isBoldTextActive: active });
  const setIsMagnifierActive = (active: boolean) => updateState({ isMagnifierActive: active });
  const setIsDictionaryActive = (active: boolean) => updateState({ isDictionaryActive: !!active });
  const setSelectedWord = (word: AccessibilityState['selectedWord']) => updateState({ selectedWord: word });
  const setIsReadingFocusActive = (active: boolean) => updateState({ isReadingFocusActive: active });
  const setReadingMaskMode = (mode: 'off' | 'small' | 'medium' | 'large') => updateState({ readingMaskMode: mode, isReadingMaskActive: mode !== 'off' });
  
  const resetAccessibility = () => {
    setState(INITIAL_STATE);
    const root = document.documentElement;
    root.style.fontSize = '';
    root.style.removeProperty('--mask-height');
    root.removeAttribute('data-acc-font-style');
    root.removeAttribute('data-acc-line-spacing');
    root.removeAttribute('data-acc-letter-spacing');
    root.removeAttribute('data-acc-saturation');
    window.speechSynthesis.cancel();
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${state.fontSize}%`;
    const maskHeights = { small: '40px', medium: '80px', large: '160px', off: '0px' };
    if (state.readingMaskMode !== 'off') root.style.setProperty('--mask-height', maskHeights[state.readingMaskMode]);
    const colorModes: ColorMode[] = ['high-contrast', 'soft-dark', 'protanopia', 'deuteranopia', 'tritanopia', 'grayscale', 'dark', 'light', 'dim'];
    colorModes.forEach(mode => root.classList.remove(`mode-${mode}`));
    root.classList.remove('dark', 'high-contrast'); // Limpar classes de estado global
    
    if (state.colorMode !== 'default') {
        root.classList.add(`mode-${state.colorMode}`);
        if (state.colorMode === 'high-contrast') root.classList.add('high-contrast');
        if (state.colorMode === 'dark') root.classList.add('dark');
    }
    root.setAttribute('data-acc-font-style', state.fontStyle);
    root.setAttribute('data-acc-line-spacing', state.lineSpacing);
    root.setAttribute('data-acc-letter-spacing', state.letterSpacing);
    root.setAttribute('data-acc-saturation', state.saturation);
    const classStates = {
        'acc-hide-images': state.isImagesHidden,
        'acc-pause-animations': state.isAnimationsPaused,
        'acc-reading-mask': state.isReadingMaskActive,
        'acc-reading-guide': state.isReadingGuideActive,
        'acc-bold-text': state.isBoldTextActive,
        'acc-magnifier-active': state.isMagnifierActive,
        'acc-dictionary-active': state.isDictionaryActive,
        'acc-highlight-links': state.isHighLightLinksActive,
        'acc-highlight-headers': state.isHighLightHeadersActive,
        'acc-reader-active': state.isVisualAidActive,
        'acc-reading-focus': state.isReadingFocusActive,
    };
    Object.entries(classStates).forEach(([cls, active]) => {
        if (active) root.classList.add(cls);
        else root.classList.remove(cls);
    });
  }, [state]);

  // Combined Interaction Listener (TTS + Dictionary)
  useEffect(() => {
    const speak = (text: string) => {
        if (!state.isVisualAidActive) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    const handleGlobalInteraction = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('.z-\\[10000\\]')) return; // Ignore toolbar

        // 1. Check for Dictionary Word FIRST
        const highlightSpan = target.closest('.acc-highlight-word') as HTMLElement;
        if (highlightSpan && state.isDictionaryActive) {
            const key = highlightSpan.getAttribute('data-word-key');
            if (key && wordDatabase[key as keyof typeof wordDatabase]) {
                const data = wordDatabase[key as keyof typeof wordDatabase];
                e.preventDefault(); e.stopPropagation();
                // @ts-ignore
                setSelectedWord(data);
                // Speak word AND meaning if reader is active
                if (state.isVisualAidActive) {
                    speak(`${data.word}. Significado: ${data.meaning}`);
                }
                return;
            }
        }

        // 2. Fallback to Site Reader (Click to Read)
        if (state.isVisualAidActive) {
            const text = target.innerText?.trim() || target.getAttribute('alt')?.trim();
            if (text && text.length > 1) {
                e.preventDefault(); e.stopPropagation();
                speak(text);
                // Visual feedback
                target.classList.add('acc-feedback-pulse');
                setTimeout(() => target.classList.remove('acc-feedback-pulse'), 1000);
            }
        }
    };

    // Add CSS for pulse feedback
    const style = document.createElement('style');
    style.id = 'acc-interaction-styles';
    style.innerHTML = `
        .acc-feedback-pulse {
            outline: 3px solid #3b82f6 !important;
            outline-offset: 2px !important;
            background-color: rgba(59, 130, 246, 0.1) !important;
            transition: all 0.2s !important;
        }
        .acc-reader-active *:hover {
            cursor: alias !important;
            outline: 1px dashed rgba(59, 130, 246, 0.5);
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('click', handleGlobalInteraction, true);
    return () => {
        window.removeEventListener('click', handleGlobalInteraction, true);
        document.getElementById('acc-interaction-styles')?.remove();
        window.speechSynthesis.cancel();
    };
  }, [state.isVisualAidActive, state.isDictionaryActive]);

  // Reading Focus Tracker
  useEffect(() => {
    if (!state.isReadingFocusActive) {
      document.getElementById('acc-reading-focus-mask')?.remove();
      return;
    }

    const mask = document.createElement('div');
    mask.id = 'acc-reading-focus-mask';
    mask.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), transparent 120px, rgba(0,0,0,0.85) 150px);
      pointer-events: none;
      z-index: 9999;
      transition: background 0.1s ease;
    `;
    document.body.appendChild(mask);

    const handleMove = (e: MouseEvent) => {
      mask.style.setProperty('--mouse-x', `${e.clientX}px`);
      mask.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      mask.remove();
    };
  }, [state.isReadingFocusActive]);

  // Dictionary Scanner (Only runs when active)
  useEffect(() => {
    if (!state.isDictionaryActive) {
        document.querySelectorAll('.acc-highlight-word').forEach(el => {
            const parent = el.parentNode;
            if (parent) parent.replaceChild(document.createTextNode(el.textContent || ""), el);
        });
        document.querySelectorAll('.acc-word-wrapper').forEach(el => {
            const parent = el.parentNode;
            if (parent) {
                while (el.firstChild) parent.insertBefore(el.firstChild, el);
                parent.removeChild(el);
            }
        });
        return;
    }

    const words = Object.keys(wordDatabase).sort((a, b) => b.length - a.length);
    const wrapWords = () => {
        const elements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, li, blockquote');
        elements.forEach(el => {
            if (el.closest('.z-\\[10000\\]') || el.closest('button')) return;
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
            let node;
            const nodesToReplace = [];
            while (node = walker.nextNode()) {
                if (node.parentElement?.classList.contains('acc-highlight-word')) continue;
                if (node.parentElement?.classList.contains('acc-word-wrapper')) continue;
                const text = node.nodeValue || "";
                let hasMatch = false;
                for (const word of words) {
                    if (new RegExp(`\\b${word}\\b`, 'gi').test(text)) { hasMatch = true; break; }
                }
                if (hasMatch) nodesToReplace.push(node);
            }
            nodesToReplace.forEach(textNode => {
                let html = textNode.nodeValue || "";
                words.forEach(word => {
                    const regex = new RegExp(`\\b(${word})\\b`, 'gi');
                    html = html.replace(regex, `<span class="acc-highlight-word" data-word-key="${word.toLowerCase()}">$1</span>`);
                });
                const span = document.createElement('span');
                span.className = 'acc-word-wrapper';
                span.style.display = 'contents';
                span.innerHTML = html;
                textNode.parentNode?.replaceChild(span, textNode);
            });
        });
    };

    wrapWords();
    const observer = new MutationObserver(() => wrapWords());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [state.isDictionaryActive]);

  return (
    <AccessibilityContext.Provider value={{
      ...state, toggleHearingAid, toggleVisualAid, increaseFontSize, decreaseFontSize, setColorMode, setFontStyle, setLineSpacing, setLetterSpacing, setIsReadingMaskActive, setIsReadingGuideActive, setIsHighLightLinksActive, setIsHighLightHeadersActive, setIsImagesHidden, setIsAnimationsPaused, setSaturation, setIsBoldTextActive, setIsMagnifierActive, setIsDictionaryActive, setSelectedWord, setReadingMaskMode, setIsReadingFocusActive, resetAccessibility
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) throw new Error('useAccessibility must be used within an AccessibilityProvider');
  return context;
};
