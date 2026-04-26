"use client";

import React from 'react';
import { 
  ShieldCheck, 
  Settings, 
  ArrowRight,
  Database,
  Lock
} from 'lucide-react';
import CoordinationBoard from '@/components/coordination-board';
import { Badge } from "@/components/ui/badge";
import { dataService } from '@/lib/data-service';

export default function CoordenacaoPage() {
  const role = dataService.getUserRole();
  const isAuthorized = dataService.isCoordinator() || role === 'admin';

  if (!isAuthorized) {
    return (
      <div className="flex h-[80vh] items-center justify-center p-10">
        <div className="flex flex-col items-center gap-6 max-w-md text-center">
            <div className="h-20 w-20 rounded-[2.5rem] bg-red-50 flex items-center justify-center border border-red-100 shadow-xl">
                <Lock className="h-10 w-10 text-red-500" />
            </div>
            <div>
                <h1 className="text-3xl font-black italic tracking-tighter text-slate-800 uppercase">Acesso <span className="text-red-500">Restrito</span></h1>
                <p className="text-sm font-medium text-slate-400 mt-2 uppercase tracking-widest leading-relaxed">
                    Apenas membros da Coordenação Geral possuem permissões para acessar esta camada de governança.
                </p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Sector Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <Badge className="bg-slate-900 text-white font-black uppercase text-[9px] tracking-[0.2em] px-4 py-1.5 rounded-full border border-white/10 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3 text-primary animate-pulse" />
                        Governança Executiva
                    </span>
               </Badge>
               <div className="h-px w-12 bg-slate-100" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">CGP-2026-X</span>
            </div>
            
            <h1 className="text-6xl font-black italic tracking-tighter text-slate-800 uppercase leading-[0.9]">
                Coordenação <br /> <span className="text-primary italic">Institucional</span>
            </h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4 max-w-xl">
                Painel de decisão institucional, aprovação de exceções e monitoramento de riscos estratégicos da Rede Inova Social.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
             <div className="flex items-center gap-4 bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 min-w-[280px]">
                <div className="h-14 w-14 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5">
                    <Database className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Estado Sistêmico</span>
                    <h4 className="text-lg font-black italic text-slate-800 uppercase tracking-tighter">Normalizado</h4>
                    <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className="h-full w-full bg-emerald-500" />
                    </div>
                </div>
             </div>
          </div>
      </div>

      <CoordinationBoard />
    </div>
  );
}
