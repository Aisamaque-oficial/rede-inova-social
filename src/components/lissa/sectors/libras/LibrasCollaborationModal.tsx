"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Ear, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Video, 
  Sparkles, 
  Info,
  Globe,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { librasContributionsService } from "@/lib/libras-contributions-service";

interface LibrasCollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  term: string;
  initialType?: "new_sign" | "regional_variation";
}

export function LibrasCollaborationModal({
  isOpen,
  onClose,
  term,
  initialType = "new_sign",
}: LibrasCollaborationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [type, setType] = useState<"new_sign" | "regional_variation">(initialType);
  const [contributorName, setContributorName] = useState("");
  const [contributorRole, setContributorRole] = useState("Pessoa Surda");
  const [territoryOrRegion, setTerritoryOrRegion] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [signDescription, setSignDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setType(initialType);
    setSubmitted(false);
  }, [initialType, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen || !mounted || typeof document === "undefined") return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await librasContributionsService.submitContribution({
        term,
        type,
        contributorName: contributorName.trim() || "Anônimo",
        contributorRole,
        territoryOrRegion: territoryOrRegion.trim(),
        videoUrl: videoUrl.trim(),
        signDescription: signDescription.trim(),
        notes: notes.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setContributorName("");
    setTerritoryOrRegion("");
    setVideoUrl("");
    setSignDescription("");
    setNotes("");
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-7 relative shrink-0">
            <button
              onClick={handleResetAndClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all backdrop-blur-sm"
              title="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-2 backdrop-blur-sm border border-white/20">
              <Globe className="h-3 w-3" />
              <span>Participação Social Digital</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-snug">
              {type === "new_sign" 
                ? "Enviar Sinal para a Coordenação" 
                : "Compartilhar Variação Regional"}
            </h3>

            <p className="text-xs text-blue-100/90 font-medium mt-1 leading-relaxed">
              Termo selecionado:{" "}
              <strong className="text-amber-300 font-black text-sm uppercase underline decoration-amber-300/40 underline-offset-4">
                {term}
              </strong>
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-700">
            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                    Contribuição Recebida com Sucesso!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Muito obrigado por participar da construção do nosso glossário! Sua indicação de sinal para o termo{" "}
                    <strong>"{term}"</strong> foi enviada diretamente para a coordenação do projeto e equipe de acessibilidade para validação.
                  </p>
                </div>
                <div className="pt-4">
                  <Button
                    onClick={handleResetAndClose}
                    className="rounded-2xl px-6 py-2.5 font-black text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-white shadow-md"
                  >
                    Concluir e Voltar ao Glossário
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Seletor de Tipo de Contribuição */}
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-wider text-slate-600">
                    Tipo de Contribuição:
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setType("new_sign")}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex flex-col gap-1 ${
                        type === "new_sign"
                          ? "bg-blue-50 border-blue-500 text-blue-900 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="font-black text-xs">🤟 Novo Sinal</span>
                      <span className="text-[10px] font-normal opacity-80">
                        Termo ainda não possui sinal no site
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setType("regional_variation")}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex flex-col gap-1 ${
                        type === "regional_variation"
                          ? "bg-amber-50 border-amber-500 text-amber-900 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="font-black text-xs">🗺️ Variação Regional</span>
                      <span className="text-[10px] font-normal opacity-80">
                        Conheço esse sinal de outra forma na minha região
                      </span>
                    </button>
                  </div>
                </div>

                {/* Nota Explicativa */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-slate-800 uppercase text-[10px] tracking-wide">
                    <Info className="h-3.5 w-3.5 text-blue-600" />
                    <span>Por que a sua colaboração é importante?</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    A Libras é viva e possui ricas variações regionais. Compartilhar como sua comunidade ou território sinaliza este conceito amplia o letramento científico acessível em todo o país.
                  </p>
                </div>

                {/* Campos do Formulário */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contrib-name" className="text-xs font-bold text-slate-700">
                      Seu Nome / Nome Social:
                    </Label>
                    <Input
                      id="contrib-name"
                      placeholder="Ex: Maria Silva (ou deixe em branco se preferir)"
                      value={contributorName}
                      onChange={(e) => setContributorName(e.target.value)}
                      className="rounded-xl bg-slate-50 text-xs h-10 border-slate-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contrib-region" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      Sua Cidade / Estado / Território: *
                    </Label>
                    <Input
                      id="contrib-region"
                      required
                      placeholder="Ex: Vitória da Conquista - BA"
                      value={territoryOrRegion}
                      onChange={(e) => setTerritoryOrRegion(e.target.value)}
                      className="rounded-xl bg-slate-50 text-xs h-10 border-slate-200 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contrib-role" className="text-xs font-bold text-slate-700">
                    Sua identificação:
                  </Label>
                  <select
                    id="contrib-role"
                    value={contributorRole}
                    onChange={(e) => setContributorRole(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 text-xs border border-slate-200 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Pessoa Surda">Pessoa Surda</option>
                    <option value="Intérprete / Tradutor(a) de Libras">Intérprete / Tradutor(a) de Libras</option>
                    <option value="Professor(a) / Pesquisador(a)">Professor(a) / Pesquisador(a)</option>
                    <option value="Estudante">Estudante</option>
                    <option value="Agricultor(a) / Produtor(a)">Agricultor(a) / Produtor(a)</option>
                    <option value="Membro da Comunidade">Membro da Comunidade</option>
                  </select>
                </div>

                {/* Link do Vídeo */}
                <div className="space-y-1.5">
                  <Label htmlFor="contrib-video" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Video className="h-3.5 w-3.5 text-blue-600" />
                    Link do Vídeo do Sinal (YouTube, Drive, Instagram, Loom):
                  </Label>
                  <Input
                    id="contrib-video"
                    placeholder="https://youtube.com/watch?v=... ou link público de vídeo"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="rounded-xl bg-slate-50 text-xs h-10 border-slate-200 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Grave um vídeo rápido sinalizando e cole o link acima (Google Drive, YouTube Não Listado, etc.).
                  </span>
                </div>

                {/* Descrição da Estratégia de Sinalização */}
                <div className="space-y-1.5">
                  <Label htmlFor="contrib-desc" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Descrição do Sinal (Configuração de mão, ponto de articulação e movimento):
                  </Label>
                  <Textarea
                    id="contrib-desc"
                    rows={3}
                    placeholder="Ex: Mão direita em configuração 'B' aberta tocando o peito, com movimento circular..."
                    value={signDescription}
                    onChange={(e) => setSignDescription(e.target.value)}
                    className="rounded-xl bg-slate-50 text-xs border-slate-200 leading-relaxed font-normal"
                  />
                </div>

                {/* Botões de Ação */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResetAndClose}
                    className="rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl px-6 h-11 font-black text-xs uppercase tracking-wider bg-blue-700 hover:bg-blue-800 text-white shadow-lg shadow-blue-900/20 flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? "Enviando..." : "Enviar para a Coordenação"}</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
