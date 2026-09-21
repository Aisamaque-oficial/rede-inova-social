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
    "id": "fundamentacao",
    "numericId": 1,
    "title": "Eixo 1 — Fundamentação",
    "emoji": "🤟",
    "description": "Conceitos estruturantes para o usuário compreender segurança dos alimentos, alimentação e funcionamento da cadeia alimentar.",
    "terms": [
      {
        "id": "term-fund-1",
        "term": "Segurança dos alimentos",
        "definition": "Conjunto de condições e práticas destinadas a assegurar que o alimento não cause dano ao consumidor quando preparado e consumido conforme sua finalidade.",
        "description": "Conjunto de condições e práticas destinadas a assegurar que o alimento não cause dano ao consumidor quando preparado e consumido conforme sua finalidade.",
        "context": "Diretriz fundamental para garantir que o consumidor não seja vítima de infecções, intoxicações ou lesões físicas ao ingerir um produto.",
        "signStrategy": "Sinal composto: ALIMENTO + SEGURO/PROTEÇÃO + GARANTIR, com expressão facial afirmativa.",
        "sign_strategy": "Sinal composto: ALIMENTO + SEGURO/PROTEÇÃO + GARANTIR, com expressão facial afirmativa.",
        "videoUrl": "https://www.youtube.com/watch?v=ScMzIvxBSi4",
        "video_url": "https://www.youtube.com/watch?v=ScMzIvxBSi4",
        "tags": [
          "Fundamentação",
          "Boas Práticas",
          "Conceito Central",
          "Inocuidade"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-2",
        "term": "Segurança alimentar e nutricional",
        "definition": "Realização do direito de todos ao acesso regular e permanente a alimentos de qualidade, em quantidade suficiente, sem comprometer outras necessidades essenciais e respeitando aspectos sociais, culturais, econômicos e ambientais.",
        "description": "Realização do direito de todos ao acesso regular e permanente a alimentos de qualidade, em quantidade suficiente, sem comprometer outras necessidades essenciais e respeitando aspectos sociais, culturais, econômicos e ambientais.",
        "context": "Princípio de soberania e direito universal que orienta políticas públicas de combate à fome e promoção da saúde nutricional coletiva.",
        "signStrategy": "Sinal composto: DIREITO + COMIDA + SAUDÁVEL + POPULAÇÃO + SUSTENTÁVEL em espaço amplo.",
        "sign_strategy": "Sinal composto: DIREITO + COMIDA + SAUDÁVEL + POPULAÇÃO + SUSTENTÁVEL em espaço amplo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "SAN",
          "Direito Humano",
          "Políticas Públicas",
          "Nutrição"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-3",
        "term": "Alimento seguro",
        "definition": "Alimento livre de contaminantes biológicos, químicos ou físicos em níveis que possam oferecer riscos à saúde do consumidor.",
        "description": "Alimento livre de contaminantes biológicos, químicos ou físicos em níveis que possam oferecer riscos à saúde do consumidor.",
        "context": "Padrão de referência que orienta todas as etapas de produção primária, beneficiamento, rotulagem e comercialização.",
        "signStrategy": "Sinal de ALIMENTO seguido pelo classificador de PROTEGIDO/SEM-PERIGO com movimento firme.",
        "sign_strategy": "Sinal de ALIMENTO seguido pelo classificador de PROTEGIDO/SEM-PERIGO com movimento firme.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Inocuidade",
          "Qualidade",
          "Consumo Seguro"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-4",
        "term": "Inocuidade dos alimentos",
        "definition": "Garantia de que os alimentos não causarão danos ou agravos à saúde do consumidor quando consumidos de acordo com o uso pretendido.",
        "description": "Garantia de que os alimentos não causarão danos ou agravos à saúde do consumidor quando consumidos de acordo com o uso pretendido.",
        "context": "Termo técnico adotado pela Anvisa, MAPA e Codex Alimentarius para assegurar a ausência de agentes patogênicos ou tóxicos.",
        "signStrategy": "Datilologia INOCUIDADE seguida de contextualização visual ALIMENTO + LIMPO + NÃO FAZ MAL.",
        "sign_strategy": "Datilologia INOCUIDADE seguida de contextualização visual ALIMENTO + LIMPO + NÃO FAZ MAL.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Codex Alimentarius",
          "Legislação",
          "Sanidade"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-5",
        "term": "Perigo",
        "definition": "Agente biológico, químico ou físico presente no alimento com potencial para causar dano à saúde.",
        "description": "Agente biológico, químico ou físico presente no alimento com potencial para causar dano à saúde.",
        "context": "Elemento que pode causar contaminação ou agravo se não houver barreiras e controles preventivos em vigor.",
        "signStrategy": "Configuração de mão em alerta indicando AMEAÇA ou RISCO POTENCIAL com sobrancelhas franzidas.",
        "sign_strategy": "Configuração de mão em alerta indicando AMEAÇA ou RISCO POTENCIAL com sobrancelhas franzidas.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "APPCC",
          "Controle de Risco",
          "Biossegurança"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-6",
        "term": "Perigo alimentar",
        "definition": "Agente biológico, químico ou físico presente no alimento com potencial para causar dano à saúde.",
        "description": "Agente biológico, químico ou físico presente no alimento com potencial para causar dano à saúde.",
        "context": "Foco essencial do sistema de Análise de Perigos e Pontos Críticos de Controle (APPCC) nas agroindústrias.",
        "signStrategy": "Sinal de COMIDA associado ao sinal de ALERTA/PERIGO com expressão corporal de atenção.",
        "sign_strategy": "Sinal de COMIDA associado ao sinal de ALERTA/PERIGO com expressão corporal de atenção.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "APPCC",
          "Boas Práticas",
          "Sanidade"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-7",
        "term": "Risco",
        "definition": "Probabilidade da ocorrência de um efeito adverso à saúde e da gravidade desse efeito, consequente a um perigo em um alimento.",
        "description": "Probabilidade da ocorrência de um efeito adverso à saúde e da gravidade desse efeito, consequente a um perigo em um alimento.",
        "context": "Diferencia-se de perigo por mensurar a probabilidade real de exposição do consumidor ao agente contaminante.",
        "signStrategy": "Sinal de CHANCE/PROBABILIDADE combinado com CONVERSÃO EM PERIGO/DANO.",
        "sign_strategy": "Sinal de CHANCE/PROBABILIDADE combinado com CONVERSÃO EM PERIGO/DANO.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Avaliação de Risco",
          "Estatística",
          "Gestão Sanitária"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-8",
        "term": "Contaminação",
        "definition": "Presença ou introdução de agentes indesejáveis no alimento, capazes de comprometer sua qualidade ou segurança.",
        "description": "Presença ou introdução de agentes indesejáveis no alimento, capazes de comprometer sua qualidade ou segurança.",
        "context": "Ocorre em qualquer etapa em que regras básicas de higiene pessoal ou de instalações sejam violadas.",
        "signStrategy": "Mão simulando elemento estranho ou sujeira penetrando em espaço antes limpo, com expressão de alerta.",
        "sign_strategy": "Mão simulando elemento estranho ou sujeira penetrando em espaço antes limpo, com expressão de alerta.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Higiene",
          "Sanitização",
          "Perigo"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-9",
        "term": "Contaminação alimentar",
        "definition": "Presença ou introdução de agentes indesejáveis no alimento, capazes de comprometer sua qualidade ou segurança.",
        "description": "Presença ou introdução de agentes indesejáveis no alimento, capazes de comprometer sua qualidade ou segurança.",
        "context": "Principal causa de recall de produtos e ocorrência de surtos infecciosos na população.",
        "signStrategy": "Sinal de COMIDA associado à invasão visual de partículas ou bactérias (classificador de dispersão).",
        "sign_strategy": "Sinal de COMIDA associado à invasão visual de partículas ou bactérias (classificador de dispersão).",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Qualidade Sanitária",
          "Controle",
          "DTA"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-10",
        "term": "Contaminante",
        "definition": "Substância ou agente não intencionalmente adicionado ao alimento que pode estar presente em decorrência da produção, processamento, armazenamento ou ambiente.",
        "description": "Substância ou agente não intencionalmente adicionado ao alimento que pode estar presente em decorrência da produção, processamento, armazenamento ou ambiente.",
        "context": "Pode ser desde um fragmento de metal de esteira mecânica até resíduos de agrotóxicos ou coliformes.",
        "signStrategy": "Classificador indicando corpo estranho introduzido no alimento contra a sua composição natural.",
        "sign_strategy": "Classificador indicando corpo estranho introduzido no alimento contra a sua composição natural.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Substância Estranha",
          "Toxicologia",
          "Controle"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-11",
        "term": "Contaminante alimentar",
        "definition": "Substância ou agente não intencionalmente adicionado ao alimento que pode estar presente em decorrência da produção, processamento, armazenamento ou ambiente.",
        "description": "Substância ou agente não intencionalmente adicionado ao alimento que pode estar presente em decorrência da produção, processamento, armazenamento ou ambiente.",
        "context": "Identificação laboratorial regulamentada pela RDC 722/2022 da Anvisa com limites máximos tolerados.",
        "signStrategy": "Classificador mostrando substância indesejável misturada ao alimento durante o fluxo produtivo.",
        "sign_strategy": "Classificador mostrando substância indesejável misturada ao alimento durante o fluxo produtivo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Normas Anvisa",
          "Toxicologia",
          "Segurança"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-12",
        "term": "Contaminação cruzada",
        "definition": "Transferência de microrganismos, substâncias ou outros contaminantes de uma fonte contaminada para um alimento.",
        "description": "Transferência de microrganismos, substâncias ou outros contaminantes de uma fonte contaminada para um alimento.",
        "context": "Cenário clássico: cortar carne crua com microrganismos e usar a mesma faca e tábua para picar folhas prontas para salada.",
        "signStrategy": "Duas mãos posicionadas em pontos diferentes; uma toca a área contaminada e transfere o contato direto para a área limpa.",
        "sign_strategy": "Duas mãos posicionadas em pontos diferentes; uma toca a área contaminada e transfere o contato direto para a área limpa.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Boas Práticas",
          "Manipulação",
          "Prevenção"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-13",
        "term": "Contaminação biológica",
        "definition": "Introdução ou presença de agentes biológicos indesejáveis, como determinadas bactérias, vírus, parasitas e fungos patogênicos no alimento.",
        "description": "Introdução ou presença de agentes biológicos indesejáveis, como determinadas bactérias, vírus, parasitas e fungos patogênicos no alimento.",
        "context": "Responsável pela ampla maioria dos surtos de diarreia, febre tifoide, botulismo e gastroenterites.",
        "signStrategy": "Sinal de BACTÉRIA/VÍRUS multiplicando-se visualmente sobre a superfície do alimento.",
        "sign_strategy": "Sinal de BACTÉRIA/VÍRUS multiplicando-se visualmente sobre a superfície do alimento.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Bactérias",
          "Patógenos",
          "Microbiologia"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-14",
        "term": "Contaminação química",
        "definition": "Presença indesejável de substâncias químicas nocivas no alimento, tais como resíduos de defensivos agrícolas, metais pesados ou agentes de limpeza.",
        "description": "Presença indesejável de substâncias químicas nocivas no alimento, tais como resíduos de defensivos agrícolas, metais pesados ou agentes de limpeza.",
        "context": "Inclui detergentes mal enxaguados em tachos industriais, excesso de defensivos agrícolas ou toxinas fúngicas (micotoxinas).",
        "signStrategy": "Sinal de QUÍMICA/VENENO misturando-se com líquido ou ingrediente alimentício.",
        "sign_strategy": "Sinal de QUÍMICA/VENENO misturando-se com líquido ou ingrediente alimentício.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Química",
          "Defensivos",
          "Higienização"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-15",
        "term": "Contaminação física",
        "definition": "Presença de materiais estranhos ao alimento, como fragmentos de vidro, metal, pedras, plásticos ou adornos, com potencial de causar dano físico ou lesão.",
        "description": "Presença de materiais estranhos ao alimento, como fragmentos de vidro, metal, pedras, plásticos ou adornos, com potencial de causar dano físico ou lesão.",
        "context": "Evitada com uso de redes no cabelo, ausência de brincos/relógios por manipuladores e ímãs/telas detectoras em fábricas.",
        "signStrategy": "Classificador segurando fragmento pontiagudo (caco de vidro, parafuso, pedra) saindo de dentro do alimento.",
        "sign_strategy": "Classificador segurando fragmento pontiagudo (caco de vidro, parafuso, pedra) saindo de dentro do alimento.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Corpo Estranho",
          "BPF",
          "Inspeção"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-16",
        "term": "Perigo biológico",
        "definition": "Risco associado a organismos ou agentes biológicos, como determinadas bactérias, vírus, parasitas e fungos.",
        "description": "Risco associado a organismos ou agentes biológicos, como determinadas bactérias, vírus, parasitas e fungos.",
        "context": "Exige controle estrito de temperatura (cadeia do frio e cocção) para inativação de células e esporos microbianos.",
        "signStrategy": "Sinal de VIVO/MICROSCÓPICO + PERIGO com representação visual de proliferação celular.",
        "sign_strategy": "Sinal de VIVO/MICROSCÓPICO + PERIGO com representação visual de proliferação celular.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Microrganismos",
          "Biologia",
          "APPCC"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-17",
        "term": "Perigo químico",
        "definition": "Risco decorrente da presença de substâncias químicas potencialmente nocivas no alimento, como produtos de limpeza, defensivos agrícolas…",
        "description": "Risco decorrente da presença de substâncias químicas potencialmente nocivas no alimento, como produtos de limpeza, defensivos agrícolas…",
        "context": "Monitorado por laudos cromatográficos em matérias-primas e água de abastecimento das agroindústrias.",
        "signStrategy": "Sinal de SUBSTÂNCIA-QUÍMICA + TÓXICO com expressão de repulsa/alerta.",
        "sign_strategy": "Sinal de SUBSTÂNCIA-QUÍMICA + TÓXICO com expressão de repulsa/alerta.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Toxicologia",
          "Resíduos",
          "Sanidade"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-18",
        "term": "Perigo físico",
        "definition": "Objeto ou material estranho presente no alimento que pode causar lesão ao consumidor, como utensílios que soltam do maquinário, adornos do manipulador…",
        "description": "Objeto ou material estranho presente no alimento que pode causar lesão ao consumidor, como utensílios que soltam do maquinário, adornos do manipulador…",
        "context": "Gera riscos de asfixia, quebra de dentes e perfuração do trato esofágico e intestinal no consumidor.",
        "signStrategy": "Classificador de objeto sólido rígido causando choque mecânico ao mastigar.",
        "sign_strategy": "Classificador de objeto sólido rígido causando choque mecânico ao mastigar.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Prevenção",
          "Triagem",
          "Filtros"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-19",
        "term": "Doença transmitida por alimentos (DTA)",
        "definition": "Doença decorrente da ingestão de alimento ou água contaminados por agentes capazes de provocar danos à saúde.",
        "description": "Doença decorrente da ingestão de alimento ou água contaminados por agentes capazes de provocar danos à saúde.",
        "context": "Notificação compulsória no Sistema Único de Saúde (SUS) diante de síndromes gastrintestinais de origem alimentar.",
        "signStrategy": "Sinais sequenciais: COMER + ALIMENTO CONTAMINADO -> ADOECER / DOR-ESTÔMAGO / VÔMITO.",
        "sign_strategy": "Sinais sequenciais: COMER + ALIMENTO CONTAMINADO -> ADOECER / DOR-ESTÔMAGO / VÔMITO.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "DTA",
          "Vigilância Epidemiológica",
          "Saúde Pública"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-20",
        "term": "Intoxicação alimentar",
        "definition": "Condição provocada pela ingestão de toxinas ou determinadas substâncias nocivas presentes nos alimentos.",
        "description": "Condição provocada pela ingestão de toxinas ou determinadas substâncias nocivas presentes nos alimentos.",
        "context": "Ocorre ao consumir alimentos com toxinas já formadas por estafilococos ou fungos, agindo de forma muito rápida no organismo.",
        "signStrategy": "Sinal de TOXINA/VENENO ingerido gerando reação gástrica imediata.",
        "sign_strategy": "Sinal de TOXINA/VENENO ingerido gerando reação gástrica imediata.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Toxinas",
          "Sintomatologia",
          "Clínica"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-21",
        "term": "Infecção alimentar",
        "definition": "Doença causada pela ingestão de alimentos contendo microrganismos patogênicos capazes de se multiplicar ou atuar no organismo.",
        "description": "Doença causada pela ingestão de alimentos contendo microrganismos patogênicos capazes de se multiplicar ou atuar no organismo.",
        "context": "Microrganismos como Salmonella ingeridos vivos colonizam o epitélio intestinal, deflagrando febre e diarreia horas depois.",
        "signStrategy": "Sinal de BACTÉRIA entrando no intestino e multiplicando-se internamente.",
        "sign_strategy": "Sinal de BACTÉRIA entrando no intestino e multiplicando-se internamente.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Infecção",
          "Patologia",
          "Microbiota"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-22",
        "term": "Surto alimentar",
        "definition": "Episódio em que duas ou mais pessoas apresentam sintomas semelhantes após a ingestão de alimentos ou água da mesma fonte ou lote.",
        "description": "Episódio em que duas ou mais pessoas apresentam sintomas semelhantes após a ingestão de alimentos ou água da mesma fonte ou lote.",
        "context": "Gera investigação sanitária imediata para isolamento do lote de produto e interdição cautelar da fonte poluidora.",
        "signStrategy": "Classificador de GRUPO DE PESSOAS todas passando mal simultaneamente após consumo compartilhado.",
        "sign_strategy": "Classificador de GRUPO DE PESSOAS todas passando mal simultaneamente após consumo compartilhado.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Epidemiologia",
          "Vigilância",
          "Surtos"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-23",
        "term": "Higiene dos alimentos",
        "definition": "Medidas necessárias para controlar os perigos e assegurar a adequação do alimento para consumo.",
        "description": "Medidas necessárias para controlar os perigos e assegurar a adequação do alimento para consumo.",
        "context": "Envolve limpeza do ambiente, higiene pessoal dos trabalhadores, água tratada e controle de temperatura.",
        "signStrategy": "Sinal de LIMPEZA + ALIMENTOS executado com movimento circular suave e postura de asseio.",
        "sign_strategy": "Sinal de LIMPEZA + ALIMENTOS executado com movimento circular suave e postura de asseio.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Boas Práticas",
          "Higiene",
          "Manuseio"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-24",
        "term": "Higiene pessoal",
        "definition": "Conjunto de práticas e cuidados individuais de limpeza e asseio do manipulador para evitar a transmissão de patógenos aos alimentos.",
        "description": "Conjunto de práticas e cuidados individuais de limpeza e asseio do manipulador para evitar a transmissão de patógenos aos alimentos.",
        "context": "Lavagem correta de mãos até antebraços, unhas aparadas, uso de toucas e uniformes limpos sem adornos.",
        "signStrategy": "Gesto minucioso de lavagem das mãos, antebraços e colocação de touca protetora.",
        "sign_strategy": "Gesto minucioso de lavagem das mãos, antebraços e colocação de touca protetora.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Manipulador",
          "Lavagem de Mãos",
          "BPF"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-25",
        "term": "Manipulador de alimentos",
        "definition": "Pessoa que entra em contato direto ou indireto com alimentos durante sua preparação, produção, armazenamento ou distribuição.",
        "description": "Pessoa que entra em contato direto ou indireto com alimentos durante sua preparação, produção, armazenamento ou distribuição.",
        "context": "Todo colaborador que atua desde a colheita até a embalagem ou empratamento; vetor crítico de transmissão se não treinado.",
        "signStrategy": "Pessoa executando ação de cozinhar/manusear alimentos com as duas mãos no espaço frontal.",
        "sign_strategy": "Pessoa executando ação de cozinhar/manusear alimentos com as duas mãos no espaço frontal.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Profissional",
          "Capacitação",
          "Operação"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-26",
        "term": "Boas Práticas de Fabricação (BPF)",
        "definition": "Procedimentos higiênico-sanitários e operacionais adotados para garantir condições adequadas de produção de alimentos.",
        "description": "Procedimentos higiênico-sanitários e operacionais adotados para garantir condições adequadas de produção de alimentos.",
        "context": "Obrigatórias pela RDC 275/2002 e RDC 216/2004 da Anvisa para todas as indústrias e serviços alimentares do Brasil.",
        "signStrategy": "Datilologia B-P-F seguida do sinal de REGRA/PADRÃO de FABRICAÇÃO CORRETA.",
        "sign_strategy": "Datilologia B-P-F seguida do sinal de REGRA/PADRÃO de FABRICAÇÃO CORRETA.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "BPF",
          "RDC Anvisa",
          "Padronização"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-27",
        "term": "Boas Práticas de Manipulação",
        "definition": "Procedimentos que devem ser adotados por serviços de alimentação e feirantes a fim de garantir a qualidade higiênico-sanitária e a conformidade dos alimentos.",
        "description": "Procedimentos que devem ser adotados por serviços de alimentação e feirantes a fim de garantir a qualidade higiênico-sanitária e a conformidade dos alimentos.",
        "context": "Focadas em cozinhas comerciais, feiras livres, cantinas e pequenos produtores de alimentos prontos para consumo.",
        "signStrategy": "Sinal de PRÁTICA BOA + MANUSEAR ALIMENTO com destreza e cuidado sanitário.",
        "sign_strategy": "Sinal de PRÁTICA BOA + MANUSEAR ALIMENTO com destreza e cuidado sanitário.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Feiras",
          "Cozinhas",
          "Serviços de Alimentação"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-28",
        "term": "Cadeia alimentar",
        "definition": "Sequência contínua de etapas e operações envolvidas na produção primária, processamento, distribuição, armazenamento, comércio e consumo dos alimentos.",
        "description": "Sequência contínua de etapas e operações envolvidas na produção primária, processamento, distribuição, armazenamento, comércio e consumo dos alimentos.",
        "context": "Visão integrada 'do campo à mesa', onde uma falha em qualquer elo compromete a segurança de toda a população.",
        "signStrategy": "Classificador de elos de corrente se conectando continuamente do solo até o prato.",
        "sign_strategy": "Classificador de elos de corrente se conectando continuamente do solo até o prato.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Do Campo à Mesa",
          "Sistemas Alimentares",
          "Logística"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-29",
        "term": "Cadeia produtiva",
        "definition": "Conjunto articulado de processos técnicos, logísticos e comerciais necessários para transformar matérias-primas agropecuárias em produtos finais de consumo.",
        "description": "Conjunto articulado de processos técnicos, logísticos e comerciais necessários para transformar matérias-primas agropecuárias em produtos finais de consumo.",
        "context": "Engloba fornecedores de insumos, agricultores familiares, cooperativas, transportadores e pontos de venda.",
        "signStrategy": "Sinal de ETAPAS PRODUTIVAS avançando linearmente em esteira conceitual.",
        "sign_strategy": "Sinal de ETAPAS PRODUTIVAS avançando linearmente em esteira conceitual.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Agronegócio Familiar",
          "Economia",
          "Fluxo Técnico"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-30",
        "term": "Produção primária",
        "definition": "Fase inicial de cultivo, colheita, criação de animais ou extração de matérias-primas alimentares antes de qualquer processamento industrial.",
        "description": "Fase inicial de cultivo, colheita, criação de animais ou extração de matérias-primas alimentares antes de qualquer processamento industrial.",
        "context": "Etapa onde as Boas Práticas Agrícolas (BPA) previnem contaminações químicas por agrotóxicos e microbiológicas por água suja.",
        "signStrategy": "Sinal de TERRA/PLANTAÇÃO seguido pelo primeiro estágio do fluxo produtivo.",
        "sign_strategy": "Sinal de TERRA/PLANTAÇÃO seguido pelo primeiro estágio do fluxo produtivo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Agricultura",
          "Campo",
          "Matéria-Prima"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-31",
        "term": "Processamento de alimentos",
        "definition": "Conjunto de métodos e operações tecnológicas aplicados às matérias-primas alimentares para transformá-las, aumentar sua durabilidade ou torná-las prontas para o consumo.",
        "description": "Conjunto de métodos e operações tecnológicas aplicados às matérias-primas alimentares para transformá-las, aumentar sua durabilidade ou torná-las prontas para o consumo.",
        "context": "Classificado pelo Guia Alimentar em minimamente processados, processados e ultraprocessados.",
        "signStrategy": "Mãos em movimento de engrenagem e transformação física da matéria-prima.",
        "sign_strategy": "Mãos em movimento de engrenagem e transformação física da matéria-prima.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Tecnologia de Alimentos",
          "Indústria",
          "Transformação"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-32",
        "term": "Conservação de alimentos",
        "definition": "Conjunto de técnicas físicas, térmicas, químicas ou biológicas empregadas para prolongar a vida útil dos alimentos retardando sua alteração.",
        "description": "Conjunto de técnicas físicas, térmicas, químicas ou biológicas empregadas para prolongar a vida útil dos alimentos retardando sua alteração.",
        "context": "Inclui dessecação, fermentação, esterilização, pasteurização e congelamento para garantir alimento seguro entressafra.",
        "signStrategy": "Sinal de GUARDAR/PROTEGER com duração estendida no tempo.",
        "sign_strategy": "Sinal de GUARDAR/PROTEGER com duração estendida no tempo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Vida Útil",
          "Tecnologia",
          "Segurança"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-33",
        "term": "Armazenamento",
        "definition": "Acondicionamento adequado de matérias-primas e produtos acabados em condições controladas de temperatura, ventilação e umidade.",
        "description": "Acondicionamento adequado de matérias-primas e produtos acabados em condições controladas de temperatura, ventilação e umidade.",
        "context": "Exige paletes afastados de paredes e pisos, controle de pragas e respeito ao princípio PVPS (Primeiro que Vence, Primeiro que Sai).",
        "signStrategy": "Classificador de caixas empilhadas organizadamente sobre estrados em ambiente limpo.",
        "sign_strategy": "Classificador de caixas empilhadas organizadamente sobre estrados em ambiente limpo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Estoque",
          "PVPS",
          "Logística"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-34",
        "term": "Transporte de alimentos",
        "definition": "Operação logística de deslocamento de alimentos mantendo condições higiênico-sanitárias e controle térmico adequados para evitar contaminações.",
        "description": "Operação logística de deslocamento de alimentos mantendo condições higiênico-sanitárias e controle térmico adequados para evitar contaminações.",
        "context": "Veículos fechados, baús refrigerados monitorados por termômetro e protegidos de poeira, chuva e insetos.",
        "signStrategy": "Sinal de CAMINHÃO/VEÍCULO com compartimento isolado e refrigerado.",
        "sign_strategy": "Sinal de CAMINHÃO/VEÍCULO com compartimento isolado e refrigerado.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Logística",
          "Cadeia do Frio",
          "Distribuição"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-35",
        "term": "Rastreabilidade",
        "definition": "Capacidade de identificar a origem, o histórico, os processos e a localização de um alimento ou ingrediente ao longo de todas as etapas da cadeia produtiva.",
        "description": "Capacidade de identificar a origem, o histórico, os processos e a localização de um alimento ou ingrediente ao longo de todas as etapas da cadeia produtiva.",
        "context": "Permite recolher com agilidade lotes com desvios de qualidade e valorizar produtos de origem certificada e agroecológica.",
        "signStrategy": "Mãos rastreando linha imaginária de trás para a frente com olhar investigativo e código identificador.",
        "sign_strategy": "Mãos rastreando linha imaginária de trás para a frente com olhar investigativo e código identificador.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Lote",
          "Origem",
          "Certificação"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-36",
        "term": "Procedimento Operacional Padronizado (POP)",
        "definition": "Instrução escrita e validada que detalha o passo a passo de como executar operações específicas para garantir a padronização e a segurança sanitária.",
        "description": "Instrução escrita e validada que detalha o passo a passo de como executar operações específicas para garantir a padronização e a segurança sanitária.",
        "context": "Exigência legal para higienização de caixas d'água, controle de pragas e higienização de superfícies.",
        "signStrategy": "Datilologia P-O-P associada ao sinal de DOCUMENTO DE REGRAS PASSO-A-PASSO.",
        "sign_strategy": "Datilologia P-O-P associada ao sinal de DOCUMENTO DE REGRAS PASSO-A-PASSO.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "POP",
          "Qualidade",
          "Anvisa"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-37",
        "term": "Controle sanitário",
        "definition": "Conjunto de ações de monitoramento e intervenção técnica realizado sobre as etapas de produção e comercialização para assegurar a conformidade com as normas de saúde.",
        "description": "Conjunto de ações de monitoramento e intervenção técnica realizado sobre as etapas de produção e comercialização para assegurar a conformidade com as normas de saúde.",
        "context": "Atuação conjunta das equipes de controle de qualidade das fábricas e órgãos oficiais de fiscalização.",
        "signStrategy": "Sinal de FISCALIZAR/MEDIR com autoridade técnica sobre alimentos.",
        "sign_strategy": "Sinal de FISCALIZAR/MEDIR com autoridade técnica sobre alimentos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Fiscalização",
          "Sanidade",
          "Padrão"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-38",
        "term": "Vigilância sanitária",
        "definition": "Conjunto de ações capazes de eliminar, diminuir ou prevenir riscos à saúde e de intervir nos problemas sanitários decorrentes do meio ambiente, da produção e da circulação de bens.",
        "description": "Conjunto de ações capazes de eliminar, diminuir ou prevenir riscos à saúde e de intervir nos problemas sanitários decorrentes do meio ambiente, da produção e da circulação de bens.",
        "context": "Órgão do SUS responsável por emitir alvarás sanitários, fiscalizar cozinhas, supermercados e indústrias.",
        "signStrategy": "Sinal de OLHO ATENTO/VIGIAR associado ao símbolo da SAÚDE e PROTEÇÃO.",
        "sign_strategy": "Sinal de OLHO ATENTO/VIGIAR associado ao símbolo da SAÚDE e PROTEÇÃO.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "VISA",
          "SUS",
          "Saúde Pública"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-39",
        "term": "Inspeção sanitária",
        "definition": "Procedimento fiscalizatório oficial realizado por autoridades públicas para verificar o cumprimento das normas higiênico-sanitárias em instalações e produtos.",
        "description": "Procedimento fiscalizatório oficial realizado por autoridades públicas para verificar o cumprimento das normas higiênico-sanitárias em instalações e produtos.",
        "context": "Realizada pelo SIM, SIE ou SIF em produtos de origem animal e vegetal para atestar conformidade antes da venda.",
        "signStrategy": "Fiscal observando minunciosamente prancheta e ambiente com sinal de AVALIAÇÃO OFICIAL.",
        "sign_strategy": "Fiscal observando minunciosamente prancheta e ambiente com sinal de AVALIAÇÃO OFICIAL.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "SIM",
          "SIF",
          "Inspeção"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-40",
        "term": "Qualidade dos alimentos",
        "definition": "Conjunto de características de um alimento relacionadas, entre outros aspectos, à segurança, composição, propriedades sensoriais, conformidade e adequação ao uso.",
        "description": "Conjunto de características de um alimento relacionadas, entre outros aspectos, à segurança, composição, propriedades sensoriais, conformidade e adequação ao uso.",
        "context": "Avaliada em laboratórios físico-químicos e microbiológicos, além da apreciação sensorial do consumidor.",
        "signStrategy": "Sinal de NOTA DEZ / ALIMENTO EXCELENTE com expressão facial de aprovação.",
        "sign_strategy": "Sinal de NOTA DEZ / ALIMENTO EXCELENTE com expressão facial de aprovação.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Conformidade",
          "Sensorial",
          "Padrão"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-41",
        "term": "Qualidade higiênico-sanitária",
        "definition": "Grau em que os alimentos atendem aos parâmetros bacteriológicos, físico-químicos e de higiene exigidos para proteção da saúde do consumidor.",
        "description": "Grau em que os alimentos atendem aos parâmetros bacteriológicos, físico-químicos e de higiene exigidos para proteção da saúde do consumidor.",
        "context": "Demonstrada por laudos que atestam ausência de coliformes termotolerantes, Salmonella e estafilococos.",
        "signStrategy": "Sinal de HIGIENE PERFEITA + ALIMENTO SEM BACTÉRIA com rigor.",
        "sign_strategy": "Sinal de HIGIENE PERFEITA + ALIMENTO SEM BACTÉRIA com rigor.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Microbiologia",
          "Laudos",
          "Sanidade"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-42",
        "term": "Prazo de validade",
        "definition": "Período durante o qual o alimento mantém as características de segurança e qualidade previstas, quando conservado nas condições estabelecidas.",
        "description": "Período durante o qual o alimento mantém as características de segurança e qualidade previstas, quando conservado nas condições estabelecidas.",
        "context": "Informação obrigatória que proíbe expressamente a comercialização de produtos expirados pelo Código de Defesa do Consumidor.",
        "signStrategy": "Configuração apontando a data limite no calendário: ATÉ AQUI PODE, DEPOIS PROIBIDO.",
        "sign_strategy": "Configuração apontando a data limite no calendário: ATÉ AQUI PODE, DEPOIS PROIBIDO.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Rotulagem",
          "Validade",
          "Consumidor"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-43",
        "term": "Vida de prateleira",
        "definition": "Tempo em que um alimento embalado permanece seguro, mantém suas propriedades sensoriais, físicas e nutricionais sob as condições de conservação indicadas.",
        "description": "Tempo em que um alimento embalado permanece seguro, mantém suas propriedades sensoriais, físicas e nutricionais sob as condições de conservação indicadas.",
        "context": "Conhecido no meio técnico como 'shelf-life', estabelecido através de ensaios laboratoriais acelerados.",
        "signStrategy": "Classificador indicando o produto na prateleira durando dias, meses ou anos com estabilidade.",
        "sign_strategy": "Classificador indicando o produto na prateleira durando dias, meses ou anos com estabilidade.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Shelf-Life",
          "Estabilidade",
          "Armazenamento"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-44",
        "term": "Perecibilidade",
        "definition": "Suscetibilidade natural de um alimento sofrer rápida deterioração microbiológica ou enzimática em curto espaço de tempo se não mantido sob refrigeração ou congelamento.",
        "description": "Suscetibilidade natural de um alimento sofrer rápida deterioração microbiológica ou enzimática em curto espaço de tempo se não mantido sob refrigeração ou congelamento.",
        "context": "Frutas maduras, carnes frescas, queijos de massa mole e pescados têm altíssima perecibilidade.",
        "signStrategy": "Gesto de tempo curto indicando que o alimento estraga velozmente sem controle térmico.",
        "sign_strategy": "Gesto de tempo curto indicando que o alimento estraga velozmente sem controle térmico.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Vida Útil",
          "Frescor",
          "Temperatura"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-45",
        "term": "Alimento perecível",
        "definition": "Alimento que, por sua composição e alta atividade de água, estraga com facilidade se não mantido em condições estritas de temperatura e conservação.",
        "description": "Alimento que, por sua composição e alta atividade de água, estraga com facilidade se não mantido em condições estritas de temperatura e conservação.",
        "context": "Exige refrigeração imediata e respeito rigoroso ao prazo de consumo após aberto.",
        "signStrategy": "Sinal de COMIDA + ESTRAGA RÁPIDO / PRECISA GELADEIRA.",
        "sign_strategy": "Sinal de COMIDA + ESTRAGA RÁPIDO / PRECISA GELADEIRA.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Perecíveis",
          "Frio",
          "Manuseio"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-46",
        "term": "Alimento não perecível",
        "definition": "Alimento seco ou estável em temperatura ambiente que possui baixa atividade de água e longa vida de prateleira sem necessidade de frio imediato.",
        "description": "Alimento seco ou estável em temperatura ambiente que possui baixa atividade de água e longa vida de prateleira sem necessidade de frio imediato.",
        "context": "Exemplos: arroz, feijão cru, farinha de mandioca, sal, açúcar e produtos enlatados intactos.",
        "signStrategy": "Sinal de COMIDA SECA + DURA MUITO TEMPO / RESISTE FORA DA GELADEIRA.",
        "sign_strategy": "Sinal de COMIDA SECA + DURA MUITO TEMPO / RESISTE FORA DA GELADEIRA.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Não Perecíveis",
          "Grãos",
          "Dispensa"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-47",
        "term": "Higienização",
        "definition": "Operação completa que engloba a limpeza para remoção de sujidades visíveis e a posterior sanitização para eliminação ou redução de microrganismos a níveis seguros.",
        "description": "Operação completa que engloba a limpeza para remoção de sujidades visíveis e a posterior sanitização para eliminação ou redução de microrganismos a níveis seguros.",
        "context": "Regra áurea: não se sanitiza superfície suja; é indispensável lavar com detergente antes do sanitizante.",
        "signStrategy": "Sinal em duas etapas visíveis: 1) LAVAR COM SABÃO (limpeza) + 2) DESINFETAR (sanitização).",
        "sign_strategy": "Sinal em duas etapas visíveis: 1) LAVAR COM SABÃO (limpeza) + 2) DESINFETAR (sanitização).",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Higienização",
          "Limpeza",
          "Sanitização"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-48",
        "term": "Limpeza",
        "definition": "Remoção física de sujidades, poeira, resíduos de alimentos, gordura e outras matérias indesejáveis de superfícies, equipamentos e utensílios.",
        "description": "Remoção física de sujidades, poeira, resíduos de alimentos, gordura e outras matérias indesejáveis de superfícies, equipamentos e utensílios.",
        "context": "Feita com água, ação mecânica de esfregar e detergentes tensoativos biodegradáveis.",
        "signStrategy": "Gesto enérgico de esfregar e enxaguar removendo toda a sujeira visível.",
        "sign_strategy": "Gesto enérgico de esfregar e enxaguar removendo toda a sujeira visível.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Detergente",
          "Remoção de Sujeira",
          "Operação"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-49",
        "term": "Sanitização",
        "definition": "Aplicação de agentes físicos ou químicos em superfícies limpas para reduzir a carga microbiana residual a níveis aceitáveis para a saúde pública.",
        "description": "Aplicação de agentes físicos ou químicos em superfícies limpas para reduzir a carga microbiana residual a níveis aceitáveis para a saúde pública.",
        "context": "Uso de soluções cloradas a 100-200 ppm, álcool 70% ou ácido peracético em bancadas e utensílios.",
        "signStrategy": "Sinal de pulverizar sanitizante ou passar pano com produto que destrói bactérias invisíveis.",
        "sign_strategy": "Sinal de pulverizar sanitizante ou passar pano com produto que destrói bactérias invisíveis.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Cloro",
          "Álcool 70%",
          "Bactérias"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-50",
        "term": "Desinfecção",
        "definition": "Processo físico ou químico que destrói microrganismos patogênicos e deteriorantes presentes em objetos inanimados ou ambientes de manipulação.",
        "description": "Processo físico ou químico que destrói microrganismos patogênicos e deteriorantes presentes em objetos inanimados ou ambientes de manipulação.",
        "context": "Aplicada em pisos, ralos, caixas d'água e equipamentos hospitalares e agroindustriais.",
        "signStrategy": "Gesto firme de esterilização química eliminando germes do ambiente.",
        "sign_strategy": "Gesto firme de esterilização química eliminando germes do ambiente.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Desinfetantes",
          "Biossegurança",
          "Controle"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-51",
        "term": "Potabilidade da água",
        "definition": "Condição da água que atende a todos os padrões microbiológicos, químicos e físicos estabelecidos pela legislação para ser segura ao consumo humano e manipulação.",
        "description": "Condição da água que atende a todos os padrões microbiológicos, químicos e físicos estabelecidos pela legislação para ser segura ao consumo humano e manipulação.",
        "context": "Regulamentada pela Portaria GM/MS nº 888/2021 do Ministério da Saúde com testes periódicos de coliformes e cloro residual.",
        "signStrategy": "Sinal de ÁGUA + TESTE APROVADO / CRISTALINA E SEGURA PARA BEBER.",
        "sign_strategy": "Sinal de ÁGUA + TESTE APROVADO / CRISTALINA E SEGURA PARA BEBER.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Portaria 888",
          "Água Limpa",
          "Saúde Pública"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-52",
        "term": "Água potável",
        "definition": "Água tratada ou de fonte segura cujos parâmetros bacteriológicos e físico-químicos não oferecem risco à saúde humana.",
        "description": "Água tratada ou de fonte segura cujos parâmetros bacteriológicos e físico-químicos não oferecem risco à saúde humana.",
        "context": "Insumo primário em qualquer cozinha, agroindústria e higienização de hortaliças.",
        "signStrategy": "Sinal de ÁGUA + BEBER DIRETAMENTE SEM MEDO.",
        "sign_strategy": "Sinal de ÁGUA + BEBER DIRETAMENTE SEM MEDO.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Água Tratada",
          "Cloração",
          "Insumo Vital"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-53",
        "term": "Temperatura segura",
        "definition": "Faixa térmica na qual os microrganismos patogênicos não conseguem se multiplicar rapidamente (abaixo de 5°C ou acima de 60°C).",
        "description": "Faixa térmica na qual os microrganismos patogênicos não conseguem se multiplicar rapidamente (abaixo de 5°C ou acima de 60°C).",
        "context": "A 'zona de perigo' situa-se entre 5°C e 60°C, onde bactérias dobram de população a cada 20 minutos.",
        "signStrategy": "Termômetro imaginário indicando: BAIXO (frio extremo) SEGURO, ALTO (quente extremo) SEGURO, MEIO PERIGOSO.",
        "sign_strategy": "Termômetro imaginário indicando: BAIXO (frio extremo) SEGURO, ALTO (quente extremo) SEGURO, MEIO PERIGOSO.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Zona de Perigo",
          "Termometria",
          "Conservação"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-54",
        "term": "Cadeia do frio",
        "definition": "Manutenção ininterrupta de alimentos refrigerados ou congelados em temperaturas seguras desde a produção, armazenamento e transporte até o consumo.",
        "description": "Manutenção ininterrupta de alimentos refrigerados ou congelados em temperaturas seguras desde a produção, armazenamento e transporte até o consumo.",
        "context": "O rompimento da cadeia do frio degrada a textura, permite multiplicação de patógenos e reduz o prazo de validade.",
        "signStrategy": "Fluxo contínuo com sinal de FRIO passando de esteira para caminhão e geladeira do mercado sem corte.",
        "sign_strategy": "Fluxo contínuo com sinal de FRIO passando de esteira para caminhão e geladeira do mercado sem corte.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Frio Ininterrupto",
          "Logística Frigorificada",
          "Qualidade"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-55",
        "term": "Refrigeração",
        "definition": "Método de conservação térmica em temperaturas entre 0°C e 7°C que desacelera a multiplicação microbiana e as reações enzimáticas sem congelar o alimento.",
        "description": "Método de conservação térmica em temperaturas entre 0°C e 7°C que desacelera a multiplicação microbiana e as reações enzimáticas sem congelar o alimento.",
        "context": "Ideal para laticínios, carnes frescas por curto período, ovos e refeições prontas resfriadas.",
        "signStrategy": "Sinal de GELADEIRA / FRIO MODERADO com as mãos protegendo os recipientes.",
        "sign_strategy": "Sinal de GELADEIRA / FRIO MODERADO com as mãos protegendo os recipientes.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Geladeira",
          "Conservação",
          "Temperatura"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-56",
        "term": "Congelamento",
        "definition": "Método de conservação térmica em temperaturas inferiores a -18°C que imobiliza a água líquida em cristais de gelo, paralisando a atividade microbiana.",
        "description": "Método de conservação térmica em temperaturas inferiores a -18°C que imobiliza a água líquida em cristais de gelo, paralisando a atividade microbiana.",
        "context": "Permite conservar carnes, polpas de frutas e pratos prontos por muitos meses sem aditivos químicos.",
        "signStrategy": "Gesto de congelar: mãos se solidificando bruscamente imobilizando a matéria sob frio extremo.",
        "sign_strategy": "Gesto de congelar: mãos se solidificando bruscamente imobilizando a matéria sob frio extremo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Freezer",
          "-18°C",
          "Longa Conservação"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-57",
        "term": "Descongelamento seguro",
        "definition": "Processo lento de descongelamento conduzido sob refrigeração (abaixo de 5°C), em micro-ondas ou cocção direta, evitando temperaturas ambientes perigosas.",
        "description": "Processo lento de descongelamento conduzido sob refrigeração (abaixo de 5°C), em micro-ondas ou cocção direta, evitando temperaturas ambientes perigosas.",
        "context": "Jamais descongelar em bacia sobre a pia ou imerso em água parada morna, para evitar explosão bacteriana superficial.",
        "signStrategy": "Alimento saindo do freezer para dentro da geladeira, amolecendo devagar e em segurança.",
        "sign_strategy": "Alimento saindo do freezer para dentro da geladeira, amolecendo devagar e em segurança.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Boas Práticas",
          "Descongelamento",
          "Prevenção"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-58",
        "term": "Cocção",
        "definition": "Tratamento térmico de alimentos pelo calor que atinge temperaturas internas seguras (geralmente acima de 70°C), destruindo a maioria dos patógenos vegetativos.",
        "description": "Tratamento térmico de alimentos pelo calor que atinge temperaturas internas seguras (geralmente acima de 70°C), destruindo a maioria dos patógenos vegetativos.",
        "context": "Cozinhar, assar ou fritar até o ponto térmico central seguro garante a eliminação de Salmonella e coliformes.",
        "signStrategy": "Mãos sobre fogo/panela fervente demonstrando o calor intenso transformando o alimento.",
        "sign_strategy": "Mãos sobre fogo/panela fervente demonstrando o calor intenso transformando o alimento.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Fogo",
          "Cozimento",
          "Inativação Térmica"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-59",
        "term": "Reaquecimento",
        "definition": "Aplicação de calor em alimentos previamente cozidos para atingir rapidamente temperatura igual ou superior a 74°C em todo o seu interior antes de servir.",
        "description": "Aplicação de calor em alimentos previamente cozidos para atingir rapidamente temperatura igual ou superior a 74°C em todo o seu interior antes de servir.",
        "context": "Essencial em buffets e restaurantes para impedir que sobras mantidas mornas causem surtos por Bacillus cereus.",
        "signStrategy": "Sinal de AQUECER DE NOVO com fumaça e fervura rápida até o centro.",
        "sign_strategy": "Sinal de AQUECER DE NOVO com fumaça e fervura rápida até o centro.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Buffet",
          "Segurança Térmica",
          "Sobras"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-60",
        "term": "Deterioração dos alimentos",
        "definition": "Conjunto de alterações microbiológicas, químicas, físicas ou enzimáticas que reduzem a qualidade e a aceitabilidade de um alimento.",
        "description": "Conjunto de alterações microbiológicas, químicas, físicas ou enzimáticas que reduzem a qualidade e a aceitabilidade de um alimento.",
        "context": "Perceptível por odor azedo, amolecimento, limo superficial, bolor ou sabor amargo, tornando o alimento impróprio.",
        "signStrategy": "Alimento fresco sofrendo alteração visual com enrugamento, mudança de cor e expressão de nojo.",
        "sign_strategy": "Alimento fresco sofrendo alteração visual com enrugamento, mudança de cor e expressão de nojo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Alteração",
          "Bolores",
          "Perda"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-61",
        "term": "Microrganismo",
        "definition": "Organismo vivo microscópico invisível a olho nu, como bactérias, fungos filamentosos, leveduras, protozoários e vírus.",
        "description": "Organismo vivo microscópico invisível a olho nu, como bactérias, fungos filamentosos, leveduras, protozoários e vírus.",
        "context": "Alguns são benéficos (produção de pães e queijos) e outros são agentes perigosos de deterioração e doenças.",
        "signStrategy": "Gesto de olhar no microscópio com mãos simulando pontinhos minúsculos e ativos invisíveis a olho comum.",
        "sign_strategy": "Gesto de olhar no microscópio com mãos simulando pontinhos minúsculos e ativos invisíveis a olho comum.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Microbiologia",
          "Seres Microscópicos",
          "Ciência"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-62",
        "term": "Microrganismo patogênico",
        "definition": "Microrganismo capaz de causar doenças.",
        "description": "Microrganismo capaz de causar doenças.",
        "context": "Alvo primordial das regras de pasteurização, sanitização e cocção em serviços alimentares.",
        "signStrategy": "Microrganismo com expressão facial agressiva e sinal indicativo de DOENÇA/INFECÇÃO.",
        "sign_strategy": "Microrganismo com expressão facial agressiva e sinal indicativo de DOENÇA/INFECÇÃO.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Patógenos",
          "Perigo Biológico",
          "Saúde"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-63",
        "term": "Bactéria",
        "definition": "Microrganismo unicelular procarionte que pode ser benéfico (como na fermentação) ou causador de contaminações e intoxicações alimentares.",
        "description": "Microrganismo unicelular procarionte que pode ser benéfico (como na fermentação) ou causador de contaminações e intoxicações alimentares.",
        "context": "Possuem capacidade de rápida replicação exponencial sob temperatura e nutrientes favoráveis.",
        "signStrategy": "Datilologia B-A-C-T-E-R-I-A associada ao classificador de cápsula oval multiplicando-se em duas.",
        "sign_strategy": "Datilologia B-A-C-T-E-R-I-A associada ao classificador de cápsula oval multiplicando-se em duas.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Procariontes",
          "Bactérias",
          "Microbiologia"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-64",
        "term": "Vírus",
        "definition": "Agente infeccioso submicroscópico constituído por material genético e capa proteica que se multiplica exclusivamente dentro de células hospedeiras vivas.",
        "description": "Agente infeccioso submicroscópico constituído por material genético e capa proteica que se multiplica exclusivamente dentro de células hospedeiras vivas.",
        "context": "Norovírus e Hepatite A são transmitidos com facilidade por manipuladores que não lavam as mãos ou água contaminada.",
        "signStrategy": "Datilologia V-I-R-U-S com configuração circular e espículas superficiais invadindo células.",
        "sign_strategy": "Datilologia V-I-R-U-S com configuração circular e espículas superficiais invadindo células.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Norovírus",
          "Hepatite A",
          "Partícula Viral"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-65",
        "term": "Fungo",
        "definition": "Organismo eucariótico que inclui leveduras e bolores, capaz de decompor alimentos e produzir micotoxinas sob condições propícias de umidade e calor.",
        "description": "Organismo eucariótico que inclui leveduras e bolores, capaz de decompor alimentos e produzir micotoxinas sob condições propícias de umidade e calor.",
        "context": "Bolores visíveis no pão ou queijo podem conter aflatoxinas cancerígenas que penetram muito além da mancha aparente.",
        "signStrategy": "Classificador de filamentos se expandindo como mofo e esporos sobre cascas e massas.",
        "sign_strategy": "Classificador de filamentos se expandindo como mofo e esporos sobre cascas e massas.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Bolores",
          "Micotoxinas",
          "Leveduras"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-66",
        "term": "Parasita",
        "definition": "Organismo que vive e se alimenta de outro organismo hospedeiro, podendo ser transmitido por água não tratada ou carnes e vegetais crus contaminados.",
        "description": "Organismo que vive e se alimenta de outro organismo hospedeiro, podendo ser transmitido por água não tratada ou carnes e vegetais crus contaminados.",
        "context": "Giardia, amebas, tênias e toxoplasma são exemplos de parasitas preveníveis por cocção e lavagem com sanitizante clorado.",
        "signStrategy": "Gesto de verme ou organismo que se aloja e suga nutrientes dentro do trato gastrointestinal.",
        "sign_strategy": "Gesto de verme ou organismo que se aloja e suga nutrientes dentro do trato gastrointestinal.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Verminose",
          "Giardia",
          "Contaminação"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-67",
        "term": "Toxina",
        "definition": "Substância venenosa produzida por microrganismos vivos (como bactérias ou fungos) que contamina o alimento e causa intoxicação aguda mesmo após o calor destruir o microrganismo.",
        "description": "Substância venenosa produzida por microrganismos vivos (como bactérias ou fungos) que contamina o alimento e causa intoxicação aguda mesmo após o calor destruir o microrganismo.",
        "context": "A toxina botulínica e as enterotoxinas estafilocócicas suportam longas fervuras em alguns casos.",
        "signStrategy": "Sinal de VENENO BIOLÓGICO invisível impregnado no alimento com alerta visual intenso.",
        "sign_strategy": "Sinal de VENENO BIOLÓGICO invisível impregnado no alimento com alerta visual intenso.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Toxinas",
          "Intoxicação",
          "Termorresistência"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-68",
        "term": "Biofilme",
        "definition": "Comunidade estruturada de microrganismos aderida a uma superfície inanimada (como bancadas de inox ou tanques) envolta em matriz protetora resistente a sanitizantes comuns.",
        "description": "Comunidade estruturada de microrganismos aderida a uma superfície inanimada (como bancadas de inox ou tanques) envolta em matriz protetora resistente a sanitizantes comuns.",
        "context": "Grande desafio na indústria de laticínios e frigoríficos, exigindo esfrega mecânica rigorosa com detergentes alcalinos e ácidos alternados.",
        "signStrategy": "Mãos espalhando camada invisível pegajosa e impenetrável fixada sobre uma tubulação ou mesa.",
        "sign_strategy": "Mãos espalhando camada invisível pegajosa e impenetrável fixada sobre uma tubulação ou mesa.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Biofilmes",
          "Aderência",
          "Higienização Industrial"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-69",
        "term": "Praga",
        "definition": "Espécie animal ou inseto indesejável (como ratos, baratas, formigas e pombos) capaz de contaminar alimentos com microrganismos patogênicos e excretas.",
        "description": "Espécie animal ou inseto indesejável (como ratos, baratas, formigas e pombos) capaz de contaminar alimentos com microrganismos patogênicos e excretas.",
        "context": "A presença de fezes de roedores ou asas de insetos configura adulteração e crime contra a saúde pública.",
        "signStrategy": "Mão simulando inseto ou roedor rastejando furtivamente sobre sacarias de grãos.",
        "sign_strategy": "Mão simulando inseto ou roedor rastejando furtivamente sobre sacarias de grãos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Vetores",
          "Pragas Urbanas",
          "Sanidade"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-70",
        "term": "Controle integrado de pragas",
        "definition": "Sistema que combina medidas preventivas de edificação, higiene e controle físico-químico racional para evitar o abrigo e a proliferação de vetores.",
        "description": "Sistema que combina medidas preventivas de edificação, higiene e controle físico-químico racional para evitar o abrigo e a proliferação de vetores.",
        "context": "Baseia-se nos 4 'As': eliminar Acesso, Abrigo, Alimento e Água para as pragas com laudos mensais de empresas certificadas.",
        "signStrategy": "Sinal de BARREIRA FÍSICA nas portas e ralos + MONITORAMENTO com armadilhas mecânicas.",
        "sign_strategy": "Sinal de BARREIRA FÍSICA nas portas e ralos + MONITORAMENTO com armadilhas mecânicas.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "CIP",
          "Prevenção",
          "Barreiras Físicas"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-71",
        "term": "Resíduo",
        "definition": "Substância ou material orgânico e inorgânico resultante das etapas de produção e processamento que deve ser adequadamente descartado ou reaproveitado.",
        "description": "Substância ou material orgânico e inorgânico resultante das etapas de produção e processamento que deve ser adequadamente descartado ou reaproveitado.",
        "context": "Cascas, aparas, águas de lavagem e embalagens que precisam de gerenciamento para não atrair moscas nem poluir o solo.",
        "signStrategy": "Sinal de LIXO/SOBRA INDUSTRIAL sendo separado e direcionado para compostagem ou descarte correto.",
        "sign_strategy": "Sinal de LIXO/SOBRA INDUSTRIAL sendo separado e direcionado para compostagem ou descarte correto.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Gestão Ambiental",
          "Descarte",
          "Efluentes"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-72",
        "term": "Desperdício de alimentos",
        "definition": "Descarte de alimentos adequados para consumo humano que ocorre nas etapas de distribuição comercial, serviços de alimentação e consumo domiciliar.",
        "description": "Descarte de alimentos adequados para consumo humano que ocorre nas etapas de distribuição comercial, serviços de alimentação e consumo domiciliar.",
        "context": "Problema ético e socioambiental combatido com aproveitamento integral, planejamento de cardápio e bancos de alimentos.",
        "signStrategy": "Expressão de pesar com sinal de COMIDA BOA JOGADA FORA / NO LIXO desnecessariamente.",
        "sign_strategy": "Expressão de pesar com sinal de COMIDA BOA JOGADA FORA / NO LIXO desnecessariamente.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Desperdício",
          "Sustentabilidade",
          "Combate à Fome"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-73",
        "term": "Pasteurização",
        "definition": "Tratamento térmico controlado destinado principalmente à redução de microrganismos patogênicos e deteriorantes, aumentando a segurança e a conservação do alimento.",
        "description": "Tratamento térmico controlado destinado principalmente à redução de microrganismos patogênicos e deteriorantes, aumentando a segurança e a conservação do alimento.",
        "context": "Tratamento essencial aplicado ao leite fluido, polpas de suco e cervejas antes da comercialização.",
        "signStrategy": "Sinal de CALOR CONTROLADO seguido de RESFRIAMENTO BRUSCO com estabilização segura.",
        "sign_strategy": "Sinal de CALOR CONTROLADO seguido de RESFRIAMENTO BRUSCO com estabilização segura.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Tratamento Térmico",
          "Leite",
          "Inocuidade"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-74",
        "term": "Esterilização de alimentos",
        "definition": "Tratamento destinado à destruição ou inativação de microrganismos capazes de se desenvolver nas condições previstas de armazenamento do produto.",
        "description": "Tratamento destinado à destruição ou inativação de microrganismos capazes de se desenvolver nas condições previstas de armazenamento do produto.",
        "context": "Aplicada em conservas vegetais e caixinhas Tetra Pak (UHT) permitindo estocagem sem refrigeração por meses.",
        "signStrategy": "Sinal de CALOR EXTREMO (autoclave) eliminando 100% dos microrganismos e esporos.",
        "sign_strategy": "Sinal de CALOR EXTREMO (autoclave) eliminando 100% dos microrganismos e esporos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "UHT",
          "Conservas",
          "Esterilização"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-75",
        "term": "Fermentação",
        "definition": "Processo metabólico realizado por microrganismos ou suas enzimas que transforma componentes do alimento e pode modificar sabor, textura, conservação ou composição.",
        "description": "Processo metabólico realizado por microrganismos ou suas enzimas que transforma componentes do alimento e pode modificar sabor, textura, conservação ou composição.",
        "context": "Usada ancestralmente na panificação, iogurtes, queijos, cervejas artesanais e kefir.",
        "signStrategy": "Mãos simulando borbulhamento metabólico e crescimento vivo da massa ou líquido.",
        "sign_strategy": "Mãos simulando borbulhamento metabólico e crescimento vivo da massa ou líquido.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Fermentação",
          "Biotecnologia",
          "Transformação"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-76",
        "term": "Salmonella",
        "definition": "Gênero de bactérias que inclui espécies e sorotipos capazes de causar infecções transmitidas por alimentos.",
        "description": "Gênero de bactérias que inclui espécies e sorotipos capazes de causar infecções transmitidas por alimentos.",
        "context": "Habita o trato de aves e répteis; eliminada por cocção acima de 74°C e refrigeração de ovos.",
        "signStrategy": "Datilologia S-A-L-M-O-N-E-L-L-A associada ao alerta de contaminação em ovos e frangos mal cozidos.",
        "sign_strategy": "Datilologia S-A-L-M-O-N-E-L-L-A associada ao alerta de contaminação em ovos e frangos mal cozidos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Salmonella",
          "Ovos",
          "DTA"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-77",
        "term": "Listeria monocytogenes",
        "definition": "Bactéria patogênica transmitida por alimentos que causa listeriose e representa risco especialmente elevado para determinados grupos populacionais.",
        "description": "Bactéria patogênica transmitida por alimentos que causa listeriose e representa risco especialmente elevado para determinados grupos populacionais.",
        "context": "Muito perigosa para gestantes e idosos por conseguir crescer mesmo dentro da geladeira a 4°C em queijos e embutidos.",
        "signStrategy": "Datilologia L-I-S-T-E-R-I-A com ênfase na sobrevivência dentro do refrigerador.",
        "sign_strategy": "Datilologia L-I-S-T-E-R-I-A com ênfase na sobrevivência dentro do refrigerador.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Listeria",
          "Psicrófilo",
          "Laticínios"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-78",
        "term": "Escherichia coli",
        "definition": "Espécie bacteriana normalmente encontrada no intestino humano e animal, mas que possui determinadas linhagens capazes de causar doenças transmitidas por alimentos.",
        "description": "Espécie bacteriana normalmente encontrada no intestino humano e animal, mas que possui determinadas linhagens capazes de causar doenças transmitidas por alimentos.",
        "context": "Indicadora universal de contaminação fecal em laudos de análise de água potável e alimentos in natura.",
        "signStrategy": "Datilologia E-.-C-O-L-I indicando presença fecal no exame microscópico de água ou salada.",
        "sign_strategy": "Datilologia E-.-C-O-L-I indicando presença fecal no exame microscópico de água ou salada.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "E. coli",
          "Coliformes",
          "Água"
        ],
        "axis_id": 1
      },
      {
        "id": "term-fund-79",
        "term": "Botulismo",
        "definition": "Doença grave causada pela ação de neurotoxinas produzidas pela bactéria Clostridium botulinum, podendo estar associada ao consumo de alimentos contaminados.",
        "description": "Doença grave causada pela ação de neurotoxinas produzidas pela bactéria Clostridium botulinum, podendo estar associada ao consumo de alimentos contaminados.",
        "context": "Casos graves exigem internação em UTI com soro antibotulínico; prevenível por acidificação correta de conservas de palmito e descarte de latas estufadas.",
        "signStrategy": "Datilologia B-O-T-U-L-I-S-M-O com sinal de PARALISIA MUSCULAR e advertência contra latas estufadas.",
        "sign_strategy": "Datilologia B-O-T-U-L-I-S-M-O com sinal de PARALISIA MUSCULAR e advertência contra latas estufadas.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Clostridium",
          "Toxina",
          "Emergência Médica"
        ],
        "axis_id": 1
      }
    ]
  },
  {
    "id": "imunologico-digestivo",
    "numericId": 2,
    "title": "Eixo 2 — Imunológico-Digestivo",
    "emoji": "🧬",
    "description": "Relações entre alimento, organismo, digestão, alergias, intolerâncias e respostas imunológicas.",
    "terms": [
      {
        "id": "term-imun-1",
        "term": "Alergia alimentar",
        "definition": "Reação do sistema imunológico a determinada substância presente em um alimento, geralmente uma proteína, reconhecida pelo organismo como prejudicial.",
        "description": "Reação do sistema imunológico a determinada substância presente em um alimento, geralmente uma proteína, reconhecida pelo organismo como prejudicial.",
        "context": "Requer exclusão total do alérgeno da dieta, pois mesmo quantidades microscópicas podem desencadear choque anafilático.",
        "signStrategy": "Sinal composto: COMIDA + IMUNIDADE REAGIR + CORPO EXPULSAR/ALERTA com expressão corporal intensa.",
        "sign_strategy": "Sinal composto: COMIDA + IMUNIDADE REAGIR + CORPO EXPULSAR/ALERTA com expressão corporal intensa.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Alergia",
          "Imunologia",
          "APLV",
          "Glúten"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-2",
        "term": "Intolerância alimentar",
        "definition": "Reação adversa a um alimento que, diferentemente da alergia alimentar, geralmente não envolve diretamente o sistema imunológico.",
        "description": "Reação adversa a um alimento que, diferentemente da alergia alimentar, geralmente não envolve diretamente o sistema imunológico.",
        "context": "Geralmente associada a deficiências enzimáticas no intestino (como lactase), dependendo da quantidade consumida.",
        "signStrategy": "Sinal composto: COMIDA + DIGESTÃO NÃO CONSEGUIR / BARRIGA INCHADA / GASES sem envolvimento de anticorpos.",
        "sign_strategy": "Sinal composto: COMIDA + DIGESTÃO NÃO CONSEGUIR / BARRIGA INCHADA / GASES sem envolvimento de anticorpos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Intolerância",
          "Digestão",
          "Enzimas",
          "Lactose"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-3",
        "term": "Reação adversa a alimentos",
        "definition": "Qualquer resposta clínica anormal após a ingestão de um alimento ou aditivo, compreendendo mecanismos imunológicos e não imunológicos.",
        "description": "Qualquer resposta clínica anormal após a ingestão de um alimento ou aditivo, compreendendo mecanismos imunológicos e não imunológicos.",
        "context": "Classificação médica guarda-chuva que divide os diagnósticos entre alergias, intolerâncias e aversões alimentares.",
        "signStrategy": "Sinal de INGERIR ALIMENTO seguido pelo corpo apresentando REAÇÃO NEGATIVA GERAL.",
        "sign_strategy": "Sinal de INGERIR ALIMENTO seguido pelo corpo apresentando REAÇÃO NEGATIVA GERAL.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Diagnóstico",
          "Clínica",
          "Imunologia"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-4",
        "term": "Hipersensibilidade alimentar",
        "definition": "Termo amplo que engloba tanto reações alérgicas mediadas ou não por anticorpos quanto intolerâncias a componentes alimentares.",
        "description": "Termo amplo que engloba tanto reações alérgicas mediadas ou não por anticorpos quanto intolerâncias a componentes alimentares.",
        "context": "Utilizado pela Organização Mundial de Alergia (WAO) para descrever indivíduos que reagem adversamente a doses toleradas pela maioria.",
        "signStrategy": "Sinal de CORPO HIPERSENSÍVEL / SENTIR MUITO MAIS FORTE QUALQUER SUBSTÂNCIA.",
        "sign_strategy": "Sinal de CORPO HIPERSENSÍVEL / SENTIR MUITO MAIS FORTE QUALQUER SUBSTÂNCIA.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Hipersensibilidade",
          "WAO",
          "Alergologia"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-5",
        "term": "Alérgeno alimentar",
        "definition": "Substância presente em um alimento capaz de desencadear uma reação alérgica em pessoas suscetíveis. Exemplos: Amendoim, castanhas, leite…",
        "description": "Substância presente em um alimento capaz de desencadear uma reação alérgica em pessoas suscetíveis. Exemplos: Amendoim, castanhas, leite…",
        "context": "A rotulagem clara dos alérgenos salva vidas diariamente de indivíduos com alergias graves.",
        "signStrategy": "Classificador indicando a proteína alérgena com marcador visual de PERIGO e ALERTA.",
        "sign_strategy": "Classificador indicando a proteína alérgena com marcador visual de PERIGO e ALERTA.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Proteína",
          "Alérgeno",
          "Rotulagem"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-6",
        "term": "Antígeno",
        "definition": "Substância ou molécula externa que, ao entrar no corpo, é reconhecida como estranha e é capaz de estimular uma resposta do sistema imune.",
        "description": "Substância ou molécula externa que, ao entrar no corpo, é reconhecida como estranha e é capaz de estimular uma resposta do sistema imune.",
        "context": "Nas alergias, antígenos alimentares inocentes são equivocadamente atacados pelos leucócitos como se fossem parasitas.",
        "signStrategy": "Mão simulando corpo estranho invasor com chave molecular específica sendo identificado pelo sistema imune.",
        "sign_strategy": "Mão simulando corpo estranho invasor com chave molecular específica sendo identificado pelo sistema imune.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Antígeno",
          "Imunologia",
          "Bioquímica"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-7",
        "term": "Anticorpo",
        "definition": "Proteína protetora produzida pelos linfócitos B plasmáticos para neutralizar antígenos específicos e invasores no organismo.",
        "description": "Proteína protetora produzida pelos linfócitos B plasmáticos para neutralizar antígenos específicos e invasores no organismo.",
        "context": "Formados em formato de 'Y', ligam-se cirurgicamente aos antígenos para sinalizar sua destruição ou neutralização.",
        "signStrategy": "Configuração de mão em formato de 'Y' conectando-se e capturando antígenos invasores no sangue.",
        "sign_strategy": "Configuração de mão em formato de 'Y' conectando-se e capturando antígenos invasores no sangue.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Anticorpos",
          "Imunoglobulinas",
          "Defesa"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-8",
        "term": "Imunoglobulina E (IgE)",
        "definition": "Classe de anticorpos envolvida nas reações alérgicas imediatas e na defesa contra parasitas intestinais.",
        "description": "Classe de anticorpos envolvida nas reações alérgicas imediatas e na defesa contra parasitas intestinais.",
        "context": "Sua dosagem sérica específica (IgE específica) auxilia médicos no diagnóstico confirmatório de alergias a camarão, leite e amendoim.",
        "signStrategy": "Datilologia I-g-E seguida do classificador em Y ligado a mastócitos liberando histamina.",
        "sign_strategy": "Datilologia I-g-E seguida do classificador em Y ligado a mastócitos liberando histamina.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "IgE",
          "Exame",
          "Anticorpo"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-9",
        "term": "Reação mediada por IgE",
        "definition": "Resposta alérgica em que anticorpos IgE fixados a mastócitos liberam histamina rapidamente após contato com o alérgeno alimentar.",
        "description": "Resposta alérgica em que anticorpos IgE fixados a mastócitos liberam histamina rapidamente após contato com o alérgeno alimentar.",
        "context": "Os sintomas surgem em minutos: urticária, coceira na boca, inchaço labial e risco de edema de glote súbito.",
        "signStrategy": "Conexão antígeno-IgE deflagrando explosão rápida de histamina em poucos minutos no corpo.",
        "sign_strategy": "Conexão antígeno-IgE deflagrando explosão rápida de histamina em poucos minutos no corpo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Reação Imediata",
          "IgE",
          "Anafilaxia"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-10",
        "term": "Reação não mediada por IgE",
        "definition": "Resposta alérgica mediada por células T ou outros anticorpos (não IgE), com sintomas inflamatórios gastrointestinais mais tardios.",
        "description": "Resposta alérgica mediada por células T ou outros anticorpos (não IgE), com sintomas inflamatórios gastrointestinais mais tardios.",
        "context": "Manifesta-se horas ou dias após a ingestão, como na proctocolite alérgica e FPIES em bebês alimentados com leite de vaca.",
        "signStrategy": "Reação inflamatória lenta conduzida por células de defesa do intestino sem IgE envolvido.",
        "sign_strategy": "Reação inflamatória lenta conduzida por células de defesa do intestino sem IgE envolvido.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Reação Tardia",
          "Células T",
          "FPIES"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-11",
        "term": "Anafilaxia",
        "definition": "Reação alérgica sistêmica grave, rápida e potencialmente fatal que afeta múltiplos órgãos e causa broncoespasmo e choque circulatório.",
        "description": "Reação alérgica sistêmica grave, rápida e potencialmente fatal que afeta múltiplos órgãos e causa broncoespasmo e choque circulatório.",
        "context": "Exige administração intramuscular imediata de epinefrina (adrenalina) e socorro médico urgente.",
        "signStrategy": "Sinais combinados: GARGANTA FECHANDO + PRESSÃO CAINDO + EMERGÊNCIA com expressão aflita.",
        "sign_strategy": "Sinais combinados: GARGANTA FECHANDO + PRESSÃO CAINDO + EMERGÊNCIA com expressão aflita.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Emergência",
          "Adrenalina",
          "Choque"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-12",
        "term": "Reação anafilática",
        "definition": "Manifestação clínica aguda da anafilaxia com queda de pressão arterial, edema de glote e dificuldade respiratória exigindo adrenalina imediata.",
        "description": "Manifestação clínica aguda da anafilaxia com queda de pressão arterial, edema de glote e dificuldade respiratória exigindo adrenalina imediata.",
        "context": "Pode ser desencadeada por traços infinitesimais de amendoim, frutos do mar ou picadas de insetos.",
        "signStrategy": "Gesto de aplicação rápida da caneta de adrenalina na coxa com arfar respiratório.",
        "sign_strategy": "Gesto de aplicação rápida da caneta de adrenalina na coxa com arfar respiratório.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Anafilaxia",
          "Epinefrina",
          "UTI"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-13",
        "term": "Sistema imunológico",
        "definition": "Rede complexa de células, tecidos e órgãos que defende o corpo contra patógenos e substâncias nocivas preservando a homeostase.",
        "description": "Rede complexa de células, tecidos e órgãos que defende o corpo contra patógenos e substâncias nocivas preservando a homeostase.",
        "context": "Mais de 70% das células do sistema imune encontram-se no tecido linfoide associado ao intestino (GALT).",
        "signStrategy": "Mãos cruzadas formando escudo protetor no peito e espalhando guardiões por todo o organismo.",
        "sign_strategy": "Mãos cruzadas formando escudo protetor no peito e espalhando guardiões por todo o organismo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Imunologia",
          "Defesa",
          "Linfócitos"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-14",
        "term": "Resposta imunológica",
        "definition": "Conjunto ordenado de reações celulares e bioquímicas desencadeadas pelo sistema imune ao identificar um corpo ou substância estranha.",
        "description": "Conjunto ordenado de reações celulares e bioquímicas desencadeadas pelo sistema imune ao identificar um corpo ou substância estranha.",
        "context": "Pode resultar em eliminação do invasor ou em imunopatologia caso desregulada e autoimune.",
        "signStrategy": "Exército de leucócitos mobilizando-se ordenadamente para atacar ou tolerar moléculas ingeridas.",
        "sign_strategy": "Exército de leucócitos mobilizando-se ordenadamente para atacar ou tolerar moléculas ingeridas.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Ativação Celular",
          "Citocinas",
          "Combate"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-15",
        "term": "Inflamação",
        "definition": "Processo protetor do organismo em resposta a lesões, infecções ou alérgenos, caracterizado por dor, calor, rubor e inchaço tecidual.",
        "description": "Processo protetor do organismo em resposta a lesões, infecções ou alérgenos, caracterizado por dor, calor, rubor e inchaço tecidual.",
        "context": "No intestino alérgico crônico, a inflamação destrói as vilosidades e prejudica a absorção nutricional.",
        "signStrategy": "Mãos sobre a barriga expandindo calor e inchaço pulsante com expressão de dor contínua.",
        "sign_strategy": "Mãos sobre a barriga expandindo calor e inchaço pulsante com expressão de dor contínua.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Inflamação",
          "Mucosa",
          "Sintoma"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-16",
        "term": "Trato gastrointestinal",
        "definition": "Tubo digestivo contínuo que vai da boca ao ânus, responsável pela digestão mecânica e enzimática, absorção de nutrientes e excreção.",
        "description": "Tubo digestivo contínuo que vai da boca ao ânus, responsável pela digestão mecânica e enzimática, absorção de nutrientes e excreção.",
        "context": "Órgão central de interface entre o ambiente externo e os sistemas metabólicos internos do ser humano.",
        "signStrategy": "Mão traçando o caminho anatômico desde a boca, esôfago, estômago, intestinos até o final do trato.",
        "sign_strategy": "Mão traçando o caminho anatômico desde a boca, esôfago, estômago, intestinos até o final do trato.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Anatomia",
          "Tubo Digestivo",
          "Fisiologia"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-17",
        "term": "Sistema digestório",
        "definition": "Conjunto formado pelo trato gastrointestinal e glândulas anexas (fígado, pâncreas) encarregado do processamento dos alimentos ingeridos.",
        "description": "Conjunto formado pelo trato gastrointestinal e glândulas anexas (fígado, pâncreas) encarregado do processamento dos alimentos ingeridos.",
        "context": "Atua de forma sincronizada com o sistema nervoso entérico e a microbiota intestinal.",
        "signStrategy": "Mãos englobando estômago, fígado, pâncreas e alças intestinais em funcionamento articulado.",
        "sign_strategy": "Mãos englobando estômago, fígado, pâncreas e alças intestinais em funcionamento articulado.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Digestão",
          "Órgãos",
          "Fisiologia Humana"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-18",
        "term": "Digestão",
        "definition": "Processo fisiológico de degradação mecânica e química de macromoléculas dos alimentos em nutrientes assimiláveis pelo epitélio intestinal.",
        "description": "Processo fisiológico de degradação mecânica e química de macromoléculas dos alimentos em nutrientes assimiláveis pelo epitélio intestinal.",
        "context": "Inicia na mastigação e salivação bucal, avança pela digestão gástrica ácida e conclui-se no duodeno.",
        "signStrategy": "Gesto de quebra e moagem de macromoléculas tornando-se substâncias microscópicas nutritivas.",
        "sign_strategy": "Gesto de quebra e moagem de macromoléculas tornando-se substâncias microscópicas nutritivas.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Mastigação",
          "Enzimas",
          "Processamento Interno"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-19",
        "term": "Absorção intestinal",
        "definition": "Passagem de água, eletrólitos e nutrientes digeridos do lúmen do intestino delgado através das vilosidades para a corrente sanguínea ou linfática.",
        "description": "Passagem de água, eletrólitos e nutrientes digeridos do lúmen do intestino delgado através das vilosidades para a corrente sanguínea ou linfática.",
        "context": "Ocorre primordialmente no jejuno e íleo dotados de microvilosidades que ampliam a área de contato.",
        "signStrategy": "Dedos em formato de microvilosidades captando nutrientes e transportando-os para os vasos sanguíneos.",
        "sign_strategy": "Dedos em formato de microvilosidades captando nutrientes e transportando-os para os vasos sanguíneos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Vilosidades",
          "Nutrição",
          "Circulação"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-20",
        "term": "Metabolismo",
        "definition": "Conjunto de transformações químicas e bioenergéticas celulares que sustentam a vida, divididas em catabolismo e anabolismo.",
        "description": "Conjunto de transformações químicas e bioenergéticas celulares que sustentam a vida, divididas em catabolismo e anabolismo.",
        "context": "Transforma carboidratos, proteínas e lipídios em ATP e biomoléculas celulares.",
        "signStrategy": "Mãos em fluxo contínuo de energia gerando força e renovação celular interna constante.",
        "sign_strategy": "Mãos em fluxo contínuo de energia gerando força e renovação celular interna constante.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Bioquímica",
          "ATP",
          "Energia"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-21",
        "term": "Microbiota intestinal",
        "definition": "Comunidade de trilhões de bactérias, leveduras e microrganismos simbióticos que colonizam o intestino e modulam imunidade e digestão.",
        "description": "Comunidade de trilhões de bactérias, leveduras e microrganismos simbióticos que colonizam o intestino e modulam imunidade e digestão.",
        "context": "Conhecida como o 'segundo cérebro', produz ácidos graxos de cadeia curta e neurotransmissores essenciais.",
        "signStrategy": "Mãos desenhando ecossistema microscópico vibrante e protetor povoando todo o intestino.",
        "sign_strategy": "Mãos desenhando ecossistema microscópico vibrante e protetor povoando todo o intestino.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Microbioma",
          "Bactérias Boas",
          "Saúde Intestinal"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-22",
        "term": "Barreira intestinal",
        "definition": "Estrutura funcional formada por muco, células epiteliais e junções de oclusão que impede a passagem de patógenos e macromoléculas para o sangue.",
        "description": "Estrutura funcional formada por muco, células epiteliais e junções de oclusão que impede a passagem de patógenos e macromoléculas para o sangue.",
        "context": "Quando íntegra, garante que apenas nutrientes completamente digeridos cheguem à circulação sistêmica.",
        "signStrategy": "Mãos alinhadas como muro de tijolos sólidos impedindo a invasão de toxinas para a circulação.",
        "sign_strategy": "Mãos alinhadas como muro de tijolos sólidos impedindo a invasão de toxinas para a circulação.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Epitélio",
          "Tight Junctions",
          "Proteção"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-23",
        "term": "Permeabilidade intestinal",
        "definition": "Grau de seletividade com que a mucosa intestinal permite a passagem de solutos; quando alterada ('leaky gut'), favorece alergias e inflamações.",
        "description": "Grau de seletividade com que a mucosa intestinal permite a passagem de solutos; quando alterada ('leaky gut'), favorece alergias e inflamações.",
        "context": "Hiperpermeabilidade permite a entrada de peptídeos alimentares intactos, deflagrando respostas imunes patológicas.",
        "signStrategy": "Muro intestinal abrindo frestas indevidas por onde vazam substâncias que irritam o sangue.",
        "sign_strategy": "Muro intestinal abrindo frestas indevidas por onde vazam substâncias que irritam o sangue.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Hiperpermeabilidade",
          "Leaky Gut",
          "Mucosa"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-24",
        "term": "Enzima digestiva",
        "definition": "Catalisador biológico proteico secretado pela saliva, estômago ou pâncreas que quebra nutrientes complexos em frações absorvíveis.",
        "description": "Catalisador biológico proteico secretado pela saliva, estômago ou pâncreas que quebra nutrientes complexos em frações absorvíveis.",
        "context": "Amilases quebram amido, proteases quebram proteínas e lipases quebram gorduras.",
        "signStrategy": "Mão simulando tesoura bioquímica microscópica cortando cadeias longas de nutrientes.",
        "sign_strategy": "Mão simulando tesoura bioquímica microscópica cortando cadeias longas de nutrientes.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Catálise",
          "Pâncreas",
          "Enzimas"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-25",
        "term": "Lactase",
        "definition": "Enzima produzida principalmente no intestino delgado responsável pela digestão da lactose.",
        "description": "Enzima produzida principalmente no intestino delgado responsável pela digestão da lactose.",
        "context": "Pessoas intolerantes podem ingerir a enzima lactase em comprimidos antes de consumir alimentos com leite.",
        "signStrategy": "Sinal de TESOURA BIOQUÍMICA cortando a molécula dupla do açúcar do leite.",
        "sign_strategy": "Sinal de TESOURA BIOQUÍMICA cortando a molécula dupla do açúcar do leite.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Enzima",
          "Digestão da Lactose",
          "Suplemento"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-26",
        "term": "Lactose",
        "definition": "Açúcar naturalmente presente no leite e em seus derivados, formado por glicose e galactose.",
        "description": "Açúcar naturalmente presente no leite e em seus derivados, formado por glicose e galactose.",
        "context": "Encontrada em leite integral, desnatado, iogurtes, manteigas e queijos de massa fresca.",
        "signStrategy": "Sinal de LEITE + AÇÚCAR NATURAL com duas unidades de carboidrato unidas.",
        "sign_strategy": "Sinal de LEITE + AÇÚCAR NATURAL com duas unidades de carboidrato unidas.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Carboidrato",
          "Leite",
          "Dissacarídeo"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-27",
        "term": "Intolerância à lactose",
        "definition": "Incapacidade digestiva de quebrar o açúcar lactose devido à diminuição ou ausência da enzima lactase na mucosa do intestino delgado.",
        "description": "Incapacidade digestiva de quebrar o açúcar lactose devido à diminuição ou ausência da enzima lactase na mucosa do intestino delgado.",
        "context": "Causa fermentação bacteriana com gases, dor espasmódica e diarreia ácida após o consumo de lácteos comuns.",
        "signStrategy": "Sinal de LEITE ingerido -> FALTA DE ENZIMA -> BARRIGA ESTUFADA / CÓLICA.",
        "sign_strategy": "Sinal de LEITE ingerido -> FALTA DE ENZIMA -> BARRIGA ESTUFADA / CÓLICA.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Lactase",
          "Intolerância",
          "Gases"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-28",
        "term": "Proteína do leite",
        "definition": "Fração proteica do leite composta por caseínas (aprox. 80%) e proteínas do soro (aprox. 20%), principais gatilhos de alergias em bebês.",
        "description": "Fração proteica do leite composta por caseínas (aprox. 80%) e proteínas do soro (aprox. 20%), principais gatilhos de alergias em bebês.",
        "context": "Completamente diferente da lactose (açúcar); por isso produtos 'sem lactose' continuam proibidos para alérgicos ao leite.",
        "signStrategy": "Sinal de PROTEÍNA DE LEITE com advertência de não confundir com lactose.",
        "sign_strategy": "Sinal de PROTEÍNA DE LEITE com advertência de não confundir com lactose.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Caseína",
          "Soro",
          "Alérgeno Severo"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-29",
        "term": "Alergia à proteína do leite de vaca (APLV)",
        "definition": "Reação imunológica anormal às proteínas presentes no leite de vaca, mais frequente no primeiro ano de vida, diferente de intolerância à lactose.",
        "description": "Reação imunológica anormal às proteínas presentes no leite de vaca, mais frequente no primeiro ano de vida, diferente de intolerância à lactose.",
        "context": "Exige dieta de exclusão rígida para a mãe lactante ou uso de fórmulas infantis de aminoácidos livres.",
        "signStrategy": "Datilologia A-P-L-V seguida do sinal de PROIBIÇÃO TOTAL DE LEITE E DERIVADOS.",
        "sign_strategy": "Datilologia A-P-L-V seguida do sinal de PROIBIÇÃO TOTAL DE LEITE E DERIVADOS.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "APLV",
          "Pediatria",
          "Alergia Grave"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-30",
        "term": "Caseína",
        "definition": "Principal família de fosfoproteínas do leite de mamíferos, responsável pela coagulação em queijos e termorresistente ao calor.",
        "description": "Principal família de fosfoproteínas do leite de mamíferos, responsável pela coagulação em queijos e termorresistente ao calor.",
        "context": "Resiste à fervura comum, o que torna derivados cozidos do leite igualmente alergênicos para pacientes com APLV.",
        "signStrategy": "Datilologia C-A-S-E-I-N-A associada à fração densa e coagulada do leite de vaca.",
        "sign_strategy": "Datilologia C-A-S-E-I-N-A associada à fração densa e coagulada do leite de vaca.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Fosfoproteína",
          "Queijos",
          "Termorresistência"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-31",
        "term": "Proteína do soro do leite",
        "definition": "Fração proteica solúvel obtida após a coagulação da caseína (como beta-lactoglobulina e alfa-lactoalbumina), com alto teor de aminoácidos essenciais.",
        "description": "Fração proteica solúvel obtida após a coagulação da caseína (como beta-lactoglobulina e alfa-lactoalbumina), com alto teor de aminoácidos essenciais.",
        "context": "Conhecida comercialmente como Whey Protein, muito usada em suplementos e ultraprocessados lácteos.",
        "signStrategy": "Sinal de SORO DO LEITE purificado em proteína concentrada de rápida absorção.",
        "sign_strategy": "Sinal de SORO DO LEITE purificado em proteína concentrada de rápida absorção.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Whey Protein",
          "Lactoalbumina",
          "Soro"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-32",
        "term": "Glúten",
        "definition": "Conjunto de proteínas presente naturalmente em cereais como trigo, centeio e cevada.",
        "description": "Conjunto de proteínas presente naturalmente em cereais como trigo, centeio e cevada.",
        "context": "Confere elasticidade e estrutura às massas de pães, biscoitos, bolos e cervejas.",
        "signStrategy": "Mãos esticando massa elástica de pão com sinal de CEREAIS (trigo, cevada, centeio).",
        "sign_strategy": "Mãos esticando massa elástica de pão com sinal de CEREAIS (trigo, cevada, centeio).",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Gliadina",
          "Elasticidade",
          "Cereais"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-33",
        "term": "Doença celíaca",
        "definition": "Doença autoimune desencadeada pela ingestão de glúten em indivíduos geneticamente predispostos, causando alterações principalmente no intestino delgado.",
        "description": "Doença autoimune desencadeada pela ingestão de glúten em indivíduos geneticamente predispostos, causando alterações principalmente no intestino delgado.",
        "context": "A ingestão mesmo de traços microscópicos de glúten provoca achatamento das vilosidades intestinais e má absorção crônica.",
        "signStrategy": "Sinal de DOENÇA AUTOIMUNE DO GLÚTEN atrofiando as paredes do intestino delgado.",
        "sign_strategy": "Sinal de DOENÇA AUTOIMUNE DO GLÚTEN atrofiando as paredes do intestino delgado.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Autoimune",
          "Sem Glúten",
          "Vilosidades"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-34",
        "term": "Sensibilidade ao glúten não celíaca",
        "definition": "Condição na qual a ingestão de alimentos contendo glúten ou componentes relacionados está associada a sintomas em pessoas sem diagnóstico de doença celíaca ou alergia ao trigo.",
        "description": "Condição na qual a ingestão de alimentos contendo glúten ou componentes relacionados está associada a sintomas em pessoas sem diagnóstico de doença celíaca ou alergia ao trigo.",
        "context": "Pacientes melhoram ao retirar o glúten, embora não apresentem os anticorpos nem a atrofia vilosa típica dos celíacos.",
        "signStrategy": "Sinal de MAL-ESTAR AO COMER GLÚTEN com exames médicos celíacos normais.",
        "sign_strategy": "Sinal de MAL-ESTAR AO COMER GLÚTEN com exames médicos celíacos normais.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Sensibilidade",
          "Trigo",
          "Gastroenterologia"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-35",
        "term": "Trigo",
        "definition": "Cereal largamente cultivado cuja farinha é rica em glúten (gliadina e glutenina), base de pães e massas e alérgeno de declaração obrigatória.",
        "description": "Cereal largamente cultivado cuja farinha é rica em glúten (gliadina e glutenina), base de pães e massas e alérgeno de declaração obrigatória.",
        "context": "Alergia ao trigo envolve anticorpos IgE contra suas proteínas específicas e pode causar asma do padeiro ou anafilaxia induzida por esforço.",
        "signStrategy": "Classificador imitando a espiga de trigo balançando no campo e sendo moída em farinha.",
        "sign_strategy": "Classificador imitando a espiga de trigo balançando no campo e sendo moída em farinha.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Trigo",
          "Cereal",
          "Alérgeno"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-36",
        "term": "Ovo",
        "definition": "Alimento proteico de alto valor biológico cujas proteínas da clara (ovalbumina, ovomucoide) e da gema figuram entre os principais causadores de alergias.",
        "description": "Alimento proteico de alto valor biológico cujas proteínas da clara (ovalbumina, ovomucoide) e da gema figuram entre os principais causadores de alergias.",
        "context": "Alérgeno comum na infância; vacinas cultivadas em ovos embrionados requerem cautela médica em pacientes graves.",
        "signStrategy": "Sinal de QUEBRAR OVO com separação visual de clara e gema em alerta alergênico.",
        "sign_strategy": "Sinal de QUEBRAR OVO com separação visual de clara e gema em alerta alergênico.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Ovalbumina",
          "Proteína",
          "Infância"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-37",
        "term": "Soja",
        "definition": "Leguminosa rica em proteínas e lipídios utilizada na indústria em farinhas, óleos e lecitinas, listada entre os principais alérgenos alimentares mundiais.",
        "description": "Leguminosa rica em proteínas e lipídios utilizada na indústria em farinhas, óleos e lecitinas, listada entre os principais alérgenos alimentares mundiais.",
        "context": "Presente em embutidos, chocolates e produtos de panificação por suas propriedades emulsificantes.",
        "signStrategy": "Sinal de VAGEM/GRÃO DE SOJA com advertência na rotulagem obrigatória.",
        "sign_strategy": "Sinal de VAGEM/GRÃO DE SOJA com advertência na rotulagem obrigatória.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Leguminosa",
          "Alérgeno",
          "Lecitina"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-38",
        "term": "Amendoim",
        "definition": "Leguminosa subterrânea de alto teor lipídico e proteico associada a reações anafiláticas severas em indivíduos alérgicos sensibilizados.",
        "description": "Leguminosa subterrânea de alto teor lipídico e proteico associada a reações anafiláticas severas em indivíduos alérgicos sensibilizados.",
        "context": "Requer advertência destacada em caixas de doces, paçocas e alimentos que compartilham maquinário.",
        "signStrategy": "Sinal de AMENDOIM quebrando a casca com expressão de cautela médica alta.",
        "sign_strategy": "Sinal de AMENDOIM quebrando a casca com expressão de cautela médica alta.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Oleaginosa",
          "Anafilaxia",
          "Risco Alto"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-39",
        "term": "Castanhas",
        "definition": "Grupo de sementes oleaginosas comestíveis (como castanha-de-caju, castanha-do-pará e nozes) com alto potencial alergênico cruzado.",
        "description": "Grupo de sementes oleaginosas comestíveis (como castanha-de-caju, castanha-do-pará e nozes) com alto potencial alergênico cruzado.",
        "context": "Declaração obrigatória conforme a RDC 727/2022 devido ao risco de choque anafilático.",
        "signStrategy": "Sinal de CASTANHA quebrando semente dura com destaque para castanha-de-caju e do Pará.",
        "sign_strategy": "Sinal de CASTANHA quebrando semente dura com destaque para castanha-de-caju e do Pará.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Tree Nuts",
          "Castanha-do-Pará",
          "Caju"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-40",
        "term": "Peixes",
        "definition": "Animais vertebrados aquáticos ricos em ômega-3 cujas parvalbuminas são alérgenos potentes e muito estáveis ao calor e cocção.",
        "description": "Animais vertebrados aquáticos ricos em ômega-3 cujas parvalbuminas são alérgenos potentes e muito estáveis ao calor e cocção.",
        "context": "Mesmo os vapores do cozimento ou óleo de fritura compartilhada podem deflagrar crise alérgica em pessoas sensíveis.",
        "signStrategy": "Sinal de PEIXE nadando seguido por classificador de alerta de contato cruzado em óleo.",
        "sign_strategy": "Sinal de PEIXE nadando seguido por classificador de alerta de contato cruzado em óleo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Pescados",
          "Parvalbumina",
          "Alérgeno"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-41",
        "term": "Crustáceos",
        "definition": "Invertebrados aquáticos (como camarão, lagosta e caranguejo) que contêm tropomiosina, proteína responsável por reações anafiláticas intensas.",
        "description": "Invertebrados aquáticos (como camarão, lagosta e caranguejo) que contêm tropomiosina, proteína responsável por reações anafiláticas intensas.",
        "context": "Frequentemente geram reações na vida adulta com inchaço orofacial súbito após ingestão de caldos ou frituras.",
        "signStrategy": "Sinal de CAMARÃO com as patinhas articuladas associado a sinal de ALERGIA GRAVE.",
        "sign_strategy": "Sinal de CAMARÃO com as patinhas articuladas associado a sinal de ALERGIA GRAVE.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Camarão",
          "Tropomiosina",
          "Frutos do Mar"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-42",
        "term": "Leite",
        "definition": "Secreção nutritiva produzida pelas glândulas mamárias de fêmeas de mamíferos, alérgeno de declaração obrigatória e fonte de lactose.",
        "description": "Secreção nutritiva produzida pelas glândulas mamárias de fêmeas de mamíferos, alérgeno de declaração obrigatória e fonte de lactose.",
        "context": "Ingrediente de altíssimo consumo com regras específicas para evitar confusão entre caseína e lactose.",
        "signStrategy": "Sinal de ORDENHAR/LEITE clássico com visualização de derivados na cadeia produtiva.",
        "sign_strategy": "Sinal de ORDENHAR/LEITE clássico com visualização de derivados na cadeia produtiva.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Lácteo",
          "Alérgeno Maior",
          "Bebida"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-43",
        "term": "Alergênicos de declaração obrigatória",
        "definition": "Grupo de alimentos regulamentados pela RDC 727/2022 da Anvisa que inclui trigo, centeio, cevada, aveia, crustáceos, ovos, peixes, amendoim, soja, leites e castanhas.",
        "description": "Grupo de alimentos regulamentados pela RDC 727/2022 da Anvisa que inclui trigo, centeio, cevada, aveia, crustáceos, ovos, peixes, amendoim, soja, leites e castanhas.",
        "context": "Devem constar em caixa alta e negrito no rótulo sob a advertência 'ALÉRGICOS: CONTÉM...'.",
        "signStrategy": "Lista visual com os 10 alérgenos oficiais destacados com moldura de proteção sanitária.",
        "sign_strategy": "Lista visual com os 10 alérgenos oficiais destacados com moldura de proteção sanitária.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "RDC 727",
          "Norma Sanitária",
          "Legislação"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-44",
        "term": "Contato cruzado de alergênicos",
        "definition": "Transferência não intencional de um alérgeno de um alimento para outro alimento livre dele através de superfícies, ar ou utensílios.",
        "description": "Transferência não intencional de um alérgeno de um alimento para outro alimento livre dele através de superfícies, ar ou utensílios.",
        "context": "Diferente de contaminação cruzada microbiológica, o cozimento não elimina o alérgeno, pois proteínas alérgenas resistem ao calor.",
        "signStrategy": "Superfície ou colher com resíduo de amendoim ou leite tocando alimento seguro e contaminando-o.",
        "sign_strategy": "Superfície ou colher com resíduo de amendoim ou leite tocando alimento seguro e contaminando-o.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Contato Cruzado",
          "Boas Práticas",
          "Controle Industrial"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-45",
        "term": "Traços de alergênicos",
        "definition": "Presença residual mínima de proteínas alergênicas decorrente de contaminação cruzada industrial, que pode deflagrar crise em pessoas hipersensíveis.",
        "description": "Presença residual mínima de proteínas alergênicas decorrente de contaminação cruzada industrial, que pode deflagrar crise em pessoas hipersensíveis.",
        "context": "Origina a advertência obrigatória 'ALÉRGICOS: PODE CONTER...' quando não é possível garantir ausência total.",
        "signStrategy": "Classificador de micropartículas invisíveis residuais caindo em produto industrializado.",
        "sign_strategy": "Classificador de micropartículas invisíveis residuais caindo em produto industrializado.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Pode Conter",
          "Resíduos",
          "Risco Residual"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-46",
        "term": "Histamina",
        "definition": "Amina biogênica liberada por mastócitos durante crises alérgicas ou acumulada em pescados mal refrigerados, causadora de vasodilatação e prurido.",
        "description": "Amina biogênica liberada por mastócitos durante crises alérgicas ou acumulada em pescados mal refrigerados, causadora de vasodilatação e prurido.",
        "context": "Provoca coceira, vermelhidão na pele, coriza e queda de pressão arterial.",
        "signStrategy": "Datilologia H-I-S-T-A-M-I-N-A com sinal de COCEIRA e VERMELHIDÃO CUTÂNEA.",
        "sign_strategy": "Datilologia H-I-S-T-A-M-I-N-A com sinal de COCEIRA e VERMELHIDÃO CUTÂNEA.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Amina Biogênica",
          "Mastócitos",
          "Prurido"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-47",
        "term": "Intolerância à histamina",
        "definition": "Dificuldade do organismo em degradar a histamina ingerida nos alimentos devido à baixa atividade da enzima diamina oxidase (DAO).",
        "description": "Dificuldade do organismo em degradar a histamina ingerida nos alimentos devido à baixa atividade da enzima diamina oxidase (DAO).",
        "context": "Alimentos envelhecidos, queijos curados, vinhos e embutidos disparam cefaleia e sintomas alérgicos falsos nesses pacientes.",
        "signStrategy": "Corpo incapaz de quebrar a histamina ingerida em queijos velhos acumulando toxinas.",
        "sign_strategy": "Corpo incapaz de quebrar a histamina ingerida em queijos velhos acumulando toxinas.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Enzima DAO",
          "Queijos Curados",
          "Intolerância"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-48",
        "term": "Frutose",
        "definition": "Monossacarídeo simples presente em frutas, mel e xaropes industriais, cuja absorção intestinal deficiente pode causar gases e diarreia.",
        "description": "Monossacarídeo simples presente em frutas, mel e xaropes industriais, cuja absorção intestinal deficiente pode causar gases e diarreia.",
        "context": "Muito abundante no xarope de milho rico em frutose usado em refrigerantes e biscoitos ultraprocessados.",
        "signStrategy": "Sinal de FRUTA + AÇÚCAR MONOSSACARÍDEO absorvido no intestino delgado.",
        "sign_strategy": "Sinal de FRUTA + AÇÚCAR MONOSSACARÍDEO absorvido no intestino delgado.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Fruta",
          "Açúcar Simples",
          "Monossacarídeo"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-49",
        "term": "Má absorção",
        "definition": "Condição clínica em que a mucosa intestinal não absorve adequadamente nutrientes vitais (carboidratos, gorduras, vitaminas) gerando carências e diarreia.",
        "description": "Condição clínica em que a mucosa intestinal não absorve adequadamente nutrientes vitais (carboidratos, gorduras, vitaminas) gerando carências e diarreia.",
        "context": "Pode ocorrer na doença celíaca, supercrescimento bacteriano e doença de Crohn.",
        "signStrategy": "Nutrientes passando reto pelo intestino sem conseguir penetrar nas células absorventes.",
        "sign_strategy": "Nutrientes passando reto pelo intestino sem conseguir penetrar nas células absorventes.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Deficiência",
          "Vilosidades",
          "Clínica"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-50",
        "term": "Probiótico",
        "definition": "Microrganismos vivos que, quando administrados em quantidades adequadas, conferem benefícios comprovados à saúde do hospedeiro.",
        "description": "Microrganismos vivos que, quando administrados em quantidades adequadas, conferem benefícios comprovados à saúde do hospedeiro.",
        "context": "Exemplos incluem Lactobacillus e Bifidobacterium em leites fermentados e cápsulas terapêuticas.",
        "signStrategy": "Bactérias amigáveis entrando felizes e protegendo as paredes intestinais contra invasores.",
        "sign_strategy": "Bactérias amigáveis entrando felizes e protegendo as paredes intestinais contra invasores.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Bactérias Vivas",
          "Lactobacillus",
          "Saúde"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-51",
        "term": "Prebiótico",
        "definition": "Substratos e fibras alimentares não digeríveis que estimulam seletivamente o crescimento e atividade de bactérias benéficas da microbiota cólica.",
        "description": "Substratos e fibras alimentares não digeríveis que estimulam seletivamente o crescimento e atividade de bactérias benéficas da microbiota cólica.",
        "context": "Inulina, fruto-oligossacarídeos (FOS) e amido resistente presentes em chicória, alho, cebola e banana verde.",
        "signStrategy": "Sinal de FIBRAS VEGETAIS servindo de alimento saudável para a microbiota intestinal.",
        "sign_strategy": "Sinal de FIBRAS VEGETAIS servindo de alimento saudável para a microbiota intestinal.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Fibras",
          "Inulina",
          "Nutrição do Cólon"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-52",
        "term": "Fermentação intestinal",
        "definition": "Processo metabólico anaeróbio pelo qual a microbiota degrada carboidratos não digeridos no cólon, gerando ácidos graxos de cadeia curta e gases.",
        "description": "Processo metabólico anaeróbio pelo qual a microbiota degrada carboidratos não digeridos no cólon, gerando ácidos graxos de cadeia curta e gases.",
        "context": "Produz butirato (benéfico à barreira) e gases (hidrogênio, metano) que causam flatulência.",
        "signStrategy": "Borbulhamento de gases no cólon gerado pela ação das bactérias sobre fibras.",
        "sign_strategy": "Borbulhamento de gases no cólon gerado pela ação das bactérias sobre fibras.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Microbiota",
          "Butirato",
          "Gases"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-53",
        "term": "FODMAP",
        "definition": "Acrônimo para carboidratos fermentáveis (oligossacarídeos, dissacarídeos, monossacarídeos e polióis) que podem agravar sintomas da síndrome do intestino irritável.",
        "description": "Acrônimo para carboidratos fermentáveis (oligossacarídeos, dissacarídeos, monossacarídeos e polióis) que podem agravar sintomas da síndrome do intestino irritável.",
        "context": "Dieta com baixo teor de FODMAP é protocolo médico para reduzir dores e inchaço abdominal.",
        "signStrategy": "Datilologia F-O-D-M-A-P com sinal de ALIMENTOS QUE FERMENTAM MUITO NA BARRIGA.",
        "sign_strategy": "Datilologia F-O-D-M-A-P com sinal de ALIMENTOS QUE FERMENTAM MUITO NA BARRIGA.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "FODMAP",
          "SII",
          "Nutrição Clínica"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-54",
        "term": "Deficiência enzimática",
        "definition": "Redução congênita ou adquirida na síntese ou atividade de enzimas digestivas essenciais, como na intolerância primária à lactase.",
        "description": "Redução congênita ou adquirida na síntese ou atividade de enzimas digestivas essenciais, como na intolerância primária à lactase.",
        "context": "Impede a quebra de macronutrientes levando a desconfortos gastrointestinais pós-prandiais.",
        "signStrategy": "Ausência ou carência da tesoura biológica enzimática gerando acúmulo de substrato não quebrado.",
        "sign_strategy": "Ausência ou carência da tesoura biológica enzimática gerando acúmulo de substrato não quebrado.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Enzimas",
          "Digestão",
          "Genética"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-55",
        "term": "Sintoma gastrointestinal",
        "definition": "Manifestação clínica desconfortável originada no sistema digestório, como náusea, plenitude gástrica, cólica, diarreia ou vômito.",
        "description": "Manifestação clínica desconfortável originada no sistema digestório, como náusea, plenitude gástrica, cólica, diarreia ou vômito.",
        "context": "Sinal de alerta de desordens alérgicas, intolerâncias, infecções ou intoxicações alimentares.",
        "signStrategy": "Mãos indicando dor e desordem gástrica na região do abdômen e estômago.",
        "sign_strategy": "Mãos indicando dor e desordem gástrica na região do abdômen e estômago.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Sintomatologia",
          "Gastro",
          "Clínica"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-56",
        "term": "Náusea",
        "definition": "Sensação desagradável e iminente de vômito, com desconforto na região epigástrica frequentemente associada a salivação e sudorese.",
        "description": "Sensação desagradável e iminente de vômito, com desconforto na região epigástrica frequentemente associada a salivação e sudorese.",
        "context": "Sintoma primário de intoxicação alimentar estafilocócica ou efeito reflexo a alimentos contaminados.",
        "signStrategy": "Mão na garganta e estômago demonstrando sensação de enjoo e ânsia com expressão facial de mal-estar.",
        "sign_strategy": "Mão na garganta e estômago demonstrando sensação de enjoo e ânsia com expressão facial de mal-estar.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Enjoo",
          "Sintoma",
          "Estômago"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-57",
        "term": "Vômito",
        "definition": "Expulsão forçada e reflexa do conteúdo estomacal pela boca provocada por contrações antiperistálticas coordenadas do diafragma e estômago.",
        "description": "Expulsão forçada e reflexa do conteúdo estomacal pela boca provocada por contrações antiperistálticas coordenadas do diafragma e estômago.",
        "context": "Mecanismo fisiológico de defesa do corpo para expelir rapidamente toxinas e substâncias agressivas.",
        "signStrategy": "Gesto com as mãos saindo da boca e peito simulando ejeção com tronco projetado à frente.",
        "sign_strategy": "Gesto com as mãos saindo da boca e peito simulando ejeção com tronco projetado à frente.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Êmese",
          "Expulsão",
          "Defesa"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-58",
        "term": "Diarreia",
        "definition": "Aumento anormal da frequência e fluidez das evacuações intestinais, resultando em perda rápida de água e eletrólitos corporais.",
        "description": "Aumento anormal da frequência e fluidez das evacuações intestinais, resultando em perda rápida de água e eletrólitos corporais.",
        "context": "Principal perigo é a desidratação, especialmente em crianças e idosos, demandando soro de reidratação oral.",
        "signStrategy": "Sinal representativo de fluxo intestinal acelerado e líquido acompanhado de sinal de fraqueza corporal.",
        "sign_strategy": "Sinal representativo de fluxo intestinal acelerado e líquido acompanhado de sinal de fraqueza corporal.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Desidratação",
          "Intestino",
          "Evacuação"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-59",
        "term": "Constipação",
        "definition": "Dificuldade ou redução acentuada da frequência de evacuação, associada a fezes endurecidas, ressecadas e evacuação incompleta.",
        "description": "Dificuldade ou redução acentuada da frequência de evacuação, associada a fezes endurecidas, ressecadas e evacuação incompleta.",
        "context": "Prevenida por consumo regular de água potável, fibras solúveis e insolúveis e prática de atividade física.",
        "signStrategy": "Mãos demonstrando passagem intestinal bloqueada e esforço com expressão de constrangimento físico.",
        "sign_strategy": "Mãos demonstrando passagem intestinal bloqueada e esforço com expressão de constrangimento físico.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Intestino Preso",
          "Fibras",
          "Hidratação"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-60",
        "term": "Distensão abdominal",
        "definition": "Sensação ou constatação física de inchaço e aumento de volume na região do abdômen por acúmulo de gases intestinais ou retenção de líquidos.",
        "description": "Sensação ou constatação física de inchaço e aumento de volume na região do abdômen por acúmulo de gases intestinais ou retenção de líquidos.",
        "context": "Queixa muito frequente em intolerâncias à lactose, frutose ou síndrome do supercrescimento bacteriano (SIBO).",
        "signStrategy": "Mãos partindo do abdômen e inflando para a frente como um balão que enche de gás.",
        "sign_strategy": "Mãos partindo do abdômen e inflando para a frente como um balão que enche de gás.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Gases",
          "Inchaço",
          "Abdômen"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-61",
        "term": "Refluxo gastroesofágico",
        "definition": "Retorno involuntário do conteúdo ácido do estômago para o esôfago e cavidade bucal, provocando pirose, queimação e azia.",
        "description": "Retorno involuntário do conteúdo ácido do estômago para o esôfago e cavidade bucal, provocando pirose, queimação e azia.",
        "context": "O ácido gástrico queima a mucosa esofágica desprovida de muco protetor, agravado por deitar após refeições copiosas.",
        "signStrategy": "Mão no estômago subindo pelo esôfago até o peito com expressão de queimação ardente.",
        "sign_strategy": "Mão no estômago subindo pelo esôfago até o peito com expressão de queimação ardente.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Azia",
          "Esôfago",
          "Ácido Gástrico"
        ],
        "axis_id": 2
      },
      {
        "id": "term-imun-62",
        "term": "Biodisponibilidade",
        "definition": "Proporção de um nutriente ou composto que é absorvida e se torna disponível para utilização pelo organismo.",
        "description": "Proporção de um nutriente ou composto que é absorvida e se torna disponível para utilização pelo organismo.",
        "context": "Fatores como fitatos e taninos podem diminuir a absorção de ferro e zinco de origem vegetal.",
        "signStrategy": "Classificador mostrando a fração exata do nutriente que consegue ser absorvida e aproveitada pelo corpo.",
        "sign_strategy": "Classificador mostrando a fração exata do nutriente que consegue ser absorvida e aproveitada pelo corpo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Nutrição",
          "Absorção",
          "Bioquímica"
        ],
        "axis_id": 2
      }
    ]
  },
  {
    "id": "rotulagem-tecnica",
    "numericId": 3,
    "title": "Eixo 3 — Rotulagem Técnica",
    "emoji": "🏷️",
    "description": "Interpretação crítica de rótulos, tabela nutricional, lupa frontal e declaração de ingredientes e alergênicos.",
    "terms": [
      {
        "id": "term-rot-1",
        "term": "Rótulo",
        "definition": "Toda inscrição, legenda, imagem ou matéria descritiva ou gráfica gravada, estocada, impressa ou colada sobre a embalagem do alimento.",
        "description": "Toda inscrição, legenda, imagem ou matéria descritiva ou gráfica gravada, estocada, impressa ou colada sobre a embalagem do alimento.",
        "context": "Documento legal de comunicação direta entre a indústria e o cidadão, sujeito à fiscalização da Anvisa, MAPA e Procon.",
        "signStrategy": "Mãos desenhando o retângulo adesivo frontal da embalagem e lendo as informações gravadas.",
        "sign_strategy": "Mãos desenhando o retângulo adesivo frontal da embalagem e lendo as informações gravadas.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Rotulagem",
          "Embalagem",
          "Direito do Consumidor"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-2",
        "term": "Rotulagem de alimentos",
        "definition": "Conjunto de informações, textos, símbolos e demais elementos apresentados na embalagem ou vinculados ao alimento para informar o consumidor.",
        "description": "Conjunto de informações, textos, símbolos e demais elementos apresentados na embalagem ou vinculados ao alimento para informar o consumidor.",
        "context": "Garante a transparência indispensável para escolhas saudáveis e segurança de pessoas com restrições alimentares.",
        "signStrategy": "Sinal composto: ALIMENTO + EMBALAGEM + LETRAS/INFORMAÇÃO DETALHADA explicada visualmente.",
        "sign_strategy": "Sinal composto: ALIMENTO + EMBALAGEM + LETRAS/INFORMAÇÃO DETALHADA explicada visualmente.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Rotulagem",
          "Comunicação",
          "Transparência"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-3",
        "term": "Rotulagem nutricional",
        "definition": "Declaração destinada a informar ao consumidor as propriedades nutricionais do alimento.",
        "description": "Declaração destinada a informar ao consumidor as propriedades nutricionais do alimento.",
        "context": "Atualizada pela RDC 429/2020 e IN 75/2020 para tornar as informações nutricionais mais legíveis com letras pretas em fundo branco.",
        "signStrategy": "Mãos abrindo a tabela de nutrientes do alimento e apontando gramas e calorias com precisão.",
        "sign_strategy": "Mãos abrindo a tabela de nutrientes do alimento e apontando gramas e calorias com precisão.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Nutrientes",
          "Tabela",
          "RDC 429"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-4",
        "term": "Informação nutricional",
        "definition": "Conjunto de declarações quantitativas e qualitativas sobre o valor energético e os nutrientes presentes no alimento embalado.",
        "description": "Conjunto de declarações quantitativas e qualitativas sobre o valor energético e os nutrientes presentes no alimento embalado.",
        "context": "Permite ao consumidor comparar o valor calórico e a densidade de nutrientes entre marcas concorrentes.",
        "signStrategy": "Sinal de INFORMAR + DADOS DE NUTRIÇÃO explicados item por item.",
        "sign_strategy": "Sinal de INFORMAR + DADOS DE NUTRIÇÃO explicados item por item.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Nutrição",
          "Dados",
          "Saúde"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-5",
        "term": "Tabela nutricional",
        "definition": "Representação padronizada das quantidades de energia e nutrientes presentes no alimento.",
        "description": "Representação padronizada das quantidades de energia e nutrientes presentes no alimento.",
        "context": "Com a nova regra, deve trazer a coluna de 100g/100ml ao lado da coluna por porção para facilitar comparações diretas.",
        "signStrategy": "Mãos desenhando grades retangulares horizontais e verticais de uma tabela com leitura linha por linha.",
        "sign_strategy": "Mãos desenhando grades retangulares horizontais e verticais de uma tabela com leitura linha por linha.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Tabela",
          "100g",
          "Porção"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-6",
        "term": "Rotulagem nutricional frontal",
        "definition": "Informação apresentada na parte frontal da embalagem para facilitar a identificação de características nutricionais relevantes do produto, como a alta quantidade de sódio, açúcar e gordura.",
        "description": "Informação apresentada na parte frontal da embalagem para facilitar a identificação de características nutricionais relevantes do produto, como a alta quantidade de sódio, açúcar e gordura.",
        "context": "Exigência pioneira no Brasil para alertar sobre excessos danosos à saúde cardiovascular e metabólica.",
        "signStrategy": "Sinal de LUPA na parte superior direita frontal da embalagem destacando o alerta em preto e branco.",
        "sign_strategy": "Sinal de LUPA na parte superior direita frontal da embalagem destacando o alerta em preto e branco.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "FOP",
          "Lupa",
          "Alerta Nutricional"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-7",
        "term": "Lupa frontal",
        "definition": "Símbolo visual obrigatório em forma de lupa na face frontal da embalagem indicando alto teor de açúcares adicionados, gordura saturada ou sódio.",
        "description": "Símbolo visual obrigatório em forma de lupa na face frontal da embalagem indicando alto teor de açúcares adicionados, gordura saturada ou sódio.",
        "context": "Se o alimento possui os três nutrientes em excesso, a lupa exibe as três frases juntas na metade superior do rótulo.",
        "signStrategy": "Mão em formato de LUPA sobre o olho observando com atenção o selo de advertência sanitária.",
        "sign_strategy": "Mão em formato de LUPA sobre o olho observando com atenção o selo de advertência sanitária.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Lupa",
          "Anvisa",
          "Açúcar",
          "Sódio",
          "Gordura"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-8",
        "term": "Alto em açúcar adicionado",
        "definition": "Alerta frontal da Anvisa obrigatório para alimentos sólidos com >= 15g ou líquidos com >= 7,5g de açúcares adicionados por 100g/ml.",
        "description": "Alerta frontal da Anvisa obrigatório para alimentos sólidos com >= 15g ou líquidos com >= 7,5g de açúcares adicionados por 100g/ml.",
        "context": "Presente em refrigerantes, sucos artificiais, biscoitos recheados e cereais matinais açucarados.",
        "signStrategy": "Sinal da LUPA apontando para a legenda AÇÚCAR DEMAIS com alerta de diabetes/obesidade.",
        "sign_strategy": "Sinal da LUPA apontando para a legenda AÇÚCAR DEMAIS com alerta de diabetes/obesidade.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Açúcar Adicionado",
          "Lupa Frontal",
          "Alerta"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-9",
        "term": "Alto em gordura saturada",
        "definition": "Alerta frontal da Anvisa obrigatório para alimentos sólidos com >= 6g ou líquidos com >= 3g de gordura saturada por 100g/ml.",
        "description": "Alerta frontal da Anvisa obrigatório para alimentos sólidos com >= 6g ou líquidos com >= 3g de gordura saturada por 100g/ml.",
        "context": "Presente em salgadinhos de pacote, margarinas, embutidos e sorvetes de massa cremosos.",
        "signStrategy": "Sinal da LUPA apontando para a legenda GORDURA SATURADA EXCESSIVA com perigo cardíaco.",
        "sign_strategy": "Sinal da LUPA apontando para a legenda GORDURA SATURADA EXCESSIVA com perigo cardíaco.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Gordura Saturada",
          "Lupa Frontal",
          "Coração"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-10",
        "term": "Alto em sódio",
        "definition": "Alerta frontal da Anvisa obrigatório para alimentos sólidos com >= 600mg ou líquidos com >= 300mg de sódio por 100g/ml.",
        "description": "Alerta frontal da Anvisa obrigatório para alimentos sólidos com >= 600mg ou líquidos com >= 300mg de sódio por 100g/ml.",
        "context": "Identificado em macarrões instantâneos com sachê, caldos em cubo, temperos prontos e carnes ultraprocessadas.",
        "signStrategy": "Sinal da LUPA apontando para a legenda MUITO SAL / SÓDIO ALTO alertando sobre hipertensão.",
        "sign_strategy": "Sinal da LUPA apontando para a legenda MUITO SAL / SÓDIO ALTO alertando sobre hipertensão.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Sódio",
          "Sal",
          "Pressão Alta",
          "Lupa"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-11",
        "term": "Porção",
        "definition": "Quantidade média do alimento que deve ser usualmente consumida por pessoas sadias em uma única ocasião de consumo para alimentação saudável.",
        "description": "Quantidade média do alimento que deve ser usualmente consumida por pessoas sadias em uma única ocasião de consumo para alimentação saudável.",
        "context": "Definida em tabela oficial da Anvisa para permitir a padronização das porções entre diferentes fabricantes.",
        "signStrategy": "Mão delimitando a fração ou pedaço médio ideal de consumo no prato sem exagero.",
        "sign_strategy": "Mão delimitando a fração ou pedaço médio ideal de consumo no prato sem exagero.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Porção Padrão",
          "Consumo",
          "Medida"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-12",
        "term": "Número de porções por embalagem",
        "definition": "Indicação numérica obrigatória no rótulo da quantidade total de porções padronizadas contidas na embalagem comercial.",
        "description": "Indicação numérica obrigatória no rótulo da quantidade total de porções padronizadas contidas na embalagem comercial.",
        "context": "Evita enganos do consumidor ao acreditar que os números da tabela equivalem ao pacote inteiro de biscoitos.",
        "signStrategy": "Sinal apontando o número de frações inteiras contidas dentro daquele pacote comercial.",
        "sign_strategy": "Sinal apontando o número de frações inteiras contidas dentro daquele pacote comercial.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Embalagem",
          "Rendimento",
          "Tabela"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-13",
        "term": "Medida caseira",
        "definition": "Utensílio comumente utilizado pelo consumidor (colher de sopa, xícara, fatia, copo) para quantificar a porção do alimento de forma prática.",
        "description": "Utensílio comumente utilizado pelo consumidor (colher de sopa, xícara, fatia, copo) para quantificar a porção do alimento de forma prática.",
        "context": "Torna compreensível a quantidade em gramas informada na tabela nutricional para quem cozinha em casa.",
        "signStrategy": "Gestos visuais de colher de sopa, copo americano ou fatia de pão expressando o volume real.",
        "sign_strategy": "Gestos visuais de colher de sopa, copo americano ou fatia de pão expressando o volume real.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Xícara",
          "Colher",
          "Medida Prática"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-14",
        "term": "Valor energético",
        "definition": "Quantidade de energia fornecida pelo alimento ao organismo, normalmente expressa em quilocalorias e quilojoules.",
        "description": "Quantidade de energia fornecida pelo alimento ao organismo, normalmente expressa em quilocalorias e quilojoules.",
        "context": "Fundamental para balanço energético; dietas de referência utilizam a média de 2.000 calorias por dia.",
        "signStrategy": "Mãos sinalizando ENERGIA / FORÇA CALÓRICA liberada pelo alimento no corpo humano.",
        "sign_strategy": "Mãos sinalizando ENERGIA / FORÇA CALÓRICA liberada pelo alimento no corpo humano.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Calorias",
          "Energia",
          "Metabolismo"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-15",
        "term": "Quilocaloria (kcal)",
        "definition": "Unidade de medida que quantifica a energia térmica liberada pela queima metabólica dos alimentos (1 kcal = 1000 calorias).",
        "description": "Unidade de medida que quantifica a energia térmica liberada pela queima metabólica dos alimentos (1 kcal = 1000 calorias).",
        "context": "Gorduras geram 9 kcal/g, enquanto carboidratos e proteínas geram 4 kcal/g.",
        "signStrategy": "Datilologia K-C-A-L com sinal de ENERGIA TÉRMICA dos alimentos.",
        "sign_strategy": "Datilologia K-C-A-L com sinal de ENERGIA TÉRMICA dos alimentos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Kcal",
          "Calorias",
          "Física"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-16",
        "term": "Quilojoule (kJ)",
        "definition": "Unidade do Sistema Internacional (SI) que mede o conteúdo energético dos alimentos (1 kcal equivale a aproximadamente 4,184 kJ).",
        "description": "Unidade do Sistema Internacional (SI) que mede o conteúdo energético dos alimentos (1 kcal equivale a aproximadamente 4,184 kJ).",
        "context": "Consta obrigatoriamente na tabela nutricional brasileira ao lado do valor em quilocalorias.",
        "signStrategy": "Datilologia K-J com sinal de MEDIDA CIENTÍFICA DE ENERGIA INTERNACIONAL.",
        "sign_strategy": "Datilologia K-J com sinal de MEDIDA CIENTÍFICA DE ENERGIA INTERNACIONAL.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "kJ",
          "Sistema Internacional",
          "Energia"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-17",
        "term": "Valor diário (%VD)",
        "definition": "Percentual que indica o quanto a porção do produto contribui para atender à recomendação diária total de um nutriente em dieta de 2.000 kcal.",
        "description": "Percentual que indica o quanto a porção do produto contribui para atender à recomendação diária total de um nutriente em dieta de 2.000 kcal.",
        "context": "Valores diários altos em nutrientes benéficos (fibras) são desejáveis; em sódio e gorduras saturadas exigem moderação.",
        "signStrategy": "Sinal de PORCENTAGEM (%) no calendário diário de alimentação saudável.",
        "sign_strategy": "Sinal de PORCENTAGEM (%) no calendário diário de alimentação saudável.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "%VD",
          "Percentual",
          "Recomendação"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-18",
        "term": "Carboidratos",
        "definition": "Macronutrientes energéticos primários formados por carbono, hidrogênio e oxigênio, fornecendo 4 kcal por grama ao organismo.",
        "description": "Macronutrientes energéticos primários formados por carbono, hidrogênio e oxigênio, fornecendo 4 kcal por grama ao organismo.",
        "context": "Podem ser simples (absorção ultrarrápida com picos de glicemia) ou complexos (com fibras e amido de digestão lenta).",
        "signStrategy": "Sinal de CARBOIDRATO / FONTE RÁPIDA DE ENERGIA (arroz, batata, farinhas).",
        "sign_strategy": "Sinal de CARBOIDRATO / FONTE RÁPIDA DE ENERGIA (arroz, batata, farinhas).",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Amido",
          "Energia",
          "Macronutriente"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-19",
        "term": "Açúcares totais",
        "definition": "Soma de todos os monossacarídeos e dissacarídeos presentes no alimento, incluindo os naturais da fruta ou leite e os adicionados na fábrica.",
        "description": "Soma de todos os monossacarídeos e dissacarídeos presentes no alimento, incluindo os naturais da fruta ou leite e os adicionados na fábrica.",
        "context": "Linha obrigatória da nova tabela nutricional brasileira localizada logo abaixo de carboidratos.",
        "signStrategy": "Soma visual: AÇÚCAR NATURAL + AÇÚCAR ADICIONADO = TOTAL na tabela nutricional.",
        "sign_strategy": "Soma visual: AÇÚCAR NATURAL + AÇÚCAR ADICIONADO = TOTAL na tabela nutricional.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Açúcar Total",
          "Doce",
          "Tabela"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-20",
        "term": "Açúcares adicionados",
        "definition": "Monossacarídeos e dissacarídeos adicionados durante o processamento do alimento (sacarose, xaropes, mel, glicose), excluindo os naturalmente presentes.",
        "description": "Monossacarídeos e dissacarídeos adicionados durante o processamento do alimento (sacarose, xaropes, mel, glicose), excluindo os naturalmente presentes.",
        "context": "Parâmetro exclusivo avaliado para aplicação da lupa frontal preta de advertência da Anvisa.",
        "signStrategy": "Gesto de despejar colheres de açúcar refinado ou xarope na massa industrial do alimento.",
        "sign_strategy": "Gesto de despejar colheres de açúcar refinado ou xarope na massa industrial do alimento.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Sacarose",
          "Xarope de Milho",
          "Adicionado"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-21",
        "term": "Proteínas",
        "definition": "Macronutrientes estruturais essenciais formados por cadeias de aminoácidos, fornecendo 4 kcal/g e indispensáveis para renovação celular e muscular.",
        "description": "Macronutrientes estruturais essenciais formados por cadeias de aminoácidos, fornecendo 4 kcal/g e indispensáveis para renovação celular e muscular.",
        "context": "Fundamentais na infância para crescimento e na velhice para prevenir sarcopenia e perda de massa muscular.",
        "signStrategy": "Mão tocando os músculos dos braços com sinal de CONSTRUÇÃO E FORÇA BIOLÓGICA.",
        "sign_strategy": "Mão tocando os músculos dos braços com sinal de CONSTRUÇÃO E FORÇA BIOLÓGICA.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Aminoácidos",
          "Músculo",
          "Estrutural"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-22",
        "term": "Gorduras totais",
        "definition": "Soma de todas as frações lipídicas presentes no alimento (saturadas, insaturadas e trans), fornecendo 9 kcal por grama consumida.",
        "description": "Soma de todas as frações lipídicas presentes no alimento (saturadas, insaturadas e trans), fornecendo 9 kcal por grama consumida.",
        "context": "Essenciais para absorção de vitaminas lipossolúveis (A, D, E, K) e síntese de hormônios.",
        "signStrategy": "Sinal de GORDURAS / LIPÍDIOS englobando óleos, azeites e gorduras animais.",
        "sign_strategy": "Sinal de GORDURAS / LIPÍDIOS englobando óleos, azeites e gorduras animais.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Lipídios",
          "Óleos",
          "9 kcal"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-23",
        "term": "Gorduras saturadas",
        "definition": "Ácidos graxos de cadeia linear saturada sem duplas ligações, cujo consumo excessivo eleva o colesterol LDL e o risco cardiovascular.",
        "description": "Ácidos graxos de cadeia linear saturada sem duplas ligações, cujo consumo excessivo eleva o colesterol LDL e o risco cardiovascular.",
        "context": "Abundantes em carnes gordas, banha de porco, manteiga, óleo de palma e queijos amarelos curados.",
        "signStrategy": "Mãos em cadeias rígidas e densas associadas a placas nas artérias sanguíneas.",
        "sign_strategy": "Mãos em cadeias rígidas e densas associadas a placas nas artérias sanguíneas.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Saturada",
          "Colesterol",
          "Coração"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-24",
        "term": "Gorduras trans",
        "definition": "Ácidos graxos insaturados com ligação na conformação trans, produzidos por hidrogenação industrial ou bio-hidrogenação, altamente aterogênicos e com limite zero recomendado.",
        "description": "Ácidos graxos insaturados com ligação na conformação trans, produzidos por hidrogenação industrial ou bio-hidrogenação, altamente aterogênicos e com limite zero recomendado.",
        "context": "Praticamente banidas do mercado nacional pela RDC 332/2019 da Anvisa pelo comprovado dano às artérias.",
        "signStrategy": "Datilologia T-R-A-N-S acompanhada por sinal de PROIBIÇÃO / VENENO PARA AS ARTÉRIAS.",
        "sign_strategy": "Datilologia T-R-A-N-S acompanhada por sinal de PROIBIÇÃO / VENENO PARA AS ARTÉRIAS.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Gordura Trans",
          "Hidrogenada",
          "RDC 332"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-25",
        "term": "Fibra alimentar",
        "definition": "Fração de carboidratos vegetais e análogos que não é digerida nem absorvida no intestino delgado humano, fundamental para a microbiota e saciedade.",
        "description": "Fração de carboidratos vegetais e análogos que não é digerida nem absorvida no intestino delgado humano, fundamental para a microbiota e saciedade.",
        "context": "Regula o trânsito intestinal, desacelera a absorção de glicose no sangue e reduz colesterol circulante.",
        "signStrategy": "Dedos alinhados como filamentos vegetais que limpam e regulam o fluxo intestinal como vassoura.",
        "sign_strategy": "Dedos alinhados como filamentos vegetais que limpam e regulam o fluxo intestinal como vassoura.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Fibras",
          "Trânsito Intestinal",
          "Saciedade"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-26",
        "term": "Sódio",
        "definition": "Mineral essencial que regula o balanço hídrico e os impulsos nervosos corporais, mas cujo excesso é o principal fator da hipertensão arterial.",
        "description": "Mineral essencial que regula o balanço hídrico e os impulsos nervosos corporais, mas cujo excesso é o principal fator da hipertensão arterial.",
        "context": "A Organização Mundial da Saúde recomenda consumo máximo diário de 2.000 mg de sódio (5g de sal de cozinha).",
        "signStrategy": "Datilologia S-O-D-I-O seguida do gesto de salgar comida com alerta para a pressão do braço.",
        "sign_strategy": "Datilologia S-O-D-I-O seguida do gesto de salgar comida com alerta para a pressão do braço.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Sal",
          "Pressão Arterial",
          "Mineral"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-27",
        "term": "Lista de ingredientes",
        "definition": "Relação dos ingredientes utilizados na elaboração de um alimento, apresentada segundo as regras aplicáveis à rotulagem.",
        "description": "Relação dos ingredientes utilizados na elaboração de um alimento, apresentada segundo as regras aplicáveis à rotulagem.",
        "context": "Se o açúcar for o primeiro item da lista, significa que aquele alimento é feito principalmente de açúcar.",
        "signStrategy": "Leitura visual descendo o dedo linha a linha pelo texto da embalagem identificando ingredientes.",
        "sign_strategy": "Leitura visual descendo o dedo linha a linha pelo texto da embalagem identificando ingredientes.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Ingredientes",
          "Composição",
          "Transparência"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-28",
        "term": "Ordem dos ingredientes",
        "definition": "Regra regulatória obrigatória onde os ingredientes devem constar em ordem decrescente de proporção de peso (o primeiro é o que mais tem no produto).",
        "description": "Regra regulatória obrigatória onde os ingredientes devem constar em ordem decrescente de proporção de peso (o primeiro é o que mais tem no produto).",
        "context": "Permite ao consumidor desmascarar embalagens 'fakes' que prometem fruta ou aveia mas começam com açúcar e gordura vegetal.",
        "signStrategy": "Dedo apontando do item MAIOR PESO descendo até o de MENOR QUANTIDADE com rigor lógico.",
        "sign_strategy": "Dedo apontando do item MAIOR PESO descendo até o de MENOR QUANTIDADE com rigor lógico.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Ordem Decrescente",
          "Proporção",
          "Fiscalização"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-29",
        "term": "Ingrediente composto",
        "definition": "Ingrediente formado por dois ou mais componentes que já entra preparado na receita (como um recheio de chocolate ou massa pronta).",
        "description": "Ingrediente formado por dois ou mais componentes que já entra preparado na receita (como um recheio de chocolate ou massa pronta).",
        "context": "Deve vir acompanhado de sua própria sub-lista de ingredientes entre parênteses no rótulo.",
        "signStrategy": "Ingrediente abrindo parênteses no ar para mostrar outros três ingredientes menores dentro dele.",
        "sign_strategy": "Ingrediente abrindo parênteses no ar para mostrar outros três ingredientes menores dentro dele.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Sub-ingredientes",
          "Parênteses",
          "Receita"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-30",
        "term": "Aditivo alimentar",
        "definition": "Substância adicionada intencionalmente ao alimento com finalidade tecnológica específica durante sua fabricação, processamento ou conservação.",
        "description": "Substância adicionada intencionalmente ao alimento com finalidade tecnológica específica durante sua fabricação, processamento ou conservação.",
        "context": "Identificados por nomes químicos ou códigos INS (ex: INS 330 para ácido cítrico), devem constar no final da lista.",
        "signStrategy": "Mão adicionando gotículas ou pós químicos específicos na fórmula para durabilidade e cor.",
        "sign_strategy": "Mão adicionando gotículas ou pós químicos específicos na fórmula para durabilidade e cor.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "INS",
          "Conservação",
          "Química Alimentar"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-31",
        "term": "Conservante",
        "definition": "Substância que impede ou retarda a deterioração dos alimentos causada por microrganismos ou enzimas, prolongando a durabilidade.",
        "description": "Substância que impede ou retarda a deterioração dos alimentos causada por microrganismos ou enzimas, prolongando a durabilidade.",
        "context": "Exemplos incluem benzoato de sódio, sorbato de potássio e nitritos em carnes curadas.",
        "signStrategy": "Barreira química impedindo que o tempo estrague o alimento dentro da embalagem fechada.",
        "sign_strategy": "Barreira química impedindo que o tempo estrague o alimento dentro da embalagem fechada.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Sorbato",
          "Benzoato",
          "Vida Útil"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-32",
        "term": "Corante",
        "definition": "Substância que confere, intensifica ou restaura a coloração de um alimento para torná-lo visualmente mais atrativo ao consumidor.",
        "description": "Substância que confere, intensifica ou restaura a coloração de um alimento para torná-lo visualmente mais atrativo ao consumidor.",
        "context": "Podem ser naturais (como urucum e carmim de cochonilha) ou artificiais (como tartrazina, que pode causar alergia).",
        "signStrategy": "Pincel imaginário colorindo o alimento de vermelho, amarelo ou azul brilhante.",
        "sign_strategy": "Pincel imaginário colorindo o alimento de vermelho, amarelo ou azul brilhante.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Tartrazina",
          "Urucum",
          "Cor"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-33",
        "term": "Aromatizante",
        "definition": "Substância ou mistura capaz de conferir ou intensificar o aroma e sabor característico dos alimentos (podendo ser natural, sintético idêntico ou artificial).",
        "description": "Substância ou mistura capaz de conferir ou intensificar o aroma e sabor característico dos alimentos (podendo ser natural, sintético idêntico ou artificial).",
        "context": "Responsável pelo cheiro típico de morango, baunilha ou queijo em produtos industrializados.",
        "signStrategy": "Vapor perfumado subindo até o nariz acompanhado de sinal de SABOR INTENSO NA LÍNGUA.",
        "sign_strategy": "Vapor perfumado subindo até o nariz acompanhado de sinal de SABOR INTENSO NA LÍNGUA.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Aroma",
          "Flavorizante",
          "Sensorial"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-34",
        "term": "Edulcorante",
        "definition": "Substância utilizada para conferir sabor doce ao alimento em substituição total ou parcial aos açúcares.",
        "description": "Substância utilizada para conferir sabor doce ao alimento em substituição total ou parcial aos açúcares.",
        "context": "Muito usados em produtos 'diet' e 'zero', incluindo sucralose, aspartame, estévia e xilitol.",
        "signStrategy": "Gotas ou comprimidos adoçantes químicos caindo no café em substituição ao açúcar refinado.",
        "sign_strategy": "Gotas ou comprimidos adoçantes químicos caindo no café em substituição ao açúcar refinado.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Adoçante",
          "Zero Caloria",
          "Substituto"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-35",
        "term": "Emulsificante",
        "definition": "Aditivo que torna possível a formação e manutenção de uma mistura homogênea de duas ou mais fases imiscíveis (como água e óleo).",
        "description": "Aditivo que torna possível a formação e manutenção de uma mistura homogênea de duas ou mais fases imiscíveis (como água e óleo).",
        "context": "A lecitina de soja é o emulsificante clássico que impede o chocolate de se separar em pó e manteiga de cacau.",
        "signStrategy": "Duas substâncias separadas (água e gordura) sendo unidas firmemente por uma ponte química.",
        "sign_strategy": "Duas substâncias separadas (água e gordura) sendo unidas firmemente por uma ponte química.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Lecitina",
          "Mistura Homogênea",
          "Estabilidade"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-36",
        "term": "Estabilizante",
        "definition": "Substância que assegura a manutenção das características físicas e consistência de suspensões e emulsões ao longo do tempo.",
        "description": "Substância que assegura a manutenção das características físicas e consistência de suspensões e emulsões ao longo do tempo.",
        "context": "Garante que o molho para salada ou achocolatado não precipite no fundo da embalagem.",
        "signStrategy": "Mãos sustentando a consistência sólida e estável do líquido sem deixar escorrer ou separar.",
        "sign_strategy": "Mãos sustentando a consistência sólida e estável do líquido sem deixar escorrer ou separar.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Textura",
          "Suspensão",
          "Fórmula"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-37",
        "term": "Espessante",
        "definition": "Aditivo que aumenta a viscosidade de uma solução ou alimento sem alterar substancialmente suas outras propriedades físico-químicas.",
        "description": "Aditivo que aumenta a viscosidade de uma solução ou alimento sem alterar substancialmente suas outras propriedades físico-químicas.",
        "context": "Gomas vegetais como guar, xantana e ágar-ágar dão corpo a iogurtes, molhos e gelatinas.",
        "signStrategy": "Líquido ralo tornando-se denso, cremoso e consistente ao receber o aditivo espessante.",
        "sign_strategy": "Líquido ralo tornando-se denso, cremoso e consistente ao receber o aditivo espessante.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Goma Xantana",
          "Viscosidade",
          "Textura"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-38",
        "term": "Acidulante",
        "definition": "Substância que aumenta a acidez de um alimento ou confere a ele um sabor ácido agradável, auxiliando também na conservação.",
        "description": "Substância que aumenta a acidez de um alimento ou confere a ele um sabor ácido agradável, auxiliando também na conservação.",
        "context": "Ácido cítrico em refrigerantes de limão e balas ácidas que simulam o gosto natural das frutas cítricas.",
        "signStrategy": "Expressão facial apertada de sabor cítrico/azedinho agudo na ponta e laterais da língua.",
        "sign_strategy": "Expressão facial apertada de sabor cítrico/azedinho agudo na ponta e laterais da língua.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Ácido Cítrico",
          "Acidez",
          "Sabor Azedo"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-39",
        "term": "Antioxidante",
        "definition": "Substância que retarda ou impede a oxidação de lipídios e vitaminas nos alimentos, evitando o ranço e a perda sensorial.",
        "description": "Substância que retarda ou impede a oxidação de lipídios e vitaminas nos alimentos, evitando o ranço e a perda sensorial.",
        "context": "Ácido ascórbico (vitamina C) e tocoferóis (vitamina E) impedem maçãs cortadas de escurecerem e óleos de ficarem rançosos.",
        "signStrategy": "Escudo protetor impedindo o oxigênio do ar de queimar e envelhecer a matéria alimentícia.",
        "sign_strategy": "Escudo protetor impedindo o oxigênio do ar de queimar e envelhecer a matéria alimentícia.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Anti-ranço",
          "Vitamina C",
          "Oxidação"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-40",
        "term": "Realçador de sabor",
        "definition": "Aditivo (como o glutamato monossódico) que ressalta ou intensifica o sabor umami e o aroma dos ingredientes já presentes.",
        "description": "Aditivo (como o glutamato monossódico) que ressalta ou intensifica o sabor umami e o aroma dos ingredientes já presentes.",
        "context": "Onipresente em salgadinhos de milho, sopas de pacote e carnes processadas para hiperestimular o paladar.",
        "signStrategy": "Sinal de SABOR explodindo e se amplificando no centro da língua com grande intensidade.",
        "sign_strategy": "Sinal de SABOR explodindo e se amplificando no centro da língua com grande intensidade.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Glutamato",
          "Umami",
          "Palatabilidade"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-41",
        "term": "Denominação de venda",
        "definition": "Nome oficial e regulamentado que identifica a exata natureza e identidade do alimento conforme o padrão técnico oficial (PIQ).",
        "description": "Nome oficial e regulamentado que identifica a exata natureza e identidade do alimento conforme o padrão técnico oficial (PIQ).",
        "context": "Diz a verdade legal do produto: ex. 'composto lácteo com gordura vegetal' não pode ser chamado de 'leite'.",
        "signStrategy": "Dedo apontando a placa com o NOME VERDADEIRO E OFICIAL exigido pela lei brasileira.",
        "sign_strategy": "Dedo apontando a placa com o NOME VERDADEIRO E OFICIAL exigido pela lei brasileira.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Identidade",
          "PIQ",
          "Verdade do Produto"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-42",
        "term": "Conteúdo líquido",
        "definition": "Quantidade líquida de produto declarada na embalagem em massa (g, kg) ou volume (ml, L), descontando o peso da embalagem.",
        "description": "Quantidade líquida de produto declarada na embalagem em massa (g, kg) ou volume (ml, L), descontando o peso da embalagem.",
        "context": "Verificado pelo IPEM/Inmetro; discrepâncias configuram lesão ao consumidor e propaganda enganosa.",
        "signStrategy": "Sinal de BALANÇA pesando apenas a comida interna, excluindo o plástico da embalagem.",
        "sign_strategy": "Sinal de BALANÇA pesando apenas a comida interna, excluindo o plástico da embalagem.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Peso Líquido",
          "Inmetro",
          "Gramagem"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-43",
        "term": "Lote",
        "definition": "Conjunto de unidades de um alimento produzido nas mesmas condições e sob um mesmo ciclo operacional de fabricação.",
        "description": "Conjunto de unidades de um alimento produzido nas mesmas condições e sob um mesmo ciclo operacional de fabricação.",
        "context": "Código alfanumérico impresso que permite recolher apenas as unidades contaminadas em caso de contaminação pontual.",
        "signStrategy": "Sinal de CÓDIGO impresso carimbando grupo de produtos gerados na mesma hora da fábrica.",
        "sign_strategy": "Sinal de CÓDIGO impresso carimbando grupo de produtos gerados na mesma hora da fábrica.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Rastreio",
          "Código",
          "Recall"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-44",
        "term": "Prazo de validade",
        "definition": "Período durante o qual o alimento mantém as características de segurança e qualidade previstas, quando conservado nas condições estabelecidas.",
        "description": "Período durante o qual o alimento mantém as características de segurança e qualidade previstas, quando conservado nas condições estabelecidas.",
        "context": "Após esta data, os aditivos perdem efeito protetor e microrganismos patogênicos podem atingir contagens perigosas.",
        "signStrategy": "Linha do tempo no calendário marcando o último dia permitido para o consumo humano.",
        "sign_strategy": "Linha do tempo no calendário marcando o último dia permitido para o consumo humano.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Validade",
          "Vencimento",
          "Consumo"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-45",
        "term": "Data de fabricação",
        "definition": "Data que registra o momento em que o produto completou seu ciclo final de elaboração ou acondicionamento na fábrica.",
        "description": "Data que registra o momento em que o produto completou seu ciclo final de elaboração ou acondicionamento na fábrica.",
        "context": "Referência essencial para controle de estoque e auditorias de qualidade na cadeia logística.",
        "signStrategy": "Sinal de CALENDÁRIO marcando o dia exato do nascimento/fabricação daquele produto.",
        "sign_strategy": "Sinal de CALENDÁRIO marcando o dia exato do nascimento/fabricação daquele produto.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Fabricação",
          "Origem",
          "Produção"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-46",
        "term": "Origem do produto",
        "definition": "Indicação no rótulo do país ou local geográfico onde o alimento foi cultivado, extraído ou fabricado.",
        "description": "Indicação no rótulo do país ou local geográfico onde o alimento foi cultivado, extraído ou fabricado.",
        "context": "Indicação 'Indústria Brasileira' ou indicação geográfica (IG) protegida de vinhos e queijos artesanais.",
        "signStrategy": "Mão apontando no mapa geográfico a cidade, estado ou país de proveniência do produto.",
        "sign_strategy": "Mão apontando no mapa geográfico a cidade, estado ou país de proveniência do produto.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Indicação Geográfica",
          "Nacionalidade",
          "Procedência"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-47",
        "term": "Fabricante",
        "definition": "Pessoa jurídica responsável legal pela elaboração, manipulação ou envasamento do produto com CNPJ e endereço expostos.",
        "description": "Pessoa jurídica responsável legal pela elaboração, manipulação ou envasamento do produto com CNPJ e endereço expostos.",
        "context": "Canal de SAC obrigatório e responsabilidade civil objetiva por vícios do produto.",
        "signStrategy": "Sinal de EMPRESA / FÁBRICA com logotipo e dados fiscais impressos no verso.",
        "sign_strategy": "Sinal de EMPRESA / FÁBRICA com logotipo e dados fiscais impressos no verso.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "CNPJ",
          "SAC",
          "Indústria"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-48",
        "term": "Alegação nutricional",
        "definition": "Qualquer declaração voluntária no rótulo que sugira ou implique que um alimento possui propriedades nutricionais benéficas especiais.",
        "description": "Qualquer declaração voluntária no rótulo que sugira ou implique que um alimento possui propriedades nutricionais benéficas especiais.",
        "context": "Não pode enganar o consumidor destacando ausência de glúten em alimento que naturalmente nunca teve glúten (ex: sal).",
        "signStrategy": "Letreiros destacados chamando atenção positiva para nutrientes na frente do pacote.",
        "sign_strategy": "Letreiros destacados chamando atenção positiva para nutrientes na frente do pacote.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Marketing",
          "Propriedade",
          "Alegação"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-49",
        "term": "Informação nutricional complementar",
        "definition": "Forma de alegação que destaca teor reduzido de açúcar/sódio, ou fonte/alto conteúdo de vitaminas, minerais e fibras conforme a RDC 54/2012.",
        "description": "Forma de alegação que destaca teor reduzido de açúcar/sódio, ou fonte/alto conteúdo de vitaminas, minerais e fibras conforme a RDC 54/2012.",
        "context": "Submetida a critérios rigorosos da Anvisa para impedir anúncios falsamente saudáveis.",
        "signStrategy": "Selo de destaque positivo comprovado por regras matemáticas regulatórias oficiais.",
        "sign_strategy": "Selo de destaque positivo comprovado por regras matemáticas regulatórias oficiais.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "RDC 54",
          "Complementar",
          "Rotulagem"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-50",
        "term": "Fonte de",
        "definition": "Alegação permitida quando a porção do alimento atende ao patamar mínimo de 15% do valor diário de referência para fibras ou micronutrientes.",
        "description": "Alegação permitida quando a porção do alimento atende ao patamar mínimo de 15% do valor diário de referência para fibras ou micronutrientes.",
        "context": "Exemplo: 'Fonte de Cálcio' ou 'Fonte de Fibras' com comprovação em laudo analítico.",
        "signStrategy": "Sinal indicando que aquele nutriente atinge patamar bom e garantido dentro da porção.",
        "sign_strategy": "Sinal indicando que aquele nutriente atinge patamar bom e garantido dentro da porção.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Fonte",
          "Mínimo 15%",
          "Nutrientes"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-51",
        "term": "Alto conteúdo de",
        "definition": "Alegação autorizada quando o produto atinge pelo menos 30% do valor diário de referência de um nutriente benéfico por porção.",
        "description": "Alegação autorizada quando o produto atinge pelo menos 30% do valor diário de referência de um nutriente benéfico por porção.",
        "context": "Exemplo: 'Alto conteúdo de Vitamina C' em polpas puras de acerola ou suco de caju.",
        "signStrategy": "Mão subindo em nível alto com sinal de RIQUEZA EXCEPCIONAL daquele nutriente.",
        "sign_strategy": "Mão subindo em nível alto com sinal de RIQUEZA EXCEPCIONAL daquele nutriente.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Rico Em",
          "Mínimo 30%",
          "Excelência"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-52",
        "term": "Reduzido em",
        "definition": "Alegação autorizada quando o alimento tem redução mínima comprovada de 25% de um nutriente (como calorias, açúcar ou gordura) comparado ao produto padrão.",
        "description": "Alegação autorizada quando o alimento tem redução mínima comprovada de 25% de um nutriente (como calorias, açúcar ou gordura) comparado ao produto padrão.",
        "context": "Permite comparações de melhoria de formulação em produtos da mesma categoria de mercado.",
        "signStrategy": "Seta descendo 25% na barra de açúcar, gordura ou sódio em relação ao convencional.",
        "sign_strategy": "Seta descendo 25% na barra de açúcar, gordura ou sódio em relação ao convencional.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Redução",
          "Comparativo",
          "Melhoria"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-53",
        "term": "Sem adição de açúcar",
        "definition": "Declaração permitida apenas para produtos onde nenhum açúcar ou ingrediente que contenha açúcares adicionados foi incorporado no preparo.",
        "description": "Declaração permitida apenas para produtos onde nenhum açúcar ou ingrediente que contenha açúcares adicionados foi incorporado no preparo.",
        "context": "Mesmo sem açúcar adicionado, pode conter açúcares naturais da fruta que requerem atenção de diabéticos.",
        "signStrategy": "Mão impedindo categoricamente a entrada de colher de açúcar durante a confecção industrial.",
        "sign_strategy": "Mão impedindo categoricamente a entrada de colher de açúcar durante a confecção industrial.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Zero Adicionado",
          "Sem Açúcar",
          "Frutas"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-54",
        "term": "Zero açúcar",
        "definition": "Alegação que atesta que o produto contém quantidade não significativa de açúcares totais (inferior a 0,5 g por 100g ou 100ml).",
        "description": "Alegação que atesta que o produto contém quantidade não significativa de açúcares totais (inferior a 0,5 g por 100g ou 100ml).",
        "context": "Muito comum em refrigerantes de baixa caloria adoçados exclusivamente com edulcorantes artificiais.",
        "signStrategy": "Número ZERO formado com os dedos ao lado do sinal de AÇÚCAR com garantia total.",
        "sign_strategy": "Número ZERO formado com os dedos ao lado do sinal de AÇÚCAR com garantia total.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Zero Açúcar",
          "Sem Sacarose",
          "Diet"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-55",
        "term": "Sem lactose",
        "definition": "Declaração exclusiva para produtos que contêm quantidade de lactose inferior a 100 miligramas por 100 gramas ou mililitros de produto pronto.",
        "description": "Declaração exclusiva para produtos que contêm quantidade de lactose inferior a 100 miligramas por 100 gramas ou mililitros de produto pronto.",
        "context": "Alcançado por adição da enzima lactase durante o processamento para quebrar a lactose em glicose e galactose.",
        "signStrategy": "Sinal de LEITE acompanhado pelo sinal de AUSÊNCIA / ZERO LACTOSE.",
        "sign_strategy": "Sinal de LEITE acompanhado pelo sinal de AUSÊNCIA / ZERO LACTOSE.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Sem Lactose",
          "Quebra Enzimática",
          "Intolerância"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-56",
        "term": "Zero lactose",
        "definition": "Sinônimo regulatório de 'sem lactose' para produtos especiais destinados a indivíduos com intolerância grave.",
        "description": "Sinônimo regulatório de 'sem lactose' para produtos especiais destinados a indivíduos com intolerância grave.",
        "context": "Não confere segurança alguma para alérgicos à proteína do leite (APLV), pois a caseína continua intacta.",
        "signStrategy": "Destaque visual do ZERO na caixa do leite com aviso de que a proteína continua presente.",
        "sign_strategy": "Destaque visual do ZERO na caixa do leite com aviso de que a proteína continua presente.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Zero Lactose",
          "Alerta APLV",
          "Derivados"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-57",
        "term": "Sem glúten",
        "definition": "Informação obrigatória por lei federal em produtos que não contenham trigo, centeio, cevada, aveia ou derivados em sua composição.",
        "description": "Informação obrigatória por lei federal em produtos que não contenham trigo, centeio, cevada, aveia ou derivados em sua composição.",
        "context": "Salvaguarda jurídica inegociável da comunidade celíaca garantida pela Lei 10.674/2003.",
        "signStrategy": "Sinal de PROIBIDO GLÚTEN ou NÃO TEM GLÚTEN com expressão de tranquilidade para celíacos.",
        "sign_strategy": "Sinal de PROIBIDO GLÚTEN ou NÃO TEM GLÚTEN com expressão de tranquilidade para celíacos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Lei 10674",
          "Celíacos",
          "Segurança"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-58",
        "term": "Declaração de alergênicos",
        "definition": "Informação no rótulo destinada a alertar sobre a presença de ingredientes ou derivados capazes de provocar alergias alimentares.",
        "description": "Informação no rótulo destinada a alertar sobre a presença de ingredientes ou derivados capazes de provocar alergias alimentares.",
        "context": "Deve ser impressa em caracteres legíveis, sem quebra de palavras e imediatamente após a lista de ingredientes.",
        "signStrategy": "Mãos em moldura retangular com cor destacada alertando a lista de alergênicos perigosos.",
        "sign_strategy": "Mãos em moldura retangular com cor destacada alertando a lista de alergênicos perigosos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Alérgenos",
          "Legibilidade",
          "RDC 727"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-59",
        "term": "Alérgicos: contém",
        "definition": "Frase de alerta obrigatória em letras maiúsculas e negrito indicando a presença intencional de alérgenos da lista oficial da Anvisa.",
        "description": "Frase de alerta obrigatória em letras maiúsculas e negrito indicando a presença intencional de alérgenos da lista oficial da Anvisa.",
        "context": "Exemplo: 'ALÉRGICOS: CONTÉM DERIVADOS DE SOJA E LEITE'.",
        "signStrategy": "Letreiros em negrito com sinal enfático de AFIRMAÇÃO: TEM ALÉRGENO AQUI DENTRO.",
        "sign_strategy": "Letreiros em negrito com sinal enfático de AFIRMAÇÃO: TEM ALÉRGENO AQUI DENTRO.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Contém",
          "Alerta Obrigatório",
          "Negrito"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-60",
        "term": "Alérgicos: pode conter",
        "definition": "Advertência obrigatória sobre o risco de contaminação cruzada involuntária com traços de alérgenos na linha de montagem industrial.",
        "description": "Advertência obrigatória sobre o risco de contaminação cruzada involuntária com traços de alérgenos na linha de montagem industrial.",
        "context": "Exemplo: 'ALÉRGICOS: PODE CONTER CASTANHA-DE-CAJU E AMENDOIM'.",
        "signStrategy": "Sinal de DÚVIDA / RISCO POTENCIAL: máquina compartilhou e pode haver partículas residuais.",
        "sign_strategy": "Sinal de DÚVIDA / RISCO POTENCIAL: máquina compartilhou e pode haver partículas residuais.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Pode Conter",
          "Traços",
          "Compartilhamento"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-61",
        "term": "Contém glúten",
        "definition": "Advertência obrigatória por lei em todos os alimentos que contêm glúten, essencial para a segurança de indivíduos celíacos.",
        "description": "Advertência obrigatória por lei em todos os alimentos que contêm glúten, essencial para a segurança de indivíduos celíacos.",
        "context": "Obrigatória em cervejas tradicionais, pães de trigo, massas e cereais matinais comuns.",
        "signStrategy": "Sinal visual de PERIGO PARA CELÍACO: CONTÉM GLÚTEN em caixa alta.",
        "sign_strategy": "Sinal visual de PERIGO PARA CELÍACO: CONTÉM GLÚTEN em caixa alta.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Glúten",
          "Celíaco",
          "Aviso Legal"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-62",
        "term": "Não contém glúten",
        "definition": "Declaração obrigatória em alimentos que comprovadamente não possuem glúten, seja por natureza ou formulação especial.",
        "description": "Declaração obrigatória em alimentos que comprovadamente não possuem glúten, seja por natureza ou formulação especial.",
        "context": "Fundamental para compras seguras em farinhas de arroz, polvilho e produtos especiais testados.",
        "signStrategy": "Sinal positivo: LIVRE DE GLÚTEN, seguro e liberado para consumo celíaco.",
        "sign_strategy": "Sinal positivo: LIVRE DE GLÚTEN, seguro e liberado para consumo celíaco.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Gluten-Free",
          "Apto para Celíacos",
          "Seguro"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-63",
        "term": "Organismo geneticamente modificado",
        "definition": "Organismo cujo material genético foi transformado pela introdução de genes de outra espécie através da biotecnologia moderna.",
        "description": "Organismo cujo material genético foi transformado pela introdução de genes de outra espécie através da biotecnologia moderna.",
        "context": "Muito comum em lavouras de soja e milho para resistência a lagartas e herbicidas.",
        "signStrategy": "Mãos manipulando a hélice do DNA e inserindo pedaço genético de outra espécie com tecnologia.",
        "sign_strategy": "Mãos manipulando a hélice do DNA e inserindo pedaço genético de outra espécie com tecnologia.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "OGM",
          "Biotecnologia",
          "Genética"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-64",
        "term": "Transgênico",
        "definition": "Produto que contém ou foi produzido a partir de organismo geneticamente modificado, exigindo símbolo de triângulo amarelo com a letra 'T' no rótulo.",
        "description": "Produto que contém ou foi produzido a partir de organismo geneticamente modificado, exigindo símbolo de triângulo amarelo com a letra 'T' no rótulo.",
        "context": "Exigência do Decreto Federal 4.680/2003 para qualquer alimento com mais de 1% de matéria transgênica.",
        "signStrategy": "Mãos desenhando o triângulo amarelo com a letra T gravada no centro da embalagem.",
        "sign_strategy": "Mãos desenhando o triângulo amarelo com a letra T gravada no centro da embalagem.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Símbolo T",
          "Decreto 4680",
          "Milho Transgênico"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-65",
        "term": "Produto integral",
        "definition": "Alimento elaborado predominantemente com farinhas de grãos integrais preservando endosperma, germe e farelo (mínimo de 50% segundo a nova RDC).",
        "description": "Alimento elaborado predominantemente com farinhas de grãos integrais preservando endosperma, germe e farelo (mínimo de 50% segundo a nova RDC).",
        "context": "A RDC 493/2021 exige que a quantidade de grão integral venha declarada em porcentagem na parte da frente.",
        "signStrategy": "Sinal de GRÃO INTEIRO NÃO REFINADO mantendo casca e nutrientes vitais na farinha.",
        "sign_strategy": "Sinal de GRÃO INTEIRO NÃO REFINADO mantendo casca e nutrientes vitais na farinha.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Grão Integral",
          "RDC 493",
          "Farelo"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-66",
        "term": "Produto diet",
        "definition": "Alimento formulado para atender a necessidades metabólicas específicas (como diabéticos), caracterizado pela exclusão total de um nutriente (geralmente açúcar).",
        "description": "Alimento formulado para atender a necessidades metabólicas específicas (como diabéticos), caracterizado pela exclusão total de um nutriente (geralmente açúcar).",
        "context": "Não é necessariamente de baixa caloria; chocolate diet sem açúcar pode conter mais gordura que o normal.",
        "signStrategy": "Sinal de EXCLUSÃO TOTAL DE AÇÚCAR destinado para pessoas com restrições como diabetes.",
        "sign_strategy": "Sinal de EXCLUSÃO TOTAL DE AÇÚCAR destinado para pessoas com restrições como diabetes.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Diet",
          "Diabetes",
          "Exclusão"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-67",
        "term": "Produto light",
        "definition": "Alimento que apresenta redução mínima de 25% de algum componente (como gorduras, calorias ou sódio) em comparação com o alimento tradicional similar.",
        "description": "Alimento que apresenta redução mínima de 25% de algum componente (como gorduras, calorias ou sódio) em comparação com o alimento tradicional similar.",
        "context": "Destinado ao público que busca redução calórica ou menor ingestão de sal e gorduras no dia a dia.",
        "signStrategy": "Balança inclinando com redução de peso: LEVE / 25% A MENOS de calorias ou gorduras.",
        "sign_strategy": "Balança inclinando com redução de peso: LEVE / 25% A MENOS de calorias ou gorduras.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Light",
          "Menos Calorias",
          "25% a Menos"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-68",
        "term": "Produto enriquecido",
        "definition": "Alimento ao qual foram adicionados vitaminas ou minerais para aumentar seu valor nutricional ou restaurar nutrientes perdidos no processamento.",
        "description": "Alimento ao qual foram adicionados vitaminas ou minerais para aumentar seu valor nutricional ou restaurar nutrientes perdidos no processamento.",
        "context": "Comum em leites enriquecidos com vitaminas A e D ou sucos com adição extra de cálcio.",
        "signStrategy": "Mão inserindo doses ricas de vitaminas brilhantes no interior do alimento já processado.",
        "sign_strategy": "Mão inserindo doses ricas de vitaminas brilhantes no interior do alimento já processado.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Micronutrientes",
          "Enriquecimento",
          "Saúde"
        ],
        "axis_id": 3
      },
      {
        "id": "term-rot-69",
        "term": "Produto fortificado",
        "definition": "Alimento com adição obrigatória ou voluntária de nutrientes para prevenir carências populacionais (como ferro e ácido fólico nas farinhas de trigo e milho).",
        "description": "Alimento com adição obrigatória ou voluntária de nutrientes para prevenir carências populacionais (como ferro e ácido fólico nas farinhas de trigo e milho).",
        "context": "Política pública nacional de saúde para erradicar a anemia ferropriva e defeitos no tubo neural de bebês.",
        "signStrategy": "Sinal de POLÍTICA PÚBLICA / SAÚDE DO POVO com ferro e ácido fólico nas farinhas nacionais.",
        "sign_strategy": "Sinal de POLÍTICA PÚBLICA / SAÚDE DO POVO com ferro e ácido fólico nas farinhas nacionais.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Ferro",
          "Ácido Fólico",
          "Fortificação Obrigatória"
        ],
        "axis_id": 3
      }
    ]
  },
  {
    "id": "analise-critica",
    "numericId": 4,
    "title": "Eixo 4 — Análise Crítica",
    "emoji": "⚖️",
    "description": "Distinção comparativa e regulatória entre produtos que parecem equivalentes, mas possuem identidade e composição diferentes.",
    "terms": [
      {
        "id": "term-crit-1",
        "term": "Leite × bebida láctea",
        "definition": "O leite é a secreção pura da ordenha sem adição de soro. A bebida láctea é uma mistura formulada com soro de leite (mínimo 51% de base láctea), frequentemente com gordura vegetal, amido e aromas.",
        "description": "O leite é a secreção pura da ordenha sem adição de soro. A bebida láctea é uma mistura formulada com soro de leite (mínimo 51% de base láctea), frequentemente com gordura vegetal, amido e aromas.",
        "context": "Regulamentado pelo MAPA. O soro barateia o custo, mas reduz expressivamente o teor de proteínas de alto valor biológico e cálcio natural.",
        "signStrategy": "Mão esquerda: LEITE PURO (alto valor). Mão direita: BEBIDA LÁCTEA COM SORO E AMIDO (barata, menor nutrição). Comparar frente a frente.",
        "sign_strategy": "Mão esquerda: LEITE PURO (alto valor). Mão direita: BEBIDA LÁCTEA COM SORO E AMIDO (barata, menor nutrição). Comparar frente a frente.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Comparações",
          "Laticínios",
          "Soro de Leite",
          "MAPA"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-2",
        "term": "Leite em pó × composto lácteo",
        "definition": "O leite em pó resulta exclusivamente da desidratação do leite fluido. O composto lácteo possui apenas 51% de ingredientes lácteos misturados com óleos vegetais, maltodextrina e açúcar adicionado.",
        "description": "O leite em pó resulta exclusivamente da desidratação do leite fluido. O composto lácteo possui apenas 51% de ingredientes lácteos misturados com óleos vegetais, maltodextrina e açúcar adicionado.",
        "context": "Muitas famílias compram composto lácteo acreditando ser leite em pó integral, introduzindo gordura vegetal e açúcar precocemente na dieta infantil.",
        "signStrategy": "Comparar: 1) PÓ DE LEITE 100% PURO vs 2) COMPOSTO MISTURADO com açúcar e óleo vegetal em lata semelhante.",
        "sign_strategy": "Comparar: 1) PÓ DE LEITE 100% PURO vs 2) COMPOSTO MISTURADO com açúcar e óleo vegetal em lata semelhante.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Comparações",
          "Composto Lácteo",
          "Nutrição Infantil"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-3",
        "term": "Leite condensado × mistura láctea condensada",
        "definition": "O leite condensado tradicional é obtido pela desidratação de leite integral com adição de sacarose. A mistura condensada substitui parte do leite por soro, amido modificado e gordura vegetal hidrogenada.",
        "description": "O leite condensado tradicional é obtido pela desidratação de leite integral com adição de sacarose. A mistura condensada substitui parte do leite por soro, amido modificado e gordura vegetal hidrogenada.",
        "context": "A mistura láctea desanda mais facilmente em sobremesas no fogo e possui textura e cremosidade inferiores proporcionadas por espessantes.",
        "signStrategy": "Sinal comparativo de latas: uma autêntica de leite espesso vs outra ultraprocessada com amido e soro barateado.",
        "sign_strategy": "Sinal comparativo de latas: uma autêntica de leite espesso vs outra ultraprocessada com amido e soro barateado.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Confeitaria",
          "Amido",
          "Ultraprocessado"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-4",
        "term": "Manteiga × margarina",
        "definition": "A manteiga é um produto de origem animal obtido pelo batimento mecânico da nata do leite. A margarina é uma emulsão industrial sintética de óleos vegetais hidrogenados ou interesterificados com aditivos.",
        "description": "A manteiga é um produto de origem animal obtido pelo batimento mecânico da nata do leite. A margarina é uma emulsão industrial sintética de óleos vegetais hidrogenados ou interesterificados com aditivos.",
        "context": "A manteiga contém vitaminas lipossolúveis naturais da gordura do leite. A margarina é produto industrial com emulsificantes e aromatizantes artificiais.",
        "signStrategy": "Mão 1: MANTEIGA (feita de nata batida de vaca). Mão 2: MARGARINA (feita de óleo vegetal trabalhado na fábrica com químicos).",
        "sign_strategy": "Mão 1: MANTEIGA (feita de nata batida de vaca). Mão 2: MARGARINA (feita de óleo vegetal trabalhado na fábrica com químicos).",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Gorduras",
          "Manteiga",
          "Margarina",
          "Interesterificação"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-5",
        "term": "Iogurte × bebida láctea fermentada",
        "definition": "O iogurte exige fermentação lática exclusiva com Streptococcus thermophilus e Lactobacillus bulgaricus em leite puro. A bebida láctea fermentada leva soro de queijo e bactérias secundárias.",
        "description": "O iogurte exige fermentação lática exclusiva com Streptococcus thermophilus e Lactobacillus bulgaricus em leite puro. A bebida láctea fermentada leva soro de queijo e bactérias secundárias.",
        "context": "O iogurte verdadeiro tem textura mais densa, rica em caseína e sem amido espessante obrigatório.",
        "signStrategy": "Comparar potes: um de fermentação nobre concentrada vs outro ralo estendido com soro de queijaria.",
        "sign_strategy": "Comparar potes: um de fermentação nobre concentrada vs outro ralo estendido com soro de queijaria.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Fermentação",
          "Probióticos",
          "Laticínios"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-6",
        "term": "Requeijão × especialidade láctea",
        "definition": "O requeijão cremoso legítimo é obtido pela fusão de massa de coalhada fresca com creme de leite. A especialidade ou 'requeijão culinário com amido' adiciona gordura vegetal barata e amidos.",
        "description": "O requeijão cremoso legítimo é obtido pela fusão de massa de coalhada fresca com creme de leite. A especialidade ou 'requeijão culinário com amido' adiciona gordura vegetal barata e amidos.",
        "context": "Especialidades com amido soltam óleo e perdem estrutura ao serem assadas em pizzas e salgados industriais.",
        "signStrategy": "Mostrar a cremosidade da coalhada legítima vs massa esticada artificialmente com amido de milho e óleo vegetal.",
        "sign_strategy": "Mostrar a cremosidade da coalhada legítima vs massa esticada artificialmente com amido de milho e óleo vegetal.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Queijaria",
          "Gordura Vegetal",
          "Culinária"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-7",
        "term": "Queijo × produto alimentício à base de queijo",
        "definition": "O queijo é elaborado a partir do leite coagulado por ação do coalho ou enzimas. Produtos 'à base de queijo' utilizam gordura vegetal, água, amido e essência de queijo fundidos.",
        "description": "O queijo é elaborado a partir do leite coagulado por ação do coalho ou enzimas. Produtos 'à base de queijo' utilizam gordura vegetal, água, amido e essência de queijo fundidos.",
        "context": "Comum em fatias 'sabor cheddar' plásticas que não derretem como queijo real devido ao excesso de espessantes químicos.",
        "signStrategy": "Comparação entre cura natural de leite coalhado e massa química amarela prensada sabor artificial de queijo.",
        "sign_strategy": "Comparação entre cura natural de leite coalhado e massa química amarela prensada sabor artificial de queijo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Queijos",
          "Ultraprocessados",
          "Análise Sensorial"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-8",
        "term": "Creme de leite × mistura de creme culinário",
        "definition": "O creme de leite puro possui apenas gordura natural láctea (mínimo de 17% a 20%). O creme culinário mistura soro de leite com gordura vegetal de palma e espessantes artificiais.",
        "description": "O creme de leite puro possui apenas gordura natural láctea (mínimo de 17% a 20%). O creme culinário mistura soro de leite com gordura vegetal de palma e espessantes artificiais.",
        "context": "A mistura de creme culinário talha mais fácil ao ferver com ingredientes ácidos (como limão ou mostarda).",
        "signStrategy": "Mão direita: nata de leite espessa. Mão esquerda: mistura de soro e gordura de palma que imita creme.",
        "sign_strategy": "Mão direita: nata de leite espessa. Mão esquerda: mistura de soro e gordura de palma que imita creme.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Culinária",
          "Gordura de Palma",
          "Emulsão"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-9",
        "term": "Chocolate × produto sabor chocolate",
        "definition": "O chocolate genuíno contém obrigatoriamente no mínimo 25% de derivados de cacau (manteiga e massa). O produto 'sabor chocolate' substitui a manteiga de cacau por gordura vegetal fracionada.",
        "description": "O chocolate genuíno contém obrigatoriamente no mínimo 25% de derivados de cacau (manteiga e massa). O produto 'sabor chocolate' substitui a manteiga de cacau por gordura vegetal fracionada.",
        "context": "A gordura vegetal não derrete na temperatura do corpo (36°C), deixando sensação de cera no céu da boca.",
        "signStrategy": "Sinal de CACAU NOBRE derretendo suavemente vs GORDURA HIDROGENADA saborizada com essência artificial.",
        "sign_strategy": "Sinal de CACAU NOBRE derretendo suavemente vs GORDURA HIDROGENADA saborizada com essência artificial.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Cacau",
          "Manteiga de Cacau",
          "Gordura Fracionada"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-10",
        "term": "Chocolate em pó × pó para preparo sabor chocolate",
        "definition": "O chocolate em pó contém entre 32% e 50% de cacau misturado a açúcar. O pó para preparo ou achocolatado possui mais de 70% a 85% de açúcar refinado e pouco cacau.",
        "description": "O chocolate em pó contém entre 32% e 50% de cacau misturado a açúcar. O pó para preparo ou achocolatado possui mais de 70% a 85% de açúcar refinado e pouco cacau.",
        "context": "Ao analisar a lista de ingredientes, o achocolatado traz o açúcar em primeiro lugar e aromas artificiais para disfarçar o pouco cacau.",
        "signStrategy": "Comparar a escuridão do pó com cacau denso contra o pó claro brilhante repleto de grãos de açúcar.",
        "sign_strategy": "Comparar a escuridão do pó com cacau denso contra o pó claro brilhante repleto de grãos de açúcar.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Achocolatado",
          "Açúcar",
          "Lista de Ingredientes"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-11",
        "term": "Cacau em pó × chocolate em pó",
        "definition": "O cacau em pó é 100% fruto do cacau puro moído sem adição de nenhum açúcar. O chocolate em pó é uma mistura adoçada com sacarose.",
        "description": "O cacau em pó é 100% fruto do cacau puro moído sem adição de nenhum açúcar. O chocolate em pó é uma mistura adoçada com sacarose.",
        "context": "O cacau puro é riquíssimo em flavonoides antioxidantes e polifenóis com sabor amargo característico.",
        "signStrategy": "Cacau puro 100% amargo e medicinal vs chocolate em pó diluído em açúcar na fábrica.",
        "sign_strategy": "Cacau puro 100% amargo e medicinal vs chocolate em pó diluído em açúcar na fábrica.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Cacau 100%",
          "Flavonoides",
          "Puro"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-12",
        "term": "Suco × néctar",
        "definition": "O suco é 100% fruta pura (sem água adicionada se integral). O néctar contém apenas 20% a 30% de polpa de fruta, sendo o restante água e grandes doses de açúcar adicionado.",
        "description": "O suco é 100% fruta pura (sem água adicionada se integral). O néctar contém apenas 20% a 30% de polpa de fruta, sendo o restante água e grandes doses de açúcar adicionado.",
        "context": "Caixinhas de néctar exibem fotos gigantes de frutas na frente, mas entregam água com açúcar e corante.",
        "signStrategy": "Mão 1: FRUTA PURA ESPREMIDA 100%. Mão 2: 70% ÁGUA + AÇÚCAR e um pouquinho só de fruta no fundo.",
        "sign_strategy": "Mão 1: FRUTA PURA ESPREMIDA 100%. Mão 2: 70% ÁGUA + AÇÚCAR e um pouquinho só de fruta no fundo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Bebidas",
          "Sucos",
          "Néctar",
          "MAPA"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-13",
        "term": "Suco × refresco",
        "definition": "O suco possui alta concentração ou totalidade de fruta. O refresco (em pó ou garrafa) pode conter míseros 2% a 10% de fruta diluídos em água, aromatizante e açúcar.",
        "description": "O suco possui alta concentração ou totalidade de fruta. O refresco (em pó ou garrafa) pode conter míseros 2% a 10% de fruta diluídos em água, aromatizante e açúcar.",
        "context": "Pó de refresco é produto ultraprocessado desprovido de vitaminas reais, rico em corantes alergênicos e sódio.",
        "signStrategy": "Comparação entre o líquido extraído da fruta da época e o pacotinho de pó químico tingido de cor artificial.",
        "sign_strategy": "Comparação entre o líquido extraído da fruta da época e o pacotinho de pó químico tingido de cor artificial.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Refresco em Pó",
          "Ultraprocessado",
          "Química"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-14",
        "term": "Suco integral × bebida de fruta",
        "definition": "O suco integral não tem adição de água nem açúcares externos, mantendo a água biológica da fruta. A bebida de fruta é diluída e adoçada.",
        "description": "O suco integral não tem adição de água nem açúcares externos, mantendo a água biológica da fruta. A bebida de fruta é diluída e adoçada.",
        "context": "O suco integral de uva ou laranja preserva todos os fitoquímicos e ácidos orgânicos originais da polpa.",
        "signStrategy": "Gesto de espremer o cacho de uvas diretamente na garrafa de vidro sem adicionar nem uma gota de água da torneira.",
        "sign_strategy": "Gesto de espremer o cacho de uvas diretamente na garrafa de vidro sem adicionar nem uma gota de água da torneira.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Suco Integral",
          "Puro",
          "Frutas"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-15",
        "term": "Polpa de fruta × preparado de fruta",
        "definition": "A polpa de fruta é a fração carnosa obtida de frutas frescas congelada sem aditivos. O preparado de fruta é uma calda cozida industrial com xaropes, espessantes e conservantes.",
        "description": "A polpa de fruta é a fração carnosa obtida de frutas frescas congelada sem aditivos. O preparado de fruta é uma calda cozida industrial com xaropes, espessantes e conservantes.",
        "context": "Preparados de frutas são utilizados em recheios industriais de bolos e iogurtes com baixa quantidade da fruta real.",
        "signStrategy": "Polpa pura congelada no saco plástico vs doce em calda artificial com espessante e conservante.",
        "sign_strategy": "Polpa pura congelada no saco plástico vs doce em calda artificial com espessante e conservante.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Polpa Congelada",
          "Preparado",
          "Agroindústria"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-16",
        "term": "Café × produto/pó para preparo sabor café",
        "definition": "O café verdadeiro é constituído 100% por grãos da espécie Coffea torrados e moídos. Pós para preparo contêm milho, cevada torrada ou chicória misturados para render.",
        "description": "O café verdadeiro é constituído 100% por grãos da espécie Coffea torrados e moídos. Pós para preparo contêm milho, cevada torrada ou chicória misturados para render.",
        "context": "Fiscalizado pelo MAPA com laudos microscópicos de pureza que buscam impurezas e cascas em excesso.",
        "signStrategy": "Comparar grão de café selecionado moído vs mistura adulterada com grãos de milho queimado.",
        "sign_strategy": "Comparar grão de café selecionado moído vs mistura adulterada com grãos de milho queimado.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Café Puro",
          "Pureza",
          "Adulteração"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-17",
        "term": "Café torrado e moído × mistura para bebida à base de café",
        "definition": "O café torrado e moído puro leva o selo de pureza da ABIC. As misturas combinam pó de café solúvel com leite em pó, gordura vegetal e espessantes (como cappuccino instantâneo).",
        "description": "O café torrado e moído puro leva o selo de pureza da ABIC. As misturas combinam pó de café solúvel com leite em pó, gordura vegetal e espessantes (como cappuccino instantâneo).",
        "context": "Misturas solúveis possuem alta densidade calórica e altos teores de açúcares adicionados e sódio.",
        "signStrategy": "Pó de café no coador de pano vs pó instantâneo cheio de leite sintético e açúcar para bater em água morna.",
        "sign_strategy": "Pó de café no coador de pano vs pó instantâneo cheio de leite sintético e açúcar para bater em água morna.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "ABIC",
          "Solúvel",
          "Cappuccino"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-18",
        "term": "Azeite de oliva × óleo composto",
        "definition": "O azeite de oliva é extraído unicamente do fruto da oliveira a frio. O óleo composto é uma mistura que leva até 85% de óleo refinado de soja com apenas 15% de azeite.",
        "description": "O azeite de oliva é extraído unicamente do fruto da oliveira a frio. O óleo composto é uma mistura que leva até 85% de óleo refinado de soja com apenas 15% de azeite.",
        "context": "Muitas marcas utilizam embalagens de vidro verde e nomes em italiano para vender óleo de soja como se fosse azeite virgem.",
        "signStrategy": "Azeitonas prensadas a frio em líquido dourado vs garrafa misturada com 85% de óleo de soja de baixo custo.",
        "sign_strategy": "Azeitonas prensadas a frio em líquido dourado vs garrafa misturada com 85% de óleo de soja de baixo custo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Azeite de Oliva",
          "Óleo Composto",
          "Fraude Alimentar"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-19",
        "term": "Óleo vegetal × gordura vegetal",
        "definition": "O óleo vegetal permanece em estado líquido na temperatura ambiente (insaturado). A gordura vegetal passa por hidrogenação ou fracionamento tornando-se sólida ou pastosa.",
        "description": "O óleo vegetal permanece em estado líquido na temperatura ambiente (insaturado). A gordura vegetal passa por hidrogenação ou fracionamento tornando-se sólida ou pastosa.",
        "context": "Gorduras vegetais sólidas conferem crocância a biscoitos recheados, mas têm maior potencial inflamatório vascular.",
        "signStrategy": "Óleo escorrendo líquido dourado vs gordura em bloco branco sólido e resistente ao calor.",
        "sign_strategy": "Óleo escorrendo líquido dourado vs gordura em bloco branco sólido e resistente ao calor.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Lipídios",
          "Óleo Líquido",
          "Gordura Sólida"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-20",
        "term": "Mel × composto à base de mel",
        "definition": "O mel puro é produzido pelas abelhas a partir do néctar floral sem aditivos. O composto à base de mel é xarope de milho (glicose industrial) com corante caramelo e aroma.",
        "description": "O mel puro é produzido pelas abelhas a partir do néctar floral sem aditivos. O composto à base de mel é xarope de milho (glicose industrial) com corante caramelo e aroma.",
        "context": "O composto de mel não possui as propriedades bactericidas e enzimáticas naturais do mel cru de apiário.",
        "signStrategy": "Abelhas no favo produzindo mel terapêutico vs xarope químico de glicose embalado em bisnaga amarela.",
        "sign_strategy": "Abelhas no favo produzindo mel terapêutico vs xarope químico de glicose embalado em bisnaga amarela.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Mel Puro",
          "Apiário",
          "Xarope de Glicose"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-21",
        "term": "Pão integral × pão com farinha integral",
        "definition": "O pão integral deve ter no mínimo 50% de farinha integral de grão inteiro. O 'pão com farinha integral' pode ter 90% de farinha branca refinada e apenas uma pitada de farelo.",
        "description": "O pão integral deve ter no mínimo 50% de farinha integral de grão inteiro. O 'pão com farinha integral' pode ter 90% de farinha branca refinada e apenas uma pitada de farelo.",
        "context": "A nova rotulagem da Anvisa obriga a declarar a porcentagem exata de grãos integrais na face frontal do pacote.",
        "signStrategy": "Grão com farelo e germe moído integralmente vs pão branco tingido com caramelo e farelo polvilhado por cima.",
        "sign_strategy": "Grão com farelo e germe moído integralmente vs pão branco tingido com caramelo e farelo polvilhado por cima.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Farinha Integral",
          "Refinada",
          "RDC 493"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-22",
        "term": "Farinha integral × farinha refinada",
        "definition": "A farinha integral preserva o farelo externo (fibras) e o germe (minerais e lipídios). A farinha refinada branca mantém apenas o endosperma amiláceo, perdendo as fibras.",
        "description": "A farinha integral preserva o farelo externo (fibras) e o germe (minerais e lipídios). A farinha refinada branca mantém apenas o endosperma amiláceo, perdendo as fibras.",
        "context": "A farinha refinada tem índice glicêmico muito mais alto e digestão ultrarrápida, favorecendo picos de fome.",
        "signStrategy": "Grão de trigo completo preservado vs grão descascado e polido restando apenas o pó de amido branco.",
        "sign_strategy": "Grão de trigo completo preservado vs grão descascado e polido restando apenas o pó de amido branco.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Fibras",
          "Refino",
          "Índice Glicêmico"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-23",
        "term": "Açúcar × adoçante",
        "definition": "O açúcar (sacarose) é calórico (4 kcal/g) e obtido da cana ou beterraba. O adoçante (edulcorante) é substância de altíssimo poder dulçor com valor calórico quase nulo.",
        "description": "O açúcar (sacarose) é calórico (4 kcal/g) e obtido da cana ou beterraba. O adoçante (edulcorante) é substância de altíssimo poder dulçor com valor calórico quase nulo.",
        "context": "Adoçantes podem ser úteis no controle do diabetes, mas não devem hiperestimular a preferência cerebral por sabores ultradoces.",
        "signStrategy": "Colherada de açúcar refinado que eleva glicose vs gotas minúsculas de adoçante que imitam o doce sem calorias.",
        "sign_strategy": "Colherada de açúcar refinado que eleva glicose vs gotas minúsculas de adoçante que imitam o doce sem calorias.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Sacarose",
          "Edulcorantes",
          "Glicemia"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-24",
        "term": "Açúcar mascavo × açúcar refinado",
        "definition": "O açúcar mascavo é a forma bruta obtida da concentração do caldo de cana, preservando ferro e cálcio. O açúcar refinado passa por sulfitação e clareamento químico, restando sacarose pura.",
        "description": "O açúcar mascavo é a forma bruta obtida da concentração do caldo de cana, preservando ferro e cálcio. O açúcar refinado passa por sulfitação e clareamento químico, restando sacarose pura.",
        "context": "Embora o mascavo retenha micronutrientes, ambos elevam a glicemia e devem ser consumidos com grande parcimônia.",
        "signStrategy": "Caldo de cana escuro e mineral mascavo vs pó branco quimicamente clareado e desmineralizado.",
        "sign_strategy": "Caldo de cana escuro e mineral mascavo vs pó branco quimicamente clareado e desmineralizado.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Mascavo",
          "Refino Químico",
          "Nutrientes"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-25",
        "term": "Alimento in natura × alimento processado",
        "definition": "In natura são alimentos obtidos diretamente de plantas ou animais sem alteração industrial (frutas, ovos). Processados são feitos pela adição de sal, açúcar ou óleo a alimentos in natura para durabilidade (conservas, queijos artesanais).",
        "description": "In natura são alimentos obtidos diretamente de plantas ou animais sem alteração industrial (frutas, ovos). Processados são feitos pela adição de sal, açúcar ou óleo a alimentos in natura para durabilidade (conservas, queijos artesanais).",
        "context": "Conceito central do Guia Alimentar para a População Brasileira que orienta a base da alimentação saudável.",
        "signStrategy": "Maçã colhida direto da árvore vs compota caseira da fruta cozida com açúcar e vidro esterilizado.",
        "sign_strategy": "Maçã colhida direto da árvore vs compota caseira da fruta cozida com açúcar e vidro esterilizado.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Guia Alimentar",
          "In Natura",
          "Processados"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-26",
        "term": "Alimento processado × ultraprocessado",
        "definition": "Alimentos processados mantêm a identidade do alimento original com poucos ingredientes culinários. Ultraprocessados são formulações industriais de cinco ou mais ingredientes, repletos de aromatizantes, corantes e gorduras modificadas.",
        "description": "Alimentos processados mantêm a identidade do alimento original com poucos ingredientes culinários. Ultraprocessados são formulações industriais de cinco ou mais ingredientes, repletos de aromatizantes, corantes e gorduras modificadas.",
        "context": "O Guia Alimentar recomenda evitar categoricamente os ultraprocessados devido à ligação comprovada com câncer e doenças cardiovasculares.",
        "signStrategy": "Queijo artesanal de leite e sal vs salgadinho de pacote extrusado com pós aromáticos sintéticos.",
        "sign_strategy": "Queijo artesanal de leite e sal vs salgadinho de pacote extrusado com pós aromáticos sintéticos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Ultraprocessados",
          "NOVA",
          "Saúde Pública"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-27",
        "term": "Produto artesanal × produto industrializado",
        "definition": "O produto artesanal é feito em pequena escala, com saberes tradicionais, predominância de trabalho manual e identidade territorial. O industrializado visa escala massiva, padronização mecânica e aditivos químicos.",
        "description": "O produto artesanal é feito em pequena escala, com saberes tradicionais, predominância de trabalho manual e identidade territorial. O industrializado visa escala massiva, padronização mecânica e aditivos químicos.",
        "context": "Produtos com Selo Arte valorizam a identidade cultural e a economia dos produtores rurais familiares.",
        "signStrategy": "Mãos artesãs modelando queijo e compota tradicionalmente vs esteira de fábrica em alta velocidade produzindo milhões de unidades idênticas.",
        "sign_strategy": "Mãos artesãs modelando queijo e compota tradicionalmente vs esteira de fábrica em alta velocidade produzindo milhões de unidades idênticas.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Selo Arte",
          "Saberes Locais",
          "Indústria"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-28",
        "term": "Produto orgânico × produto convencional",
        "definition": "O produto orgânico é cultivado em sistema biológico sem agrotóxicos sintéticos, transgênicos ou adubos solúveis. O convencional utiliza fertilizantes químicos e pesticidas sintéticos para ganho de escala.",
        "description": "O produto orgânico é cultivado em sistema biológico sem agrotóxicos sintéticos, transgênicos ou adubos solúveis. O convencional utiliza fertilizantes químicos e pesticidas sintéticos para ganho de escala.",
        "context": "O produto orgânico possui selo de certificação oficial do SisOrg e protege a saúde do agricultor e os lençóis freáticos.",
        "signStrategy": "Horta agroecológica com selo verde orgânico vs plantação pulverizada com venenos agrícolas sintéticos.",
        "sign_strategy": "Horta agroecológica com selo verde orgânico vs plantação pulverizada com venenos agrícolas sintéticos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Orgânicos",
          "SisOrg",
          "Agrotóxicos"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-29",
        "term": "Diet × light",
        "definition": "Diet é destinado a condições médicas específicas com exclusão total (100%) de algum nutriente (ex: sem açúcar para diabéticos). Light apresenta redução mínima de 25% de calorias, sódio ou gordura comparado ao tradicional.",
        "description": "Diet é destinado a condições médicas específicas com exclusão total (100%) de algum nutriente (ex: sem açúcar para diabéticos). Light apresenta redução mínima de 25% de calorias, sódio ou gordura comparado ao tradicional.",
        "context": "Um produto diet pode ter calorias elevadas se compensar o açúcar com gordura; já o light foca em reduções parciais.",
        "signStrategy": "DIET: corte total de um elemento por motivo de doença. LIGHT: corte de 25% para quem quer emagrecer ou reduzir peso.",
        "sign_strategy": "DIET: corte total de um elemento por motivo de doença. LIGHT: corte de 25% para quem quer emagrecer ou reduzir peso.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Diet",
          "Light",
          "Comparativo Regulatório"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-30",
        "term": "Zero açúcar × sem adição de açúcar",
        "definition": "'Zero açúcar' tem teor residual inferior a 0,5g por porção (ausência quase absoluta). 'Sem adição de açúcar' não adicionou sacarose de fora, mas pode ser riquíssimo nos açúcares naturais da fruta ou leite.",
        "description": "'Zero açúcar' tem teor residual inferior a 0,5g por porção (ausência quase absoluta). 'Sem adição de açúcar' não adicionou sacarose de fora, mas pode ser riquíssimo nos açúcares naturais da fruta ou leite.",
        "context": "Suco de uva 'sem adição de açúcar' pode conter até 20g de frutose e glicose natural por copo, exigindo cálculo para diabéticos.",
        "signStrategy": "Fruta naturalmente doce que não recebeu açúcar de mesa vs produto químico zero adoçado com sucralose.",
        "sign_strategy": "Fruta naturalmente doce que não recebeu açúcar de mesa vs produto químico zero adoçado com sucralose.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Açúcares",
          "Frutose Natural",
          "Rótulos"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-31",
        "term": "Sem lactose × baixo teor de lactose",
        "definition": "'Sem lactose' possui teor inferior a 100 mg/100g de produto. 'Baixo teor de lactose' contém entre 100 mg e 1 g de lactose/100g, tolerável para pessoas com intolerância leve a moderada.",
        "description": "'Sem lactose' possui teor inferior a 100 mg/100g de produto. 'Baixo teor de lactose' contém entre 100 mg e 1 g de lactose/100g, tolerável para pessoas com intolerância leve a moderada.",
        "context": "A rotulagem distingue os dois níveis para que pacientes com deficiência total de lactase não tenham sintomas acidentais.",
        "signStrategy": "Medidor de lactose: nível zero absoluto para pessoas sensíveis vs nível baixo tolerável para intolerância média.",
        "sign_strategy": "Medidor de lactose: nível zero absoluto para pessoas sensíveis vs nível baixo tolerável para intolerância média.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Lactose",
          "Regulamentação",
          "Laticínios"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-32",
        "term": "Integral × multigrãos",
        "definition": "'Integral' significa grão com todas as suas camadas anatômicas intactas. 'Multigrãos' significa apenas a presença de dois ou mais tipos de sementes misturadas, que podem ser todas refinadas e brancas.",
        "description": "'Integral' significa grão com todas as suas camadas anatômicas intactas. 'Multigrãos' significa apenas a presença de dois ou mais tipos de sementes misturadas, que podem ser todas refinadas e brancas.",
        "context": "Pão multigrãos comum pode ser feito com 95% de farinha branca e apenas grãos de linhaça decorativos na casca.",
        "signStrategy": "Grão com integridade e fibra profunda vs pão branco misturado com sementinhas sortidas de efeito estético.",
        "sign_strategy": "Grão com integridade e fibra profunda vs pão branco misturado com sementinhas sortidas de efeito estético.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Multigrãos",
          "Grão Integral",
          "Marketing"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-33",
        "term": "Natural × minimamente processado",
        "definition": "'Natural' é um termo frequentemente explorado pelo marketing comercial sem respaldo legal estrito. 'Minimamente processado' é termo técnico oficial para alimentos in natura que sofreram limpeza, corte, secagem ou pasteurização sem adição de substâncias.",
        "description": "'Natural' é um termo frequentemente explorado pelo marketing comercial sem respaldo legal estrito. 'Minimamente processado' é termo técnico oficial para alimentos in natura que sofreram limpeza, corte, secagem ou pasteurização sem adição de substâncias.",
        "context": "Cenoura ralada, feijão embalado e carnes congeladas são minimamente processados garantindo frescor e praticidade sem perder a pureza.",
        "signStrategy": "Alimento íntegro que foi apenas lavado, cortado e embalado a frio mantendo 100% de sua natureza viva.",
        "sign_strategy": "Alimento íntegro que foi apenas lavado, cortado e embalado a frio mantendo 100% de sua natureza viva.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Terminologia",
          "NOVA",
          "Guia Alimentar"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-34",
        "term": "Prazo de validade × data de fabricação",
        "definition": "Data de fabricação marca o dia inicial de envasamento na indústria. O prazo de validade marca a data limite final até a qual o fabricante garante inocuidade e qualidade sob as condições do rótulo.",
        "description": "Data de fabricação marca o dia inicial de envasamento na indústria. O prazo de validade marca a data limite final até a qual o fabricante garante inocuidade e qualidade sob as condições do rótulo.",
        "context": "O consumidor deve sempre verificar ambas as datas para avaliar o frescor e tempo de estoque do lote.",
        "signStrategy": "Ponto de partida no calendário (fabricação) vs ponto de chegada inultrapassável (fim da validade).",
        "sign_strategy": "Ponto de partida no calendário (fabricação) vs ponto de chegada inultrapassável (fim da validade).",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Prazos",
          "Calendário",
          "Segurança"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-35",
        "term": "Ingrediente × aditivo alimentar",
        "definition": "O ingrediente é qualquer substância alimentícia que compõe a base nutritiva e estrutural da receita. O aditivo não é consumido como alimento em si, mas adicionado com finalidade tecnológica acessória (cor, conservação, emulsão).",
        "description": "O ingrediente é qualquer substância alimentícia que compõe a base nutritiva e estrutural da receita. O aditivo não é consumido como alimento em si, mas adicionado com finalidade tecnológica acessória (cor, conservação, emulsão).",
        "context": "Farinha, ovos e leite são ingredientes; corante amarelo tartrazina e propionato de cálcio são aditivos tecnológicos.",
        "signStrategy": "Ingredientes principais do prato (comida real) vs aditivos em gotas químicas que garantem conservação na prateleira.",
        "sign_strategy": "Ingredientes principais do prato (comida real) vs aditivos em gotas químicas que garantem conservação na prateleira.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Aditivos",
          "Ingredientes",
          "Formulação"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-36",
        "term": "Alérgeno × intolerância",
        "definition": "O alérgeno desencadeia uma reação do sistema imunológico (mediada por IgE ou células), podendo causar anafilaxia fatal. A intolerância decorre de limitações digestivas/enzimáticas e não envolve anticorpos nem risco imediato de morte.",
        "description": "O alérgeno desencadeia uma reação do sistema imunológico (mediada por IgE ou células), podendo causar anafilaxia fatal. A intolerância decorre de limitações digestivas/enzimáticas e não envolve anticorpos nem risco imediato de morte.",
        "context": "Diferença vital: intolerante à lactose pode passar mal na digestão, mas alérgico à proteína do leite corre risco de asfixia imediata.",
        "signStrategy": "Mão 1: ALERGIA (anticorpos e garganta fechando, perigo de vida). Mão 2: INTOLERÂNCIA (estômago indigesto e gases, desconforto).",
        "sign_strategy": "Mão 1: ALERGIA (anticorpos e garganta fechando, perigo de vida). Mão 2: INTOLERÂNCIA (estômago indigesto e gases, desconforto).",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Distinção Clínica",
          "Segurança",
          "Alérgenos"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-37",
        "term": "Perigo × risco",
        "definition": "Perigo é a capacidade intrínseca de um agente biológico, químico ou físico causar dano. Risco é a probabilidade e magnitude real desse dano se concretizar em decorrência da exposição.",
        "description": "Perigo é a capacidade intrínseca de um agente biológico, químico ou físico causar dano. Risco é a probabilidade e magnitude real desse dano se concretizar em decorrência da exposição.",
        "context": "Uma bactéria na carne crua é um perigo; o risco de adoecer só existe se a carne for consumida crua ou mal cozida.",
        "signStrategy": "PERIGO: a fera enjaulada com dentes afiados. RISCO: abrir a jaula e se expor ao perigo.",
        "sign_strategy": "PERIGO: a fera enjaulada com dentes afiados. RISCO: abrir a jaula e se expor ao perigo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Conceitos Centrais",
          "Gestão de Risco",
          "Sanidade"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-38",
        "term": "Contaminação × deterioração",
        "definition": "A contaminação é a presença de patógenos ou toxinas que podem causar doenças mesmo sem alterar o cheiro ou aspecto do alimento. A deterioração é a alteração visível de cor, odor e textura que torna o alimento estragado sensorialmente.",
        "description": "A contaminação é a presença de patógenos ou toxinas que podem causar doenças mesmo sem alterar o cheiro ou aspecto do alimento. A deterioração é a alteração visível de cor, odor e textura que torna o alimento estragado sensorialmente.",
        "context": "Um alimento contaminado por Salmonella pode ter cheiro e sabor perfeitos, enquanto um queijo azedo deteriorado pode nem sempre causar infecção grave.",
        "signStrategy": "Alimento contaminado invisivelmente perigoso vs alimento com bolor verde e cheiro azedo evidente.",
        "sign_strategy": "Alimento contaminado invisivelmente perigoso vs alimento com bolor verde e cheiro azedo evidente.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Microbiologia",
          "Sensorial",
          "Segurança"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-39",
        "term": "Limpeza × sanitização",
        "definition": "Limpeza é a remoção mecânica e química de resíduos visíveis, gordura e poeira com água e sabão. Sanitização é a redução microscópica de bactérias e vírus a níveis seguros com agentes desinfetantes (cloro, álcool 70%).",
        "description": "Limpeza é a remoção mecânica e química de resíduos visíveis, gordura e poeira com água e sabão. Sanitização é a redução microscópica de bactérias e vírus a níveis seguros com agentes desinfetantes (cloro, álcool 70%).",
        "context": "Não é possível sanitizar superfícies sujas: qualquer matéria orgânica anula o efeito germicida do cloro.",
        "signStrategy": "Primeiro ato: ESFREGAR E TIRAR GORDURA (limpeza). Segundo ato: BORRIFAR SANITIZANTE PARA ELIMINAR GERMES (sanitização).",
        "sign_strategy": "Primeiro ato: ESFREGAR E TIRAR GORDURA (limpeza). Segundo ato: BORRIFAR SANITIZANTE PARA ELIMINAR GERMES (sanitização).",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Boas Práticas",
          "Higiene",
          "Dois Passos"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-40",
        "term": "Refrigeração × congelamento",
        "definition": "A refrigeração opera entre 0°C e 7°C, desacelerando o crescimento microbiano sem congelar a água interna. O congelamento atua abaixo de -18°C, solidificando a água e paralisando quase totalmente as reações biológicas.",
        "description": "A refrigeração opera entre 0°C e 7°C, desacelerando o crescimento microbiano sem congelar a água interna. O congelamento atua abaixo de -18°C, solidificando a água e paralisando quase totalmente as reações biológicas.",
        "context": "Alimentos refrigerados duram dias; congelados duram meses se a temperatura for preservada ininterruptamente.",
        "signStrategy": "GELADEIRA (frio suave que desacelera o relógio) vs CONGELADOR (frio extremo que congela e para o tempo).",
        "sign_strategy": "GELADEIRA (frio suave que desacelera o relógio) vs CONGELADOR (frio extremo que congela e para o tempo).",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Frio",
          "Termometria",
          "Conservação"
        ],
        "axis_id": 4
      },
      {
        "id": "term-crit-41",
        "term": "Qualidade × segurança",
        "definition": "A qualidade engloba características sensoriais subjetivas e comerciais (sabor, aroma, aparência bonita e maciez). A segurança dos alimentos (inocuidade) é um requisito objetivo inegociável de não causar doença ou dano à saúde.",
        "description": "A qualidade engloba características sensoriais subjetivas e comerciais (sabor, aroma, aparência bonita e maciez). A segurança dos alimentos (inocuidade) é um requisito objetivo inegociável de não causar doença ou dano à saúde.",
        "context": "Um prato pode ser saboroso e bonito (alta qualidade sensorial), mas estar contaminado por estafilococo (inseguro para consumo).",
        "signStrategy": "QUALIDADE: sabor gostoso e aparência linda no prato. SEGURANÇA: certeza científica de que não fará mal ao corpo humano.",
        "sign_strategy": "QUALIDADE: sabor gostoso e aparência linda no prato. SEGURANÇA: certeza científica de que não fará mal ao corpo humano.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Conceitos Chave",
          "Inocuidade",
          "Sensorial"
        ],
        "axis_id": 4
      }
    ]
  },
  {
    "id": "soberania-alimentar",
    "numericId": 5,
    "title": "Eixo 5 — Soberania Alimentar",
    "emoji": "🌽",
    "description": "Abordagem sistêmica de alimentação, território, agricultura familiar, acesso, sustentabilidade e direitos.",
    "terms": [
      {
        "id": "term-sob-1",
        "term": "Soberania alimentar",
        "definition": "Direito dos povos de definirem suas próprias políticas agrícolas, alimentares e nutricionais, com base na produção sustentável e autonomia comunitária.",
        "description": "Direito dos povos de definirem suas próprias políticas agrícolas, alimentares e nutricionais, com base na produção sustentável e autonomia comunitária.",
        "context": "Conceito criado pela Via Campesina que defende a soberania do país sobre o que planta e come, livre de imposições de monocultivos de multinacionais.",
        "signStrategy": "Sinal composto: POVO + ESCOLHER + PRÓPRIA COMIDA + INDEPENDÊNCIA POLÍTICA com expressão de autodeterminação.",
        "sign_strategy": "Sinal composto: POVO + ESCOLHER + PRÓPRIA COMIDA + INDEPENDÊNCIA POLÍTICA com expressão de autodeterminação.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Soberania",
          "Via Campesina",
          "Autonomia",
          "Políticas"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-2",
        "term": "Segurança alimentar e nutricional",
        "definition": "Realização do direito de todos ao acesso regular e permanente a alimentos de qualidade, em quantidade suficiente, sem comprometer outras necessidades essenciais e respeitando aspectos sociais, culturais, econômicos e ambientais.",
        "description": "Realização do direito de todos ao acesso regular e permanente a alimentos de qualidade, em quantidade suficiente, sem comprometer outras necessidades essenciais e respeitando aspectos sociais, culturais, econômicos e ambientais.",
        "context": "Artigo 3º da Lei Orgânica de Segurança Alimentar e Nutricional (LOSAN) do Brasil.",
        "signStrategy": "Sinal composto: DIREITO + COMIDA + SAUDÁVEL + POPULAÇÃO + SUSTENTÁVEL em espaço amplo.",
        "sign_strategy": "Sinal composto: DIREITO + COMIDA + SAUDÁVEL + POPULAÇÃO + SUSTENTÁVEL em espaço amplo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "LOSAN",
          "CONSEA",
          "Direito Universal"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-3",
        "term": "Direito Humano à Alimentação Adequada (DHAA)",
        "definition": "Direito fundamental inalienável de toda pessoa ter acesso contínuo e digno a alimentos saudáveis, culturalmente aceitáveis e livres de substâncias nocivas.",
        "description": "Direito fundamental inalienável de toda pessoa ter acesso contínuo e digno a alimentos saudáveis, culturalmente aceitáveis e livres de substâncias nocivas.",
        "context": "Consagrado no artigo 6º da Constituição Federal brasileira após intensa mobilização da sociedade civil.",
        "signStrategy": "Sinal de DIREITO NA CONSTITUIÇÃO + COMIDA DIGNA PARA TODAS AS PESSOAS.",
        "sign_strategy": "Sinal de DIREITO NA CONSTITUIÇÃO + COMIDA DIGNA PARA TODAS AS PESSOAS.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Constituição",
          "DHAA",
          "Cidadania"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-4",
        "term": "Alimentação adequada e saudável",
        "definition": "Prática alimentar apropriada aos aspectos biológicos e socioculturais dos indivíduos, baseada em alimentos in natura e minimamente processados de base sustentável.",
        "description": "Prática alimentar apropriada aos aspectos biológicos e socioculturais dos indivíduos, baseada em alimentos in natura e minimamente processados de base sustentável.",
        "context": "Conceito orientador do Guia Alimentar para a População Brasileira do Ministério da Saúde.",
        "signStrategy": "Prato colorido, variado e fresco com alimentos da terra respeitando a saúde e a cultura.",
        "sign_strategy": "Prato colorido, variado e fresco com alimentos da terra respeitando a saúde e a cultura.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Guia Alimentar",
          "Saúde Integral",
          "Prato Saudável"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-5",
        "term": "Direito à alimentação",
        "definition": "Prerrogativa jurídica de todo ser humano de não passar fome e poder produzir ou adquirir comida nutritiva com dignidade.",
        "description": "Prerrogativa jurídica de todo ser humano de não passar fome e poder produzir ou adquirir comida nutritiva com dignidade.",
        "context": "O Estado brasileiro tem o dever de proteger, promover e garantir esse direito através de políticas públicas estruturantes.",
        "signStrategy": "Mãos abertas recebendo e colhendo o alimento como garantia de vida e cidadania.",
        "sign_strategy": "Mãos abertas recebendo e colhendo o alimento como garantia de vida e cidadania.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Direitos Humanos",
          "Dignidade",
          "Estado"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-6",
        "term": "Agricultura familiar",
        "definition": "Forma de produção agropecuária gerida e trabalhada predominantemente pela própria família em seu estabelecimento rural.",
        "description": "Forma de produção agropecuária gerida e trabalhada predominantemente pela própria família em seu estabelecimento rural.",
        "context": "Responsável por mais de 70% dos alimentos frescos consumidos diariamente pelos brasileiros.",
        "signStrategy": "Família trabalhando unida na terra cultivando hortas e colhendo alimentos com carinho.",
        "sign_strategy": "Família trabalhando unida na terra cultivando hortas e colhendo alimentos com carinho.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Lei 11326",
          "Família Camponesa",
          "Base Produtiva"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-7",
        "term": "Agricultor familiar",
        "definition": "Trabalhador rural que pratica atividades produtivas com mão de obra primordialmente familiar em área de até quatro módulos fiscais.",
        "description": "Trabalhador rural que pratica atividades produtivas com mão de obra primordialmente familiar em área de até quatro módulos fiscais.",
        "context": "Guardião da sociobiodiversidade e motor econômico de municípios do interior e do semiárido.",
        "signStrategy": "Homem ou mulher do campo com chapéu de palha cuidando da enxada e da plantação com orgulho.",
        "sign_strategy": "Homem ou mulher do campo com chapéu de palha cuidando da enxada e da plantação com orgulho.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Homem do Campo",
          "Mulher Camponesa",
          "Identidade"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-8",
        "term": "Produção local",
        "definition": "Cultivo e elaboração de alimentos realizados no mesmo território ou município onde serão consumidos.",
        "description": "Cultivo e elaboração de alimentos realizados no mesmo território ou município onde serão consumidos.",
        "context": "Reduz despesas com frete, emissão de gases de efeito estufa e garante alimentos mais frescos na mesa.",
        "signStrategy": "Círculo desenhado ao redor da comunidade indicando que a comida é colhida e comida ali mesmo.",
        "sign_strategy": "Círculo desenhado ao redor da comunidade indicando que a comida é colhida e comida ali mesmo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Km Zero",
          "Comunidade",
          "Sustentabilidade"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-9",
        "term": "Produção artesanal",
        "definition": "Elaboração de alimentos em escala não industrial, com técnicas manuais herdadas e vínculos estreitos com a tradição local.",
        "description": "Elaboração de alimentos em escala não industrial, com técnicas manuais herdadas e vínculos estreitos com a tradição local.",
        "context": "Gera queijos artesanais, compotas, mel de abelhas nativas e farinhas de mandioca com sabor autêntico.",
        "signStrategy": "Mãos caprichosas modelando o alimento de forma única, com carinho e tradição.",
        "sign_strategy": "Mãos caprichosas modelando o alimento de forma única, com carinho e tradição.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Selo Arte",
          "Feito à Mão",
          "Tradição"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-10",
        "term": "Agroecologia",
        "definition": "Ciência e movimento social que aplica princípios ecológicos integrados à produção agropecuária, sem agrotóxicos e com justiça social.",
        "description": "Ciência e movimento social que aplica princípios ecológicos integrados à produção agropecuária, sem agrotóxicos e com justiça social.",
        "context": "Resgata a fertilidade natural da terra através de adubação verde, policultivos e consórcios florestais (agroflorestas).",
        "signStrategy": "Mãos em movimento circular unindo solo vivo, árvores, animais e camponeses em harmonia viva.",
        "sign_strategy": "Mãos em movimento circular unindo solo vivo, árvores, animais e camponeses em harmonia viva.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Agroecologia",
          "Equilíbrio",
          "Harmonia"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-11",
        "term": "Agricultura sustentável",
        "definition": "Sistema de cultivo que atende às necessidades alimentares da geração presente sem esgotar os recursos naturais para as gerações futuras.",
        "description": "Sistema de cultivo que atende às necessidades alimentares da geração presente sem esgotar os recursos naturais para as gerações futuras.",
        "context": "Protege nascentes, preserva a mata ciliar e evita a erosão e a contaminação por defensivos agrícolas sintéticos.",
        "signStrategy": "Planta brotando no solo fértil sustentada por mãos que protegem a água e o futuro.",
        "sign_strategy": "Planta brotando no solo fértil sustentada por mãos que protegem a água e o futuro.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Sustentabilidade",
          "Gerações Futuras",
          "Preservação"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-12",
        "term": "Produção orgânica",
        "definition": "Sistema produtivo que adota práticas que otimizam o uso dos recursos naturais e biológicos, proibindo o uso de agrotóxicos e adubos químicos solúveis.",
        "description": "Sistema produtivo que adota práticas que otimizam o uso dos recursos naturais e biológicos, proibindo o uso de agrotóxicos e adubos químicos solúveis.",
        "context": "Regulamentada pela Lei 10.831/2003 com auditoria externa ou Sistemas Participativos de Garantia (SPG).",
        "signStrategy": "Horta limpa sem veneno identificada com o selo verde do produto orgânico certificado.",
        "sign_strategy": "Horta limpa sem veneno identificada com o selo verde do produto orgânico certificado.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Lei 10831",
          "Orgânico",
          "Certificação"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-13",
        "term": "Alimento orgânico",
        "definition": "Produto vegetal ou animal obtido em sistema orgânico de produção, certificado e livre de resíduos tóxicos sintéticos.",
        "description": "Produto vegetal ou animal obtido em sistema orgânico de produção, certificado e livre de resíduos tóxicos sintéticos.",
        "context": "Alimento que respeita a fauna do solo e não expõe os produtores e consumidores a intoxicações por pesticidas.",
        "signStrategy": "Fruta ou hortaliça íntegra exibindo o selo oficial de garantia livre de agrotóxicos.",
        "sign_strategy": "Fruta ou hortaliça íntegra exibindo o selo oficial de garantia livre de agrotóxicos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Selo Orgânico",
          "Saúde Limpa",
          "Sem Veneno"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-14",
        "term": "Alimento agroecológico",
        "definition": "Alimento produzido sob as premissas integrais da agroecologia, articulando equilíbrio ambiental, trabalho solidário e soberania alimentar.",
        "description": "Alimento produzido sob as premissas integrais da agroecologia, articulando equilíbrio ambiental, trabalho solidário e soberania alimentar.",
        "context": "Vai além do orgânico comercial ao repudiar a monocultura orgânica e valorizar a igualdade de gênero e camponesa.",
        "signStrategy": "Comida viva da roça vinda de floresta consorciada com respeito aos trabalhadores.",
        "sign_strategy": "Comida viva da roça vinda de floresta consorciada com respeito aos trabalhadores.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Agroecológico",
          "Agrofloresta",
          "Justiça Social"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-15",
        "term": "Sistema alimentar",
        "definition": "Conjunto articulado de atores, recursos, atividades e fluxos que engloba produção, processamento, distribuição, preparo e consumo de alimentos.",
        "description": "Conjunto articulado de atores, recursos, atividades e fluxos que engloba produção, processamento, distribuição, preparo e consumo de alimentos.",
        "context": "Sofre pressões das mudanças climáticas, inflação de commodities e concentração de redes varejistas.",
        "signStrategy": "Grande engrenagem sistêmica conectando semente, roça, transporte, mercado, prato e saúde.",
        "sign_strategy": "Grande engrenagem sistêmica conectando semente, roça, transporte, mercado, prato e saúde.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Sistemas Alimentares",
          "Visão Holística",
          "Economia"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-16",
        "term": "Sistema alimentar sustentável",
        "definition": "Sistema que garante segurança alimentar e nutricional para todos de forma que as bases econômicas, sociais e ambientais não sejam degradadas.",
        "description": "Sistema que garante segurança alimentar e nutricional para todos de forma que as bases econômicas, sociais e ambientais não sejam degradadas.",
        "context": "Meta central dos Objetivos de Desenvolvimento Sustentável (ODS) da ONU até 2030.",
        "signStrategy": "Ciclo alimentar fechado onde os resíduos viram adubo e o ecossistema se regenera.",
        "sign_strategy": "Ciclo alimentar fechado onde os resíduos viram adubo e o ecossistema se regenera.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "ODS 2030",
          "Regeneração",
          "Futuro"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-17",
        "term": "Cadeia curta de comercialização",
        "definition": "Modelo de comercialização em que há no máximo um intermediário entre o produtor rural e o consumidor final.",
        "description": "Modelo de comercialização em que há no máximo um intermediário entre o produtor rural e o consumidor final.",
        "context": "Assegura que o valor pago pelo alimento fique nas mãos de quem realmente planta e cuida da terra.",
        "signStrategy": "Distância curta entre a mão do agricultor na horta e a mão do cliente na feira.",
        "sign_strategy": "Distância curta entre a mão do agricultor na horta e a mão do cliente na feira.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Cadeia Curta",
          "Sem Atravessador",
          "Preço Justo"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-18",
        "term": "Circuito curto",
        "definition": "Relação de troca e distribuição caracterizada pela proximidade geográfica e relacional entre agricultores e consumidores.",
        "description": "Relação de troca e distribuição caracterizada pela proximidade geográfica e relacional entre agricultores e consumidores.",
        "context": "Promove o diálogo, confiança mútua e resgate do valor humano no ato de se alimentar.",
        "signStrategy": "Ponte direta conectando o sítio da roça à cozinha urbana vizinha.",
        "sign_strategy": "Ponte direta conectando o sítio da roça à cozinha urbana vizinha.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Proximidade",
          "Confiança",
          "Relação Direta"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-19",
        "term": "Venda direta",
        "definition": "Transação comercial efetuada pelo próprio agricultor diretamente ao consumidor, sem nenhum atravessador.",
        "description": "Transação comercial efetuada pelo próprio agricultor diretamente ao consumidor, sem nenhum atravessador.",
        "context": "Praticada em bancas de feiras de rua, entregas de cestas a domicílio ou na porteira da propriedade.",
        "signStrategy": "Agricultor entregando a caixa de verduras diretamente nas mãos do comprador.",
        "sign_strategy": "Agricultor entregando a caixa de verduras diretamente nas mãos do comprador.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Cesta Agroecológica",
          "Sem Intermediários",
          "Economia"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-20",
        "term": "Feira livre",
        "definition": "Mercado público tradicional a céu aberto onde pequenos comerciantes e produtores comercializam gêneros alimentícios frescos periodicamente.",
        "description": "Mercado público tradicional a céu aberto onde pequenos comerciantes e produtores comercializam gêneros alimentícios frescos periodicamente.",
        "context": "Espaço histórico de convivência cultural, degustação de alimentos típicos e preços acessíveis.",
        "signStrategy": "Bancas coloridas com toldos na rua cheias de frutas e legumes e movimento do povo.",
        "sign_strategy": "Bancas coloridas com toldos na rua cheias de frutas e legumes e movimento do povo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Feira de Rua",
          "Cultura Popular",
          "Convívio"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-21",
        "term": "Feira da agricultura familiar",
        "definition": "Feira organizada exclusivamente por agricultores familiares e cooperativas para ofertar sua colheita local à população urbana.",
        "description": "Feira organizada exclusivamente por agricultores familiares e cooperativas para ofertar sua colheita local à população urbana.",
        "context": "Espaço de resistência e difusão de produtos agroecológicos, sementes crioulas e comidas regionais.",
        "signStrategy": "Produtores da roça vendendo seus produtos autênticos com o estandarte da agricultura familiar.",
        "sign_strategy": "Produtores da roça vendendo seus produtos autênticos com o estandarte da agricultura familiar.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Feira da Roça",
          "Agricultores",
          "Solidariedade"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-22",
        "term": "Mercado local",
        "definition": "Rede de estabelecimentos e feiras que viabiliza a circulação e consumo de bens e alimentos produzidos na própria comunidade ou região.",
        "description": "Rede de estabelecimentos e feiras que viabiliza a circulação e consumo de bens e alimentos produzidos na própria comunidade ou região.",
        "context": "Impulsiona a circulação do dinheiro dentro do município, gerando empregos e autonomia comunitária.",
        "signStrategy": "Comércio e trocas pulsando dentro da própria cidade sem depender de importações distantes.",
        "sign_strategy": "Comércio e trocas pulsando dentro da própria cidade sem depender de importações distantes.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Economia Local",
          "Município",
          "Autonomia"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-23",
        "term": "Cooperativa",
        "definition": "Sociedade autônoma de pessoas unidas voluntariamente para satisfazer suas aspirações econômicas e sociais comuns através de uma empresa gerida democraticamente.",
        "description": "Sociedade autônoma de pessoas unidas voluntariamente para satisfazer suas aspirações econômicas e sociais comuns através de uma empresa gerida democraticamente.",
        "context": "Permite que pequenos agricultores comprem insumos mais baratos e processem polpas e grãos em agroindústrias coletivas.",
        "signStrategy": "Mãos unidas em roda fechada de ajuda mútua com voto igual para cada associado.",
        "sign_strategy": "Mãos unidas em roda fechada de ajuda mútua com voto igual para cada associado.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Cooperativismo",
          "Gestão Coletiva",
          "Força Coletiva"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-24",
        "term": "Associação de produtores",
        "definition": "Organização civil sem fins lucrativos criada pela união de agricultores para defender seus direitos, obter crédito e organizar a produção.",
        "description": "Organização civil sem fins lucrativos criada pela união de agricultores para defender seus direitos, obter crédito e organizar a produção.",
        "context": "Fundamental para viabilizar projetos de saneamento rural, tratores comunitários e certificação orgânica participativa.",
        "signStrategy": "Grupo de produtores reunidos assinando estatuto de união para defesa dos seus sítios.",
        "sign_strategy": "Grupo de produtores reunidos assinando estatuto de união para defesa dos seus sítios.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Associativismo",
          "Comunidade Rural",
          "Organização"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-25",
        "term": "Economia solidária",
        "definition": "Forma de organização socioeconômica baseada na autogestão, na cooperação, na solidariedade e na justa distribuição dos resultados obtidos.",
        "description": "Forma de organização socioeconômica baseada na autogestão, na cooperação, na solidariedade e na justa distribuição dos resultados obtidos.",
        "context": "Repudia a exploração do trabalhador e orienta bancos comunitários, moedas sociais e redes agroecológicas.",
        "signStrategy": "Troca solidária de produtos e serviços onde a vida e o ser humano valem mais que o lucro.",
        "sign_strategy": "Troca solidária de produtos e serviços onde a vida e o ser humano valem mais que o lucro.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Autogestão",
          "Comércio Justo",
          "Solidariedade"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-26",
        "term": "Desenvolvimento territorial",
        "definition": "Processo de transformação socioeconômica que valoriza as potencialidades, identidades e vocações culturais e naturais de uma bacia ou região geográfica.",
        "description": "Processo de transformação socioeconômica que valoriza as potencialidades, identidades e vocações culturais e naturais de uma bacia ou região geográfica.",
        "context": "Orienta os Territórios da Cidadania e políticas de arranjos produtivos locais no meio rural.",
        "signStrategy": "Mapa do território geográfico florescendo com estradas, escolas rurais e produção integrada.",
        "sign_strategy": "Mapa do território geográfico florescendo com estradas, escolas rurais e produção integrada.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Território",
          "Planejamento Regional",
          "Inclusão"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-27",
        "term": "Território",
        "definition": "Espaço geográfico construído pelas relações sociais, culturais, econômicas e de poder de uma comunidade ao longo da história.",
        "description": "Espaço geográfico construído pelas relações sociais, culturais, econômicas e de poder de uma comunidade ao longo da história.",
        "context": "Não é mera extensão de terra física; envolve pertencimento, memórias afetivas e saberes camponeses.",
        "signStrategy": "Mãos delimitando o chão vivo habitado pela comunidade com raízes profundas na paisagem.",
        "sign_strategy": "Mãos delimitando o chão vivo habitado pela comunidade com raízes profundas na paisagem.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Espaço Social",
          "Identidade",
          "Geografia"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-28",
        "term": "Territorialidade",
        "definition": "Sentimento de pertencimento e vínculo imaterial que os indivíduos e grupos estabelecem com sua terra e recursos comunitários.",
        "description": "Sentimento de pertencimento e vínculo imaterial que os indivíduos e grupos estabelecem com sua terra e recursos comunitários.",
        "context": "Vital para comunidades quilombolas, indígenas e ribeirinhas defenderem suas terras ancestrais.",
        "signStrategy": "Coração ligado por fios afetivos invisíveis ao solo sagrado da comunidade de origem.",
        "sign_strategy": "Coração ligado por fios afetivos invisíveis ao solo sagrado da comunidade de origem.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Pertencimento",
          "Comunidades Tradicionais",
          "Vínculo"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-29",
        "term": "Cultura alimentar",
        "definition": "Conjunto de tradições, crenças, saberes, modos de fazer e significados atribuídos aos alimentos por determinado grupo social.",
        "description": "Conjunto de tradições, crenças, saberes, modos de fazer e significados atribuídos aos alimentos por determinado grupo social.",
        "context": "Explica por que o cuscuz de milho ou a moqueca têm valor afetivo e identitário profundo no Nordeste brasileiro.",
        "signStrategy": "Mãos cozinhando receitas ancestrais de família passadas com carinho de avós para netos.",
        "sign_strategy": "Mãos cozinhando receitas ancestrais de família passadas com carinho de avós para netos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Tradição Culinária",
          "Identidade",
          "Afeto"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-30",
        "term": "Patrimônio alimentar",
        "definition": "Bens materiais e imateriais ligados à alimentação que expressam a identidade e história de um povo, merecendo salvaguarda pública.",
        "description": "Bens materiais e imateriais ligados à alimentação que expressam a identidade e história de um povo, merecendo salvaguarda pública.",
        "context": "O Ofício das Baianas de Acarajé e o Modo Artesanal de Fazer Queijo de Minas são patrimônios tombados pelo Iphan.",
        "signStrategy": "Livro de ouro ou monumento protegendo receitas e saberes culinários históricos da nação.",
        "sign_strategy": "Livro de ouro ou monumento protegendo receitas e saberes culinários históricos da nação.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Iphan",
          "Salvaguarda",
          "Herança Cultural"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-31",
        "term": "Tradição alimentar",
        "definition": "Práticas de culinária e comensalidade preservadas e transmitidas oralmente e na prática entre sucessivas gerações familiares.",
        "description": "Práticas de culinária e comensalidade preservadas e transmitidas oralmente e na prática entre sucessivas gerações familiares.",
        "context": "Mantém viva a memória dos povos contra a homogeneização forçada dos cardápios ultraprocessados globais.",
        "signStrategy": "Fogueira de saberes ancestrais alimentando a panela de barro de geração em geração.",
        "sign_strategy": "Fogueira de saberes ancestrais alimentando a panela de barro de geração em geração.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Memória",
          "Comensalidade",
          "Raízes"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-32",
        "term": "Comida de verdade",
        "definition": "Alimento fresco, natural, minimamente processado e culturalmente referenciado, sem aditivos químicos ou maquiagem industrial.",
        "description": "Alimento fresco, natural, minimamente processado e culturalmente referenciado, sem aditivos químicos ou maquiagem industrial.",
        "context": "Bandeira nacional das Conferências de Segurança Alimentar: 'Comida de verdade no campo e na cidade'.",
        "signStrategy": "Mãos segurando feijão, arroz, mandioca e couve fresca com sinal enérgico de COMIDA PURA E GENUÍNA.",
        "sign_strategy": "Mãos segurando feijão, arroz, mandioca e couve fresca com sinal enérgico de COMIDA PURA E GENUÍNA.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Comida de Verdade",
          "In Natura",
          "Manifesto"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-33",
        "term": "Biodiversidade alimentar",
        "definition": "Variedade de plantas, animais e fungos utilizados na alimentação humana, abrangendo diversidade genética, de espécies e ecossistemas.",
        "description": "Variedade de plantas, animais e fungos utilizados na alimentação humana, abrangendo diversidade genética, de espécies e ecossistemas.",
        "context": "Fundamental para assegurar micronutrientes e resiliência diante de secas e pragas agrícolas.",
        "signStrategy": "Mãos espalhando dezenas de sementes, raízes e frutos com grande diversidade visual.",
        "sign_strategy": "Mãos espalhando dezenas de sementes, raízes e frutos com grande diversidade visual.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Variedade",
          "Ecologia",
          "Riqueza Biológica"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-34",
        "term": "Sociobiodiversidade",
        "definition": "Inter-relação entre a diversidade biológica e os saberes tradicionais das comunidades camponesas e povos tradicionais que a manejam.",
        "description": "Inter-relação entre a diversidade biológica e os saberes tradicionais das comunidades camponesas e povos tradicionais que a manejam.",
        "context": "Produtos como baru, castanha-do-pará, babaçu e umbu geram renda sustentável sem derrubar a floresta em pé.",
        "signStrategy": "Povo tradicional de mãos dadas colhendo frutos silvestres na floresta sem desmatar.",
        "sign_strategy": "Povo tradicional de mãos dadas colhendo frutos silvestres na floresta sem desmatar.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Povos da Floresta",
          "Extrativismo Sustentável",
          "Cerrado/Caatinga"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-35",
        "term": "Alimentos regionais",
        "definition": "Espécies vegetais e animais autóctones ou adaptadas que caracterizam a culinária e produção de determinada região do país.",
        "description": "Espécies vegetais e animais autóctones ou adaptadas que caracterizam a culinária e produção de determinada região do país.",
        "context": "Valorizados no livro 'Alimentos Regionais Brasileiros' do Ministério da Saúde para enriquecer o prato diário.",
        "signStrategy": "Frutos e raízes típicos de cada bioma (pequi no Cerrado, açaí no Norte, pinhão no Sul) servidos à mesa.",
        "sign_strategy": "Frutos e raízes típicos de cada bioma (pequi no Cerrado, açaí no Norte, pinhão no Sul) servidos à mesa.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Biomas",
          "Frutas Nativas",
          "Ministério da Saúde"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-36",
        "term": "Plantas Alimentícias Não Convencionais (PANC)",
        "definition": "Espécies vegetais comestíveis espontâneas ou cultivadas que não fazem parte do circuito hegemônico de comercialização hortícola.",
        "description": "Espécies vegetais comestíveis espontâneas ou cultivadas que não fazem parte do circuito hegemônico de comercialização hortícola.",
        "context": "Ora-pro-nóbis, taioba, beldroega e bertalha: ricas em ferro e proteínas e adaptadas a solos rústicos sem insumos caros.",
        "signStrategy": "Datilologia P-A-N-C com colheita de folhas ricas em nutrientes que nascem espontaneamente no quintal.",
        "sign_strategy": "Datilologia P-A-N-C com colheita de folhas ricas em nutrientes que nascem espontaneamente no quintal.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "PANC",
          "Ora-pro-nóbis",
          "Nutrição Rústica"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-37",
        "term": "Sementes crioulas",
        "definition": "Variedades de sementes tradicionais selecionadas, adaptadas e conservadas por agricultores familiares por várias gerações sem manipulação transgênica.",
        "description": "Variedades de sementes tradicionais selecionadas, adaptadas e conservadas por agricultores familiares por várias gerações sem manipulação transgênica.",
        "context": "Asseguram autonomia genética para o camponês não ter que comprar sementes híbridas estéreis a cada safra.",
        "signStrategy": "Mãos em concha cuidando com veneração de sementes nativas de milho e feijão resistentes à seca.",
        "sign_strategy": "Mãos em concha cuidando com veneração de sementes nativas de milho e feijão resistentes à seca.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Sementes da Paixão",
          "Autonomia",
          "Guardiões da Agrobiodiversidade"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-38",
        "term": "Quintal produtivo",
        "definition": "Espaço contíguo à moradia rural ou periurbana destinado ao plantio diversificado de árvores frutíferas, hortas, ervas medicinais e pequenos animais.",
        "description": "Espaço contíguo à moradia rural ou periurbana destinado ao plantio diversificado de árvores frutíferas, hortas, ervas medicinais e pequenos animais.",
        "context": "Geralmente gerido pelas mulheres rurais, fornecendo temperos e comida fresca todos os dias para a família.",
        "signStrategy": "Área ao redor da casa com galinhas, árvores de goiaba e canteiros de couve colhidos diariamente.",
        "sign_strategy": "Área ao redor da casa com galinhas, árvores de goiaba e canteiros de couve colhidos diariamente.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Mulheres Rurais",
          "Autoconsumo",
          "Quintais"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-39",
        "term": "Horta comunitária",
        "definition": "Área de cultivo coletivo de hortaliças gerida em conjunto por moradores de um bairro, escola ou assentamento.",
        "description": "Área de cultivo coletivo de hortaliças gerida em conjunto por moradores de um bairro, escola ou assentamento.",
        "context": "Favorece a integração comunitária, educa crianças para a alimentação saudável e barateia o custo de vida.",
        "signStrategy": "Vizinhos cavando e regando juntos canteiros de alface e cheiro-verde compartilhando a colheita.",
        "sign_strategy": "Vizinhos cavando e regando juntos canteiros de alface e cheiro-verde compartilhando a colheita.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Canteiro Coletivo",
          "Comunidade Urbana",
          "Hortas"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-40",
        "term": "Produção para autoconsumo",
        "definition": "Parcela da produção agrícola familiar destinada diretamente à subsistência e consumo alimentar da própria família trabalhadora.",
        "description": "Parcela da produção agrícola familiar destinada diretamente à subsistência e consumo alimentar da própria família trabalhadora.",
        "context": "Primeira linha de defesa contra a fome no meio rural, garantindo que o camponês se alimente bem antes de vender o excedente.",
        "signStrategy": "Colher a espiga de milho e colocá-la na panela para os próprios filhos comerem na mesa da casa.",
        "sign_strategy": "Colher a espiga de milho e colocá-la na panela para os próprios filhos comerem na mesa da casa.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Subsistência",
          "Mesa Camponesa",
          "Autonomia"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-41",
        "term": "Autoconsumo",
        "definition": "Ato de consumir os alimentos gerados pelo próprio trabalho produtivo na propriedade ou comunidade.",
        "description": "Ato de consumir os alimentos gerados pelo próprio trabalho produtivo na propriedade ou comunidade.",
        "context": "Gera economia financeira doméstica e segurança alimentar direta com produtos livres de veneno.",
        "signStrategy": "Comida saindo da própria terra diretamente para a nutrição da família.",
        "sign_strategy": "Comida saindo da própria terra diretamente para a nutrição da família.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Sítio",
          "Economia Doméstica",
          "Frescor"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-42",
        "term": "Abastecimento alimentar",
        "definition": "Conjunto de ações, estoques logísticos e infraestrutura pública destinados a assegurar o fornecimento regular e contínuo de alimentos à sociedade.",
        "description": "Conjunto de ações, estoques logísticos e infraestrutura pública destinados a assegurar o fornecimento regular e contínuo de alimentos à sociedade.",
        "context": "Atuação central das Centrais de Abastecimento (CEASAs) e Companhia Nacional de Abastecimento (CONAB).",
        "signStrategy": "Rede logística de galpões e caminhões distribuindo comida para feiras e supermercados de todas as cidades.",
        "sign_strategy": "Rede logística de galpões e caminhões distribuindo comida para feiras e supermercados de todas as cidades.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "CEASA",
          "Logística Pública",
          "Segurança"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-43",
        "term": "Acesso aos alimentos",
        "definition": "Capacidade física, econômica e jurídica das famílias adquirirem ou produzirem os alimentos necessários para uma vida ativa e saudável.",
        "description": "Capacidade física, econômica e jurídica das famílias adquirirem ou produzirem os alimentos necessários para uma vida ativa e saudável.",
        "context": "Pode ser comprometido pelo desemprego, salários baixos, inflação de alimentos ou falta de transporte.",
        "signStrategy": "Mão com dinheiro ou direito conseguindo alcançar e trazer a comida para dentro de casa.",
        "sign_strategy": "Mão com dinheiro ou direito conseguindo alcançar e trazer a comida para dentro de casa.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Poder de Compra",
          "Acessibilidade",
          "Justiça"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-44",
        "term": "Disponibilidade de alimentos",
        "definition": "Presença física de alimentos em quantidade e qualidade adequadas em todo o território nacional, decorrente da produção interna e estoques.",
        "description": "Presença física de alimentos em quantidade e qualidade adequadas em todo o território nacional, decorrente da produção interna e estoques.",
        "context": "Exige equilíbrio entre culturas alimentares básicas (arroz, feijão, mandioca) e commodities de exportação (soja e cana).",
        "signStrategy": "Prateleiras e armazéns cheios de grãos suficientes para abastecer toda a população do país.",
        "sign_strategy": "Prateleiras e armazéns cheios de grãos suficientes para abastecer toda a população do país.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Safra",
          "Estoque de Grãos",
          "Abastecimento"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-45",
        "term": "Deserto alimentar",
        "definition": "Área geográfica (geralmente periferia urbana ou área rural isolada) onde o acesso a alimentos frescos e in natura é praticamente inexistente, predominando ultraprocessados.",
        "description": "Área geográfica (geralmente periferia urbana ou área rural isolada) onde o acesso a alimentos frescos e in natura é praticamente inexistente, predominando ultraprocessados.",
        "context": "Locais onde só existem pequenos comércios vendendo salgadinhos, biscoitos e refrigerantes, sem feiras de legumes.",
        "signStrategy": "Bairro árido sem nenhuma barraca de fruta fresca, cercado apenas por vendas de pacotes industriais.",
        "sign_strategy": "Bairro árido sem nenhuma barraca de fruta fresca, cercado apenas por vendas de pacotes industriais.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Periferia",
          "Desigualdade",
          "Acesso"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-46",
        "term": "Ambiente alimentar",
        "definition": "Contexto físico, socioeconômico e cultural que molda as oportunidades e escolhas alimentares das pessoas nos locais onde vivem e trabalham.",
        "description": "Contexto físico, socioeconômico e cultural que molda as oportunidades e escolhas alimentares das pessoas nos locais onde vivem e trabalham.",
        "context": "Inclui a publicidade em pontos de venda, preços relativos de frutas versus refrigerantes e presença de cantinas escolares.",
        "signStrategy": "Espaço urbano ao redor da pessoa com vitrines e estímulos que influenciam o que ela compra e come.",
        "sign_strategy": "Espaço urbano ao redor da pessoa com vitrines e estímulos que influenciam o que ela compra e come.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Cenário Urbano",
          "Marketing",
          "Escolhas"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-47",
        "term": "Insegurança alimentar",
        "definition": "Situação em que a pessoa ou família não possui acesso físico ou econômico regular e permanente a alimentos em quantidade e qualidade suficientes.",
        "description": "Situação em que a pessoa ou família não possui acesso físico ou econômico regular e permanente a alimentos em quantidade e qualidade suficientes.",
        "context": "Classificada pela Escala Brasileira de Insegurança Alimentar (EBIA) em leve, moderada ou grave.",
        "signStrategy": "Armário e geladeira esvaziando com angústia de não saber se haverá almoço no dia seguinte.",
        "sign_strategy": "Armário e geladeira esvaziando com angústia de não saber se haverá almoço no dia seguinte.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "EBIA",
          "Vulnerabilidade",
          "Falta de Comida"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-48",
        "term": "Fome",
        "definition": "Sensação física dolorosa decorrente da privação severa de alimentos; estágio extremo da insegurança alimentar crônica.",
        "description": "Sensação física dolorosa decorrente da privação severa de alimentos; estágio extremo da insegurança alimentar crônica.",
        "context": "Flagelo social inaceitável combatido por programas de transferência de renda e cozinhas solidárias emergenciais.",
        "signStrategy": "Mão pressionando o estômago vazio com expressão facial de fraqueza e dor existencial profunda.",
        "sign_strategy": "Mão pressionando o estômago vazio com expressão facial de fraqueza e dor existencial profunda.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Pobreza Extrema",
          "Emergência",
          "Dignidade Humana"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-49",
        "term": "Má nutrição",
        "definition": "Condição clínica decorrente de deficiências, excessos ou desequilíbrios na ingestão calórica e de nutrientes essenciais.",
        "description": "Condição clínica decorrente de deficiências, excessos ou desequilíbrios na ingestão calórica e de nutrientes essenciais.",
        "context": "Engloba tanto a desnutrição e carências vitamínicas quanto o sobrepeso e a obesidade causada por dietas ultraprocessadas.",
        "signStrategy": "Corpo sofrendo com alimentação desequilibrada: magreza extrema ou obesidade doentia.",
        "sign_strategy": "Corpo sofrendo com alimentação desequilibrada: magreza extrema ou obesidade doentia.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Desequilíbrio",
          "Sobrepeso",
          "Carências"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-50",
        "term": "Desnutrição",
        "definition": "Estado patológico decorrente do consumo insuficiente crônico de energia e proteínas, resultando em perda de peso e atrofia corporal.",
        "description": "Estado patológico decorrente do consumo insuficiente crônico de energia e proteínas, resultando em perda de peso e atrofia corporal.",
        "context": "Causa atraso no desenvolvimento neuropsicomotor de crianças e debilita o sistema imunológico.",
        "signStrategy": "Corpo enfraquecido e emagrecido por falta prolongada de comida e nutrientes vitais.",
        "sign_strategy": "Corpo enfraquecido e emagrecido por falta prolongada de comida e nutrientes vitais.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Subnutrição",
          "Infância",
          "Saúde Pública"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-51",
        "term": "Desperdício de alimentos",
        "definition": "Descarte de alimentos próprios para consumo humano em estabelecimentos comerciais, serviços de refeição e residências.",
        "description": "Descarte de alimentos próprios para consumo humano em estabelecimentos comerciais, serviços de refeição e residências.",
        "context": "Combate-se com planejamento de cardápio, doação de excedentes de supermercados e compostagem de sobras.",
        "signStrategy": "Expressão de pesar com sinal de COMIDA BOA JOGADA FORA / NO LIXO desnecessariamente.",
        "sign_strategy": "Expressão de pesar com sinal de COMIDA BOA JOGADA FORA / NO LIXO desnecessariamente.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Desperdício",
          "Perdas",
          "Sustentabilidade"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-52",
        "term": "Perda de alimentos",
        "definition": "Redução na massa ou qualidade dos alimentos comestíveis que ocorre nas etapas iniciais de colheita, armazenamento e transporte no campo.",
        "description": "Redução na massa ou qualidade dos alimentos comestíveis que ocorre nas etapas iniciais de colheita, armazenamento e transporte no campo.",
        "context": "Ocorre devido a estradas rurais precárias, falta de caminhões refrigerados ou caixas inadequadas de colheita.",
        "signStrategy": "Tomates e frutas caindo e amassando no caminhão rural estragando antes de chegar à feira.",
        "sign_strategy": "Tomates e frutas caindo e amassando no caminhão rural estragando antes de chegar à feira.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Pós-Colheita",
          "Logística Rural",
          "Perdas"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-53",
        "term": "Aproveitamento integral dos alimentos",
        "definition": "Técnica culinária e prática sustentável de utilizar cascas, sementes, talos, folhas e polpas no preparo das refeições diárias.",
        "description": "Técnica culinária e prática sustentável de utilizar cascas, sementes, talos, folhas e polpas no preparo das refeições diárias.",
        "context": "Farofa de casca de banana, suco de entrecasca de melancia e refogado de talos de couve enriquecem o cardápio e economizam.",
        "signStrategy": "Mão utilizando 100% do legume ou fruta, transformando cascas e folhas em pratos nutritivos.",
        "sign_strategy": "Mão utilizando 100% do legume ou fruta, transformando cascas e folhas em pratos nutritivos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Zero Resíduo",
          "Talos e Cascas",
          "Culinária Inteligente"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-54",
        "term": "Sustentabilidade",
        "definition": "Capacidade de manter processos biológicos, sociais e econômicos ativos no longo prazo sem esgotar o meio ambiente.",
        "description": "Capacidade de manter processos biológicos, sociais e econômicos ativos no longo prazo sem esgotar o meio ambiente.",
        "context": "Pilares inseparáveis: ambientalmente correto, socialmente justo e economicamente viável.",
        "signStrategy": "Três pilares equilibrados sustentando a vida na Terra com as mãos em harmonia duradoura.",
        "sign_strategy": "Três pilares equilibrados sustentando a vida na Terra com as mãos em harmonia duradoura.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Tripé",
          "Ecologia",
          "Equilíbrio"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-55",
        "term": "Consumo consciente",
        "definition": "Ato de escolher produtos levando em consideração os impactos ambientais, sociais e éticos da sua produção e descarte.",
        "description": "Ato de escolher produtos levando em consideração os impactos ambientais, sociais e éticos da sua produção e descarte.",
        "context": "Privilegia produtores locais agroecológicos, evita excesso de embalagens plásticas e repudia exploração de trabalhadores.",
        "signStrategy": "Consumidor pensando criticamente antes de comprar: DE ONDE VEM? COMO FOI PRODUZIDO?",
        "sign_strategy": "Consumidor pensando criticamente antes de comprar: DE ONDE VEM? COMO FOI PRODUZIDO?",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Cidadania",
          "Ética",
          "Consumo"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-56",
        "term": "Educação alimentar e nutricional",
        "definition": "Campo de conhecimento e prática contínua que visa promover a autonomia voluntária de hábitos alimentares saudáveis na população.",
        "description": "Campo de conhecimento e prática contínua que visa promover a autonomia voluntária de hábitos alimentares saudáveis na população.",
        "context": "Desenvolvida em escolas públicas através de oficinas lúdicas, hortas pedagógicas e aulas de cozinha básica.",
        "signStrategy": "Professor ensinando crianças a reconhecer e amar legumes frescos na sala de aula.",
        "sign_strategy": "Professor ensinando crianças a reconhecer e amar legumes frescos na sala de aula.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "EAN",
          "Escola",
          "Pedagogia"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-57",
        "term": "Política de segurança alimentar",
        "definition": "Conjunto de leis, diretrizes e programas estatais articulados para garantir a realização do direito humano à alimentação adequada.",
        "description": "Conjunto de leis, diretrizes e programas estatais articulados para garantir a realização do direito humano à alimentação adequada.",
        "context": "Coordenada pelo Sistema Nacional de Segurança Alimentar e Nutricional (SISAN) de forma intersetorial.",
        "signStrategy": "Governo e sociedade civil juntos aprovando planos e leis para garantir comida no prato de todos.",
        "sign_strategy": "Governo e sociedade civil juntos aprovando planos e leis para garantir comida no prato de todos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "SISAN",
          "Políticas Públicas",
          "Estado"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-58",
        "term": "Programa de Aquisição de Alimentos (PAA)",
        "definition": "Programa federal que compra alimentos diretamente da agricultura familiar sem licitação e os destina a entidades socioassistenciais.",
        "description": "Programa federal que compra alimentos diretamente da agricultura familiar sem licitação e os destina a entidades socioassistenciais.",
        "context": "Cria mercado garantido para o pequeno agricultor e abastece creches, asilos e restaurantes comunitários.",
        "signStrategy": "Datilologia P-A-A com caminhão comprando da roça familiar e doando para refeitório comunitário.",
        "sign_strategy": "Datilologia P-A-A com caminhão comprando da roça familiar e doando para refeitório comunitário.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "PAA",
          "MDS",
          "Agricultura Familiar"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-59",
        "term": "Programa Nacional de Alimentação Escolar (PNAE)",
        "definition": "Política pública que garante refeições saudáveis aos estudantes de escolas públicas, exigindo no mínimo 30% de compras da agricultura familiar.",
        "description": "Política pública que garante refeições saudáveis aos estudantes de escolas públicas, exigindo no mínimo 30% de compras da agricultura familiar.",
        "context": "Um dos maiores programas mundiais de alimentação escolar, dinamizando economias rurais municipais.",
        "signStrategy": "Datilologia P-N-A-E com crianças na escola comendo refeição farta com verduras da roça local.",
        "sign_strategy": "Datilologia P-N-A-E com crianças na escola comendo refeição farta com verduras da roça local.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "PNAE",
          "Merenda Escolar",
          "30% Agricultura Familiar"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-60",
        "term": "Compra institucional",
        "definition": "Modalidade de aquisição pública direta em que hospitais, quartéis, presídios e universidades compram alimentos de cooperativas familiares.",
        "description": "Modalidade de aquisição pública direta em que hospitais, quartéis, presídios e universidades compram alimentos de cooperativas familiares.",
        "context": "Prevista pelo Decreto Federal 8.473/2015 para estimular circuitos locais de abastecimento.",
        "signStrategy": "Entidade pública assinando contrato formal de compra com associação de camponeses locais.",
        "sign_strategy": "Entidade pública assinando contrato formal de compra com associação de camponeses locais.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Compras Públicas",
          "Instituições",
          "Estímulo"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-61",
        "term": "CONAB",
        "definition": "Companhia Nacional de Abastecimento, empresa pública vinculada ao MDA responsável por gerir políticas de estoques e preços agrícolas no Brasil.",
        "description": "Companhia Nacional de Abastecimento, empresa pública vinculada ao MDA responsável por gerir políticas de estoques e preços agrícolas no Brasil.",
        "context": "Calcula custos de safra, opera armazéns públicos e executa o PAA e a Política de Garantia de Preços Mínimos (PGPM).",
        "signStrategy": "Datilologia C-O-N-A-B com sinal de ARMAZÉNS ELEGANTES DE GRÃOS E ESTOQUE PÚBLICO.",
        "sign_strategy": "Datilologia C-O-N-A-B com sinal de ARMAZÉNS ELEGANTES DE GRÃOS E ESTOQUE PÚBLICO.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "CONAB",
          "MDA",
          "Estoques Reguladores"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-62",
        "term": "Estoque público",
        "definition": "Reserva física estratégica de grãos e alimentos mantida pelo Estado para conter altas abusivas de preços e socorrer emergências de seca.",
        "description": "Reserva física estratégica de grãos e alimentos mantida pelo Estado para conter altas abusivas de preços e socorrer emergências de seca.",
        "context": "Fundamental para assegurar que a população pobre não fique à mercê da especulação financeira internacional de alimentos.",
        "signStrategy": "Grandes silos do governo cheios de feijão e milho guardados para socorrer o povo nas crises.",
        "sign_strategy": "Grandes silos do governo cheios de feijão e milho guardados para socorrer o povo nas crises.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Silos",
          "Segurança Nacional",
          "Estoque Regulador"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-63",
        "term": "Comercialização",
        "definition": "Conjunto de operações de troca e negociação que coloca o produto agropecuário no mercado consumidor a preço monetário.",
        "description": "Conjunto de operações de troca e negociação que coloca o produto agropecuário no mercado consumidor a preço monetário.",
        "context": "Pode ser convencional através de atacadistas ou cooperativa e solidária através de feiras e redes.",
        "signStrategy": "Sinal de VENDER E TROCAR produtos da roça gerando circulação de valor.",
        "sign_strategy": "Sinal de VENDER E TROCAR produtos da roça gerando circulação de valor.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Mercado",
          "Vendas",
          "Economia"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-64",
        "term": "Preço justo",
        "definition": "Remuneração financeira que cobre os custos reais de produção sustentável, remunera condignamente a família rural e é acessível ao consumidor.",
        "description": "Remuneração financeira que cobre os custos reais de produção sustentável, remunera condignamente a família rural e é acessível ao consumidor.",
        "context": "Pilar central do comércio justo (Fair Trade) e dos circuitos agroecológicos solidários.",
        "signStrategy": "Balança equilibrada mostrando valor justo pago ao camponês e preço honesto para quem compra.",
        "sign_strategy": "Balança equilibrada mostrando valor justo pago ao camponês e preço honesto para quem compra.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Fair Trade",
          "Comércio Justo",
          "Equidade"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-65",
        "term": "Renda do produtor",
        "definition": "Retorno monetário líquido obtido pelo agricultor com a venda de sua safra após descontados todos os custos de insumos.",
        "description": "Retorno monetário líquido obtido pelo agricultor com a venda de sua safra após descontados todos os custos de insumos.",
        "context": "Garante a permanência digna da juventude rural no campo evitando o êxodo rural desordenado para as favelas.",
        "signStrategy": "Dinheiro fruto do trabalho suado da roça entrando e assegurando a vida e os estudos da família camponesa.",
        "sign_strategy": "Dinheiro fruto do trabalho suado da roça entrando e assegurando a vida e os estudos da família camponesa.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Juventude Rural",
          "Permanência no Campo",
          "Renda"
        ],
        "axis_id": 5
      },
      {
        "id": "term-sob-66",
        "term": "Circuito de abastecimento",
        "definition": "Rede territorial estruturada que conecta pontos de colheita, centros de distribuição e pontos finais de venda garantindo comida constante.",
        "description": "Rede territorial estruturada que conecta pontos de colheita, centros de distribuição e pontos finais de venda garantindo comida constante.",
        "context": "Quando fortalecido regionalmente, assegura soberania alimentar mesmo durante greves de transportes ou crises de combustíveis.",
        "signStrategy": "Fluxo contínuo em circuito fechado levando a produção do campo para todas as mesas da região.",
        "sign_strategy": "Fluxo contínuo em circuito fechado levando a produção do campo para todas as mesas da região.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Rede de Distribuição",
          "Segurança Regional",
          "Fluxo"
        ],
        "axis_id": 5
      }
    ]
  },
  {
    "id": "producao-campo",
    "numericId": 6,
    "title": "Eixo 6 — Produção e Segurança no Campo",
    "emoji": "🌱",
    "description": "Boas práticas agrícolas, manejo pós-colheita, água limpa, rastreabilidade e segurança alimentar na produção primária rural.",
    "terms": [
      {
        "id": "term-campo-1",
        "term": "Água de irrigação",
        "definition": "Água captada de poços, rios, açudes ou cisternas utilizada na rega das lavouras, que deve atender a padrões sanitários para não contaminar os alimentos.",
        "description": "Água captada de poços, rios, açudes ou cisternas utilizada na rega das lavouras, que deve atender a padrões sanitários para não contaminar os alimentos.",
        "context": "O uso de água de rio contaminada por esgoto doméstico a montante é a principal via de contaminação de alfaces e morangos por coliformes e giárdia.",
        "signStrategy": "Sinal de ÁGUA sendo aspergida ou gotejada sobre os canteiros da lavoura, com sinal de teste de pureza.",
        "sign_strategy": "Sinal de ÁGUA sendo aspergida ou gotejada sobre os canteiros da lavoura, com sinal de teste de pureza.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Irrigação",
          "Sanidade da Água",
          "Hortaliças",
          "BPA"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-2",
        "term": "Água potável",
        "definition": "Água tratada ou de fonte segura cujos parâmetros bacteriológicos e físico-químicos não oferecem risco à saúde humana.",
        "description": "Água tratada ou de fonte segura cujos parâmetros bacteriológicos e físico-químicos não oferecem risco à saúde humana.",
        "context": "Indispensável na lavagem pós-colheita de hortaliças, higienização das mãos dos colhedores e preparo de caldas naturais.",
        "signStrategy": "Sinal de ÁGUA + BEBER DIRETAMENTE SEM MEDO / PURA E CLORADA.",
        "sign_strategy": "Sinal de ÁGUA + BEBER DIRETAMENTE SEM MEDO / PURA E CLORADA.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Potabilidade",
          "Higiene no Campo",
          "Insumo Seguro"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-3",
        "term": "Colheita",
        "definition": "Operação de retirada de frutos, grãos, raízes ou folhas maduras da planta no ponto ideal de maturação com cuidados para não ferir o vegetal.",
        "description": "Operação de retirada de frutos, grãos, raízes ou folhas maduras da planta no ponto ideal de maturação com cuidados para não ferir o vegetal.",
        "context": "Deve ser realizada nos horários mais frescos do dia (início da manhã) com caixas higienizadas e manipuladores com mãos limpas.",
        "signStrategy": "Mãos colhendo cuidadosamente os frutos do ramo com tesoura de poda e colocando em caixote limpo.",
        "sign_strategy": "Mãos colhendo cuidadosamente os frutos do ramo com tesoura de poda e colocando em caixote limpo.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Colheita",
          "Maturação",
          "Campo"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-4",
        "term": "Pós-colheita",
        "definition": "Conjunto de práticas de manejo aplicadas aos vegetais imediatamente após a colheita (limpeza, seleção, resfriamento, embalagem) até a entrega final.",
        "description": "Conjunto de práticas de manejo aplicadas aos vegetais imediatamente após a colheita (limpeza, seleção, resfriamento, embalagem) até a entrega final.",
        "context": "Etapa onde ocorre a maior parte das perdas de alimentos; exige manejo suave e controle de temperatura para evitar murcha e podridão.",
        "signStrategy": "Sequência de gestos no galpão: retirar o calor do campo, lavar, selecionar e proteger os produtos colhidos.",
        "sign_strategy": "Sequência de gestos no galpão: retirar o calor do campo, lavar, selecionar e proteger os produtos colhidos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Pós-Colheita",
          "Vida Útil",
          "Manejo Rural"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-5",
        "term": "Lavagem",
        "definition": "Etapa inicial de remoção de terra, poeira e sujidades aderidas aos vegetais colhidos, realizada exclusivamente com água limpa e potável.",
        "description": "Etapa inicial de remoção de terra, poeira e sujidades aderidas aos vegetais colhidos, realizada exclusivamente com água limpa e potável.",
        "context": "Vegetais folhosos devem passar por lavagem prévia no sítio para retirar terra das raízes antes de irem para os caixotes de transporte.",
        "signStrategy": "Água corrente límpida enxaguando folhas e raízes em tanque de inox ou plástico atóxico.",
        "sign_strategy": "Água corrente límpida enxaguando folhas e raízes em tanque de inox ou plástico atóxico.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Lavagem",
          "Remoção de Terra",
          "Sanitização"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-6",
        "term": "Seleção",
        "definition": "Operação manual ou mecânica de separação e descarte de produtos danificados, picados por insetos, podres ou com defeitos graves.",
        "description": "Operação manual ou mecânica de separação e descarte de produtos danificados, picados por insetos, podres ou com defeitos graves.",
        "context": "Evita que frutos com bolor contaminem os demais produtos sadios dentro da mesma caixa durante o frete.",
        "signStrategy": "Olhar atento separando: fruta perfeita vai para a caixa de venda; fruta estragada ou ferida é descartada.",
        "sign_strategy": "Olhar atento separando: fruta perfeita vai para a caixa de venda; fruta estragada ou ferida é descartada.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Triagem",
          "Qualidade",
          "Descarte Sanitário"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-7",
        "term": "Classificação",
        "definition": "Agrupamento dos produtos agrícolas aprovados segundo padrões homogêneos de tamanho, peso, coloração, calibre e grau de maturação.",
        "description": "Agrupamento dos produtos agrícolas aprovados segundo padrões homogêneos de tamanho, peso, coloração, calibre e grau de maturação.",
        "context": "Regulamentada por normas do MAPA para facilitar a comercialização e precificação transparente na feira ou cooperativa.",
        "signStrategy": "Mãos separando por calibres: frutos grandes juntos, médios juntos e pequenos juntos com padronização visual.",
        "sign_strategy": "Mãos separando por calibres: frutos grandes juntos, médios juntos e pequenos juntos com padronização visual.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Padrão MAPA",
          "Calibre",
          "Homogeneidade"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-8",
        "term": "Acondicionamento",
        "definition": "Colocação dos alimentos selecionados em embalagens, caixas ou contentores apropriados que os protejam contra danos mecânicos e contaminações.",
        "description": "Colocação dos alimentos selecionados em embalagens, caixas ou contentores apropriados que os protejam contra danos mecânicos e contaminações.",
        "context": "Não se deve superlotar caixas para que o peso dos frutos de cima não esmague os de baixo gerando ferimentos e mofo.",
        "signStrategy": "Acomodação suave e organizada dos frutos dentro da embalagem protetora sem apertar.",
        "sign_strategy": "Acomodação suave e organizada dos frutos dentro da embalagem protetora sem apertar.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Proteção",
          "Embalamento",
          "Cuidado"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-9",
        "term": "Armazenamento rural",
        "definition": "Guarda temporária da safra colhida na propriedade em ambiente ventilado, sombreado, fresco e protegido do ataque de roedores e pássaros.",
        "description": "Guarda temporária da safra colhida na propriedade em ambiente ventilado, sombreado, fresco e protegido do ataque de roedores e pássaros.",
        "context": "Galpões rurais devem ter telas milimétricas nas janelas, estrados afastados do piso e ausência de agrotóxicos no mesmo espaço.",
        "signStrategy": "Galpão rural arejado e limpo com caixas sobre paletes de madeira longe do chão e das paredes.",
        "sign_strategy": "Galpão rural arejado e limpo com caixas sobre paletes de madeira longe do chão e das paredes.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Galpão Rural",
          "Proteção de Pragas",
          "Paletes"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-10",
        "term": "Transporte",
        "definition": "Deslocamento da produção do estabelecimento rural até a feira, entreposto ou cooperativa sob condições que evitem calor e sol direto.",
        "description": "Deslocamento da produção do estabelecimento rural até a feira, entreposto ou cooperativa sob condições que evitem calor e sol direto.",
        "context": "Carrocerias de caminhões ou caminhonetes devem ser higienizadas e cobertas por lonas térmicas claras para não queimar as verduras no trajeto.",
        "signStrategy": "Veículo rural carregando caixas organizadas sob cobertura protetora contra vento e sol forte.",
        "sign_strategy": "Veículo rural carregando caixas organizadas sob cobertura protetora contra vento e sol forte.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Logística Rural",
          "Frete",
          "Proteção Solar"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-11",
        "term": "Higiene do produtor",
        "definition": "Conjunto de hábitos de asseio pessoal adotados pelos trabalhadores rurais durante o plantio, colheita e manuseio dos alimentos.",
        "description": "Conjunto de hábitos de asseio pessoal adotados pelos trabalhadores rurais durante o plantio, colheita e manuseio dos alimentos.",
        "context": "Disponibilidade obrigatória de banheiros no campo com água, sabonete líquido e toalha descartável para evitar contaminação fecal das colheitas.",
        "signStrategy": "Trabalhador rural lavando as mãos com sabão e água potável antes de tocar nos vegetais colhidos.",
        "sign_strategy": "Trabalhador rural lavando as mãos com sabão e água potável antes de tocar nos vegetais colhidos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Banheiro no Campo",
          "Lavagem de Mãos",
          "Sanidade"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-12",
        "term": "Esterco",
        "definition": "Dejetos de animais de criação (bovinos, aves, caprinos) ricos em matéria orgânica e nutrientes, que exigem tratamento prévio antes do uso agrícola.",
        "description": "Dejetos de animais de criação (bovinos, aves, caprinos) ricos em matéria orgânica e nutrientes, que exigem tratamento prévio antes do uso agrícola.",
        "context": "Esterco fresco é fonte perigosa de Escherichia coli e Salmonella; seu uso direto e cru em hortaliças é expressamente proibido.",
        "signStrategy": "Dejetos de curral que precisam ser curtidos e aquecidos antes de entrarem em contato com a horta.",
        "sign_strategy": "Dejetos de curral que precisam ser curtidos e aquecidos antes de entrarem em contato com a horta.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Matéria Orgânica",
          "Risco Biológico",
          "Esterco Curtido"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-13",
        "term": "Adubação orgânica",
        "definition": "Prática de enriquecimento da fertilidade do solo através da incorporação de matéria vegetal decomposta, biofertilizantes e estercos curtidos.",
        "description": "Prática de enriquecimento da fertilidade do solo através da incorporação de matéria vegetal decomposta, biofertilizantes e estercos curtidos.",
        "context": "Estimula os fungos micorrízicos e as minhocas do solo, retendo água e dispensando fertilizantes químicos sintéticos solúveis.",
        "signStrategy": "Mãos espalhando terra preta rica e fértil de folhas e compostos no pé das plantas.",
        "sign_strategy": "Mãos espalhando terra preta rica e fértil de folhas e compostos no pé das plantas.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Fertilidade Natural",
          "Solo Vivo",
          "Nutrição da Planta"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-14",
        "term": "Compostagem",
        "definition": "Processo biológico controlado de decomposição termofílica de resíduos orgânicos que gera calor natural (>55°C), destruindo patógenos e sementes de invasoras.",
        "description": "Processo biológico controlado de decomposição termofílica de resíduos orgânicos que gera calor natural (>55°C), destruindo patógenos e sementes de invasoras.",
        "context": "A fase termofílica da pilha de compostagem é a garantia científica de que o composto final está livre de bactérias patogênicas para a horta.",
        "signStrategy": "Pilha de folhas e matéria orgânica fumegando de calor biológico e se transformando em terra preta cheirosa e segura.",
        "sign_strategy": "Pilha de folhas e matéria orgânica fumegando de calor biológico e se transformando em terra preta cheirosa e segura.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Termofílica",
          "Composto Seguro",
          "Inativação de Patógenos"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-15",
        "term": "Pragas agrícolas",
        "definition": "Insetos, ácaros, nematoides, roedores ou ervas invasoras que causam danos econômicos às culturas ou transmitem doenças às plantas.",
        "description": "Insetos, ácaros, nematoides, roedores ou ervas invasoras que causam danos econômicos às culturas ou transmitem doenças às plantas.",
        "context": "Na agroecologia, o aparecimento de pragas é sinal de desequilíbrio nutricional do solo tratado com manejo biológico.",
        "signStrategy": "Insetos atacando folhas de lavoura com sinal de alerta visual para o equilíbrio do canteiro.",
        "sign_strategy": "Insetos atacando folhas de lavoura com sinal de alerta visual para o equilíbrio do canteiro.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Manejo Integrado",
          "Equilíbrio Ecológico",
          "Plantas"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-16",
        "term": "Defensivos agrícolas",
        "definition": "Produtos químicos ou biológicos utilizados no campo para prevenir, destruir ou controlar pragas e doenças na agricultura.",
        "description": "Produtos químicos ou biológicos utilizados no campo para prevenir, destruir ou controlar pragas e doenças na agricultura.",
        "context": "Dividem-se em defensivos químicos sintéticos (agrotóxicos) e defensivos biológicos (extratos botânicos, fungos entomopatogênicos e caldas naturais).",
        "signStrategy": "Pulverizador no campo aplicando produtos protetores com ênfase na toxicidade e precaução de segurança.",
        "sign_strategy": "Pulverizador no campo aplicando produtos protetores com ênfase na toxicidade e precaução de segurança.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Agrotóxicos",
          "Biológicos",
          "Caldas Agroecológicas"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-17",
        "term": "Resíduos de agrotóxicos",
        "definition": "Quantidades residuais de princípios ativos químicos sintéticos que permanecem no interior ou na casca do alimento após a colheita.",
        "description": "Quantidades residuais de princípios ativos químicos sintéticos que permanecem no interior ou na casca do alimento após a colheita.",
        "context": "Monitorados pelo Programa de Análise de Resíduos de Agrotóxicos em Alimentos (PARA) da Anvisa através de coletas em supermercados.",
        "signStrategy": "Gotículas químicas tóxicas microscópicas presas na casca do fruto sendo detectadas em teste de laboratório.",
        "sign_strategy": "Gotículas químicas tóxicas microscópicas presas na casca do fruto sendo detectadas em teste de laboratório.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "PARA Anvisa",
          "Toxicologia",
          "Limite Máximo de Resíduo"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-18",
        "term": "Período de carência",
        "definition": "Intervalo de tempo obrigatório por lei entre a última aplicação de um defensivo agrícola na lavoura e o dia da colheita do alimento.",
        "description": "Intervalo de tempo obrigatório por lei entre a última aplicação de um defensivo agrícola na lavoura e o dia da colheita do alimento.",
        "context": "Desrespeitar a carência faz o produto chegar ao consumidor com resíduos ilegais acima do Limite Máximo de Resíduos (LMR).",
        "signStrategy": "Calendário marcando dias de espera obrigatória: PULVERIZOU -> ESPERAR 'X' DIAS -> SÓ ENTÃO PODE COLHER.",
        "sign_strategy": "Calendário marcando dias de espera obrigatória: PULVERIZOU -> ESPERAR 'X' DIAS -> SÓ ENTÃO PODE COLHER.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Intervalo de Segurança",
          "LMR",
          "Lei de Agrotóxicos"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-19",
        "term": "Deriva",
        "definition": "Desvio da trajetória das gotículas de defensivos agrícolas durante a pulverização, carregadas pelo vento para fora da lavoura-alvo.",
        "description": "Desvio da trajetória das gotículas de defensivos agrícolas durante a pulverização, carregadas pelo vento para fora da lavoura-alvo.",
        "context": "Pode contaminar nascentes de água, criações vizinhas e hortas orgânicas comunitárias próximas.",
        "signStrategy": "Vento soprando e arrastando a nuvem de veneno pulverizada para cima da cerca da propriedade vizinha.",
        "sign_strategy": "Vento soprando e arrastando a nuvem de veneno pulverizada para cima da cerca da propriedade vizinha.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Vento",
          "Contaminação Acidental",
          "Pulverização"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-20",
        "term": "Rastreabilidade agrícola",
        "definition": "Sistema que registra todo o histórico do vegetal: quem plantou, qual lote da fazenda, insumos utilizados e data de expedição.",
        "description": "Sistema que registra todo o histórico do vegetal: quem plantou, qual lote da fazenda, insumos utilizados e data de expedição.",
        "context": "Exigida pela Instrução Normativa Conjunta Anvisa/MAPA nº 02/2018 para frutas e hortaliças frescas com etiquetas ou QR Code.",
        "signStrategy": "Etiqueta com código QR colada na caixa de melão identificando o talhão e o agricultor que colheu.",
        "sign_strategy": "Etiqueta com código QR colada na caixa de melão identificando o talhão e o agricultor que colheu.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "INC 02/2018",
          "QR Code",
          "Origem no Campo"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-21",
        "term": "Caderno de campo",
        "definition": "Livro de registro diário onde o agricultor anota datas de plantio, podas, adubações, irrigação e colheita de cada canteiro.",
        "description": "Livro de registro diário onde o agricultor anota datas de plantio, podas, adubações, irrigação e colheita de cada canteiro.",
        "context": "Instrumento indispensável para obter certificações orgânicas, auditorias sanitárias e controle de custos da propriedade.",
        "signStrategy": "Agricultor escrevendo anotações detalhadas de datas e manejos em bloco de notas na sede do sítio.",
        "sign_strategy": "Agricultor escrevendo anotações detalhadas de datas e manejos em bloco de notas na sede do sítio.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Registros",
          "Auditoria",
          "Certificação"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-22",
        "term": "Boas práticas agrícolas",
        "definition": "Conjunto de princípios, normas e recomendações técnicas aplicadas à produção primária para garantir segurança sanitária e preservação ambiental.",
        "description": "Conjunto de princípios, normas e recomendações técnicas aplicadas à produção primária para garantir segurança sanitária e preservação ambiental.",
        "context": "Envolve conservação do solo, proteção de matas ciliares, água limpa e bem-estar do trabalhador rural.",
        "signStrategy": "Sinal composto: AGRICULTURA + REGRAS CORRETAS + CUIDADO COM NATUREZA E PESSOAS.",
        "sign_strategy": "Sinal composto: AGRICULTURA + REGRAS CORRETAS + CUIDADO COM NATUREZA E PESSOAS.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "BPA",
          "Normas de Campo",
          "Qualidade"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-23",
        "term": "Produção primária",
        "definition": "Fase inicial de cultivo, colheita, criação de animais ou extração de matérias-primas alimentares antes de qualquer processamento industrial.",
        "description": "Fase inicial de cultivo, colheita, criação de animais ou extração de matérias-primas alimentares antes de qualquer processamento industrial.",
        "context": "Primeiro e decisivo elo da cadeia alimentar: um produto colhido contaminado compromete toda a indústria posterior.",
        "signStrategy": "Semente brotando na terra com cuidado camponês como raiz de toda a alimentação humana.",
        "sign_strategy": "Semente brotando na terra com cuidado camponês como raiz de toda a alimentação humana.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Origem",
          "Campo",
          "Ponto Inicial"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-24",
        "term": "Contaminação do solo",
        "definition": "Presença de poluentes, metais pesados, parasitas ou químicos sintéticos em concentrações prejudiciais na terra cultivável.",
        "description": "Presença de poluentes, metais pesados, parasitas ou químicos sintéticos em concentrações prejudiciais na terra cultivável.",
        "context": "Pode transferir cádmio e chumbo para tubérculos como cenoura e batata ou contaminar hortaliças com vermes.",
        "signStrategy": "Venenos e resíduos químicos poluindo a terra fértil e envenenando as raízes das plantas.",
        "sign_strategy": "Venenos e resíduos químicos poluindo a terra fértil e envenenando as raízes das plantas.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Poluição do Solo",
          "Metais Pesados",
          "Degradação"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-25",
        "term": "Contaminação da água",
        "definition": "Introdução de substâncias químicas, esgoto sanitário ou microrganismos patogênicos em mananciais hídricos rurais.",
        "description": "Introdução de substâncias químicas, esgoto sanitário ou microrganismos patogênicos em mananciais hídricos rurais.",
        "context": "A água de poço sem tampa ou perto de fossa desprotegida contamina toda a produção irrigada do sítio.",
        "signStrategy": "Esgoto ou resíduo químico caindo dentro do rio ou poço e turvando a água que irriga a plantação.",
        "sign_strategy": "Esgoto ou resíduo químico caindo dentro do rio ou poço e turvando a água que irriga a plantação.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Mananciais",
          "Poluição Hídrica",
          "Proteção de Poços"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-26",
        "term": "Embalagem para alimentos",
        "definition": "Material atóxico de primeiro uso destinado a conter, proteger e transportar os alimentos colhidos sem transferir cheiro ou substâncias nocivas.",
        "description": "Material atóxico de primeiro uso destinado a conter, proteger e transportar os alimentos colhidos sem transferir cheiro ou substâncias nocivas.",
        "context": "Proibido usar sacos reaproveitados de adubos químicos ou ração animal para embalar farinhas ou grãos alimentícios.",
        "signStrategy": "Caixas ou sacos novos de grau alimentício protegendo as verduras frescas contra poeira e danos.",
        "sign_strategy": "Caixas ou sacos novos de grau alimentício protegendo as verduras frescas contra poeira e danos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Grau Alimentício",
          "Embalagem Atóxica",
          "Segurança"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-27",
        "term": "Caixa de colheita",
        "definition": "Caixote plástico vazado, higienizável e liso utilizado para colher e transportar hortifrútis do campo até a feira.",
        "description": "Caixote plástico vazado, higienizável e liso utilizado para colher e transportar hortifrútis do campo até a feira.",
        "context": "Substituem as antigas caixas de madeira porosas ('caixas K'), que acumulavam fungos e farpas e não podiam ser lavadas.",
        "signStrategy": "Caixa plástica resistente vazada sendo lavada com água e sabão antes de receber os frutos colhidos.",
        "sign_strategy": "Caixa plástica resistente vazada sendo lavada com água e sabão antes de receber os frutos colhidos.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Caixas Plásticas",
          "Fim da Caixa K",
          "Sanitização"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-28",
        "term": "Temperatura",
        "definition": "Grandeza física indicadora do calor no ambiente de colheita e pós-colheita que influencia diretamente a velocidade de degradação vegetal.",
        "description": "Grandeza física indicadora do calor no ambiente de colheita e pós-colheita que influencia diretamente a velocidade de degradação vegetal.",
        "context": "O calor acelera a respiração dos frutos colhidos; por isso a importância de manter produtos na sombra imediatamente após a apanha.",
        "signStrategy": "Termômetro subindo com calor do sol escaldante no campo e necessidade de sombra protetora.",
        "sign_strategy": "Termômetro subindo com calor do sol escaldante no campo e necessidade de sombra protetora.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Termometria",
          "Calor do Campo",
          "Respiração Vegetal"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-29",
        "term": "Cadeia do frio",
        "definition": "Manutenção ininterrupta de alimentos colhidos e resfriados sob temperatura baixa desde o sítio até o consumidor urbano.",
        "description": "Manutenção ininterrupta de alimentos colhidos e resfriados sob temperatura baixa desde o sítio até o consumidor urbano.",
        "context": "Fundamental para carnes na pecuária familiar e polpas de frutas congeladas das cooperativas rurais.",
        "signStrategy": "Câmara fria da associação rural ligada diretamente ao caminhão baú refrigerado que vai à cidade.",
        "sign_strategy": "Câmara fria da associação rural ligada diretamente ao caminhão baú refrigerado que vai à cidade.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Câmara Frigorífica",
          "Logística",
          "Preservação"
        ],
        "axis_id": 6
      },
      {
        "id": "term-campo-30",
        "term": "Comercialização direta",
        "definition": "Entrega e venda dos alimentos do produtor diretamente ao consumidor urbano sem cobrança de margens por atravessadores.",
        "description": "Entrega e venda dos alimentos do produtor diretamente ao consumidor urbano sem cobrança de margens por atravessadores.",
        "context": "Modelo estimulado pelo Guia Prático de Segurança Alimentar no Campo para gerar dignidade e alimento barato de verdade.",
        "signStrategy": "Camponês entregando as hortaliças colhidas no mesmo dia diretamente nas mãos da família consumidora.",
        "sign_strategy": "Camponês entregando as hortaliças colhidas no mesmo dia diretamente nas mãos da família consumidora.",
        "videoUrl": "",
        "video_url": "",
        "tags": [
          "Venda Direta",
          "Comunidade",
          "Feiras Camponesas"
        ],
        "axis_id": 6
      }
    ]
  }
];

export const librasPills: any[] = [
  {
    id: 'pill-1',
    title: 'O que é SAN? Conceito em 1 Minuto',
    duration: '1 min',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    practicalApp: 'Identificar a segurança alimentar no dia a dia da comunidade e na merenda escolar.',
    supportText: 'A Segurança Alimentar e Nutricional assegura o direito humano básico de comer com dignidade, regularidade e qualidade biológica.',
    category: 'Conceito Central'
  },
  {
    id: 'pill-2',
    title: 'Contaminação Cruzada na Cozinha',
    duration: '1 min',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    practicalApp: 'Separar tábuas e facas para carnes cruas e alimentos prontos para consumo.',
    supportText: 'Transferência de microrganismos patogênicos de um alimento cru ou superfície para outro pronto para consumo.',
    category: 'Boas Práticas'
  },
  {
    id: 'pill-3',
    title: 'Como Higienizar Vegetais e Frutas',
    duration: '54 seg',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    practicalApp: 'Mergulhar folhas em solução clorada na concentração correta antes de servir cru.',
    supportText: 'A água corrente retira sujidades físicas, mas a desinfecção com cloro elimina bactérias e parasitas invisíveis.',
    category: 'Higiene'
  },
  {
    id: 'pill-4',
    title: 'Perigo Biológico vs Perigo Químico',
    duration: '1 min',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    practicalApp: 'Evitar armazenar desinfetantes perto de alimentos e controlar a proliferação bacteriana.',
    supportText: 'Biológicos são bactérias, vírus e fungos; químicos são pesticidas, metais pesados e produtos de limpeza.',
    category: 'Controle Sanitário'
  },
  {
    id: 'pill-5',
    title: 'Prazo de Validade vs Vida de Prateleira',
    duration: '2 min',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    practicalApp: 'Conferir rótulos no mercado e aplicar o princípio PVPS (Primeiro que Vence, Primeiro que Sai).',
    supportText: 'Período em que o alimento permanece seguro para o consumo, mantendo suas propriedades nutritivas e sensoriais.',
    category: 'Rotulagem'
  },
  {
    id: 'pill-6',
    title: 'Higiene Correta das Mãos do Manipulador',
    duration: '1 min',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    practicalApp: 'Lavar as mãos antes de preparar alimentos, após usar o banheiro ou tocar no lixo.',
    supportText: 'As mãos são o principal veículo de contaminação cruzada na manipulação de alimentos.',
    category: 'Boas Práticas'
  },
  {
    id: 'pill-7',
    title: 'Temperatura Segura: Geladeira e Fogão',
    duration: '1 min',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    practicalApp: 'Manter alimentos quentes acima de 60°C e alimentos refrigerados abaixo de 5°C.',
    supportText: 'A zona de perigo entre 5°C e 60°C é onde as bactérias se multiplicam rapidamente a cada 20 minutos.',
    category: 'Conservação'
  },
  {
    id: 'pill-8',
    title: 'Alérgenos nos Alimentos: Como Identificar',
    duration: '2 min',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    practicalApp: 'Ler alertas de ‘Alérgicos: contém glúten/leite/soja’ para proteger pessoas alérgicas.',
    supportText: 'Proteínas alimentares que desencadeiam reações do sistema imunológico, exigindo destaque obrigatório nos rótulos.',
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
