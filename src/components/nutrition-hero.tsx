'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Leaf, Award, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NutritionHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const journeyBg = PlaceHolderImages.find(img => img.id === 'jornada-bg');
    
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
    const blur = useTransform(scrollYProgress, [0, 0.5], ["blur(0px)", "blur(10px)"]);

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-slate-900">
            {/* Background Image with Parallax and Blur */}
            <motion.div style={{ scale, opacity, filter: blur }} className="absolute inset-0 z-0">
                {journeyBg && (
                    <Image 
                        src={journeyBg.imageUrl} 
                        alt="Semente brotando" 
                        fill 
                        className="object-cover brightness-50"
                        priority
                    />
                )}
                {/* Gradient overlay mimicking Baianidade colors - Terracotta to Navy */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-950/60 via-slate-900/40 to-slate-900/80" />
            </motion.div>

            {/* Geometric Tech Overlays */}
            <div className="absolute inset-0 z-5 pointer-events-none opacity-20">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 L100 0" stroke="white" strokeWidth="0.05" fill="none" />
                    <circle cx="20" cy="20" r="10" stroke="var(--primary)" strokeWidth="0.1" fill="none" />
                </svg>
            </div>

            {/* Hero Content */}
            <div className="container relative z-10 px-4 md:px-6 mt-12">
                <div className="flex flex-col items-center text-center">
                    {/* Glassmorphism Identifier Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-white/20 to-transparent backdrop-blur-2xl border border-white/10 shadow-2xl mb-8 group"
                    >
                        <div className="bg-slate-900/60 rounded-[2.3rem] p-8 md:p-12 border border-white/5">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
                            >
                                <Zap className="w-3 h-3 fill-primary" />
                                Plataforma de Inovação Social
                            </motion.div>
                            
                            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white mb-6 font-headline leading-[0.9] italic group-hover:scale-[1.01] transition-transform duration-700">
                                Nutrindo o <span className="text-primary not-italic">Futuro</span>, <br />
                                <span className="text-orange-500 underline decoration-primary/50 decoration-4 underline-offset-8">Semeando</span> a Saúde
                            </h1>
                            
                            <div className="max-w-2xl mx-auto space-y-4">
                                <p className="text-lg md:text-xl text-slate-200 font-medium leading-relaxed">
                                    Rede de Inovação Social para o Combate às Desigualdades por meio da Alimentação Nutricional e Saudável.
                                </p>
                                <p className="text-sm font-bold text-slate-400 max-w-lg mx-auto">
                                    Um mecanismo de reparação histórico-social no território do Médio Sudoeste Baiano através de tecnologia e educação.
                                </p>
                            </div>

                            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-white/5 pt-8">
                                {[
                                    { label: 'Formação', icon: Award },
                                    { label: 'Inovação', icon: Zap },
                                    { label: 'Segurança', icon: ShieldCheck },
                                    { label: 'Território', icon: Leaf },
                                ].map((pill, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1">
                                        <pill.icon className="w-4 h-4 text-primary opacity-60" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{pill.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.5 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 text-white/30"
                    >
                        <div className="w-px h-16 bg-gradient-to-b from-primary/50 to-transparent animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Desça para conhecer a metodologia</span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
