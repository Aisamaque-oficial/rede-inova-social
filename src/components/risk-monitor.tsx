"use client";

import React from 'react';
import { 
  AlertTriangle, 
  Activity, 
  CheckCircle2 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { ExecutiveBriefing, dataService, InstitutionalRisk } from '@/lib/data-service';
import { StrategicInterventionModal } from './strategic-intervention-modal';

interface RiskMonitorProps {
  briefing: ExecutiveBriefing;
}

export function RiskMonitor({ briefing }: RiskMonitorProps) {
    const [interveningRisk, setInterveningRisk] = React.useState<InstitutionalRisk | null>(null);
    const [isInterveneModalOpen, setIsInterveneModalOpen] = React.useState(false);

    const handleIntervene = (risk: InstitutionalRisk) => {
        setInterveningRisk(risk);
        setIsInterveneModalOpen(true);
    };

    const handleOrientar = (risk: InstitutionalRisk) => {
        dataService.orientarSetor(risk.sectorId, risk.taskId);
    };

    const handleEscalar = (risk: InstitutionalRisk) => {
        window.dispatchEvent(new CustomEvent('openBottleneckModal', { 
            detail: {
                reason: "Atraso institucional",
                description: `Gargalo detectado pelo monitor de riscos na tarefa ${risk.taskTitle} (${risk.taskId}).`,
                severity: risk.severity,
                sectorId: risk.sectorId
            } 
        }));
    };

  return (
    <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
      <CardHeader className="bg-slate-950 p-10 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary mb-3">
              <Activity className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Riscos Institucionais</span>
            </div>
            <CardTitle className="text-4xl font-black italic uppercase tracking-tighter leading-tight">
              Status <span className="text-primary italic">Sistêmico</span>
            </CardTitle>
          </div>
          <AlertTriangle className={cn("h-14 w-14", briefing.highRiskSectors.length > 0 ? "text-red-500 animate-pulse" : "text-emerald-500")} />
        </div>
      </CardHeader>
      <CardContent className="p-12 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Coluna de Saúde Setorial */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Análise por Setor
            </h4>
            <div className="space-y-4">
              {briefing.sectorHealth.map((s) => (
                <div key={s.sectorId} className="flex items-center justify-between p-5 bg-slate-50/80 rounded-[1.5rem] border border-slate-100/50 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                       "w-3 h-3 rounded-full shadow-sm",
                       s.status === 'crítico' ? "bg-red-500 animate-pulse" : s.status === 'alerta' ? "bg-orange-500" : "bg-emerald-500"
                    )} />
                    <span className="text-sm font-black uppercase italic tracking-tighter text-slate-700">{s.sigla}</span>
                  </div>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest", s.status === 'crítico' ? "text-red-600" : "text-slate-400")}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna de Intervenções */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Intervenções Estratégicas Necessárias
            </h4>
            {briefing.recentBottlenecks.length === 0 ? (
              <div className="p-16 bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Fluxo Operacional Sob Controle</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {briefing.recentBottlenecks.map((b) => (
                  <div key={b.id} className="p-6 bg-white ring-1 ring-slate-100/80 rounded-[2rem] flex items-center justify-between shadow-sm hover:shadow-lg transition-all border-l-4 border-l-orange-500">
                    <div className="flex items-center gap-5">
                      <div className={cn("p-4 rounded-2xl", b.severity === 'alta' ? "bg-red-50" : "bg-orange-50")}>
                        <AlertTriangle className={cn("h-6 w-6", b.severity === 'alta' ? "text-red-600" : "text-orange-600")} />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-sm font-black uppercase tracking-widest text-slate-800 leading-snug">{b.reason}</h5>
                        <p className="text-xs font-medium text-slate-500 italic">Sugestão PMA: <span className="font-bold text-slate-700 not-italic">Gerar Tarefa Corretiva</span></p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="rounded-full h-11 text-[10px] font-black uppercase tracking-widest px-8 border-slate-200 hover:bg-slate-950 hover:text-white transition-all shadow-sm"
                      onClick={() => handleIntervene(b.sectorId, b.reason)}
                    >
                      Intervir
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* NOVA SEÇÃO: Alertas de Atraso Setorial (Escalonamento) */}
        <div className="pt-12 border-t border-slate-100 space-y-8">
            <div className="flex items-center justify-between">
                <h4 className="text-xl font-black italic uppercase tracking-tighter text-slate-800">
                    Alertas de <span className="text-rose-600">Atraso Setorial</span>
                </h4>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Crítico (3d+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atenção (1-2d)</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {briefing.institutionalRisks?.map((risk) => (
                    <div key={risk.id} className="relative p-8 rounded-[2.5rem] bg-white ring-1 ring-slate-100 hover:shadow-xl transition-all group overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge className={cn(
                                            "rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.2em] border-none",
                                            risk.riskType === 'overdue' ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
                                        )}>
                                            {risk.riskType === 'overdue' ? 'Atraso Cronograma' : 'Estagnado na Fila'}
                                        </Badge>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">{risk.sectorSigla}</span>
                                    </div>
                                    <h5 className="text-lg font-black uppercase tracking-tighter text-slate-800 leading-tight line-clamp-2">
                                        {risk.taskTitle}
                                    </h5>
                                </div>
                                <div className={cn(
                                    "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0",
                                    risk.severity === 'alta' ? "bg-red-50 text-red-600" : risk.severity === 'media' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                                )}>
                                    <AlertTriangle size={20} className={cn(risk.severity === 'alta' && "animate-pulse")} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-4 border-y border-slate-50">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Tempo de Atraso</span>
                                    <span className={cn("text-xl font-black italic tracking-tighter", risk.delayDays >= 3 ? "text-red-500" : "text-slate-700")}>
                                        {risk.delayDays > 0 ? `${risk.delayDays} Dias` : 'Parado na Fila'}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Responsável no Setor</span>
                                    <span className="text-xs font-bold text-slate-500 uppercase">{risk.assignedToName || 'Não Atribuído'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button 
                                    variant="ghost" 
                                    className="h-12 rounded-2xl text-[9px] font-black uppercase tracking-widest bg-slate-50 hover:bg-primary hover:text-white transition-all shadow-sm"
                                    onClick={() => dataService.orientarSetor(risk.sectorId, risk.taskId)}
                                >
                                    Orientar Setor
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="h-12 rounded-2xl text-[9px] font-black uppercase tracking-widest border-slate-200 hover:bg-slate-950 hover:text-white transition-all shadow-sm"
                                    onClick={() => {
                                        // Ação integrada para registrar gargalo
                                        window.dispatchEvent(new CustomEvent('openBottleneckModal', { 
                                            detail: { 
                                                reason: `Escalonamento: ${risk.taskTitle}`,
                                                description: `Risco institucional detectado devido ao atraso de ${risk.delayDays} dias no setor ${risk.sectorSigla}.`,
                                                sectorId: risk.sectorId,
                                                severity: risk.severity
                                            } 
                                        }));
                                    }}
                                >
                                    Escalar Risco
                                </Button>
                            </div>
                        </div>
                        {/* Indicador visual de severidade no fundo */}
                        <div className={cn(
                            "absolute top-0 right-0 w-32 h-32 blur-3xl opacity-5 -mr-16 -mt-16",
                            risk.severity === 'alta' ? "bg-red-500" : "bg-amber-500"
                        )} />
                    </div>
                ))}
            </div>
        </div>
      </CardContent>

      <StrategicInterventionModal 
        open={isInterveneModalOpen}
        onOpenChange={setIsInterveneModalOpen}
        taskId={interveningRisk?.taskId || ""}
        taskTitle={interveningRisk?.taskTitle || ""}
      />
    </Card>
  );
}
