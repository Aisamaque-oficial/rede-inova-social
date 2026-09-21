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
  avatarUrl: u.avatarUrl,
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
export const communityEvents: any[] = [
  // REALIZADOS
  {
    id: 'evt-2',
    title: 'Reunião Nós/Nordeste (Linhas 1 e 2)',
    type: 'Reunião Estratégica',
    status: 'realizado',
    date: '2026-06-09',
    dateDisplay: 'Dia 09/06/2026, às 14h',
    duration: '2h',
    audience: 'Coordenadores de projetos (Linhas 1 e 2 - CNPq 17/2025)',
    content: 'Reunião em rede para dialogar na construção conectada de informações com vistas à segurança alimentar e nutricional. Organizada pelo Nós-Nordeste 1 (AL, BA, PE e SE).',
    impact: 'O projeto Rede de Inovação Social esteve presente representado pelo Coordenador Aisamaque Gomes. Integração regional das pesquisas e fortalecimento da rede.',
    product: 'Ata de Reunião e Registro Fotográfico',
    imageUrl: '/eventos/reuniao-nos-nordeste.jpeg',
    imagePosition: 'object-center',
    gallery: [
      '/eventos/reuniao-nos-nordeste.jpeg'
    ]
  },
  {
    id: 'evt-18',
    title: 'Capacitação para acesso à Política de Garantia de Preço Mínimo - PGPM',
    type: 'Capacitação',
    status: 'realizado',
    date: '2026-06-03',
    dateDisplay: 'Dia 03/06/2026',
    duration: 'Integral',
    audience: 'Pequenos produtores e agricultores familiares',
    content: 'Temas abordados: 1) PGPM SocioBio Mais, 2) ProVB, 3) SICAN, 4) AGF. Foco em direcionar pequenos produtores para acessar as Políticas do Governo Federal.',
    impact: 'Conhecimento da necessidade dos pequenos produtores e agricultores familiares na participação de Políticas Públicas promovidas pelo Governo Federal.',
    product: 'Formação em Políticas Públicas',
    imageUrl: '/eventos/pgpm-1.jpeg',
    imagePosition: 'object-center',
    gallery: [
      '/eventos/pgpm-1.jpeg',
      '/eventos/pgpm-2.jpeg',
      '/eventos/pgpm-3.jpeg',
      '/eventos/pgpm-4.jpeg'
    ]
  },
  {
    id: 'evt-1',
    title: 'Exposição Agropecuária de Itapetinga',
    type: 'Visita Técnica / Evento',
    status: 'realizado',
    date: '2026-06-20',
    dateDisplay: 'Dias 20 a 24/06/2026',
    duration: 'Integral',
    audience: 'Pequenos produtores, empresas e agricultores(as) familiares',
    content: 'Conhecer e incentivar o ecossistema agropecuário e a produção local.',
    impact: 'Aproximação institucional e levantamento de necessidades do produtor.',
    product: 'Registro Fotográfico e Relatório',
    imageUrl: '/eventos/foto-expo-2.jpg.jpeg',
    imagePosition: 'object-[center_25%]',
    gallery: [
      '/eventos/foto-expo-1.jpg.jpeg',
      '/eventos/foto-expo-2.jpg.jpeg',
      '/eventos/foto-expo-3.jpg.jpeg',
      '/eventos/foto-expo-4.jpeg',
      '/eventos/foto-expo-5.jpeg'
    ]
  },
  // PREVISTOS - COM DATA
  {
    id: 'evt-3',
    title: 'Reunião CGP x Agricultura Familiar',
    type: 'Reunião Externa',
    status: 'previsto',
    date: '2026-06-11',
    duration: 'A definir',
    audience: 'Representantes da Agricultura Familiar em Itororó',
    content: 'Diálogo sobre fomento e inserção no projeto.',
    impact: 'Expansão do alcance territorial.',
    product: 'Termo de Parceria'
  },
  {
    id: 'evt-4',
    title: 'Reunião com Representante OSC',
    type: 'Reunião Externa',
    status: 'previsto',
    date: '2026-06-12',
    duration: 'A definir',
    audience: 'Organizações da Sociedade Civil',
    content: 'Apresentação do projeto e busca de cooperação técnica.',
    impact: 'Engajamento da sociedade civil.',
    product: 'Ata de Reunião'
  },
  {
    id: 'evt-5',
    title: 'Conexão Café',
    type: 'Evento de Campo',
    status: 'previsto',
    date: '2026-06-13',
    duration: 'Integral',
    audience: 'Produtores de Café e Comunidade',
    content: 'Visita e vivência na Fazenda Vidigal.',
    impact: 'Valorização da cadeia produtiva do café.',
    product: 'Registros e Portfólio'
  },
  {
    id: 'evt-6',
    title: 'Oficina de Rotulagem',
    type: 'Capacitação',
    status: 'previsto',
    date: '2026-06-14',
    duration: '4h',
    audience: 'Agricultores familiares de Caatiba',
    content: 'Normas de rotulagem e boas práticas para comercialização.',
    impact: 'Adequação de produtos para venda formal.',
    product: 'Certificados e Fotos'
  },
  {
    id: 'evt-7',
    title: 'Reunião CGP x Projeto NECTAR (UESB)',
    type: 'Reunião Estratégica',
    status: 'previsto',
    date: '2026-06-16',
    duration: '2h',
    audience: 'Coordenação e Pesquisadores UESB',
    content: 'Sinergia entre laboratórios e extensão.',
    impact: 'Parceria interinstitucional (IF Baiano e UESB).',
    product: 'Acordo de Cooperação'
  },
  {
    id: 'evt-8',
    title: 'Reunião CGP x Movimento de Mulheres',
    type: 'Reunião Externa',
    status: 'previsto',
    date: '2026-06-18',
    duration: 'A definir',
    audience: 'Movimento de Mulheres de Itapetinga',
    content: 'Inclusão de gênero e autonomia financeira na agricultura.',
    impact: 'Empoderamento feminino territorial.',
    product: 'Ata de Reunião'
  },
  {
    id: 'evt-9',
    title: 'Reunião CGP x Movimento Coletivo Afro',
    type: 'Reunião Externa',
    status: 'previsto',
    date: '2026-06-19',
    duration: 'A definir',
    audience: 'Comunidade Afrodescendente de Itapetinga',
    content: 'Políticas afirmativas e segurança alimentar.',
    impact: 'Inclusão e diversidade no escopo do projeto.',
    product: 'Ata de Reunião'
  },
  {
    id: 'evt-10',
    title: 'Exposição do Chocolate (Ilhéus)',
    type: 'Evento Externo',
    status: 'previsto',
    date: '2026-07-22',
    duration: '5 dias (22 a 26 de Julho)',
    audience: 'Público Geral e Produtores de Cacau',
    content: 'Exibição de tecnologias sociais e subprodutos.',
    impact: 'Visibilidade estadual e nacional.',
    product: 'Registros Visuais'
  },
  {
    id: 'evt-11',
    title: 'Simpósio Pós-Graduação (Eng. e Ciênc. de Alimentos)',
    type: 'Evento Científico',
    status: 'previsto',
    date: '2026-08-13',
    duration: '2 dias (13 e 14 de Agosto)',
    audience: 'Acadêmicos e Pesquisadores',
    content: 'Participação do projeto na difusão científica.',
    impact: 'Publicações e Networking.',
    product: 'Anais do Evento'
  },
  {
    id: 'evt-12',
    title: 'Apresentação no CBCTA',
    type: 'Congresso Nacional',
    status: 'previsto',
    date: '2026-11-09',
    duration: 'A definir',
    audience: 'Comunidade Científica Nacional',
    content: 'Apresentação de resultados preliminares.',
    impact: 'Validação acadêmica em nível nacional.',
    product: 'Artigo e Pôster'
  },
  
  // PREVISTOS - SEM DEFINIÇÃO DE DATA EXATA
  {
    id: 'evt-13',
    title: 'Reunião CGP x Quilombo dos Thiagos',
    type: 'Articulação Territorial',
    status: 'previsto',
    date: 'A definir (2026)',
    duration: 'A definir',
    audience: 'Comunidade Quilombola',
    content: 'Escuta ativa e resgate alimentar.',
    impact: 'Reconhecimento e apoio aos povos tradicionais.',
    product: 'Ata de Reunião e Imagens'
  },
  {
    id: 'evt-14',
    title: 'Reunião CGP x Quilombo Jussara',
    type: 'Articulação Territorial',
    status: 'previsto',
    date: 'A definir (2026)',
    duration: 'A definir',
    audience: 'Comunidade Quilombola',
    content: 'Escuta ativa e resgate alimentar.',
    impact: 'Reconhecimento e apoio aos povos tradicionais.',
    product: 'Ata de Reunião e Imagens'
  },
  {
    id: 'evt-15',
    title: 'Congresso Final do CNPq',
    type: 'Evento de Encerramento',
    status: 'previsto',
    date: 'A definir (2026)',
    duration: 'A definir',
    audience: 'MCTI, CNPq e Público',
    content: 'Apresentar resultados finais do projeto.',
    impact: 'Prestação de contas e vitrine tecnológica.',
    product: 'Relatório Final'
  },
  {
    id: 'evt-16',
    title: 'Feiras de Agricultura Familiar nas Escolas',
    type: 'Extensão / Evento',
    status: 'previsto',
    date: 'Contínuo (2026)',
    duration: 'Mensal',
    audience: 'Estudantes e Comunidade Escolar',
    content: 'Promoção do consumo saudável no ambiente escolar.',
    impact: 'Educação nutricional na base.',
    product: 'Feiras Realizadas'
  },
  {
    id: 'evt-17',
    title: 'Oficinas e Minicursos Territoriais',
    type: 'Capacitação',
    status: 'previsto',
    date: 'Contínuo (2026)',
    duration: 'Múltiplos',
    audience: '13 municípios do território',
    content: 'Disseminação de técnicas de beneficiamento de alimentos.',
    impact: 'Elevação da renda local e redução do desperdício.',
    product: 'Lista de Presença e Fotos'
  }
];

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

export const projectMilestones = [
  { id: 'm1', label: 'Marco 1: Diagnóstico', completed: true, details: 'Levantamento de demandas territoriais finalizado em Janeiro.' },
  { id: 'm2', label: 'Marco 2: Prototipação', completed: true, details: 'Criação dos laboratórios de inovação em Alimentos.' },
  { id: 'm3', label: 'Marco 3: Escalonamento', completed: false, details: 'Disseminação das tecnologias sociais para associações.' },
  { id: 'm4', label: 'Marco 4: Avaliação de Impacto', completed: false, details: 'Mensuração dos indicadores de aumento de renda.' },
];

export const recentActivities = [
  { id: 'a1', action: 'Publicação de Cartilha', target: 'Boas Práticas de Fabricação', time: 'Há 2 horas', user: 'ASCOM' },
  { id: 'a2', action: 'Aprovação de Relatório', target: 'Articulação Quilombola', time: 'Ontem', user: 'Coordenação' },
  { id: 'a3', action: 'Nova Inscrição', target: 'Oficina de Rotulagem', time: 'Há 2 dias', user: 'Sistema' },
];

export const activeMembersCount = 24;
export const partnersCount = 12;

export const teamEvents: any[] = [
  { id: 't-1', title: 'Reunião Nós/Nordeste', date: '2026-06-09', type: 'reuniao', description: 'Linhas 1 e 2 CNPq' },
  { id: 't-2', title: 'Reunião com Agricultura Familiar', date: '2026-06-11', type: 'reuniao', description: 'Itororó' },
  { id: 't-3', title: 'Reunião OSC', date: '2026-06-12', type: 'reuniao', description: 'Com representante da Sociedade Civil' },
  { id: 't-4', title: 'Conexão Café', date: '2026-06-13', type: 'atividade', description: 'Fazenda Vidigal' },
  { id: 't-5', title: 'Oficina de Rotulagem', date: '2026-06-14', type: 'atividade', description: 'Caatiba' },
  { id: 't-6', title: 'Reunião NECTAR', date: '2026-06-16', type: 'reuniao', description: 'Com projeto NECTAR / UESB' },
  { id: 't-7', title: 'Reunião Movimento de Mulheres', date: '2026-06-18', type: 'reuniao', description: 'Itapetinga' },
  { id: 't-8', title: 'Reunião Coletivo Afro', date: '2026-06-19', type: 'reuniao', description: 'Itapetinga' },
  { id: 't-9', title: 'Exposição do Chocolate', date: '2026-07-22', type: 'atividade', description: 'Abertura em Ilhéus' },
  { id: 't-10', title: 'Simpósio Pós-Graduação', date: '2026-08-13', type: 'atividade', description: 'Abertura do Simpósio' },
  { id: 't-11', title: 'Apresentação CBCTA', date: '2026-11-09', type: 'atividade', description: 'Congresso Brasileiro' },
  { id: 't-12', title: 'Capacitação PGPM', date: '2026-06-03', type: 'atividade', description: 'Capacitação para acesso à PGPM' },
  { id: 't-13', title: 'Exposição Agropecuária', date: '2026-06-20', type: 'atividade', description: 'Itapetinga' },
  { id: 't-14', title: 'Exposição Agropecuária', date: '2026-06-21', type: 'atividade', description: 'Itapetinga' },
  { id: 't-15', title: 'Exposição Agropecuária', date: '2026-06-22', type: 'atividade', description: 'Itapetinga' },
  { id: 't-16', title: 'Exposição Agropecuária', date: '2026-06-23', type: 'atividade', description: 'Itapetinga' },
  { id: 't-17', title: 'Exposição Agropecuária', date: '2026-06-24', type: 'atividade', description: 'Itapetinga' }
];

export const authoralMaterials: AuthoralMaterial[] = [
  {
    id: 'GUIA-01',
    title: 'Guia Prático de Segurança Alimentar no Campo',
    type: 'cartilha',
    description: 'Um manual detalhado sobre boas práticas de higiene e manipulação de alimentos voltado para agricultores familiares.',
    content: 'Este guia apresenta as normas básicas de higiene... (Conteúdo completo para leitura acessível)',
    url: '/materiais/guia_minimo_viavel.pdf',
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
  },
  {
    id: 'PDF-04',
    title: 'Material instrutivo das diferenças de alimentos',
    type: 'cartilha',
    description: 'Material complementar do glossário para consulta e leitura na íntegra.',
    content: `
      <h2>Classificação dos Alimentos</h2>
      <p>Este material instrutivo detalha as principais diferenças entre as categorias de alimentos, conforme o Guia Alimentar para a População Brasileira. O objetivo é facilitar o entendimento para escolhas mais saudáveis, conscientes e promotoras da Soberania Alimentar.</p>
      
      <h3>1. Alimentos In Natura ou Minimamente Processados</h3>
      <p>São a base para uma alimentação nutricionalmente balanceada. <strong>In natura</strong> são obtidos diretamente da natureza (frutas, folhas, ovos). <strong>Minimamente processados</strong> passaram por limpeza, secagem ou pasteurização, sem adição de sal ou açúcar.</p>
      <ul>
        <li><strong>Exemplos:</strong> Feijão, arroz, legumes, verduras e carnes frescas.</li>
      </ul>

      <h3>2. Ingredientes Culinários Processados</h3>
      <p>Substâncias extraídas da natureza usadas para temperar e cozinhar, criando preparações culinárias variadas.</p>
      <ul>
        <li><strong>Exemplos:</strong> Óleos, gorduras, sal e açúcar.</li>
      </ul>

      <h3>3. Alimentos Processados</h3>
      <p>Produtos fabricados com a adição de sal ou açúcar a alimentos in natura para torná-los mais duráveis. Devem ser consumidos com moderação.</p>
      <ul>
        <li><strong>Exemplos:</strong> Legumes em conserva, queijos e pães tradicionais.</li>
      </ul>

      <h3>4. Alimentos Ultraprocessados</h3>
      <p>Formulações industriais com muitos aditivos químicos (corantes, aromatizantes). São pobres em nutrientes e <strong>devem ser evitados</strong>.</p>
      <ul>
        <li><strong>Exemplos:</strong> Biscoitos recheados, refrigerantes e macarrão instantâneo.</li>
      </ul>
    `,
    url: '/materiais/beide_glossario.pdf',
    librasVideoUrl: 'https://www.youtube.com/embed/avcv3vQBGwA?autoplay=1&mute=1&loop=1',
    thumbnail: '/materials/guia-seguranca.jpg',
    author: 'Equipe LISSA',
    imagePlaceholderId: '4',
    createdAt: '2026-05-23T10:00:00Z'
  }
];
export const bastidoresItems: any[] = [];
export const librasOriginals: any[] = [];
export const librasShorts: any[] = [];
export const librasDocs: any[] = [];

export const librasGlossary: any[] = [
  {
    id: 'fundamentacao',
    numericId: 1,
    title: 'Fundamentação',
    emoji: '🤟',
    description: 'Bases da mediação e tradução em Libras no contexto científico.',
    terms: [
      {
        id: 'term-fund-1',
        term: 'Classificador (CL)',
        description: 'Mecanismo gramatical da Libras que descreve propriedades físicas, formas, texturas ou movimento de elementos.',
        definition: 'Mecanismo gramatical da Libras que descreve propriedades físicas, formas, texturas ou movimento de elementos.',
        videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        video_url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        context: 'Usado para descrever a textura de alimentos, fluxo de substâncias líquidas ou distribuição anatômica de nutrientes.',
        signStrategy: 'Utilizar configurações de mão que reproduzam a consistência ou forma física do alimento (pasta, grão, líquido).',
        sign_strategy: 'Utilizar configurações de mão que reproduzam a consistência ou forma física do alimento (pasta, grão, líquido).',
        tags: ['Gramática', 'Visual-Espacial', 'Fundamentação', 'Linguística'],
        axis_id: 1
      },
      {
        id: 'term-fund-2',
        term: 'Configuração de Mão (CM)',
        description: 'A forma ou molde assumido pela mão durante a produção articulatória do sinal em Libras.',
        definition: 'A forma ou molde assumido pela mão durante a produção articulatória do sinal em Libras.',
        videoUrl: '',
        video_url: '',
        context: 'Fundamental para a precisão técnica e diferenciação semântica entre termos científicos de nutrição e bioquímica.',
        signStrategy: 'Atenção rigorosa ao posicionamento anatômico dos dedos para evitar ambiguidade com termos de uso cotidiano.',
        sign_strategy: 'Atenção rigorosa ao posicionamento anatômico dos dedos para evitar ambiguidade com termos de uso cotidiano.',
        tags: ['Parâmetros Fonológicos', 'Morfologia', 'Fundamentação'],
        axis_id: 1
      },
      {
        id: 'term-fund-3',
        term: 'Ponto de Articulação (PA)',
        description: 'Local no espaço neutro ou na superfície do corpo do sinalizador onde o sinal é executado.',
        definition: 'Local no espaço neutro ou na superfície do corpo do sinalizador onde o sinal é executado.',
        videoUrl: '',
        video_url: '',
        context: 'Posicionamento espacial de órgãos internos, estômago, intestino ou conceitos abstratos de soberania.',
        signStrategy: 'Articulação próxima à região torácica ou abdominal quando referente à fisiologia da digestão.',
        sign_strategy: 'Articulação próxima à região torácica ou abdominal quando referente à fisiologia da digestão.',
        tags: ['Parâmetros Fonológicos', 'Espaço Neutro', 'Topografia'],
        axis_id: 1
      },
      {
        id: 'term-fund-4',
        term: 'Orientação da Palma',
        description: 'Direção vetorial para a qual a palma da mão está voltada durante a realização do sinal.',
        definition: 'Direção vetorial para a qual a palma da mão está voltada durante a realização do sinal.',
        videoUrl: '',
        video_url: '',
        context: 'Define a direção de fluxos bioquímicos e a absorção ou rejeição de nutrientes no organismo humano.',
        signStrategy: 'Movimento vetorial com a palma indicando o sentido de absorção, barreira de proteção ou passagem celular.',
        sign_strategy: 'Movimento vetorial com a palma indicando o sentido de absorção, barreira de proteção ou passagem celular.',
        tags: ['Direcionalidade', 'Parâmetros Fonológicos', 'Precisão'],
        axis_id: 1
      },
      {
        id: 'term-fund-5',
        term: 'Expressão Não-Manual (ENM)',
        description: 'Movimentos de face e tronco que conferem status gramatical, intensidade e foco semântico ao enunciado.',
        definition: 'Movimentos de face e tronco que conferem status gramatical, intensidade e foco semântico ao enunciado.',
        videoUrl: '',
        video_url: '',
        context: 'Expressa reações corporais como desconforto por intolerância, dor abdominal ou ênfase na toxicidade de compostos.',
        signStrategy: 'Emprego de movimentos dos olhos, sobrancelhas e postura corporal para registrar a gravidade de sintomas.',
        sign_strategy: 'Emprego de movimentos dos olhos, sobrancelhas e postura corporal para registrar a gravidade de sintomas.',
        tags: ['Expressão Facial', 'Gramática', 'Semântica'],
        axis_id: 1
      },
      {
        id: 'term-fund-6',
        term: 'Dactilologia Científica',
        description: 'Soletração rítmica manual do alfabeto usada para termos técnicos específicos, fórmulas e siglas biomédicas.',
        definition: 'Soletração rítmica manual do alfabeto usada para termos técnicos específicos, fórmulas e siglas biomédicas.',
        videoUrl: '',
        video_url: '',
        context: 'Usada para siglas técnicas como SAN, IgE, RDC ou nomes de aditivos específicos sem sinal formal convencionado.',
        signStrategy: 'Soletração rítmica e clara, seguida imediatamente pela estratégia conceitual descritiva ou classificador visual.',
        sign_strategy: 'Soletração rítmica e clara, seguida imediatamente pela estratégia conceitual descritiva ou classificador visual.',
        tags: ['Alfabeto Manual', 'Siglas', 'Terminologia'],
        axis_id: 1
      }
    ]
  },
  {
    id: 'imunologico-digestivo',
    numericId: 2,
    title: 'Imunológico-Digestivo',
    emoji: '🧬',
    description: 'Termos técnicos sobre o sistema imunológico e digestivo.',
    terms: [
      {
        id: 'term-imun-1',
        term: 'Reação Alimentar',
        description: 'Qualquer resposta clínica anormal decorrente da ingestão de determinado alimento ou composto alimentício.',
        definition: 'Qualquer resposta clínica anormal decorrente da ingestão de determinado alimento ou composto alimentício.',
        videoUrl: 'https://youtu.be/avcv3vQBGwA',
        video_url: 'https://youtu.be/avcv3vQBGwA',
        context: 'Abrange tanto manifestações de hipersensibilidade imunomediada quanto intolerâncias enzimáticas metabólicas.',
        signStrategy: 'Sinal composto: ato da ingestão alimentar seguido da resposta biológica divergente do organismo.',
        sign_strategy: 'Sinal composto: ato da ingestão alimentar seguido da resposta biológica divergente do organismo.',
        tags: ['Digestão', 'Fisiologia', 'Imunologia'],
        axis_id: 2
      },
      {
        id: 'term-imun-2',
        term: 'Alergia Alimentar',
        description: 'Resposta imunológica adversa e reprodutível disparada pelo organismo após a exposição a proteínas específicas.',
        definition: 'Resposta imunológica adversa e reprodutível disparada pelo organismo após a exposição a proteínas específicas.',
        videoUrl: 'https://www.youtube.com/watch?v=avcv3vQBGwA',
        video_url: 'https://www.youtube.com/watch?v=avcv3vQBGwA',
        context: 'Envolve ativação de mastócitos e basófilos por anticorpos IgE após contato com leite, amendoim, frutos do mar ou soja.',
        signStrategy: 'Configuração em garra demonstrando o ataque e inflamação do sistema imunológico em resposta à proteína.',
        sign_strategy: 'Configuração em garra demonstrando o ataque e inflamação do sistema imunológico em resposta à proteína.',
        tags: ['Imunologia', 'Hipersensibilidade', 'Proteínas', 'Sistema Imune'],
        axis_id: 2
      },
      {
        id: 'term-imun-3',
        term: 'Intolerância Alimentar',
        description: 'Incapacidade metabólica ou enzimática de digerir ou absorver adequadamente componentes alimentares específicos.',
        definition: 'Incapacidade metabólica ou enzimática de digerir ou absorver adequadamente componentes alimentares específicos.',
        videoUrl: '',
        video_url: '',
        context: 'Diferencia-se da alergia por não envolver anticorpos, sendo o exemplo mais frequente a hipolactasia (intolerância à lactose).',
        signStrategy: 'Representação da barreira digestiva e da incapacidade gástrica de fragmentar quimicamente o nutriente.',
        sign_strategy: 'Representação da barreira digestiva e da incapacidade gástrica de fragmentar quimicamente o nutriente.',
        tags: ['Metabolismo', 'Enzimas', 'Lactose', 'Digestão'],
        axis_id: 2
      },
      {
        id: 'term-imun-4',
        term: 'Anafilaxia',
        description: 'Reação alérgica multissistêmica aguda, de início súbito e progressão rápida, potencialmente fatal.',
        definition: 'Reação alérgica multissistêmica aguda, de início súbito e progressão rápida, potencialmente fatal.',
        videoUrl: '',
        video_url: '',
        context: 'Caracteriza-se por broncoespasmo, edema de glote, hipotensão e choque, demandando administração rápida de adrenalina.',
        signStrategy: 'Demonstração enfática de constrição respiratória laringotraqueal aliada à tensão postural e urgência médica.',
        sign_strategy: 'Demonstração enfática de constrição respiratória laringotraqueal aliada à tensão postural e urgência médica.',
        tags: ['Emergência', 'Choque Alérgico', 'Segurança Médica'],
        axis_id: 2
      },
      {
        id: 'term-imun-5',
        term: 'Microbiota Intestinal',
        description: 'Comunidade complexa de microrganismos vivos comensais que habitam o trato gastrointestinal humano.',
        definition: 'Comunidade complexa de microrganismos vivos comensais que habitam o trato gastrointestinal humano.',
        videoUrl: '',
        video_url: '',
        context: 'Essencial na fermentação de fibras, síntese de micronutrientes e no condicionamento defensivo da barreira imune.',
        signStrategy: 'Classificador de microestruturas celulares agindo em cooperação simbiótica na altura da cavidade abdominal.',
        sign_strategy: 'Classificador de microestruturas celulares agindo em cooperação simbiótica na altura da cavidade abdominal.',
        tags: ['Microbioma', 'Flora Intestinal', 'Saúde Digestiva'],
        axis_id: 2
      },
      {
        id: 'term-imun-6',
        term: 'Anticorpo IgE',
        description: 'Imunoglobulina E envolvida diretamente na ativação de hipersensibilidade do tipo 1 em resposta a alérgenos.',
        definition: 'Imunoglobulina E envolvida diretamente na ativação de hipersensibilidade do tipo 1 em resposta a alérgenos.',
        videoUrl: '',
        video_url: '',
        context: 'Sua dosagem sérica quantitativa permite mapear a sensibilização biológica do paciente a múltiplos grupos alimentares.',
        signStrategy: 'Dactilologia das letras I-g-E combinada com classificador bimanual reproduzindo a morfologia em bifurcação em Y.',
        sign_strategy: 'Dactilologia das letras I-g-E combinada com classificador bimanual reproduzindo a morfologia em bifurcação em Y.',
        tags: ['Imunoglobulina', 'Diagnóstico', 'Biomarcadores'],
        axis_id: 2
      },
      {
        id: 'term-imun-7',
        term: 'Permeabilidade Intestinal',
        description: 'Capacidade regulada das junções celulares da mucosa intestinal de filtrar nutrientes e reter toxinas.',
        definition: 'Capacidade regulada das junções celulares da mucosa intestinal de filtrar nutrientes e reter toxinas.',
        videoUrl: '',
        video_url: '',
        context: 'Quando há perda da integridade das junções (hiperpermeabilidade), macromoléculas invadem o plasma desencadeando inflamação.',
        signStrategy: 'Mãos paralelas simulando a barreira epitelial e abertura de passagens indesejadas por onde extravasam moléculas.',
        sign_strategy: 'Mãos paralelas simulando a barreira epitelial e abertura de passagens indesejadas por onde extravasam moléculas.',
        tags: ['Mucosa Intestinal', 'Fisiologia', 'Inflamação'],
        axis_id: 2
      }
    ]
  },
  {
    id: 'rotulagem-tecnica',
    numericId: 3,
    title: 'Rotulagem Técnica',
    emoji: '🏷️',
    description: 'A ciência por trás dos rótulos e normas alimentares.',
    terms: [
      {
        id: 'term-rot-1',
        term: 'Rótulo Nutricional',
        description: 'Toda inscrição, legenda, imagem ou matéria descritiva impressa ou gravada sobre a embalagem do alimento.',
        definition: 'Toda inscrição, legenda, imagem ou matéria descritiva impressa ou gravada sobre a embalagem do alimento.',
        videoUrl: '',
        video_url: '',
        context: 'Garante o direito fundamental à informação clara e precisa, regido pelas normas e resoluções da ANVISA.',
        signStrategy: 'Delineamento espacial da superfície da embalagem retangular com leitura atenta dos parâmetros técnicos.',
        sign_strategy: 'Delineamento espacial da superfície da embalagem retangular com leitura atenta dos parâmetros técnicos.',
        tags: ['Rotulagem', 'ANVISA', 'Embalagem', 'Direito do Consumidor'],
        axis_id: 3
      },
      {
        id: 'term-rot-2',
        term: 'Tabela Nutricional',
        description: 'Painel padronizado que declara quantitativamente o valor energético e nutrientes por porção de alimento.',
        definition: 'Painel padronizado que declara quantitativamente o valor energético e nutrientes por porção de alimento.',
        videoUrl: '',
        video_url: '',
        context: 'Permite ao consumidor mensurar a ingestão calórica diária e identificar concentrações de carboidratos, sódio e gorduras.',
        signStrategy: 'Construção da grade bidimensional no espaço neutro com indexação hierárquica dos valores por coluna.',
        sign_strategy: 'Construção da grade bidimensional no espaço neutro com indexação hierárquica dos valores por coluna.',
        tags: ['Nutrientes', 'Tabela', 'Porção', 'Calorias'],
        axis_id: 3
      },
      {
        id: 'term-rot-3',
        term: 'Lista de Ingredientes',
        description: 'Relação exaustiva de todas as substâncias que compõem o alimento, apresentada em ordem decrescente de proporção ponderal.',
        definition: 'Relação exaustiva de todas as substâncias que compõem o alimento, apresentada em ordem decrescente de proporção ponderal.',
        videoUrl: '',
        video_url: '',
        context: 'O primeiro ingrediente listado é sempre o majoritário, revelando a prevalência real de matérias-primas frente aos aditivos.',
        signStrategy: 'Movimento de declive escalonado da mão, demonstrando o maior componente no topo descendo até os menores no final.',
        sign_strategy: 'Movimento de declive escalonado da mão, demonstrando o maior componente no topo descendo até os menores no final.',
        tags: ['Ingredientes', 'Composição', 'Ordem Decrescente'],
        axis_id: 3
      },
      {
        id: 'term-rot-4',
        term: 'Alérgenos e Contaminação Cruzada',
        description: 'Advertência de segurança obrigatória que sinaliza a presença direta ou traços involuntários de substâncias alergênicas.',
        definition: 'Advertência de segurança obrigatória que sinaliza a presença direta ou traços involuntários de substâncias alergênicas.',
        videoUrl: '',
        video_url: '',
        context: 'Expressões como "ALÉRGICOS: CONTÉM DERIVADOS DE TRIGO E LEITE" ou "PODE CONTER TRAÇOS DE CASTANHA".',
        signStrategy: 'Sinal de ALERTA/ATENÇÃO combinado com o gesto de partículas compartilhadas em maquinário fabril mútuo.',
        sign_strategy: 'Sinal de ALERTA/ATENÇÃO combinado com o gesto de partículas compartilhadas em maquinário fabril mútuo.',
        tags: ['Alérgenos', 'Aviso Obrigatório', 'Contaminação'],
        axis_id: 3
      },
      {
        id: 'term-rot-5',
        term: 'Lupa Frontal (Rotulagem Nutricional Frontal)',
        description: 'Símbolo gráfico informativo aplicado na parte da frente da embalagem para destacar excessos de sódio, açúcar ou gordura saturada.',
        definition: 'Símbolo gráfico informativo aplicado na parte da frente da embalagem para destacar excessos de sódio, açúcar ou gordura saturada.',
        videoUrl: '',
        video_url: '',
        context: 'Instituído pela Resolução RDC 429/2020 para conferir visibilidade imediata a nutrientes críticos associados a doenças crônicas.',
        signStrategy: 'Configuração em círculo simulando a lupa sobre a parte frontal superior do tórax/embalagem com expressão de alerta.',
        sign_strategy: 'Configuração em círculo simulando a lupa sobre a parte frontal superior do tórax/embalagem com expressão de alerta.',
        tags: ['Anvisa', 'Lupa', 'Alto Teor', 'Saúde Pública'],
        axis_id: 3
      },
      {
        id: 'term-rot-6',
        term: 'Gordura Trans',
        description: 'Ácidos graxos insaturados obtidos majoritariamente por hidrogenação industrial, nocivos ao sistema vascular.',
        definition: 'Ácidos graxos insaturados obtidos majoritariamente por hidrogenação industrial, nocivos ao sistema vascular.',
        videoUrl: '',
        video_url: '',
        context: 'Presente em produtos ultraprocessados como biscoitos recheados e gorduras vegetais para prolongar tempo de prateleira.',
        signStrategy: 'Sinal de substância viscosa/gordurosa seguido de gesto indicativo de acúmulo obstrutivo nas paredes vasculares.',
        sign_strategy: 'Sinal de substância viscosa/gordurosa seguido de gesto indicativo de acúmulo obstrutivo nas paredes vasculares.',
        tags: ['Lipídios', 'Cardiovascular', 'Ultraprocessados'],
        axis_id: 3
      },
      {
        id: 'term-rot-7',
        term: 'Açúcares Adicionados',
        description: 'Monossacarídeos e dissacarídeos adicionados durante o processamento do alimento, distintos daqueles naturalmente presentes.',
        definition: 'Monossacarídeos e dissacarídeos adicionados durante o processamento do alimento, distintos daqueles naturalmente presentes.',
        videoUrl: '',
        video_url: '',
        context: 'Inclui xaropes de milho, glicose e maltodextrina que elevam drasticamente a densidade energética sem aporte de fibras.',
        signStrategy: 'Sinal de açúcar aliado a movimento de infusão contínua repetitiva no preparo industrial.',
        sign_strategy: 'Sinal de açúcar aliado a movimento de infusão contínua repetitiva no preparo industrial.',
        tags: ['Glicemia', 'Açúcar', 'Processamento Industrial'],
        axis_id: 3
      }
    ]
  },
  {
    id: 'analise-critica',
    numericId: 4,
    title: 'Análise Crítica',
    emoji: '⚖️',
    description: 'Reflexões sobre soberania e direitos alimentares.',
    terms: [
      {
        id: 'term-crit-1',
        term: 'Alimento Ultraprocessado',
        description: 'Formulações industriais ricas em aditivos químicos, gorduras saturadas e sódio, e pobres em nutrientes integrais.',
        definition: 'Formulações industriais ricas em aditivos químicos, gorduras saturadas e sódio, e pobres em nutrientes integrais.',
        videoUrl: '',
        video_url: '',
        context: 'Classificação NOVA (Grupo 4); concebidos para hiperpalatabilidade, comodidade comercial e longa durabilidade.',
        signStrategy: 'Sinal de fábrica e engrenagem mecânica contínua moldando um produto comestível sintético enlatado/embalado.',
        sign_strategy: 'Sinal de fábrica e engrenagem mecânica contínua moldando um produto comestível sintético enlatado/embalado.',
        tags: ['Classificação NOVA', 'Industrialização', 'Nutrição Crítica'],
        axis_id: 4
      },
      {
        id: 'term-crit-2',
        term: 'Agrotóxico',
        description: 'Produtos químicos sintéticos destinados ao controle de pragas, insetos e ervas daninhas nas lavouras.',
        definition: 'Produtos químicos sintéticos destinados ao controle de pragas, insetos e ervas daninhas nas lavouras.',
        videoUrl: '',
        video_url: '',
        context: 'O uso desmedido causa contaminação de bacias hidrográficas, perda de polinizadores e intoxicação crônica em camponeses.',
        signStrategy: 'Sinal de pulverização aérea de veneno sobre a plantação com expressão de nocividade biológica.',
        sign_strategy: 'Sinal de pulverização aérea de veneno sobre a plantação com expressão de nocividade biológica.',
        tags: ['Toxicologia', 'Monocultura', 'Impacto Socioambiental'],
        axis_id: 4
      },
      {
        id: 'term-crit-3',
        term: 'Transgênico (OGM)',
        description: 'Organismo geneticamente modificado por meio de técnicas de recombinação de DNA em laboratório.',
        definition: 'Organismo geneticamente modificado por meio de técnicas de recombinação de DNA em laboratório.',
        videoUrl: '',
        video_url: '',
        context: 'Sementes concebidas para suportar doses massivas de herbicidas comerciais, gerando dependência corporativa aos produtores.',
        signStrategy: 'Classificador de dupla hélice genética sofrendo intervenção mecânica e inserção de elemento estranho.',
        sign_strategy: 'Classificador de dupla hélice genética sofrendo intervenção mecânica e inserção de elemento estranho.',
        tags: ['Genética', 'Biotecnologia', 'Patentes'],
        axis_id: 4
      },
      {
        id: 'term-crit-4',
        term: 'Aditivo Alimentar',
        description: 'Qualquer substância adicionada deliberadamente aos alimentos com o objetivo de alterar propriedades sensoriais ou de conservação.',
        definition: 'Qualquer substância adicionada deliberadamente aos alimentos com o objetivo de alterar propriedades sensoriais ou de conservação.',
        videoUrl: '',
        video_url: '',
        context: 'Corantes artificiais, espessantes, emulsificantes e realçadores de sabor frequentemente associados a hipersensibilidades.',
        signStrategy: 'Classificador de gotejamento de substância sintética concentrada transformando quimicamente o aspecto visual do prato.',
        sign_strategy: 'Classificador de gotejamento de substância sintética concentrada transformando quimicamente o aspecto visual do prato.',
        tags: ['Química', 'Corantes', 'Conservantes'],
        axis_id: 4
      },
      {
        id: 'term-crit-5',
        term: 'Publicidade de Alimentos',
        description: 'Conjunto de estratégias de marketing persuasivo voltadas a incentivar o consumo frequente de produtos ultraprocessados.',
        definition: 'Conjunto de estratégias de marketing persuasivo voltadas a incentivar o consumo frequente de produtos ultraprocessados.',
        videoUrl: '',
        video_url: '',
        context: 'Especialmente agressiva no público infantil mediante uso de personagens lúdicos, influenciadores e brindes colecionáveis.',
        signStrategy: 'Mãos projetando feixes atrativos e telas que capturam e direcionam compulsoriamente a atenção do indivíduo.',
        sign_strategy: 'Mãos projetando feixes atrativos e telas que capturam e direcionam compulsoriamente a atenção do indivíduo.',
        tags: ['Marketing', 'Infância', 'Regulação Publicitária'],
        axis_id: 4
      },
      {
        id: 'term-crit-6',
        term: 'Deserto Alimentar',
        description: 'Recortes geográficos urbanos ou periféricos desprovidos de pontos de comercialização de alimentos frescos e saudáveis.',
        definition: 'Recortes geográficos urbanos ou periféricos desprovidos de pontos de comercialização de alimentos frescos e saudáveis.',
        videoUrl: '',
        video_url: '',
        context: 'Nessas áreas a população fica refém de estabelecimentos que comercializam exclusivamente ultraprocessados de baixo custo.',
        signStrategy: 'Espaço espacial árido e deserto com ausência de hortifrútis, repleto unicamente de embalagens plásticas industrializadas.',
        sign_strategy: 'Espaço espacial árido e deserto com ausência de hortifrútis, repleto unicamente de embalagens plásticas industrializadas.',
        tags: ['Território', 'Geografia da Fome', 'Desigualdade'],
        axis_id: 4
      },
      {
        id: 'term-crit-7',
        term: 'Guia Alimentar para a População Brasileira',
        description: 'Instrumento normativo do Ministério da Saúde que orienta escolhas alimentares promotoras de saúde integral.',
        definition: 'Instrumento normativo do Ministério da Saúde que orienta escolhas alimentares promotoras de saúde integral.',
        videoUrl: '',
        video_url: '',
        context: 'Fundamentado na valorização da comida de verdade, da culinária regional e da comensalidade como patrimônio cultural.',
        signStrategy: 'Sinal de livro ou diretriz referencial apontando para a panela de preparo doméstico e refeição em família.',
        sign_strategy: 'Sinal de livro ou diretriz referencial apontando para a panela de preparo doméstico e refeição em família.',
        tags: ['Ministério da Saúde', 'Diretrizes', 'Saúde Pública'],
        axis_id: 4
      }
    ]
  },
  {
    id: 'soberania-alimentar',
    numericId: 5,
    title: 'Soberania Alimentar',
    emoji: '🌾',
    description: 'O direito dos povos à alimentação saudável e sustentável.',
    terms: [
      {
        id: 'term-sob-1',
        term: 'Soberania Alimentar',
        description: 'Direito sagrado dos povos de definir suas próprias estratégias agrárias, produtivas e de consumo ecológico.',
        definition: 'Direito sagrado dos povos de definir suas próprias estratégias agrárias, produtivas e de consumo ecológico.',
        videoUrl: '',
        video_url: '',
        context: 'Enfatiza a autonomia das comunidades sobre o território e a proteção dos saberes e práticas culinárias tradicionais.',
        signStrategy: 'Sinal de autonomia/poder próprio emanando do solo comunitário com proteção mútua dos trabalhadores da terra.',
        sign_strategy: 'Sinal de autonomia/poder próprio emanando do solo comunitário com proteção mútua dos trabalhadores da terra.',
        tags: ['Autonomia', 'Direitos Humanos', 'Campesinato'],
        axis_id: 5
      },
      {
        id: 'term-sob-2',
        term: 'Segurança Alimentar e Nutricional (SAN)',
        description: 'Garantia de acesso regular e permanente a alimentos de qualidade, em quantidade suficiente, de forma digna e sustentável.',
        definition: 'Garantia de acesso regular e permanente a alimentos de qualidade, em quantidade suficiente, de forma digna e sustentável.',
        videoUrl: '',
        video_url: '',
        context: 'Política de Estado que articula saúde, combate à fome, agricultura camponesa e abastecimento equitativo.',
        signStrategy: 'Sinal de prato acolhido e protegido no seio familiar, assegurando nutrição e dignidade humana.',
        sign_strategy: 'Sinal de prato acolhido e protegido no seio familiar, assegurando nutrição e dignidade humana.',
        tags: ['SAN', 'Políticas Públicas', 'Cidadania'],
        axis_id: 5
      },
      {
        id: 'term-sob-3',
        term: 'Agroecologia',
        description: 'Ciência, movimento social e prática agrícola holística que alia sustentabilidade ecológica à justiça no campo.',
        definition: 'Ciência, movimento social e prática agrícola holística que alia sustentabilidade ecológica à justiça no campo.',
        videoUrl: '',
        video_url: '',
        context: 'Cultiva a terra sem insumos tóxicos sintéticos, revitalizando a microbiota do solo e valorizando as relações de cooperação.',
        signStrategy: 'Movimento circular e harmônico integrando terra fértil, nascentes, árvores e mãos camponesas em simbiose.',
        sign_strategy: 'Movimento circular e harmônico integrando terra fértil, nascentes, árvores e mãos camponesas em simbiose.',
        tags: ['Sustentabilidade', 'Agricultura Limpa', 'Ecologia'],
        axis_id: 5
      },
      {
        id: 'term-sob-4',
        term: 'Agricultura Familiar',
        description: 'Modelo de produção agropecuária onde a gestão e o trabalho são exercidos predominantemente pela própria família.',
        definition: 'Modelo de produção agropecuária onde a gestão e o trabalho são exercidos predominantemente pela própria família.',
        videoUrl: '',
        video_url: '',
        context: 'Principal fornecedora dos alimentos in natura que chegam aos lares brasileiros, promovendo a preservação territorial.',
        signStrategy: 'Mãos entrelaçadas em trabalho solidário familiar cultivando a terra e distribuindo a colheita.',
        sign_strategy: 'Mãos entrelaçadas em trabalho solidário familiar cultivando a terra e distribuindo a colheita.',
        tags: ['Camponeses', 'Produção Local', 'Economia Solidária'],
        axis_id: 5
      },
      {
        id: 'term-sob-5',
        term: 'Biodiversidade Alimentar',
        description: 'Riqueza e variedade de espécies vegetais e animais comestíveis presentes nos biomas e ecossistemas tradicionais.',
        definition: 'Riqueza e variedade de espécies vegetais e animais comestíveis presentes nos biomas e ecossistemas tradicionais.',
        videoUrl: '',
        video_url: '',
        context: 'Resgate de Plantas Alimentícias Não Convencionais (PANC), frutas nativas da Caatinga e Cerrado essenciais à resiliência climática.',
        signStrategy: 'Mãos em expansão irradiando múltiplos tipos de folhas, raízes e frutos com grande diversidade de formatos.',
        sign_strategy: 'Mãos em expansão irradiando múltiplos tipos de folhas, raízes e frutos com grande diversidade de formatos.',
        tags: ['PANC', 'Cultura Alimentar', 'Patrimônio Biológico'],
        axis_id: 5
      },
      {
        id: 'term-sob-6',
        term: 'Semente Crioula',
        description: 'Variedades de sementes autóctones selecionadas e preservadas por gerações de comunidades tradicionais.',
        definition: 'Variedades de sementes autóctones selecionadas e preservadas por gerações de comunidades tradicionais.',
        videoUrl: '',
        video_url: '',
        context: 'Representam a salvaguarda contra o monopólio genético das corporações agroquímicas e preservam a herança cultural.',
        signStrategy: 'Mãos em concha protetora guardando pequenos grãos preciosos e transferindo o legado de geração em geração.',
        sign_strategy: 'Mãos em concha protetora guardando pequenos grãos preciosos e transferindo o legado de geração em geração.',
        tags: ['Patrimônio Ancestral', 'Autonomia Genética', 'Resistência'],
        axis_id: 5
      },
      {
        id: 'term-sob-7',
        term: 'Circuito Curto de Comercialização',
        description: 'Canal de distribuição direta entre o agricultor produtor e o consumidor final sem intermédio de atravessadores.',
        definition: 'Canal de distribuição direta entre o agricultor produtor e o consumidor final sem intermédio de atravessadores.',
        videoUrl: '',
        video_url: '',
        context: 'Fortalece as feiras agroecológicas e compras públicas (PNAE/PAA), assegurando remuneração justa e preços acessíveis.',
        signStrategy: 'Gesto de proximidade entre a mão que colhe o alimento fresco e a mão da pessoa que o recebe com valor compartilhado.',
        sign_strategy: 'Gesto de proximidade entre a mão que colhe o alimento fresco e a mão da pessoa que o recebe com valor compartilhado.',
        tags: ['Feira Agroecológica', 'Comércio Justo', 'Economia Local'],
        axis_id: 5
      }
    ]
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
