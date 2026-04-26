"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Languages, 
  Eye, 
  Ear, 
  Accessibility, 
  BookOpen, 
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle 
} from "lucide-react";
import { AccessibilityActivitiesBoard } from "@/components/accessibility-activities-board";
import { cn } from "@/lib/utils";

export default function AcessibilidadePage() {
  const focuses = [
    { title: "Libras", icon: Ear, color: "text-blue-500", bg: "bg-blue-50", desc: "Produção de vídeos e tradução de conteúdos para a comunidade surda." },
    { title: "Audiodescrição", icon: Eye, color: "text-pink-500", bg: "bg-pink-50", desc: "Descrições detalhadas de imagens e vídeos para pessoas com deficiência visual." },
    { title: "Linguagem Simples", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50", desc: "Tradução de conceitos complexos para linguagem acessível e didática." },
    { title: "Acessibilidade Web", icon: Accessibility, color: "text-amber-500", bg: "bg-amber-50", desc: "Garantia de que o portal (WCAG 2.1) seja navegável por todos." }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-500">
           <Accessibility size={200} strokeWidth={1} />
        </div>

        <div className="absolute top-8 right-8 z-20">
           <div className="px-6 py-2 rounded-2xl bg-emerald-500 text-slate-950 font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl skew-x-3 italic hover:skew-x-0 transition-transform duration-500 cursor-default">
              Status: Fase 02
           </div>
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-2 w-12 bg-emerald-500 rounded-full" />
             <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">Núcleo de Acessibilidade e Inclusão</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Inclusão como <span className="text-emerald-400">Prioridade</span> Social
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed italic">
            "Não existe inovação social sem acessibilidade universal. Nosso papel é garantir que o conhecimento da Rede Inova chegue a todos, sem barreiras."
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
             <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                <Languages size={16} className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Tradução e Intérpretes</span>
             </div>
          </div>
        </div>
      </div>

      {/* Grid de Focos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {focuses.map((f) => (
          <Card key={f.title} className="border-none shadow-sm rounded-[2.5rem] bg-white ring-1 ring-slate-100 overflow-hidden hover:shadow-xl transition-all duration-500 group">
            <CardContent className="p-8">
              <div className="flex flex-col gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110", f.bg, f.color)}>
                  <f.icon size={24} />
                </div>
                <div className="space-y-1">
                   <h3 className="font-black text-sm uppercase italic text-slate-800">{f.title}</h3>
                   <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{f.desc}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Atividades do Setor */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between px-2">
           <div className="space-y-1">
              <h2 className="text-2xl font-headline uppercase italic tracking-tighter text-slate-800">Atividades de Acessibilidade</h2>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Gestão de Produção de Conteúdo Acessível</p>
           </div>
        </div>
        <AccessibilityActivitiesBoard />
      </div>
    </div>
  );
}

