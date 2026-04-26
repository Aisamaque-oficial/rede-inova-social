"use client";

import { useState } from "react";
import { librasGlossary, GlossaryTerm } from "@/lib/mock-data";
import MainHeader from "@/components/main-header";
import { Badge } from "@/components/ui/badge";
import { Library, Search, Ear, Quote, Hash } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Flatten the glossary data to easily search and display
type FlattenedTerm = GlossaryTerm & {
  eixoId: string;
  eixoTitle: string;
  eixoEmoji: string;
  eixoColor: string | undefined;
};

const allTerms: FlattenedTerm[] = librasGlossary.flatMap((eixo: any) =>
  eixo.terms.map((term: any) => ({
    ...term,
    eixoId: eixo.id,
    eixoTitle: eixo.title
      .split("—")[0]
      .trim()
      .replace(/^Eixo (de |do |)\s*/i, ""),
    eixoEmoji: eixo.emoji || "🔖",
    eixoColor: eixo.color,
  })),
);

export default function GlossarioPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeEixoFilter, setActiveEixoFilter] = useState<string>("todos");
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // Filter logic
  const filteredTerms = allTerms.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEixo =
      activeEixoFilter === "todos" || term.eixoId === activeEixoFilter;
    return matchesSearch && matchesEixo;
  });

  return (
    <div className="min-h-screen bg-[#f5f4f0] font-sans selection:bg-primary/20">
      <MainHeader />

      {/* ── HERO ── */}
      <div className="bg-gradient-to-br from-[#0b1e36] via-[#0f2a4a] to-[#071525] text-white pt-32 pb-24 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
          <Library className="absolute -left-10 -bottom-10 w-96 h-96 text-white/[0.02] rotate-12" />
        </div>

        <div className="max-w-7xl mx-auto px-8 md:px-16 relative z-10 flex flex-col items-center text-center">
          <Badge className="bg-white/10 text-white hover:bg-white/20 border-white/10 font-black uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-sm mb-6 shadow-xl">
            Acesso Livre
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95] mb-6 drop-shadow-2xl">
            Glossário
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-primary inline-block pb-2">
              Híbrido
            </span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-white/50 max-w-2xl leading-relaxed">
            Consulte a terminologia completa de Segurança Alimentar com mediação
            científica em Libras. Sistema desenhado para promover letramento
            científico e soberania alimentar.
          </p>
        </div>
      </div>

      {/* ── SEARCH & FILTERS ── */}
      <div className="max-w-7xl mx-auto px-8 md:px-16 -mt-10 relative z-20">
        <div className="bg-white rounded-[2.5rem] p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
            <input
              type="text"
              placeholder="Pesquisar por termo ou definição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-slate-700 font-bold placeholder:text-slate-400 placeholder:font-medium focus:ring-2 focus:ring-primary/20 transition-all text-base"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar pt-2 md:pt-0 shrink-0">
            <button
              onClick={() => setActiveEixoFilter("todos")}
              className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-tight whitespace-nowrap transition-colors ${
                activeEixoFilter === "todos"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              Todos ({allTerms.length})
            </button>
            {librasGlossary.map((eixo) => (
              <button
                key={eixo.id}
                onClick={() => setActiveEixoFilter(eixo.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-tight whitespace-nowrap transition-colors ${
                  activeEixoFilter === eixo.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                <span>{eixo.emoji}</span>
                {eixo.title
                  .split("—")[0]
                  .trim()
                  .replace(/^Eixo (de |do |)\s*/i, "")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── GLOSSARY LIST ── */}
      <div className="max-w-7xl mx-auto px-8 md:px-16 py-16">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Main List */}
          <div className="flex-1 space-y-6">
            {filteredTerms.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                <Search className="h-16 w-16 text-slate-200 mb-6" />
                <h3 className="text-2xl font-black text-slate-400 mb-2">
                  Nenhum termo encontrado
                </h3>
                <p className="text-slate-400 font-medium">
                  Tente ajustar sua busca ou limpar os filtros dos eixos.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredTerms.map((term, i) => {
                  const isActive =
                    activeVideoUrl === term.videoUrl && !!term.videoUrl;

                  return (
                    <motion.div
                      key={i}
                      layout
                      className={`bg-white rounded-[2.5rem] p-8 shadow-sm border transition-all duration-300 relative group ${
                        isActive
                          ? "border-primary ring-4 ring-primary/10 shadow-lg"
                          : "border-slate-100 hover:border-primary/30 hover:shadow-xl"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <span className="text-sm">{term.eixoEmoji}</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                            {term.eixoTitle}
                          </span>
                        </div>
                        {term.videoUrl && (
                          <button
                            onClick={() =>
                              setActiveVideoUrl(isActive ? null : (term.videoUrl || null))
                            }
                            className={`shrink-0 h-10 w-10 flex items-center justify-center rounded-xl transition-all ${
                              isActive
                                ? "bg-primary text-white shadow-lg scale-110"
                                : "bg-primary/5 text-primary hover:bg-primary/20 border border-primary/10"
                            }`}
                            title={isActive ? "Fechar Vídeo" : "Ver em Libras"}
                          >
                            <Ear
                              className={`h-4 w-4 ${isActive ? "animate-pulse" : ""}`}
                            />
                          </button>
                        )}
                      </div>

                      <h3
                        className={`text-2xl font-black uppercase tracking-tighter mb-4 ${isActive ? "text-primary" : "text-slate-800"}`}
                      >
                        {term.term}
                      </h3>

                      <p className="text-sm font-medium text-slate-600 leading-relaxed mb-6">
                        {term.description}
                      </p>

                      <div className="space-y-4">
                        {term.examples && term.examples.length > 0 && (
                          <div className="bg-[#fcfbf9] p-5 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-400 mb-3">
                              <Quote className="h-4 w-4" />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                Contexto
                              </span>
                            </div>
                            <ul className="space-y-3">
                              {term.examples.map((ex: any, idx: number) => (
                                <li
                                  key={idx}
                                  className="text-xs font-medium text-slate-500 leading-relaxed flex gap-3"
                                >
                                  <span className="text-primary/40 mt-1 flex-shrink-0 text-[10px]">
                                    ►
                                  </span>
                                  <span>{ex}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {term.related && term.related.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-50">
                            <Hash className="h-3.5 w-3.5 text-slate-300" />
                            {term.related.map((rel: any, idx: number) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="bg-slate-50 text-slate-500 hover:bg-slate-100 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1"
                              >
                                {rel}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Video Fixed Player (Desktop) */}
          <div className="lg:w-[400px] shrink-0 sticky top-32">
            <AnimatePresence mode="wait">
              {activeVideoUrl ? (
                <motion.div
                  key={activeVideoUrl}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="bg-white rounded-[2.5rem] p-4 shadow-2xl shadow-primary/20 border-2 border-primary/20 overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 py-1.5 px-3 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-bl-xl z-10 shadow-lg">
                    Tradução em Libras
                  </div>
                  <div className="aspect-[9/16] rounded-[2rem] overflow-hidden bg-slate-900 border-4 border-slate-900 relative">
                    <iframe
                      src={`${activeVideoUrl.replace("watch?v=", "embed/")}?autoplay=1&mute=1&loop=1&controls=0`}
                      className="absolute inset-0 w-full h-[150%] top-1/2 -translate-y-1/2 scale-150 pointer-events-none"
                      allow="autoplay; encrypted-media"
                      title="Libras Video"
                    />
                  </div>
                  <button
                    onClick={() => setActiveVideoUrl(null)}
                    className="w-full mt-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                    Fechar Vídeo
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/50 backdrop-blur-sm rounded-[2.5rem] p-10 border border-slate-200 border-dashed text-center h-[500px] flex flex-col items-center justify-center text-slate-400"
                >
                  <Ear className="h-12 w-12 mb-4 text-slate-300" />
                  <p className="font-bold text-sm uppercase tracking-widest mb-2">
                    Painel de Mediação
                  </p>
                  <p className="text-xs font-medium">
                    Selecione o ícone da orelha em qualquer termo para exibir a
                    tradução oficial em Libras.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
