"use client";

import React, { useState } from "react";
import { MessageSquare, ClipboardList, Calendar, Users, Send, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { dataService } from "@/lib/data-service";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function AscomInternalFlow() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Focal points by sector
  const focalPoints = [
    { sector: "Pesquisa", name: "Prof. Aisamaque", role: "Coordenação Científica", icon: Users },
    { sector: "Extensão", name: "Prof.ª Andréa", role: "Coordenação Extensionista", icon: Users },
    { sector: "Tecnologia", name: "Dayane Lopes", role: "Articulação Interna", icon: Users }
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const action = formData.get("action") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const target = formData.get("target") as string;
    const objective = formData.get("objective") as string;

    try {
      // Create a task for ASCOM Coordinator (Amanda - ID 15)
      await dataService.assignTask({
        title: `Solicitação de Divulgação: ${action}`,
        description: `O QUE: ${action}\nQUANDO: ${date}\nONDE: ${location}\nPÚBLICO: ${target}\nOBJETIVO: ${objective}`,
        deadline: date,
        status: 'pendente',
        statusId: 'st-andamento',
        priority: 'urgente',
        assignedToId: '15', // Amanda
        assignedToName: 'Amanda Milly',
        category: 'comunicacao',
        sectorId: 'ascom',
        sector: 'ASCOM',
        typeId: 'tt-atividade',
        visibility: 'Interno',
        approvalStatus: 'pendente',
        workflowStage: 'producao',
        createdAt: new Date().toISOString(),
      });
      
      setFormSubmitted(true);
      toast({ title: "Solicitação Enviada", description: "A Amanda receberá sua demanda para análise." });
    } catch (error) {
      toast({ title: "Erro ao enviar", description: "Ocorreu um erro ao processar sua solicitação.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Focal Points & Meetings */}
      <div className="lg:col-span-1 space-y-6">
        <div className="space-y-4">
           <div className="flex items-center gap-3 px-2">
              <UserCheck size={18} className="text-primary" />
              <h3 className="font-headline uppercase italic text-lg tracking-tighter">Pontos Focais</h3>
           </div>
           
           <div className="grid gap-3">
             {focalPoints.map(p => (
               <div key={p.sector} className="p-4 rounded-3xl bg-white ring-1 ring-slate-100 flex items-center gap-4 group hover:ring-primary/20 transition-all">
                  <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                     <p.icon size={20} />
                  </div>
                  <div className="flex flex-col min-w-0">
                     <span className="text-[10px] font-black uppercase tracking-widest text-primary">{p.sector}</span>
                     <span className="text-xs font-bold text-slate-800 uppercase italic truncate">{p.name}</span>
                     <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">{p.role}</span>
                  </div>
               </div>
             ))}
           </div>
        </div>

        <div className="p-6 rounded-[2.5rem] bg-slate-900 text-white space-y-4">
           <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">Reunião Semanal</span>
           </div>
           <div className="space-y-2">
              <p className="text-[11px] font-medium text-slate-400 italic">"Alinhar ações da semana e identificar demandas de comunicação."</p>
              <div className="flex items-center gap-2 pt-2">
                 <div className="h-4 w-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={10} />
                 </div>
                 <span className="text-[9px] font-black uppercase tracking-widest">Toda Quinta-feira • 14h</span>
              </div>
           </div>
        </div>
      </div>

      {/* Request Form */}
      <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white ring-1 ring-slate-100 overflow-hidden">
        <CardHeader className="p-8 pb-4">
           <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                 <ClipboardList size={24} />
              </div>
              <div className="space-y-1">
                 <CardTitle className="text-xl font-headline uppercase italic tracking-tighter">Solicitação de Divulgação</CardTitle>
                 <CardDescription className="text-[9px] font-black uppercase tracking-widest italic flex items-center gap-1">
                    <AlertCircle size={10} className="text-amber-500" /> Fluxo Padrão Obrigatório
                 </CardDescription>
              </div>
           </div>
        </CardHeader>
        
        <CardContent className="p-8 pt-2">
          {formSubmitted ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
               <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={32} />
               </div>
               <div className="space-y-1">
                  <h4 className="text-lg font-black uppercase italic text-slate-800">Solicitação Protocolada!</h4>
                  <p className="text-xs text-slate-500 font-medium">Sua demanda foi enviada para a fila de priorização da Amanda.</p>
               </div>
               <Button 
                variant="outline" 
                onClick={() => setFormSubmitted(false)}
                className="mt-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
               >
                 Nova Solicitação
               </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">O que é a ação?</label>
                  <Input name="action" placeholder="Ex: Oficina de Saberes" className="rounded-2xl border-slate-100" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Quando vai acontecer?</label>
                  <Input name="date" type="date" className="rounded-2xl border-slate-100" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Onde será realizada?</label>
                  <Input name="location" placeholder="Ex: Campus Itapetinga" className="rounded-2xl border-slate-100" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Público-alvo</label>
                  <Input name="target" placeholder="Ex: Agricultores Familiares" className="rounded-2xl border-slate-100" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Qual o objetivo principal?</label>
                <Textarea name="objective" placeholder="Resumo estratégico da ação..." className="rounded-[2rem] border-slate-100 min-h-[100px]" required />
              </div>

              <div className="flex justify-end pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="rounded-full bg-primary hover:bg-primary/90 px-8 h-12 font-black uppercase italic tracking-widest text-[11px]"
                >
                  <Send className="w-4 h-4 mr-2" /> {isSubmitting ? "Enviando..." : "Enviar para ASCOM"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
