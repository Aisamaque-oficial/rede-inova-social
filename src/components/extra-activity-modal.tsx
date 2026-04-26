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
import { Sparkles, Calendar, Target, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExtraActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectorId: string;
  onSuccess?: () => void;
}

export function ExtraActivityModal({ open, onOpenChange, sectorId, onSuccess }: ExtraActivityModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: new Date().toISOString().split('T')[0],
    extraQuantity: 1,
    extraImpact: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dataService.addExtraActivity({
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        extraQuantity: formData.extraQuantity,
        extraImpact: formData.extraImpact,
        sectorId: sectorId,
        assignedToId: dataService.getCurrentUserId() || "unassigned",
        assignedToName: dataService.getCurrentUser()?.name || "Membro",
        type: "Atividade Extra",
        typeId: "tt-atividade",
      } as any);

      onOpenChange(false);
      setFormData({
        title: "",
        description: "",
        deadline: new Date().toISOString().split('T')[0],
        extraQuantity: 1,
        extraImpact: ""
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao registrar atividade extra:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] border-none bg-white p-0 overflow-hidden shadow-2xl">
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-4 border border-white/10 backdrop-blur-sm">
                <Sparkles size={24} />
            </div>
            <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase leading-none">
              Registrar Atividade Extra
            </DialogTitle>
            <DialogDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Documentar impacto fora do planejamento PMA
            </DialogDescription>
          </div>
          <Sparkles className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 rotate-12" />
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Título da Atividade</Label>
              <div className="relative">
                <Target size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  id="title" 
                  placeholder="Ex: Oficina de Emergência Territorial" 
                  className="pl-10 h-12 rounded-2xl bg-slate-100/50 border-none font-bold text-xs focus-visible:ring-primary/20"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="grid gap-2">
                  <Label htmlFor="date" className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Data de Realização</Label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input 
                      id="date" 
                      type="date"
                      className="pl-10 h-12 rounded-2xl bg-slate-100/50 border-none font-bold text-xs focus-visible:ring-primary/20"
                      required
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    />
                  </div>
               </div>

               <div className="grid gap-2">
                  <Label htmlFor="qty" className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Qtd / Impacto (Numérico)</Label>
                  <Input 
                    id="qty" 
                    type="number"
                    className="h-12 rounded-2xl bg-slate-100/50 border-none font-bold text-xs focus-visible:ring-primary/20"
                    required
                    value={formData.extraQuantity}
                    onChange={(e) => setFormData({...formData, extraQuantity: parseInt(e.target.value)})}
                  />
               </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Descrição do Impacto</Label>
              <Textarea 
                id="description" 
                placeholder="Descreva brevemente o que foi realizado e qual o impacto gerado..." 
                className="min-h-[100px] rounded-2xl bg-slate-100/50 border-none font-bold text-xs focus-visible:ring-primary/20 py-4"
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter className="pt-4 gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="rounded-xl font-black uppercase text-[10px] tracking-widest h-11"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="rounded-xl font-black uppercase text-[10px] tracking-widest h-11 px-8 bg-slate-900 hover:bg-primary shadow-xl shadow-slate-900/10"
            >
              {loading ? "Registrando..." : "Confirmar Registro Extra"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
