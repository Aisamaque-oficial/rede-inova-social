"use client";

import { useEffect, useState } from "react";
import { dataService } from "@/lib/data-service";
import { Sector } from "@/lib/schema/models";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SectorSwitcher() {
  const [activeSector, setActiveSector] = useState<Sector | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const s = dataService.obterSessaoAtual();
    setSession(s);
    setActiveSector(dataService.getActiveSector());
  }, []);

  const handleSwitch = (sector: Sector) => {
    dataService.setActiveSector(sector);
    setActiveSector(sector);
  };

  if (!session || !session.assignments || session.assignments.length <= 1) {
    if (session?.role !== 'ADMIN' && session?.department !== 'CGP') {
        return null; // Don't show if only one sector and not admin
    }
  }

  const assignments = session.assignments || [];
  const isGlobalAdmin = session.role === 'ADMIN' || session.department === 'CGP';

  // For global admins, show all sectors or just their assignments?
  // Requirement: "Exceção apenas para perfis administrativos globais... que podem ter visão completa."
  // For the switcher, we should show all sectors for global admins.
  const allSectors: Sector[] = ["ASCOM", "ACESSIBILIDADE", "PLAN", "SOCIAL", "REDES", "CURADORIA", "TECH", "FINANCEIRO", "JURIDICO", "CGP", "ADMIN"];
  const availableSectors = isGlobalAdmin ? allSectors : assignments.map((a: any) => a.sector);

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 px-3 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] gap-2">
            <Layers className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Contexto:</span>
            <span className="bg-primary text-white px-1.5 py-0.5 rounded text-[9px]">
              {activeSector || "GERAL"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white border-primary/10 shadow-xl rounded-xl">
          <DropdownMenuLabel className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-3 py-2">
            Alternar Setor Institucional
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-100" />
          {availableSectors.map((sector: Sector) => (
            <DropdownMenuItem
              key={sector}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 cursor-pointer text-[11px] font-bold uppercase transition-colors",
                activeSector === sector ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50"
              )}
              onClick={() => handleSwitch(sector)}
            >
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", activeSector === sector ? "bg-primary" : "bg-slate-300")} />
                {sector}
              </div>
              {activeSector === sector && (
                <Badge variant="outline" className="text-[8px] border-primary/30 text-primary">Ativo</Badge>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
