"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit3, Video, Eye, EyeOff, Save, X, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlossaryTermForm {
  term: string;
  description: string;
  videoUrl?: string;
  examples?: string[];
  related?: string[];
}

interface GlossaryEditorProps {
  eixoTitle: string;
  eixoId: string;
  terms: any[];
  onTermUpdate: (termName: string, updates: Partial<GlossaryTermForm>) => Promise<void>;
  onTermAdd: (term: GlossaryTermForm) => Promise<void>;
  onTermDelete: (termName: string) => Promise<void>;
  canEdit: boolean;
}

export function GlossaryEditor({
  eixoTitle,
  eixoId,
  terms,
  onTermUpdate,
  onTermAdd,
  onTermDelete,
  canEdit,
}: GlossaryEditorProps) {
  const [editingTerm, setEditingTerm] = useState<GlossaryTermForm | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEditStart = (term: any) => {
    setEditingTerm(term);
    setSelectedTerm(term.term);
    setError(null);
  };

  const handleNewTerm = () => {
    setEditingTerm({
      term: "",
      description: "",
      videoUrl: "",
      examples: [""],
      related: [],
    });
    setIsCreating(true);
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!editingTerm?.term.trim()) {
      setError("O termo não pode estar vazio.");
      return false;
    }
    if (!editingTerm?.description.trim()) {
      setError("A descrição não pode estar vazia.");
      return false;
    }
    if (editingTerm?.videoUrl && !editingTerm.videoUrl.includes("youtube") && !editingTerm.videoUrl.includes("youtu.be")) {
      setError("Por favor, use um link do YouTube ou embed do YouTube.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (isCreating) {
        await onTermAdd(editingTerm!);
      } else if (selectedTerm && editingTerm) {
        await onTermUpdate(selectedTerm, editingTerm);
      }
      setEditingTerm(null);
      setIsCreating(false);
      setSelectedTerm(null);
      setVideoPreview(null);
    } catch (err) {
      setError("Erro ao salvar o termo. Tente novamente.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (termName: string) => {
    if (!confirm("Tem certeza que deseja deletar este termo?")) return;

    try {
      await onTermDelete(termName);
      setSelectedTerm(null);
    } catch (err) {
      setError("Erro ao deletar termo.");
      console.error(err);
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const getEmbedUrl = (url: string): string => {
    const youtubeId = extractYouTubeId(url);
    return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : url;
  };

  if (!canEdit) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-700 font-medium">
              Você não tem permissão para editar glossários.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-primary tracking-tighter italic mb-2">
            {eixoTitle}
          </h3>
          <p className="text-sm text-muted-foreground">
            {terms.length} termo{terms.length !== 1 ? "s" : ""} neste eixo
          </p>
        </div>
        <Button onClick={handleNewTerm} className="rounded-full gap-2">
          <Plus className="h-4 w-4" />
          Novo Termo
        </Button>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editing Form */}
      {editingTerm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-primary/30 rounded-xl p-6 bg-primary/5 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-lg">
              {isCreating ? "Novo Termo" : "Editar Termo"}
            </h4>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setEditingTerm(null);
                setIsCreating(false);
                setError(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Term Name */}
          <div className="space-y-2">
            <Label htmlFor="term-name" className="font-bold">
              Termo (em Português)
            </Label>
            <Input
              id="term-name"
              value={editingTerm.term}
              onChange={(e) => setEditingTerm({ ...editingTerm, term: e.target.value })}
              placeholder="Ex: Imunidade"
              className="font-bold text-lg"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="term-desc" className="font-bold">
              Descrição Técnica
            </Label>
            <Textarea
              id="term-desc"
              value={editingTerm.description}
              onChange={(e) => setEditingTerm({ ...editingTerm, description: e.target.value })}
              placeholder="Defina o termo com clareza para o público surdo..."
              className="min-h-[100px]"
            />
          </div>

          {/* Video URL */}
          <div className="space-y-2">
            <Label htmlFor="video-url" className="font-bold flex items-center gap-2">
              <Video className="h-4 w-4 text-pink-600" />
              Link do Vídeo em Libras
            </Label>
            <Input
              id="video-url"
              value={editingTerm.videoUrl || ""}
              onChange={(e) => {
                setEditingTerm({ ...editingTerm, videoUrl: e.target.value });
                if (e.target.value) {
                  setVideoPreview(getEmbedUrl(e.target.value));
                }
              }}
              placeholder="Cole o link do YouTube ou embed"
              className="text-sm"
            />
            {videoPreview && (
              <div className="mt-3 rounded-lg overflow-hidden border-2 border-slate-200 bg-slate-900">
                <iframe
                  src={videoPreview}
                  width="100%"
                  height="200"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Examples */}
          <div className="space-y-2">
            <Label className="font-bold">Exemplos de Uso</Label>
            <div className="space-y-2">
              {editingTerm.examples?.map((example, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={example}
                    onChange={(e) => {
                      const newExamples = [...(editingTerm.examples || [])];
                      newExamples[idx] = e.target.value;
                      setEditingTerm({ ...editingTerm, examples: newExamples });
                    }}
                    placeholder={`Exemplo ${idx + 1}`}
                    className="text-sm"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditingTerm({
                        ...editingTerm,
                        examples: editingTerm.examples?.filter((_, i) => i !== idx),
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setEditingTerm({
                    ...editingTerm,
                    examples: [...(editingTerm.examples || []), ""],
                  })
                }
              >
                <Plus className="h-3 w-3 mr-1" />
                Adicionar Exemplo
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-primary/20">
            <Button
              variant="outline"
              onClick={() => {
                setEditingTerm(null);
                setIsCreating(false);
              }}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-2" />
              {isSaving ? "Salvando..." : "Salvar Termo"}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Terms List */}
      <div className="grid gap-3">
        {terms.map((term, idx) => (
          <motion.div
            key={idx}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-white rounded-lg border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h5 className="font-black text-base uppercase tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                  {term.term}
                </h5>
                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                  {term.description}
                </p>
                {term.videoUrl && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-pink-600 font-semibold">
                    <Video className="h-3 w-3" />
                    Vídeo em Libras disponível
                  </div>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => handleEditStart(term)}
                >
                  <Edit3 className="h-4 w-4 text-blue-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => handleDelete(term.term)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {terms.length === 0 && !editingTerm && (
        <div className="p-12 text-center bg-slate-50 rounded-lg border border-slate-200 border-dashed">
          <h4 className="text-lg font-bold text-slate-400 mb-2">Nenhum termo neste eixo</h4>
          <p className="text-sm text-slate-500 mb-4">
            Clique no botão acima para começar a adicionar termos.
          </p>
        </div>
      )}
    </div>
  );
}
