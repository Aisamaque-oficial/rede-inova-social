"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Megaphone, 
  Accessibility, 
  BarChart3, 
  Users2, 
  Network, 
  BookOpen, 
  Terminal,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sectorHealthData = [
  { id: 'cgp', sigla: 'CGP', name: 'Coord. Geral', icon: ShieldCheck, health: 98, status: 'Estável', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'ascom', sigla: 'ASCOM', name: 'Comunicação', icon: Megaphone, health: 85, status: 'Monitorando', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'acessibilidade', sigla: 'ACESS', name: 'Acessibilidade', icon: Accessibility, health: 92, status: 'Estável', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'plan', sigla: 'PLAN', name: 'PMA / Estratégia', icon: BarChart3, health: 95, status: 'Estável', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'social', sigla: 'SOCIAL', name: 'Articulação', icon: Users2, health: 70, status: 'Alerta', color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'redes', sigla: 'REDES', name: 'Parcerias', icon: Network, health: 88, status: 'Monitorando', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'curadoria', sigla: 'CURADORIA', name: 'Científica', icon: BookOpen, health: 94, status: 'Estável', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'tech', sigla: 'TECH', name: 'Tecnologia', icon: Terminal, health: 90, status: 'Estável', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'executiva', sigla: 'EXEC', name: 'Coord. Executiva', icon: Activity, health: 100, status: 'Excelente', color: 'text-primary', bg: 'bg-primary/5' },
  { id: 'cgp-final', sigla: 'ADMIN', name: 'Relatórios/Contas', icon: ShieldCheck, health: 82, status: 'Atrasado', color: 'text-rose-500', bg: 'bg-rose-50' },
];

export function SectorHealthHeatmap() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
         <div className="space-y-1">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-800">
               Radar de Saúde Institucional
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
               Monitoramento de conformidade e performance por setor
            </p>
         </div>
         <div className="flex gap-2">
            <Badge variant="outline" className="rounded-full border-emerald-100 text-emerald-600 font-bold uppercase text-[9px] px-3">90%+ Estável</Badge>
            <Badge variant="outline" className="rounded-full border-amber-100 text-amber-600 font-bold uppercase text-[9px] px-3">70-89% Alerta</Badge>
            <Badge variant="outline" className="rounded-full border-rose-100 text-rose-600 font-bold uppercase text-[9px] px-3">&lt;70% Crítico</Badge>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {sectorHealthData.map((sector, idx) => (
          <motion.div
            key={sector.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group"
          >
            <Card className="rounded-[2.5rem] border-none ring-1 ring-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-white h-full">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                   <div className={cn("p-3 rounded-2xl bg-white ring-1 ring-slate-50 shadow-inner", sector.color)}>
                      <sector.icon size={20} />
                   </div>
                   <span className={cn("text-[8px] font-black uppercase tracking-widest", sector.color)}>
                      {sector.status}
                   </span>
                </div>
                
                <div className="space-y-1">
                   <h4 className="text-sm font-black uppercase italic tracking-tighter text-slate-800 leading-none">
                      {sector.sigla}
                   </h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase truncate">
                      {sector.name}
                   </p>
                </div>

                <div className="space-y-2 pt-2">
                   <div className="flex justify-between items-end text-[10px] font-black">
                      <span className="text-slate-300 uppercase tracking-tighter">Conformidade</span>
                      <span className={sector.color}>{sector.health}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${sector.health}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={cn("h-full rounded-full", sector.color === 'text-primary' ? 'bg-primary' : sector.color.replace('text-', 'bg-'))}
                      />
                   </div>
                </div>

                <div className="pt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Clock size={10} className="text-slate-300" />
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Atualizado: 2h atrás</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Global Performance Insight */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5 shadow-2xl overflow-hidden relative">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <CheckCircle2 size={120} className="text-primary" />
         </div>
         <div className="flex items-center gap-6 relative z-10">
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/20 animate-pulse">
               <Activity size={24} />
            </div>
            <div className="space-y-1 text-center md:text-left">
               <h4 className="text-xl font-black italic uppercase tracking-tighter text-white">Score Global de Saúde: <span className="text-primary">91.4%</span></h4>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">O ecossistema institucional opera em regime de alta conformidade (Modo Estável)</p>
            </div>
         </div>
         <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-black uppercase text-[10px] tracking-widest px-6 py-3 rounded-full relative z-10">
            Intervenção PMA: Não necessária
         </Badge>
      </div>
    </div>
  );
}
