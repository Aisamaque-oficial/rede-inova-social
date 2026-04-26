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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { dataService } from "@/lib/data-service";
import { sectors } from "@/lib/mock-data";
import { AlertTriangle, ShieldAlert, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottleneckRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialData?: {
    reason: string;
    description: string;
    severity: "alta" | "media";
    sectorId: string;
  };
}

export function BottleneckRegistrationModal({ open, onOpenChange, onSuccess, initialData }: BottleneckRegistrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
    severity: "media" as "alta" | "media",
    sectorId: "ascom"
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        reason: initialData.reason || "",
        description: initialData.description || "",
        severity: initialData.severity || "media",
        sectorId: initialData.sectorId || "ascom"
      });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dataService.reportBottleneck(formData);
      onOpenChange(false);
      setFormData({
        reason: "",
        description: "",
        severity: "media",
        sectorId: "ascom"
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao registrar gargalo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-[3rem] border-none bg-white p-0 overflow-hidden shadow-2xl">
        <div className="bg-rose-600 p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-6 border border-white/10 backdrop-blur-md">
                <AlertTriangle size={28} className="animate-pulse" />
            </div>
            <DialogTitle className="text-4xl font-headline italic tracking-tighter uppercase leading-none">
              Registrar Gargalo Crítico
            </DialogTitle>
            <DialogDescription className="text-rose-100 font-bold text-[11px] uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              Notificar Coordenação Geral sobre risco operacional
            </DialogDescription>
          </div>
          <Zap className="absolute -right-12 -bottom-12 w-64 h-64 text-white/10 rotate-12" />
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Setor Afetado</Label>
                  <select 
                    className="flex h-12 w-full rounded-2xl bg-slate-50 border-none px-4 py-2 text-xs font-bold focus-visible:ring-2 focus-visible:ring-rose-500 transition-all cursor-pointer"
                    value={formData.sectorId}
                    onChange={(e) => setFormData({...formData, sectorId: e.target.value})}
                  >
                    {sectors.map(s => (
                      <option key={s.id} value={s.id}>{s.sigla} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Gravidade do Risco</Label>
                  <div className="flex bg-slate-50 p-1 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, severity: 'media'})}
                      className={cn(
                        "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                        formData.severity === 'media' ? "bg-amber-500 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      Média
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, severity: 'alta'})}
                      className={cn(
                        "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                        formData.severity === 'alta' ? "bg-rose-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      Alta
                    </button>
                  </div>
                </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Título do Gargalo</Label>
              <Input 
                id="reason" 
                placeholder="Ex: Interrupção no fluxo de validação ASCOM" 
                className="h-12 rounded-2xl bg-slate-50 border-none font-bold text-xs focus-visible:ring-rose-500"
                required
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Descrição Detalhada e Risco Esperado</Label>
              <Textarea 
                id="description" 
                placeholder="Descreva o problema encontrado e como ele afeta o cronograma ou as metas..." 
                className="min-h-[120px] rounded-[2rem] bg-slate-50 border-none font-medium text-xs focus-visible:ring-rose-500 py-6"
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter className="pt-4 gap-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="rounded-2xl font-black uppercase text-[10px] tracking-widest h-12"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="rounded-2xl font-black uppercase text-[10px] tracking-widest h-12 px-10 bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-600/20 text-white"
            >
              {loading ? "Processando Alerta..." : "Disparar Alerta à Coordenação"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
