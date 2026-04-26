"use client";

import React, { useState, useEffect } from "react";
import { TerritorialArticulationBoard } from "@/components/territorial-articulation-board";
import { dataService } from "@/lib/data-service";
import { ProjectTask } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ArticulacaoPage() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const allTasks = await dataService.getTasks();
      // Filtrar por setor de articulação
      setTasks(allTasks.filter(t => t.sectorId === 'social' || t.sector === 'ARTICULACAO'));
    } catch (error) {
       toast({ title: "Erro ao carregar dados", variant: "destructive" });
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
         <Loader2 className="h-12 w-12 animate-spin text-indigo-500 opacity-20" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <TerritorialArticulationBoard 
        tasks={tasks} 
        onTaskUpdated={loadData} 
      />
    </div>
  );
}
