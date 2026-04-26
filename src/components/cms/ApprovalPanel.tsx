"use client";

import { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { CMSBlock } from "@/lib/cms-schema";
import { 
    CheckCircle2, 
    XCircle, 
    MessageSquare, 
    ArrowRight, 
    Globe, 
    User, 
    Clock,
    AlertCircle,
    FileSearch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ApprovalPanelProps {
    blocks: CMSBlock[];
    onAction?: () => void;
}

export function ApprovalPanel({ blocks, onAction }: ApprovalPanelProps) {
    const [userId, setUserId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    useEffect(() => {
        setUserId(dataService.getCurrentUserId());
    }, []);

    const pendingBlocks = blocks.filter(b => b.status === 'EM_REVISAO' || b.status === 'APROVADO');
    const canPublish = userId ? dataService.canPublish(userId) : false;

    if (!canPublish) return null;

    const handlePublish = async (blockId: string) => {
        setIsProcessing(blockId);
        const success = await dataService.publishBlockToSite(blockId);
        if (success && onAction) onAction();
        setIsProcessing(null);
    };

    const handleReject = async (blockId: string) => {
        const notes = window.prompt("Digite o motivo do ajuste (apontamento):", "Ajustar texto conforme diretrizes...");
        if (notes === null) return; // Cancelou

        setIsProcessing(blockId);
        const success = await dataService.rejectBlockWithNotes(blockId, notes);
        if (success && onAction) onAction();
        setIsProcessing(null);
    };

    return (
        <Card className="border-2 border-emerald-100 bg-emerald-50/30 overflow-hidden rounded-[2.5rem] shadow-xl shadow-emerald-900/5">
            <CardHeader className="bg-white border-b border-emerald-50 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-emerald-500 text-white font-black uppercase tracking-widest text-[9px] px-3 py-1">
                                Centro de Governança
                            </Badge>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Controle de Publicação</span>
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tighter italic uppercase text-slate-800">
                            Aprovações <span className="text-emerald-500">Pendentes</span>
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-500 font-medium italic mt-2">
                            Analise as edições da equipe e autorize a publicação no site público.
                        </CardDescription>
                    </div>
                    <div className="h-16 w-16 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <FileSearch size={32} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8">
                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {pendingBlocks.map((block) => (
                            <motion.div 
                                key={block.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center gap-6"
                            >
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50">
                                            Seção: {block.id}
                                        </Badge>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <User size={12} /> {block.metadata.lastEditedByName}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <Clock size={12} /> {new Date(block.metadata.lastEditedAt).toLocaleTimeString()}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2">Versão Pública</p>
                                            <p className="text-sm font-medium text-slate-400 italic line-clamp-2">
                                                {block.content || "(Vazio)"}
                                            </p>
                                        </div>
                                        <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600 mb-2">Nova Versão (Rascunho)</p>
                                            <p className="text-sm font-black text-slate-700 italic leading-relaxed">
                                                {block.draft}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {block.accessibility.internalNotes && (
                                        <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-start gap-3">
                                            <MessageSquare size={14} className="text-amber-500 mt-1" />
                                            <p className="text-[10px] font-medium text-amber-700 italic">
                                                <span className="font-black uppercase tracking-widest mr-2">Nota da Editora:</span>
                                                {block.accessibility.internalNotes}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 min-w-[180px]">
                                    <Button 
                                        onClick={() => handlePublish(block.id)}
                                        disabled={isProcessing === block.id}
                                        className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 h-14 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-emerald-200"
                                    >
                                        {isProcessing === block.id ? (
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            < Globe size={16} />
                                        )}
                                        Aprovar e Publicar
                                    </Button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button 
                                            variant="outline" 
                                            disabled={isProcessing === block.id}
                                            onClick={() => handleReject(block.id)}
                                            className="rounded-xl h-10 border-slate-200 text-slate-400 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 font-bold uppercase text-[9px]"
                                        >
                                            Pedir Ajuste
                                        </Button>
                                        <Button variant="outline" className="rounded-xl h-10 border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 font-bold uppercase text-[9px]">
                                            Rejeitar
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {pendingBlocks.length === 0 && (
                        <div className="text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-emerald-100">
                             <CheckCircle2 size={48} className="mx-auto text-emerald-200 mb-4" />
                             <p className="text-xl font-black italic uppercase tracking-tighter text-emerald-300">
                                Tudo em Ordem!
                             </p>
                             <p className="text-sm text-emerald-400/60 font-medium italic">
                                Não há edições pendentes para publicação no momento.
                             </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
