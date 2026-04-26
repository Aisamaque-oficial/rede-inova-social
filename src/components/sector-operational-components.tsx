"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { 
  AlertCircle, 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  ArrowRight, 
  FastForward,
  Sparkles,
  BarChart3,
  Timer,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectTask } from "@/lib/mock-data";
import * as Models from "@/lib/schema/models";
import { AscomMetrics } from "@/lib/data-service";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

/**
 * 1. HEADER SETORIAL GENÉRICO
 */
export function SectorSignageHeader({ sector }: { sector: Models.SectorDefinition }) {
  if (!sector) return null;
  const Icon = (LucideIcons as any)[sector.icon || "Activity"] || Activity;
  
  return (
    <div className="relative group">
       <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition-all" />
       <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-3xl bg-slate-900 flex items-center justify-center text-white shadow-2xl shadow-slate-900/20 group-hover:scale-110 transition-transform relative">
                        <Icon className="w-10 h-10 group-hover:animate-bounce" />
                        <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg border-4 border-white">
                            <LucideIcons.ShieldCheck size={16} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-black tracking-widest">NÚCLEO OPERACIONAL</Badge>
                            <span className="text-[10px] font-black text-slate-300 tracking-[0.3em] uppercase italic">REDE INOVA SOCIAL</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mt-2">
                            {sector.name} <span className="text-primary">[{sector.sigla}]</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-sm mt-3 uppercase tracking-widest opacity-70">
                            Estrutura, gestão e execução de fluxos setoriais
                        </p>
                    </div>
                </div>

                {/* 👑 DESTAQUE DE LIDERANÇA (Dynamic) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4 hover:shadow-xl transition-all">
                        <div className="relative">
                            <img 
                                src={sector.sigla === 'ASCOM' ? "https://i.pravatar.cc/150?u=amanda" : "https://i.pravatar.cc/150?u=inova"} 
                                alt="Coordenador" 
                                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary/20"
                            />
                            <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5 border-2 border-white">
                                <LucideIcons.Crown size={10} />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Liderança do Núcleo</span>
                            <span className="text-sm font-black text-slate-800 uppercase italic">
                                {sector.sigla === 'ASCOM' ? "Amanda Milly" : "Coordenação Geral"}
                            </span>
                            <span className="text-[9px] font-bold text-primary uppercase tracking-tight">
                                {sector.sigla === 'ASCOM' ? "Coordenação Geral da ASCOM" : "Supervisão Técnica"}
                            </span>
                        </div>
                    </div>

                    <Link href={`/setores/${sector.id}/painel`} className="block group/btn h-full">
                        <div className="h-full bg-slate-900 text-white p-6 rounded-[2rem] border border-slate-800 flex items-center gap-4 hover:bg-primary transition-all shadow-xl shadow-slate-900/20 group-hover/btn:-translate-y-1">
                            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                                <LayoutDashboard size={20} className="text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase text-white/50 tracking-widest">Painel de Controle</span>
                                <span className="text-sm font-black uppercase italic tracking-tighter">Centro de Operações</span>
                            </div>
                            <LucideIcons.ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                        </div>
                    </Link>
                </div>
            </div>
       </div>
    </div>
  );
}

/**
 * 2. DASHBOARD DE AÇÃO IMEDIATA
 */
interface ActionCardProps {
  label: string;
  count: number;
  icon: any;
  color: string;
  description: string;
  onClick?: () => void;
  isActive?: boolean;
}

function ActionCard({ label, count, icon: Icon, color, description, onClick, isActive }: ActionCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden p-6 rounded-[2rem] border transition-all cursor-pointer",
        color,
        isActive && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-sm">
                <Icon size={20} className="text-slate-800" />
            </div>
            <span className="text-4xl font-black italic tracking-tighter text-slate-900">{count}</span>
        </div>
        <div className="mt-6">
            <h3 className="text-[12px] font-black uppercase tracking-wider text-slate-800 leading-none">{label}</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-70">{description}</p>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
        <Icon size={120} />
      </div>
    </motion.div>
  );
}

export function SectorActionDashboard({ tasks, onFilterChange, activeFilter }: { 
  tasks: ProjectTask[], 
  onFilterChange: (filter: string) => void,
  activeFilter: string 
}) {
  const overdueCount = tasks.filter(t => t.status === 'atrasada').length;
  const todayCount = tasks.filter(t => {
      const today = new Date().toISOString().split('T')[0];
      return t.deadline.startsWith(today) && t.status !== 'concluida';
  }).length;
  const inProgressCount = tasks.filter(t => t.status === 'em_andamento').length;
  const waitingCount = tasks.filter(t => t.status === 'aguardando_outro_setor').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionCard 
          label="Atrasadas" 
          count={overdueCount} 
          icon={AlertCircle} 
          color="bg-red-50 border-red-100 text-red-600" 
          description="Ação urgente necessária"
          onClick={() => onFilterChange('atrasada')}
          isActive={activeFilter === 'atrasada'}
        />
        <ActionCard 
          label="Vencendo Hoje" 
          count={todayCount} 
          icon={Clock} 
          color="bg-amber-50 border-amber-100 text-amber-600" 
          description="Checklist do dia"
          onClick={() => onFilterChange('hoje')}
          isActive={activeFilter === 'hoje'}
        />
        <ActionCard 
          label="Em Execução" 
          count={inProgressCount} 
          icon={PlayCircle} 
          color="bg-emerald-50 border-emerald-100 text-emerald-600" 
          description="Mão na massa"
          onClick={() => onFilterChange('em_andamento')}
          isActive={activeFilter === 'em_andamento'}
        />
        <ActionCard 
          label="Em Fluxo" 
          count={waitingCount} 
          icon={FastForward} 
          color="bg-blue-50 border-blue-100 text-blue-600" 
          description="Aguardando trâmite"
          onClick={() => onFilterChange('aguardando_outro_setor')}
          isActive={activeFilter === 'aguardando_outro_setor'}
        />
    </div>
  );
}

/**
 * 3. PIPELINE VISUAL
 */
const stages = [
  { id: 'producao', label: 'Produção', icon: Sparkles, color: 'text-indigo-500' },
  { id: 'acessibilizacao', label: 'Acessibilização', icon: CheckCircle2, color: 'text-teal-500' },
  { id: 'revisao', label: 'Revisão', icon: ShieldCheck, color: 'text-amber-500' },
  { id: 'publicacao', label: 'Publicação', icon: ArrowRight, color: 'text-emerald-500' }
];

export function SectorPipelineTracker({ tasks }: { tasks: ProjectTask[] }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
        <div className="flex items-center gap-4 mb-10">
            <div className="p-3 rounded-2xl bg-slate-900 text-white shadow-lg">
                <Activity size={20} />
            </div>
            <div>
                <h2 className="text-xl font-black italic tracking-tighter uppercase text-slate-800 leading-none">Status de Workflow</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Acompanhamento de estágio por estágio</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-px bg-slate-100" />
            
            {stages.map((stage) => {
                const stageTasks = (tasks || []).filter(t => t.workflowStage === stage.id);
                const blockedTasks = stageTasks.filter(t => t.status === 'bloqueado');
                
                return (
                    <div key={stage.id} className="relative flex flex-col items-center text-center group">
                        <div className={cn(
                            "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 relative z-10",
                            "bg-white border-4 border-slate-50 group-hover:border-primary shadow-inner ring-1 ring-slate-100"
                        )}>
                            <stage.icon className={cn("w-8 h-8", stage.color)} />
                            {blockedTasks.length > 0 && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse border-2 border-white">
                                    !
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-6">
                            <span className="text-[11px] font-black uppercase tracking-widest text-slate-800 block">{stage.label}</span>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <Badge variant="outline" className="text-[9px] font-bold tracking-widest border-slate-100 px-3">{stageTasks.length} TAREFAS</Badge>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}

/**
 * 4. INDICADORES RÁPIDOS
 */
export function SectorQuickIndicators({ metrics, onFilterChange, activeFilter }: { 
  metrics: AscomMetrics,
  onFilterChange: (filter: string) => void,
  activeFilter: string
}) {
  return (
    <div className="grid grid-cols-1 gap-4">
        <div 
          onClick={() => onFilterChange('concluida')}
          className={cn(
            "flex items-center gap-4 p-6 rounded-[2rem] bg-slate-900 border border-white/5 cursor-pointer transition-all hover:bg-slate-800",
            activeFilter === 'concluida' && "ring-2 ring-primary"
          )}
        >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10">
                <BarChart3 size={20} />
            </div>
            <div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-1">Entregas no Mês</span>
                <span className="text-2xl font-black text-white italic tracking-tighter leading-none">{metrics.publishedMonth} Concluídas</span>
            </div>
        </div>

        <div 
          onClick={() => onFilterChange('bloqueado')}
          className={cn(
            "flex items-center gap-4 p-6 rounded-[2rem] bg-slate-900 border border-white/5 cursor-pointer transition-all hover:bg-slate-800",
            metrics.blocked > 0 ? "border-red-500/50 bg-red-500/5" : "",
            activeFilter === 'bloqueado' && "ring-2 ring-red-500"
          )}
        >
            <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center border",
                metrics.blocked > 0 ? "bg-red-500/20 text-red-500 border-red-500/30" : "bg-white/5 text-slate-400 border-white/10"
            )}>
                <AlertCircle size={20} />
            </div>
            <div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-1">Itens Bloqueados</span>
                <span className={cn(
                    "text-2xl font-black italic tracking-tighter leading-none",
                    metrics.blocked > 0 ? "text-red-500" : "text-white"
                )}>{metrics.blocked} Críticos</span>
            </div>
        </div>

        <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-slate-900 border border-white/5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 border border-white/10">
                <Timer size={20} />
            </div>
            <div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-1">Tempo Médio (SLA)</span>
                <span className="text-2xl font-black text-white italic tracking-tighter leading-none">{metrics.avgDeliveryTime}</span>
            </div>
        </div>
    </div>
  );
}

/**
 * 5. ACERVO SETORIAL
 */
export function SectorContentLibrary() {
  const mockLibrary = [
    { title: "Documentação Operacional", type: "PDF", date: "Hoje", category: "Setorial" },
    { title: "Diretrizes Inova v1", type: "DOC", date: "Ontem", category: "Gestão" },
  ];

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <BookOpen size={20} />
                </div>
                <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-800">Acervo do Núcleo</h3>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {mockLibrary.map((item, idx) => (
                <div key={idx} className="group p-5 rounded-[1.5rem] bg-white border border-slate-100 hover:border-primary/30 transition-all cursor-pointer shadow-sm hover:shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-slate-50 text-slate-500 border-none px-2 py-0.5 text-[8px] font-black tracking-widest group-hover:bg-primary group-hover:text-white transition-colors">{item.type}</Badge>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{item.date}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm tracking-tight leading-tight mb-2">{item.title}</h4>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-60 italic">{item.category}</span>
                </div>
            ))}
        </div>
    </div>
  );
}
