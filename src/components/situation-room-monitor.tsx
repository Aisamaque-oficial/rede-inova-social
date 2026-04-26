"use client";

import React from "react";
import { 
  Activity, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  TrendingUp,
  Zap,
  Filter,
  BarChart3,
  LayoutGrid
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ExecutiveBriefing, SectorHealth, dataService, InstitutionalRisk } from "@/lib/data-service";
import { BottleneckRegistrationModal } from "./bottleneck-registration-modal";
import { StrategicInterventionModal } from "./strategic-intervention-modal";
import { FolderArchive, PlusCircle } from "lucide-react";

interface SituationRoomMonitorProps {
  briefing: ExecutiveBriefing;
}

export function SituationRoomMonitor({ briefing }: SituationRoomMonitorProps) {
  const [interveningRisk, setInterveningRisk] = React.useState<InstitutionalRisk | null>(null);
  const [isInterveneModalOpen, setIsInterveneModalOpen] = React.useState(false);

  const handleIntervene = (risk: InstitutionalRisk) => {
    setInterveningRisk(risk);
    setIsInterveneModalOpen(true);
  };
  return (
    <div className="space-y-12">
      {/* Resumo de Impacto – Real-Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          label="Saúde Global" 
          value={`${briefing.globalHealthScore}%`} 
          desc="Índice de fluidez operacional"
          icon={Activity}
          color="blue"
          trend="+2.4%"
        />
        <SummaryCard 
          label="Exceções Pendentes" 
          value={briefing.pendingExceptionsCount.toString()} 
          desc="Requisições aguardando decisão"
          icon={ShieldAlert}
          color="amber"
          isAlert={briefing.pendingExceptionsCount > 0}
        />
        <SummaryCard 
          label="Bloqueios Críticos" 
          value={briefing.criticalDependencies.toString()} 
          desc="Tarefas urgentes travadas"
          icon={AlertCircle}
          color="rose"
          isAlert={briefing.criticalDependencies > 0}
        />
        <SummaryCard 
          label="Metas Batidas" 
          value={`${briefing.goalCompliance}%`} 
          desc="Aderência ao planejamento PMA"
          icon={CheckCircle2}
          color="emerald"
        />
        <SummaryCard 
          label="Riscos Escalonados" 
          value={briefing.institutionalRisks?.length.toString() || "0"} 
          desc="Escalonamento de atrasos setoriais"
          icon={ShieldAlert}
          color="rose"
          isAlert={briefing.institutionalRisks?.length > 0}
        />
      </div>

      {/* Mapa de Calor Setorial */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
            <div className="space-y-1">
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-800 flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5 text-primary" />
                    Heatmap de Performance Setorial
                </h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Monitoramento de carga e gargalos por setor</p>
            </div>
            <div className="flex gap-2">
                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black uppercase text-[9px] tracking-widest px-3">Estável</Badge>
                <Badge className="bg-amber-50 text-amber-600 border-none font-black uppercase text-[9px] tracking-widest px-3">Atenção</Badge>
                <Badge className="bg-rose-50 text-rose-600 border-none font-black uppercase text-[9px] tracking-widest px-3">Crítico</Badge>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {briefing.sectorHealth.map((sector) => (
                <SectorHealthCard key={sector.sectorId} sector={sector} />
            ))}
        </div>
      </div>

      {/* Alertas de Gargalos e Dependências */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-[2.5rem] border-none ring-1 ring-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-black italic uppercase tracking-tighter text-slate-800 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                        Gargalos Recentes
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 rounded-full text-[9px] font-black uppercase tracking-widest border-slate-200 hover:bg-slate-100"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('openBottleneckModal', { detail: null }));
                          }}
                        >
                            <PlusCircle className="mr-1.5 h-3 w-3" />
                            Registrar
                        </Button>
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-slate-200">Refletindo PMA</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                {briefing.recentBottlenecks.length > 0 ? (
                    briefing.recentBottlenecks.map((bottleneck) => (
                        <div key={bottleneck.id} className="flex gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-primary/20 transition-all">
                            <div className={cn(
                                "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0",
                                bottleneck.severity === 'alta' ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                            )}>
                                <AlertCircle size={20} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-black text-slate-800 uppercase italic tracking-tight">{bottleneck.reason}</p>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Severidade: {bottleneck.severity}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                        <CheckCircle2 size={48} className="opacity-20 mb-4" />
                        <p className="font-black uppercase text-xs tracking-[0.2em]">Sem impedimentos críticos</p>
                    </div>
                )}
            </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none ring-1 ring-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
                <CardTitle className="text-lg font-black italic uppercase tracking-tighter text-slate-800 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    Fluxo de Produtividade
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                            <span>Eficiência de Entrega</span>
                            <span className="text-emerald-500">94.2%</span>
                        </div>
                        <Progress value={94.2} className="h-2 bg-slate-50 shadow-inner" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                            <span>Resolução de Gargalos</span>
                            <span className="text-blue-500">82%</span>
                        </div>
                        <Progress value={82} className="h-2 bg-slate-50 shadow-inner" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                            <span>Conformidade PMA</span>
                            <span className="text-amber-500">76%</span>
                        </div>
                        <Progress value={76} className="h-2 bg-slate-50 shadow-inner" />
                    </div>
                    
                    <div className="pt-4">
                        <div className="p-6 rounded-[2rem] bg-emerald-50/50 border border-emerald-100/50">
                            <p className="text-xs font-bold text-emerald-600 line-clamp-3 italic">
                                "O projeto mantém uma curva de entrega estável, com leve ponto de atenção no núcleo de Acessibilidade devido ao regime de demandas urgentes da ASCOM."
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
      {/* NOVA SEÇÃO: Alertas de Atraso Setorial (Escalonamento) */}
      <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-800 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-rose-500 fill-rose-500" />
                      Prioridades de Intervenção
                  </h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Atrasos críticos exigindo atenção da executiva</p>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {briefing.institutionalRisks?.map((risk) => (
                  <div key={risk.id} className="relative p-7 rounded-[2.5rem] bg-white ring-1 ring-slate-100 hover:shadow-xl transition-all group overflow-hidden border-l-4 border-l-rose-500">
                      <div className="relative z-10 space-y-5">
                          <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                      <Badge className={cn(
                                          "rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.2em] border-none",
                                          risk.riskType === 'overdue' ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
                                      )}>
                                          {risk.riskType === 'overdue' ? 'Atraso' : 'Fila'}
                                      </Badge>
                                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">{risk.sectorSigla}</span>
                                  </div>
                                  <h5 className="text-md font-black uppercase tracking-tighter text-slate-800 leading-tight line-clamp-2">
                                      {risk.taskTitle}
                                  </h5>
                              </div>
                          </div>

                          <div className="flex items-center justify-between py-3 border-y border-slate-50">
                              <div className="flex flex-col">
                                  <span className={cn("text-lg font-black italic tracking-tighter", risk.delayDays >= 3 ? "text-red-500" : "text-slate-700")}>
                                      {risk.delayDays > 0 ? `${risk.delayDays} Dias` : 'Parado'}
                                  </span>
                              </div>
                              <Button 
                                  variant="ghost" 
                                  className="h-9 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest bg-slate-900 border-none hover:bg-black text-white"
                                  onClick={() => handleIntervene(risk)}
                              >
                                  Intervir
                              </Button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      <StrategicInterventionModal 
        open={isInterveneModalOpen}
        onOpenChange={setIsInterveneModalOpen}
        taskId={interveningRisk?.taskId || ""}
        taskTitle={interveningRisk?.taskTitle || ""}
      />
    </div>
  );
}

function SummaryCard({ label, value, desc, icon: Icon, color, isAlert, trend }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };

  return (
    <Card className="rounded-[2rem] border-none ring-1 ring-slate-100 shadow-sm overflow-hidden bg-white group hover:shadow-xl transition-all duration-500">
      <CardContent className="p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className={cn("p-3 rounded-2xl shrink-0", colors[color])}>
            <Icon size={20} className={cn(isAlert && "animate-pulse")} />
          </div>
          {trend && (
            <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px]">
              {trend}
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</h4>
          <p className="text-4xl font-headline italic uppercase tracking-tighter text-slate-900 leading-none">{value}</p>
        </div>
        <p className="text-[10px] font-medium text-slate-400 italic leading-tight">{desc}</p>
      </CardContent>
    </Card>
  );
}

function SectorHealthCard({ sector }: { sector: SectorHealth }) {
  const statusColors = {
    estável: "bg-emerald-500 shadow-emerald-200",
    alerta: "bg-amber-500 shadow-amber-200",
    crítico: "bg-rose-500 shadow-rose-200"
  };

  const statusTags = {
    estável: "text-emerald-600 bg-emerald-50",
    alerta: "text-amber-600 bg-amber-50",
    crítico: "text-rose-600 bg-rose-50"
  };

  return (
    <Card className="rounded-[2.5rem] border-none ring-1 ring-slate-100 shadow-sm overflow-hidden bg-white group hover:shadow-lg transition-all">
       <div className={cn("h-1.5 w-full", 
          sector.status === 'estável' ? 'bg-emerald-500' : 
          sector.status === 'alerta' ? 'bg-amber-500' : 'bg-rose-500'
       )} />
       <CardContent className="p-8 space-y-6">
          <div className="flex items-center justify-between">
              <Badge className={cn("text-[9px] font-black uppercase tracking-widest px-3 border-none", statusTags[sector.status])}>
                {sector.status}
              </Badge>
              <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-slate-300" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sector.avgCycleTime}d SLA</span>
              </div>
          </div>

          <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 italic">{sector.sigla}</h4>
              <p className="text-lg font-black uppercase tracking-tighter text-slate-800 line-clamp-1">{sector.name}</p>
          </div>

          <div className="space-y-3 pt-2">
              <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Carga de Trabalho</span>
                  <span className="text-xs font-black uppercase tracking-tighter text-slate-700">{sector.loadScore}%</span>
              </div>
              <Progress value={sector.loadScore} className="h-1.5 bg-slate-50 border border-slate-100" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
              <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Atrasos</span>
                  <p className={cn("text-lg font-black italic tracking-tighter", sector.overdueCount > 0 ? "text-rose-500" : "text-slate-300")}>
                    {sector.overdueCount.toString().padStart(2, '0')}
                  </p>
              </div>
              <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Bloqueios</span>
                  <p className={cn("text-lg font-black italic tracking-tighter", sector.blockedCount > 0 ? "text-amber-500" : "text-slate-300")}>
                    {sector.blockedCount.toString().padStart(2, '0')}
                  </p>
              </div>
          </div>
       </CardContent>
    </Card>
  );
}
