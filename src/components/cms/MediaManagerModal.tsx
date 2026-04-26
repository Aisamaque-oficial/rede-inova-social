"use client";

import { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { 
    X, UploadCloud, Image as ImageIcon, 
    FileWarning, Loader2, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MediaManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    requireAltText?: boolean;
}

export function MediaManagerModal({ isOpen, onClose, onSelect, requireAltText = true }: MediaManagerModalProps) {
    const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');
    const [mediaList, setMediaList] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Upload state
    const [filePos, setFilePos] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (isOpen && activeTab === 'gallery') {
            loadMedia();
        }
    }, [isOpen, activeTab]);

    const loadMedia = async () => {
        setIsLoading(true);
        const list = await dataService.listStudioMedia('draft');
        setMediaList(list);
        setIsLoading(false);
    };

    const handleUpload = async () => {
        if (!filePos) return;
        setIsUploading(true);
        
        const url = await dataService.uploadStudioMedia(filePos, 'draft');
        if (url) {
            setFilePos(null);
            setActiveTab('gallery');
            await loadMedia();
            // Automatically select if uploaded
            onSelect(url);
            onClose();
        }
        
        setIsUploading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200"
            >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-black italic tracking-tighter text-slate-800 uppercase">Biblioteca de Mídia do Estúdio</h3>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Isolamento: /media/studio/draft</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-100 text-slate-400">
                        <X size={18} />
                    </Button>
                </div>

                <div className="flex border-b border-slate-100">
                    <button 
                        onClick={() => setActiveTab('gallery')}
                        className={cn(
                            "flex-1 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors",
                            activeTab === 'gallery' ? "text-primary border-b-2 border-primary bg-primary/5" : "text-slate-400 hover:bg-slate-50"
                        )}
                    >
                        <ImageIcon size={14} /> Mídias do Projeto
                    </button>
                    <button 
                         onClick={() => setActiveTab('upload')}
                        className={cn(
                            "flex-1 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors",
                            activeTab === 'upload' ? "text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50" : "text-slate-400 hover:bg-slate-50"
                        )}
                    >
                        <UploadCloud size={14} /> Carregar Novo
                    </button>
                </div>

                <div className="p-6 min-h-[400px] max-h-[60vh] overflow-y-auto">
                    {activeTab === 'gallery' ? (
                        isLoading ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 pt-20">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <p className="text-xs uppercase tracking-widest font-black">Carregando Biblioteca...</p>
                            </div>
                        ) : mediaList.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 pt-20">
                                <FileWarning className="h-12 w-12 text-slate-200" />
                                <p className="text-xs uppercase tracking-widest font-black">Nenhuma mídia no rascunho</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {mediaList.map((url, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => {
                                            onSelect(url);
                                            onClose();
                                        }}
                                        className="group relative aspect-video bg-slate-100 rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-all duration-300"
                                    >
                                        <img src={url} alt={`Media ${i}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <CheckCircle2 className="text-white h-8 w-8" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="max-w-xl mx-auto pt-8">
                            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:bg-slate-50 hover:border-primary/50 transition-colors">
                                <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                                    <UploadCloud size={32} />
                                </div>
                                <h4 className="text-lg font-black uppercase italic tracking-tighter text-slate-700 mb-2">Selecione um arquivo visual</h4>
                                <p className="text-xs font-medium text-slate-500 mb-8 max-w-sm mx-auto">
                                    Formatos suportados: PNG, JPG, WEBP. As mídias enviadas ficarão isoladas no diretório de *draft* do Estúdio.
                                </p>
                                <Input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => setFilePos(e.target.files?.[0] || null)}
                                    className="max-w-xs mx-auto border-slate-200 rounded-xl"
                                />
                            </div>

                            {filePos && (
                                <div className="mt-8 flex justify-end">
                                    <Button 
                                        onClick={handleUpload}
                                        disabled={isUploading}
                                        className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest gap-2 bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        {isUploading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
                                        Enviar para Rascunho
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
