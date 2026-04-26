"use client";

import React from "react";
import { dataService } from "@/lib/data-service";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

interface OperationalDashboardLayoutProps {
  title: string;
  subtitle: string;
  sector: string;
  stats: DashboardStat[];
  children: React.ReactNode;
}

export function OperationalDashboardLayout({
  title,
  subtitle,
  sector,
  stats,
  children
}: OperationalDashboardLayoutProps) {
  const user = dataService.getCurrentUser();
  const role = dataService.getUserRole();

  return (
    <div className="space-y-10 pb-20">
      {/* Header Estilo Premium */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-primary italic uppercase leading-none">
            {title}
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
             {subtitle}
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-[1.5rem] shadow-sm ring-1 ring-slate-100">
           <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm italic">
              {user?.name?.charAt(0)}
           </div>
           <div className="pr-3">
              <span className="text-[10px] font-black text-slate-700 block leading-none uppercase tracking-tight">{user?.name}</span>
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">{sector} • {role === 'coordinator' ? 'Coordenação' : 'Membro de Setor'}</span>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
              <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 overflow-hidden rounded-[2rem] group hover:shadow-xl transition-all duration-500 bg-white">
                  <CardContent className="p-5 flex items-center justify-between">
                      <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{stat.label}</p>
                          <span className="text-2xl font-black tracking-tighter text-slate-800 italic">{stat.value}</span>
                      </div>
                      <div className={cn("p-3 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform", stat.color)}>
                          <stat.icon className="h-5 w-5" />
                      </div>
                  </CardContent>
              </Card>
          ))}
      </div>

      {/* Main Content Area */}
      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}
