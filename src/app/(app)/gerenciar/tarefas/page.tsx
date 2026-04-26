"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { dataService } from "@/lib/data-service";
import { ProjectTask, User } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
    Plus, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    User as UserIcon, 
    MessageSquare, 
    ExternalLink,
    Instagram,
    Youtube,
    Layout,
    Loader2,
    ArrowLeft,
    Check
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function GerenciarTarefasPage() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const sector = searchParams.get("sector")?.toUpperCase();

  useEffect(() => {
    const loadData = async () => {
      const [allTasks, allUsers] = await Promise.all([
        dataService.getTasks(),
        dataService.getUsers()
      ]);
      setTasks(allTasks || []);
      setUsers(allUsers || []);
      setIsLoading(false);
    };
    loadData();
  }, [sector]);

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const assignedUser = users.find(u => u.id === formData.get("assignedToId"));

    const taskData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      deadline: formData.get("deadline") as string,
      assignedToId: assignedUser?.id || "",
      assignedToName: assignedUser?.name || "",
      category: (formData.get("category") as any) || (sector === 'ASCOM' ? 'comunicacao' : 'geral'),
      sector: sector || (formData.get("category") === 'comunicacao' ? 'ASCOM' : 'GERAL'),
      socialMediaPlatform: formData.get("platform") as any,
      status: 'nao_iniciado' as const,
      workflowStage: formData.get("category") === 'comunicacao' ? 'producao' : 'gestao',
      approvalStatus: 'pendente' as const
     };

    try {
      await dataService.assignTask(taskData as any);
      const updatedTasks = await dataService.getTasks();
      setTasks(updatedTasks);
      setIsDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao criar tarefa" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprove = async (taskId: string, status: 'aprovada' | 'rejeitada') => {
    try {
      await dataService.approveTask(taskId, status);
      const updatedTasks = await dataService.getTasks();
      setTasks(updatedTasks);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro na aprovação" });
    }
  };

  const getPlatformIcon = (platform?: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-3 w-3" />;
      case 'youtube': return <Youtube className="h-3 w-3" />;
      case 'tiktok': return <MessageSquare className="h-3 w-3" />;
      case 'site': return <Layout className="h-3 w-3" />;
      default: return null;
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

   const filteredTasks = sector 
    ? tasks.filter(t => t.sector === sector || (sector === 'ASCOM' && t.category === 'comunicacao'))
    : tasks;

   const stats = {
     pending: filteredTasks.filter(t => t.status === 'nao_iniciado' || t.status === 'em_andamento').length,
     overdue: filteredTasks.filter(t => t.status === 'atrasada').length,
     blocked: filteredTasks.filter(t => t.status === 'bloqueado').length,
     completed: filteredTasks.filter(t => t.status === 'concluida').length
   };
 
   const getTitle = () => {
       if (sector === 'ASCOM') return "Atribuições da ASCOM";
       if (sector === 'ACESSIBILIDADE') return "Atribuições da Acessibilidade";
       if (sector) return `Atribuições: ${sector}`;
       return "Gestão de Atividades Geral";
   };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/gerenciar"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight text-primary">{getTitle()}</h1>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest pt-1">
                    {sector ? `Centro de Atribuição e Aprovação • ${sector}` : "Painel Consolidado de Atribuições"}
                </p>
            </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full px-6 font-bold">
              <Plus className="mr-2 h-4 w-4" /> Nova Atribuição
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreateTask}>
              <DialogHeader>
                <DialogTitle className="font-headline italic text-2xl text-primary">Nova Atividade</DialogTitle>
                <DialogDescription>Delegue uma nova tarefa para um membro da equipe.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título da Atividade</Label>
                  <Input id="title" name="title" placeholder="Ex: Criar postagem Instagram" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="assignedToId">Atribuir Para</Label>
                        <select name="assignedToId" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="deadline">Previsão de Conclusão</Label>
                        <Input id="deadline" name="deadline" type="date" required />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="category">Categoria</Label>
                        <select name="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required>
                            <option value="geral">Geral / Administrativa</option>
                            <option value="comunicacao">Comunicação / ASCOM</option>
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="platform">Plataforma (Se ASCOM)</Label>
                        <select name="platform" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                            <option value="">Nenhuma</option>
                            <option value="instagram">Instagram</option>
                            <option value="tiktok">TikTok</option>
                            <option value="youtube">YouTube</option>
                            <option value="site">Website</option>
                        </select>
                    </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Instruções e Detalhes</Label>
                  <Textarea id="description" name="description" placeholder="Descreva os requisitos desta atividade..." className="min-h-[100px]" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSaving} className="w-full rounded-full font-bold">
                    {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : "Confirmar Atribuição"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-none shadow-sm bg-blue-50/50">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase text-blue-400 tracking-tighter">Em Aberto</p>
                        <h3 className="text-2xl font-bold text-blue-600 font-headline">{stats.pending}</h3>
                    </div>
                    <Clock className="h-8 w-8 text-blue-200" />
                </div>
            </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-red-50/50 animate-pulse-subtle">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase text-red-400 tracking-tighter">Atrasadas</p>
                        <h3 className="text-2xl font-bold text-red-600 font-headline">{stats.overdue}</h3>
                    </div>
                    <XCircle className="h-8 w-8 text-red-200" />
                </div>
            </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-orange-50/50">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase text-orange-400 tracking-tighter">Bloqueadas</p>
                        <h3 className="text-2xl font-bold text-orange-600 font-headline">{stats.blocked}</h3>
                    </div>
                    <Clock className="h-8 w-8 text-orange-200" />
                </div>
            </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-emerald-50/50">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase text-emerald-400 tracking-tighter">Finalizadas</p>
                        <h3 className="text-2xl font-bold text-emerald-600 font-headline">{stats.completed}</h3>
                    </div>
                    <Check className="h-8 w-8 text-emerald-200" />
                </div>
            </CardContent>
        </Card>
      </div>

       <div className="space-y-4">
         <h2 className="text-xl font-bold font-headline italic px-1 text-slate-800 tracking-tighter">
             Log de Atividades {sector ? `do Setor ${sector}` : "do Projeto"}
         </h2>
         <div className="grid gap-4">
             {filteredTasks.sort((a, b) => b.id.localeCompare(a.id)).map((task) => (
                <Card key={task.id} className={cn(
                    "group transition-all hover:ring-1 hover:ring-primary/20",
                    task.approvalStatus === 'aprovada' ? "opacity-60 grayscale-[0.3]" : ""
                )}>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="text-[9px] font-black uppercase border-slate-200">
                                        ID {task.id}
                                    </Badge>
                                    <Badge className={cn(
                                        "text-[9px] font-black uppercase",
                                        task.category === 'comunicacao' ? "bg-purple-100 text-purple-700 hover:bg-purple-100" : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                                    )}>
                                        {task.category === 'comunicacao' ? "ASCOM" : "GERAL"}
                                    </Badge>
                                    {task.approvalStatus === 'aprovada' && (
                                        <Badge className="bg-emerald-100 text-emerald-700 border-none flex items-center gap-1 text-[9px] font-black">
                                            <Check className="h-3 w-3" /> APROVADO
                                        </Badge>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg font-headline italic uppercase text-slate-800 leading-tight">
                                    {task.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-1 italic">{task.description}</p>
                                
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                    <div className="flex items-center gap-1.5 border-r pr-4 border-slate-100">
                                        <UserIcon className="h-3 w-3" /> {task.assignedToName}
                                    </div>
                                    <div className="flex items-center gap-1.5 border-r pr-4 border-slate-100">
                                        <Clock className="h-3 w-3" /> Prazo: {new Date(task.deadline).toLocaleDateString()}
                                    </div>
                                    {task.socialMediaPlatform && (
                                        <div className="flex items-center gap-1.5 text-purple-500 border-r pr-4 border-slate-100">
                                            {getPlatformIcon(task.socialMediaPlatform)} {task.socialMediaPlatform}
                                        </div>
                                    )}
                                    {task.isPublishedOnSite && (
                                        <div className="flex items-center gap-1.5 text-emerald-500">
                                            <Layout className="h-3 w-3" /> PUBLICADO NO SITE
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col items-center justify-end gap-3 min-w-[200px]">
                                {task.mediaUrl && (
                                    <Button variant="outline" size="sm" asChild className="rounded-full text-[10px] font-black h-8 bg-slate-50 border-none group-hover:bg-primary group-hover:text-white transition-colors w-full md:w-auto">
                                        <a href={task.mediaUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-3 w-3 mr-2" /> VER CONTEÚDO
                                        </a>
                                    </Button>
                                )}

                                {task.status === 'concluida' && task.approvalStatus === 'pendente' && (
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Button 
                                            size="sm" 
                                            className="rounded-full flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-8 text-[10px] px-4"
                                            onClick={() => handleApprove(task.id, 'aprovada')}
                                        >
                                            <CheckCircle2 className="h-3 w-3 mr-1" /> APROVAR
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="destructive"
                                            className="rounded-full flex-1 font-bold h-8 text-[10px] px-4"
                                            onClick={() => handleApprove(task.id, 'rejeitada')}
                                        >
                                            <XCircle className="h-3 w-3 mr-1" /> REJEITAR
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
