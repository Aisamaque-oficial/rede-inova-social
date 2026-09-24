"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Ear, ArrowLeft } from "lucide-react";
import MainHeader from "@/components/main-header";
import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LissaWrapper } from "@/components/lissa/LissaWrapper";
import LibrasSetor from "@/components/lissa/sectors/LibrasSetor";

function LibrasCientificaContent() {
  const searchParams = useSearchParams();
  const isStudio = searchParams.get("estudio") === "true";

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
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[1px] border-primary/5 rounded-full scale-150" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 w-full max-w-[1780px] mx-auto px-4 sm:px-6 md:px-8 py-8 z-10"
        >
          {/* Navegação Superior / Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link href="/laboratorio">
              <Button 
                variant="ghost" 
                className="group flex items-center gap-2 hover:bg-primary/5 font-black text-xs uppercase tracking-widest text-slate-700 hover:text-primary transition-colors pl-0"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Voltar ao Mapa do Laboratório LISSA
              </Button>
            </Link>

            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Link href="/" className="hover:text-primary transition-colors">Início</Link>
              <span>/</span>
              <Link href="/laboratorio" className="hover:text-primary transition-colors">Laboratório</Link>
              <span>/</span>
              <span className="text-primary font-black">Libras Científica</span>
            </nav>
          </div>

          {/* Wrapper da Estação de Libras */}
          <LissaWrapper title="Libras na Segurança Alimentar" icon={Ear}>
            <LibrasSetor isStudio={isStudio} />
          </LissaWrapper>
        </motion.div>
      </main>

      <footer className="w-full py-16 border-t bg-white mt-auto">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start group">
            <div className="flex items-center gap-4 mb-4">
              <Image 
                src="/assets/logotransparente.png" 
                alt="Logo" 
                width={60} 
                height={60} 
                className="hover:rotate-[360deg] transition-transform duration-1000" 
              />
              <div className="flex flex-col">
                <span className="font-black text-primary text-3xl tracking-tighter uppercase leading-none italic">LISSA</span>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-2">
                  Laboratório de Inovação Social e Segurança Alimentar
                </span>
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
            <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase mb-4">
              Rede de Inovação Social © 2026
            </p>
            <div className="flex gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-2 w-2 rounded-full ${i === 1 ? 'bg-primary' : 'bg-primary/10'}`} />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LibrasCientificaClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center text-slate-400 font-bold">Carregando Estação de Libras Científica...</div>}>
      <LibrasCientificaContent />
    </Suspense>
  );
}
