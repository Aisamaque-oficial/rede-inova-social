"use client";

import React, { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import { dataService, AscomMetrics } from "@/lib/data-service";
import { ProjectTask } from "@/lib/mock-data";
import { 
  SectorSignageHeader, 
  SectorActionDashboard, 
  SectorPipelineTracker, 
  SectorQuickIndicators, 
  SectorContentLibrary 
} from "@/components/sector-operational-components";
import { ASCOMTaskTable } from "@/components/ascom-task-table";
import { Button } from "@/components/ui/button";
import { ExtraActivityModal } from "@/components/extra-activity-modal";
import { PlusCircle, Accessibility, BarChart3, ChevronRight, AlertTriangle, Lock, Sparkles } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { TaskCreationModal } from "@/components/task-creation-modal";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function SectorDynamicPage({ params: paramsPromise, searchParams: searchParamsPromise, forcedId }: any) {
  const params: any = use(paramsPromise);
  const searchParams: any = use(searchParamsPromise);
  
  const sectorId = forcedId || params?.id || "ascom";
  const [sector, setSector] = useState<any>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [metrics, setMetrics] = useState<any>({ publishedMonth: 0, inProduction: 0, overdue: 0, waiting: 0, blocked: 0, avgDeliveryTime: '...' });
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const currentUser = dataService.getCurrentUser();
  const currentUserDept = typeof currentUser?.department === 'string' ? currentUser.department : currentUser?.department?.sigla;
  const isCGP = currentUser?.id === '1' || currentUserDept?.toUpperCase() === 'CGP';
  const isExecutiva = currentUser?.id === '4' || (currentUserDept?.toUpperCase() === 'CGP' && !isCGP);
  
  const isRestrictedSector = ['plan', 'social', 'tech'].includes(sectorId);
  const canAccessFull = isCGP && currentUser?.id === '1';
  const canAccessWithWarning = isCGP;

  const fetchTasksAndMetrics = async (currentSector: any) => {
    try {
      if (!currentSector) return;
      const allTasks = await dataService.getTasks();
      const sectorTasks = allTasks.filter(t => 
        t.sector?.toUpperCase() === currentSector?.sigla?.toUpperCase() || 
        t.sectorId === currentSector?.id
      );
      setTasks(sectorTasks);

      const m = await dataService.getSectorMetrics(sectorId);
      setMetrics(m);
    } catch (e: any) {
      console.error("Erro ao carregar dados do setor:", e);
      setLastError(e.message || "Erro desconhecido ao carregar dados");
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const allSectors = await dataService.getSectors();
      const found = allSectors.find(s => s.id === sectorId || s.sigla.toLowerCase() === sectorId?.toLowerCase());
      setSector(found);
      if (found) {
        await fetchTasksAndMetrics(found);
      }
      setIsLoading(false);
    };
    init();

    const cleanup = dataService.subscribeToTasks(() => {
      if (sector) fetchTasksAndMetrics(sector);
    });
    return () => cleanup();
  }, [sectorId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <LucideIcons.Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-slate-500 font-medium">Sincronizando dados institucionais...</p>
      </div>
    );
  }

  if (!sector) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-slate-800">Setor não encontrado</h1>
        <p className="text-slate-500 mt-2">O setor "{sectorId}" não faz parte da estrutura atual.</p>
        <Link href="/dashboard" className="mt-6 text-indigo-600 hover:underline">Voltar ao Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <SectorSignageHeader 
        sector={sector}
      />

      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Gestão Operacional
            {isCGP && <Badge className="bg-amber-100 text-amber-700 border-amber-200">Visão Geral</Badge>}
          </h2>
          <p className="text-slate-500">Acompanhamento de entregas e fluxos do setor</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="rounded-full border-slate-200 text-indigo-600 hover:text-indigo-700 bg-white"
            onClick={() => setIsExtraModalOpen(true)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Atividade Extra
          </Button>
          <Button 
            className="rounded-full shadow-lg shadow-indigo-100 bg-indigo-600 hover:bg-indigo-700 px-6"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Nova Tarefa
          </Button>
          <Button variant="outline" className="rounded-full border-slate-200">
            <BarChart3 className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <SectorQuickIndicators 
        metrics={metrics} 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Fila de Produção</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-white">Todos</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-white text-slate-400 border-none">Pendentes</Badge>
              </div>
            </div>
            <div className="p-0">
               <ASCOMTaskTable 
                  forcedSectorId={sectorId}
                />
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <SectorPipelineTracker sectorId={sectorId} tasks={tasks} />
          <SectorContentLibrary sectorId={sectorId} />
        </div>
      </div>

      {lastError && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Erro de Aplicação</p>
            <p className="text-xs text-red-600">{lastError}</p>
          </div>
        </div>
      )}

      <TaskCreationModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen}
        onTaskCreated={fetchTasksAndMetrics}
        mode="action"
        isCGP={isCGP}
        initialSector={sector?.sigla || "CGP"}
      />

      <ExtraActivityModal 
        open={isExtraModalOpen}
        onOpenChange={setIsExtraModalOpen}
        sectorId={sectorId}
        onSuccess={fetchTasksAndMetrics}
      />
    </div>
  );
}
