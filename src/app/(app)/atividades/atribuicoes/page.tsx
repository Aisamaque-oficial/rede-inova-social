"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import GlobalActivityTable from "@/components/global-activity-table";
import { motion } from "framer-motion";
import { dataService } from "@/lib/data-service";
import { ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

function AtribuicoesContent() {
  const searchParams = useSearchParams();
  const sectorId = searchParams.get("sector") || "todos";
  const sectorSigla = dataService.getSectorSigla(sectorId);
  const sectorName = dataService.getSectorName(sectorId);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-slate-800 leading-none">
              Atribuições do Setor <span className="text-primary">{sectorSigla && sectorSigla !== "TODOS" ? sectorSigla : "Geral"}</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              Gestão de demandas e alocação de equipe do núcleo {sectorName || "Rede Inova"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <GlobalActivityTable initialSector={sectorId} />
      </div>
    </motion.div>
  );
}

export default function AtribuicoesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <AtribuicoesContent />
    </Suspense>
  );
}
