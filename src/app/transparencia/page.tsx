"use client";

import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer";
import MainHeader from "@/components/main-header";
import LogoCarousel from "@/components/logo-carousel";
import Link from "next/link";
import { History } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logotransparente.png";
import VisitorCounter from "@/components/visitor-counter";

export default function SobrePage() {
  return (
    <div className="flex flex-col min-h-screen bg-immersive overflow-hidden">
      <MainHeader />
      
      <main className="w-full flex-1 flex flex-col relative pt-32 pb-20">
        <section className="container px-8 md:px-12 lg:px-24 relative z-10">
            <div className="bg-white/40 p-8 md:p-16 rounded-[4rem] shadow-2xl backdrop-blur-xl border border-white/20">
                <CMSPageRenderer 
                    pageId="sobre_page"
                    isStudio={false}
                    defaultBlocks={[]}
                />
            </div>
        </section>
        
        <section className="py-20 border-y border-primary/5 bg-white/10 backdrop-blur-sm mt-20">
            <div className="container px-8 md:px-12 lg:px-24">
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Parceiros & Realizadores</span>
                    <LogoCarousel />
                </div>
            </div>
        </section>
      </main>

      <footer className="w-full py-20 bg-white relative z-10 border-t border-primary/5">
        <div className="container px-8 md:px-12 lg:px-24 flex flex-col items-center">
            <div className="grid md:grid-cols-2 gap-16 w-full mb-16">
                <div className="flex items-center gap-4">
                    <Image src={logo} alt="Logo" width={60} height={60} className="drop-shadow-lg" />
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-primary leading-none uppercase tracking-tighter italic">Rede Inova</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-2 px-2 py-0.5 bg-primary/5 rounded-full w-fit">Médio Sudoeste Baiano</span>
                    </div>
                </div>
                <div className="flex flex-col items-end justify-center space-y-6">
                    <VisitorCounter />
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
