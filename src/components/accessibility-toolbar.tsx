"use client";

import React from 'react';
import { useAccessibility } from '@/context/accessibility-context';
import { Button } from '@/components/ui/button';
import { Eye, Ear, Type, RotateCcw, Plus, Minus, Settings2, X, Search, Book, ArrowLeft, Focus, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export const AccessibilityToolbar = () => {
  const { 
    isHearingAidActive, isVisualAidActive, fontSize, colorMode, fontStyle, 
    lineSpacing, letterSpacing, isReadingMaskActive, isReadingGuideActive,
    isHighLightLinksActive, isHighLightHeadersActive, isImagesHidden,
    isAnimationsPaused, saturation, isBoldTextActive, isMagnifierActive, 
    isDictionaryActive, selectedWord, readingMaskMode, isReadingFocusActive,
    toggleHearingAid, toggleVisualAid, increaseFontSize, decreaseFontSize,
    setColorMode, setFontStyle, setLineSpacing, setLetterSpacing,
    setIsReadingMaskActive, setIsReadingGuideActive, setIsHighLightLinksActive,
    setIsHighLightHeadersActive, setIsImagesHidden, setIsAnimationsPaused,
    setSaturation, setIsBoldTextActive, setIsMagnifierActive, 
    setIsDictionaryActive, setSelectedWord, setReadingMaskMode, setIsReadingFocusActive, resetAccessibility 
  } = useAccessibility();

  const [isOpen, setIsOpen] = React.useState(false);

  // Helper for Card Button
  const ActionCard = ({ 
    active, onClick, icon: Icon, label, sublabel 
  }: { active: boolean, onClick: () => void, icon: any, label: string, sublabel?: string }) => (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-3 h-auto min-h-[100px] border-2 transition-all rounded-2xl gap-2 text-center",
        active ? "bg-primary text-primary-foreground border-primary shadow-lg ring-2 ring-primary/20" : "bg-white hover:border-primary/50 hover:bg-primary/5 text-slate-700"
      )}
    >
      <Icon className={cn("h-6 w-6", active ? "text-primary-foreground" : "text-slate-400")} />
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-bold leading-tight">{label}</span>
        {sublabel && <span className="text-[8px] opacity-60 leading-tight uppercase font-black">{sublabel}</span>}
      </div>
    </Button>
  );

  return (
    <div className="fixed bottom-6 right-6 z-[10000] flex flex-col-reverse items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
                "flex flex-col p-0 bg-slate-50 border border-slate-200 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.3)] pointer-events-auto",
                "w-[calc(100vw-3rem)] md:w-[420px] overflow-hidden mb-2",
                "max-h-[75vh] md:max-h-[calc(100vh-140px)]"
            )}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-slate-900 uppercase">Acessibilidade</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Painel Inclusivo</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full h-8 w-8 hover:bg-slate-100">
                <X className="h-4 w-4 text-slate-500" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto max-h-[70vh] p-4 space-y-6 custom-scrollbar relative">
              <AnimatePresence mode="wait">
                {isDictionaryActive ? (
                  <motion.div
                    key="dictionary-view"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 p-2"
                  >
                    {/* Dictionary Header */}
                    <div className="flex items-center gap-3 mb-6 bg-slate-100/50 p-3 rounded-2xl">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          setIsDictionaryActive(false);
                          setSelectedWord(null);
                        }} 
                        className="rounded-full h-8 w-8 hover:bg-slate-200"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-bold text-slate-700">Sinônimos e significados</span>
                    </div>

                    {!selectedWord ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="relative">
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-primary/10 rounded-full blur-xl"
                          />
                          <Search className="h-12 w-12 text-primary relative z-10" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-primary">Selecione uma palavra</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black">Clique em uma palavra no texto do site</p>
                        </div>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Palavra selecionada:</p>
                          <p className="text-2xl font-black text-slate-900 leading-none">{selectedWord.word}</p>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-1">
                           <p className="text-[10px] text-slate-400 uppercase font-black">Sinônimos</p>
                           <p className="text-sm text-slate-600 font-medium">
                            {selectedWord.synonyms.join(' | ')}
                           </p>
                        </div>

                        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg space-y-1">
                           <p className="text-[10px] text-slate-400 uppercase font-black opacity-60">Significado</p>
                           <p className="text-sm leading-relaxed">
                            {selectedWord.meaning}
                           </p>
                        </div>

                        <div className="space-y-3">
                           <p className="text-[10px] text-slate-400 uppercase font-black px-1">Exemplos de uso</p>
                           <ul className="space-y-2">
                             {selectedWord.examples.map((ex, idx) => (
                               <li key={idx} className="bg-white/50 p-3 rounded-xl text-xs text-slate-600 border border-slate-100 italic">
                                 {ex}
                               </li>
                             ))}
                           </ul>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="main-view"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {/* Tradutor de Libras Section */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                          <ActionCard 
                              active={isHearingAidActive} 
                              onClick={toggleHearingAid} 
                              icon={Ear} 
                              label="Tradutor de Libras" 
                          />
                          <ActionCard 
                              active={isDictionaryActive}
                              onClick={() => setIsDictionaryActive(true)}
                              icon={Book}
                              label="Sinônimos e significados"
                          />
                      </div>
                    </div>

                    {/* Controle de Fonte Section */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">Controle de fonte</span>
                      <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white p-3 rounded-2xl border-2 border-slate-100 flex flex-col gap-2">
                               <div className="flex items-center justify-between gap-1 bg-slate-50 p-1 rounded-xl">
                                  <Button variant="ghost" size="icon" onClick={decreaseFontSize} className="h-8 w-8 rounded-lg hover:bg-white border"><Minus className="h-3 w-3" /></Button>
                                  <span className="text-[10px] font-black">{fontSize}%</span>
                                  <Button variant="ghost" size="icon" onClick={increaseFontSize} className="h-8 w-8 rounded-lg hover:bg-white border"><Plus className="h-3 w-3" /></Button>
                              </div>
                              <span className="text-[10px] font-bold text-center">Tamanho da fonte</span>
                          </div>

                          <ActionCard 
                              active={fontStyle !== 'sans'} 
                              onClick={() => setFontStyle(fontStyle === 'sans' ? 'serif' : 'sans')}
                              icon={Type}
                              label="Estilo de texto"
                              sublabel={fontStyle}
                          />

                          <ActionCard 
                              active={lineSpacing !== 'default'} 
                              onClick={() => {
                                  const next = lineSpacing === 'default' ? 'wide' : lineSpacing === 'wide' ? 'extra-wide' : 'default';
                                  setLineSpacing(next);
                              }}
                              icon={Settings2}
                              label="Espaço entre linhas"
                              sublabel={lineSpacing === 'default' ? 'Normal' : lineSpacing === 'wide' ? 'Médio' : 'Largo'}
                          />

                          <ActionCard 
                              active={letterSpacing !== 'default'} 
                              onClick={() => {
                                  const next = letterSpacing === 'default' ? 'wide' : letterSpacing === 'wide' ? 'extra-wide' : 'default';
                                  setLetterSpacing(next);
                              }}
                              icon={Type}
                              label="Espaço entre letras"
                              sublabel={letterSpacing === 'default' ? 'Normal' : letterSpacing === 'wide' ? 'Médio' : 'Largo'}
                          />

                          <ActionCard 
                              active={isBoldTextActive} 
                              onClick={() => setIsBoldTextActive(!isBoldTextActive)}
                              icon={Type}
                              label="Letras Destacadas"
                          />
                      </div>
                    </div>

                    {/* Leitura Section */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">Auxílio de Leitura</span>
                      <div className="grid grid-cols-2 gap-3">
                          <ActionCard 
                              active={isVisualAidActive} 
                              onClick={toggleVisualAid}
                              icon={Settings2} 
                              label="Leitor de sites" 
                          />
                          <ActionCard 
                              active={readingMaskMode !== 'off'} 
                              onClick={() => {
                                  const next = readingMaskMode === 'off' ? 'small' : readingMaskMode === 'small' ? 'medium' : readingMaskMode === 'medium' ? 'large' : 'off';
                                  setReadingMaskMode(next);
                              }}
                              icon={Eye} 
                              label="Máscara de leitura" 
                              sublabel={readingMaskMode === 'off' ? 'Desligada' : readingMaskMode === 'small' ? 'Pequena' : readingMaskMode === 'medium' ? 'Média' : 'Grande'}
                          />
                          <ActionCard 
                              active={isReadingGuideActive} 
                              onClick={() => setIsReadingGuideActive(!isReadingGuideActive)}
                              icon={Settings2} 
                              label="Guia de leitura" 
                          />
                          <ActionCard 
                              active={isHighLightLinksActive} 
                              onClick={() => setIsHighLightLinksActive(!isHighLightLinksActive)}
                              icon={Settings2} 
                              label="Destaque de links" 
                          />
                          <ActionCard 
                              active={isMagnifierActive} 
                              onClick={() => setIsMagnifierActive(!isMagnifierActive)}
                              icon={Search} 
                              label="Lupa de Conteúdo" 
                          />
                          <ActionCard 
                              active={isDictionaryActive} 
                              onClick={() => setIsDictionaryActive(true)}
                              icon={Book} 
                              label="Sinônimos e significados" 
                          />
                           <ActionCard 
                              active={isImagesHidden} 
                              onClick={() => setIsImagesHidden(!isImagesHidden)}
                              icon={Eye} 
                              label="Esconder imagens" 
                          />
                           <ActionCard 
                              active={isReadingFocusActive} 
                              onClick={() => setIsReadingFocusActive(!isReadingFocusActive)}
                              icon={Zap} 
                              label="Foco de leitura" 
                              sublabel="Efeito Holofote"
                          />
                           <ActionCard 
                              active={isAnimationsPaused} 
                              onClick={() => setIsAnimationsPaused(!isAnimationsPaused)}
                              icon={RotateCcw} 
                              label="Pausar Animações" 
                          />
                      </div>
                    </div>

                    {/* Controle de Cor Section */}
                    <div className="space-y-3 pb-4">
                      <span className="text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">Controle de cor</span>
                      <div className="grid grid-cols-2 gap-3">
                          <ActionCard 
                              active={colorMode === 'high-contrast' || colorMode === 'soft-dark'} 
                              onClick={() => {
                                  const next = colorMode === 'default' ? 'soft-dark' : colorMode === 'soft-dark' ? 'high-contrast' : 'default';
                                  setColorMode(next);
                              }}
                              icon={Eye} 
                              label="Contraste de cores" 
                              sublabel={colorMode === 'default' ? 'Padrão' : colorMode === 'soft-dark' ? 'Meia Luz' : 'Contraste Total'}
                          />
                          <ActionCard 
                              active={saturation !== 'default'} 
                              onClick={() => setSaturation(saturation === 'default' ? 'low' : 'default')}
                              icon={Settings2} 
                              label="Intensidade de cores" 
                          />
                           <ActionCard 
                              active={colorMode !== 'default' && colorMode !== 'high-contrast'} 
                              onClick={() => setColorMode(colorMode === 'protanopia' ? 'default' : 'protanopia')}
                              icon={Settings2} 
                              label="Modo daltônico" 
                              sublabel={colorMode}
                          />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <Button variant="ghost" size="sm" onClick={resetAccessibility} className="flex-1 rounded-xl text-slate-500 hover:text-destructive h-10 font-bold uppercase text-[10px]">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Resetar Todas Configurações
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-auto">
        <Button 
            variant="default" 
            size="lg" 
            data-accessibility-toggle
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all h-14 w-auto px-6 gap-3 group bg-white border-2 border-primary/20 hover:bg-white text-primary"
        >
            <div className="relative">
                <Settings2 className={cn("h-6 w-6 transition-transform duration-700", isOpen ? "rotate-180" : "group-hover:rotate-45")} />
                { (isHearingAidActive || isVisualAidActive || colorMode !== 'default' || fontSize !== 100) && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full border-2 border-white animate-bounce" />
                )}
            </div>
            <span className="font-black text-xs tracking-[0.15em] uppercase text-primary">Acessibilidade</span>
        </Button>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};
