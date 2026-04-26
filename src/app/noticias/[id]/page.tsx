"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { dataService } from "@/lib/data-service";
import { News } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, User, Tag, Loader2, Share2, Printer } from "lucide-react";
import MainHeader from "@/components/main-header";
import { VideoEmbed } from "@/components/video-embed";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from "framer-motion";

export default function NewsDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [news, setNews] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNews = async () => {
            if (params.id) {
                const data = await dataService.getNewsById(params.id as string);
                setNews(data);
                setLoading(false);
            }
        };
        loadNews();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">Carregando Notícia...</p>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6">
                <h1 className="text-2xl font-black uppercase text-slate-800 tracking-tighter italic">Notícia não encontrada</h1>
                <Button onClick={() => router.back()} className="rounded-full px-8 font-black uppercase tracking-widest text-[10px]">
                    Voltar ao Portal
                </Button>
            </div>
        );
    }

    const newsImage = news.thumbnailUrl || PlaceHolderImages.find(p => p.id === news.imagePlaceholderId)?.imageUrl || "";

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <MainHeader />
            
            <main className="flex-1 pt-20 pb-24">
                {/* Hero / Cover */}
                <div className="relative h-[400px] md:h-[500px] w-full bg-slate-100 overflow-hidden">
                    <Image 
                        src={newsImage} 
                        alt={news.title}
                        fill
                        className="object-cover opacity-90 blur-[2px] scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="container px-4 text-center space-y-6 max-w-4xl"
                        >
                            <div className="flex justify-center gap-3">
                                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-primary/20 backdrop-blur-md">
                                    {news.tag || news.category || "Notícia"}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-slate-900 leading-[0.9]">
                                {news.title}
                            </h1>
                        </motion.div>
                    </div>
                </div>

                <div className="container px-4 -mt-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Meta Info Bar */}
                        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 md:p-8 mb-12 flex flex-wrap items-center justify-between gap-6 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {new Date(news.publishedAt).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <User className="h-4 w-4 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {news.author}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50" onClick={() => window.print()}>
                                    <Printer className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-slate max-w-none mb-16 px-2">
                            <p className="text-xl md:text-2xl font-medium text-slate-600 italic leading-relaxed mb-10 border-l-4 border-primary pl-6">
                                "{news.excerpt || news.content.substring(0, 150) + '...'}"
                            </p>
                            
                            <div className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                                {news.content}
                            </div>
                        </div>

                        {/* Video Embed Section */}
                        {news.librasVideoUrl && (
                            <section className="space-y-6 pt-12 border-t border-slate-100">
                                <div className="space-y-1">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary italic">Acessibilidade LIBRAS</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Assista a este conteúdo interpretado em libras</p>
                                </div>
                                <VideoEmbed url={news.librasVideoUrl} className="mt-4" />
                            </section>
                        )}

                        <div className="mt-20 flex justify-center">
                            <Button 
                                onClick={() => router.back()}
                                variant="outline" 
                                className="rounded-full px-10 h-14 border-2 font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-900 hover:text-white transition-all group"
                            >
                                <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                Voltar ao Portal
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
