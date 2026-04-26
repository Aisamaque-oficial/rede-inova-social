"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { dataService } from "@/lib/data-service";
import { ProjectTask, sectors } from "@/lib/mock-data";
import GlobalActivityTable from "@/components/global-activity-table";
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  LayoutDashboard,
  ArrowUpRight,
  TrendingUp,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function SectorDashboardPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const sector = sectors.find(s => s.id === id);
  const sectorSigla = sector?.sigla || id;

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await dataService.getTasks();
      const filtered = data.filter(t => t.sector === sectorSigla || t.sectorId === id);
      setTasks(filtered);
      setIsLoading(false);
    };
    fetchTasks();
  }, [id, sectorSigla]);

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => ['pendente', 'nao_iniciado', 'em_andamento'].includes(t.status)).length,
    concluded: tasks.filter(t => t.status === 'concluida').length,
    overdue: tasks.filter(t => t.status === 'atrasada').length,
  };

  if (!sector) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground font-bold uppercase tracking-widest">Setor não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-md p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className={`w-20 h-20 rounded-[2.5rem] bg-${sector.color}-500/10 flex items-center justify-center border border-${sector.color}-500/20 shadow-inner`}>
            <LayoutDashboard className={`h-10 w-10 text-primary`} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">Painel de Controle</Badge>
                <span className="text-slate-300 font-bold hidden md:inline">•</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{sector.name}</span>
            </div>
            <h1 className="text-5xl font-black font-headline tracking-tighter italic uppercase text-slate-800 leading-none">
                Núcleo <span className="text-primary">{sector.sigla}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6 relative z-10">
           <div className="text-right hidden lg:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saúde Operacional</p>
              <div className="flex items-center gap-2 mt-1">
                 <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <div key={i} className={`w-1.5 h-3 rounded-full ${i <= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`} />)}
                 </div>
                 <span className="text-xs font-black text-emerald-600">ESTÁVEL</span>
              </div>
           </div>

           <Link href={`/atividades/setor/${id}`}>
              <div className="bg-slate-900 text-white p-4 px-6 rounded-2xl flex items-center gap-4 hover:bg-primary transition-all shadow-lg group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-white/50 tracking-widest">Painel Setorial</span>
                  <span className="text-[11px] font-black uppercase italic tracking-tighter leading-none">Fluxo de Operações</span>
                </div>
                <ArrowUpRight className="ml-1 w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
           </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Atividades Totais", value: stats.total, icon: BarChart3, color: "slate", href: `/atividades/setor/${id}?filter=todos` },
          { label: "Pendentes / Rota", value: stats.pending, icon: Clock, color: "amber", href: `/atividades/setor/${id}?filter=pendente` },
          { label: "Finalizadas", value: stats.concluded, icon: CheckCircle2, color: "emerald", href: `/atividades/setor/${id}?filter=concluida` },
          { label: "Atrasadas", value: stats.overdue, icon: AlertCircle, color: "red", href: `/atividades/setor/${id}?filter=atrasada` },
        ].map((stat, i) => (
          <Link key={i} href={stat.href} className="block group">
            <Card className="rounded-[2rem] border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden relative h-full">
              <CardHeader className="p-6 pb-2">
                  <div className={`w-10 h-10 rounded-2xl bg-${stat.color === 'slate' ? 'primary' : stat.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon className={`h-5 w-5 ${stat.color === 'slate' ? 'text-primary' : `text-${stat.color}-500`}`} />
                  </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                  <div className="flex items-end justify-between">
                      <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                          <h3 className="text-4xl font-black italic tracking-tighter text-slate-800 leading-none">{stat.value}</h3>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight className="h-5 w-5 text-slate-300" />
                      </div>
                  </div>
                  <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div 
                          className={`h-full bg-${stat.color === 'slate' ? 'primary' : stat.color}-500 transition-all duration-1000`} 
                          style={{ width: stats.total > 0 ? `${(stat.value / stats.total) * 100}%` : '0%' }}
                      />
                  </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Table Section */}
      <div className="space-y-6">
          <div className="flex items-center gap-3 px-4">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <h2 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em]">Fluxo de Atividades em Tempo Real</h2>
          </div>
          <GlobalActivityTable initialSector={sector.sigla} />
      </div>

      {/* Destaque / Insight (Opcional) */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] translate-x-1/4 -translate-y-1/4 pointer-events-none" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">
                        <TrendingUp className="h-3 w-3" />
                        <span>Insight de Produtividade</span>
                  </div>
                  <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">O Núcleo {sector.sigla} está com<br />desempenho <span className="text-primary italic">Excepcional.</span></h3>
                  <p className="text-slate-400 font-medium italic text-lg leading-relaxed">
                      "Com {(stats.concluded / (stats.total || 1) * 100).toFixed(0)}% das atividades concluídas, o setor mantém um ritmo constante na rota de impacto do projeto."
                  </p>
              </div>
              <div className="flex justify-center lg:justify-end">
                  <div className="w-48 h-48 rounded-[3rem] border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-xl group-hover:rotate-12 transition-transform duration-1000 relative">
                        <Activity className="w-20 h-20 text-primary opacity-50 absolute inset-0 m-auto animate-pulse" />
                        <span className="text-6xl font-black italic tracking-tighter text-white z-10">A+</span>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
