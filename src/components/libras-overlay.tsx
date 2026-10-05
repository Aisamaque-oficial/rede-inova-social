"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAccessibility } from "@/context/accessibility-context";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Move, 
  Ear, 
  Sparkles, 
  Edit3, 
  Save, 
  Check, 
  ExternalLink, 
  Video, 
  Info,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  LibrasWord, 
  findSignedWord, 
  getAllSignedWords, 
  parseLibrasVideoUrl, 
  setWordLibrasVideo 
} from "@/lib/libras-words-database";
import { LibrasCollaborationModal } from "@/components/lissa/sectors/libras/LibrasCollaborationModal";
import { cn } from "@/lib/utils";

export const LibrasOverlay = () => {
  const { isHearingAidActive } = useAccessibility();
  const [activeWord, setActiveWord] = useState<LibrasWord | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 20, y: -20 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [videoInputUrl, setVideoInputUrl] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [collabModal, setCollabModal] = useState<{
    isOpen: boolean;
    term: string;
    type: "new_sign" | "regional_variation";
  }>({
    isOpen: false,
    term: "",
    type: "new_sign",
  });

  // Open player for a specific LibrasWord or text
  const openWordTranslation = useCallback((wordOrText: string, fallbackVideo?: string) => {
    const matched = findSignedWord(wordOrText);
    if (matched) {
      setActiveWord(matched);
      setDisplayText(matched.term);
      setActiveVideoUrl(matched.videoUrl || fallbackVideo || "");
      setVideoInputUrl(matched.videoUrl || "");
    } else {
      // Create ad-hoc word object if not in glossary
      const cleanText = wordOrText.trim().substring(0, 60);
      setActiveWord({
        id: "adhoc-term",
        term: cleanText,
        normalizedTerm: cleanText.toLowerCase(),
        definition: "Palavra ou trecho selecionado para tradução em Libras.",
        videoUrl: fallbackVideo || "",
      });
      setDisplayText(cleanText);
      setActiveVideoUrl(fallbackVideo || "");
      setVideoInputUrl(fallbackVideo || "");
    }
    setIsEditingVideo(false);
    setSaveSuccess(false);
  }, []);

  // Save updated video URL for active word
  const handleSaveVideoUrl = () => {
    if (!activeWord) return;
    const url = videoInputUrl.trim();
    setWordLibrasVideo(activeWord.term, url);
    setActiveVideoUrl(url);
    setActiveWord(prev => prev ? { ...prev, videoUrl: url } : null);
    setIsEditingVideo(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Main listener and DOM scanner when Tradução em Libras is active
  useEffect(() => {
    const isStudio = typeof window !== "undefined" && window.location.pathname.includes("/gerenciar/estudio");

    if (!isHearingAidActive && !isStudio) {
      setActiveWord(null);
      setActiveVideoUrl(null);
      // Clean up any injected span wrappers
      document.querySelectorAll(".libras-signed-word").forEach(el => {
        const parent = el.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(el.textContent || ""), el);
        }
      });
      document.querySelectorAll(".libras-word-wrapper").forEach(el => {
        const parent = el.parentNode;
        if (parent) {
          while (el.firstChild) parent.insertBefore(el.firstChild, el);
          parent.removeChild(el);
        }
      });
      return;
    }

    // 1. Wrap known signed words across the page
    const signedWordsList = getAllSignedWords().slice(0, 150); // prioritize top signed words
    const wrapSignedWords = () => {
      const elements = document.querySelectorAll("p, span, h1, h2, h3, h4, h5, h6, li, blockquote, a");
      elements.forEach(el => {
        // Skip toolbars, modals, scripts and overlay elements
        if (
          el.closest(".libras-ignore") || 
          el.closest(".z-\\[10000\\]") || 
          el.closest("button") || 
          el.classList.contains("libras-signed-word")
        ) return;

        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
        let node;
        const nodesToReplace: Node[] = [];

        while ((node = walker.nextNode())) {
          if (node.parentElement?.classList.contains("libras-signed-word")) continue;
          if (node.parentElement?.classList.contains("libras-word-wrapper")) continue;
          const text = node.nodeValue || "";
          if (text.trim().length < 3) continue;

          let hasMatch = false;
          for (const item of signedWordsList) {
            if (item.term.length >= 3 && new RegExp(`\\b${item.term}\\b`, "i").test(text)) {
              hasMatch = true;
              break;
            }
          }
          if (hasMatch) nodesToReplace.push(node);
        }

        nodesToReplace.forEach(textNode => {
          let html = textNode.nodeValue || "";
          signedWordsList.forEach(item => {
            if (item.term.length < 3) return;
            const regex = new RegExp(`\\b(${item.term})\\b`, "gi");
            html = html.replace(
              regex,
              `<span class="libras-signed-word" data-libras-term="${item.term}" title="🤟 Ver sinal de '${item.term}' em Libras">$1</span>`
            );
          });

          const span = document.createElement("span");
          span.className = "libras-word-wrapper";
          span.style.display = "contents";
          span.innerHTML = html;
          textNode.parentNode?.replaceChild(span, textNode);
        });
      });
    };

    wrapSignedWords();
    const observer = new MutationObserver(() => wrapSignedWords());
    observer.observe(document.body, { childList: true, subtree: true });

    // 2. Click handler for words and elements
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Ignore clicks on overlay itself or toolbar
      if (target.closest(".libras-ignore") || target.closest(".z-\\[10000\\]") || target.closest("button")) {
        return;
      }

      // Check if clicked directly on a wrapped signed word
      const signedSpan = target.closest(".libras-signed-word") as HTMLElement;
      if (signedSpan) {
        e.preventDefault();
        e.stopPropagation();
        const term = signedSpan.getAttribute("data-libras-term") || signedSpan.innerText;
        openWordTranslation(term);
        return;
      }

      // Check if element has explicit data-libras-video
      const directVideo = target.getAttribute("data-libras-video");
      const text = target.innerText?.trim() || "";

      if (text.length > 1) {
        e.preventDefault();
        e.stopPropagation();

        // Check if selection exists
        const selection = window.getSelection()?.toString()?.trim();
        const query = selection && selection.length > 1 ? selection : text;
        openWordTranslation(query, directVideo || undefined);
      }
    };

    document.addEventListener("click", handleClick, true);

    // 3. Inject visual styles for signed words
    const style = document.createElement("style");
    style.id = "libras-signed-styles";
    style.innerHTML = `
      .libras-signed-word {
        border-bottom: 2px dashed #2563eb !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        position: relative !important;
        padding-bottom: 1px !important;
      }
      .libras-signed-word:hover {
        background-color: rgba(37, 99, 235, 0.12) !important;
        color: #1d4ed8 !important;
        border-radius: 4px !important;
        outline: 1px solid rgba(37, 99, 235, 0.3) !important;
      }
      .hearing-aid-active *:not(.libras-ignore):not(button):hover {
        cursor: help !important;
      }
    `;
    document.head.appendChild(style);
    document.documentElement.classList.add("hearing-aid-active");

    return () => {
      document.removeEventListener("click", handleClick, true);
      observer.disconnect();
      document.getElementById("libras-signed-styles")?.remove();
      document.documentElement.classList.remove("hearing-aid-active");
    };
  }, [isHearingAidActive, openWordTranslation]);

  if (!isHearingAidActive || !activeWord) return null;

  const videoInfo = parseLibrasVideoUrl(activeVideoUrl || activeWord.videoUrl);

  return (
    <AnimatePresence>
      <motion.div
        drag
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.85, x: position.x, y: position.y }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        className="fixed bottom-12 left-12 z-[110] libras-ignore shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-3xl overflow-hidden border-2 border-primary bg-slate-950 text-white flex flex-col backdrop-blur-xl"
        style={{ width: isExpanded ? "440px" : "320px", maxWidth: "90vw" }}
      >
        {/* Top Handle / Drag Bar */}
        <div className="bg-primary text-primary-foreground px-3 py-2 flex items-center justify-between cursor-move select-none">
          <div className="flex items-center gap-2 overflow-hidden text-xs font-black uppercase tracking-wider">
            <Move className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Libras: {activeWord.term}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary-foreground hover:bg-white/20 rounded-lg"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Reduzir visualizador" : "Expandir visualizador"}
            >
              {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary-foreground hover:bg-white/20 rounded-lg"
              onClick={() => {
                setActiveWord(null);
                setActiveVideoUrl(null);
              }}
              title="Fechar tradução"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Video Player Display */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden border-b border-white/10">
          {videoInfo.type === "youtube" ? (
            <iframe
              src={videoInfo.url}
              className="w-full h-full object-cover"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title={`Tradução em Libras: ${activeWord.term}`}
            />
          ) : videoInfo.type === "video" ? (
            <video
              src={videoInfo.url}
              controls
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-5 text-center space-y-2.5 bg-gradient-to-br from-slate-900 via-stone-900 to-slate-950 text-white">
              <div className="w-11 h-11 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Ear className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-amber-200 leading-snug max-w-[260px]">
                Não temos o sinal em libras dessa palavra. Se você sabe esse sinal, envie para a coordenação do projeto.
              </p>
              <button
                type="button"
                onClick={() => setCollabModal({ isOpen: true, term: activeWord.term, type: "new_sign" })}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 hover:scale-105"
              >
                <span>🤟 Enviar sinal desta palavra</span>
              </button>
            </div>
          )}

          {/* Badge Indicador de Sinal Ativo */}
          <div className="absolute top-2 left-2 pointer-events-none">
            <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-black uppercase tracking-wider text-primary border border-primary/30 flex items-center gap-1">
              <span>{activeWord.axisEmoji || "🤟"}</span>
              <span>Sinal</span>
            </span>
          </div>
        </div>

        {/* Informações do Termo & Estratégia de Sinalização */}
        <div className="p-3.5 space-y-2.5 max-h-[42vh] overflow-y-auto text-slate-200 text-xs custom-scrollbar">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Palavra Sinalizada</span>
              <h4 className="text-sm font-black text-white leading-tight">{activeWord.term}</h4>
            </div>
            {activeWord.axisTitle && (
              <span className="text-[9px] px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-bold shrink-0">
                {activeWord.axisTitle}
              </span>
            )}
          </div>

          {/* Estratégia de Sinalização em Libras */}
          {activeWord.signStrategy && (
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/20 space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-blue-300 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-blue-400" /> Estratégia do Sinal
              </span>
              <p className="text-[11px] text-blue-100 leading-snug font-medium italic">
                "{activeWord.signStrategy}"
              </p>
            </div>
          )}

          {/* Definição / Contexto */}
          {activeWord.definition && (
            <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
              {activeWord.definition}
            </p>
          )}

          {/* Feedback de salvamento */}
          {saveSuccess && (
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold animate-in fade-in">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Vídeo salvo com sucesso para "{activeWord.term}"!</span>
            </div>
          )}

          {/* Caixa de Participação Social Digital & Variação Regional (para todas as palavras) */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-white/10 to-amber-500/10 border border-white/15 space-y-2">
            <h5 className="text-[11px] font-black text-amber-300 flex items-start gap-1.5 leading-snug">
              <span className="text-xs shrink-0">🗺️</span>
              <span>Você conhece esse sinal de outra forma? Envie para a coordenação.</span>
            </h5>
            <p className="text-[10px] text-slate-300 leading-relaxed font-normal">
              Como a Libras tem variações linguísticas regionais, sua colaboração amplia as possibilidades de sinais em torno da palavra por meio da participação social digital.
            </p>
            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={() => setCollabModal({ isOpen: true, term: activeWord.term, type: "regional_variation" })}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-all shadow-sm hover:scale-105"
              >
                Enviar variação regional
              </button>
            </div>
          </div>

          {/* Formulário Inline: Inserir / Editar Arquivo de Vídeo */}
          <div className="pt-1 border-t border-white/10">
            {!isEditingVideo ? (
              <button
                onClick={() => setIsEditingVideo(true)}
                className="text-[10px] font-bold text-primary hover:text-primary/80 flex items-center gap-1.5 py-1 transition-colors"
              >
                <Edit3 className="h-3 w-3" />
                <span>{activeVideoUrl ? "Alterar link do vídeo deste termo" : "+ Inserir arquivo ou link de vídeo neste termo"}</span>
              </button>
            ) : (
              <div className="space-y-2 p-2 rounded-xl bg-white/5 border border-white/10 mt-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
                  <span>Inserir Vídeo (YouTube ou MP4):</span>
                  <button onClick={() => setIsEditingVideo(false)} className="text-slate-400 hover:text-white">
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="https://youtube.com/watch?v=... ou .mp4"
                  value={videoInputUrl}
                  onChange={(e) => setVideoInputUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-primary"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[10px] px-2 text-slate-400 hover:text-white"
                    onClick={() => setIsEditingVideo(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-[10px] px-3 font-bold bg-primary hover:bg-primary/90 text-white flex items-center gap-1"
                    onClick={handleSaveVideoUrl}
                  >
                    <Save className="h-3 w-3" /> Salvar Vídeo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modal de Colaboração Comunitária em Libras */}
      <LibrasCollaborationModal
        isOpen={collabModal.isOpen}
        onClose={() => setCollabModal(prev => ({ ...prev, isOpen: false }))}
        term={collabModal.term}
        initialType={collabModal.type}
      />
    </AnimatePresence>
  );
};
