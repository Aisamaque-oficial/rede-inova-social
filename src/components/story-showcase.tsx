
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Video, Users, FlaskConical, Wrench, ClipboardList, ArrowRight, Pause, Play } from 'lucide-react';
import { bastidoresItems } from '@/lib/mock-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const categories = [
    { title: "Planejamento", description: "Reuniões, brainstorms e alinhamentos estratégicos da equipe.", href: "/bastidores/planejamento", icon: ClipboardList, category: 'planejamento' },
    { title: "Pesquisa", description: "Fotos das investigações, análises e descobertas do projeto.", href: "/bastidores/pesquisa", icon: FlaskConical, category: 'pesquisa' },
    { title: "Extensão", description: "Imagens das nossas ações junto à comunidade.", href: "/bastidores/extensao", icon: Users, category: 'extensao' },
    { title: "Produtos", description: "O processo de criação das nossas tecnologias sociais.", href: "/bastidores/produtos", icon: Wrench, category: 'produtos' },
    { title: "Vídeos", description: "Documentários, tutoriais e registros em vídeo.", href: "/bastidores/videos", icon: Video, category: 'video' },
    { title: "Making Of", description: "Os bastidores das nossas produções e eventos.", href: "/bastidores/making-of", icon: Camera, category: 'making-of' }
];

const STORY_DURATION = 5; // 5 seconds

export default function StoryShowcase() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHoverPaused, setIsHoverPaused] = useState(false);
    const [isClickPaused, setIsClickPaused] = useState(false);

    const isPaused = isHoverPaused || isClickPaused;

    const handleNext = useCallback(() => {
        setActiveIndex(prev => (prev === categories.length - 1 ? 0 : prev + 1));
    }, []);

    useEffect(() => {
        if (isPaused) return;
        const timer = setTimeout(handleNext, STORY_DURATION * 1000);
        return () => clearTimeout(timer);
    }, [activeIndex, isPaused, handleNext]);

    const activeCategory = categories[activeIndex];
    const displayItem = bastidoresItems.find(item => item.category === activeCategory.category);
    const displayImage = displayItem ? PlaceHolderImages.find(img => img.id === displayItem.imagePlaceholderId) : null;
    
    return (
        <section className="bg-background py-20 md:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                     <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Bastidores do Projeto</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Uma Janela para Nossas Ações</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                       Navegue pelas diferentes frentes de atuação do nosso projeto. A reprodução automática pausa ao passar o mouse.
                    </p>
                </div>

                <div 
                    className="max-w-5xl mx-auto bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden"
                    onMouseEnter={() => setIsHoverPaused(true)}
                    onMouseLeave={() => setIsHoverPaused(false)}
                >
                    <div className="p-2 pb-0">
                        <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    className="absolute inset-0"
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {displayImage && (
                                        <Image
                                            src={displayImage.imageUrl}
                                            alt={activeCategory.title}
                                            fill
                                            className="object-cover"
                                            data-ai-hint={displayItem?.imagePlaceholderId ? (PlaceHolderImages.find(i=>i.id===displayItem.imagePlaceholderId)?.imageHint) : 'project activity'}
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                </motion.div>
                            </AnimatePresence>
                             <div className="absolute top-4 right-4 z-20">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsClickPaused(p => !p)
                                    }} 
                                    className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                                >
                                    {isClickPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                                    <span className="sr-only">{isClickPaused ? 'Continuar' : 'Pausar'}</span>
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 p-8 text-white z-10">
                                <Link href={activeCategory.href}>
                                    <h3 className="text-3xl md:text-4xl font-bold text-shadow-lg hover:underline">{activeCategory.title}</h3>
                                </Link>
                                <p className="mt-2 text-md max-w-2xl text-white/90 text-shadow">{displayItem?.description}</p>
                            </div>
                        </div>
                    </div>
                     <div className="flex items-center justify-center gap-1 md:gap-2 p-2 flex-wrap">
                         {categories.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={cn(
                                    "relative h-12 px-3 py-2 md:px-4 rounded-md text-xs md:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden text-zinc-400 group flex-1",
                                )}
                            >
                                <div className={cn(
                                    "absolute inset-0 transition-colors z-0",
                                    activeIndex === index ? "bg-primary" : "bg-zinc-800 group-hover:bg-zinc-700"
                                )} />
                                
                                {/* Progress bar container */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                                    <AnimatePresence>
                                        {activeIndex === index && (
                                            <motion.div
                                                key={activeIndex + (isPaused ? '_paused' : '_playing')} // This key is crucial to restart the animation
                                                className="h-full bg-white"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={ isPaused ? { duration: 0 } : {
                                                    duration: STORY_DURATION,
                                                    ease: "linear"
                                                }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                                <category.icon className={cn("h-4 w-4 z-10 transition-colors", activeIndex === index ? "text-primary-foreground" : "text-zinc-400 group-hover:text-white")} />
                                <span className={cn("hidden sm:inline z-10 transition-colors", activeIndex === index ? "text-primary-foreground" : "text-zinc-400 group-hover:text-white")}>{category.title}</span>
                            </button>
                        ))}
                         <Link href="/bastidores" className="relative h-12 px-3 md:px-4 rounded-md text-xs md:text-sm font-medium transition-colors bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white flex items-center justify-center gap-2 flex-grow md:flex-grow-0">
                            <span className="hidden sm:inline">Ver todos</span> <ArrowRight className="h-4 w-4" />
                         </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
