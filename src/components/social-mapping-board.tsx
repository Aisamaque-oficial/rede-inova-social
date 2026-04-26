"use client";

import React, { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { CommunityLeader, Territory } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users2, 
  MapPin, 
  Plus, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  MoreVertical,
  Phone,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function SocialMappingBoard() {
  const [leaders, setLeaders] = useState<CommunityLeader[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [isAddingLeader, setIsAddingLeader] = useState(false);
  const [newLeader, setNewLeader] = useState<Omit<CommunityLeader, "id">>({
    name: "",
    municipality: "",
    territoryId: "",
    role: "",
    phone: "",
    questionnaireApplied: false,
    createdAt: new Date().toISOString()
  });
  const { toast } = useToast();

  useEffect(() => {
    const unsubLeaders = dataService.subscribeToLeaders(setLeaders);
    setTerritories(dataService.getTerritories());
    return () => unsubLeaders();
  }, []);

  const handleCreateLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.addLeader(newLeader);
    setIsAddingLeader(false);
    setNewLeader({
      name: "",
      municipality: "",
      territoryId: "",
      role: "",
      phone: "",
      questionnaireApplied: false,
      createdAt: new Date().toISOString()
    });
  };

  const municipalitiesCount = new Set(territories.map(t => t.municipality)).size;
  const progressPercent = (municipalitiesCount / 13) * 100;

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER & PROGRESSO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tighter uppercase italic text-primary">Mapeamento Territorial</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Diagnóstico e Escuta Ativa (Mês 02)</p>
        </div>

        <Card className="p-4 bg-slate-50 border-none ring-1 ring-slate-100 flex items-center gap-6 min-w-[300px]">
           <div className="space-y-2 flex-1">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                 <span className="text-slate-400">Progresso Regional</span>
                 <span className="text-primary">{municipalitiesCount}/13 Municípios</span>
              </div>
              <Progress value={progressPercent} className="h-1.5 bg-slate-200" />
           </div>
           <div className="bg-white p-2 rounded-xl shadow-sm">
              <MapPin className="h-5 w-5 text-primary" />
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LISTA DE LIDERANÇAS */}
        <div className="lg:col-span-8 space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-800 flex items-center gap-2">
                 <Users2 className="h-4 w-4 text-primary" /> Lideranças Identificadas
              </h3>
              <Button 
                onClick={() => setIsAddingLeader(true)}
                size="sm" 
                className="rounded-xl font-bold uppercase text-[9px] tracking-widest h-8 gap-2"
              >
                 <Plus className="h-3 w-3" /> Registrar Líder
              </Button>
           </div>

           <div className="grid gap-3">
              {leaders.map(leader => (
                <Card key={leader.id} className="p-4 border-none shadow-sm hover:shadow-md transition-all group bg-white ring-1 ring-slate-100 rounded-3xl">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
                            <span className="font-black text-lg italic">{leader.name.charAt(0)}</span>
                         </div>
                         <div className="space-y-0.5">
                            <h4 className="font-black text-sm text-slate-800 uppercase italic leading-none">{leader.name}</h4>
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{leader.role}</span>
                               <span className="text-[10px] text-slate-200">•</span>
                               <span className="text-[10px] font-bold text-primary uppercase">{leader.municipality}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-3">
                         <div className="flex flex-col items-end mr-4">
                            <Badge variant="outline" className={cn(
                                "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border-none",
                                leader.questionnaireApplied ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                            )}>
                               {leader.questionnaireApplied ? "Questionário Aplicado" : "Pendente de Escuta"}
                            </Badge>
                         </div>
                         <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 text-slate-300">
                            <MessageSquare className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 text-slate-300">
                            <MoreVertical className="h-4 w-4" />
                         </Button>
                      </div>
                   </div>
                </Card>
              ))}
           </div>
        </div>

        {/* FEED LATERAL / TERRITÓRIOS */}
        <div className="lg:col-span-4 space-y-6">
           <div className="px-2">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-800 mb-4">Territórios Ativos</h3>
              <div className="space-y-4">
                 {territories.map(territory => (
                   <Card key={territory.id} className="p-5 border-none shadow-sm bg-white ring-1 ring-slate-100 rounded-[2rem]">
                      <div className="flex justify-between items-start mb-4">
                         <div className="space-y-1">
                            <h4 className="font-black text-[12px] text-slate-800 uppercase italic">{territory.name}</h4>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{territory.municipality} • {territory.region}</p>
                         </div>
                         <Badge className={cn(
                            "text-[8px] font-black uppercase border-none",
                            territory.status === 'concluido' ? "bg-emerald-500" : "bg-primary"
                         )}>
                            {territory.status.replace('_', ' ')}
                         </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                         <div className="flex items-center gap-2">
                            <Users2 className="h-3 w-3 text-slate-300" />
                            <span className="text-[10px] font-black text-slate-500">{territory.leadersCount} Lideranças</span>
                         </div>
                         <Button variant="link" className="text-[9px] font-black uppercase text-primary h-auto p-0">Ver Detalhes</Button>
                      </div>
                   </Card>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* MODAL ADICIONAR LÍDER */}
      <Dialog open={isAddingLeader} onOpenChange={setIsAddingLeader}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-primary">Novo Registro Territorial</DialogTitle>
            <DialogDescription className="font-bold text-[10px] uppercase tracking-widest text-slate-400">
               Cadastre uma nova liderança identificada no campo.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateLeader} className="space-y-6 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Nome da Liderança</Label>
                <Input 
                   required
                   value={newLeader.name}
                   onChange={e => setNewLeader({...newLeader, name: e.target.value})}
                   placeholder="Nome completo..."
                   className="rounded-2xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Município</Label>
                    <Input 
                      required
                      value={newLeader.municipality}
                      onChange={e => setNewLeader({...newLeader, municipality: e.target.value})}
                      placeholder="Ex: Curimataú"
                      className="rounded-2xl"
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Cargo/Função</Label>
                    <Input 
                      required
                      value={newLeader.role}
                      onChange={e => setNewLeader({...newLeader, role: e.target.value})}
                      placeholder="Ex: Presidente Ass."
                      className="rounded-2xl"
                    />
                 </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Telefone/WhatsApp</Label>
                <Input 
                   value={newLeader.phone}
                   onChange={e => setNewLeader({...newLeader, phone: e.target.value})}
                   placeholder="(83) 9...."
                   className="rounded-2xl"
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddingLeader(false)} className="rounded-2xl uppercase text-[10px] font-black">Cancelar</Button>
              <Button type="submit" className="rounded-2xl bg-primary hover:bg-primary/90 uppercase text-[10px] font-black tracking-widest px-8">Salvar Registro</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
