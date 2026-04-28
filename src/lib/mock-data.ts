import { Sector, Role, UserSectorRole, User, SectorDefinition, TaskTrigger, TaskStatus, TaskType, Flow, FlowStep, Department } from "./schema/models";
export type { Sector, Role, UserSectorRole, User, SectorDefinition, TaskTrigger, TaskStatus, TaskType, Flow, FlowStep, Department };
import { usuariosCadastrados } from "./auth-credentials";

/** 
 * DOMÍNIO 1: SETORES (Metadata)
 */
export const sectors: SectorDefinition[] = [
  { id: 'cgp', name: 'Coordenação Geral e Administração', sigla: 'CGP', color: 'slate', icon: 'ShieldCheck', description: 'Gestão de recursos e contratos' },
  { id: 'ascom', name: 'ASCOM e Difusão', sigla: 'ASCOM', color: 'blue', icon: 'Megaphone', description: 'Núcleo de comunicação e imagem' },
  { id: 'acessibilidade', name: 'Acessibilidade Comunicacional', sigla: 'ACESSIBILIDADE', color: 'teal', icon: 'Accessibility', description: 'Núcleo de mediação e tradução' },
  { id: 'plan', name: 'Planejamento, Monitoramento e Avaliação', sigla: 'PLAN', color: 'indigo', icon: 'BarChart3', description: 'Gestão estratégica e indicadores' },
  { id: 'social', name: 'Articulação Social e Territorial', sigla: 'SOCIAL', icon: 'Users2', color: 'orange', description: 'Articulação social e campo' },
  { id: 'redes', name: 'Parcerias Institucionais e Redes', sigla: 'REDES', icon: 'Network', color: 'cyan', description: 'Relações institucionais' },
  { id: 'curadoria', name: 'Produção Científica e Curadoria', sigla: 'CURADORIA', icon: 'BookOpen', color: 'emerald', description: 'Investigação acadêmica' },
  { id: 'tech', name: 'Tecnologia, Plataforma e Dados', sigla: 'TECH', icon: 'Terminal', color: 'violet', description: 'Inovação e produção de tecnologia' },
];

/**
 * DOMÍNIO 4: GATILHOS (Triggers)
 */
export const taskTriggers: TaskTrigger[] = [
  {
    id: 'trig-ascom-acess',
    sourceSectorId: 'ascom',
    sourceStatusId: 'st-concluida',
    targetSectorId: 'acessibilidade',
    action: 'create_task',
    template: {
      title: 'Validar Acessibilidade de Conteúdo',
      description: 'Gatilho Automático: Produção ASCOM pronta. Necessário tradução/acessibilização.',
      priority: 'alta',
      typeId: 'tt-atividade',
      daysToDeadline: 2
    }
  }
];

/**
 * DOMÍNIO 2: STATUS DE TAREFA (Metadata)
 */
export const taskStatuses: TaskStatus[] = [
  { id: 'st-nao-iniciado', name: 'Não Iniciado', color: 'slate', isInitial: true },
  { id: 'st-andamento', name: 'Em Andamento', color: 'blue' },
  { id: 'st-revisao', name: 'Em Revisão', color: 'amber' },
  { id: 'st-aguardando', name: 'Aguardando Outro Setor', color: 'orange' },
  { id: 'st-concluida', name: 'Concluída', color: 'emerald', isFinal: true },
  { id: 'st-atrasada', name: 'Atrasada', color: 'red' },
  { id: 'st-bloqueada', name: 'Bloqueado', color: 'orange' },
];

/**
 * DOMÍNIO 3: TIPOS DE TAREFA (Metadata)
 */
export const taskTypes: TaskType[] = [
  { id: 'tt-documento', name: 'Documento', icon: 'file-text', description: 'Ofícios, memorandos e relatórios' },
  { id: 'tt-processo', name: 'Processo', icon: 'git-pull-request', description: 'Fluxos administrativos formais' },
  { id: 'tt-atividade', name: 'Atividade', icon: 'list-todo', description: 'Ações operacionais diretas' },
  { id: 'tt-evento', name: 'Evento/Reunião', icon: 'calendar', description: 'Encontros e marcos temporais' },
  { id: 'tt-curadoria', name: 'Curadoria Científica', icon: 'book-open', description: 'Submissão de conteúdo para validação técnica da Coord. Geral' },
];

/**
 * DOMÍNIO 5: BIBLIOTECA DE FLUXOS PADRÃO
 */
export const standardFlows: Flow[] = [
  { 
    id: 'flow-conteudo', 
    name: 'Fluxo de Conteúdo Institucional', 
    sectorId: 'ascom', 
    description: 'Produção, acessibilização e publicação de peças de comunicação.',
    nature: 'conteúdo',
    blockingRules: true
  },
  { 
    id: 'flow-territorial', 
    name: 'Fluxo de Articulação Territorial', 
    sectorId: 'social', 
    description: 'Mapeamento, escuta qualificada e diagnóstico local.',
    nature: 'territorial',
    blockingRules: true
  },
  { 
    id: 'flow-parceria', 
    name: 'Fluxo de Parcerias e Redes', 
    sectorId: 'redes', 
    description: 'Prospecção e formalização de termos de cooperação.',
    nature: 'parceria',
    blockingRules: true
  },
  { 
    id: 'flow-cientifico', 
    name: 'Fluxo de Produção Científica', 
    sectorId: 'curadoria', 
    description: 'Pesquisa, curadoria acadêmica e publicação científica.',
    nature: 'científico',
    blockingRules: true
  },
  { 
    id: 'flow-acessibilizacao', 
    name: 'Fluxo de Acessibilização', 
    sectorId: 'acessibilidade', 
    description: 'Tradução em Libras, AD e validação com usuários surdos.',
    nature: 'acessibilidade',
    blockingRules: true
  },
  { 
    id: 'flow-publicacao', 
    name: 'Fluxo de Publicação e Difusão', 
    sectorId: 'ascom', 
    description: 'Agendamento, arte final, postagem e monitoramento de alcance.',
    nature: 'publicação',
    blockingRules: true
  },
  { 
    id: 'flow-governanca', 
    name: 'Fluxo de Governança e Gestão Estratégica', 
    sectorId: 'cgp', 
    description: 'Atribuição, acompanhamento e homologação de metas institucionais.',
    nature: 'gestão',
    blockingRules: false
  }
];

export const standardFlowSteps: FlowStep[] = [
  // Conteúdo
  { id: 'fs-cont-1', flowId: 'flow-conteudo', name: 'Produção Primária (Bruto)', order: 1 },
  { id: 'fs-cont-2', flowId: 'flow-conteudo', name: 'Acessibilização / Tradução', order: 2 },
  { id: 'fs-cont-3', flowId: 'flow-conteudo', name: 'Revisão Técnica/Coordenadoria', order: 3 },
  { id: 'fs-cont-4', flowId: 'flow-conteudo', name: 'Publicação Oficial', order: 4 },
  
  // Territorial
  { id: 'fs-terr-1', flowId: 'flow-territorial', name: 'Mapeamento de Atores/Líderes', order: 1 },
  { id: 'fs-terr-2', flowId: 'flow-territorial', name: 'Escuta Qualificada de Campo', order: 2 },
  { id: 'fs-terr-3', flowId: 'flow-territorial', name: 'Análise de Diagnóstico Social', order: 3 },
  { id: 'fs-terr-4', flowId: 'flow-territorial', name: 'Elaboração de Relatório Final', order: 4 },

  // Parceria
  { id: 'fs-parc-1', flowId: 'flow-parceria', name: 'Prospecção Institucional', order: 1 },
  { id: 'fs-parc-2', flowId: 'flow-parceria', name: 'Reunião de Alinhamento', order: 2 },
  { id: 'fs-parc-3', flowId: 'flow-parceria', name: 'Minuta do Termo de Cooperação', order: 3 },
  { id: 'fs-parc-4', flowId: 'flow-parceria', name: 'Assinatura e Registro Jurídico', order: 4 },

  // Científico
  { id: 'fs-cient-1', flowId: 'flow-cientifico', name: 'Levantamento de Dados / Pesquisa', order: 1 },
  { id: 'fs-cient-2', flowId: 'flow-cientifico', name: 'Escrita e Produção de Texto', order: 2 },
  { id: 'fs-cient-3', flowId: 'flow-cientifico', name: 'Curadoria e Revisão Científica', order: 3 },
  { id: 'fs-cient-4', flowId: 'flow-cientifico', name: 'Formatação ABNT/Editoração', order: 4 },
  { id: 'fs-cient-5', flowId: 'flow-cientifico', name: 'Publicação Acadêmica', order: 5 },

  // Acessibilização
  { id: 'fs-acess-1', flowId: 'flow-acessibilizacao', name: 'Recebimento de Material', order: 1 },
  { id: 'fs-acess-2', flowId: 'flow-acessibilizacao', name: 'Tradução (Libras / Legendagem)', order: 2 },
  { id: 'fs-acess-3', flowId: 'flow-acessibilizacao', name: 'Validação com Usuários Surdos', order: 3 },
  { id: 'fs-acess-4', flowId: 'flow-acessibilizacao', name: 'Entrega Final Acessibilizada', order: 4 },

  // Publicação
  { id: 'fs-pub-1', flowId: 'flow-publicacao', name: 'Agendamento em Calendário', order: 1 },
  { id: 'fs-pub-2', flowId: 'flow-publicacao', name: 'Arte Final e Design', order: 2 },
  { id: 'fs-pub-3', flowId: 'flow-publicacao', name: 'Redação de Legenda e Tags', order: 3 },
  { id: 'fs-pub-4', flowId: 'flow-publicacao', name: 'Postagem em Canais Oficiais', order: 4 },
  { id: 'fs-pub-5', flowId: 'flow-publicacao', name: 'Monitoramento de Alcance / Clipping', order: 5 },

  // Governança (CGP)
  { id: 'fs-gov-1', flowId: 'flow-governanca', name: 'Atribuição Intersetorial (CGP)', order: 1 },
  { id: 'fs-gov-2', flowId: 'flow-governanca', name: 'Execução pelo Setor Destinatário', order: 2 },
  { id: 'fs-gov-3', flowId: 'flow-governanca', name: 'Validação de Resultado (CGP)', order: 3 },
  { id: 'fs-gov-4', flowId: 'flow-governanca', name: 'Homologação e Arquivamento', order: 4 },
];

/** Roles do sistema com permissões padrão */
export enum UserRole {
  COORDINATOR = 'coordinator',
  COORDINATOR_INTERNAL = 'coordinator_internal',
  COORDINATOR_EXTENSION = 'coordinator_extension',
  MEMBER_EDITOR = 'member_editor',
  MEMBER_SPECIALIST = 'member_specialist',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export type UserPermissions = {
  canEditContent: boolean;
  canEditImages: boolean;
  canEditGlossary: boolean;
  canEditStation: boolean;
  canManageMembers: boolean;
  canManageTasks: boolean;
  canUploadMedia: boolean;
};

/**
 * 👥 EQUIPE INSTITUCIONAL
 * Mapeamento dinâmico a partir do vault de autenticação
 */
export const getTeamMembers = (): User[] => usuariosCadastrados.map(u => ({
  id: u.id,
  name: u.nomeCompleto,
  email: u.cpfOuEmail.includes('@') ? u.cpfOuEmail : 'contato@redeinova.org',
  assignments: u.assignments,
  activeSector: u.activeSector,
  role: u.role,
  department: u.department,
  bio: u.bio || "",
  avatarId: u.avatarUrl ? u.avatarUrl : (u.nomeCompleto.toLowerCase().includes('a') ? 'placeholder_female_1' : 'placeholder_male_1'),
  lattesUrl: u.lattesUrl || "#",
  createdAt: u.dataCriacao,
  permissions: u.permissoes
}));

export const teamMembers: User[] = getTeamMembers();
 
export interface ProjectIntervention {
  id: string;
  taskId: string;
  type: 'cobrar_prazo' | 'orientacao_direta';
  content?: string;
  timestamp: string;
  userId: string;
  userName: string;
}


export interface ProjectTask {
  id: string;
  publicId?: string;
  identifier?: string;
  title: string;
  description: string;
  deadline: string;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'nao_iniciado' | 'em_andamento' | 'em_revisao' | 'aguardando_outro_setor' | 'concluida' | 'atrasada' | 'bloqueado' | 'aguardando_recebimento' | 'aceito' | 'pendente';
  statusId: string;
  assignedToId: string;
  assignedToName: string;
  assignedById?: string;
  assignedByName?: string;
  sectorId: string;
  sector: Department | string;
  typeId: string;
  type?: string;
  workflowStage: 'producao' | 'acessibilizacao' | 'revisao' | 'publicacao' | 'gestao';
  strategicMetaId?: string;
  strategicGoalId?: string;
  
  // Extra-Plan Activity Control
  isExtra?: boolean;
  extraQuantity?: number;
  extraImpact?: string;
  
  // High-Performance Workflow Control
  flowId?: string;
  currentStepId?: string;
  isFlowFrozen?: boolean;
  flowAdjustmentNotes?: string;
  conclusionLink?: string;
  category: 'geral' | 'comunicacao';
  visibility: 'Público' | 'Interno';
  approvalStatus: 'pendente' | 'aprovada' | 'rejeitada';
  history?: Array<{
    timestamp: string;
    userId: string;
    userName: string;
    action: string;
    status: string;
    statusId?: string;
    comment?: string;
    type?: 'comment' | 'analysis' | 'status_change';
    sector?: string;
    role?: string;
    sectorSigla?: string;
  }>;
  rejectionFeedback?: string;
  createdAt: string;
  updatedAt?: string;
  processNumber?: string; // Adicionado para compatibilidade com GlobalActivityTable
  attachments?: any[];

  // Novos campos para fluxo operacional completo (existentes)
  socialMediaPlatform?: 'instagram' | 'facebook' | 'youtube' | 'site' | 'link';
  completionReport?: string;
  mediaUrl?: string;
  isPublishedOnSite?: boolean;
  completedAt?: string;
  approvedBy?: string;
  dependencyId?: string;
  acceptedById?: string;
  isFeed?: boolean; // Adicionado para compatibilidade com AscomTaskTable
  acceptedByName?: string;
  acceptedAt?: string;

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
  hasIntervention?: boolean;
  interventions?: ProjectIntervention[];
}

export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category?: string; // Adicionado para compatibilidade com NewsFeed
  date: string;
  tag: string;
  tagColor: string;
  image: string;
  author?: string;
  publishedAt: string;
  imagePlaceholderId?: string; // Adicionado
  isPinned?: boolean;
  status: 'active' | 'fixed' | 'archived';
  thumbnailUrl?: string; // Adicionado para AscomNewsBoard
  librasVideoUrl?: string; // Adicionado para acessibilidade
}

export interface CommunityLeader {
  id: string;
  name: string;
  territoryId: string;
  municipality: string;
  phone?: string;
  role: string; // Ex: Presidente de Associação, Líder de Juventude
  questionnaireApplied: boolean;
  notes?: string;
  createdAt: string;
}

export interface Territory {
  id: string;
  name: string;
  municipality: string;
  region: 'Sertão' | 'Brejo' | 'Litoral' | 'Agreste' | 'Cariri';
  status: 'identificado' | 'mapeado' | 'em_escuta' | 'concluido';
  leadersCount: number;
}

export interface ActivityStep {
  id: string;
  label: string;
  completed: boolean;
  assignedTo?: string;
  deadline?: string;
  description?: string; // Adicionado para ActivityTimeline
  status?: 'pendente' | 'em_progresso' | 'concluido'; // Adicionado
  userName?: string; // Adicionado
  timestamp?: string;
}

export interface SectorActivity {
  id: string;
  title: string;
  description: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'atrasada';
  priority: 'baixa' | 'media' | 'alta';
  sectorId: string;
  assignedToId: string;
  steps: ActivityStep[];
  deadline: string;
  createdAt: string;
}

export interface StrategicPlanSubtask {
  id: string;
  label: string;
  completed: boolean;
}

export interface StrategicPlanTask {
  id: string;
  label: string;
  responsible: string;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'atrasada';
  evidence: string;
  completed: boolean;
  subtasks?: StrategicPlanSubtask[];
  stageId?: string;
  sectorId?: string;
}

export interface StrategicPlanMonth {
  id: string;
  monthName: string;
  year: number;
  sector: string;
  tasks: StrategicPlanTask[];
}

/** 
 * CRONOGRAMA OFICIAL DE 12 MESES - REDE INOVA SOCIAL
 * Consolidação completa de metas e atividades por setor.
 */
export const strategicPlanning: StrategicPlanMonth[] = [
  {
    id: "sp-2026-04",
    monthName: "🗓️ ABRIL 2026 — Arranque Estrutural",
    year: 2026,
    sector: "ALL",
    tasks: [
      { id: "task-adm-04-1", label: "Formalizar cronograma macro (12 meses)", responsible: "Coordenação", status: "pendente", evidence: "Cronograma assinado e publicado", completed: false, sectorId: "cgp" },
      { id: "task-adm-04-2", label: "Definir responsáveis por setor", responsible: "Coordenação", status: "pendente", evidence: "Portaria de nomeação", completed: false, sectorId: "cgp" },
      { id: "task-adm-04-3", label: "Criar rotina de reunião quinzenal", responsible: "Coordenação", status: "pendente", evidence: "Calendário de reuniões", completed: false, sectorId: "cgp" },
      { id: "task-ascom-04-1", label: "Criar linha editorial (60 dias)", responsible: "ASCOM", status: "pendente", evidence: "Documento de Planejamento", completed: false, sectorId: "ascom" },
      { id: "task-ascom-04-2", label: "Produzir 12 posts base (Instagram)", responsible: "ASCOM", status: "pendente", evidence: "Artes no Drive/Canva", completed: false, sectorId: "ascom" },
      { id: "task-ascom-04-3", label: "Criar 4 conteúdos institucionais (site)", responsible: "ASCOM", status: "pendente", evidence: "Links das matérias", completed: false, sectorId: "ascom" },
      { id: "task-acess-04-1", label: "Criar protocolo de acessibilidade", responsible: "Acessibilidade", status: "pendente", evidence: "Manual de Normas", completed: false, sectorId: "acessibilidade" },
      { id: "task-acess-04-2", label: "Definir padrão de janela de Libras", responsible: "Acessibilidade", status: "pendente", evidence: "Guia Visual", completed: false, sectorId: "acessibilidade" },
      { id: "task-plan-04-1", label: "Definir indicadores por setor (mín. 3)", responsible: "Planejamento", status: "pendente", evidence: "Tabela de KPIs", completed: false, sectorId: "plan" },
      { id: "task-social-04-1", label: "Mapear territórios prioritários", responsible: "Social", status: "pendente", evidence: "Mapa de Atuação", completed: false, sectorId: "social" },
      { id: "task-redes-04-1", label: "Mapear 15 instituições estratégicas", responsible: "Parcerias", status: "pendente", evidence: "Lista de Contatos", completed: false, sectorId: "redes" },
      { id: "task-curadoria-04-1", label: "Definir eixos temáticos científicos", responsible: "Curadoria", status: "pendente", evidence: "Lista de Eixos", completed: false, sectorId: "curadoria" },
      { id: "task-tech-04-1", label: "Revisar funcionamento da plataforma", responsible: "Tecnologia", status: "pendente", evidence: "Relatório de QA", completed: false, sectorId: "tech" }
    ]
  },
  {
    id: "sp-2026-05",
    monthName: "🗓️ MAIO 2026 — Início da Execução",
    year: 2026,
    sector: "ALL",
    tasks: [
      { id: "task-adm-05-1", label: "Monitorar execução dos setores", responsible: "Coordenação", status: "pendente", evidence: "Atas de Reunião", completed: false, sectorId: "cgp" },
      { id: "task-ascom-05-1", label: "Publicar 3 posts/semana", responsible: "ASCOM", status: "pendente", evidence: "Links das postagens", completed: false, sectorId: "ascom" },
      { id: "task-ascom-05-2", label: "Produzir 4 vídeos curtos", responsible: "ASCOM", status: "pendente", evidence: "Arquivos de vídeo", completed: false, sectorId: "ascom" },
      { id: "task-acess-05-1", label: "Acessibilizar todos os conteúdos publicados", responsible: "Acessibilidade", status: "pendente", evidence: "Relatório de tradução", completed: false, sectorId: "acessibilidade" },
      { id: "task-plan-05-1", label: "Coletar dados de desempenho", responsible: "Planejamento", status: "pendente", evidence: "Dataset mensal", completed: false, sectorId: "plan" },
      { id: "task-social-05-1", label: "Realizar 2 visitas territoriais", responsible: "Social", status: "pendente", evidence: "Fotos e Relatório de Viagem", completed: false, sectorId: "social" },
      { id: "task-redes-05-1", label: "Firmar 2 parcerias", responsible: "Parcerias", status: "pendente", evidence: "Termos de Parceria assinados", completed: false, sectorId: "redes" },
      { id: "task-curadoria-05-1", label: "Produzir 5 conteúdos científicos", responsible: "Curadoria", status: "pendente", evidence: "Textos base", completed: false, sectorId: "curadoria" },
      { id: "task-tech-05-1", label: "Criar área de upload de conteúdos", responsible: "Tecnologia", status: "pendente", evidence: "Módulo ativo", completed: false, sectorId: "tech" }
    ]
  },
  {
    id: "sp-2026-06",
    monthName: "🗓️ JUNHO 2026 — Expansão Controlada",
    year: 2026,
    sector: "ALL",
    tasks: [
      { id: "task-adm-06-1", label: "Avaliação trimestral (Q1)", responsible: "Coordenação", status: "pendente", evidence: "Relatório Q1", completed: false, sectorId: "cgp" },
      { id: "task-ascom-06-1", label: "Expandir para TikTok", responsible: "ASCOM", status: "pendente", evidence: "Perfil ativo e 1º vídeo", completed: false, sectorId: "ascom" },
      { id: "task-ascom-06-2", label: "Produzir 8 vídeos (TikTok/Reels)", responsible: "ASCOM", status: "pendente", evidence: "Links dos vídeos", completed: false, sectorId: "ascom" },
      { id: "task-acess-06-1", label: "Lançar glossário de Libras (Beta)", responsible: "Acessibilidade", status: "pendente", evidence: "Link do glossário funcional", completed: false, sectorId: "acessibilidade" },
      { id: "task-plan-06-1", label: "Analisar desempenho comparativo", responsible: "Planejamento", status: "pendente", evidence: "Gráficos de evolução", completed: false, sectorId: "plan" },
      { id: "task-curadoria-06-1", label: "Iniciar estrutura do glossário", responsible: "Curadoria", status: "pendente", evidence: "Esqueleto do sistema", completed: false, sectorId: "curadoria" },
      { id: "task-social-06-1", label: "Consolidar diagnóstico territorial", responsible: "Social", status: "pendente", evidence: "Documento Final do Diagnóstico", completed: false, sectorId: "social" },
      { id: "task-tech-06-1", label: "Otimizar dashboard de monitoramento", responsible: "Tecnologia", status: "pendente", evidence: "Logs de performance", completed: false, sectorId: "tech" }
    ]
  },
  {
    id: "sp-2026-07",
    monthName: "🗓️ JULHO 2026 — Ajuste e Consolidação",
    year: 2026,
    sector: "ALL",
    tasks: [
      { id: "task-adm-07-1", label: "Reunião estratégica geral", responsible: "Coordenação", status: "pendente", evidence: "Ata assinada", completed: false, sectorId: "cgp" },
      { id: "task-ascom-07-1", label: "Criar campanha temática", responsible: "ASCOM", status: "pendente", evidence: "Materiais da campanha", completed: false, sectorId: "ascom" },
      { id: "task-ascom-07-2", label: "Produzir série de conteúdos", responsible: "ASCOM", status: "pendente", evidence: "Playlist/Série", completed: false, sectorId: "ascom" },
      { id: "task-acess-07-1", label: "Criar guia de acessibilidade", responsible: "Acessibilidade", status: "pendente", evidence: "E-book/PDF", completed: false, sectorId: "acessibilidade" },
      { id: "task-plan-07-1", label: "Revisar indicadores de impacto", responsible: "Planejamento", status: "pendente", evidence: "KPIs atualizados", completed: false, sectorId: "plan" },
      { id: "task-tech-07-1", label: "Manutenção de segurança (Patch Q2)", responsible: "Tecnologia", status: "pendente", evidence: "Relatório de Vulnerabilidade", completed: false, sectorId: "tech" }
    ]
  },
  {
    id: "sp-2026-08",
    monthName: "🗓️ AGOSTO 2026 — Ritmo Alto de Produção",
    year: 2026,
    sector: "ALL",
    tasks: [
      { id: "task-ascom-08-1", label: "Lançamento no YouTube", responsible: "ASCOM", status: "pendente", evidence: "Vídeo institucional longo", completed: false, sectorId: "ascom" },
      { id: "task-acess-08-1", label: "Treinamento de Equipe (Audiodescrição)", responsible: "Acessibilidade", status: "pendente", evidence: "Certificados de participação", completed: false, sectorId: "acessibilidade" },
      { id: "task-curadoria-08-1", label: "Glossário Científico Beta", responsible: "Curadoria", status: "pendente", evidence: "Módulo funcional", completed: false, sectorId: "curadoria" },
      { id: "task-social-08-1", label: "Ações presenciais contínuas", responsible: "Social", status: "pendente", evidence: "Diário de Campo", completed: false, sectorId: "social" },
      { id: "task-plan-08-1", label: "Auditoria interna de processos", responsible: "Planejamento", status: "pendente", evidence: "Relatório de Auditoria", completed: false, sectorId: "plan" }
    ]
  },
  {
    id: "sp-2026-09",
    monthName: "🗓️ SETEMBRO 2026 — Campanhas de Impacto",
    year: 2026,
    sector: "ALL",
    tasks: [
      { id: "task-plan-09-1", label: "Gerar Relatório Q2", responsible: "Planejamento", status: "pendente", evidence: "Relatório técnico consolidado", completed: false, sectorId: "plan" },
      { id: "task-ascom-09-1", label: "Campanhas de impacto social", responsible: "ASCOM", status: "pendente", evidence: "Alcance das campanhas", completed: false, sectorId: "ascom" },
      { id: "task-redes-09-1", label: "Expansão de parcerias privadas", responsible: "Parcerias", status: "pendente", evidence: "Novos contratos", completed: false, sectorId: "redes" },
      { id: "task-tech-09-1", label: "Integrar API de Metadados", responsible: "Tecnologia", status: "pendente", evidence: "Endpoints documentados", completed: false, sectorId: "tech" }
    ]
  },
  {
    id: "sp-2026-10",
    monthName: "🗓️ OUTUBRO 2026 — Consolidação Institucional",
    year: 2026,
    sector: "ALL",
    tasks: [
      { id: "task-ascom-10-1", label: "Entrada no LinkedIn", responsible: "ASCOM", status: "pendente", evidence: "Perfil corporativo ativo", completed: false, sectorId: "ascom" },
      { id: "task-adm-10-1", label: "Documentação de impacto social", responsible: "Coordenação", status: "pendente", evidence: "Dossiê de Impacto", completed: false, sectorId: "cgp" },
      { id: "task-acess-10-1", label: "Padrão de tradução acadêmica JSL", responsible: "Acessibilidade", status: "pendente", evidence: "Diretrizes Publicadas", completed: false, sectorId: "acessibilidade" }
    ]
  },
  {
    id: "sp-2026-11",
    monthName: "🗓️ NOVEMBRO 2026 — Fortalecimento de Autoridade",
    year: 2026,
    sector: "ALL",
    tasks: [
      { id: "task-adm-11-1", label: "Consolidação de rede", responsible: "Coordenação", status: "pendente", evidence: "Mapa de Stakeholders", completed: false, sectorId: "cgp" },
      { id: "task-plan-11-1", label: "Produção de relatório social", responsible: "Planejamento", status: "pendente", evidence: "Relatório Social Publicado", completed: false, sectorId: "plan" },
      { id: "task-social-11-1", label: "Seminário Territorial (Resultados)", responsible: "Social", status: "pendente", evidence: "Lista de presença e Fotos", completed: false, sectorId: "social" }
    ]
  },
  {
    id: "sp-2026-12",
    monthName: "🗓️ DEZEMBRO 2026 — Retrospectiva e Revisão",
    year: 2026,
    sector: "ALL",
    tasks: [
      { id: "task-adm-12-1", label: "Relatório anual parcial", responsible: "Coordenação", status: "pendente", evidence: "Relatório Anual 2026", completed: false, sectorId: "cgp" },
      { id: "task-ascom-12-1", label: "Retrospectiva pública", responsible: "ASCOM", status: "pendente", evidence: "Live/Evento Digital", completed: false, sectorId: "ascom" },
      { id: "task-curadoria-12-1", label: "Revisão geral de conteúdos", responsible: "Curadoria", status: "pendente", evidence: "Acervo revisado", completed: false, sectorId: "curadoria" },
      { id: "task-tech-12-1", label: "Backup Anual e Cloud Clean-up", responsible: "Tecnologia", status: "pendente", evidence: "Relatório de armazenamento", completed: false, sectorId: "tech" }
    ]
  },
  {
    id: "sp-2027-01",
    monthName: "🗓️ JANEIRO 2027 — Planejamento Leve",
    year: 2027,
    sector: "ALL",
    tasks: [
      { id: "task-adm-01-1", label: "Planejamento leve e organização", responsible: "Coordenação", status: "pendente", evidence: "Cronograma Q1/2027", completed: false, sectorId: "cgp" },
      { id: "task-tech-01-1", label: "Ajustes técnicos e performance", responsible: "Tecnologia", status: "pendente", evidence: "Relatório de Otimização", completed: false, sectorId: "tech" },
      { id: "task-plan-01-1", label: "Revisão de Metas 2027", responsible: "Planejamento", status: "pendente", evidence: "Novo Quadro de KPIs", completed: false, sectorId: "plan" }
    ]
  },
  {
    id: "sp-2027-02",
    monthName: "🗓️ FEVEREIRO 2027 — Retomada Total",
    year: 2027,
    sector: "ALL",
    tasks: [
      { id: "task-adm-02-1", label: "Retomada operacional total", responsible: "Coordenação", status: "pendente", evidence: "100% dos setores ativos", completed: false, sectorId: "cgp" },
      { id: "task-ascom-02-1", label: "Nova campanha de crescimento", responsible: "ASCOM", status: "pendente", evidence: "Métricas de crescimento", completed: false, sectorId: "ascom" },
      { id: "task-acess-02-1", label: "Atualizar Manuais de Linguagem", responsible: "Acessibilidade", status: "pendente", evidence: "Documentos revisados", completed: false, sectorId: "acessibilidade" }
    ]
  },
  {
    id: "sp-2027-03",
    monthName: "🗓️ MARÇO 2027 — Preparação de Encerramento",
    year: 2027,
    sector: "ALL",
    tasks: [
      { id: "task-adm-03-1", label: "Preparação de encerramento", responsible: "Coordenação", status: "pendente", evidence: "Plano de Desmobilização", completed: false, sectorId: "cgp" },
      { id: "task-plan-03-1", label: "Consolidação de dados e impacto", responsible: "Planejamento", status: "pendente", evidence: "Relatório de Metas Batidas", completed: false, sectorId: "plan" },
      { id: "task-tech-03-1", label: "Preparar repositório para handover", responsible: "Tecnologia", status: "pendente", evidence: "Github/Drive organizado", completed: false, sectorId: "tech" }
    ]
  },
  {
    id: "sp-2027-04",
    monthName: "🗓️ ABRIL 2027 — Fechamento e Resultados",
    year: 2027,
    sector: "ALL",
    tasks: [
      { id: "task-adm-04-final", label: "Relatório Final e Prestação de Contas", responsible: "Coordenação", status: "pendente", evidence: "Dossiê Final Protocolado", completed: false, sectorId: "cgp" },
      { id: "task-ascom-04-final", label: "Divulgação de resultados finais", responsible: "ASCOM", status: "pendente", evidence: "Documentário/Relatório Social", completed: false, sectorId: "ascom" },
      { id: "task-curadoria-04-final", label: "Entrega de produtos finais científicos", responsible: "Curadoria", status: "pendente", evidence: "Livro/E-book final", completed: false, sectorId: "curadoria" },
      { id: "task-social-04-final", label: "Feedback com as comunidades", responsible: "Social", status: "pendente", evidence: "Ata de devolutiva social", completed: false, sectorId: "social" }
    ]
  }
];

export const projectTasks: ProjectTask[] = [];

export interface GoalLog {
  id: string;
  month: string;
  description: string;
  progressPercent: number; // Percentual que esse log representa do total (calculado ou manual)
  value?: number;          // Valor absoluto alcançado (opcional, ex: 3 municípios)
  createdAt: string;
}

export interface ProjectGoal {
  id: string;
  description: string;
  progress: number;
  status: 'planejado' | 'em_andamento' | 'concluido' | 'atencao';
  targetValue?: number;
  unit: string;
  logs: { date: string; value: number; note: string }[];
}

export interface ProjectObjective {
  id: string;
  title: string;
  description: string;
  goals: ProjectGoal[];
  products: string[];
  impact: string;
  iconName: 'book' | 'users' | 'flask' | 'sprout' | 'megaphone';
}

export const projectObjectives: ProjectObjective[] = [
  {
    id: 'obj1',
    title: 'Educação e Formação Interdisciplinar',
    description: 'Promover a formação continuada de professores e agricultores familiares, focando em segurança alimentar e inovação social.',
    iconName: 'book',
    goals: [
      { id: 'g1-1', description: 'Realizar 13 oficinas municipais', progress: 0, status: 'planejado', targetValue: 13, unit: 'oficinas', logs: [{ date: '2026-03-20', value: 0, note: 'Planejamento concluído' }] },
      { id: 'g1-2', description: 'Atender 500 agricultores familiares', progress: 0, status: 'planejado', targetValue: 500, unit: 'pessoas', logs: [] },
      { id: 'g1-3', description: 'Distribuir material didático adaptado', progress: 0, status: 'planejado', targetValue: 150, unit: 'kits', logs: [] }
    ],
    products: ['13 oficinas municipais', 'Material didático adaptado'],
    impact: 'Fortalecimento da base produtiva e educacional do território.'
  },
  {
    id: 'obj2',
    title: 'Tecnologia, Plataforma e Dados',
    description: 'Desenvolver e manter o ecossistema digital Rede Inova, garantindo acessibilidade plena e inteligência de dados.',
    iconName: 'flask',
    goals: [
      { id: 'g2-1', description: 'Lançar Dashboard de Governança', progress: 100, status: 'concluido', targetValue: 1, unit: 'sistema', logs: [{ date: '2026-04-18', value: 1, note: 'Módulo Principal Ativo' }] },
      { id: 'g2-2', description: 'Acessibilidade em 100% das páginas', progress: 85, status: 'em_andamento', targetValue: 100, unit: 'porcentagem', logs: [] },
      { id: 'g2-3', description: 'Integrar 5 núcleos territoriais', progress: 20, status: 'em_andamento', targetValue: 5, unit: 'núcleos', logs: [] }
    ],
    products: ['Portal Web', 'Dashboard de Governança', 'API de Dados'],
    impact: 'Soberania tecnológica e inclusão digital para comunidades rurais.'
  },
  {
    id: 'obj3',
    title: 'Impacto Social e Territorial',
    description: 'Dar voz às comunidades do Médio Sudoeste Baiano através de escuta qualificada e diagnósticos participativos.',
    iconName: 'users',
    goals: [
      { id: 'g3-1', description: 'Mapear 15 instituições estratégicas', progress: 60, status: 'em_andamento', targetValue: 15, unit: 'instituições', logs: [] },
      { id: 'g3-2', description: 'Realizar 2 visitas territoriais mensais', progress: 30, status: 'atencao', targetValue: 24, unit: 'visitas', logs: [] },
      { id: 'g3-3', description: 'Consolidar diagnóstico territorial', progress: 0, status: 'planejado', targetValue: 1, unit: 'relatório', logs: [] }
    ],
    products: ['Mapa de Atores Sociais', 'Relatório de Vulnerabilidades'],
    impact: 'Fortalecimento do protagonismo local e das redes territoriais.'
  },
  {
    id: 'obj4',
    title: 'Comunicação e Difusão Social',
    description: 'Gerar e difundir conhecimento em linguagem acessível, democratizando a ciência e as ações do projeto.',
    iconName: 'megaphone',
    goals: [
      { id: 'g4-1', description: 'Publicar 12 boletins mensais', progress: 10, status: 'em_andamento', targetValue: 12, unit: 'boletins', logs: [] },
      { id: 'g4-2', description: 'Produzir série "Vozes do Campo"', progress: 5, status: 'planejado', targetValue: 6, unit: 'vídeos', logs: [] },
      { id: 'g4-3', description: 'Expandir presença para TikTok/YouTube', progress: 40, status: 'em_andamento', targetValue: 4, unit: 'canais', logs: [] }
    ],
    products: ['Boletins Mensais', 'Série Documental "Vozes do Campo"', 'Cards Redes'],
    impact: 'Aumento da visibilidade institucional e engajamento público.'
  },
  {
    id: 'obj5',
    title: 'Governança e Célula de Comando',
    description: 'Assegurar a transparência absoluta e a integridade administrativa de todas as ações e recursos públicos.',
    iconName: 'sprout',
    goals: [
      { id: 'g5-1', description: 'Garantir 100% de transparência financeira', progress: 100, status: 'concluido', targetValue: 100, unit: 'contas', logs: [] },
      { id: 'g5-2', description: 'Emitir relatórios executivos trimestrais', progress: 25, status: 'em_andamento', targetValue: 4, unit: 'relatórios', logs: [] },
      { id: 'g5-3', description: 'Monitorar KPIs em tempo real', progress: 90, status: 'em_andamento', targetValue: 1, unit: 'indicadores', logs: [] }
    ],
    products: ['Painel de Transparência', 'Relatórios Executivos Trimestrais'],
    impact: 'Credibilidade institucional e eficiência no uso de recursos públicos.'
  }
];

export const news: News[] = [
  {
    id: 'news-1',
    title: 'Lançamento do Portal Rede Inova',
    excerpt: 'O novo portal de governança e inovação social foi lançado oficialmente.',
    content: 'O novo portal de governança e inovação social foi lançado oficialmente para o Médio Sudoeste Baiano.',
    date: '18/04/2026',
    category: 'INSTITUCIONAL',
    tag: 'Destaque',
    tagColor: 'bg-primary',
    image: '/news/launch.jpg',
    author: 'Coordenação Geral',
    publishedAt: '2026-04-18T10:00:00Z',
    status: 'active',
    imagePlaceholderId: '1'
  },
  {
    id: 'news-2',
    title: 'Oficinas de Segurança Alimentar',
    excerpt: 'Iniciamos o ciclo de oficinas formativas com agricultores familiares.',
    content: 'Iniciamos o ciclo de oficinas formativas com agricultores familiares da região.',
    date: '15/04/2026',
    category: 'EDUCAÇÃO',
    tag: 'Campo',
    tagColor: 'bg-green-600',
    image: '/news/oficinas.jpg',
    author: 'Setor de Educação',
    publishedAt: '2026-04-15T14:30:00Z',
    status: 'active',
    imagePlaceholderId: '2'
  }
];
export const communityLeaders: CommunityLeader[] = [];

export const territories: Territory[] = [
  { id: 't-1', name: 'Quilombo Boa Vista', municipality: 'Curimataú', region: 'Agreste', status: 'em_escuta', leadersCount: 5 },
  { id: 't-2', name: 'Assentamento Novo Horizonte', municipality: 'Bananeiras', region: 'Brejo', status: 'identificado', leadersCount: 3 }
];
export const sectorActivities: SectorActivity[] = [];
export const communityEvents: any[] = [];
export const fairs: any[] = [];
export interface AuthoralMaterial {
  id: string;
  title: string;
  type: 'infográfico' | 'cartilha' | 'vídeo' | 'podcast' | 'artigo';
  description: string;
  content: string; // Adicionado para compatibilidade com o leitor
  url: string;
  librasVideoUrl?: string; // Adicionado
  audioUrl?: string; // Adicionado
  thumbnail: string;
  author: string;
  imagePlaceholderId?: string; // Adicionado
  createdAt: string;
}

export interface ProjectUpdate {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: 'lightbulb' | 'zap' | 'flask';
}

export const projectUpdates: ProjectUpdate[] = [
  {
    id: 'upd-1',
    title: 'Novo Módulo de Governança',
    description: 'Lançamos a camada de supervisão executiva para maior transparência.',
    category: 'SISTEMA',
    icon: 'zap'
  }
];

export const authoralMaterials: AuthoralMaterial[] = [
  {
    id: 'GUIA-01',
    title: 'Guia Prático de Segurança Alimentar no Campo',
    type: 'cartilha',
    description: 'Um manual detalhado sobre boas práticas de higiene e manipulação de alimentos voltado para agricultores familiares.',
    content: 'Este guia apresenta as normas básicas de higiene... (Conteúdo completo para leitura acessível)',
    url: '#',
    thumbnail: '/materials/guia-seguranca.jpg',
    author: 'Equipe LISSA - Curadoria Científica',
    imagePlaceholderId: '2',
    createdAt: '2026-04-20T10:00:00Z'
  },
  {
    id: 'INFO-02',
    title: 'Infográfico: O Ciclo da Soberania Alimentar',
    type: 'infográfico',
    description: 'Visualização esquemática dos pilares da soberania alimentar e seu impacto no território do Médio Sudoeste.',
    content: 'Infográfico visual descrevendo o fluxo da produção local até o consumo consciente.',
    url: '#',
    thumbnail: '/materials/info-soberania.jpg',
    author: 'Equipe LISSA - Inovação Social',
    imagePlaceholderId: '1',
    createdAt: '2026-04-22T14:30:00Z'
  },
  {
    id: 'BOOK-03',
    title: 'E-book: Inovação Social e Redes Territoriais',
    type: 'artigo',
    description: 'Um mergulho teórico e prático sobre como a tecnologia pode fortalecer as redes de solidariedade no campo.',
    content: 'O presente artigo discute a interseção entre tecnologia e soberania...',
    url: '#',
    thumbnail: '/materials/ebook-inovacao.jpg',
    author: 'Rede Inova Social',
    imagePlaceholderId: '3',
    createdAt: '2026-04-25T09:00:00Z'
  }
];
export const bastidoresItems: any[] = [];
export const teamEvents: any[] = [];
export const librasOriginals: any[] = [];
export const librasShorts: any[] = [];
export const librasDocs: any[] = [];

export const librasGlossary: any[] = [
  {
    id: 'fundamentacao',
    title: 'Fundamentação',
    emoji: '🤟',
    description: 'Bases da mediação e tradução em Libras no contexto científico.',
    terms: [
      {
        term: 'Classificador',
        description: 'Mecanismo gramatical da Libras que descreve propriedades físicas ou movimento.',
        videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        context: 'Usado para descrever a textura de alimentos ou fluxo de substâncias.',
        related: ['Gramática', 'Visual-Espacial']
      }
    ]
  },
  {
    id: 'imunologico-digestivo',
    title: 'Imunológico-Digestivo',
    emoji: '🧬',
    description: 'Termos técnicos sobre o sistema imunológico e digestivo.',
    terms: []
  },
  {
    id: 'rotulagem-tecnica',
    title: 'Rotulagem Técnica',
    emoji: '🏷️',
    description: 'A ciência por trás dos rótulos e normas alimentares.',
    terms: []
  },
  {
    id: 'analise-critica',
    title: 'Análise Crítica',
    emoji: '⚖️',
    description: 'Reflexões sobre soberania e direitos alimentares.',
    terms: []
  },
  {
    id: 'soberania-alimentar',
    title: 'Soberania Alimentar',
    emoji: '🌾',
    description: 'O direito dos povos à alimentação saudável e sustentável.',
    terms: []
  }
];

export const librasPills: any[] = [
  {
    id: 'pill-1',
    title: 'O que é SAN?',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    practicalApp: 'Identificar a segurança alimentar na merenda escolar.',
    category: 'Segurança Alimentar'
  }
];

export const librasTracks: any[] = [
  {
    id: 'track-1',
    title: 'Introdução à Mediação Científica',
    description: 'Aprenda as bases da tradução de conceitos complexos.',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    questions: [
      {
        question: 'O que é um classificador na Libras?',
        options: ['Um tipo de sinal icônico', 'Um recurso de dactilologia', 'Uma marca de plural'],
        correct: 0
      }
    ]
  }
];

// ScientificFragment interface moved/consolidated below

export interface GlossaryTerm {
  term: string;
  description: string;
  videoUrl?: string;
  examples?: string[];
  related?: string[];
}

export interface LibrasVideo {
  id: string;
  title: string;
  url: string;
  category: string;
}

export interface TeamEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  type: string;
}

export interface BastidorItem {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'foto';
  videoUrl?: string;
  imagePlaceholderId?: string;
  category: string;
}

export interface ScientificFragment {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  thumbnail?: string;
  category: string;
  axisId: string;
  isNew?: boolean;
}

export interface SocialPost {
  id: string;
  title: string;
  caption: string;
  platform: 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'whatsapp' | 'geral';
  scheduledDate: string;
  imagePlaceholderId?: string;
  thumbnailUrl?: string;
  status: 'planning' | 'scheduled' | 'published';
  createdAt: string;
}

export const socialPosts: SocialPost[] = [];

export const scientificFragments: ScientificFragment[] = [];
