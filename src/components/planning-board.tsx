"use client";

import React, { useState, useEffect } from "react";
import { dataService, StrategicOverview, SectorHealth } from "@/lib/data-service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Zap, 
  Compass,
  MapPin,
  ShieldAlert,
  GanttChart,
  LifeBuoy
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PlanningBoard() {
  const [metrics, setMetrics] = useState<StrategicOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState(false);

  const fetchData = async () => {
    try {
      const data = await dataService.getStrategicMetrics();
      setMetrics(data);
      setCanEdit(dataService.canEditStrategicInfo());
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching strategic data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCorrectiveAction = async (bottleneck: any) => {
    setIsProcessing(bottleneck.id);
    await dataService.createCorrectiveAction(bottleneck.sectorId, bottleneck.reason);
    await fetchData();
    setIsProcessing(null);
  };

  if (isLoading) return <div className="h-60 flex items-center justify-center">Consolidando dados estratégicos...</div>;

  return (
    <div className="space-y-12 pb-20">
      {/* 🔮 Project Health Hub */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-[2.5rem] border-none bg-slate-900 p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <Activity className="h-24 w-24 text-emerald-500" />
          </div>
          <div className="relative z-10 flex flex-col gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Saúde Global</span>
            <span className="text-6xl font-black text-white tracking-tighter italic">{metrics?.globalHealthScore}%</span>
            <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${metrics?.globalHealthScore}%` }} />
                </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2.5rem] border-none bg-white p-8 shadow-sm ring-1 ring-slate-100">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Eficiência PMA</span>
            <span className="text-5xl font-black text-slate-800 tracking-tighter">{metrics?.goalCompliance}%</span>
            <div className="flex items-center gap-2 mt-2">
                <TrendingUp size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Metas em Dia</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2.5rem] border-none bg-red-50 p-8 shadow-sm ring-1 ring-red-100">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Atrasos Críticos</span>
            <span className="text-5xl font-black text-red-600 tracking-tighter">{metrics?.totalOverdue || 0}</span>
            <div className="flex items-center gap-2 mt-2">
                <Clock size={14} className="text-red-500" />
                <span className="text-[10px] font-bold text-red-500 uppercase">Ações fora do SLA</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2.5rem] border-none bg-amber-50 p-8 shadow-sm ring-1 ring-amber-100">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Gargalos</span>
            <span className="text-5xl font-black text-amber-600 tracking-tighter">{metrics?.totalBlocked || 0}</span>
            <div className="flex items-center gap-2 mt-2">
                <ShieldAlert size={14} className="text-amber-500" />
                <span className="text-[10px] font-bold text-amber-500 uppercase">Aguardando Resposta</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 🚀 Radar de Setores e Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 ring-1 ring-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-3xl bg-primary/10 text-primary">
                        <GanttChart className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic text-slate-800">Saúde por Setor</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monitoramento de carga e desempenho</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {metrics?.sectorHealth.map((sector) => (
                    <div key={sector.sectorId} className="group">
                        <div className="flex items-center justify-between mb-2 px-2">
                            <div className="flex items-center gap-3">
                                <span className={cn(
                                    "w-3 h-3 rounded-full",
                                    sector.status === 'crítico' ? "bg-red-500" : sector.status === 'alerta' ? "bg-amber-500" : "bg-emerald-500"
                                )} />
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest w-16">{sector.sigla}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase hidden md:inline">{sector.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400">CARGA: {Math.round(sector.loadScore)}%</span>
                                <Badge variant="outline" className={cn(
                                    "rounded-full text-[8px] font-black uppercase border-none",
                                    sector.status === 'crítico' ? "bg-red-100 text-red-600 shadow-sm shadow-red-100" : 
                                    sector.status === 'alerta' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                                )}>
                                    {sector.status}
                                </Badge>
                            </div>
                        </div>
                        <div className="h-4 bg-slate-50 rounded-full overflow-hidden p-0.5 ring-1 ring-slate-100">
                             <div 
                                className={cn(
                                    "h-full rounded-full transition-all duration-1000",
                                    sector.loadScore > 70 ? "bg-red-500" : sector.loadScore > 40 ? "bg-amber-500" : "bg-emerald-500"
                                )}
                                style={{ width: `${sector.loadScore}%` }}
                             />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 🆘 Action Center (Gargalos) */}
        <div className="bg-slate-50 rounded-[3rem] p-10 ring-1 ring-slate-200">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-3xl bg-amber-500 text-white shadow-lg shadow-amber-200">
                    <Zap className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase italic text-slate-800">Centro de Ação</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detecção automática de gargalos</p>
                </div>
            </div>

            <div className="space-y-4">
                {metrics?.recentBottlenecks.map((bot) => (
                    <Card key={bot.id} className="rounded-3xl border-none shadow-sm ring-1 ring-slate-200 bg-white group hover:ring-primary/30 transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    "p-2 rounded-xl shrink-0 mt-1",
                                    bot.severity === 'alta' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                                )}>
                                    <AlertTriangle size={16} />
                                </div>
                                <div className="space-y-3 flex-1">
                                    <p className="text-[11px] font-bold text-slate-700 leading-tight">{bot.reason}</p>
                                    {canEdit && (
                                      <Button 
                                          size="sm" 
                                          disabled={isProcessing === bot.id}
                                          className="w-full rounded-xl text-[9px] font-black uppercase tracking-widest bg-slate-900 hover:bg-primary transition-colors h-9"
                                          onClick={() => handleCorrectiveAction(bot)}
                                      >
                                          {isProcessing === bot.id ? "Processando..." : "Gerar Ação Corretiva"}
                                          <ArrowRight size={12} className="ml-2" />
                                      </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {metrics?.recentBottlenecks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-20 gap-4">
                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                        <p className="text-xs font-black uppercase tracking-widest text-center">Nenhum gargalo detectado no momento.</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* 🗺️ Mapa de Impacto Territorial */}
      <div className="bg-white rounded-[3rem] p-10 ring-1 ring-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
            <Compass className="h-40 w-40 text-primary rotate-12" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <MapPin className="text-primary" size={24} />
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic text-slate-800">Impacto Territorial</h2>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Consolidação geográfica de ações e parcerias</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center md:text-left">
                    <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Municípios</span>
                    <span className="text-3xl font-black text-slate-800 tracking-tighter">18</span>
                </div>
                <div className="text-center md:text-left">
                    <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Comunidades</span>
                    <span className="text-3xl font-black text-slate-800 tracking-tighter">42</span>
                </div>
                <div className="text-center md:text-left">
                    <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Participantes</span>
                    <span className="text-3xl font-black text-emerald-500 tracking-tighter">8.420</span>
                </div>
                <div className="text-center md:text-left">
                    <Button variant="outline" className="rounded-2xl border-2 border-primary/20 text-primary font-black uppercase tracking-widest text-[9px] h-12 hover:bg-primary/5">
                        Ver Mapa Completo
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
