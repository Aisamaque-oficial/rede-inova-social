import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Pencil, 
    Loader2, 
    Link as LinkIcon, 
    Check, 
    X, 
    Camera, 
    Sparkles, 
    Image as ImageIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { dataService } from "@/lib/data-service";
import { cn } from "@/lib/utils";

interface ImageEditorProps {
    pageId: string;
    defaultSrc: string;
    alt: string;
    className?: string;
    isStudio?: boolean;
    canEdit?: boolean;
    fill?: boolean;
    width?: number;
    height?: number;
}

export function ImageEditor({ 
    pageId, 
    defaultSrc, 
    alt, 
    className, 
    isStudio, 
    canEdit,
    fill = false,
    width,
    height
}: ImageEditorProps) {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [src, setSrc] = useState(defaultSrc);
    const [tempSrc, setTempSrc] = useState(defaultSrc);
    const [isSaving, setIsSaving] = useState(false);
    const [hasEditPermission, setHasEditPermission] = useState(false);

    useEffect(() => {
        const checkPermission = async () => {
            const userId = dataService.getCurrentUserId();
            console.log(`🔍 [Image Editor] Checking permissions for user: ${userId} on page: ${pageId} (Studio: ${isStudio})`);
            
            if (userId && canEdit) {
                const permission = dataService.podeEditar(userId);
                setHasEditPermission(permission);
            } else {
                setHasEditPermission(false);
            }
        };

        // Load content
        const loadContent = async () => {
            const data = await dataService.getCMSData(pageId, { useDraft: isStudio });
            if (data.content && data.content.startsWith('http')) {
                setSrc(data.content);
                setTempSrc(data.content);
            }
        };

        checkPermission();
        loadContent();
    }, [pageId, isStudio, canEdit]);

    const handleSave = async () => {
        if (!tempSrc) return;
        setIsSaving(true);
        try {
            if (isStudio) {
                await dataService.saveDraftCMS(pageId, { content: tempSrc });
            } else {
                await dataService.updatePageContent(pageId, tempSrc);
            }
            setSrc(tempSrc);
            setIsEditing(false);
            toast({ title: "Imagem Atualizada", description: "O rascunho da imagem foi salvo." });
        } catch (error) {
            toast({ variant: "destructive", title: "Erro ao salvar" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setTempSrc(src);
        setIsEditing(false);
    };

    return (
        <>
            <div 
                className={cn(
                    "group relative overflow-hidden transition-all duration-300 rounded-3xl",
                    isStudio && canEdit && hasEditPermission && !isEditing &&
                        "ring-4 ring-orange-500/20 hover:ring-orange-500/60 cursor-pointer shadow-xl",
                    className
                )}
                onClick={(e) => {
                    if (isStudio && canEdit && hasEditPermission && !isEditing) {
                        e.preventDefault();
                        setIsEditing(true);
                    }
                }}
            >
                <Image 
                    src={src} 
                    alt={alt} 
                    fill={fill} 
                    {...(fill ? {} : { width, height })}
                    className={cn("transition-transform duration-700 group-hover:scale-110", className, fill && "object-cover")} 
                />
                
                {isStudio && canEdit && hasEditPermission && !isEditing && (
                    <>
                        {/* ✏️ Persistent Pencil Indicator */}
                        <div className="absolute top-4 right-4 z-20 animate-in fade-in zoom-in duration-500">
                            <div className="bg-orange-500 text-white p-3 rounded-2xl shadow-2xl border-2 border-white group-hover:scale-125 transition-transform duration-300">
                                <Pencil className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 z-20">
                            <div className="bg-white/95 backdrop-blur-md text-slate-900 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest border border-orange-500/20">
                                <ImageIcon className="h-3.5 w-3.5 text-orange-500" /> Trocar Imagem
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* 🎬 MODAL DE EDIÇÃO DE IMAGEM */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                            onClick={handleCancel}
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)] border-t-[8px] border-orange-500 p-8 overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Camera className="w-4 h-4 text-orange-500" />
                                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Editor de Ativos Estúdio</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Mudar Imagem</h3>
                                </div>
                                <Button variant="ghost" size="icon" onClick={handleCancel} className="rounded-2xl hover:bg-red-50 hover:text-red-500 h-12 w-12">
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">URL da Foto (HTTP/HTTPS)</label>
                                     <div className="relative group">
                                        <Input
                                            value={tempSrc}
                                            onChange={(e) => setTempSrc(e.target.value)}
                                            placeholder="Cole o link da imagem aqui..."
                                            className="h-16 text-sm font-bold pl-14 pr-6 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-orange-500/20"
                                            disabled={isSaving}
                                        />
                                        <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                     </div>
                                </div>

                                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl ring-4 ring-slate-100">
                                    <Image src={tempSrc || defaultSrc} alt="Preview" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6 text-center">
                                        <div className="bg-orange-500 p-3 rounded-full mb-3 shadow-lg">
                                            <Sparkles className="w-6 h-6 animate-pulse" />
                                        </div>
                                        <p className="text-[11px] font-black uppercase tracking-widest italic leading-tight">PRÉVIA DA NOVA IMAGEM</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <Button variant="outline" onClick={handleCancel} className="flex-1 h-14 rounded-2xl font-black uppercase text-xs tracking-widest border-2">
                                    Cancelar
                                </Button>
                                <Button 
                                    onClick={handleSave} 
                                    disabled={isSaving}
                                    className="flex-[2] h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20 gap-2"
                                >
                                    {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : <><Check className="w-5 h-5" /> Confirmar Troca</>}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
