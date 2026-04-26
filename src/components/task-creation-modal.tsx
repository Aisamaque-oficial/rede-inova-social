"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Save, 
  FilePlus, 
  AlertCircle,
  CheckCircle2,
  Lock,
  GitPullRequest,
  Check,
  Edit3,
  ListTodo,
  ArrowRight,
  ChevronRight,
  ClipboardList,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { dataService } from "@/lib/data-service";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/context/accessibility-context";

interface TaskCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated: (taskId: string) => void;
  mode?: 'action' | 'request';
  initialSector?: string;
  isCGP?: boolean;
}

type DepartmentType = 'ASCOM' | 'ACESSIBILIDADE' | 'ADMINISTRATIVO' | 'PLAN' | 'SOCIAL' | 'REDES' | 'CURADORIA' | 'TECH' | 'CGP' | 'COORD_TECNICO' | 'COORD_PESQUISA' | 'MOV_MULHERES' | 'MOV_AFRO' | 'MOV_LGBT';

interface TaskFormData {
  title: string;
  typeId: string;
  setorDono: DepartmentType;
  assignedToId: string;
  deadline: string;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  description: string;
  isFeed: boolean;
  identificador?: string;
}

export function TaskCreationModal({ 
  open, 
  onOpenChange, 
  onTaskCreated, 
  mode = 'action',
  initialSector,
  isCGP: isCGPFromProps
}: TaskCreationModalProps) {
  const { colorMode } = useAccessibility();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = dataService.getCurrentUser();
  const currentUserDept = typeof currentUser?.department === 'string' ? currentUser.department : currentUser?.department?.sigla;
  const isCGP = isCGPFromProps || currentUser?.id === '1' || currentUserDept?.toUpperCase() === 'CGP';
  
  const [step, setStep] = useState<1 | 2>(1);
  const [suggestedFlow, setSuggestedFlow] = useState<any>(null);
  const [adjustmentNotes, setAdjustmentNotes] = useState("");
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    typeId: "tt-atividade",
    setorDono: (initialSector?.trim().toUpperCase() || currentUserDept || "ASCOM") as DepartmentType,
    assignedToId: "UNASSIGNED",
    deadline: "",
    priority: "media",
    description: "",
    isFeed: false
  });

  const [duplicateFound, setDuplicateFound] = useState<any>(null);
  const [ignoreDuplicate, setIgnoreDuplicate] = useState(false);

  // Gerar identificador toda vez que o setor dono mudar
  useEffect(() => {
    try {
      if (open && formData.setorDono) {
        const id = dataService.generateIdentifier(formData.setorDono);
        setFormData(prev => ({ ...prev, identificador: id }));
      }
    } catch (e) {
      console.warn("Erro ao gerar identificador:", e);
    }
  }, [open, formData.setorDono]);

  useEffect(() => {
    if (open) {
      setStep(1);
      setSuggestedFlow(null);
      // Resetar form com os dados iniciais corretos (usando currentUserDept seguro)
        setFormData(prev => ({
            ...prev,
            setorDono: (initialSector?.trim().toUpperCase() || currentUserDept?.toUpperCase() || "ASCOM") as DepartmentType,
            assignedToId: "UNASSIGNED",
            assignedToName: "Aguardando Atribuição"
        }));
    }
  }, [open, initialSector, currentUserDept]);

  const [sectorMembers, setSectorMembers] = useState<any[]>([]);

  useEffect(() => {
    if (open && formData.setorDono) {
      dataService.getUsers().then(users => {
        const filtered = (users || []).filter(u => 
          (u.assignments || []).some((a: any) => a.sector?.toUpperCase() === formData.setorDono?.toUpperCase()) || 
          (typeof u.department === 'string' ? u.department : u.department?.sigla)?.toUpperCase() === formData.setorDono?.toUpperCase()
        );
        setSectorMembers(filtered);
      }).catch(err => {
        console.warn("Erro ao carregar membros:", err);
        setSectorMembers([]);
      });
    }
  }, [open, formData.setorDono]);

  const handleNextStep = () => {
    if (!formData.title) {
      toast({ title: "Campo Obrigatório", description: "Por favor, preencha o assunto.", variant: "destructive" });
      return;
    }

    // Verificar duplicidade
    if (!ignoreDuplicate) {
      const sectorId = dataService.getSectorIdBySigla(formData.setorDono);
      const potentialDuplicate = dataService.checkForPotentialDuplicate({
        title: formData.title,
        sectorId: sectorId,
        sector: formData.setorDono
      });

      if (potentialDuplicate) {
        setDuplicateFound(potentialDuplicate);
        return;
      }
    }

    // Buscar sugestão de fluxo
    const sectorId = dataService.getSectorIdBySigla(formData.setorDono);
    const flow = dataService.suggestWorkflow(sectorId, formData.typeId);
    setSuggestedFlow(flow);
    setStep(2);
  };

  const handleSaveConfirmed = async () => {
    setIsSubmitting(true);
    try {
      const sectorId = dataService.getSectorIdBySigla(formData.setorDono || "ASCOM");
      const chosenMember = sectorMembers.find(m => m.id === formData.assignedToId);
      
      const newTaskId = await dataService.assignTask({
        title: formData.title || "Sem Título",
        description: formData.description || "",
        priority: formData.priority || "media",
        sectorId: sectorId,
        sector: formData.setorDono || "ASCOM",
        flowId: suggestedFlow?.id || "flow-governanca",
        typeId: formData.typeId || "tt-atividade",
        assignedToId: formData.assignedToId === 'UNASSIGNED' ? '' : formData.assignedToId,
        assignedToName: formData.assignedToId === 'UNASSIGNED' 
          ? 'Aguardando Membro (Livre)' 
          : chosenMember?.nomeCompleto || 'Responsável Direto',
        status: mode === 'action' ? 'nao_iniciado' : 'aguardando_recebimento',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        assignedById: currentUser?.id || 'sistema',
        assignedByName: currentUser?.name || 'Sistema',
        category: 'geral',
        identifier: formData.identificador,
        visibility: 'Público',
        approvalStatus: 'pendente',
        createdAt: new Date().toISOString(),
        workflowStage: mode === 'action' ? 'gestao' : 'producao',
        attachments: [],
        history: [{
          timestamp: new Date().toISOString(),
          userId: currentUser?.id || 'sistema',
          userName: currentUser?.name || 'Sistema',
          action: mode === 'action' ? "Planejamento enviado" : "Atribuição criada",
          status: mode === 'action' ? 'nao_iniciado' : 'aguardando_recebimento',
          comment: formData.assignedToId === 'UNASSIGNED' 
            ? "Disponibilizado para todo o setor."
            : `Atribuído diretamente a ${chosenMember?.nomeCompleto || 'Membro'}.`
        }]
      });

      if (suggestedFlow && suggestedFlow.id) {
        await dataService.confirmWorkflow(newTaskId, suggestedFlow.id);
      }

      toast({ title: "Registro Criado", description: "Tarefa e fluxo ativados com sucesso!" });
      onTaskCreated(newTaskId);
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Erro", 
        description: error.message || "Não foi possível criar a tarefa.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestAdjustment = async () => {
    if (!adjustmentNotes) {
      toast({ title: "Observação Necessária", description: "Explique o ajuste necessário para a coordenação.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const sectorId = dataService.getSectorIdBySigla(formData.setorDono);
      const newTaskId = await dataService.assignTask({
        title: formData.title,
        description: formData.description,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'bloqueado',
        statusId: 'st-bloqueada',
        priority: formData.priority,
        assignedToId: currentUser?.id || 'unknown',
        assignedToName: currentUser?.name || 'Sistema',
        assignedById: currentUser?.id || 'sistema',
        assignedByName: currentUser?.name || 'Sistema',
        category: 'geral',
        sector: formData.setorDono,
        sectorId: sectorId,
        typeId: formData.typeId,
        identifier: formData.identificador,
        visibility: 'Público',
        approvalStatus: 'pendente',
        createdAt: new Date().toISOString(),
        workflowStage: 'gestao',
        attachments: []
      } as any);

      await dataService.requestWorkflowAdjustment(newTaskId, adjustmentNotes);

      toast({ title: "Solicitação Enviada", description: "O processo ficará congelado até aprovação do fluxo." });
      onTaskCreated(newTaskId);
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Erro", 
        description: error.message || "Falha ao solicitar ajuste.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSuggestedFlow(null);
    setAdjustmentNotes("");
    setDuplicateFound(null);
    setIgnoreDuplicate(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[600px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden transition-all",
        colorMode === 'dark' ? "bg-slate-900 text-white" :
        colorMode === 'dim' ? "bg-slate-800 text-slate-100" :
        "bg-slate-50 text-slate-900"
      )}>
        <DialogHeader className={cn(
          "p-8 border-b transition-all",
          colorMode === 'dark' ? "bg-slate-900 border-white/5" :
          colorMode === 'dim' ? "bg-slate-800 border-white/5" :
          "bg-white border-slate-100"
        )}>
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                 {step === 1 ? <FilePlus size={24} /> : <GitPullRequest size={24} />}
              </div>
              <div className="space-y-1">
                 <DialogTitle className={cn(
                   "text-xl font-headline uppercase italic tracking-tighter",
                   colorMode === 'light' ? "text-black" : "text-foreground"
                 )}>
                   {step === 1 
                    ? (mode === 'action' ? 'Nova Ação' : 'Nova Atribuição')
                    : 'Confirmação de Fluxo'
                   }
                 </DialogTitle>
                 <DialogDescription className={cn(
                   "text-[10px] font-black uppercase tracking-widest",
                   colorMode === 'light' ? "text-slate-500" : "text-muted-foreground/60"
                 )}>
                   {step === 1 
                    ? 'Dados básicos da demanda' 
                    : 'Verifique o fluxo sugerido automaticamente'
                   }
                 </DialogDescription>
              </div>
           </div>
        </DialogHeader>

        <div className="p-8">
           {step === 1 ? (
             <div className="space-y-6">
                 <div className={cn(
                    "p-6 rounded-3xl ring-1 space-y-6 shadow-sm transition-all",
                    colorMode === 'dark' ? "bg-black/20 ring-white/10" :
                    colorMode === 'dim' ? "bg-black/10 ring-white/5" :
                    "bg-white ring-slate-100"
                 )}>
                    <div className="grid grid-cols-1 gap-6">
                        {/* Assunto */}
                        <div className="space-y-2">
                          <Label className={cn(
                            "text-[10px] font-black uppercase tracking-widest ml-1 italic",
                            colorMode === 'light' ? "text-slate-900" : "text-muted-foreground"
                          )}>
                            * Assunto/Título:
                          </Label>
                          <Input 
                            placeholder="O que precisa ser feito?"
                            className={cn(
                              "h-12 rounded-2xl font-black text-sm transition-all",
                              colorMode === 'dark' ? "bg-white/5 border-white/10 text-white" :
                              colorMode === 'dim' ? "bg-white/5 border-white/10 text-slate-100" :
                              "bg-slate-50 border-slate-100 text-slate-900"
                            )}
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                          />
                        </div>

                       <div className="grid grid-cols-2 gap-4">
                          {/* Tipo */}
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">
                              * Tipo:
                            </Label>
                            <select 
                               className={cn(
                                 "w-full h-12 rounded-2xl font-bold text-sm transition-all px-4 bg-slate-50 border-slate-100",
                                 colorMode === 'dark' ? "bg-white/5 border-white/10 text-white" :
                                 colorMode === 'dim' ? "bg-white/5 border-white/10 text-slate-100" :
                                 "bg-slate-50 border-slate-100 text-slate-900"
                               )}
                               value={formData.typeId} 
                               onChange={(e) => setFormData({...formData, typeId: e.target.value})}
                             >
                                <option value="tt-card">1. Card</option>
                                <option value="tt-comunicacao">2. Comunicação/Informe</option>
                                <option value="tt-fotos">3. Fotos</option>
                                <option value="tt-anotacoes">4. Anotações/Observações</option>
                                <option value="tt-evento">5. Evento/Minicurso/Oficina</option>
                                <option value="tt-site">6. Site</option>
                             </select>
                          </div>

                          {/* Prioridade */}
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">
                              * Prioridade:
                            </Label>
                             <select 
                               className={cn(
                                 "w-full h-12 rounded-2xl font-bold text-sm transition-all px-4 bg-slate-50 border-slate-100",
                                 colorMode === 'dark' ? "bg-white/5 border-white/10 text-white" :
                                 colorMode === 'dim' ? "bg-white/5 border-white/10 text-slate-100" :
                                 "bg-slate-50 border-slate-100 text-slate-900"
                               )}
                               value={formData.priority} 
                               onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                             >
                                <option value="baixa">Baixa</option>
                                <option value="media">Média</option>
                                <option value="alta">Alta</option>
                                <option value="urgente">Urgente</option>
                             </select>
                          </div>
                       </div>

                        {/* Responsável (Apenas se for Atribuição) */}
                        {mode === 'assignment' && (
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">
                              * Responsável pela Execução:
                            </Label>
                            <select 
                               className={cn(
                                 "w-full h-12 rounded-2xl font-bold text-sm transition-all px-4 bg-slate-50 border-slate-100",
                                 colorMode === 'dark' ? "bg-white/5 border-white/10 text-white" :
                                 colorMode === 'dim' ? "bg-white/5 border-white/10 text-slate-100" :
                                 "bg-slate-50 border-slate-100 text-slate-900"
                               )}
                               value={formData.assignedToId} 
                               onChange={(e) => setFormData({...formData, assignedToId: e.target.value})}
                             >
                                <option value="UNASSIGNED">🔓 Disponível para o Setor (Quem aceitar 1º)</option>
                                {sectorMembers.map(member => (
                                  <option key={member.id} value={member.id}>👤 {member.nomeCompleto}</option>
                                ))}
                             </select>
                            <p className="text-[9px] font-bold text-slate-400 ml-1">
                              💡 Dinâmica de Aceite: Todos do setor verão a demanda. O primeiro que aceitar assume a entrega formal.
                            </p>
                          </div>
                        )}

                       {/* Setor */}
                       <div className="space-y-2">
                          <Label className={cn(
                            "text-[10px] font-black uppercase tracking-widest ml-1 italic",
                            colorMode === 'light' ? "text-slate-900" : "text-muted-foreground"
                          )}>
                            * Setor (Destino/Origem):
                          </Label>
                          <select 
                             className={cn(
                               "w-full h-12 rounded-2xl font-bold text-sm transition-all px-4 bg-slate-50 border-slate-100",
                               colorMode === 'dark' ? "bg-white/5 border-white/10 text-white" :
                               colorMode === 'dim' ? "bg-white/5 border-white/10 text-slate-100" :
                               "bg-slate-50 border-slate-100 text-slate-900"
                             )}
                             value={formData.setorDono} 
                             onChange={(e) => setFormData({...formData, setorDono: e.target.value as any})}
                           >
                              <option value="ASCOM">ASCOM</option>
                              <option value="ACESSIBILIDADE">ACESSIBILIDADE</option>
                              <option value="SOCIAL">SOCIAL (TERRITÓRIO)</option>
                              <option value="PLAN">PLANEJAMENTO (PLAN)</option>
                              <option value="REDES">REDES / PARCERIAS</option>
                              <option value="CURADORIA">CURADORIA CIENTÍFICA</option>
                              <option value="TECH">TECNOLOGIA / TECH</option>
                              <option value="ADMINISTRATIVO">ADMINISTRATIVO</option>
                              <option value="CGP">COORDENAÇÃO GERAL (CGP)</option>
                           </select>
                       </div>

                       {/* Identificador Gerado */}
                        <div className="space-y-2 pb-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1 italic">
                            Identificador do Registro (Automático):
                          </Label>
                          <div className="h-12 rounded-2xl bg-primary/5 flex items-center px-4 gap-2 text-primary">
                            <Lock size={14} className="opacity-30" />
                            <span className="text-xs font-black italic">{formData.identificador}</span>
                          </div>
                        </div>
                   </div>
                </div>
                
                <Button 
                  onClick={handleNextStep}
                  className={cn(
                    "w-full h-14 rounded-2xl font-black uppercase tracking-widest gap-2 shadow-xl transition-all",
                    colorMode === 'dark' ? "bg-primary hover:bg-primary/90 text-white" :
                    colorMode === 'dim' ? "bg-primary/80 hover:bg-primary text-white" :
                    "bg-slate-900 hover:bg-black text-white"
                  )}
                >
                  Próximo <ArrowRight size={18} />
                </Button>
             </div>
           ) : (
             <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl ring-1 ring-slate-100 space-y-6 shadow-sm">
                   {suggestedFlow ? (
                     <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                           <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                              <CheckCircle2 size={18} />
                           </div>
                            <h4 className={cn(
                               "text-sm font-black uppercase tracking-tighter",
                               colorMode === 'light' ? "text-slate-900" : "text-foreground"
                            )}>Fluxo Sugerido: {suggestedFlow.name}</h4>
                        </div>
                        
                        <div className="relative pl-6 space-y-4 border-l-2 border-slate-100 ml-3">
                           {(dataService.getWorkflowSteps(suggestedFlow?.id || "") || []).map((flowStep, idx) => (
                             <div key={flowStep.id || idx} className="relative">
                               <div className="absolute -left-[1.85rem] top-1 h-3 w-3 rounded-full bg-white ring-2 ring-primary" />
                                 <div className="space-y-0.5">
                                   <p className={cn(
                                     "text-xs font-black uppercase tracking-tight",
                                     colorMode === 'light' ? "text-slate-700" : "text-foreground/80"
                                   )}>Etapa {idx + 1}: {flowStep?.name || 'Etapa sem nome'}</p>
                                 </div>
                             </div>
                           ))}
                        </div>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                        <AlertCircle className="text-amber-500 mb-2" />
                        <p className="text-sm font-bold text-slate-600">Nenhum fluxo automático encontrado.</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Um coordenador precisará definir as etapas.</p>
                     </div>
                   )}
                </div>

                <div className="space-y-4">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">
                         Deseja solicitar ajuste no fluxo? (Opcional)
                      </Label>
                       <Input 
                         placeholder="Ex: Pular etapa de curadoria, adicionar validação..."
                         className={cn(
                           "h-12 rounded-2xl font-bold text-sm transition-all",
                           colorMode === 'dark' ? "bg-white/5 border-white/10 text-white" :
                           colorMode === 'dim' ? "bg-white/5 border-white/10 text-slate-100" :
                           "bg-slate-50 border-slate-100 text-slate-900"
                         )}
                         value={adjustmentNotes}
                         onChange={(e) => setAdjustmentNotes(e.target.value)}
                       />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="outline"
                        onClick={handleRequestAdjustment}
                        disabled={isSubmitting}
                        className={cn(
                          "h-14 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] transition-all",
                          colorMode === 'dark' ? "border-white/10 text-white hover:bg-white/5" :
                          colorMode === 'dim' ? "border-white/10 text-slate-100 hover:bg-white/5" :
                          "border-slate-100 text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        Solicitar Ajuste
                      </Button>
                      <Button 
                        onClick={handleSaveConfirmed}
                        disabled={isSubmitting}
                        className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] shadow-lg gap-2"
                      >
                        Confirmar Fluxo <Check size={18} />
                      </Button>
                   </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  onClick={() => setStep(1)}
                  className="w-full h-10 text-slate-400 font-bold text-[10px] uppercase tracking-widest"
                >
                  Voltar para dados básicos
                </Button>
             </div>
           )}
         </div>
      </DialogContent>

      {/* Duplicate Warning Modal */}
      <AnimatePresence>
        {duplicateFound && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden p-8 space-y-6 transition-all",
                colorMode === 'dark' ? "bg-slate-900 border border-white/10" :
                colorMode === 'dim' ? "bg-slate-800 border border-white/5" :
                "bg-white"
              )}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="h-16 w-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <AlertTriangle size={32} />
                 </div>
                 <div className="space-y-1">
                    <h4 className={cn(
                      "text-lg font-black italic uppercase tracking-tighter",
                      colorMode === 'light' ? "text-black" : "text-foreground"
                    )}>Alerta de Duplicidade</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Demanda recorrente detectada</p>
                 </div>
                 <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                    Já existe uma tarefa similar ativa: <br/>
                    <span className={cn(
                      "font-black italic uppercase",
                      colorMode === 'light' ? "text-black" : "text-foreground"
                    )}>"{duplicateFound.title}"</span><br/>
                    no setor {duplicateFound.sector}.
                 </p>
              </div>

              <div className="flex flex-col gap-3">
                 <Button 
                   className={cn(
                     "w-full h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                     colorMode === 'dark' ? "bg-primary hover:bg-primary/90 text-white" : "bg-slate-900 text-white"
                   )}
                   onClick={() => {
                     setIgnoreDuplicate(true);
                     setDuplicateFound(null);
                     // Trigger next step again now that duplicate is "ignored"
                     setTimeout(handleNextStep, 100);
                   }}
                 >
                    Continuar como Nova
                 </Button>
                 <Button 
                   variant="ghost"
                   className="w-full h-10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400"
                   onClick={() => {
                     setDuplicateFound(null);
                     onOpenChange(false);
                     resetForm();
                   }}
                 >
                    Cancelar Registro
                 </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
