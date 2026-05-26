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
import { getTeamMembers } from '@/lib/mock-data';
import { SectorSignageHeader } from '@/components/sector-operational-components';

export default function ExtensionCoordinationPage() {
  const role = dataService.getUserRole();
  const isAuthorized = dataService.isCoordinator() || role === 'ADMIN';

  // Dados virtuais para padronização do cabeçalho
  const extensionSector = {
    id: 'extensao',
    name: 'Coordenação de Extensão',
    sigla: 'EXTENSÃO',
    color: 'blue',
    icon: 'Globe',
    description: 'Painel de articulação transversal, monitoramento de impacto social e curadoria territorial.'
  };

  // Buscar membros (Danielle é a coordenadora aqui)
  const allMembers = getTeamMembers();
  const danielle = allMembers.find(m => m.id === '5'); // Danielle Silva
  const extensionMembers = allMembers.filter(m => 
    m.id === '5' || // Danielle
    m.assignments?.some(a => a.sector === 'extensao')
  );

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
      <SectorSignageHeader 
        sector={extensionSector}
        members={extensionMembers}
      />

      <ExtensionCoordinationBoard />
    </div>
  );
}
