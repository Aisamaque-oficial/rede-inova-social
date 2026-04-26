"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Volume2, 
  Ear, 
  Download, 
  Maximize2, 
  Play, 
  Pause,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthoralMaterial } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface MaterialReaderProps {
  material: AuthoralMaterial;
  onClose: () => void;
}

export function MaterialReader({ material, onClose }: MaterialReaderProps) {
  const [showLibras, setShowLibras] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlayingAudio(!isPlayingAudio);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-4 z-[60] glass-morphism rounded-[4rem] shadow-4xl overflow-hidden flex flex-col border-4 border-primary/20"
    >
      {/* Header do Leitor */}
      <header className="p-6 md:px-12 bg-white/80 backdrop-blur-md border-b flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-primary/10">
            <ArrowLeft className="h-6 w-6 text-primary" />
          </Button>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Lendo Material</span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase italic">{material.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={toggleAudio}
            variant={isPlayingAudio ? "default" : "outline"}
            className={cn(
              "rounded-full gap-3 font-black uppercase tracking-tighter h-12 px-6 transition-all",
              isPlayingAudio ? "animate-pulse" : ""
            )}
          >
            {isPlayingAudio ? <Pause className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            {isPlayingAudio ? "Ouvindo..." : "Ouvir Texto"}
          </Button>
          
          <Button 
            onClick={() => setShowLibras(!showLibras)}
            variant={showLibras ? "default" : "outline"}
            className="rounded-full gap-3 font-black uppercase tracking-tighter h-12 px-6"
          >
            <Ear className="h-5 w-5" />
            {showLibras ? "Fechar Libras" : "Ver Libras"}
          </Button>

          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-12 w-12 ml-4">
            <X className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Conteúdo do Leitor */}
      <div className="flex-1 flex overflow-hidden bg-white/40">
        {/* Lado do Texto (HTML5) */}
        <div className={cn(
          "flex-1 overflow-y-auto p-8 md:p-20 transition-all duration-700 custom-scrollbar",
          showLibras ? "md:max-w-[70%]" : "w-full"
        )}>
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="max-w-4xl mx-auto"
           >
              <div 
                className="prose prose-slate prose-lg max-w-none font-medium italic text-slate-700 leading-loose"
                dangerouslySetInnerHTML={{ __html: material.content }}
              />

              <div className="mt-20 p-12 bg-primary/5 rounded-[3rem] border-2 border-primary/10 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div>
                  <h3 className="text-3xl font-black text-primary tracking-tighter uppercase italic mb-2">Gostou deste material?</h3>
                  <p className="text-slate-500 font-bold italic">Você pode baixar a versão completa em PDF para imprimir.</p>
                </div>
                <Button className="rounded-full h-16 px-10 font-black uppercase tracking-tighter text-lg gap-4 shadow-xl">
                    <Download className="h-6 w-6" />
                    Baixar PDF
                </Button>
              </div>
           </motion.div>
        </div>

        {/* Lado de Mídia (Libras) */}
        <AnimatePresence>
          {showLibras && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full md:w-[30%] bg-slate-900 border-l border-white/10 flex flex-col relative z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.2)]"
            >
              <div className="aspect-video w-full bg-black relative">
                <iframe 
                  src={material.librasVideoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 flex items-center justify-center bg-primary rounded-2xl text-white">
                        <Ear className="h-6 w-6" />
                    </div>
                    <span className="font-black text-white uppercase tracking-widest text-xs">Tradutor de Libras</span>
                 </div>
                 <p className="text-slate-400 font-bold italic leading-relaxed text-sm">
                    Acompanhe a tradução oficial em Língua Brasileira de Sinais para este material.
                 </p>
                 <div className="mt-auto p-6 bg-white/5 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase">Inclusão Real</span>
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase leading-tight font-black">
                        Desenvolvido pela coordenação de acessibilidade linguística da Rede Inova.
                    </p>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Áudio Escondido */}
      {material.audioUrl && (
        <audio 
          ref={audioRef} 
          src={material.audioUrl} 
          onEnded={() => setIsPlayingAudio(false)}
        />
      )}
    </motion.div>
  );
}
