"use client";

import React from "react";
import { Megaphone, Globe, Users, Target, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AscomSectorHeader() {
  const fronts = [
    {
      title: "Comunicação Digital",
      subtitle: "Redes Sociais",
      icon: Megaphone,
      color: "text-pink-500",
      bg: "bg-pink-50",
      items: ["Feed", "Stories", "Reels"]
    },
    {
      title: "Comunicação Institucional",
      subtitle: "Site e Materiais",
      icon: Globe,
      color: "text-blue-500",
      bg: "bg-blue-50",
      items: ["Notícias", "Relatórios", "Vídeos"]
    },
    {
      title: "Comunicação Interna",
      subtitle: "Articulação entre Setores",
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      items: ["Pontos Focais", "Fluxo de Demandas", "Calendário"]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Strategic Mission Banner */}
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Megaphone size={200} strokeWidth={1} />
        </div>

        <div className="absolute top-8 right-8 z-20">
           <div className="px-6 py-2 rounded-2xl bg-primary text-slate-950 font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl rotate-3 italic hover:rotate-0 transition-transform duration-500 cursor-default">
              Status: Fase 01
           </div>
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-2 w-12 bg-primary rounded-full" />
             <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Núcleo de Comunicação e Difusão</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Repocionamento <span className="text-primary text-stroke-thin">Estratégico</span> ASCOM
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed italic">
            "A ASCOM não é apenas divulgação. É o setor que conecta, organiza e dá visibilidade ao projeto como um todo."
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
             <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <Target size={16} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Foco em Resultados</span>
             </div>
             <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <Users size={16} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Articulação Integrada</span>
             </div>
          </div>
        </div>
      </div>

      {/* The 3 Fronts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fronts.map((front) => (
          <Card key={front.title} className="border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] bg-white ring-1 ring-slate-100 overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex flex-col h-full gap-6">
                <div className={`w-14 h-14 rounded-2xl ${front.bg} flex items-center justify-center ${front.color} group-hover:scale-110 transition-transform duration-500`}>
                  <front.icon size={28} />
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-black text-lg uppercase italic text-slate-800 tracking-tight leading-none">{front.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{front.subtitle}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {front.items.map(item => (
                    <span key={item} className="px-3 py-1 rounded-full bg-slate-50 text-[9px] font-black uppercase tracking-wider text-slate-500 border border-slate-100">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Warning */}
      <div className="flex items-start gap-6 bg-amber-50/50 p-6 rounded-[2rem] border border-amber-100/50">
         <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 shrink-0">
            <AlertTriangle size={24} />
         </div>
         <div className="space-y-1">
            <h4 className="text-sm font-black uppercase italic text-amber-800">Fator de Risco Crítico</h4>
            <p className="text-xs text-amber-700/80 font-medium leading-relaxed">
              A ASCOM organiza a comunicação e define o fluxo. <strong>Não executa tudo sem critério.</strong> Se o setor virar apenas "atendimento de demanda", perde-se o valor estratégico e o controle da marca institucional.
            </p>
         </div>
      </div>
    </div>
  );
}
