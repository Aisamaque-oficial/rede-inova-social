"use client";

import React, { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { ProjectBottleneck } from "@/lib/schema/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FolderArchive, 
  Calendar, 
  AlertCircle, 
  ChevronRight, 
  History, 
  FileText,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function BottleneckHistoryView() {
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [bottlenecks, setBottlenecks] = useState<ProjectBottleneck[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const list = dataService.getBottleneckMonths();
    setMonths(list);
    if (list.length > 0 && !selectedMonth) {
      setSelectedMonth(list[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      const data = dataService.getBottlenecks(selectedMonth);
      setBottlenecks(data);
    }
  }, [selectedMonth]);

  const filtered = bottlenecks.filter(b => 
    b.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatMonth = (key: string) => {
    const [year, month] = key.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase();
  };

  return (
    <div className="space-y-10">
      {/* Seletor de Mês e Busca */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
         <div className="flex items-center gap-3 bg-white p-2 rounded-[2rem] shadow-sm ring-1 ring-slate-100 overflow-x-auto no-scrollbar max-w-full">
            {months.map(m => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={cn(
                  "px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  selectedMonth === m 
                    ? "bg-slate-900 text-white shadow-xl" 
                    : "text-slate-400 hover:bg-slate-50"
                )}
              >
                {formatMonth(m)}
              </button>
            ))}
         </div>

         <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Pesquisar registro..." 
              className="pl-12 rounded-full h-12 bg-white border-none ring-1 ring-slate-100 font-bold text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      {/* Grid de Registros */}
      <div className="grid grid-cols-1 gap-6">
        {filtered.length > 0 ? (
          filtered.map((b) => (
            <Card key={b.id} className="group border-none shadow-sm ring-1 ring-slate-100 rounded-[2.5rem] overflow-hidden bg-white hover:shadow-xl transition-all duration-500">
               <div className="flex flex-col md:flex-row">
                  <div className={cn(
                    "md:w-64 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-50",
                    b.severity === 'alta' ? "bg-rose-50/30" : "bg-amber-50/30"
                  )}>
                    <div className="space-y-4">
                        <Badge className={cn(
                          "border-none font-black uppercase text-[8px] tracking-[0.2em] px-3 py-1",
                          b.severity === 'alta' ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                        )}>
                          Risco {b.severity}
                        </Badge>
                        <div className="flex items-center gap-2 text-slate-400">
                           <Calendar size={12} />
                           <span className="text-[10px] font-black uppercase tracking-tight">
                              {new Date(b.timestamp).toLocaleDateString('pt-BR')}
                           </span>
                        </div>
                    </div>
                    <div className="mt-6 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Reportado por</span>
                        <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{b.reportedByName}</span>
                    </div>
                  </div>

                  <div className="flex-1 p-8 md:p-10 space-y-4">
                     <div className="flex items-start justify-between gap-4">
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800 leading-tight group-hover:text-primary transition-colors">
                          {b.reason}
                        </h4>
                        <div className={cn(
                          "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0",
                          b.status === 'ativo' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                        )}>
                           <AlertCircle size={20} />
                        </div>
                     </div>
                     <p className="text-sm font-medium text-slate-500 leading-relaxed italic whitespace-pre-wrap">
                        {b.description}
                     </p>
                  </div>
               </div>
            </Card>
          ))
        ) : (
          <div className="bg-slate-50 rounded-[3.5rem] border border-dashed border-slate-200 py-24 flex flex-col items-center justify-center text-slate-400">
             <History size={64} className="opacity-10 mb-4" />
             <p className="font-black uppercase text-sm tracking-widest">Nenhum registro encontrado para este período</p>
          </div>
        )}
      </div>
    </div>
  );
}
