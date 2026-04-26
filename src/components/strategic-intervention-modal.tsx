"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { dataService } from "@/lib/data-service";
import { ShieldAlert, Send, Clock, MessageSquare, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StrategicInterventionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  taskTitle: string;
  onSuccess?: () => void;
}

export function StrategicInterventionModal({ 
  open, 
  onOpenChange, 
  taskId, 
  taskTitle,
  onSuccess 
}: StrategicInterventionModalProps) {
  const [loading, setLoading] = useState(false);
  const [orientacao, setOrientacao] = useState("");

  const handleCobrarPrazo = async () => {
    setLoading(true);
    try {
      await dataService.registerIntervention(taskId, 'cobrar_prazo');
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOrientar = async () => {
    if (!orientacao.trim()) return;
    setLoading(true);
    try {
      await dataService.registerIntervention(taskId, 'orientacao_direta', orientacao);
      if (onSuccess) onSuccess();
      onOpenChange(false);
      setOrientacao("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-8 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
              <ShieldAlert size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">Intervenção Estratégica</DialogTitle>
              <DialogDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                Ações de Governança Executiva
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-8">
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Atividade sob Intervenção</span>
              <h4 className="text-sm font-black text-slate-800 uppercase leading-tight">{taskTitle}</h4>
              <Badge className="mt-3 bg-slate-200 text-slate-600 border-none text-[8px] font-black tracking-widest">ID: {taskId}</Badge>
           </div>

           <div className="space-y-6">
              <div className="space-y-3">
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} className="text-primary" /> Opção 1: Cobrança de Prazo
                 </h5>
                 <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
                    Notifica o coordenador do setor que esta atividade é prioridade absoluta e está com prazo crítico.
                 </p>
                 <Button 
                   onClick={handleCobrarPrazo} 
                   disabled={loading}
                   className="w-full h-11 rounded-xl bg-slate-900 hover:bg-black text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                 >
                    <Zap size={14} className="fill-primary text-primary" /> Disparar Cobrança de Prazo
                 </Button>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="space-y-4">
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={12} className="text-blue-500" /> Opção 2: Orientação Direta
                 </h5>
                 <Textarea 
                    placeholder="Escreva aqui a instrução manual para o setor..."
                    value={orientacao}
                    onChange={(e) => setOrientacao(e.target.value)}
                    className="min-h-[100px] rounded-2xl border-slate-200 bg-slate-50 text-xs font-bold p-4 focus:ring-primary/20"
                 />
                 <Button 
                   onClick={handleOrientar} 
                   disabled={loading || !orientacao.trim()}
                   className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                 >
                    <Send size={14} /> Enviar Orientação Manual
                 </Button>
              </div>
           </div>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 sm:justify-start">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic text-center w-full">
              Toda intervenção é registrada no log de auditoria permanente da CGP.
           </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
