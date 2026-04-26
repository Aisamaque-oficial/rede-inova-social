
"use client";

import { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { User, ProjectTask } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, Calendar, UserCheck, Loader2, ArrowRight, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GlobalActivityTable from "@/components/global-activity-table";

export default function AtribuicoesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const u = await dataService.getUsers();
      setUsers(u);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.id === selectedUserId);
    if (!user) return;

    try {
      await dataService.assignTask({
        title: newTitle,
        description: newDesc,
        deadline: newDate,
        status: 'pendente',
        statusId: 'st-nao-iniciado',
        priority: 'media',
        assignedToId: user.id,
        assignedToName: user.name,
        sectorId: user.department || 'cgp',
        sector: user.department || 'GERAL',
        typeId: 'tt-atividade',
        workflowStage: 'producao',
        category: 'comunicacao',
        visibility: 'Interno',
        approvalStatus: 'pendente',
        createdAt: new Date().toISOString()
      });

      toast({
        title: "✅ Atribuição Realizada",
        description: `A atividade "${newTitle}" foi atribuída para ${user.name}.`,
      });

      setNewTitle("");
      setNewDesc("");
      setTimeout(() => window.location.reload(), 1000); // Forçar refresh para atualizar lista global
    } catch (error) {
       toast({
        title: "❌ Erro ao atribuir",
        description: "Não foi possível registrar a nova atribuição.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="w-16 h-16 rounded-[1.8rem] bg-primary/10 flex items-center justify-center">
            <UserCheck className="h-8 w-8 text-primary" />
        </div>
        <div>
            <h1 className="text-4xl font-black font-headline tracking-tighter italic uppercase text-slate-800 leading-none">Gestão de Atribuições</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Distribua responsabilidades e planeje as atividades da equipe em tempo real.</p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 items-start">
        {/* Formulário lateral */}
        <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden group">
                <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
                    <CardTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 group-hover:text-primary transition-colors">
                        <Activity className="h-5 w-5" />
                        Nova Atribuição
                    </CardTitle>
                    <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Defina a tarefa e o responsável direto.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <form onSubmit={handleAssign} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Membro Responsável</Label>
                            <Select onValueChange={setSelectedUserId} required>
                                <SelectTrigger className="rounded-2xl h-12 bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-primary transition-all font-bold">
                                    <SelectValue placeholder="Selecione um executor" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl">
                                    {users.map(u => (
                                        <SelectItem key={u.id} value={u.id} className="font-bold py-3 uppercase text-[10px] tracking-widest">{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Título da Atividade</Label>
                            <Input 
                                id="title" 
                                placeholder="Descreva o assunto..." 
                                className="rounded-2xl h-12 bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-primary transition-all font-bold placeholder:font-medium"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="desc" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Instruções Técnicas</Label>
                            <Textarea 
                                id="desc" 
                                placeholder="Detalhamento do fluxo esperado..." 
                                className="rounded-[2rem] min-h-[120px] bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-primary transition-all font-medium p-6"
                                value={newDesc}
                                onChange={(e) => setNewDesc(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Prazo Final</Label>
                            <Input 
                                id="date" 
                                type="date" 
                                className="rounded-2xl h-12 bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-primary transition-all font-bold"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                required 
                            />
                        </div>

                        <Button type="submit" className="w-full h-14 rounded-2xl bg-primary shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all text-[11px] font-black uppercase tracking-[0.2em] mt-4">
                            Lançar na Rota do Setor
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>

        {/* Tabela de fluxo - Ocupando a maior parte */}
        <Card className="lg:col-span-8 border-none bg-transparent shadow-none">
            <GlobalActivityTable />
        </Card>
      </div>
    </div>
  );
}
