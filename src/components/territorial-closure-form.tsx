"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Users, MapPin, ClipboardList, Share2, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerritorialClosureFormProps {
  data: any;
  onChange: (newData: any) => void;
  errors: string[];
}

export function TerritorialClosureForm({ data, onChange, errors }: TerritorialClosureFormProps) {
  const publicOptions = ["Agricultores", "Juventude", "Mulheres", "Lideranças", "Professores", "Gestores Públicos", "Outros"];
  
  const togglePublic = (p: string) => {
    const current = data.targetPublic || [];
    const next = current.includes(p) 
      ? current.filter((i: string) => i !== p) 
      : [...current, p];
    onChange({ ...data, targetPublic: next });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100/50 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
             <ClipboardCheck size={20} />
          </div>
          <div className="space-y-0.5">
             <h4 className="text-sm font-black uppercase italic tracking-tighter text-indigo-700">Registro Formal de Ação Territorial</h4>
             <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Preenchimento obrigatório para conclusão</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Município</label>
            <select 
              className="w-full rounded-2xl border-slate-100 bg-white h-12 text-xs font-bold italic px-4"
              value={data.municipality} 
              onChange={(e) => onChange({ ...data, municipality: e.target.value })}
            >
               <option value="">Selecione o Município...</option>
               <option value="Curimataú">Curimataú</option>
               <option value="Bananeiras">Bananeiras</option>
               <option value="Solânea">Solânea</option>
               <option value="Remígio">Remígio</option>
               <option value="Casserengue">Casserengue</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Comunidade ou Grupo</label>
            <Input 
              value={data.communityGroup}
              onChange={(e) => onChange({ ...data, communityGroup: e.target.value })}
              placeholder="Ex: Assentamento Novo Horizonte"
              className="rounded-2xl border-slate-100 bg-white h-12 text-xs font-bold italic"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Público-Alvo Alcançado</label>
          <div className="flex flex-wrap gap-2">
            {publicOptions.map(p => (
              <Badge 
                key={p}
                onClick={() => togglePublic(p)}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all",
                  data.targetPublic?.includes(p) 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                    : "bg-white text-slate-400 border border-slate-100 hover:border-indigo-200"
                )}
              >
                {p}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
           <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Tipo de Ação</label>
            <select 
              className="w-full rounded-2xl border-slate-100 bg-white h-12 text-xs font-bold italic px-4"
              value={data.actionType} 
              onChange={(e) => onChange({ ...data, actionType: e.target.value })}
            >
               <option value="">Tipo de Ação...</option>
               <option value="visita">Visita Técnica</option>
               <option value="escuta">Escuta Comunitária</option>
               <option value="oficina">Oficina Territorial</option>
               <option value="demanda">Registro de Demanda</option>
               <option value="outro">Outro</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Nº de Participantes</label>
            <Input 
              type="number"
              value={data.participantCount}
              onChange={(e) => onChange({ ...data, participantCount: parseInt(e.target.value) })}
              className="rounded-2xl border-slate-100 bg-white h-12 text-xs font-bold italic"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Resumo da Escuta / Achados</label>
          <Textarea 
            value={data.findingsSummary}
            onChange={(e) => onChange({ ...data, findingsSummary: e.target.value })}
            placeholder="Descreva os principais pontos observados e as falas da comunidade..."
            className="rounded-3xl border-slate-100 bg-white min-h-[120px] text-xs font-medium leading-relaxed italic p-6 shadow-inner"
          />
          <p className="text-[8px] font-bold text-slate-400 italic text-right">
             {data.findingsSummary?.length || 0} / 20 caracteres mínimos
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Encaminhamento Gerado</label>
          <div className="relative">
            <Share2 className="absolute left-4 top-4 text-slate-300 h-4 w-4" />
            <Input 
              value={data.generatedForwarding}
              onChange={(e) => onChange({ ...data, generatedForwarding: e.target.value })}
              placeholder="Ex: Encaminhado para ASCOM registrar bastidores..."
              className="rounded-2xl border-slate-100 bg-white h-12 pl-12 text-xs font-bold italic"
            />
          </div>
        </div>
      </div>

      {/* Alertas de Validação */}
      {errors.length > 0 && (
         <div className="p-6 rounded-[2rem] bg-red-50 border border-red-100 space-y-3 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2 text-red-600">
               <AlertCircle size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Pendências de Registro Territorial</span>
            </div>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
               {errors.map((err, i) => (
                  <li key={i} className="text-[9px] font-bold text-red-500 italic flex items-center gap-1.5">
                     <span className="h-1 w-1 rounded-full bg-red-400 shrink-0" /> {err}
                  </li>
               ))}
            </ul>
         </div>
      )}
    </div>
  );
}

function AlertCircle({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
