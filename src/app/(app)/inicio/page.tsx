"use client";

import React from "react";
import { 
  Compass, 
  Users, 
  ArrowRight, 
  Target, 
  LayoutGrid, 
  ShieldCheck, 
  Megaphone, 
  Accessibility, 
  BarChart3, 
  Users2, 
  Network, 
  BookOpen, 
  Terminal,
  Activity,
  ChevronRight,
  Globe,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sectors, projectObjectives } from "@/lib/mock-data";
import { InstitutionalLibrary } from "@/components/institutional-library";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function InicioPage() {
  const iconMap: Record<string, any> = {
    'ShieldCheck': ShieldCheck,
    'Megaphone': Megaphone,
    'Accessibility': Accessibility,
    'BarChart3': BarChart3,
    'Users2': Users2,
    'Network': Network,
    'BookOpen': BookOpen,
    'Terminal': Terminal,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32">
      {/* ────────────────────────────────────
          HERO SECTION: BOAS-VINDAS
          ──────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[4rem] bg-slate-950 p-12 md:p-24 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 via-primary/5 to-transparent pointer-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 max-w-3xl space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-primary"
          >
            <Compass className="h-6 w-6 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.4em]">Guia Institucional • Rede Inova</span>
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9]"
            >
              Bem-vindo à <br />
              <span className="text-primary italic">Nossa Missão</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl font-medium text-slate-400 italic leading-relaxed"
            >
              Tecnologia, Inovação e Articulação Social combatendo desigualdades através da alimentação saudável e governança transparente.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Button asChild className="h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest px-8 shadow-xl shadow-primary/20">
              <Link href="/painel/dashboard">
                Acessar Operação <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-16 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest px-8 backdrop-blur-md">
              <Link href="/equipe">Conhecer o Time</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ────────────────────────────────────
          BIBLIOTECA VISUAL (PDFs)
          ──────────────────────────────────── */}
      <InstitutionalLibrary />

      {/* ────────────────────────────────────
          GUIA DE SETORES: FINALIDADE
          ──────────────────────────────────── */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Estrutura Organizacional</span>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-800">
            Nossos <span className="text-primary italic">Núcleos</span> e Propósitos
          </h2>
          <div className="w-24 h-1.5 bg-slate-100 mx-auto rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectors.map((sector, idx) => {
            const Icon = iconMap[sector.icon] || Globe;
            return (
              <motion.div
                key={sector.id}
                whileHover={{ y: -10 }}
                className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-primary/20 hover:shadow-2xl transition-all duration-500"
              >
                <div className="p-4 rounded-2xl bg-slate-50 mb-6 group-hover:bg-primary/5 transition-colors w-fit">
                  <Icon className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-black italic uppercase tracking-tighter text-slate-800 mb-3 group-hover:text-primary transition-colors">
                  {sector.sigla}
                </h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed mb-4">
                  {sector.name}
                </p>
                <p className="text-[11px] font-medium text-slate-400 italic leading-relaxed">
                  "{sector.description}"
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Impact goals removed from internal Inicio page as per requirements */}

      {/* ────────────────────────────────────
          CTA FINAL: EQUIPE
          ──────────────────────────────────── */}
      <section className="bg-slate-50 rounded-[4rem] p-12 md:p-20 text-center space-y-8 border border-slate-100 shadow-inner">
        <div className="flex -space-x-4 justify-center">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-16 h-16 rounded-[1.5rem] border-4 border-white bg-slate-200 overflow-hidden shadow-xl shadow-black/5 flex items-center justify-center">
               <Users className="h-6 w-6 text-slate-400" />
            </div>
          ))}
        </div>
        <div className="max-w-xl mx-auto space-y-4">
          <h3 className="text-3xl font-black italic uppercase italic tracking-tighter text-slate-800">Nosso maior ativo são <span className="text-primary italic">as pessoas</span></h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            A Rede Inova é formada por um time multidisciplinar de pesquisadores, comunicadores e especialistas em tecnologia social.
          </p>
        </div>
        <Button asChild className="h-16 rounded-2xl bg-slate-900 border-none hover:bg-black text-white px-10 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-slate-200">
           <Link href="/equipe">Acesse a Vitrine da Equipe</Link>
        </Button>
      </section>
    </div>
  );
}
