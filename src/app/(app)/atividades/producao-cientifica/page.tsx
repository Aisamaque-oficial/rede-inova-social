"use client";

import React, { useState, useEffect } from "react";
import { ScientificProductionBoard } from "@/components/scientific-production-board";
import { dataService } from "@/lib/data-service";
import { ProjectTask } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ProducaoCientificaPage() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await dataService.getTasks();
      const sciTasks = data.filter(t => t.sectorId === 'curadoria' || t.sector === 'CURADORIA');
      setTasks(sciTasks);
    } catch (error) {
       toast({ title: "Erro ao carregar dados científicos", variant: "destructive" });
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
         <Loader2 className="h-12 w-12 animate-spin text-emerald-500 opacity-20" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <ScientificProductionBoard />
    </div>
  );
}
