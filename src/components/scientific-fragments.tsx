"use client";

import { useState } from "react";
import { ScientificFragment, scientificFragments, librasGlossary } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Play, 
    X, 
    Maximize2, 
    Clock, 
    Zap, 
    ChevronRight,
    Instagram,
    Smartphone,
    Info,
    Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScientificFragmentsProps {
    activeAxisId?: string;
}

export function ScientificFragments({ activeAxisId }: ScientificFragmentsProps) {
    const [selectedFragment, setSelectedFragment] = useState<ScientificFragment | null>(null);
    const [filter, setFilter] = useState<string>("All");

    // Filtrar fragmentos por eixo (se fornecido) ou por categoria (se selecionada)
    const filteredFragments = scientificFragments.filter(fragment => {
        if (activeAxisId && fragment.axisId !== activeAxisId) return false;
        if (filter !== "All" && fragment.category !== filter) return false;
        return true;
    });

    const categories = ["All", "Cotidiano", "Saúde", "ANVISA", "Ciência"];

    return (
        <div className="space-y-10">
            {/* Header / Filtros */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-black text-primary tracking-tighter uppercase italic">Fragmentos Científicos</h3>
                    <p className="text-sm font-medium text-muted-foreground mt-1 underline decoration-primary/20 underline-offset-4">
                        Conhecimento científico em Libras (até 2 min)
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant={filter === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(cat)}
                            className={cn(
                                "rounded-full text-[10px] font-black uppercase tracking-widest h-8 px-4 transition-all",
                                filter === cat ? "shadow-lg shadow-primary/20" : "bg-white/50 border-primary/10"
                            )}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Grid de Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredFragments.map((fragment, index) => (
                    <motion.div
                        key={fragment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -8 }}
                    >
                        <Card 
                            className="group relative aspect-[9/16] rounded-[2.5rem] overflow-hidden border-none shadow-xl cursor-pointer ring-1 ring-black/5"
                            onClick={() => setSelectedFragment(fragment)}
                        >
                            {/* Thumbnail */}
                            <img 
                                src={fragment.thumbnail} 
                                alt={fragment.title} 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            
                            {/* Overlay Gradiente */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Conteúdo do Card */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <Badge className="bg-primary/90 text-white border-none text-[8px] font-black uppercase px-2 py-0.5 rounded-full backdrop-blur-sm">
                                        {fragment.category}
                                    </Badge>
                                    {fragment.isNew && (
                                        <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/10 backdrop-blur-md text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                                        <Zap className="h-3 w-3 text-primary fill-primary" /> 2 min
                                    </div>
                                    <h4 className="text-sm font-black text-white leading-tight uppercase tracking-tighter italic line-clamp-3 group-hover:text-primary transition-colors">
                                        {fragment.title}
                                    </h4>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-transform">
                                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                                            <Play className="h-4 w-4 fill-white" />
                                        </div>
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Assistir agora</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}

                {filteredFragments.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4 opacity-30">
                        <Smartphone className="h-12 w-12 mx-auto" />
                        <p className="text-xs font-black uppercase tracking-widest italic">Nenhum fragmento encontrado neste eixo</p>
                    </div>
                )}
            </div>

            {/* Modal de Player Imersivo */}
            <AnimatePresence>
                {selectedFragment && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-10 lg:p-20">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                            onClick={() => setSelectedFragment(null)}
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="relative w-full max-w-[450px] aspect-[9/16] bg-slate-900 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col"
                        >
                            {/* Header do Player */}
                            <div className="absolute top-0 left-0 right-0 p-8 z-20 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center">
                                        <Zap className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Fragmento LISSA</p>
                                        <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Mediação em Libras</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedFragment(null)}
                                    className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Video Embed */}
                            <div className="flex-1 relative">
                                <iframe
                                    src={`${selectedFragment.videoUrl.replace('watch?v=', 'embed/')}?autoplay=1&mute=0&controls=0&modestbranding=1`}
                                    className="absolute inset-0 w-full h-[150%] top-1/2 -translate-y-1/2 scale-150 pointer-events-none"
                                    allow="autoplay; encrypted-media"
                                    title={selectedFragment.title}
                                />
                                
                                {/* Controles Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-primary text-white border-none text-[9px] font-black px-3 py-1 uppercase tracking-widest h-5">
                                                {selectedFragment.category}
                                            </Badge>
                                            <Badge variant="outline" className="text-white border-white/30 text-[9px] font-black px-3 py-1 uppercase tracking-widest h-5 backdrop-blur-md">
                                                {librasGlossary.find(e => e.id === selectedFragment.axisId)?.title.split('—')[0]}
                                            </Badge>
                                        </div>
                                        <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-lg">
                                            {selectedFragment.title}
                                        </h4>
                                        <p className="text-sm font-medium text-white/70 leading-relaxed italic pr-12 line-clamp-3">
                                            "{selectedFragment.description}"
                                        </p>
                                    </div>

                                    {/* Action bar */}
                                    <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                                        <Button variant="ghost" size="sm" className="rounded-full text-white/60 hover:text-white gap-2 flex-1 border border-white/10 bg-white/5">
                                            <Instagram className="h-4 w-4" />
                                            <span className="text-[10px] font-black uppercase">Abrir no IG</span>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="rounded-full text-white/60 hover:text-white gap-2 flex-1 border border-white/10 bg-white/5">
                                            <Share2 className="h-4 w-4" />
                                            <span className="text-[10px] font-black uppercase">Compartilhar</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
