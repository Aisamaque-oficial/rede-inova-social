"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ear } from "lucide-react";
import { useLibras } from "../LibrasContext";
import { parseLibrasVideoUrl, getTermVideoSlug } from "@/lib/libras-words-database";

export function SignDisplay() {
  const { activeTermObj, activeTermKey } = useLibras();
  const [loadError, setLoadError] = useState(false);

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
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTermKey}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative aspect-video rounded-2xl overflow-hidden shadow-2xl group ring-1 ring-primary/10 ${
          !hasPlayableVideo ? "bg-slate-100 flex items-center justify-center" : "bg-slate-900"
        }`}
      >
        {!hasPlayableVideo ? (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center mb-2">
              <Ear className="h-8 w-8 text-slate-400 opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-slate-500">Disponível em breve</h3>
            <p className="text-sm text-slate-400 max-w-sm">
              O vídeo em Libras para este termo será adicionado futuramente.
            </p>
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
  );
}
