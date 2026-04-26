"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  ArrowRight, 
  FastForward,
  Sparkles,
  BarChart3,
  TrendingDown,
  Timer,
  BookOpen,
  Filter,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Megaphone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectTask } from "@/lib/mock-data";
import { AscomMetrics } from "@/lib/data-service";

/**
 * 1. HEADER FUNCIONAL (Adaptado para o novo modelo)
 */
export function ASCOMSignageHeader() {
  return (
    <div className="relative group">
       <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition-all" />
       <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
               <div className="flex items-center gap-8">
                   <div className="w-24 h-24 rounded-3xl bg-slate-900 flex items-center justify-center text-white shadow-2xl shadow-slate-900/20 group-hover:scale-110 transition-transform">
                       <Megaphone className="w-10 h-10 group-hover:animate-bounce" />
                   </div>
                   <div className="flex flex-col">
                       <div className="flex items-center gap-3">
                           <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-black tracking-widest">SETOR OPERACIONAL</Badge>
                           <span className="text-[10px] font-black text-slate-300 tracking-[0.3em] uppercase italic">REDE INOVA SOCIAL</span>
                       </div>
                       <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mt-2">
                           ASCOM <span className="text-primary">&</span> DIFUSÃO
                       </h1>
                       <p className="text-slate-500 font-bold text-sm mt-3 uppercase tracking-widest opacity-70">
                           Produção, difusão e gestão da comunicação institucional
                       </p>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
}

/**
 * 2. DASHBOARD DE AÇÃO IMEDIATA (Cards de Contagem)
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

export function ASCOMActionDashboard({ tasks, onFilterChange, activeFilter }: { 
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
          label="Em Trâmite" 
          count={waitingCount} 
          icon={FastForward} 
          color="bg-blue-50 border-blue-100 text-blue-600" 
          description="Aguardando validação"
          onClick={() => onFilterChange('aguardando_outro_setor')}
          isActive={activeFilter === 'aguardando_outro_setor'}
        />
    </div>
  );
}

/**
 * 3. PIPELINE VISUAL (Etapas Operacionais)
 */
const stages = [
  { id: 'producao', label: 'Produção ASCOM', icon: Sparkles, color: 'text-indigo-500' },
  { id: 'acessibilizacao', label: 'Acessibilização', icon: CheckCircle2, color: 'text-teal-500' },
  { id: 'revisao', label: 'Revisão Final', icon: ShieldCheck, color: 'text-amber-500' },
  { id: 'publicacao', label: 'Publicação', icon: ArrowRight, color: 'text-emerald-500' }
];

export function ASCOMPipelineTracker({ tasks }: { tasks: ProjectTask[] }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
        <div className="flex items-center gap-4 mb-10">
            <div className="p-3 rounded-2xl bg-slate-900 text-white shadow-lg">
                <TrendingDown size={20} />
            </div>
            <div>
                <h2 className="text-xl font-black italic tracking-tighter uppercase text-slate-800 leading-none">Fluxo de Conteúdo</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Acompanhamento de estágio por estágio</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Linha Conectora (Desktop) */}
            <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-px bg-slate-100" />
            
            {stages.map((stage, idx) => {
                const stageTasks = tasks.filter(t => t.workflowStage === stage.id);
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
export function ASCOMQuickIndicators({ metrics, onFilterChange, activeFilter }: { 
  metrics: AscomMetrics,
  onFilterChange: (filter: string) => void,
  activeFilter: string
}) {
  return (
    <div className="grid grid-cols-1 gap-4">
        {/* Card 1: Publicados */}
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
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-1">Publicados (Mês)</span>
                <span className="text-2xl font-black text-white italic tracking-tighter leading-none">{metrics.publishedMonth} Conteúdos</span>
            </div>
        </div>

        {/* Card 2: Aguardando Acessibilidade (Gargalo - Amarelo) */}
        <div 
          onClick={() => onFilterChange('acessibilizacao')}
          className={cn(
            "flex items-center gap-4 p-6 rounded-[2rem] bg-slate-900 border border-white/5 cursor-pointer transition-all hover:bg-slate-800",
            metrics.waitingAccessibility > 2 ? "border-amber-500/50 bg-amber-500/5" : "",
            activeFilter === 'acessibilizacao' && "ring-2 ring-amber-500"
          )}
        >
            <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center border",
                metrics.waitingAccessibility > 2 ? "bg-amber-500/20 text-amber-500 border-amber-500/30" : "bg-white/5 text-slate-400 border-white/10"
            )}>
                <FastForward size={20} />
            </div>
            <div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-1">Fila Acessibilidade</span>
                <span className={cn(
                    "text-2xl font-black italic tracking-tighter leading-none",
                    metrics.waitingAccessibility > 2 ? "text-amber-500" : "text-white"
                )}>{metrics.waitingAccessibility} Pendentes</span>
            </div>
        </div>

        {/* Card 3: Travados (Bloqueado - Vermelho) */}
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
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-1">Itens Travados</span>
                <span className={cn(
                    "text-2xl font-black italic tracking-tighter leading-none",
                    metrics.blocked > 0 ? "text-red-500" : "text-white"
                )}>{metrics.blocked} Críticos</span>
            </div>
        </div>

        {/* Card 4: Tempo Médio */}
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
 * 6. MEU ACERVO (Conteúdo Organizado)
 */
export function ASCOMContentLibrary() {
  const mockLibrary = [
    { title: "Manual de Marca v2.0", type: "PDF", date: "02 Abr", category: "Identidade" },
    { title: "Banco de Fotos - Evento IF", type: "FOLDER", date: "30 Mar", category: "Mídia" },
    { title: "Peças Redes Sociais - Abril", type: "Artes", date: "05 Abr", category: "Social" },
    { title: "Roteiro Vídeo LISSA", type: "DOC", date: "01 Abr", category: "Roteiros" },
  ];

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <BookOpen size={20} />
                </div>
                <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-800">Meu Acervo</h3>
            </div>
            <Button variant="ghost" size="sm" className="rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">Ver Tudo <ChevronRight size={14} /></Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
