"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Activity, 
  Target, 
  FileCheck, 
  Users, 
  AlertTriangle, 
  RefreshCcw, 
  Database, 
  BarChart3,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const attributionSteps = [
  {
    title: "Direcionamentos da Coord. Geral",
    description: "Receber os direcionamentos da Coordenação Geral do Projeto e interpretá-los conforme as necessidades operacionais.",
    icon: ShieldCheck,
    color: "text-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-100"
  },
  {
    title: "Acompanhamento dos Setores",
    description: "Acompanhar a execução das atividades de cada setor do projeto, garantindo o ritmo e a qualidade das entregas.",
    icon: Activity,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100"
  },
  {
    title: "Metas e Prazos Institucionais",
    description: "Garantir o cumprimento das metas e prazos institucionais estabelecidos no planejamento estratégico.",
    icon: Target,
    color: "text-cyan-500",
    bg: "bg-cyan-50",
    border: "border-cyan-100"
  },
  {
    title: "Validação Estratégica",
    description: "Validar se as entregas estão alinhadas ao planejamento estratégico e às expectativas da coordenação geral.",
    icon: FileCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100"
  },
  {
    title: "Diálogo Intersetorial",
    description: "Promover o diálogo intersetorial e a integração das equipes para um fluxo de trabalho harmonioso.",
    icon: Users,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    border: "border-indigo-100"
  },
  {
    title: "Riscos e Gargalos",
    description: "Identificar antecipadamente riscos, gargalos e desalinhamentos que possam comprometer os resultados.",
    icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100"
  },
  {
    title: "Redirecionamento Estratégico",
    description: "Orientar redirecionamentos estratégicos e correções de rota quando necessário para o sucesso do projeto.",
    icon: RefreshCcw,
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-100"
  },
  {
    title: "Registro em Sistema",
    description: "Registrar decisões, encaminhamentos e evidências no sistema para garantir a auditabilidade total.",
    icon: Database,
    color: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-100"
  },
  {
    title: "Relatórios e Contas",
    description: "Emitir relatórios para acompanhamento institucional e prestação de contas dos indicadores do projeto.",
    icon: BarChart3,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200"
  }
];

export function ExecutiveAttributionsFlow() {
  return (
    <div className="w-full space-y-24 py-16">
      <div className="text-center space-y-6 mb-24 relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
         <h2 className="text-6xl font-black italic uppercase tracking-tighter text-slate-800 leading-none">
            Função da <span className="text-primary italic">Coordenação Executiva</span>
         </h2>
         <p className="text-xl font-medium text-slate-400 max-w-3xl mx-auto uppercase tracking-wider leading-relaxed">
            Supervisão e Governança Estratégica: <span className="font-black text-slate-600 italic">Dayane Lopes</span>
         </p>
      </div>

      <div className="relative flex flex-col gap-24 max-w-6xl mx-auto px-4">
        {attributionSteps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className={cn(
                "relative flex items-center gap-12 lg:gap-20 group",
                idx % 2 !== 0 ? "flex-row-reverse text-right" : "text-left"
            )}
          >
            {/* Horizontal Connector Arm (Desktop) */}
            <div className={cn(
                "absolute top-1/2 h-0.5 bg-slate-100 -z-10 hidden lg:block",
                idx % 2 === 0 ? "left-[10%] right-1/2" : "right-[10%] left-1/2"
            )} />

            {/* Vertical Connector Line (Desktop) */}
            {idx < attributionSteps.length - 1 && (
               <div className="absolute left-1/2 -translate-x-1/2 top-1/2 bottom-[-160px] w-0.5 bg-slate-100 hidden lg:block border-l border-dashed border-slate-200" />
            )}

            {/* Content Card */}
            <div className="w-full lg:w-[45%]">
                <div className={cn(
                    "p-12 rounded-[3.5rem] bg-white ring-1 shadow-sm transition-all duration-700 group-hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] relative overflow-hidden",
                    step.border
                )}>
                    {/* Background Icon Watermark */}
                    <div className={cn(
                        "absolute opacity-[0.04] group-hover:scale-125 transition-transform duration-1000",
                        idx % 2 === 0 ? "-right-8 -bottom-8" : "-left-8 -bottom-8",
                        step.color
                    )}>
                        <step.icon size={240} />
                    </div>

                    <div className={cn(
                        "relative z-10 flex flex-col gap-8",
                        idx % 2 !== 0 ? "items-end" : "items-start"
                    )}>
                        <div className={cn("w-24 h-24 rounded-[2.2rem] flex items-center justify-center shadow-xl shadow-slate-100 ring-1 ring-white/20", step.bg, step.color)}>
                            <step.icon size={42} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black italic uppercase tracking-tighter text-slate-800 leading-none">
                                {step.title}
                            </h3>
                            <p className="text-xl font-medium text-slate-500 leading-relaxed italic max-w-lg">
                                "{step.description}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Step Marker Bubble (Desktop Center) */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-[1.8rem] bg-white ring-8 ring-slate-50 z-20 items-center justify-center shadow-2xl border border-slate-100 group-hover:rotate-45 transition-transform duration-700 group-hover:bg-primary group-hover:text-white group-hover:ring-primary/10">
               <span className="text-2xl font-black italic group-hover:-rotate-45 transition-transform">{idx + 1}</span>
            </div>

            {/* Spacer for Staggered Look */}
            <div className="hidden lg:block lg:flex-1" />
          </motion.div>
        ))}
      </div>

      {/* Narrative Summary */}
      <div className="flex justify-center pt-32 px-4 pb-20">
         <div className="bg-primary p-16 rounded-[4rem] text-white relative overflow-hidden shadow-[0_50px_100px_-30px_rgba(var(--primary),0.3)] max-w-5xl w-full">
            <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <Target size={260} />
            </div>
            <div className="relative z-10 flex flex-col gap-8">
               <Badge className="bg-white/20 text-white w-fit px-6 py-2 rounded-full border-none font-black text-xs uppercase tracking-[0.2em]">Contexto Governança</Badge>
               <h4 className="text-4xl font-headline italic tracking-tighter leading-tight max-w-3xl">
                  "A Coordenação Executiva é o hub central de conformidade, garantindo que a pulsação técnica e institucional de cada setor esteja em perfeita harmonia com os objetivos de impacto social da Rede Inova."
               </h4>
               <div className="flex items-center gap-6 pt-4">
                   <div className="h-0.5 w-24 bg-white/30" />
                   <span className="text-sm font-black uppercase tracking-[0.3em] text-white/60">Garantia de Excelência • Dayane Lopes</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
