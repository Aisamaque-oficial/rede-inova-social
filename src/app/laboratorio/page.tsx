
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  FlaskConical, 
  Gamepad2, 
  Sprout, 
  Apple, 
  Ear,
  ArrowRight,
  Navigation,
  Book
} from "lucide-react";
import MainHeader from "@/components/main-header";
import { ReactNode } from "react";
import React from "react";
import { dataService } from "@/lib/data-service";
import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { LissaWrapper } from "@/components/lissa/LissaWrapper";
import { LissaGrid } from "@/components/lissa/LissaGrid";
import CozinhaSetor from "@/components/lissa/sectors/CozinhaSetor";
import BibliotecaSetor from "@/components/lissa/sectors/BibliotecaSetor";
import LibrasSetor from "@/components/lissa/sectors/LibrasSetor";
import HortaSetor from "@/components/lissa/sectors/HortaSetor";
import ArenaSetor from "@/components/lissa/sectors/ArenaSetor";

export default function LaboratorioPage({ params }: { params?: { estudio?: string } }) {
  const isStudio = !!params?.estudio;
  const [activeStation, setActiveStation] = useState<string>("map");
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [canEditContent, setCanEditContent] = useState(false);

  useEffect(() => {
    const userId = dataService.getCurrentUserId();
    const hasPermission = userId ? dataService.podeEditar(userId) : false;
    setCanEditContent(hasPermission && isStudio);
  }, [isStudio]);

  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });
  const bgX = useTransform(springX, [0, 1920], [-20, 20]);
  const bgY = useTransform(springY, [0, 1080], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const stations = [
    { id: "nutricao", label: "Cozinha Nutricional", icon: Apple, color: "bg-orange-500", description: "Aprenda sobre comida de verdade e escolhas conscientes." },
    { id: "materiais", label: "Biblioteca de Saberes", icon: Book, color: "bg-blue-500", description: "Acervo de guias, e-books e cartilhas autorais." },
    { id: "libras", label: "Mediação em Libras", icon: Ear, color: "bg-purple-600", description: "Núcleo de tradução técnica, letramento científico e mediação linguística." },
    { id: "agricultura", label: "Horta Comunitária", icon: Sprout, color: "bg-green-600", description: "A força da agricultura familiar e sustentabilidade." },
    { id: "jogos", label: "Arena de Desafios", icon: Gamepad2, color: "bg-indigo-600", description: "Minigames e testes de conhecimento divertidos." },
  ];

  return (
    <div 
        className="flex flex-col min-h-screen pt-20 bg-[#fdfcf8] overflow-hidden selection:bg-primary/30"
        onMouseMove={handleMouseMove}
    >
      <MainHeader />
      
      <main className="flex-1 flex flex-col relative">
        {/* Elementos de fundo dinâmicos */}
        <motion.div 
            style={{ x: bgX, y: bgY }}
            className="absolute inset-0 pointer-events-none opacity-20"
        >
            <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[1px] border-primary/5 rounded-full scale-150" />
        </motion.div>

        {activeStation === "map" ? (
            <section className="flex-1 flex flex-col items-center justify-center container px-4 py-8 z-10 transition-all">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-6 ring-1 ring-primary/20 backdrop-blur-sm">
                        <FlaskConical className="h-4 w-4" />
                        <span>LISSA - Laboratório de Inovação Social e Segurança Alimentar</span>
                    </div>
                    <CMSPageRenderer 
                        pageId="lab_hero"
                        isStudio={isStudio}
                        defaultBlocks={[
                            { id: "lab_hero_title", type: 'header', content: "Laboratório LISSA" },
                            { id: "lab_hero_subtitle", type: 'text', content: '"Explore o futuro da inovação social através da segurança alimentar."' }
                        ]}
                    />
                </motion.div>

                {/* Mapa Central */}
                <LissaGrid 
                  stations={stations}
                  hoveredStation={hoveredStation}
                  setHoveredStation={setHoveredStation}
                  setActiveStation={setActiveStation}
                  isStudio={isStudio}
                />

                <div className="mt-20 flex flex-col items-center gap-4 text-primary/40 animate-pulse">
                    <Navigation className="h-6 w-6" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Selecione uma estação</span>
                </div>
            </section>
        ) : (
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 container px-4 py-12 z-10"
            >
                {/* Navegação Superior */}
                <div className="flex items-center justify-between mb-12">
                    <Button 
                        variant="ghost" 
                        onClick={() => setActiveStation("map")}
                        className="group flex items-center gap-2 hover:bg-primary/5 font-black text-xs uppercase tracking-widest"
                    >
                        <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        Mapa
                    </Button>
                </div>

                {/* CONTEÚDO DINÂMICO - WRAPPER E SETOR */}
                {activeStation === "nutricao" && (
                    <LissaWrapper title="Cozinha Nutricional" icon={Apple}>
                        <CozinhaSetor isStudio={isStudio} canEditContent={canEditContent} />
                    </LissaWrapper>
                )}

                {activeStation === "materiais" && (
                    <LissaWrapper title="Biblioteca de Saberes" icon={Book}>
                        <BibliotecaSetor isStudio={isStudio} />
                    </LissaWrapper>
                )}

                {activeStation === "libras" && (
                    <LissaWrapper title="Mediação em Libras" icon={Ear}>
                        <LibrasSetor isStudio={isStudio} />
                    </LissaWrapper>
                )}

                {activeStation === "agricultura" && (
                    <LissaWrapper title="Horta Comunitária" icon={Sprout}>
                        <HortaSetor isStudio={isStudio} />
                    </LissaWrapper>
                )}

                {activeStation === "jogos" && (
                    <LissaWrapper title="Arena de Desafios" icon={Gamepad2}>
                        <ArenaSetor isStudio={isStudio} />
                    </LissaWrapper>
                )}
            </motion.div>
        )}
      </main>

      <footer className="w-full py-16 border-t bg-white mt-auto">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-center md:items-start group">
                  <div className="flex items-center gap-4 mb-4">
                       <Image src="/assets/logotransparente.png" alt="Logo" width={60} height={60} className="hover:rotate-[360deg] transition-transform duration-1000" />
                       <div className="flex flex-col">
                           <span className="font-black text-primary text-3xl tracking-tighter uppercase leading-none italic">LISSA</span>
                           <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-2">Laboratório de Inovação Social e Segurança Alimentar</span>
                       </div>
                  </div>
                  <div className="text-sm font-bold text-muted-foreground/60 max-w-sm text-center md:text-left italic">
                <CMSPageRenderer 
                    pageId="lab_footer"
                    isStudio={isStudio}
                    defaultBlocks={[
                        { id: "lab_footer_quote", type: 'text', content: '"Transformando a segurança alimentar através da tecnologia e união."' }
                    ]}
                    className="max-w-2xl mx-auto"
                />
                  </div>
            </div>
            <nav className="flex gap-12">
                {["Início", "Agenda", "LISSA"].map((nav) => (
                    <Link 
                        key={nav}
                        href={nav === "Início" ? "/" : `/${nav.toLowerCase()}`} 
                        className="text-xs font-black text-primary hover:text-primary/60 transition-colors tracking-[0.3em] uppercase underline decoration-primary/20 underline-offset-8"
                    >
                        {nav}
                    </Link>
                ))}
            </nav>
            <div className="text-right flex flex-col items-center md:items-end">
                <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase mb-4">Rede de Inovação Social © 2026</p>
                <div className="flex gap-3">
                    {[1, 2, 3, 4].map(i => <div key={i} className={`h-2 w-2 rounded-full ${i === 1 ? 'bg-primary' : 'bg-primary/10'}`} />)}
                </div>
            </div>
        </div>

      </footer>
    </div>
  );
}
