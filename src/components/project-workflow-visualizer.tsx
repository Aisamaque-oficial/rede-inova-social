"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  UserCheck, 
  PenTool, 
  Accessibility, 
  CalendarClock, 
  Users, 
  Globe, 
  SearchCode, 
  Cpu, 
  Activity,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const flowSteps = [
  {
    id: 1,
    title: "CGP",
    subtitle: "Coord. Geral",
    sector: "Estratégico",
    icon: ShieldCheck,
    color: "text-rose-500",
    bg: "bg-rose-50",
    description: "Define diretrizes e prioridades estratégicas iniciais."
  },
  {
    id: 2,
    title: "EXECUTIVA",
    subtitle: "Dayane Lopes",
    sector: "Supervisão",
    icon: UserCheck,
    color: "text-blue-500",
    bg: "bg-blue-50",
    description: "Interpreta as diretrizes e acompanha a execução inicial."
  },
  {
    id: 3,
    title: "ASCOM",
    subtitle: "Comunicação",
    sector: "Produção",
    icon: PenTool,
    color: "text-purple-500",
    bg: "bg-purple-50",
    description: "Produção de conteúdos, artes e matérias, integrando a estratégia de mídias e curadoria científica."
  },
  {
    id: 4,
    title: "ACESSIBILIDADE",
    subtitle: "Inclusão",
    sector: "Mediação",
    icon: Accessibility,
    color: "text-amber-500",
    bg: "bg-amber-50",
    description: "Garante a inclusão e a adequação dos conteúdos produzidos conforme os padrões do setor."
  },
  {
    id: 5,
    title: "PMA",
    subtitle: "PMA",
    sector: "Núcleo Estratégico",
    icon: CalendarClock,
    color: "text-cyan-500",
    bg: "bg-cyan-50",
    description: "Organiza metas, indicadores e estratégias de monitoramento do PMA."
  },
  {
    id: 6,
    title: "EXTENSÃO",
    subtitle: "Coord. Extensão",
    sector: "Territorial",
    icon: Globe,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    description: "Coordenação de Extensão (Danielle Gonçalves), assegurando o impacto social nos territórios."
  },
  {
    id: 7,
    title: "SOCIAL",
    subtitle: "Articulação",
    sector: "Comunidade",
    icon: Users,
    color: "text-orange-500",
    bg: "bg-orange-50",
    description: "Desenvolve ações de impacto social e engajamento direto com as comunidades."
  },
  {
    id: 8,
    title: "CURADORIA",
    subtitle: "Curadoria Científica",
    sector: "Coord. Extensão",
    icon: SearchCode,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    description: "Sistematização e validação científica dos resultados, integrada à Coordenação de Extensão (Danielle Gonçalves)."
  },
  {
    id: 9,
    title: "TECH",
    subtitle: "Tecnologia",
    sector: "Operacional",
    icon: Cpu,
    color: "text-slate-500",
    bg: "bg-slate-50",
    description: "Oferece suporte tecnológico e inovação à plataforma Rede Inova."
  },
  {
    id: 10,
    title: "EXECUTIVA",
    subtitle: "Dayane Lopes",
    sector: "Governança",
    icon: Activity,
    color: "text-primary",
    bg: "bg-primary/5",
    description: "Monitora resultados finais, registra evidências e emite relatórios de auditoria."
  }
];

export function ProjectWorkflowVisualizer() {
  return (
    <div className="w-full bg-white rounded-[3rem] p-10 lg:p-16 ring-1 ring-slate-100 shadow-sm overflow-hidden relative">
      <div className="flex items-center gap-3 mb-12">
        <Badge variant="outline" className="rounded-full px-6 py-1.5 border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-widest leading-none">
          Fluxo Institucional de Atividades • Visualização Expandida
        </Badge>
      </div>

      <div className="relative mb-20 max-w-4xl">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-slate-800 leading-none">
          Cadeia de <span className="text-primary underline decoration-primary/20 underline-offset-[12px]">Conformidade Intersetorial</span>
        </h2>
        <p className="mt-8 text-lg font-medium text-slate-400 leading-relaxed uppercase tracking-wider">
          A Coordenação Executiva supervisiona o alinhamento estratégico entre a 
          <span className="text-slate-600 font-black"> Coordenação Geral</span> e todos os setores operativos do projeto, 
          assegurando transparência e eficiência do início ao fim do ciclo.
        </p>
      </div>

      {/* 📊 Expanded 10-Step Flow (Two Rows for Legibility) */}
      <div className="space-y-16 relative py-10">
        {/* Connection Line Desktop */}
        <div className="absolute top-[calc(5rem+1.5rem)] left-10 right-10 h-1 bg-slate-50 hidden lg:block rounded-full" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-24 gap-x-8 relative z-10">
          {flowSteps.map((step, idx) => (
            <motion.div 
              key={step.id} 
              className="flex flex-col items-center text-center group relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              {/* Step Counter Bubble - Increased Contrast */}
              <div className="absolute -top-12 opacity-60 text-5xl font-black text-slate-950/5 pointer-events-none group-hover:opacity-100 group-hover:text-primary/20 transition-all italic">
                {String(idx + 1).padStart(2, '0')}
              </div>

              {/* Icon Container with arrows */}
              <div className="flex items-center w-full justify-center">
                <div className={cn(
                  "w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-all duration-500 relative",
                  step.bg, step.color,
                  "bg-white"
                )}>
                  <step.icon size={32} />
                  
                  {/* Step Connector Label (Desktop) */}
                  {idx < flowSteps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-6 items-center justify-center opacity-20 text-slate-400 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                       <ArrowRight size={18} />
                    </div>
                  )}
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1 italic">
                  {step.sector}
                </span>
                <h4 className="text-2xl font-black text-slate-800 uppercase italic leading-none tracking-tighter">
                  {step.title}
                </h4>
                <p className="text-xs font-bold text-primary/70 uppercase tracking-widest mt-1">
                  {step.subtitle}
                </p>
              </div>

              {/* Tooltip Description */}
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white p-5 rounded-3xl absolute -bottom-32 w-56 z-50 text-left pointer-events-none hidden lg:block border border-white/10 shadow-2xl translate-y-2 group-hover:translate-y-0">
                 <p className="text-xs leading-relaxed font-medium tracking-wide">
                   {step.description}
                 </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-32 p-10 bg-slate-950 rounded-[3rem] flex flex-col items-center justify-center text-center gap-6 border border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <h4 className="text-3xl font-headline italic uppercase tracking-tighter text-white relative z-10">
           Representação <span className="text-primary italic">Simplificada</span> do Fluxo
        </h4>
        <div className="inline-flex flex-wrap items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-white/40 relative z-10 py-4 px-8 bg-white/5 rounded-full border border-white/5 no-scrollbar overflow-x-auto">
           <span>Coord. Geral</span>
           <ArrowRight size={12} className="text-primary" />
           <span>Coord. Executiva</span>
           <ArrowRight size={12} className="text-primary" />
           <span>Setores do Projeto</span>
           <ArrowRight size={12} className="text-primary" />
           <span className="text-white">Monitoramento Executivo</span>
        </div>
      </div>
    </div>
  );
}
