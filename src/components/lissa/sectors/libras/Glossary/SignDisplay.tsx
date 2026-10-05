"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ear, ArrowRight } from "lucide-react";
import { useLibras } from "../LibrasContext";
import { parseLibrasVideoUrl, getTermVideoSlug } from "@/lib/libras-words-database";
import { LibrasCollaborationModal } from "../LibrasCollaborationModal";

export function SignDisplay() {
  const { activeTermObj, activeTermKey } = useLibras();
  const [loadError, setLoadError] = useState(false);
  const [collabModal, setCollabModal] = useState<{
    isOpen: boolean;
    type: "new_sign" | "regional_variation";
  }>({
    isOpen: false,
    type: "new_sign",
  });

  useEffect(() => {
    setLoadError(false);
  }, [activeTermKey]);

  if (!activeTermObj) return null;

  const rawVideoUrl = activeTermObj.videoUrl || activeTermObj.video_url || "";
  const slug = getTermVideoSlug(activeTermObj.term);
  const localVideoUrl = `/videos/libras/${slug}.mp4`;
  
  // Effective video URL: configured URL, or fallback to local .mp4 if no URL is provided
  const candidateUrl = rawVideoUrl && rawVideoUrl.trim() !== "" && rawVideoUrl !== "#"
    ? rawVideoUrl
    : localVideoUrl;

  const videoInfo = parseLibrasVideoUrl(candidateUrl);
  const hasPlayableVideo = !loadError && videoInfo.type !== "empty";

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTermKey}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`relative aspect-video rounded-2xl overflow-hidden shadow-2xl group ring-1 ring-primary/10 ${
            !hasPlayableVideo ? "bg-slate-900 flex items-center justify-center" : "bg-slate-900"
          }`}
        >
          {!hasPlayableVideo ? (
            <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 space-y-3.5 bg-gradient-to-br from-slate-900 via-stone-900 to-slate-950 text-white">
              <div className="h-12 w-12 sm:h-14 sm:w-14 bg-amber-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 shadow-md">
                <Ear className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300 bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Participação Social Digital
                </span>
                <p className="text-xs sm:text-sm text-stone-100 font-bold leading-relaxed">
                  Não temos o sinal em libras dessa palavra. Se você sabe esse sinal, envie para a coordenação do projeto.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCollabModal({ isOpen: true, type: "new_sign" })}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 hover:scale-105"
              >
                <span>🤟 Enviar Sinal desta Palavra</span>
              </button>
            </div>
          ) : (
            <>
              {/* Glow perolado no container quando atualiza */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-white via-primary/20 to-white/10 pointer-events-none z-20"
              />

              {videoInfo.type === "youtube" ? (
                <iframe
                  src={videoInfo.url}
                  className="absolute inset-0 w-full h-full z-10"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  onError={() => setLoadError(true)}
                  title={`Sinal de ${activeTermObj.term} em Libras`}
                />
              ) : (
                <video
                  src={videoInfo.url}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={() => setLoadError(true)}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />
              )}
              
              <div className="absolute top-4 left-4 pointer-events-none z-30">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-3">
                  <Ear className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Sinal em Tempo Real</span>
                </div>
              </div>

              {/* Screen Reader Announcement */}
              <div className="sr-only" aria-live="polite">
                Iniciando vídeo do sinal em Libras para o termo: {activeTermObj.term}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Caixa de Participação Social Digital & Variação Regional (para todas as palavras) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/90 via-white to-amber-50/40 border border-blue-200/80 shadow-sm space-y-2.5">
        <div className="space-y-1">
          <div className="flex items-start gap-2 text-blue-900 font-black text-xs uppercase tracking-wide">
            <span className="text-sm shrink-0">🗺️</span>
            <span>Você conhece esse sinal de outra forma? Envie para a coordenação.</span>
          </div>
          <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
            Como a Libras tem variações linguísticas regionais, este é um mecanismo importante para ampliar as possibilidades de sinais em Libras em torno da palavra por meio da participação social digital, tornando o glossário colaborativo.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-blue-100">
          <span className="text-[10px] text-stone-400 font-semibold italic">
            Glossário Colaborativo • Ciência Cidadã
          </span>
          <button
            type="button"
            onClick={() => setCollabModal({ isOpen: true, type: "regional_variation" })}
            className="px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 shrink-0 hover:scale-105"
          >
            <span>Enviar Variação Regional</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Modal de Colaboração */}
      <LibrasCollaborationModal
        isOpen={collabModal.isOpen}
        onClose={() => setCollabModal(prev => ({ ...prev, isOpen: false }))}
        term={activeTermObj.term}
        initialType={collabModal.type}
      />
    </div>
  );
}
