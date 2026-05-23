"use client";
// Build Stamp: 2026-04-18 20:16

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
const logoPath = "/images/redeinova.png";
import VisitorCounter from "@/components/visitor-counter";

import LogoCarousel from "@/components/logo-carousel";

import { dataService } from "@/lib/data-service";
import { Sector } from "@/lib/mock-data";
import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer";
import MainHeader from "@/components/main-header";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";


import { CMSBlock } from "@/lib/cms-schema";



export default function LandingPage({ params, mode = 'live', device = 'desktop' }: { 
  params?: { estudio?: string },
  mode?: 'draft' | 'preview' | 'live',
  device?: 'desktop' | 'tablet' | 'mobile'
}) {
  const isStudio = !!params?.estudio; // Check if we are in studio mode



  const HERO_BLOCKS: Array<Partial<CMSBlock>> = [
    { id: "landing_hero_title", type: 'header', content: "Conectando Saberes e Realidades" },
    { id: "landing_hero_subtitle", type: 'text', content: "Agricultura familiar, tecnologia e inclusão unidos para transformar o Médio Sudoeste Baiano." }
  ];

  const FOOTER_BLOCKS: Array<Partial<CMSBlock>> = [
    { id: "footer_quote", type: 'text', content: "Tecnologia e inovação social combatendo as desigualdades através da alimentação saudável." }
  ];

  // CMS states governed by CMSPageRenderer now



  return (
    <div className="flex flex-col min-h-screen bg-immersive overflow-hidden">
      <MainHeader />
      
      <main className="w-full flex-1 flex flex-col relative">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <section className="container px-8 md:px-12 lg:px-24 pt-32 pb-20 relative z-10">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 ring-1 ring-primary/20">
                    <Sparkles className="h-3 w-3" />
                    <span>Inovação Social</span>
                </div>
                <CMSPageRenderer 
                    pageId="landing_hero"
                    isStudio={isStudio}
                    mode={mode}
                    device={device}
                    defaultBlocks={HERO_BLOCKS}
                />
              </div>
              <div className="flex flex-wrap gap-6 pt-4">
                <Button asChild size="lg" className="rounded-full h-16 px-10 text-lg font-black uppercase tracking-tighter bg-primary shadow-[0_20px_40px_rgba(44,210,193,0.3)] hover:scale-105 transition-all">
                  <Link href="/jornada">Conheça a Jornada</Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="rounded-full h-16 px-10 text-lg font-black uppercase tracking-tighter border-2 border-primary/20 hover:bg-primary/5 transition-all">
                  <Link href="/laboratorio">Laboratório LISSA</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] scale-75" />
                <div className="relative z-10 p-8 md:p-12 glass-morphism rounded-[5rem] shadow-3xl hover:rotate-2 transition-transform duration-1000">
                    <Image
                        src={logoPath}
                        alt="Rede de Inovação Social"
                        width={600}
                        height={600}
                        className="mx-auto aspect-square overflow-hidden object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] animate-heartbeat"
                    />
                </div>
            </div>
          </div>
        </section>

        {/* Impact goals removed from home page */}





        <section className="py-20 border-y border-primary/5 bg-white/10 backdrop-blur-sm">
            <div className="container px-8 md:px-12 lg:px-24">
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Parceiros e Realizadores</span>
                    <LogoCarousel />
                </div>
            </div>
        </section>
      </main>

      <footer className="w-full py-20 bg-white relative z-10 border-t border-primary/5">
        <div className="container px-8 md:px-12 lg:px-24 flex flex-col items-center">
            <div className="grid md:grid-cols-3 gap-16 w-full mb-16">
                <div className="flex flex-col items-center md:items-start space-y-6">
                    <div className="flex items-center gap-4">
                        <Image src={logoPath} alt="Logo" width={60} height={60} className="drop-shadow-lg" />
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-primary leading-none uppercase tracking-tighter italic">Rede Inova</span>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-2 px-2 py-0.5 bg-primary/5 rounded-full">Médio Sudoeste Baiano</span>
                        </div>
                    </div>
                    <CMSPageRenderer 
                        pageId="landing_footer"
                        isStudio={isStudio}
                        mode={mode}
                        device={device}
                        defaultBlocks={FOOTER_BLOCKS}
                        className="text-center md:text-left"
                    />
                </div>
                <div className="flex flex-col items-center justify-center space-y-8">
                    <nav className="flex flex-col items-center gap-4">
                        <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Para mais informações entre em contato:</span>
                        <a href="mailto:aisamaque.souza@ifbaiano.edu.br" className="text-xs font-black text-primary hover:scale-105 transition-transform uppercase tracking-tighter italic">aisamaque.souza@ifbaiano.edu.br</a>
                    </nav>
                    <VisitorCounter />
                </div>
                <div className="flex flex-col items-center md:items-end justify-center space-y-4">
                    <div className="text-right flex flex-col items-end gap-3">
                        <Image src="/images/logo_cnpq.png" alt="Logo CNPq" width={200} height={80} className="mb-2 object-contain" />
                        <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase text-right max-w-[300px]">Projeto financiado pelo Conselho Nacional de Desenvolvimento Científico e Tecnológico - CNPq</p>
                        <p className="text-[10px] font-black text-primary tracking-widest uppercase">Projeto Coordenado pelo prof. Me Aisamaque Gomes de Souza</p>
                        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-2">&copy; 2026 Todos os Direitos Reservados</p>
                    </div>
                </div>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent mb-8" />
            <p className="text-[8px] text-muted-foreground uppercase font-black tracking-[0.2em] opacity-40">
                Rede de Inovação Social - Sistema de Gestão de Conhecimento e Impacto
            </p>
        </div>
      </footer>
    </div>
  );
}
