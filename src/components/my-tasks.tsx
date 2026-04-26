import { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { ProjectTask } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Clock, 
    CheckCircle2, 
    Circle, 
    Calendar,
    User,
    AlertCircle,
    MoreHorizontal,
    Loader2,
    ExternalLink,
    Instagram,
    Youtube,
    MessageSquare,
    Layout,
    Check,
    XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function MyTasks({ title = "Fluxo de Atividades" }: { title?: string }) {
    const [tasks, setTasks] = useState<ProjectTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
    const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const currentUser = dataService.getCurrentUser();

    useEffect(() => {
        // 🔄 LISTENER EM TEMPO REAL — recebe tarefas atribuídas automaticamente
        const unsubscribe = dataService.subscribeToTasks((allTasks) => {
            setTasks(allTasks);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleCompleteTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedTask) return;
        
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        
        try {
            await dataService.completarTarefa(selectedTask.id, {
                report: formData.get("report") as string,
                mediaUrl: formData.get("mediaUrl") as string,
                socialMediaPlatform: formData.get("platform") as any,
                isPublishedOnSite: formData.get("isPublishedOnSite") === "on",
            });
            // Tarefas se atualizam automaticamente via subscribeToTasks()
            setIsCompleteDialogOpen(false);
        } catch (error) {
            toast({ variant: "destructive", title: "Erro ao concluir tarefa" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        { id: 'pendente', label: 'Pendentes', icon: Circle, color: 'text-amber-500', bg: 'bg-amber-50/50' },
        { id: 'em_progresso', label: 'Em Andamento', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50/50' },
        { id: 'concluida', label: 'Concluído', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50/50' }
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Carregando quadro de atividades...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black tracking-tight uppercase italic text-primary/80">{title}</h2>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Acompanhamento em tempo real</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4 custom-scrollbar">
                {columns.map((column) => {
                    const columnTasks = tasks.filter(t => t.status === column.id);
                    
                    return (
                        <div key={column.id} className={cn(
                            "flex flex-col min-w-[300px] rounded-2xl border border-dashed border-slate-200 p-4 transition-colors",
                            column.bg
                        )}>
                            <div className="flex items-center justify-between mb-4 px-1">
                                <div className="flex items-center gap-2">
                                    <column.icon className={cn("h-4 w-4", column.color)} />
                                    <span className="font-black text-[11px] uppercase tracking-wider text-slate-600">
                                        {column.label}
                                    </span>
                                    <Badge variant="secondary" className="h-4 px-1.5 text-[9px] font-bold rounded-md bg-white border border-slate-100 italic transition-transform hover:scale-110">
                                        {columnTasks.length}
                                    </Badge>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <MoreHorizontal className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="flex-1 space-y-3 min-h-[200px]">
                                {columnTasks.map((task) => (
                                    <Card 
                                        key={task.id} 
                                        className={cn(
                                            "group border-none shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1 bg-white ring-1 ring-slate-100 overflow-hidden",
                                            task.status !== 'concluida' ? "cursor-pointer" : "cursor-default"
                                        )}
                                        onClick={() => {
                                            if (task.status !== 'concluida') {
                                                setSelectedTask(task);
                                                setIsCompleteDialogOpen(true);
                                            }
                                        }}
                                    >
                                        <CardContent className="p-4 space-y-4">
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="font-bold text-sm leading-tight text-slate-800 group-hover:text-primary transition-colors line-clamp-2 uppercase italic">
                                                    {task.title}
                                                </h4>
                                                {task.category === 'comunicacao' && (
                                                    <Badge className="bg-purple-50 text-purple-600 border-none text-[8px] font-black h-4 px-1 uppercase tracking-tighter">ASCOM</Badge>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase italic">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(task.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 ml-auto">
                                                    <User className="h-3 w-3" />
                                                    <span className="max-w-[80px] truncate uppercase">{task.assignedToName?.split(' ')[0]}</span>
                                                </div>
                                            </div>

                                            {task.status === 'pendente' && (
                                                <div className="pt-2 border-t border-slate-50 flex items-center gap-1 text-[9px] font-black text-amber-600 uppercase tracking-tighter italic">
                                                    <AlertCircle className="h-3 w-3" />
                                                    PENDENTE
                                                </div>
                                            )}

                                            {task.status === 'concluida' && (
                                                <div className="pt-2 border-t border-slate-50 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[9px] font-black text-slate-300 uppercase italic tracking-widest">Status ASCOM</span>
                                                        {task.approvalStatus === 'aprovada' ? (
                                                            <Badge className="bg-emerald-100 text-emerald-700 border-none text-[8px] font-black h-4 px-1 flex gap-1">
                                                                <Check className="h-2 w-2" /> APROVADA
                                                            </Badge>
                                                        ) : task.approvalStatus === 'rejeitada' ? (
                                                            <Badge className="bg-rose-100 text-rose-700 border-none text-[8px] font-black h-4 px-1 flex gap-1">
                                                                <XCircle className="h-2 w-2" /> REJEITADA
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-slate-400 text-[8px] font-black h-4 px-1 uppercase italic border-slate-100">AGUARDANDO</Badge>
                                                        )}
                                                    </div>
                                                    {task.mediaUrl && (
                                                        <div className="flex items-center gap-1 text-[9px] font-bold text-primary italic underline uppercase">
                                                            <ExternalLink className="h-2 w-2" /> Ver Conteúdo
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                                
                                {columnTasks.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-10 opacity-30">
                                        <column.icon className="h-8 w-8 mb-2" />
                                        <span className="text-[10px] font-bold uppercase tracking-tight italic">Nenhuma atividade</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleCompleteTask}>
                        <DialogHeader>
                            <DialogTitle className="font-headline italic text-2xl text-primary uppercase tracking-tighter">Relatório de Conclusão</DialogTitle>
                            <DialogDescription>
                                Detalhe como foi realizada a atividade: <span className="font-bold text-slate-900">"{selectedTask?.title}"</span>
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                            {selectedTask?.category === 'comunicacao' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="platform">Rede Social / Canal</Label>
                                            <select name="platform" defaultValue={selectedTask.socialMediaPlatform} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required>
                                                <option value="instagram">Instagram</option>
                                                <option value="tiktok">TikTok</option>
                                                <option value="youtube">YouTube</option>
                                                <option value="site">Website</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2 pt-6">
                                            <input type="checkbox" id="isPublishedOnSite" name="isPublishedOnSite" className="h-4 w-4 rounded border-gray-300" />
                                            <Label htmlFor="isPublishedOnSite" className="text-[10px] font-black uppercase">Inserido no Site?</Label>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="mediaUrl">Link do Conteúdo (IG/YT/TikTok)</Label>
                                        <Input id="mediaUrl" name="mediaUrl" placeholder="https://..." required />
                                    </div>
                                </>
                            )}
                            
                            <div className="grid gap-2">
                                <Label htmlFor="report">Mensagem Final para a ASCOM</Label>
                                <Textarea id="report" name="report" placeholder="Descreva brevemente o que foi feito..." required />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting} className="w-full rounded-full font-bold">
                                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Finalizar e Enviar para Aprovação"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
