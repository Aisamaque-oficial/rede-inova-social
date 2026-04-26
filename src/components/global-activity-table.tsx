"use client"

import React, { useState, useEffect } from "react"
import { TaskWorkflowManager } from "./task-workflow-manager"
import { TaskCreationModal } from "./task-creation-modal"
import { dataService } from "@/lib/data-service"
import { ProjectTask } from "@/lib/mock-data"
import { TaskDetailsModal } from "./task-details-modal"
import { 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  Edit3, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Lock,
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface GlobalActivityTableProps {
  initialSector?: string;
}

export default function GlobalActivityTable({ initialSector }: GlobalActivityTableProps) {
  const [activities, setActivities] = useState<ProjectTask[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("todos")
  const [sectorFilter, setSectorFilter] = useState(initialSector || "todos")
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null)
  const [viewingTask, setViewingTask] = useState<ProjectTask | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreationOpen, setIsCreationOpen] = useState(false)
  
  const currentUser = dataService.getCurrentUser()
  const isCoordinator = dataService.isCoordinator() || dataService.isBypass()
  const isASCOM = currentUser?.department === 'ASCOM'

  const refreshTasks = async () => {
    const data = await dataService.getTasks()
    // Deduplicação preventiva para evitar erros de Key duplicada no React
    const uniqueTasks = data.filter((task, index, self) => 
      index === self.findIndex((t) => t.id === task.id)
    )
    setActivities(uniqueTasks)
  }

  useEffect(() => {
    refreshTasks()
  }, [])

  useEffect(() => {
    if (initialSector) {
      setSectorFilter(initialSector)
    }
  }, [initialSector])

  const handleTaskCreated = () => {
    refreshTasks()
  }

  const filtered = activities.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
                          a.processNumber?.toLowerCase().includes(search.toLowerCase()) ||
                          a.assignedToName.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = filter === "todos" || a.status === filter
    const matchesSector = sectorFilter === "todos" || a.sector === sectorFilter

    return matchesSearch && matchesStatus && matchesSector
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluida':
        return <Badge className="bg-emerald-100 text-emerald-700 border-none shadow-none text-[9px] font-black uppercase tracking-tighter h-5 px-1.5 flex gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> Concluída</Badge>
      case 'em_revisao':
        return <Badge className="bg-amber-100 text-amber-700 border-none shadow-none text-[9px] font-black uppercase tracking-tighter h-5 px-1.5 flex gap-1"><Clock className="w-2.5 h-2.5" /> Em Revisão</Badge>
      case 'atrasada':
        return <Badge className="bg-red-100 text-red-700 border-none shadow-none text-[9px] font-black uppercase tracking-tighter h-5 px-1.5 flex gap-1 animate-pulse"><AlertCircle className="w-2.5 h-2.5" /> Atrasada</Badge>
      case 'bloqueado':
        return <Badge className="bg-orange-100 text-orange-700 border-none shadow-none text-[9px] font-black uppercase tracking-tighter h-5 px-1.5 flex gap-1"><Lock className="w-2.5 h-2.5" /> Bloqueado</Badge>
      case 'em_andamento':
        return <Badge className="bg-blue-100 text-blue-700 border-none shadow-none text-[9px] font-black uppercase tracking-tighter h-5 px-1.5">Em Andamento</Badge>
      case 'nao_iniciado':
        return <Badge variant="outline" className="text-slate-400 border-slate-200 text-[9px] font-black uppercase tracking-tighter h-5 px-1.5">Não Iniciado</Badge>
      default:
        return <Badge variant="outline" className="text-slate-400 border-slate-200 text-[9px] font-black uppercase tracking-tighter h-5 px-1.5">{status}</Badge>
    }
  }

  const [acceptingTaskId, setAcceptingTaskId] = useState<string | null>(null)
  const [newDeadline, setNewDeadline] = useState("")

  const handleAccept = async (taskId: string) => {
    if (!newDeadline) {
      alert("Por favor, indique um prazo para concluir a atividade.")
      return
    }
    await dataService.acceptTask(taskId, newDeadline)
    setAcceptingTaskId(null)
    setNewDeadline("")
    refreshTasks()
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
      {/* Header / Filters */}
      <div className="p-6 border-b border-slate-50 space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                   <h3 className="text-lg font-black font-headline italic tracking-tighter uppercase text-slate-800 leading-none">
                       {sectorFilter !== 'todos' ? `Atribuições: ${sectorFilter}` : "Central de Atribuições & Fluxos"}
                   </h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                       {sectorFilter !== 'todos' ? `Gestão setorial de responsabilidades` : "Gestão de responsabilidades e transparência total"}
                   </p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-full font-bold text-[10px] uppercase">
                    <Download className="w-3 h-3 mr-2" /> Exportar Planilha
                </Button>
                <Button 
                    size="sm" 
                    className="rounded-full font-bold text-[10px] uppercase bg-primary hover:bg-primary/90"
                    onClick={() => {
                        console.log('Botão clicado, abrindo modal (isCreationOpen) e tentando não mudar de slug...');
                        setIsCreationOpen(true);
                    }}
                >
                    {isCoordinator ? "Adicionar nova atribuição" : (isASCOM ? "Adicionar nova ação" : "Adicionar Novo")}
                </Button>
            </div>
        </div>

        {/* Modais */}
        <TaskCreationModal 
            open={isCreationOpen} 
            onOpenChange={setIsCreationOpen}
            onTaskCreated={handleTaskCreated}
            mode={isCoordinator ? 'assignment' : 'action'}
        />

        {selectedTask && (
            <TaskWorkflowManager 
               task={selectedTask}
               open={isDetailOpen}
               onOpenChange={setIsDetailOpen}
               onTaskUpdated={refreshTasks}
            />
        )}

        <div className="flex flex-wrap gap-4">
           <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Buscar por Assunto, Nome ou Código do Processo..." 
                className="pl-10 h-10 rounded-xl border-slate-200 focus:ring-primary/20 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           
           <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select 
                className="h-10 px-3 pr-8 rounded-xl border border-slate-200 text-xs font-bold uppercase bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                 <option value="todos">Todos os Status</option>
                 <option value="concluida">Concluídas</option>
                 <option value="em_revisao">Em Revisão</option>
                 <option value="atrasada">Atrasadas</option>
                 <option value="bloqueado">Bloqueadas</option>
                 <option value="em_andamento">Em Andamento</option>
                 <option value="nao_iniciado">Não Iniciado</option>
              </select>

              <select 
                className="h-10 px-3 pr-8 rounded-xl border border-slate-200 text-xs font-bold uppercase bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
              >
                 <option value="todos">Todos os Setores</option>
                 <option value="ASCOM">ASCOM</option>
                 <option value="ACESSIBILIDADE">Acessibilidade</option>
                 <option value="COORD_GERAL">Coordenação Geral</option>
                 <option value="COORD_TECNICO">Coordenação Técnico-Científica</option>
                 <option value="COORD_PESQUISA">Coord. Pesquisa e Extensão</option>
                 <option value="MOV_MULHERES">Movimentos Sociais: Mulheres</option>
                 <option value="MOV_AFRO">Movimentos Sociais: Afro</option>
                 <option value="MOV_LGBT">Movimentos Sociais: LGBTQIAPN+</option>
              </select>
           </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
           <thead className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-10">
              <tr>
                 <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">#</th>
                 <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Setor / Assunto</th>
                 <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Atribuído Para</th>
                 <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Atribuído Por</th>
                 <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Situação</th>
                 <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Prazo</th>
                 <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Ações</th>
              </tr>
           </thead>
           <tbody>
              {filtered.map((item, idx) => {
                  const isCoordinator = currentUser?.role === 'coordinator' || 
                                        currentUser?.role === 'coordinator_internal' || 
                                        currentUser?.role === 'coordinator_extension' ||
                                        currentUser?.role === 'admin';
                  const isAssignedToMe = currentUser?.id === item.assignedToId;
                  const isAssignedByMe = currentUser?.id === item.assignedById;
                  const canEdit = isAssignedToMe || isAssignedByMe || isCoordinator;
                  const sameSector = currentUser?.department === item.sector;
                  const canAccept = item.status === 'nao_iniciado' && (sameSector || isCoordinator);
                 
                 return (
                    <tr key={item.id} className={cn(
                        "group hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0",
                        item.status === 'nao_iniciado' && "bg-slate-50/30"
                    )}>
                       <td className="p-4 text-[11px] font-bold text-slate-300">{idx + 1}</td>
                       <td className="p-4">
                          <div className="flex flex-col">
                             <div className="flex items-center gap-1.5 mb-1">
                                <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter line-clamp-1">
                                    {dataService.formatDepartment(item.sector)}
                                </span>
                             </div>
                             <span className="text-[11px] font-bold text-slate-500 uppercase italic truncate max-w-[200px]">
                                {item.title}
                             </span>
                             <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter font-mono">
                                {item.processNumber || "SEM IDENTIFICADOR"}
                             </span>
                          </div>
                       </td>
                       <td className="p-4">
                          <div className="flex flex-col">
                             <span className="text-[11px] font-black text-slate-800 uppercase line-clamp-1">{item.assignedToName}</span>
                             {item.status === 'em_andamento' ? (
                                <Badge className="bg-indigo-50 text-indigo-600 border-none w-fit text-[8px] font-bold uppercase mt-1 h-4 px-1">Aceito por este membro</Badge>
                             ) : item.status === 'nao_iniciado' ? (
                                <Badge className="bg-amber-50 text-amber-600 border-none w-fit text-[8px] font-bold uppercase mt-1 h-4 px-1">Aguardando Setor</Badge>
                             ) : (
                                <Badge variant="outline" className="w-fit text-[8px] font-bold uppercase mt-1 border-slate-100 text-slate-400 h-4 px-1">Destinatário</Badge>
                             )}
                          </div>
                       </td>
                       <td className="p-4">
                          <div className="flex flex-col">
                             <span className="text-[11px] font-black text-slate-600 uppercase line-clamp-1">{item.assignedByName}</span>
                             <Badge variant="outline" className="w-fit text-[8px] font-bold uppercase mt-1 border-slate-100 text-slate-400 h-4 px-1">Atribuidor</Badge>
                          </div>
                       </td>
                       <td className="p-4">
                          {getStatusBadge(item.status)}
                       </td>
                       <td className="p-4">
                          <div className="flex flex-col">
                             <span className="text-[11px] font-black text-slate-700">{new Date(item.deadline).toLocaleDateString()}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase italic">Vencimento</span>
                          </div>
                       </td>
                       <td className="p-4">
                          <div className="flex items-center gap-1 opacity-100 transition-opacity">
                              {canAccept ? (
                                  acceptingTaskId === item.id ? (
                                    <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-primary/20">
                                        <input 
                                            type="date" 
                                            className="text-[10px] font-bold p-1 border rounded-md"
                                            value={newDeadline}
                                            onChange={(e) => setNewDeadline(e.target.value)}
                                        />
                                        <Button 
                                            size="sm" 
                                            className="h-7 text-[9px] font-black uppercase px-3"
                                            onClick={() => handleAccept(item.id)}
                                        >
                                            Confirmar
                                        </Button>
                                        <Button 
                                            variant="ghost"
                                            size="sm" 
                                            className="h-7 text-[9px] font-black uppercase"
                                            onClick={() => setAcceptingTaskId(null)}
                                        >
                                            Pular
                                        </Button>
                                    </div>
                                  ) : (
                                    <Button 
                                        size="sm" 
                                        className="h-8 rounded-full bg-primary text-[10px] font-black uppercase px-4 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                        onClick={() => setAcceptingTaskId(item.id)}
                                    >
                                        Aceitar Atribuição
                                    </Button>
                                  )
                              ) : (
                                <>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="w-8 h-8 rounded-lg hover:bg-white hover:shadow-sm"
                                                    onClick={() => setViewingTask(item)}
                                                >
                                                    <Eye className="w-4 h-4 text-slate-400" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-slate-900 border-none text-[10px] font-bold uppercase p-2">Visualizar Detalhes</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    {canEdit ? (
                                        <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="w-8 h-8 rounded-lg hover:bg-white hover:shadow-sm"
                                                    onClick={() => setViewingTask(item)}
                                                >
                                                    <Edit3 className="w-4 h-4 text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-primary border-none text-[10px] font-bold uppercase p-2 text-white">Você pode Editar / Assinar</TooltipContent>
                                        </Tooltip>
                                        </TooltipProvider>
                                    ) : (
                                        <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="w-8 h-8 flex items-center justify-center cursor-not-allowed">
                                                    <Lock className="w-3 h-3 text-slate-300" />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-slate-200 border-none text-[10px] font-bold uppercase p-2 text-slate-600">Somente Leitura</TooltipContent>
                                        </Tooltip>
                                        </TooltipProvider>
                                    )}
                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg">
                                        <MoreHorizontal className="w-4 h-4 text-slate-300" />
                                    </Button>
                                </>
                              )}
                          </div>
                       </td>
                    </tr>
                 )
              })}

              {filtered.length === 0 && (
                 <tr>
                     <td colSpan={7} className="p-20 text-center">
                        <div className="flex flex-col items-center justify-center opacity-20">
                           <Search className="w-12 h-12 mb-4" />
                           <p className="text-xl font-bold uppercase italic italic tracking-tighter">Nenhuma atribuição encontrada</p>
                        </div>
                     </td>
                 </tr>
              )}
           </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mostrando {filtered.length} de {activities.length} atribuições encontradas</span>
         <div className="flex items-center gap-2">
             <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-slate-200" disabled>
                <ChevronLeft className="w-4 h-4" />
             </Button>
             <span className="text-[10px] font-black px-4">1</span>
             <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-slate-200" disabled>
                <ChevronRight className="w-4 h-4" />
             </Button>
         </div>
      </div>

      {viewingTask && (
        <TaskDetailsModal 
          task={viewingTask}
          isOpen={!!viewingTask}
          onClose={() => setViewingTask(null)}
          onUpdate={refreshTasks}
        />
      )}
    </div>
  )
}
