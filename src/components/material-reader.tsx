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
  const [viewPdfInline, setViewPdfInline] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (material.audioUrl && audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlayingAudio(!isPlayingAudio);
      return;
    }

    // Fallback para Text-to-Speech nativo do navegador
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        // Limpa as tags HTML para leitura
        const plainText = material.title + ". " + material.content.replace(/<[^>]+>/g, '');
        const utterance = new SpeechSynthesisUtterance(plainText);
        utterance.lang = 'pt-BR';
        
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    }
  };

  React.useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
        {/* Lado do Texto (HTML5) ou PDF */}
        <div className={cn(
          "flex-1 overflow-y-auto transition-all duration-700 custom-scrollbar flex flex-col",
          showLibras ? "md:max-w-[70%]" : "w-full",
          viewPdfInline ? "p-0" : "p-8 md:p-20"
        )}>
          {viewPdfInline ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative w-full h-full flex flex-col bg-slate-900"
            >
               <div className="p-4 bg-slate-800 text-white flex justify-between items-center shadow-lg z-10">
                 <div className="flex items-center gap-2">
                   <Maximize2 className="h-5 w-5 text-primary" />
                   <span className="font-black text-sm uppercase tracking-widest">Documento Original em PDF</span>
                 </div>
                 <Button 
                   onClick={() => setViewPdfInline(false)} 
                   className="rounded-full bg-primary hover:bg-primary/80 text-white font-bold uppercase tracking-widest text-xs px-6"
                 >
                    Voltar ao Texto Acessível
                 </Button>
               </div>
               <iframe src={material.url} className="w-full flex-1 border-none" title="PDF Viewer" />
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto w-full"
            >
              <div 
                className="prose prose-slate prose-lg max-w-none font-medium italic text-slate-700 leading-loose"
                dangerouslySetInnerHTML={{ __html: material.content }}
              />

              <div className="mt-20 p-12 bg-primary/5 rounded-[3rem] border-2 border-primary/10 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div>
                  <h3 className="text-3xl font-black text-primary tracking-tighter uppercase italic mb-2">Gostou deste material?</h3>
                  <p className="text-slate-500 font-bold italic">Você pode visualizar o PDF original ou baixá-lo para imprimir.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                  <Button 
                    onClick={() => setViewPdfInline(true)}
                    variant="outline"
                    className="rounded-full h-16 px-8 font-black uppercase tracking-tighter text-base gap-3 border-2 border-primary/20 text-primary hover:bg-primary/5"
                  >
                    <Maximize2 className="h-5 w-5" />
                    Visualizar na Tela
                  </Button>
                  <Button 
                    asChild
                    className="rounded-full h-16 px-8 font-black uppercase tracking-tighter text-base gap-3 shadow-xl"
                  >
                    <a href={material.url} target="_blank" rel="noopener noreferrer" download>
                      <Download className="h-5 w-5" />
                      Baixar PDF
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
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
