"use client";

import { useState, useEffect, useRef } from "react";
import { dataService } from "@/lib/data-service";
import { CMSBlock, INSTITUTIONAL_PALETTE } from "@/lib/cms-schema";
import { MediaManagerModal } from "./MediaManagerModal";
import { 
    Image as ImageIcon, 
    Accessibility, 
    Palette, 
    AlertCircle,
    ArrowUp,
    ArrowDown,
    Trash2,
    Copy,
    Settings,
    MessageSquare,
    Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStudio } from "@/context/StudioContext";

interface BlockEditorProps {
    block: CMSBlock;
    onUpdate?: () => void;
}

export function BlockEditor({ block, onUpdate }: BlockEditorProps) {
    const { mode, setHasUnsavedChanges, saveTrigger } = useStudio();
    
    // Internal Draft State (real-time WYSIWYG)
    const [draft, setDraft] = useState(block.draft || block.content);
    const [draftData, setDraftData] = useState<any>(block.draftData || block.data || {});
    const [style, setStyle] = useState(block.style || { preset: 'neutral', alignment: 'left' });
    const [accessibility, setAccessibility] = useState(block.accessibility || { librasUrl: '', altText: '', description: '', internalNotes: '' });

    // Modals & Panels
    const [isHovered, setIsHovered] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showMediaManager, setShowMediaManager] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const editableRef = useRef<HTMLElement>(null);

    useEffect(() => {
        setUserId(dataService.getCurrentUserId());
    }, []);

    // Monitor Unsaved Changes based on local divergence
    useEffect(() => {
        const hasChanges = 
            draft !== (block.draft || block.content) ||
            JSON.stringify(draftData) !== JSON.stringify(block.draftData || block.data || {}) ||
            JSON.stringify(style) !== JSON.stringify(block.style) ||
            JSON.stringify(accessibility) !== JSON.stringify(block.accessibility);
        
        if (hasChanges) {
            setHasUnsavedChanges(true);
        }
    }, [draft, draftData, style, accessibility]);

    // Save Hook from Toolbar
    useEffect(() => {
        if (saveTrigger > 0) {
            handleSaveDraft();
        }
    }, [saveTrigger]);

    const handleSaveDraft = async () => {
        const hasChanges = 
            draft !== (block.draft || block.content) ||
            JSON.stringify(draftData) !== JSON.stringify(block.draftData || block.data || {}) ||
            JSON.stringify(style) !== JSON.stringify(block.style) ||
            JSON.stringify(accessibility) !== JSON.stringify(block.accessibility);
            
        if (!hasChanges) return;

        const success = await dataService.updateBlockDraft(block.id, draft, draftData, accessibility, style);
        if (success) {
            setHasUnsavedChanges(false);
            if (onUpdate) onUpdate();
        }
    };

    const handleStructuralAction = async (action: 'up' | 'down' | 'delete' | 'duplicate') => {
        if (action === 'up' || action === 'down') {
            await dataService.reorderBlock(block.pageId, block.id, action === 'up' ? 'UP' : 'DOWN');
        } else if (action === 'delete') {
            const confirmed = window.confirm("Excluir bloco?");
            if (confirmed) await dataService.deleteBlock(block.id);
        } else if (action === 'duplicate') {
            const newData = { ...block, id: undefined };
            // Na implementação real, vc recriaria ou usaria addBlock.
            await dataService.addBlock(block.pageId, block.type, (block.order || 0) + 1);
        }
        if (onUpdate) onUpdate();
    };

    // WYSIWYG Content Update Event
    const handleContentEdit = (e: React.FormEvent<HTMLElement>) => {
        setDraft(e.currentTarget.textContent || '');
    };

    if (mode !== 'draft') return null;

    const canEdit = userId ? dataService.podeEditar(userId) : false;

    return (
        <div 
            className={cn(
                "group relative transition-all duration-300 rounded-3xl",
                isHovered ? "ring-2 ring-primary/30 ring-offset-4 bg-slate-50/50" : "hover:ring-1 hover:ring-slate-200"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setShowSettings(false); }}
        >
            {/* Structural Float Menu */}
            {isHovered && canEdit && (
                <div className="absolute -left-12 top-0 flex flex-col gap-1 bg-white p-1 rounded-2xl shadow-xl border border-slate-100 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => handleStructuralAction('up')} className="h-8 w-8 rounded-xl text-slate-400 hover:text-primary"><ArrowUp size={14} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleStructuralAction('down')} className="h-8 w-8 rounded-xl text-slate-400 hover:text-primary"><ArrowDown size={14} /></Button>
                    <div className="h-px bg-slate-100 my-1 mx-2" />
                    <Button variant="ghost" size="icon" onClick={() => handleStructuralAction('duplicate')} className="h-8 w-8 rounded-xl text-slate-400 hover:text-emerald-500"><Copy size={14} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleStructuralAction('delete')} className="h-8 w-8 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={14} /></Button>
                </div>
            )}

            {/* Block Settings Overlay Trigger */}
            {isHovered && canEdit && (
                <div className="absolute -top-3 right-4 z-30 flex items-center gap-2">
                    <Badge variant="outline" className="bg-white text-[9px] uppercase font-black">{block.type}</Badge>
                    <Button 
                        onClick={() => setShowSettings(!showSettings)} 
                        size="sm" 
                        className="h-6 gap-1 rounded-full text-[10px] uppercase font-black bg-primary text-white shadow-lg shadow-primary/20"
                    >
                        <Settings size={12} /> Config
                    </Button>
                </div>
            )}

            {/* Rejection Alert */}
            {block.rejectionReason && (
                <div className="absolute -top-12 left-4 right-4 p-3 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2 z-40 shadow-xl">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-[10px] font-bold text-red-800 italic leading-snug">
                        Coordenação: "{block.rejectionReason}"
                    </p>
                </div>
            )}

            {/* Block Settings Panel */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-10 right-4 w-80 bg-white shadow-2xl rounded-3xl border border-slate-100 p-6 z-40 space-y-6"
                    >
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Palette size={12}/> Paleta do Bloco</label>
                            <div className="flex gap-2">
                                {(['primary', 'secondary', 'accent', 'neutral'] as const).map((p) => (
                                    <button 
                                        key={p}
                                        onClick={() => { setStyle({...style, preset: p}); handleSaveDraft(); }}
                                        className={cn(
                                            "w-8 h-8 rounded-xl border-2 transition-all",
                                            style.preset === p ? "border-slate-800 scale-110" : "border-transparent"
                                        )}
                                        style={{ backgroundColor: INSTITUTIONAL_PALETTE[p] }}
                                    />
                                ))}
                            </div>
                        </div>

                        {(block.type === 'button') && (
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><LinkIcon size={12}/> URL de Destino</label>
                                <Input 
                                    value={draftData.url || ''} 
                                    onChange={(e) => setDraftData({...draftData, url: e.target.value})} 
                                    placeholder="https://" 
                                    className="h-8 rounded-xl text-xs bg-slate-50"
                                />
                            </div>
                        )}

                        <div className="pt-4 border-t border-slate-100 space-y-4">
                            <label className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Accessibility size={12} /> Acessibilidade</label>
                            <Input value={accessibility.altText} onChange={(e) => setAccessibility({...accessibility, altText: e.target.value})} placeholder="Texto Alternativo (Alt)" className="h-8 rounded-xl text-xs bg-slate-50 border-emerald-100 focus:border-emerald-500" />
                            {block.type === 'video' && (
                                <Input value={accessibility.librasUrl} onChange={(e) => setAccessibility({...accessibility, librasUrl: e.target.value})} placeholder="URL do Vídeo em Libras" className="h-8 rounded-xl text-xs bg-slate-50 border-emerald-100" />
                            )}
                            <Textarea value={accessibility.internalNotes} onChange={(e) => setAccessibility({...accessibility, internalNotes: e.target.value})} placeholder="Notas da revisão..." className="min-h-[60px] rounded-xl text-xs bg-amber-50/50 border-amber-100" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* WYSIWYG Renderer Core */}
            <div className="p-4 relative" style={{ textAlign: style.alignment || 'left' }}>
                
                {block.type === 'header' && (
                    <h2 
                        ref={editableRef as any}
                        contentEditable={canEdit}
                        onInput={handleContentEdit}
                        suppressContentEditableWarning
                        className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-800 mb-6 focus:outline-none focus:bg-white focus:ring-4 ring-primary/20 rounded-xl px-2 -mx-2 transition-all"
                    >
                        {draft || 'NOVO TÍTULO'}
                    </h2>
                )}

                {block.type === 'text' && (
                    <p 
                        ref={editableRef as any}
                        contentEditable={canEdit}
                        onInput={handleContentEdit}
                        suppressContentEditableWarning
                        className="text-lg text-slate-500 font-medium italic leading-relaxed focus:outline-none focus:bg-white focus:ring-4 ring-primary/20 rounded-xl px-2 -mx-2 transition-all min-h-[1.5rem]"
                    >
                        {draft || 'Insira o texto institucional aqui...'}
                    </p>
                )}

                {block.type === 'image' && (
                    <div className="relative rounded-3xl overflow-hidden aspect-video bg-slate-100 group/img cursor-pointer">
                        {draftData.url ? (
                            <img src={draftData.url} alt={accessibility.altText} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                                <ImageIcon size={32} className="opacity-50" />
                                <span className="text-xs font-black uppercase tracking-widest">Nenhuma Imagem Selecionada</span>
                            </div>
                        )}
                        
                        {canEdit && (
                            <div 
                                onClick={() => setShowMediaManager(true)}
                                className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm"
                            >
                                <Button variant="secondary" className="rounded-full gap-2 font-black uppercase tracking-widest pointer-events-none">
                                    <ImageIcon size={16} /> {draftData.url ? 'Trocar Mídia' : 'Selecionar Mídia'}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {block.type === 'button' && (
                    <div className="pt-4 pb-2">
                         <div 
                            ref={editableRef as any}
                            contentEditable={canEdit}
                            onInput={handleContentEdit}
                            suppressContentEditableWarning
                            className="inline-block bg-primary text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-4 ring-primary/50 relative"
                            style={{ backgroundColor: INSTITUTIONAL_PALETTE[style.preset] || INSTITUTIONAL_PALETTE.primary }}
                         >
                              {draft || "Acessar Aqui"}
                         </div>
                    </div>
                )}
            </div>

            {/* Media Manager Integration */}
            <MediaManagerModal 
                isOpen={showMediaManager} 
                onClose={() => setShowMediaManager(false)}
                onSelect={(url) => setDraftData({ ...draftData, url })}
                requireAltText={true}
            />
        </div>
    );
}
