"use client";

import React from "react";
import { 
  ArrowRight, 
  Users, 
  MessageSquare, 
  Globe, 
  ShieldCheck, 
  Zap, 
  UserCheck, 
  FileCheck,
  LayoutDashboard
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const WORKFLOW_STEPS = [
  { id: 1, label: "Direcionamento", sector: "Coord. Executiva", person: "Dayane Lopes", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { id: 2, label: "Produção", sector: "ASCOM", icon: LayoutDashboard, color: "text-indigo-600", bg: "bg-indigo-50" },
  { id: 3, label: "Acessibilidade", sector: "Acess", icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-50" },
  { id: 4, label: "Revisão Final", sector: "ASCOM", icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50" },
  { id: 5, label: "Publicação", sector: "Social/Site", icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: 6, label: "Ciência/Registro", sector: "Coord. Executiva", icon: UserCheck, color: "text-blue-600", bg: "bg-blue-50" },
  { id: 7, label: "Finalização", sector: "Coord. Geral", person: "Aisamaque", icon: ShieldCheck, color: "text-slate-900", bg: "bg-slate-100" },
];

export function AscomWorkflowBanner() {
  return (
    <Card className="border-none shadow-2xl rounded-[3.5rem] bg-gradient-to-br from-white via-slate-50 to-white overflow-hidden ring-1 ring-slate-100 mb-12">
      <CardContent className="p-10 space-y-10">
        {/* Header Info */}
        <div className="flex flex-col md:flex-row items-center gap-8 border-b border-slate-100 pb-10">
           <div className="h-20 w-20 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-xl shadow-primary/10">
              <ShieldCheck size={40} />
           </div>
           <div className="space-y-2 text-center md:text-left flex-1">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 uppercase text-[9px] font-black tracking-[0.2em] px-4 py-1.5 h-auto mb-2">
                 Fluxo Institucional de Atividades
              </Badge>
              <h3 className="text-3xl font-headline uppercase italic tracking-tighter text-slate-800 leading-tight">
                 Direcionamento Estratégico da <span className="text-primary italic font-black">Coordenação Executiva</span>
              </h3>
              <p className="text-[13px] font-medium text-slate-500 italic max-w-4xl leading-relaxed">
                 A ASCOM recebe direcionamentos da Coordenação Executiva (Responsável: <span className="text-slate-900 font-bold">Dayane Lopes</span>), 
                 garantindo que cada ação de comunicação e popularização da ciência siga o rigor técnico 
                 e os fundamentos de inovação social do projeto Rede Inova Social.
              </p>
           </div>
        </div>

        {/* Visual Diagram */}
        <div className="relative pt-4">
           {/* Connecting Line (Desktop) */}
           <div className="hidden lg:block absolute top-[44%] left-0 right-0 h-0.5 bg-gradient-to-r from-blue-100 via-indigo-200 to-emerald-100 -z-0" />
           
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 relative z-10">
              {WORKFLOW_STEPS.map((step, idx) => (
                 <div key={step.id} className="flex flex-col items-center text-center space-y-4 group">
                    <div className={cn(
                       "h-16 w-16 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm",
                       step.bg, step.color
                    )}>
                       <step.icon size={28} />
                    </div>
                    <div className="space-y-1">
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">{step.sector}</span>
                       <h4 className="text-[11px] font-bold text-slate-800 leading-tight">{step.label}</h4>
                       {step.person && (
                          <p className="text-[9px] font-medium text-primary italic leading-none">{step.person}</p>
                       )}
                    </div>
                    {/* Desktop Arrow */}
                    {idx < WORKFLOW_STEPS.length - 1 && (
                       <div className="hidden lg:flex absolute right-[-12px] top-6 translate-x-1/2 opacity-20">
                          <ArrowRight className="text-slate-400" size={16} />
                       </div>
                    )}
                 </div>
              ))}
           </div>
        </div>

        {/* Legend / Status Info */}
        <div className="p-6 rounded-[2rem] bg-slate-900 text-white/50 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400">
                 <Zap size={20} />
              </div>
              <p className="text-[10px] font-medium uppercase tracking-widest italic max-w-sm">
                 Garantia de Fluxo: Todas as atividades ASCOM devem obrigatoriamente passar pela validação da Acessibilidade antes de qualquer publicação final.
              </p>
           </div>
           <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-full border-white/10 text-white/40 font-bold uppercase text-[9px] tracking-widest px-4 py-1.5 h-auto">
                 Transparência Total
              </Badge>
              <Badge variant="outline" className="rounded-full border-white/10 text-white/40 font-bold uppercase text-[9px] tracking-widest px-4 py-1.5 h-auto">
                 Ciência e Registro
              </Badge>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
