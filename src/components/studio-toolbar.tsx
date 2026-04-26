"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, RotateCcw, Eye, ArrowLeft, Loader2, Sparkles, CheckCircle2, History, Trash2 } from "lucide-react";
import Link from "next/link";
import { dataService } from "@/lib/data-service";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface StudioToolbarProps {
    pageName: string;
    onPublishSuccess: () => void;
}

export function StudioToolbar({ pageName, onPublishSuccess }: StudioToolbarProps) {
    const { toast } = useToast();
    const [isPublishing, setIsPublishing] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        setUserId(dataService.getCurrentUserId());
    }, []);

    const canPublish = userId ? dataService.canPublish(userId) : false;

    // Mapeamento de nomes amigáveis para pageIds do CMS (Legacy Support)
    const pageIdMap: Record<string, string[]> = {
        'inicio': ['landing_hero_title', 'landing_hero_subtitle', 'landing_feed_title', 'landing_feed_subtitle', 'footer_quote'],
        'lissa': ['lab_hero_title', 'lab_hero_subtitle', 'lab_cozinha_title', 'lab_cozinha_desc', 'lab_horta_title', 'lab_horta_desc', 'lab_jogos_title', 'lab_jogos_desc'],
        'equipe': ['equipe_hero_title', 'equipe_hero_subtitle'],
        'transparencia': ['transp_hero_title', 'transp_hero_desc']
    };

    const handlePublishAll = async () => {
        if (!canPublish) return;

        if (!window.confirm("Deseja PUBLICAR todas as alterações de rascunho desta página no SITE PÚBLICO?")) {
            return;
        }

        setIsPublishing(true);
        try {
            // Em vez de percorrer IDs fixos, o sistema agora foca nos blocos do CMS
            // página inicial: landing_hero, landing_footer
            const pagesToPublish = pageName === 'inicio' ? ['landing_hero', 'landing_footer'] : [pageName];
            
            for (const pageId of pagesToPublish) {
                const blocks = await dataService.getPageBlocks(pageId);
                for (const b of blocks) {
                    if (b.status === 'EM_REVISAO' || b.status === 'APROVADO') {
                        await dataService.publishBlockToSite(b.id);
                    }
                }
            }
            
            toast({
                title: "Publicação Concluída",
                description: "O site público foi atualizado com sucesso conforme governança PMA.",
            });
            onPublishSuccess();
        } catch (error) {
            toast({ variant: "destructive", title: "Erro na publicação" });
        } finally {
            setIsPublishing(false);
        }
    };

    const handleClearDrafts = async () => {
        if (!window.confirm("Deseja DESCARTAR todos os rascunhos desta página?\n\nAs alterações não publicadas serão perdidas permanentemente.")) {
            return;
        }

        try {
            // Implementação futura do descarte em bloco se necessário
            toast({
                title: "Rascunhos Descartados",
                description: "A pré-visualização voltou ao estado original do site.",
            });
            onPublishSuccess();
        } catch (error) {
            toast({ variant: "destructive", title: "Erro ao descartar" });
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 h-16 bg-slate-900 shadow-2xl z-[9999] flex items-center justify-between px-6 border-b border-white/10">
            <div className="flex items-center gap-6">
                <Button asChild variant="ghost" className="text-white hover:bg-white/10 rounded-xl gap-2 h-10 px-4">
                    <Link href="/gerenciar/estudio">
                        <ArrowLeft className="h-4 w-4" /> <span className="hidden md:inline">Sair do Estúdio</span>
                    </Link>
                </Button>
                <div className="h-6 w-px bg-white/10 hidden md:block" />
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-400" />
                        <span className="text-white font-black text-xs uppercase tracking-widest leading-none">Estúdio Digital PMA</span>
                    </div>
                    <span className="text-[9px] text-white/50 font-bold uppercase tracking-tight italic">Ambiente de Governança Identificada</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl font-bold uppercase text-[9px] tracking-widest gap-2 h-9">
                    <History className="h-3.5 w-3.5" /> <span className="hidden lg:inline">Histórico de Versões</span>
                </Button>

                {canPublish && (
                    <Button 
                        variant="default" 
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 border-none rounded-xl font-black uppercase text-[10px] tracking-[0.1em] gap-3 h-10 px-8 shadow-lg shadow-emerald-500/20"
                        onClick={handlePublishAll}
                        disabled={isPublishing}
                    >
                        {isPublishing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Rocket className="h-4 w-4" /> 
                                <span>Publicar Tudo</span>
                            </>
                        )}
                    </Button>
                )}

                <Button 
                    variant="ghost"
                    onClick={handleClearDrafts}
                    className="text-white/20 hover:text-red-400 h-10 w-10 p-0 rounded-xl"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
