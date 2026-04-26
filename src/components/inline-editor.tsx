"use client";

import React, { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { Pencil, Check, X, Lock, Sparkles, Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface InlineEditorProps {
  pageId: string;
  defaultContent: string;
  type?: "text" | "textarea" | "html";
  canEdit: boolean;
  isStudio?: boolean;
  videoPageId?: string; // ID for the libras video mapping
  className?: string;
  renderAs?: React.ElementType;
}

export function InlineEditor({
  pageId,
  defaultContent,
  type = "text",
  canEdit,
  isStudio = false,
  videoPageId,
  className,
  renderAs: Component = "span",
}: InlineEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(defaultContent);
  const [draftContent, setDraftContent] = useState(defaultContent);
  const [videoUrl, setVideoUrl] = useState("");
  const [draftVideoUrl, setDraftVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load content on mount
    const loadContent = async () => {
      try {
        const savedData = await dataService.getCMSData(pageId, { useDraft: isStudio });
        
        // TRAVA DE SEGURANÇA: Se o dado for null ou vazio, não sobrescreve o conteúdo padrão
        if (savedData && savedData.content) {
            setContent(savedData.content);
            setDraftContent(savedData.content);
        }

        if (videoPageId) {
            const videoData = await dataService.getCMSData(videoPageId, { useDraft: isStudio });
            if (videoData && videoData.librasVideoUrl) {
                setVideoUrl(videoData.librasVideoUrl);
                setDraftVideoUrl(videoData.librasVideoUrl);
            }
        }
      } catch (e) {
        console.error("Failed to load content for", pageId);
      } finally {
        setIsLoading(false);
      }
    };
    const checkPermissions = async () => {
      const userId = dataService.getCurrentUserId();
      console.log(`🔍 [CMS Editor] Checking permissions for user: ${userId} on page: ${pageId} (Studio: ${isStudio})`);
      
      if (userId && canEdit) {
        const podeEditar = dataService.podeEditar(userId);
        setHasEditPermission(podeEditar);
      } else {
        setHasEditPermission(canEdit);
      }
    };

    loadContent();
    checkPermissions();
  }, [pageId, defaultContent, canEdit, isStudio]);

  const handleSave = async () => {
    const confirmMsg = isStudio 
        ? "Deseja salvar esta alteração apenas como RASCUNHO no Estúdio?\n\n(O público externo não verá esta mudança até você PUBLICAR)"
        : "Deseja realmente alterar a informação PERMANENTE deste componente?\n\n(Isso refletirá IMEDIATAMENTE no site público)";

    if (window.confirm(confirmMsg)) {
      setIsSaving(true);
      try {
        if (isStudio) {
            await dataService.saveDraftCMS(pageId, { content: draftContent });
            if (videoPageId) {
                await dataService.saveDraftCMS(videoPageId, { librasVideoUrl: draftVideoUrl });
            }
        } else {
            await dataService.updatePageCMS(pageId, { content: draftContent });
            if (videoPageId) {
                await dataService.updatePageCMS(videoPageId, { librasVideoUrl: draftVideoUrl });
            }
        }
        
        setContent(draftContent);
        setVideoUrl(draftVideoUrl);
        setIsEditing(false);
        
        // Registrar a edição na auditoria
        const userId = dataService.getCurrentUserId();
        if (userId) {
          dataService.registrarUpload(
            `${pageId}_texto_${isStudio ? 'rascunho' : 'editado'}`,
            "INTERNO" as any,
            "COMUNICACAO" as any,
            "documento"
          );
        }
        
        window.alert(isStudio ? "Rascunho salvo no estúdio!" : "Informação publicada com sucesso!");
      } catch (e) {
        console.error("Save failed", e);
        window.alert("Erro ao salvar.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancel = () => {
    setDraftContent(content);
    setIsEditing(false);
  };

  if (isLoading) {
    return <Component className={cn("opacity-50 animate-pulse", className)}>{defaultContent}</Component>; // Skeleton state
  }

  // Display mode
  const contentNode = type === "html" 
     ? <Component className={cn(className)} dangerouslySetInnerHTML={{ __html: content }} />
     : <Component className={cn(className)}>{content}</Component>;

  if (!canEdit || !hasEditPermission) {
    return (
      <div className="group relative inline-block w-full rounded-md">
        {contentNode}
        {canEdit && !hasEditPermission && (
          <div className="absolute -top-3 -right-3 sm:-right-4 p-2 bg-red-500 text-white rounded-full shadow-lg z-10 flex items-center justify-center" title="Sem permissão de edição">
            <Lock className="w-4 h-4" />
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div 
          className={cn(
              "group relative inline-block w-full rounded-xl transition-all duration-300 p-1 border-2 border-transparent",
              isStudio && canEdit && hasEditPermission && !isEditing &&
                  "border-dashed border-orange-500/20 hover:border-orange-500/60 hover:bg-orange-500/5 hover:shadow-inner cursor-pointer"
          )}
          onClick={(e) => {
              if (isStudio && canEdit && hasEditPermission && !isEditing) {
                  e.preventDefault();
                  setIsEditing(true);
              }
          }}
          data-libras-video={videoUrl}
      >
        {contentNode}
        
        {/* ✏️ Persistent Pencil Indicator in Studio Mode */}
        {isStudio && canEdit && hasEditPermission && !isEditing && (
            <div className="absolute -top-3 -right-3 z-[60] animate-in fade-in zoom-in duration-500">
                <div className="bg-orange-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white group-hover:scale-125 transition-transform duration-300">
                    <Pencil className="w-3.5 h-3.5 fill-current" />
                </div>
            </div>
        )}

        {/* Edit tooltip - More prominent on hover */}
        {isStudio && canEdit && hasEditPermission && !isEditing && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-[70] pointer-events-none transform translate-y-2 group-hover:translate-y-0 text-center">
                <div className="bg-slate-900 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-2xl flex items-center gap-2 whitespace-nowrap mx-auto w-fit">
                    <Sparkles className="w-2.5 h-2.5 text-orange-400" /> Clique Para Editar
                </div>
            </div>
        )}
      </div>

      {/* 🎬 MODAL DE EDIÇÃO AVANÇADO */}
      <AnimatePresence>
        {isEditing && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    onClick={handleCancel}
                />
                
                <motion.div 
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] border-t-[8px] border-orange-500 p-8 md:p-10 overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                                <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Editor Visual Rede Inova</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Editar Informação</h3>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleCancel} className="rounded-2xl hover:bg-red-50 hover:text-red-500 h-12 w-12">
                            <X className="w-6 h-6" />
                        </Button>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conteúdo do Texto</label>
                             {type === "textarea" || type === "html" ? (
                                <Textarea
                                    value={draftContent}
                                    onChange={(e) => setDraftContent(e.target.value)}
                                    className="min-h-[150px] text-lg font-medium p-6 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-orange-500/20"
                                    disabled={isSaving}
                                />
                             ) : (
                                <Input
                                    value={draftContent}
                                    onChange={(e) => setDraftContent(e.target.value)}
                                    className="h-16 text-xl font-bold px-6 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-orange-500/20"
                                    disabled={isSaving}
                                />
                             )}
                        </div>

                        {videoPageId && (
                            <div className="bg-purple-50 p-6 rounded-3xl space-y-3 border border-purple-100">
                                <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                                    <Eye className="w-3.5 h-3.5" /> Tradução em Libras (URL do Vídeo)
                                </label>
                                <Input 
                                    placeholder="https://www.youtube.com/embed/..."
                                    value={draftVideoUrl}
                                    onChange={(e) => setDraftVideoUrl(e.target.value)}
                                    className="bg-white border-none rounded-xl h-12 text-sm"
                                    disabled={isSaving}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 mt-10">
                        <Button variant="outline" onClick={handleCancel} className="flex-1 h-14 rounded-2xl font-black uppercase text-xs tracking-widest border-2">
                            Descartar
                        </Button>
                        <Button 
                            onClick={handleSave} 
                            disabled={isSaving}
                            className="flex-[2] h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20 gap-2"
                        >
                            {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : <><Check className="w-5 h-5" /> {isStudio ? "Salvar no Estúdio" : "Publicar Agora"}</>}
                        </Button>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight italic">
                            {isStudio ? "⚠️ Esta alteração ficará em rascunho até você clicar em 'Publicar' na barra superior." : "🚀 Esta alteração será propagada imediatamente para o site público."}
                        </p>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </>
  );
}
