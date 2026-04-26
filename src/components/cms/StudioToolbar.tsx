"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
    Layout, 
    Eye, 
    Globe, 
    Save, 
    Rocket, 
    Monitor, 
    Tablet, 
    Smartphone,
    AlertCircle,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { useStudio } from "@/context/StudioContext";
import { cn } from "@/lib/utils";
import { dataService } from "@/lib/data-service";
import { useToast } from "@/hooks/use-toast";

interface StudioToolbarProps {
    onSave: () => Promise<void>;
    onPublish: () => Promise<void>;
}

export default function StudioToolbar({ onSave, onPublish }: StudioToolbarProps) {
    const { 
        mode, setMode, device, setDevice, 
        hasUnsavedChanges, setHasUnsavedChanges, 
        lastSaved, setLastSaved, triggerSave 
    } = useStudio();
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const { toast } = useToast();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        setUserId(dataService.getCurrentUserId());
    }, []);

    const canPublish = userId ? dataService.canPublish(userId) : false;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Dispara o gatilho global que faz todos os blocos se salvarem
            triggerSave();
            
            // Simulação de delay para as promessas dos blocos completarem
            await new Promise(resolve => setTimeout(resolve, 800));
            
            setHasUnsavedChanges(false);
            setLastSaved(new Date().toLocaleTimeString());
            toast({
                title: "Rascunho Sincronizado",
                description: "Todas as alterações foram enviadas para o banco de dados.",
            });
        } catch (error) {
            toast({
                title: "Erro ao Salvar",
                description: "Não foi possível persistir as alterações no momento.",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!confirm("Deseja realmente publicar todas as alterações desta página?")) return;
        
        setIsPublishing(true);
        try {
            // Publica a página inteira (ID fixo por enquanto ou passado via props)
            const success = await dataService.publishPageToSite("landing_page");
            if (success) {
                setHasUnsavedChanges(false);
                toast({
                    title: "🚀 Site Atualizado!",
                    description: "As alterações do rascunho agora são públicas.",
                });
                setMode('live');
            }
        } catch (error) {
            toast({
                title: "Falha na Publicação",
                description: "Erro ao sincronizar rascunhos com a versão live.",
                variant: "destructive"
            });
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4">
            {/* Viewport Control */}
            <div className="glass-morphism h-14 px-2 flex items-center gap-1 rounded-2xl shadow-2xl border border-white/20">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setDevice('desktop')}
                    className={cn("h-10 w-10 rounded-xl", device === 'desktop' ? "bg-primary/10 text-primary" : "text-slate-400")}
                >
                    <Monitor size={18} />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setDevice('tablet')}
                    className={cn("h-10 w-10 rounded-xl", device === 'tablet' ? "bg-primary/10 text-primary" : "text-slate-400")}
                >
                    <Tablet size={18} />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setDevice('mobile')}
                    className={cn("h-10 w-10 rounded-xl", device === 'mobile' ? "bg-primary/10 text-primary" : "text-slate-400")}
                >
                    <Smartphone size={18} />
                </Button>
            </div>

            {/* Mode Control */}
            <div className="glass-morphism h-14 p-1.5 flex items-center gap-1 rounded-2xl shadow-2xl border border-white/20">
                <Button 
                    variant="ghost" 
                    onClick={() => setMode('draft')}
                    className={cn(
                        "h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 transition-all",
                        mode === 'draft' ? "bg-amber-500 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100"
                    )}
                >
                    <Layout size={14} /> Rascunho
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={() => setMode('preview')}
                    className={cn(
                        "h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 transition-all",
                        mode === 'preview' ? "bg-blue-500 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100"
                    )}
                >
                    <Eye size={14} /> Preview
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={() => setMode('live')}
                    className={cn(
                        "h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 transition-all",
                        mode === 'live' ? "bg-emerald-500 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100"
                    )}
                >
                    <Globe size={14} /> Ao Vivo
                </Button>
            </div>

            {/* Actions Control */}
            <div className="glass-morphism h-14 p-1.5 flex items-center gap-2 rounded-2xl shadow-2xl border border-white/20">
                <div className="flex flex-col items-end px-3">
                    <span className={cn(
                        "text-[8px] font-black uppercase tracking-widest whitespace-nowrap",
                        hasUnsavedChanges ? "text-amber-500 animate-pulse" : "text-emerald-500"
                    )}>
                        {hasUnsavedChanges ? "Alterações Pendentes" : "Sincronizado"}
                    </span>
                    {lastSaved && (
                        <span className="text-[7px] font-bold text-slate-400">Salvo: {lastSaved}</span>
                    )}
                </div>

                <Button 
                    onClick={handleSave}
                    disabled={isSaving || !hasUnsavedChanges}
                    className="h-11 rounded-xl bg-slate-900 border-slate-800 text-white hover:bg-slate-800 gap-2 font-black text-[10px] uppercase tracking-widest px-6"
                >
                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Salvar Rascunho
                </Button>

                {canPublish && (
                    <Button 
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-black text-[10px] uppercase tracking-widest px-6 shadow-lg shadow-emerald-500/20"
                    >
                        {isPublishing ? <Loader2 size={14} className="animate-spin" /> : <Rocket size={14} />}
                        Publicar Agora
                    </Button>
                )}
            </div>
        </div>
    );
}
