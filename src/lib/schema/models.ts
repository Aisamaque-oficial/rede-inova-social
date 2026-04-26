/**
 * DOMÍNIO 1: IDENTIDADE E ACESSO (RBAC)
 */

export type Sector =
  | "CGP"
  | "ASCOM"
  | "ACESSIBILIDADE"
  | "PLAN"
  | "SOCIAL"
  | "REDES"
  | "CURADORIA"
  | "TECH"
  | "ADMIN";

export type Department = Sector;

export type Role =
  | "ADMIN"
  | "COORDENADOR"
  | "COLABORADOR"
  | "CONSULTOR"
  | "VIEWER";

export interface UserSectorRole {
  sector: Sector;
  role: Role;
}

export interface User {
  id: string;
  name: string;
  email: string;
  assignments: UserSectorRole[];
  activeSector?: Sector;
  avatarId: string;
  avatarUrl?: string; // URL direta para foto personalizada (Prioridade sobre avatarId)
  bio: string;
  lattesUrl?: string;
  activeAt?: string;
  createdAt: string;
}

export interface SectorDefinition {
  id: string;
  name: string;
  sigla: string;
  color: string;
  icon?: string;
  description: string;
  coordinatorId?: string; // ID do usuário responsável pelo setor
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
}

export interface Permission {
  id: string;
  name: string;
  code: string; // Ex: 'task:create'
  description: string;
}

export interface UserRole {
  userId: string;
  roleId: string;
}

export interface UserSectorMembership {
  id: string;
  userId: string;
  sectorId: string;
  roleId: string; // Papel que exerce NO setor
  status: 'ativo' | 'inativo';
}

/**
 * DOMÍNIO 2: EXECUÇÃO (TAREFAS E PROCESSOS)
 */

export interface TaskType {
  id: string;
  name: string;
  icon?: string;
  description: string;
}

export interface TaskStatus {
  id: string;
  name: string;
  color: string;
  isInitial?: boolean;
  isFinal?: boolean;
}

export interface Task {
  id: string;
  publicId: string; // SIGLA-ANO-SEQ
  title: string;
  description: string;
  deadline: string;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  
  // IDs de Referência
  statusId: string;
  typeId: string;
  sectorId: string;
  creatorId: string;
  assigneeId: string; // Responsável Principal
  
  // Fluxo e Metas
  flowId?: string;
  currentStepId?: string;
  isFlowFrozen?: boolean;
  flowAdjustmentNotes?: string;
  strategicGoalId?: string;
  
  // Metadados de Fila e SLA (Acessibilidade/Gargalos)
  originSectorId?: string;
  impactsPublication?: boolean;
  slaCategory?: 'simples' | 'tecnico' | 'critico';
  waitingTimeStartedAt?: string;
  
  // Metadados Territoriais (Articulação)
  municipality?: string;
  communityGroup?: string;
  targetPublic?: string[];
  actionType?: 'visita' | 'escuta' | 'oficina' | 'demanda' | 'outro';
  participantCount?: number;
  findingsSummary?: string;
  generatedForwarding?: string;
  forwardingTargetSector?: string;
  evidenceConfirmed?: boolean;
  
  // Metadados de Parcerias (Redes)
  partnerName?: string;
  partnershipType?: 'pública' | 'privada' | 'ong' | 'universitária' | 'outra';
  partnershipStage?: 'prospecção' | 'validação' | 'negociação' | 'formalização' | 'execução' | 'avaliação';
  partnershipGoal?: string;
  territorialImpactArea?: string;
  
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Flow {
  id: string;
  name: string;
  sectorId: string;
  description: string;
  nature: 'conteúdo' | 'territorial' | 'parceria' | 'científico' | 'acessibilidade' | 'publicação';
  blockingRules: boolean;
}

export interface FlowStep {
  id: string;
  flowId: string;
  name: string;
  order: number;
  roleIdRequired?: string;
}

export interface FlowStepTransition {
  fromStepId: string;
  toStepId: string;
  condition?: string;
}

export interface TaskTrigger {
  id: string;
  sourceSectorId: string;
  sourceStatusId: string; // Ex: 'st-concluida'
  targetSectorId: string;
  action: 'create_task' | 'notify_coordinator';
  template: {
    title: string;
    description: string;
    priority: 'baixa' | 'media' | 'alta' | 'urgente';
    typeId: string;
    daysToDeadline: number;
  };
}

export interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnTaskId: string;
  type: 'finish-to-start';
}

export interface TaskBlock {
  id: string;
  taskId: string;
  reason: string;
  blockedAt: string;
  unblockedAt?: string;
  blockedByUserId: string;
}

/**
 * DOMÍNIO 3: PLANEJAMENTO ESTRATÉGICO
 */

export interface StrategicRoute {
  id: string;
  name: string;
  sectorId: string;
  steps: string[]; // Resumo das etapas
}

export interface StrategicGoal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  sectorId: string;
  progress: number; // 0-100
}

export interface TaskGoalLink {
  taskId: string;
  goalId: string;
}

/**
 * DOMÍNIO 4: APOIO E AUDITORIA
 */

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface TaskStatusHistory {
  id: string;
  taskId: string;
  fromStatusId: string;
  toStatusId: string;
  changedByUserId: string;
  timestamp: string;
  comment?: string;
}

export interface TaskFlowHistory {
  id: string;
  taskId: string;
  fromStepId: string;
  toStepId: string;
  movedByUserId: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  url?: string;
  read: boolean;
  createdAt: string;
}

export interface Attachment {
  id: string;
  taskId: string;
  userId: string;
  name: string;
  url: string;
  type: 'imagem' | 'pdf' | 'link' | 'video';
  size?: number;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  userId: string;
  metadata?: any;
  timestamp: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface TaskTag {
  taskId: string;
  tagId: string;
}

export interface ProjectBottleneck {
  id: string;
  reason: string; // Título curto
  description: string; // Detalhes do problema
  severity: 'alta' | 'media';
  sectorId: string;
  timestamp: string;
  monthKey: string; // YYYY-MM para arquivamento
  reportedBy: string;
  reportedByName: string;
  status: 'ativo' | 'resolvido';
}
