'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import logo from "@/assets/logotransparente.png";
import { Target, Users, Handshake, Globe, Eye, EarOff } from "lucide-react";
import HomeTeamSection from "@/components/home-team-section";
import HomeEventsSection from "@/components/home-events-section";
import HomeMaterialsSection from "@/components/home-materials-section";
import HomeNewsSection from "@/components/home-news-section";
import VisitorCounter from "@/components/visitor-counter";
import StoryShowcase from "@/components/story-showcase";
import NutritionHero from "@/components/nutrition-hero";
import InteractiveNutritionJourney from "@/components/interactive-nutrition-journey";
import MainHeader from "@/components/main-header";
import ImpactGoals from "@/components/impact-goals";
import { cn } from "@/lib/utils";
import MethodologyRoadmap from "@/components/methodology-roadmap";
import GrowingPlantIndicator from "@/components/growing-plant-indicator";

export default function JornadaPage() {
    return (
        <div className="bg-background text-foreground selection:bg-primary selection:text-white pt-20">
            <MainHeader />
            
            <GrowingPlantIndicator />
            
            <main>
                <NutritionHero />

                <MethodologyRoadmap />



                <section className="py-24 bg-sidebar text-sidebar-foreground relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30" />
                    <div className="container px-4 md:px-6 relative z-10">
                        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-block rounded-lg bg-sidebar-accent px-3 py-1 text-sm font-bold mb-4 uppercase tracking-widest text-sidebar-primary">Tecnologia Humana</div>
                                <h2 className="text-4xl md:text-5xl font-black mb-6 font-headline leading-tight italic">Garantindo que o Conhecimento Chegue a Todos</h2>
                                <p className="text-lg text-sidebar-foreground/80 leading-relaxed mb-8 font-medium">
                                    Nosso compromisso com a inclusão vai além do prato. Criamos uma plataforma digital que remove as barreiras de acesso para pessoas surdas, cegas e com baixa visão.
                                </p>
                                <div className="grid gap-6">
                                    {[
                                        { title: "Linguagem Simples", icon: Globe, desc: "Clareza e objetividade para compreensão imediata." },
                                        { title: "Audiodescrição e Contraste", icon: Eye, desc: "Recursos nativos para navegação assistiva visual." },
                                        { title: "Sinalização em Libras", icon: EarOff, desc: "Tradução completa e proprietária para a comunidade surda." },
                                    ].map((item, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            viewport={{ once: true }}
                                            className="flex gap-4 items-start p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-[1.02]"
                                        >
                                            <div className="p-3 rounded-2xl bg-sidebar-primary/20">
                                                <item.icon className="h-6 w-6 text-sidebar-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-lg italic text-sidebar-primary">{item.title}</h4>
                                                <p className="text-sm text-sidebar-foreground/60 font-bold leading-relaxed">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative flex justify-center"
                            >
                                <div className="relative w-full max-w-md aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-[4rem] flex items-center justify-center p-12 overflow-hidden shadow-2xl">
                                    <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-[4rem] animate-spin-slow opacity-20" />
                                    <Image 
                                        src={logo} 
                                        alt="Logo Rede Inovação Social" 
                                        width={320}
                                        height={320}
                                        className="object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform duration-700" 
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
                <StoryShowcase />
                
                <HomeTeamSection />
                <HomeEventsSection />
                <HomeMaterialsSection />
                <HomeNewsSection />

            </main>
            <footer className="relative z-10 flex flex-col gap-6 py-20 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
                <div className="flex flex-col items-center text-center space-y-6 max-w-2xl">
                    <div className="flex flex-col items-center gap-3">
                        <Image src="/images/logo_cnpq.png" alt="Logo CNPq" width={160} height={64} className="mb-2 object-contain" />
                        <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">Projeto financiado pelo Conselho Nacional de Desenvolvimento Científico e Tecnológico - CNPq</p>
                        <p className="text-[10px] font-black text-primary tracking-widest uppercase">Projeto Coordenado pelo prof. Me Aisamaque Gomes de Souza</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mt-2">
                        © 2026. Rede de Inovação Social para o Combate às Desigualdades por meio da Alimentação Nutricional e Saudável
                    </p>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <VisitorCounter />
                    <nav className="flex gap-8">
                        <Link href="#" className="text-[10px] font-black text-primary/60 hover:text-primary transition-colors uppercase tracking-widest">
                            Termos de Serviço
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
