"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  FileText, 
  Link as LinkIcon, 
  User, 
  Clock, 
  ShieldCheck,
  Save,
  Loader2,
  CheckCircle2,
  MessageSquare,
  History,
  Send,
  Info
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ProjectTask } from "@/lib/mock-data";
import { dataService } from "@/lib/data-service";
import { useToast } from "@/hooks/use-toast";

interface TaskDetailsModalProps {
  task: ProjectTask;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export function TaskDetailsModal({ task, isOpen, onClose, onUpdate }: TaskDetailsModalProps) {
  const [deadline, setDeadline] = useState<Date | undefined>(task.deadline ? new Date(task.deadline) : undefined);
  const [conclusionLink, setConclusionLink] = useState(task.conclusionLink || "");
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();

  const session = dataService.obterSessaoAtual();
  const isExtensionCoord = session?.department === 'EXTENSAO' || session?.department === 'CGP';

  const handleDateSelect = (date: Date | undefined) => {
    setDeadline(date);
    setIsCalendarOpen(false);
  };

  const handleAddComment = async (type: 'comment' | 'analysis' = 'comment') => {
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      await dataService.addCommentToTask(task.id, newComment, type);
      setNewComment("");
      toast({
        title: type === 'analysis' ? "✅ Análise Registrada" : "✅ Comentário Enviado",
        description: "O histórico da tarefa foi atualizado."
      });
      if (onUpdate) onUpdate();
    } catch (error: any) {
      toast({
        title: "❌ Erro ao enviar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await dataService.updateTask(task.id, {
        deadline: deadline?.toISOString(),
        conclusionLink: conclusionLink
      });
      
      toast({
        title: "✅ Alterações Salvas",
        description: "As informações da tarefa foram atualizadas com sucesso."
      });
      
      if (onUpdate) onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "❌ Erro ao Salvar",
        description: error.message || "Não foi possível atualizar a tarefa.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluida': return <Badge className="bg-green-100 text-green-700 border-green-200">Concluída</Badge>;
      case 'em_progresso': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Em Progresso</Badge>;
      case 'atrasada': return <Badge className="bg-red-100 text-red-700 border-red-200">Atrasada</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl elevation-24">
        <div className="bg-primary/5 p-6 border-b border-primary/10">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(task.status)}
                  <Badge variant="outline" className="text-[10px] uppercase tracking-widest">{task.priority} Prioridade</Badge>
                </div>
                <DialogTitle className="text-2xl font-black font-headline tracking-tight leading-tight">
                  {task.title}
                </DialogTitle>
                <DialogDescription className="text-xs font-bold uppercase tracking-widest text-primary/60">
                  ID: {task.publicId || task.id.substring(0, 8)} • {task.sector}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* SEÇÃO: ORIENTAÇÕES */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <FileText className="w-3 h-3 text-primary" />
              Orientação do Atribuidor
            </h3>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative group transition-all hover:border-primary/20">
              <p className="text-sm text-slate-700 leading-relaxed italic">
                "{task.description}"
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                 <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    Atribuído por: <span className="text-primary">{task.assignedByName || "Coordenação Geral"}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Criado em: {task.createdAt ? format(new Date(task.createdAt), "dd/MM/yyyy") : "-"}
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* EDIÇÃO DE PRAZO */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <CalendarIcon className="w-3 h-3 text-primary" />
                Prazo de Execução
              </Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-2xl h-12 border-slate-200 hover:border-primary/50 transition-colors",
                      !deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {deadline ? format(deadline, "PPP", { locale: ptBR }) : <span>Selecione um prazo</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-none" align="start">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={handleDateSelect}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-[9px] text-muted-foreground italic px-2">
                O prazo pode ser renegociado conforme a demanda local.
              </p>
            </div>

            {/* EDIÇÃO DE ENTREGAS (LINK) */}
            <div className="space-y-3">
              <Label htmlFor="delivery" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <LinkIcon className="w-3 h-3 text-primary" />
                Link de Entrega / Drive
              </Label>
              <Input
                id="delivery"
                placeholder="https://drive.google.com/..."
                value={conclusionLink}
                onChange={(e) => setConclusionLink(e.target.value)}
                className="rounded-2xl h-12 border-slate-200 focus-visible:ring-primary/20"
              />
              <p className="text-[9px] text-muted-foreground italic px-2">
                Cole aqui o link do material produzido.
              </p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* SEÇÃO: HISTÓRICO E COMENTÁRIOS */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <History className="w-3 h-3 text-primary" />
              Histórico de Análise e Comentários
            </h3>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {task.history && task.history.length > 0 ? (
                task.history.map((entry, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "p-4 rounded-2xl border text-sm relative transition-all",
                      entry.type === 'analysis' 
                        ? "bg-blue-50/50 border-blue-100 shadow-sm" 
                        : "bg-white border-slate-100"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                        <span className="font-black text-[10px] uppercase tracking-wider text-slate-900 leading-none">
                          {entry.userName}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {entry.timestamp ? format(new Date(entry.timestamp), "HH:mm • dd/MM/yyyy", { locale: ptBR }) : "-"}
                        </span>
                      </div>
                      {entry.type === 'analysis' ? (
                        <Badge className="bg-blue-600 text-[8px] uppercase tracking-[0.15em] font-black py-0.5 px-2">Análise Técnica</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[8px] uppercase tracking-[0.15em] font-black py-0.5 px-2 opacity-50">Comentário</Badge>
                      )}
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {entry.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                   <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-50" />
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-normal">
                      Nenhum comentário ou análise <br /> registrado até o momento.
                   </p>
                </div>
              )}
            </div>

            {/* INPUT DE NOVO COMENTÁRIO */}
            <div className="space-y-3 pt-2">
              <div className="relative group">
                <Textarea 
                  placeholder="Digite sua observação ou análise técnica..."
                  className="rounded-2xl border-slate-200 bg-white min-h-[100px] shadow-inner focus-visible:ring-primary/20 p-4 text-sm font-medium pr-12"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="absolute top-4 right-4 text-slate-300 group-focus-within:text-primary transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  variant="outline"
                  className="flex-1 rounded-xl font-black uppercase tracking-widest text-[9px] h-10"
                  onClick={() => handleAddComment('comment')}
                  disabled={isSubmittingComment || !newComment.trim()}
                >
                  {isSubmittingComment ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Send className="w-3 h-3 mr-2 text-slate-400" />}
                  Enviar Comentário
                </Button>
                
                {isExtensionCoord && (
                  <Button 
                    size="sm"
                    className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 font-black uppercase tracking-widest text-[9px] h-10"
                    onClick={() => handleAddComment('analysis')}
                    disabled={isSubmittingComment || !newComment.trim()}
                  >
                    {isSubmittingComment ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <ShieldCheck className="w-3 h-3 mr-2" />}
                    Registrar Análise Técnica
                  </Button>
                )}
              </div>
              
              {!isExtensionCoord && (
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Info className="w-3 h-3 text-slate-400" />
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none">
                    Análise técnica restrita à Coordenação de Extensão.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="rounded-2xl font-black uppercase tracking-widest text-[10px]"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
