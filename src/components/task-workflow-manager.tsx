"use client";

import React, { useState } from "react";
import { 
  History, 
  FileText, 
  Paperclip, 
  Send, 
  CheckCircle2, 
  Clock, 
  User, 
  X,
  Check,
  FilePlus,
  Lock,
  Link as LinkIcon,
  Image as ImageIcon,
  AlertCircle,
  ShieldAlert,
  Save,
  FileDown,
  ChevronRight,
  MessageSquare,
  Activity,
  Unlock,
  Hammer,
  ArrowRightLeft,
  BookOpen,
  Handshake
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/components/ui/select";
import { ProjectTask, Department } from "@/lib/mock-data";
import { dataService, LogAuditoria, ExceptionRequest } from "@/lib/data-service";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import { TerritorialClosureForm } from "./territorial-closure-form";

interface TaskWorkflowManagerProps {
  task: ProjectTask;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdated: () => void;
}

export function TaskWorkflowManager({ task, open, onOpenChange, onTaskUpdated }: TaskWorkflowManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProjectTask>>({ ...task });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingAttachment, setIsAddingAttachment] = useState(false);
  const [newAttachment, setNewAttachment] = useState({ name: "", url: "", type: 'link' as 'link' | 'imagem' | 'pdf' });
  const [conclusionLink, setConclusionLink] = useState(task.conclusionLink || "");
  
  // Trâmites States
  const [isForwarding, setIsForwarding] = useState(false);
  const [forwardSector, setForwardSector] = useState<Department | "">("");
  const [forwardComment, setForwardComment] = useState("");
  const [isReceiving, setIsReceiving] = useState(false);
  
  const [isConfirmingPassword, setIsConfirmingPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingAction, setPendingAction] = useState<'concluir' | 'encaminhar' | 'receber' | null>(null);
  const [territorialErrors, setTerritorialErrors] = useState<string[]>([]);
  const [scientificErrors, setScientificErrors] = useState<string[]>([]);
  const [partnershipErrors, setPartnershipErrors] = useState<string[]>([]);
  
  const currentUser = dataService.getCurrentUser();
  const rawRole = dataService.getUserRole() || 'ESPECTADOR';
  const role = typeof rawRole === 'string' ? rawRole.toUpperCase() : 'ESPECTADOR';
  
  // Governance Logic
  const isFrozen = task.isFlowFrozen;
  const isGlobalCoordinator = role === 'ADMIN' || role === 'COORDENADOR_GERAL' || role === 'admin' || role === 'coordinator';
  const isTargetSector = currentUser?.department === task.sector;
  const isSectorEditor = isTargetSector && (role === 'COLABORADOR' || role === 'COORDENADOR' || role === 'member_editor');
  const canModify = (isGlobalCoordinator || isSectorEditor || dataService.isBypass()) && !isFrozen;
  const isLocked = (task.status === 'aguardando_recebimento' && !isGlobalCoordinator && !isTargetSector) || isFrozen;
  
  // High-Performance Blocking Logic
  const overdueTasks = dataService.getOverdueTasks(currentUser?.id || undefined);
  const hasOverduePending = overdueTasks.length > 0;
  const isThisTaskOverdue = overdueTasks.some(ot => ot.id === task.id);
  
  // Bloqueio seletivo: Se houver atrasadas, só permite agir na própria atrasada
  const isBlockedByOtherOverdue = (hasOverduePending && !isThisTaskOverdue && !isGlobalCoordinator) || isFrozen;

  const hasSkipEvidenceException = dataService.hasApprovedException(task.id, 'SKIP_EVIDENCE');
  const hasForceCloseException = dataService.hasApprovedException(task.id, 'FORCE_CLOSE');

  const isConcludable = (hasSkipEvidenceException || hasForceCloseException) || (
    task.sectorId === 'social' 
      ? (formData.attachments?.length || 0) > 0 
      : task.sectorId === 'curadoria'
        ? formData.evidenceConfirmed && !!conclusionLink
        : task.sectorId === 'redes'
          ? !!formData.partnerName && !!formData.partnershipStage && (['prospecção', 'validação', 'negociação'].includes(formData.partnershipStage) || (formData.attachments?.length || 0) > 0)
          : !!conclusionLink
  );

  const [isRequestingException, setIsRequestingException] = useState(false);
  const [exceptionJustification, setExceptionJustification] = useState('');
  const [exceptionType, setExceptionType] = useState<ExceptionRequest['type']>('SKIP_EVIDENCE');

  const handleRequestException = async () => {
    if (!exceptionJustification) return;
    await dataService.requestException(task.id, exceptionType, exceptionJustification);
    setIsRequestingException(false);
    setExceptionJustification('');
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      await dataService.fullUpdateTask(task.id, formData);
      toast({ title: "Rascunho Salvo", description: "Dados atualizados com sucesso." });
      onTaskUpdated();
      setIsEditing(false);
    } catch (error) {
       toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
       setIsSubmitting(false);
    }
  };

  const handleUnfreeze = async () => {
    setIsSubmitting(true);
    try {
       await dataService.fullUpdateTask(task.id, { isFlowFrozen: false });
       toast({ title: "Fluxo Desbloqueado", description: "O processo foi liberado para execução." });
       onTaskUpdated();
    } catch (e) {
       toast({ title: "Erro ao desbloquear", variant: "destructive" });
    } finally {
       setIsSubmitting(false);
    }
  };

  const handleActionClick = (action: 'concluir' | 'encaminhar' | 'receber') => {
    if (isBlockedByOtherOverdue) {
        toast({ 
            title: "Ação Bloqueada", 
            description: "Resolva suas tarefas atrasadas antes de prosseguir com novos fluxos.",
            variant: "destructive"
        });
        return;
    }

    if (action === 'concluir' && task.sectorId === 'social') {
        const validation = dataService.validateTerritorialClosure({ ...task, ...formData } as any);
        if (!validation.isValid && !hasSkipEvidenceException && !hasForceCloseException) {
            setTerritorialErrors(validation.errors);
            toast({ 
                title: "Pendência Territorial", 
                description: "Preencha todos os campos obrigatórios e anexe evidência.",
                variant: "destructive"
            });
            return;
        }
    }

    if (action === 'concluir' && task.sectorId === 'curadoria') {
        const validation = dataService.validateScientificClosure({ ...task, ...formData } as any);
        if (!validation.isValid && !hasSkipEvidenceException && !hasForceCloseException) {
            setScientificErrors(validation.errors);
            toast({ 
                title: "Pendência Científica", 
                description: "O produto requer validação de curadoria e fundamentação completa.",
                variant: "destructive"
            });
            return;
        }
    }

    if (action === 'concluir' && task.sectorId === 'redes') {
        const validation = dataService.validatePartnershipClosure({ ...task, ...formData } as any);
        if (!validation.isValid) {
            setPartnershipErrors(validation.errors);
            toast({ 
                title: "Pendência Institucional", 
                description: "Preencha os dados do parceiro e anexe a documentação necessária.",
                variant: "destructive"
            });
            return;
        }
    }

    setPendingAction(action);
    setIsConfirmingPassword(true);
  };

  const processAssignedAction = async () => {
    setIsVerifying(true);
    try {
      if (pendingAction === 'concluir') {
        if (task.identifier && conclusionLink) {
          await dataService.fullUpdateTask(task.id, { ...formData, conclusionLink });
        }
        await dataService.movimentarTarefa(task.id, 'concluida', 'Ação CONCLUÍDA e REGISTRADA com assinatura digital.');
        toast({ title: "Ação Concluída", description: "O registro foi assinado e publicado." });
      } else if (pendingAction === 'encaminhar') {
        if (!forwardSector) throw new Error("Selecione um setor de destino.");
        await dataService.encaminharTarefa(task.id, forwardSector, forwardComment, password);
        setIsForwarding(false);
      } else if (pendingAction === 'receber') {
        await dataService.receberTarefa(task.id, password);
      }

      onTaskUpdated();
      setIsConfirmingPassword(false);
      setPassword("");
      setPendingAction(null);
      if (pendingAction !== 'encaminhar') onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    pendente: { label: "Pendente", color: "bg-slate-100 text-slate-600" },
    pendente_aceite: { label: "Aguardando Aceite", color: "bg-amber-100 text-amber-600" },
    aceito: { label: "Em Execução", color: "bg-blue-100 text-blue-600" },
    aguardando_recebimento: { label: "Em Trânsito / Aguardando", color: "bg-orange-100 text-orange-600" },
    concluida: { label: "Finalizado / Assinado", color: "bg-emerald-100 text-emerald-600" },
    bloqueado: { label: "Bloqueado / Ajuste", color: "bg-amber-100 text-amber-600" },
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
        <div className="flex h-[90vh]">
          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <DialogHeader className="p-8 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <FileText size={24} />
                  </div>
                  <div className="space-y-1">
                    <DialogTitle className="text-xl font-headline uppercase italic tracking-tighter">
                      {isEditing ? (
                         <Input 
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="h-8 font-headline uppercase italic tracking-tighter border-none p-0 focus-visible:ring-0"
                         />
                      ) : task.title}
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                       <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-white border-slate-200 text-slate-400 font-mono">
                         {task.identifier || task.id}
                       </Badge>
                       <Badge className={cn("text-[8px] font-black uppercase tracking-widest border-none", statusMap[task.status]?.color)}>
                         {statusMap[task.status]?.label || task.status}
                       </Badge>
                    </div>
                  </div>
                </div>
                
                {isGlobalCoordinator && !isLocked && (
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsEditing(!isEditing)}
                      className="rounded-full text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5"
                    >
                      {isEditing ? "Cancelar" : "Editar"}
                    </Button>
                )}
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1">
               <div className="p-8 space-y-8">
                  {isFrozen && (
                    <div className="p-6 rounded-[2rem] bg-amber-50 border border-amber-100 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center shadow-lg",
                            isGlobalCoordinator ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-600"
                        )}>
                           <Lock size={20} />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-amber-800 leading-none">
                              {isGlobalCoordinator ? "⚠️ Ação de Governança Necessária" : "Fluxo de Trabalho Congelado"}
                           </p>
                           <p className="text-xs font-medium text-amber-600 italic">
                             {task.flowAdjustmentNotes ? `Aguardando: "${task.flowAdjustmentNotes}"` : 'Aguardando aprovação ou ajuste da coordenação.'}
                           </p>
                        </div>
                      </div>
                      {isGlobalCoordinator && (
                         <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handleUnfreeze}
                            className="bg-white border-amber-200 text-amber-700 font-black uppercase italic tracking-widest text-[10px] rounded-xl hover:bg-amber-100 shadow-sm"
                         >
                            <Unlock size={14} className="mr-2" /> Desbloquear Agora
                         </Button>
                      )}
                    </div>
                  )}

                  {isLocked && !isFrozen && (
                     <div className="p-6 rounded-[2rem] bg-orange-50 border border-orange-100 flex items-center gap-4 animate-pulse">
                        <ArrowRightLeft className="text-orange-500" />
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 leading-none">Processo em Trânsito</p>
                           <p className="text-xs font-medium text-orange-500 italic">Esta demanda está aguardando o recebimento oficial pelo setor {task.sector}. Edições bloqueadas.</p>
                        </div>
                     </div>
                  )}

                  {/* ALERTA CRÍTICO ESCALONADO (Bloqueio Híbrido) */}
                  {hasOverduePending && (
                      <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={cn(
                              "p-6 rounded-[2rem] border flex flex-col gap-3 transition-all shadow-sm",
                              isThisTaskOverdue 
                                ? "bg-red-50 border-red-200" 
                                : "bg-amber-50 border-amber-200"
                          )}
                      >
                          <div className="flex items-center gap-4">
                              <div className={cn(
                                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                  isThisTaskOverdue ? "bg-red-500 text-white shadow-lg shadow-red-200" : "bg-amber-500 text-white shadow-lg shadow-amber-200"
                               )}>
                                  <ShieldAlert className={cn(
                                      "w-6 h-6",
                                      isThisTaskOverdue && "animate-bounce"
                                  )} />
                              </div>
                              <div className="space-y-1">
                                  <p className={cn(
                                      "text-[10px] font-black uppercase tracking-[0.2em]",
                                      isThisTaskOverdue ? "text-red-700" : "text-amber-700"
                                  )}>
                                      {isThisTaskOverdue ? "🚨 EMERGÊNCIA OPERACIONAL" : "⚠️ FLUXO RESTRITO"}
                                  </p>
                                  <p className="text-xs font-bold text-slate-600 italic leading-tight">
                                      {isThisTaskOverdue 
                                          ? `Esta tarefa está ${dataService.getOverdueDifference(task.deadline).label}. Resolva-a imediatamente para desbloquear o restante do seu fluxo.`
                                          : `Você possui ${overdueTasks.length} tarefas atrasadas. O avanço desta demanda está BLOQUEADO até que as críticas sejam resolvidas.`
                                      }
                                  </p>
                              </div>
                          </div>
                          {isBlockedByOtherOverdue && (
                              <Button asChild variant="outline" size="sm" className="w-full rounded-xl border-amber-200 text-amber-700 bg-white hover:bg-amber-50 text-[9px] font-black uppercase tracking-widest mt-2">
                                  <Link href={`/gerenciar/tarefas?taskId=${overdueTasks[0].id}`}>
                                      Ir para tarefa crítica (Atrasada há {dataService.getOverdueDifference(overdueTasks[0].deadline).days} dias)
                                      <ChevronRight className="w-3 h-3 ml-2" />
                                  </Link>
                              </Button>
                          )}
                      </motion.div>
                  )}

                  {/* Task Info Cards */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-slate-400">
                           <User size={18} />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Responsável</span>
                           <span className="text-xs font-bold text-slate-800 uppercase italic">{task.assignedToName}</span>
                        </div>
                     </div>
                     <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-slate-400">
                           <Clock size={18} />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Prazo Final</span>
                           <span className="text-xs font-bold text-slate-800 uppercase italic">
                              {task.deadline ? format(new Date(task.deadline), "dd/MM/yyyy") : 'S/P'}
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Description Section */}
                  <div className="space-y-3">
                     <div className="flex items-center gap-2 text-slate-400 ml-1">
                        <AlertCircle size={14} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest italic">Descrição da Demanda</h4>
                     </div>
                     {isEditing ? (
                        <Textarea 
                           value={formData.description}
                           onChange={(e) => setFormData({...formData, description: e.target.value})}
                           className="min-h-[120px] rounded-3xl border-slate-100 bg-slate-50 font-medium"
                        />
                      ) : (
                        <div className="p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 text-sm font-medium text-slate-600 leading-relaxed italic">
                           {task.description}
                        </div>
                      )}
                  </div>

                  {/* Forwarding Section */}
                  {!isLocked && task.status !== 'concluida' && canModify && (
                     <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between ml-1">
                           <div className="flex items-center gap-2 text-slate-400">
                              <ArrowRightLeft size={14} />
                              <h4 className="text-[10px] font-black uppercase tracking-widest italic">Tramitação Setorial</h4>
                           </div>
                           {!isForwarding && (
                               <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 onClick={() => setIsForwarding(true)}
                                 className="h-7 text-[9px] font-black uppercase tracking-widest text-primary"
                                 disabled={isBlockedByOtherOverdue}
                               >
                                  {isBlockedByOtherOverdue ? "Tramite Bloqueado" : "Encaminhar Demanda"}
                               </Button>
                           )}
                        </div>

                        {isForwarding && (
                           <div className="p-8 rounded-[2.5rem] bg-indigo-50/50 border-2 border-indigo-100 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                              <div className="flex justify-between items-center">
                                 <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 italic">Novo Despacho de Encaminhamento</h5>
                                 <Button variant="ghost" size="icon" className="h-6 w-6 text-indigo-400" onClick={() => setIsForwarding(false)}>
                                    <X size={14} />
                                 </Button>
                              </div>

                              <div className="grid gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-indigo-400 ml-1">Setor de Destino</label>
                                    <select 
                                        className="w-full h-12 rounded-2xl bg-white border border-indigo-100 font-bold text-xs px-4"
                                        value={forwardSector} 
                                        onChange={(e) => setForwardSector(e.target.value as any)}
                                     >
                                        <option value="">Selecione o setor de destino...</option>
                                        <option value="ASCOM">ASCOM (Comunicação)</option>
                                        <option value="ACESSIBILIDADE">Acessibilidade / Libras</option>
                                        <option value="COORD_GERAL">Coordenação Geral</option>
                                        <option value="COORD_TECNICO">Coordenação Técnica</option>
                                     </select>
                                 </div>

                                 <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-indigo-400 ml-1">Despacho / Instruções</label>
                                    <Textarea 
                                       placeholder="Descreva as instruções para o próximo setor..."
                                       className="rounded-2xl bg-white border-indigo-100 font-medium text-xs min-h-[100px]"
                                       value={forwardComment}
                                       onChange={(e) => setForwardComment(e.target.value)}
                                    />
                                 </div>

                                 <Button 
                                    onClick={() => handleActionClick('encaminhar')} 
                                    className="w-full h-14 rounded-3xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase italic tracking-widest text-[11px] shadow-lg shadow-indigo-200"
                                    disabled={!forwardSector || !forwardComment || isBlockedByOtherOverdue}
                                 >
                                    Assinar e Encaminhar
                                 </Button>
                              </div>
                           </div>
                        )}
                     </div>
                  )}

                  {/* Final Actions */}
                    <div className="pt-8 border-t border-slate-50 space-y-4">
                     {task.status === 'aguardando_recebimento' && (isSectorEditor || isGlobalCoordinator) ? (
                        <div className="p-8 rounded-[2.5rem] bg-primary/5 border-2 border-primary/20 space-y-6 text-center">
                           <div className="space-y-2">
                              <h4 className="text-sm font-black uppercase italic text-primary">Demanda Recebida via Trâmite</h4>
                              <p className="text-xs font-medium text-slate-500 italic">Sua confirmação é necessária para assumir o processo e liberar as edições no seu setor.</p>
                           </div>
                           <Button 
                               className="w-full h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black uppercase italic tracking-widest text-[12px] shadow-2xl shadow-primary/30 gap-4"
                               onClick={() => handleActionClick('receber')}
                               disabled={isBlockedByOtherOverdue}
                            >
                               <ShieldAlert size={24} /> {isBlockedByOtherOverdue ? "Fluxo Travado" : "Assinar e Receber Processo"}
                           </Button>
                        </div>
                     ) : (task.status === 'aceito' || task.status === 'pendente') && !isLocked && canModify ? (
                        <div className="space-y-6">
                           <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 space-y-4">
                              <div className="flex items-center gap-3">
                                 <div className="h-8 w-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                    <LinkIcon size={14} />
                                 </div>
                                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary italic">Link da Ação Finalizada</h4>
                              </div>
                              <Input 
                                 placeholder="Cole aqui o link institucional do resultado final..."
                                 className="rounded-2xl border-primary/20 bg-white font-bold h-12 text-xs"
                                 value={conclusionLink}
                                 onChange={(e) => setConclusionLink(e.target.value)}
                              />
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <Button 
                                variant="outline"
                                onClick={handleUpdate}
                                disabled={isSubmitting}
                                className="h-14 rounded-3xl font-black uppercase tracking-widest text-[10px]"
                              >
                                 <Save size={18} className="mr-3" /> Salvar Rascunho
                              </Button>
                               
                               {task.sectorId === 'social' && (
                                  <div className="col-span-2">
                                     <TerritorialClosureForm 
                                        data={formData} 
                                        onChange={(newData) => {
                                            setFormData(newData);
                                            setTerritorialErrors([]);
                                        }}
                                        errors={territorialErrors}
                                     />
                                  </div>
                               )}

                               {task.sectorId === 'curadoria' && (
                                  <div className="col-span-2 p-6 rounded-[2rem] bg-indigo-50/30 border border-indigo-100 space-y-4">
                                     <div className="flex items-center gap-3 text-indigo-600">
                                        <BookOpen size={18} />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest italic">Checklist de Rigor Científico</h4>
                                     </div>
                                     
                                     <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-indigo-100 shadow-sm">
                                           <div className="space-y-1">
                                              <p className="text-[10px] font-bold text-slate-800 uppercase">Validação de Curadoria</p>
                                              <p className="text-[9px] text-slate-400 italic font-medium">O produto técnico foi revisado por um par?</p>
                                           </div>
                                           <Button 
                                             type="button"
                                             variant={formData.evidenceConfirmed ? "default" : "outline"}
                                             size="sm"
                                             className={cn("rounded-full h-8 text-[9px] uppercase font-black", formData.evidenceConfirmed && "bg-emerald-600 hover:bg-emerald-700")}
                                             onClick={() => setFormData({...formData, evidenceConfirmed: !formData.evidenceConfirmed})}
                                           >
                                              {formData.evidenceConfirmed ? "VALIDADO" : "PENDENTE"}
                                           </Button>
                                        </div>

                                        {scientificErrors.length > 0 && (
                                           <div className="p-4 rounded-2xl bg-red-50 border border-red-100 space-y-2">
                                              {scientificErrors.map((err, i) => (
                                                 <div key={i} className="flex items-center gap-2 text-red-600">
                                                    <AlertCircle size={10} />
                                                    <span className="text-[9px] font-bold uppercase">{err}</span>
                                                 </div>
                                              ))}
                                           </div>
                                        )}
                                     </div>
                                  </div>
                               )}

                               {task.sectorId === 'redes' && (
                                  <div className="col-span-2 p-6 rounded-[2rem] bg-cyan-50/30 border border-cyan-100 space-y-6">
                                     <div className="flex items-center gap-3 text-cyan-600">
                                        <Handshake size={18} />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest italic">Formalização e Redes</h4>
                                     </div>
                                     
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instituição Parceira</label>
                                           <input 
                                              className="w-full bg-white border border-slate-100 rounded-xl p-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                              placeholder="Ex: Prefeitura de..., ONG..., Empresa..."
                                              value={formData.partnerName || ''}
                                              onChange={(e) => setFormData({...formData, partnerName: e.target.value})}
                                           />
                                        </div>
                                        
                                        <div className="space-y-2">
                                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estágio Atual</label>
                                           <select 
                                              className="w-full bg-white border border-slate-100 rounded-xl p-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                              value={formData.partnershipStage || ''}
                                              onChange={(e) => setFormData({...formData, partnershipStage: e.target.value as any})}
                                           >
                                              <option value="">Selecione...</option>
                                              <option value="prospecção">Prospecção</option>
                                              <option value="validação">Validação</option>
                                              <option value="negociação">Negociação</option>
                                              <option value="formalização">Formalização</option>
                                              <option value="execução">Execução</option>
                                              <option value="avaliação">Avaliação</option>
                                           </select>
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Área de Impacto / Território</label>
                                           <input 
                                              className="w-full bg-white border border-slate-100 rounded-xl p-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                              placeholder="Ex: Municípios do Cariri, Solânea, Geral..."
                                              value={formData.territorialImpactArea || ''}
                                              onChange={(e) => setFormData({...formData, territorialImpactArea: e.target.value})}
                                           />
                                        </div>
                                     </div>

                                     {partnershipErrors.length > 0 && (
                                        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 space-y-2">
                                           {partnershipErrors.map((err, i) => (
                                              <div key={i} className="flex items-center gap-2 text-red-600">
                                                 <AlertCircle size={10} />
                                                 <span className="text-[9px] font-bold uppercase">{err}</span>
                                              </div>
                                           ))}
                                        </div>
                                     )}
                                  </div>
                               )}

                               {/* Interface de Solicitação de Exceção */}
                               {(territorialErrors.length > 0 || scientificErrors.length > 0 || partnershipErrors.length > 0) && (
                                  <div className="col-span-2 p-6 rounded-[2rem] bg-orange-50/50 border border-orange-200 space-y-4">
                                     <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                           <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                                              <Lock size={14} />
                                           </div>
                                           <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-600">Bloqueio de Governança</h4>
                                        </div>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          onClick={() => setIsRequestingException(!isRequestingException)}
                                          className="text-[9px] font-black uppercase tracking-widest text-primary underline"
                                        >
                                           {isRequestingException ? "Cancelar Solicitação" : "Solicitar Exceção Técnica"}
                                        </Button>
                                     </div>
                                     
                                     {isRequestingException && (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                           <Textarea 
                                              placeholder="Descreva a justificativa para a exceção (será analisada pela coordenação)..."
                                              className="bg-white border-orange-200 rounded-2xl text-[11px] font-medium min-h-[80px]"
                                              value={exceptionJustification}
                                              onChange={(e) => setExceptionJustification(e.target.value)}
                                           />
                                           <Button 
                                             onClick={handleRequestException}
                                             disabled={!exceptionJustification}
                                             className="w-full h-10 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-[9px]"
                                           >
                                              Enviar para Análise da Coordenação
                                           </Button>
                                        </div>
                                     )}
                                  </div>
                               )}

                               <Button 
                                  disabled={isBlockedByOtherOverdue || ((task.sectorId === 'social' || task.sectorId === 'curadoria' || task.sectorId === 'redes') && !isConcludable)}
                                 onClick={() => handleActionClick('concluir')}
                                 className="h-14 rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase italic tracking-widest text-[11px] shadow-xl shadow-emerald-200"
                              >
                                 {isBlockedByOtherOverdue ? "Fluxo Travado" : "Finalizar com Assinatura"} <Check size={18} className="ml-3" />
                               </Button>
                           </div>
                        </div>
                     ) : null}
                  </div>
               </div>
            </ScrollArea>
          </div>

          {/* Sidebar: Fluxo e Trâmites */}
          <div className="w-96 bg-slate-50 border-l border-slate-100 flex flex-col h-full overflow-hidden">
             
             {/* Seção de Fluxo Semiautomático */}
             {task.flowId && (
                <div className="p-8 border-b border-slate-200 bg-white/30">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                         <Activity size={18} />
                      </div>
                      <div className="space-y-0.5">
                         <h4 className="text-sm font-black italic uppercase tracking-tighter text-slate-800">Etapas do Fluxo</h4>
                         <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Progresso Semiautomático</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      {dataService.getWorkflowSteps(task.flowId).map((fStep, idx) => {
                         const isCurrent = task.currentStepId === fStep.id;
                         const steps = dataService.getWorkflowSteps(task.flowId!);
                         const currentIndex = steps.findIndex(s => s.id === task.currentStepId);
                         const isPast = idx < currentIndex;

                         return (
                            <div key={fStep.id} className="flex items-start gap-3">
                               <div className={cn(
                                  "h-5 w-5 rounded-full flex items-center justify-center mt-0.5 shrink-0",
                                  isPast ? "bg-emerald-500 text-white" : 
                                  isCurrent ? "bg-primary text-white ring-4 ring-primary/20" : 
                                  "bg-slate-200 text-slate-400"
                               )}>
                                  {isPast ? <Check size={12} /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                               </div>
                               <div className="space-y-0.5">
                                  <p className={cn(
                                     "text-[10px] font-black uppercase tracking-tight",
                                     isCurrent ? "text-primary" : isPast ? "text-emerald-600" : "text-slate-400"
                                  )}>
                                     {fStep.name}
                                  </p>
                                  {isCurrent && (
                                     <Badge variant="outline" className="text-[8px] h-4 font-black bg-primary/5 text-primary border-primary/20 uppercase tracking-widest italic">Etapa Atual</Badge>
                                  )}
                               </div>
                            </div>
                         );
                      })}
                   </div>

                   {isGlobalCoordinator && (
                      <Button 
                         variant="ghost" 
                         className="w-full mt-6 h-10 border border-dashed border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:border-primary/50"
                      >
                         <Hammer size={14} className="mr-2" /> Ajustar Fluxo Manualmente
                      </Button>
                   )}
                </div>
             )}

             <div className="p-8 pb-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                   <History className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                   <h4 className="text-xl font-headline italic uppercase tracking-tighter text-slate-800">Trâmites</h4>
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Rastreabilidade institucional</p>
                </div>
             </div>

             <ScrollArea className="flex-1 px-8 py-6">
                <div className="relative space-y-12">
                   {/* Vertical Line */}
                   <div className="absolute left-[7px] top-6 bottom-6 w-[2px] bg-slate-200" />

                   {task.history && task.history.slice().reverse().map((h, i) => (
                      <div key={i} className="relative pl-10 space-y-3">
                         {/* Circle Indicator */}
                         <div className={cn(
                            "absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-white shadow-sm ring-4 ring-slate-50 transition-all",
                            h.action.includes('EXECUTIVA') ? "bg-rose-500 ring-rose-100" :
                            h.action.includes('RECEBIMENTO') ? "bg-blue-500" :
                            h.action.includes('ENCAMINHAMENTO') ? "bg-orange-500" : 
                            h.status === 'concluida' ? "bg-emerald-500" : "bg-primary"
                         )} />

                         <div className="space-y-2">
                            <div className="flex items-center gap-2">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                  {h.timestamp ? format(new Date(h.timestamp), "dd/MM HH:mm", { locale: ptBR }) : '...'}
                               </p>
                               {h.sectorSigla && (
                                  <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter h-4 bg-slate-100 border-none text-slate-500">{h.sectorSigla}</Badge>
                               )}
                            </div>
                            
                            <div className="space-y-1">
                               <p className="text-[11px] font-black text-slate-800 uppercase italic leading-tight tracking-tight">
                                  {h.action}
                               </p>
                               <p className="text-[9px] font-bold text-slate-400 italic">{h.userName}</p>
                               {h.comment && (
                                  <div className="flex gap-2 p-3 bg-white/80 border border-slate-100 rounded-2xl mt-2 max-w-[240px] shadow-sm">
                                     <MessageSquare size={12} className="text-slate-300 shrink-0 mt-0.5" />
                                     <p className="text-[10px] font-medium text-slate-500 italic leading-snug">
                                        {h.comment}
                                     </p>
                                  </div>
                                )}
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </ScrollArea>
             
             <div className="p-8 border-t border-slate-100 bg-white/50 space-y-4">
                <div className="flex items-center gap-3 text-emerald-600">
                   <ShieldAlert size={18} />
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest leading-none italic">Assinatura Digital Ativa</span>
                      <span className="text-[8px] font-bold text-slate-400 tracking-wider">Imutabilidade garantida por sistema</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Universal Confirmation Password Modal */}
    <Dialog open={isConfirmingPassword} onOpenChange={setIsConfirmingPassword}>
       <DialogContent className="sm:max-w-[440px] rounded-[3rem] p-0 overflow-hidden border-none shadow-3xl">
          <DialogHeader className="p-10 bg-slate-900 text-white border-none text-center">
             <div className="flex flex-col items-center gap-6">
                <div className="h-20 w-20 rounded-[2rem] bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-2xl">
                   <Lock size={40} />
                </div>
                <div className="space-y-2">
                   <DialogTitle className="text-2xl font-headline uppercase italic tracking-tighter">Assinatura Eletrônica</DialogTitle>
                   <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Autenticação obrigatória para trâmite</DialogDescription>
                </div>
             </div>
          </DialogHeader>

          <div className="p-12 space-y-8 bg-white">
             <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic text-center">
                   {pendingAction === 'concluir' ? "Ao finalizar, esta ação será publicada permanentemente no Registro Público de Transparência." :
                    pendingAction === 'encaminhar' ? `Você está enviando este processo formalmente para o setor ${forwardSector}.` :
                    "Você está assumindo a responsabilidade oficial por este processo em seu setor."}
                </p>
             </div>

             <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Senha Pessoal</label>
                </div>
                <Input 
                   type="password" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••"
                   className="h-16 rounded-[1.5rem] border-slate-100 bg-slate-50 font-black text-center text-xl tracking-[0.5em] focus:bg-white transition-all shadow-inner"
                   onKeyDown={(e) => e.key === 'Enter' && processAssignedAction()}
                />
             </div>
          </div>

          <DialogFooter className="px-12 pb-12 bg-white flex flex-col gap-3">
             <Button 
               disabled={!password || isVerifying}
               onClick={processAssignedAction}
               className="w-full h-14 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-black uppercase italic tracking-widest text-[12px] shadow-2xl shadow-primary/20 transition-all active:scale-95"
             >
                {isVerifying ? "Processando Assinatura..." : "Confirmar e Assinar"}
             </Button>
             <Button 
               variant="ghost" 
               className="w-full rounded-[1.5rem] font-bold uppercase tracking-widest text-[10px] h-10 text-slate-400"
               onClick={() => { setIsConfirmingPassword(false); setPassword(""); }}
             >
                Cancelar Operação
             </Button>
          </DialogFooter>
       </DialogContent>
    </Dialog>
    </>
  );
}
