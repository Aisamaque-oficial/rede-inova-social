"use client";

import React from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Database,
  Lock,
  Target
} from 'lucide-react';
import ExtensionCoordinationBoard from '@/components/extension-coordination-board';
import { Badge } from "@/components/ui/badge";
import { dataService } from '@/lib/data-service';

export default function ExtensionCoordinationPage() {
  const role = dataService.getUserRole();
  // Danielle has role 'coordinator' and department 'EXTENSÃO'
  // Aisamaque is 'ADMIN'
  const isAuthorized = dataService.isCoordinator() || role === 'ADMIN';

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
                    Apenas membros do Conselho Estratégico e Coordenação de Extensão possuem permissões para acessar este painel.
                </p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Sector Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white/40 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
              <Globe size={150} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
               <Badge className="bg-blue-600 text-white font-black uppercase text-[9px] tracking-[0.2em] px-4 py-1.5 rounded-full border border-white/10 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-blue-400/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center gap-2">
                        <Globe className="h-3 w-3 text-white animate-spin-slow" />
                        NÚCLEO ESTRATÉGICO
                    </span>
               </Badge>
               <div className="h-px w-12 bg-slate-200" />
               <span className="text-[10px] font-black text-slate-300 tracking-[0.3em] uppercase italic">REDE INOVA SOCIAL</span>
            </div>
            
            <h1 className="text-6xl font-black italic tracking-tighter text-slate-800 uppercase leading-[0.9]">
                Coordenação <br /> <span className="text-blue-500 italic">de Extensão</span>
            </h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4 max-w-xl italic opacity-80">
                Painel de articulação transversal, monitoramento de impacto social e curadoria territorial.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
             {/* 👑 DESTAQUE DE LIDERANÇA: DANIELLE */}
             <div className="bg-white p-6 rounded-[2rem] border border-blue-100 flex items-center gap-4 hover:shadow-2xl transition-all shadow-xl shadow-blue-500/5 scale-105 ring-1 ring-blue-200/50">
                <div className="relative">
                    <img 
                        src="https://i.pravatar.cc/150?u=danielle" 
                        alt="Danielle Silva" 
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/20"
                    />
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1 border-2 border-white shadow-lg">
                        <ShieldCheck size={14} />
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Liderança do Núcleo</span>
                    <span className="text-lg font-black text-slate-800 uppercase italic leading-none my-1">
                        Danielle Silva
                    </span>
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tight">
                        Coordenação de Ações Extensionistas
                    </span>
                </div>
             </div>

             <div className="hidden xl:flex flex-col items-end gap-3 opacity-40">
                <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 min-w-[240px]">
                    <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center">
                        <Target className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Alvo Territorial</span>
                        <h4 className="text-sm font-black italic text-slate-800 uppercase tracking-tighter">Em Escala</h4>
                    </div>
                </div>
             </div>
          </div>
      </div>

      <ExtensionCoordinationBoard />
    </div>
  );
}
