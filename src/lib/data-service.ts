import { 
  collection, 
  getDocs, 
  getDoc,
  setDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  limit,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  uploadBytesResumable,
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "../hooks/use-toast";
import { db, storage, auth } from "./firebase";
const safeToast = (props: any) => {
    if (typeof window !== 'undefined') toast(props);
};
import { 
  News, 
  news as mockNews, 
  teamMembers,
  getTeamMembers, 
  projectTasks, 
  ProjectTask, 
  User, 
  UserPermissions, 
  UserRole, 
  projectObjectives, 
  ProjectObjective,
  StrategicPlanMonth,
  strategicPlanning,
  strategicPlanning as mockStrategicPlanning,
  CommunityLeader,
  Territory,
  communityLeaders as mockLeaders,
  territories as mockTerritories,
  SectorActivity,
  sectorActivities,
  standardFlows,
  standardFlowSteps,
  taskTriggers,
  Sector,
  Role,
  UserSectorRole,
  sectors,
  SocialPost,
  socialPosts as mockSocialPosts
} from "./mock-data";
import type { Flow, FlowStep, ProjectBottleneck } from "./schema/models";
import type { StoredUser, AuthResponse, AuthSession } from "./auth";
import { hashPassword, verifyPassword, validarCPF, formatarCPF, validarForcaSenha } from "./auth";
import { CMSBlock, CMSBlockStatus, CMSAuditLog, INSTITUTIONAL_PALETTE } from './cms-schema';
import type { Responsabilidade, MembroResponsabilidades, ArquivoRastreado, VisibilidadeConteudo, LogAuditoria } from "./responsabilidades";
export type { Responsabilidade, MembroResponsabilidades, ArquivoRastreado, VisibilidadeConteudo, LogAuditoria };
import { RESPONSABILIDADES_PADRAO, AREAS_CONFIGURACAO, AreasAtuacao, VisibilidadeConteudo as VisibilidadeEnum } from "./responsabilidades";
import { 
  usuariosCadastrados, 
  encontrarUsuarioPor, 
  encontrarUsuarioPorId,
  adicionarNovoUsuario,
  atualizarUsuario,
  deletarUsuario,
  alterarSenha,
  resetarSenha,
  desativarUsuario,
  reativarUsuario,
  listarTodosUsuarios
} from "./auth-credentials";
import { sectorObjectives as staticSectorObjectives } from "./sector-objectives";

// ────────────────────────────────────
// STORAGE EM MEMÓRIA - RESPONSABILIDADES
// ────────────────────────────────────

const membrosResponsabilidades: Map<string, MembroResponsabilidades> = new Map();
const arquivosRastreados: Map<string, ArquivoRastreado> = new Map();
const logsAuditoria: LogAuditoria[] = [];
const notificacoes: Map<string, any[]> = new Map(); // usuarioId -> Array de notificações

const NEWS_COLLECTION = "news";
const TASKS_COLLECTION = "tasks";
const DOCUMENTS_COLLECTION = "documents";
const SECTORS_COLLECTION = "sectors";

export interface InstitutionalFile {
  id: string;
  name: string;
  category: 'institucional' | 'orientacao' | 'pma' | 'comunicacao' | 'territorial' | 'cientifico';
  sectorId: string; // Setor proprietário
  isPublic: boolean; // Se visível para todos os membros autenticados
  url: string;
  storagePath: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AscomMetrics {
  publishedMonth: number;
  inProduction: number;
  overdue: number;
  waitingAccessibility: number;
  blocked: number;
  avgDeliveryTime: string;
}

export interface AccessibilityMetrics {
  totalQueue: number;
  byPriority: { alta: number, media: number, baixa: number, urgente: number };
  overdueSLA: number;
  avgResponseTime: string;
  blockingTasksCount: number;
}

export interface PartnershipMetrics {
  totalEmProspeccao: number;
  ativas: number;
  concluidas: number;
  demandasAtendidas: number;
  totalParticipantesImpactados: number;
  taxaConversao: number; // 0-100
}

export interface ScientificMetrics {
  totalInsumosRecebidos: number;
  emAnalise: number;
  produtosDesenvolvidos: number;
  taxaValidacao: number; // 0-100
  artigosRelatorios: number;
  indicadoresGerados: number;
}

export interface TerritorialMetrics {
  totalActions: number;
  byMunicipality: { [key: string]: number };
  byActionType: { [key: string]: number };
  participantsReached: number;
  evidenceComplianceRate: number; // 0-100
  pendingForwardings: number;
}

export interface InstitutionalRisk {
  id: string;
  taskId: string;
  taskTitle: string;
  sectorId: string;
  sectorSigla: string;
  riskType: 'not_accepted' | 'overdue';
  delayDays: number;
  assignedToName?: string;
  severity: 'alta' | 'media' | 'baixa';
  suggestedAction: 'Orientar Setor' | 'Registrar na Pasta de Gargalos';
}

export interface SectorHealth {
  sectorId: string;
  name: string;
  sigla: string;
  overdueCount: number;
  blockedCount: number;
  avgCycleTime: number; // dias
  loadScore: number; // 0-100
  status: 'estável' | 'alerta' | 'crítico';
}

export interface StrategicOverview {
  globalHealthScore: number;
  totalTasks: number;
  totalConcluded: number;
  totalOverdue: number;
  totalBlocked: number;
  sectorHealth: SectorHealth[];
  goalCompliance: number; // % metas batidas
  recentBottlenecks: Array<{
    id: string;
    type: 'overload' | 'bottleneck' | 'delay';
    sectorId: string;
    reason: string;
    severity: 'alta' | 'media';
  }>;
}

export interface ActivityStep {
  id: string;
  label: string;
  completed: boolean;
  timestamp?: string;
  userId?: string;
  userName?: string;
}

export interface ExceptionRequest {
  id: string;
  taskId: string;
  taskTitle: string;
  requesterId: string;
  requesterName: string;
  sectorId: string;
  type: 'SKIP_EVIDENCE' | 'BYPASS_SLA' | 'FORCE_CLOSE' | 'SECTOR_OVERRIDE';
  justification: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  decisionNotes?: string;
  decidedBy?: string;
  decidedByName?: string;
  decidedAt?: string;
  createdAt: string;
}

export interface ExecutiveBriefing extends StrategicOverview {
  pendingExceptionsCount: number;
  highRiskSectors: string[];
  criticalDependencies: number;
  institutionalRisks: InstitutionalRisk[];
}

// Helpers de Persistência Local (Bypass)
const saveToStorage = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(`redeinova_${key}`, JSON.stringify(data));
    }
};

const loadFromStorage = (key: string, defaultData: any) => {
    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem(`redeinova_${key}`);
            if (!saved) return defaultData;
            return JSON.parse(saved);
        } catch (error) {
            console.error(`❌ Erro crítico ao carregar [${key}] do localStorage:`, error);
            return defaultData;
        }
    }
    return defaultData;
};

// Dados Iniciais de Exceção (Demo)
const INITIAL_EXCEPTIONS: ExceptionRequest[] = [];

// Cache dinâmico de setores (Baseline do mock-data)
let dynamicSectors: SectorDefinition[] = [...sectors];

// Sistema de Observadores para Dados Locais (Bypass Mode)
const newsListeners: ((news: News[]) => void)[] = [];
const leaderListeners: ((leaders: CommunityLeader[]) => void)[] = [];
const socialPostListeners: ((posts: SocialPost[]) => void)[] = [];
const taskListeners: ((tasks: ProjectTask[]) => void)[] = [];
const documentListeners: ((docs: InstitutionalFile[]) => void)[] = [];

// Singleton para controle de listeners do Firestore
let activeTasksUnsubscribe: (() => void) | null = null;
let activeTasksSubscribersCount = 0;
// ── HIDRATAÇÃO: Carregar cache de tarefas do localStorage ──
const cachedTasks = loadFromStorage('tasks', []);
if (cachedTasks.length > 0) {
  cachedTasks.forEach((task: ProjectTask) => {
    if (!projectTasks.find(t => t.id === task.id)) {
      projectTasks.push(task);
    }
  });
}

// ── HIDRATAÇÃO: Gargalos ──
const bottlenecks: ProjectBottleneck[] = loadFromStorage('bottlenecks', []);

// Inicialização com Persistência
let activeMockNews = loadFromStorage('news', mockNews);
let activeMockLeaders = loadFromStorage('leaders', mockLeaders);
let activeMockSocialPosts = loadFromStorage('social_posts', mockSocialPosts);

// Reset de Versão v3 - Métricas Dinâmicas
const PMA_VERSION = "v3";
const currentVersion = typeof window !== 'undefined' ? localStorage.getItem('redeinova_pma_version') : null;
if (currentVersion !== PMA_VERSION) {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('redeinova_project_objectives');
        localStorage.setItem('redeinova_pma_version', PMA_VERSION);
    }
}
let activeMockObjectives = loadFromStorage('project_objectives', projectObjectives);

// Governança Extensionista - Reiniciada para Dados Reais (Baseline 0)
const initialIndicators = [
  { 
    id: 1, 
    name: "Ações Extensionistas Desenvolvidas", 
    desc: "Iniciativas práticas integradas à comunidade", 
    period: "Trimestral", 
    value: "0", 
    goal: "12",
    unit: "ações",
    metricType: "COUNT",
    formula: "Ações Realizadas / Meta Anual"
  },
  { 
    id: 2, 
    name: "Taxa de Viabilidade Extensionista", 
    desc: "Conversão de projetos em ações reais", 
    period: "Semestral", 
    value: "0%", 
    goal: "90%",
    unit: "%",
    metricType: "PERCENT",
    formula: "(Ações Concluídas / Projetos Planejados) * 100"
  },
  { 
    id: 3, 
    name: "Impacto Social das Ações", 
    desc: "Pessoas diretamente beneficiadas", 
    period: "Semestral", 
    value: "0", 
    goal: "1.5k",
    unit: "pessoas",
    metricType: "MAGNITUDE",
    formula: "Soma do público atingido em eventos"
  },
  { 
    id: 4, 
    name: "Integração com Eng. de Alimentos", 
    desc: "Uso de base técnica científica", 
    period: "Semestral", 
    value: "0%", 
    goal: "100%",
    unit: "%",
    metricType: "PERCENT",
    formula: "Atividades com Parecer Técnico / Total de Atividades"
  },
  { 
    id: 5, 
    name: "Eventos Realizados", 
    desc: "Capacitações e oficinas", 
    period: "Semestral", 
    value: "0", 
    goal: "06",
    unit: "eventos",
    metricType: "COUNT",
    formula: "Contagem de eventos concluídos no Radar"
  },
  { 
    id: 6, 
    name: "Parcerias Institucionais", 
    desc: "Termos de cooperação ativos", 
    period: "Anual", 
    value: "0", 
    goal: "05",
    unit: "parcerias",
    metricType: "COUNT",
    formula: "Contratos e convênios assinados"
  },
  { 
    id: 7, 
    name: "Conformidade Institucional", 
    desc: "Respeito ao planejamento PMA", 
    period: "Anual", 
    value: "0%", 
    goal: "100%",
    unit: "%",
    metricType: "PERCENT",
    formula: "Metas cumpridas no prazo / Total de Metas"
  },
];

let activeExtensionIndicators = loadFromStorage('extension_indicators', initialIndicators);
let activeStrategicPareceres = loadFromStorage('strategic_pareceres', []);

const notifyNewsListeners = () => {
    saveToStorage('news', activeMockNews);
    newsListeners.forEach(cb => cb([...activeMockNews]));
};

const notifyLeaderListeners = () => {
    saveToStorage('leaders', activeMockLeaders);
    leaderListeners.forEach(cb => cb([...activeMockLeaders]));
};

const notifySocialPostListeners = () => {
    saveToStorage('social_posts', activeMockSocialPosts);
    socialPostListeners.forEach(cb => cb([...activeMockSocialPosts]));
};

const notifyTaskListeners = () => {
    saveToStorage('tasks', projectTasks);
    taskListeners.forEach(cb => cb([...projectTasks]));
};

export const dataService = {
  // ────────────────────────────────────
  // ROLE & AUTHENTICATION
  // ────────────────────────────────────
  
  isBypass(): boolean {
    return typeof window !== 'undefined' && localStorage.getItem("dev_bypass") === "true";
  },

  /** 
   * 🔍 CONTEXTO: Identifica se estamos navegando na área de membros/estúdio.
   * Se falso, o sistema opera em modo 'Apenas Leitura' (Public Site).
   */
  isStudioContext(): boolean {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    
    // Lista de prefixos considerados 'Área Logada' ou 'Módulo Studio'
    const internalSections = [
        '/painel',
        '/studio',
        '/dashboard', 
        '/inicio', 
        '/perfil', 
        '/atividades', 
        '/minhas-tarefas', 
        '/planejamento', 
        '/admin', 
        '/documentos', 
        '/agenda', 
        '/gerenciar', 
        '/registro-publico',
        '/setores',
        '/equipe'
    ];

    const isInternal = internalSections.some(prefix => path.startsWith(prefix));
    const isExplicitStudio = path.includes('estudio=true') || path.startsWith('/studio');
    
    return isInternal || isExplicitStudio;
  },

  /** Verifica se o usuário está autenticado localmente (via login form) */
  isAuthenticatedLocally(): boolean {
    if (typeof window === 'undefined') return false;
    const authSession = localStorage.getItem("auth_session");
    const userId = localStorage.getItem("user_id");
    return !!authSession && !!userId;
  },

  async getUsers(): Promise<any[]> {
    return listarTodosUsuarios();
  },

  generateIdentifier(sector: string): string {
    const sigla = this.getSectorSigla(sector).toUpperCase();
    const year = new Date().getFullYear();
    const count = projectTasks.filter(t => 
      t.sector?.toString().toUpperCase() === sigla || 
      t.sectorId?.toLowerCase() === sector.toLowerCase()
    ).length + 1;
    const formattedCount = String(count).padStart(3, '0');
    
    return `${sigla}-INOVA/${formattedCount}/${year}`;
  },

  getSectorIdBySigla(sigla: string) {
    if (!sigla) return 'ascom';
    const normalizedSigla = sigla.toUpperCase().trim();
    const sector = dynamicSectors.find(s => 
      s.sigla.toUpperCase() === normalizedSigla || 
      s.id.toLowerCase() === normalizedSigla.toLowerCase() ||
      (normalizedSigla === 'CGP' && s.id === 'cgp')
    );
    return sector ? sector.id : 'ascom';
  },

  checkForPotentialDuplicate(params: { title: string, sectorId: string, sector: string }) {
    return projectTasks.find(t => 
      t.sector === params.sector && 
      t.title.toLowerCase().trim() === params.title.toLowerCase().trim() &&
      t.status !== 'concluida'
    ) || null;
  },

  suggestWorkflow(sectorId: string, typeId: string): Flow | null {
    const normalizedId = sectorId.toLowerCase().trim();
    // Tenta encontrar o setor no cache dinâmico para pegar a sigla real
    const sector = dynamicSectors.find(s => s.id === normalizedId || s.sigla.toLowerCase() === normalizedId);
    
    if (normalizedId === 'cgp' || (sector && sector.sigla === 'CGP')) {
      return standardFlows.find(f => f.id === 'flow-governanca') || standardFlows.find(f => f.id === 'flow-ascom') || null;
    }
    if (normalizedId === 'ascom' || (sector && sector.sigla === 'ASCOM')) return standardFlows.find(f => f.id === 'flow-ascom') || null;
    
    // Sugestão padrão baseada no setor
    return standardFlows.find(f => f.sectorId === sectorId) || null;
  },

  getWorkflowSteps(flowId: string) {
    return standardFlowSteps.filter(s => s.flowId === flowId).sort((a,b) => a.order - b.order);
  },

  async assignTask(taskData: any): Promise<string> {
    const newId = `t-${Date.now()}`;
    const newTask = {
      ...taskData,
      id: newId,
    };
    projectTasks.unshift(newTask);
    saveToStorage('tasks', projectTasks);
    
    // Tentar sincronização com Firestore imediatamente
    try {
      await this._syncTaskToFirestore(newTask);
    } catch (e) {
      console.warn("Firestore sync failed, keeping local copy:", e);
    }

    try { notifyTaskListeners(); } catch (e) {}
    return newId;
  },

  async addExtraActivity(taskData: Partial<ProjectTask>): Promise<string> {
    const newId = `extra-${Date.now()}`;
    const user = this.getCurrentUser();
    
    const newTask: ProjectTask = {
      ...taskData,
      id: newId,
      isExtra: true,
      status: 'concluida',
      statusId: 'st-concluida',
      workflowStage: 'publicacao',
      approvalStatus: 'aprovada',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      assignedById: user?.id || 'sistema',
      assignedByName: user?.name || 'Sistema',
      category: 'geral',
      visibility: 'Público',
    } as ProjectTask;

    // Persistência
    projectTasks.unshift(newTask);
    saveToStorage('tasks', projectTasks);
    
    try {
      await this._syncTaskToFirestore(newTask);
    } catch (e) {
      console.warn("Firestore sync for extra activity failed:", e);
    }

    try { notifyTaskListeners(); } catch (e) {}
    
    safeToast({ title: "Atividade Extra Registrada", description: "Impacto adicionado com sucesso às métricas do mês." });
    return newId;
  },

  async confirmWorkflow(taskId: string, flowId: string) {
    const task = projectTasks.find(t => t.id === taskId);
    if (task) {
      task.flowId = flowId;
      const initialStep = standardFlowSteps.find(s => s.flowId === flowId && s.order === 1);
      if (initialStep) task.currentStepId = initialStep.id;
      saveToStorage('tasks', projectTasks);
    }
  },

  async requestWorkflowAdjustment(taskId: string, notes: string) {
    const task = projectTasks.find(t => t.id === taskId);
    if (task) {
      task.isFlowFrozen = true;
      task.flowAdjustmentNotes = notes;
      saveToStorage('tasks', projectTasks);
      saveToStorage('tasks', projectTasks);
    }
  },

  _handleAutomationTriggers(task: any) {
    // Mapeamento básico para gatilhos
    try {
      if (!task || !task.sectorId || !task.statusId) return;
      const triggers = taskTriggers.filter(t => t.sourceSectorId === task.sectorId && t.sourceStatusId === task.statusId);
      for (const trigger of triggers) {
        if (trigger.action === 'create_task') {
           console.log(`[AUTOMAÇÃO GATILHO] Tarefa derivada acionada para ${trigger.targetSectorId}`);
        }
      }
    } catch(e) {
      console.warn("Falha silenciosa na automação:", e);
    }
  },


  async listarMembrosEquipe(): Promise<User[]> {
    if (this.isBypass() || this.isAuthenticatedLocally()) {
        return [...teamMembers];
    }
    try {
        const teamCol = collection(db, "users");
        const snapshot = await getDocs(query(teamCol, orderBy("name", "asc")));
        if (snapshot.empty) return [...teamMembers];
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    } catch (e) {
        console.warn("Firebase Team Error:", e);
        return [...teamMembers];
    }
  },

  /** Obtém a sessão local atual */
  obterSessaoAtual(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    const sessionStr = localStorage.getItem("auth_session");
    if (!sessionStr) return null;
    try {
        return JSON.parse(sessionStr);
    } catch (e) {
        return null;
    }
  },

  async fazerLogout(): Promise<void> {
    if (typeof window !== 'undefined') {
        localStorage.removeItem("auth_session");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_role");
        const keys = Object.keys(localStorage);
        keys.forEach(k => {
            if (k.startsWith('active_sector_')) localStorage.removeItem(k);
        });
    }
  },

  formatRole(role: string): string {
    const roles: Record<string, string> = {
        'ADMIN': 'Administrador Geral',
        'ADMINISTRADOR': 'Administrador',
        'COORDENADOR': 'Coordenador',
        'COORD': 'Coordenador',
        'coordinator': 'Coordenador',
        'member_editor': 'Membro Editor',
        'member': 'Membro',
        'viewer': 'Visualizador',
        'ACESSIBILIDADE': 'Coordenador de Acessibilidade',
        'ASCOM': 'Coordenador de Comunicação',
        'CGP': 'Coordenação Geral'
    };
    return roles[role.toUpperCase()] || role;
  },

  getUserRole(): Role | null {
    if (typeof window === 'undefined') return null;
    const user = this.getCurrentUser();
    if (!user) return localStorage.getItem("user_role") as Role || null;
    
    // Fallback: se não houver setor ativo, usa o papel global do usuário
    if (!user.activeSector) return (user.role as Role) || null;
    
    const activeAssignment = user.assignments?.find(a => a.sector === user.activeSector);
    return activeAssignment?.role || (user.role as Role) || null;
  },

  /** Obtém o setor ativo do usuário */
  getActiveSector(): Sector | null {
    const user = this.getCurrentUser();
    return user?.activeSector || null;
  },

  /** Alterna o setor ativo com validação de governança e persistência */
  setActiveSector(sector: Sector): void {
    const userId = this.getCurrentUserId();
    if (!userId) return;

    const user = encontrarUsuarioPorId(userId);
    if (!user) return;

    // Validar se o usuário tem vínculo com o setor
    const hasAssignment = user.assignments.some(a => a.sector === sector);
    const isGlobalAdmin = user.role === 'ADMIN' || user.department === 'CGP';

    if (!hasAssignment && !isGlobalAdmin) {
      safeToast({ 
        title: "Acesso Negado", 
        description: `Você não possui vínculo institucional com o setor ${sector}.`,
        variant: "destructive" 
      });
      return;
    }

    // Persistir no storage e no objeto em memória
    user.activeSector = sector;
    if (typeof window !== 'undefined') {
        localStorage.setItem(`active_sector_${userId}`, sector);
        // Atualizar sessão para refletir mudança nos componentes
        const session = this.obterSessaoAtual();
        if (session) {
            session.activeSector = sector;
            saveToStorage('auth_session', session);
        }
    }

    safeToast({ 
        title: "Troca de Contexto", 
        description: `Ambiente alternado para ${sector}. Permissões atualizadas.` 
    });
    
    // Forçar recarregamento leve se necessário ou via estado
    window.location.reload(); 
  },

  /**
   * 🔐 NÚCLEO DE AUTENTICAÇÃO: Login com Firebase Auth real (email/senha)
   * Fluxo: Validar CPF/senha localmente → signIn no Firebase Auth → Seed /users/{uid}
   */
  async fazerLogin(cpfOuEmail: string, senha: string): Promise<AuthResponse> {
    try {
      // 1. Sanitização e Formatação
      const identificador = cpfOuEmail.includes('@') ? cpfOuEmail.trim().toLowerCase() : formatarCPF(cpfOuEmail);
      
      // 2. Busca de Usuário (Credenciais Institucionais)
      const usuario = encontrarUsuarioPor(identificador);
      
      if (!usuario) {
        return { sucesso: false, mensagem: "Usuário não localizado no sistema. Verifique suas credenciais." };
      }

      // 3. Verificação de Status
      if (!usuario.ativo) {
        return { sucesso: false, mensagem: "Esta conta foi desativada. Entre em contato com a coordenação." };
      }

      // 4. Validação de Senha (Hash Seguro)
      const senhaValida = verifyPassword(senha, usuario.passwordHash);
      if (!senhaValida) {
        console.warn(`[AUTH] Falha de login para: ${identificador}`);
        return { sucesso: false, mensagem: "A senha informada está incorreta." };
      }

      // 5. 🔥 FIREBASE AUTH REAL — Derivar email e autenticar
      const firebaseEmail = this._deriveFirebaseEmail(identificador);
      let firebaseUser;
      let isLocalMode = false;
      
      try {
        // Tentar login existente
        const credential = await signInWithEmailAndPassword(auth, firebaseEmail, senha);
        firebaseUser = credential.user;
        console.log(`[AUTH/Firebase] Login cloud sincronizado: ${firebaseUser.uid}`);
      } catch (authError: any) {
        console.warn(`[AUTH/Firebase] Erro na sincronização (Código: ${authError.code}):`, authError.message);

        // Se o usuário não existe no Firebase, tentamos criar (Primeiro Acesso Cloud)
        if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
          try {
            const credential = await createUserWithEmailAndPassword(auth, firebaseEmail, senha);
            firebaseUser = credential.user;
            console.log(`[AUTH/Firebase] Conta cloud criada: ${firebaseUser.uid}`);
          } catch (createError: any) {
            console.error("[AUTH/Firebase] Falha crítica ao criar conta cloud:", createError.code);
            // Se falhar a criação (ex: config ou rede), permitimos o login local
            isLocalMode = true;
          }
        } else {
          // Para qualquer outro erro (configuração, rede, bloqueio), tratamos como Modo Local
          // Importante: Como já validamos a senha institucional no Step 4, o usuário é confiável.
          isLocalMode = true;
        }
      }

      // 5.1 Feedback de Modo Local (se ativado)
      if (isLocalMode) {
        console.warn("[AUTH] Ativando Modo Local Fallback (Contingência Institucional).");
        safeToast({ 
          title: "Modo Local Ativado ⚠️", 
          description: "O servidor de autenticação está indisponível. Entrando em modo de contingência.",
          variant: "warning" 
        });
      }

      // 6. 📄 SEED /users/{uid} — Perfil institucional no Firestore (Somente se Firebase estiver OK)
      if (firebaseUser && !isLocalMode) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          const userProfile = {
            institutionalId: usuario.id,
            cpfOuEmail: usuario.cpfOuEmail,
            nomeCompleto: usuario.nomeCompleto,
            role: usuario.role,
            department: usuario.department,
            assignments: usuario.assignments,
            ativo: usuario.ativo,
            cargo: usuario.cargo || '',
            bio: usuario.bio || '',
            lattesUrl: usuario.lattesUrl || '',
            avatarUrl: usuario.avatarUrl || '',
            permissoes: usuario.permissoes,
            lastLoginAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          if (!userDoc.exists()) {
            await setDoc(userDocRef, { ...userProfile, createdAt: new Date().toISOString() });
            console.log(`[AUTH/Firestore] Perfil criado: /users/${firebaseUser.uid}`);
          } else {
            // 🔥 FORÇAR atualização de campos críticos para garantir que novas permissões do código entrem em vigor
            await updateDoc(userDocRef, {
              ...userProfile,
              // Campos que não podem estar defasados
              permissoes: usuario.permissoes,
              role: usuario.role,
              cargo: usuario.cargo || '',
              ativo: usuario.ativo
            });
            console.log(`[AUTH/Firestore] Perfil corrigido/atualizado: /users/${firebaseUser.uid}`);
          }
        } catch (profileError) {
          console.warn("[AUTH/Firestore] Falha ao sincronizar perfil (continuando login):", profileError);
        }
      }

      // 7. Geração de Sessão
      const sessao: AuthSession = {
        userId: usuario.id,
        nomeCompleto: usuario.nomeCompleto,
        role: usuario.role,
        assignments: usuario.assignments,
        activeSector: usuario.activeSector || (usuario.assignments && usuario.assignments[0]?.sector) || 'cgp',
        logado: true,
        datalogin: new Date().toISOString(),
        permissoes: usuario.permissoes,
        department: usuario.department,
        avatarUrl: usuario.avatarUrl,
        cargo: usuario.cargo,
        bio: usuario.bio,
        lattesUrl: usuario.lattesUrl
      };

      // 8. Persistência de Sessão Local (apenas metadados de sessão)
      if (typeof window !== 'undefined') {
        localStorage.setItem("auth_session", JSON.stringify(sessao));
        localStorage.setItem("user_id", usuario.id);
        localStorage.setItem("user_role", usuario.role);
        if (firebaseUser) {
          localStorage.setItem("firebase_uid", firebaseUser.uid);
        }
        if (isLocalMode) {
          localStorage.setItem("auth_mode", "local_fallback");
        } else {
          localStorage.removeItem("auth_mode");
        }
      }

      console.log(`[AUTH] Login completo: ${usuario.nomeCompleto} (${usuario.role}) | Fallback: ${isLocalMode}`);
      
      return { 
        sucesso: true, 
        mensagem: isLocalMode 
          ? `Bem-vindo(a), ${usuario.nomeCompleto}! (Modo Offline Ativado)`
          : `Bem-vindo(a), ${usuario.nomeCompleto}!`, 
        usuario: sessao,
        requiresPasswordChange: usuario.requiresPasswordChange 
      };

    } catch (error: any) {
      console.error("Erro crítico no processamento do login:", error);
      throw new Error("Falha sistêmica ao processar credenciais. Tente novamente em alguns instantes.");
    }
  },

  /** Deriva email Firebase a partir de CPF ou email original */
  _deriveFirebaseEmail(cpfOuEmail: string): string {
    if (cpfOuEmail.includes('@')) return cpfOuEmail;
    // CPF 069.400.574-63 → 06940057463@redeinova.edu.br
    const numeros = cpfOuEmail.replace(/\D/g, '');
    return `${numeros}@redeinova.edu.br`;
  },

  estaAutenticado(): boolean {
    return this.isAuthenticatedLocally();
  },

  /** 🛠️ GESTÃO DE CONTA: Alterar senha do próprio usuário */
  async alterarMinhaSenha(senhaAtual: string, novaSenha: string): Promise<AuthResponse> {
    const userId = this.getCurrentUserId();
    if (!userId) return { sucesso: false, mensagem: "Sessão expirada." };

    const usuario = encontrarUsuarioPorId(userId);
    if (!usuario) return { sucesso: false, mensagem: "Usuário não encontrado." };

    // Validar senha atual
    if (!verifyPassword(senhaAtual, usuario.passwordHash)) {
      return { sucesso: false, mensagem: "A senha atual informada está incorreta." };
    }

    // Validar força da nova senha
    const forca = validarForcaSenha(novaSenha);
    if (forca.score < 50) {
      return { sucesso: false, mensagem: "A nova senha é muito fraca. " + forca.avisos.join('. ') };
    }

    const sucesso = alterarSenha(userId, novaSenha);
    if (sucesso) {
      // Atualizar flag de troca obrigatória
      const updatedUser = encontrarUsuarioPorId(userId);
      if (updatedUser) updatedUser.requiresPasswordChange = false;
      
      return { sucesso: true, mensagem: "Sua senha foi alterada com sucesso!" };
    }
    
    return { sucesso: false, mensagem: "Erro ao persistir a nova senha." };
  },

  // ────────────────────────────────────
  // ADMINISTRAÇÃO DE MEMBROS (RBAC)
  // ────────────────────────────────────

  async criarNovoUsuario(dados: Omit<StoredUser, 'id' | 'dataCriacao' | 'passwordHash' | 'ativo'> & { senhaTemporaria: string }): Promise<AuthResponse> {
    if (!this.canManageTeam()) {
      return { sucesso: false, mensagem: "Apenas coordenadores podem cadastrar novos membros." };
    }

    // Validação de força da senha temporária
    const forca = validarForcaSenha(dados.senhaTemporaria);
    if (forca.score < 40) {
      return { sucesso: false, mensagem: "A senha temporária é muito fraca. Forneça uma senha mais robusta." };
    }

    const novoUsuario: StoredUser = {
      id: String(listarTodosUsuarios().length + 100), // IDs começam em 100 para novos membros
      ...dados,
      passwordHash: hashPassword(dados.senhaTemporaria),
      ativo: true,
      dataCriacao: new Date().toISOString(),
      criadoPor: this.getCurrentUserId() || 'sistema',
      requiresPasswordChange: true // Força o membro a trocar no primeiro acesso
    };

    const sucesso = adicionarNovoUsuario(novoUsuario);
    if (sucesso) {
        return { sucesso: true, mensagem: `Membro ${dados.nomeCompleto} cadastrado com sucesso.`, usuario: novoUsuario as any };
    }
    return { sucesso: false, mensagem: "Erro: Este CPF ou Email já está cadastrado no sistema." };
  },

  async atualizarUsuarioMembro(userId: string, updates: Partial<StoredUser>): Promise<AuthResponse> {
    if (!this.canManageTeam() && this.getCurrentUserId() !== userId) {
      return { sucesso: false, mensagem: "Você não tem permissão para editar este perfil." };
    }

    const sucesso = atualizarUsuario(userId, updates);
    if (sucesso) {
      return { sucesso: true, mensagem: "Perfil atualizado com sucesso." };
    }
    return { sucesso: false, mensagem: "Erro ao localizar usuário para atualização." };
  },

  async resetarSenhaUsuario(userId: string): Promise<AuthResponse> {
    if (!this.canManageTeam()) return { sucesso: false, mensagem: "Acesso negado." };

    const senhaTemp = resetarSenha(userId);
    if (senhaTemp) {
        return { sucesso: true, mensagem: `Senha resetada. Nova senha temporária: ${senhaTemp}` };
    }
    return { sucesso: false, mensagem: "Erro ao resetar senha." };
  },

  async desativarUsuarioMembro(userId: string): Promise<AuthResponse> {
    if (!this.canManageTeam()) return { sucesso: false, mensagem: "Acesso negado." };
    if (userId === this.getCurrentUserId()) return { sucesso: false, mensagem: "Você não pode desativar seu próprio acesso administrativo." };

    const sucesso = desativarUsuario(userId);
    return sucesso ? { sucesso: true, mensagem: "Membro desativado. O acesso foi bloqueado." } : { sucesso: false, mensagem: "Falha na operação." };
  },

  async reativarUsuarioMembro(userId: string): Promise<AuthResponse> {
    if (!this.canManageTeam()) return { sucesso: false, mensagem: "Acesso negado." };
    const sucesso = reativarUsuario(userId);
    return sucesso ? { sucesso: true, mensagem: "Acesso restaurado com sucesso." } : { sucesso: false, mensagem: "Falha na operação." };
  },

  listarTodosUsuariosCadastrados(): StoredUser[] {
    if (!this.canManageTeam()) return [];
    return listarTodosUsuarios();
  },

  /**
   * 📊 PROCESSAMENTO: Obtém todas as tarefas com tratamento de dados
   */
  getProcessedTasks(): ProjectTask[] {
    // 1. Carregar do estado em memória
    let tasks = [...projectTasks];
    
    // 2. Tentar hidratar do storage se estiver vazio (Resiliência)
    if (tasks.length === 0 && typeof window !== 'undefined') {
        const stored = localStorage.getItem('tasks');
        if (stored) {
            try {
                tasks = JSON.parse(stored);
            } catch (e) {}
        }
    }

    // 3. Garantir mapeamento de status e metadados
    return tasks.map(t => ({
        ...t,
        status: t.status || 'pendente',
        priority: t.priority || 'media',
        // Fallback para identificadores
        identifier: t.identifier || t.publicId || `TASK-${t.id}`
    }));
  },

  /** 
   * 🔍 Resiliência: Retorna a sigla do setor ou o próprio ID caso não encontre
   */
  getSectorSigla(sectorId: string): string {
    if (!sectorId) return 'GERAL';
    const sector = dynamicSectors.find(s => s.id === sectorId || s.sigla === sectorId);
    return sector?.sigla || sectorId;
  },

  /** 
   * ⏳ Cálculo de Atrasos: Retorna o rótulo e diferença de dias
   */
  getOverdueDifference(deadline: string): { label: string, days: number } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(deadline);
    date.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { label: "No prazo", days: diffDays };
    if (diffDays === 1) return { label: "Atrasada 1 dia", days: diffDays };
    return { label: `Atrasada ${diffDays} dias`, days: diffDays };
  },

  /** 
   * 🎯 IMPACTO: Calcula quais metas estratégicas estão em risco
   */
  getStrategicImpact(): Array<{ metaId: string, label: string, affectedBy: string[] }> {
    const overdue = this.getOverdueTasks();
    if (overdue.length === 0) return [];

    const impactMap = new Map<string, { label: string, sectors: Set<string> }>();

    overdue.forEach(task => {
        if (task.strategicMetaId) {
            const entry = impactMap.get(task.strategicMetaId) || { 
                label: `Objetivo Afetado (${task.strategicMetaId})`, 
                sectors: new Set<string>() 
            };
            entry.sectors.add(this.getSectorSigla(typeof task.sector === 'string' ? task.sector : (task as any).sectorId || ''));
            impactMap.set(task.strategicMetaId, entry);
        }
    });

    return Array.from(impactMap.entries()).map(([id, data]) => ({
        metaId: id,
        label: data.label,
        affectedBy: Array.from(data.sectors)
    }));
  },

  /** Obtém todas as tarefas processadas */
  async getTasks(): Promise<ProjectTask[]> {
    return this.getProcessedTasks();
  },

  /** Obtém tarefas atrasadas para um usuário ou geral */
  getOverdueTasks(userId?: string): ProjectTask[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.getProcessedTasks().filter(task => {
        const taskDate = new Date(task.deadline);
        const isAssigned = userId ? (task.assignedToId === userId || task.responsibleId === userId) : true;
        const isNotConcluded = task.status !== 'concluida' && task.status !== 'finalizado';
        return isAssigned && isNotConcluded && taskDate < today;
    });
  },

  /** Obtém tarefas que vencem hoje */
  getTasksDueToday(userId?: string): ProjectTask[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.getProcessedTasks().filter(task => {
        const taskDate = new Date(task.deadline);
        taskDate.setHours(0, 0, 0, 0);
        const isAssigned = userId ? (task.assignedToId === userId || task.responsibleId === userId) : true;
        const isNotConcluded = task.status !== 'concluida' && task.status !== 'finalizado';
        return isAssigned && isNotConcluded && taskDate.getTime() === today.getTime();
    });
  },

  /** Obtém tarefas solicitadas pelo usuário (Demandas enviadas a outros setores) */
  async getTasksRequestedBy(userId: string): Promise<ProjectTask[]> {
    return this.getProcessedTasks().filter(task => 
        task.assignedById === userId || (task as any).requesterId === userId
    );
  },


  /**
   * 📡 REAL-TIME: Inscrição para atualizações de tarefas (Firebase + Local)
   */
  subscribeToTasks(callback: (tasks: ProjectTask[]) => void): () => void {
    // 1. Adicionar ao array de ouvintes internos
    taskListeners.push(callback);
    
    // 2. Enviar dados atuais imediatamente
    callback(this.getProcessedTasks());

    // 3. Configurar Firebase onSnapshot para sincronização remota (Apenas no Estúdio com Auth ativa)
    if (!this.isBypass() && this.isStudioContext() && auth.currentUser) {
        try {
            activeTasksSubscribersCount++;
            if (activeTasksSubscribersCount === 1) {
                const tasksCol = collection(db, "tasks");
                // Ordenar por data de criação descrescente
                const q = query(tasksCol, orderBy("createdAt", "desc"));
                
                activeTasksUnsubscribe = onSnapshot(q, (snapshot) => {
                    if (!snapshot.empty) {
                        const firebaseTasks = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        } as ProjectTask));
                        
                        this._syncTasksWithFirebase(firebaseTasks);
                    }
                }, (error) => {
                    // Silenciar erro de permissão para visitantes ou usuários sem acesso total
                    if (error.code === 'permission-denied') {
                        console.log("Acesso restrito ao Firebase (Modo Somente Leitura)");
                    } else {
                        console.warn("Erro na sincronização de tarefas:", error.message);
                    }
                    // Forçar carregamento dos dados locais (fallback)
                    callback(this.getProcessedTasks());
                });
            }
        } catch (e) {
            console.warn("Real-time tasks simulation (offline mode):", e);
        }
    }

    // 4. Retornar função de cancelamento
    return () => {
        const index = taskListeners.indexOf(callback);
        if (index !== -1) taskListeners.splice(index, 1);
        
        if (!this.isBypass() && this.isStudioContext()) {
            activeTasksSubscribersCount--;
            if (activeTasksSubscribersCount <= 0 && activeTasksUnsubscribe) {
                 activeTasksUnsubscribe();
                 activeTasksUnsubscribe = null;
                 activeTasksSubscribersCount = 0;
            }
        }
    };
  },

  /** Internal: Sincroniza estado local com dados do servidor */
  _syncTasksWithFirebase(firebaseTasks: ProjectTask[]) {
    // Preservar tarefas locais que ainda não subiram para o firebase (IDs que começam com 't-')
    // e também tarefas de estresse ou correções manuais.
    const localPending = projectTasks.filter(t => 
        t.id.startsWith('t-') || 
        t.id.includes('stress') || 
        t.id.startsWith('corr-')
    );
    
    // Filtramos as tarefas do Firebase para remover duplicatas que possamos ter no localPending
    const filteredFirebase = firebaseTasks.filter(ft => !localPending.find(lp => lp.id === ft.id));

    // Atualizar projectTasks
    (projectTasks as any).length = 0;
    projectTasks.push(...filteredFirebase, ...localPending);
    
    // Notificar outros ouvintes se houver mudança
    this._broadcastTaskUpdate();
  },

  _broadcastTaskUpdate() {
    const tasks = this.getProcessedTasks();
    if (typeof window !== 'undefined') {
        saveToStorage('tasks', tasks);
    }
    taskListeners.forEach(cb => cb(tasks));
  },



  /** Obtém o ID do usuário atual (priorizando a sessão ativa) */
  getCurrentUserId(): string | null {
    if (typeof window === 'undefined') return null;
    
    // 1. Tentar pegar da sessão oficial (auth_session)
    try {
      const sessaoStr = localStorage.getItem("auth_session");
      if (sessaoStr) {
        const sessao = JSON.parse(sessaoStr);
        if (sessao && (sessao.id || sessao.userId)) {
          return sessao.id || sessao.userId;
        }
      }
    } catch (e) {}

    // 2. Fallback para chave legado de desenvolvimento
    return localStorage.getItem("current_user_id") || null;
  },

  /** Helper Interno: Registra log de auditoria imutável (Append-only) */
  _logAudit(task: ProjectTask, action: string, comment?: string, statusOverride?: ProjectTask['status']): void {
    const user = this.getCurrentUser();
    if (!task.history) task.history = [];
    
    const activeSector = user?.activeSector || 'GERAL';
    const activeRole = user?.assignments?.find(a => a.sector === activeSector)?.role || 'VIEWER';

    task.history.push({
      timestamp: new Date().toISOString(),
      userId: user?.id || 'sistema',
      userName: user?.name || 'Sistema',
      action: action.toUpperCase(),
      status: statusOverride || task.status,
      comment: comment || undefined,
      sector: activeSector,
      role: activeRole,
      sectorSigla: this.getSectorSigla(activeSector)
    });
  },

  /** Helper Interno: Verifica se o fluxo está congelado */
  _checkFrozen(task: ProjectTask): void {
    if (task.isFlowFrozen && !this.isCoordinator()) {
      throw new Error(`Operação Bloqueada: O fluxo desta tarefa está congelado para ajuste inicial ou revisão da coordenação.`);
    }
  },

  /** Verifica se o usuário possui papéis específicos ou capacidades (no setor ativo ou globalmente) */
  hasPermission(requiredRolesOrCapability: Role[] | string): boolean {
    // 🛡️ REGRA DE OURO: No site externo, ninguém tem permissão de escrita
    if (!this.isStudioContext()) return false;

    const user = this.getCurrentUser();
    if (!user) return false;
    
    // 🛡️ SOBERANIA ABSOLUTA
    if (user.role === 'ADMIN' || user.role === 'admin' || user.department === 'CGP') return true;

    // 🔍 Nova verificação por capacidade granular
    if (typeof requiredRolesOrCapability === 'string') {
        const perms = user.permissoes as any;
        if (perms && typeof perms[requiredRolesOrCapability] === 'boolean') {
            return perms[requiredRolesOrCapability];
        }
        // Fallback para as chaves antigas se existirem no objeto
        return !!(user.permissions as any)?.[requiredRolesOrCapability];
    }

    const requiredRoles = requiredRolesOrCapability;

    // 2. Verificação via Setor Ativo (se existir)
    if (user.activeSector) {
      const activeAssignment = user.assignments?.find(a => a.sector === user.activeSector);
      if (activeAssignment && requiredRoles.includes(activeAssignment.role)) return true;
    }
    
    // 3. Verificação Fallback: possui a role em QUALQUER setor vinculado?
    const hasAnyValidAssignment = user.assignments?.some(a => requiredRoles.includes(a.role));
    if (hasAnyValidAssignment) return true;

    // 4. Verificação Fallback: papel global legado
    return requiredRoles.includes(user.role as Role);
  },

  /** Obtém o usuário atual com suas permissões */
  getCurrentUser(): User | null {
    const userId = this.getCurrentUserId();
    if (!userId) return null;
    return getTeamMembers().find(u => u.id === userId) || null;
  },

  /** Verifica se usuário é coordenador ou admin (setor ativo ou global) */
  isCoordinator(): boolean {
    // 🛡️ No site externo, ninguém é coordenador (apenas leitura)
    if (!this.isStudioContext()) return false;

    const userId = this.getCurrentUserId();
    
    // 🛡️ SOBERANIA ABSOLUTA (Fail-Fast): Coordenação Geral e Extensão
    if (userId === '1' || userId === '5') return true; 

    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Admin Global ou Coordenação Institucional por Role
    if (user.role === 'ADMIN' || user.role === 'admin' || user.department === 'CGP') return true;
    
    // Coordenador (Global ou Setorial)
    const isGlobalCoord = ['COORDENADOR', 'COORD', 'coordinator'].includes(user.role);
    const hasSectorCoord = user.assignments?.some((a: any) => ['COORDENADOR', 'ADMIN', 'COORD', 'coordinator'].includes(a.role));
    
    return isGlobalCoord || hasSectorCoord;
  },

  /** 🔐 REGRA DE OURO: Apenas Coordenações Específicas gerenciam a equipe */
  canManageTeam(): boolean {
    // 🛡️ Proibido em contexto público
    if (!this.isStudioContext()) return false;

    const user = this.getCurrentUser();
    if (!user) return false;

    // 🔍 Nova verificação granular
    if (user.permissoes?.MANAGE_MEMBERS) return true;
    
    // IDs Mestres: Aisamaque (1), Danielle (5), Dayane (4 - Executiva)
    if (user.id === '1' || user.id === '5' || user.id === '4') return true;

    // Setores de Coordenação
    if (user.department === 'CGP' || user.department === 'EXTENSÃO') return true;
    
    return false;
  },

  /** 🔐 SEGURANÇA: Usuário edita apenas seu próprio perfil (Exceto Coordenações) */
  canEditUserProfile(targetUserId: string): boolean {
    const currentId = this.getCurrentUserId();
    if (!currentId) return false;

    // Dono do perfil pode editar seus próprios dados básicos
    if (currentId === targetUserId) {
        return true; 
    }
    
    // Coordenação pode editar qualquer um
    return this.canManageTeam();
  },

  /** 🔐 Governança: Apenas coordenadores/admins podem trocar fotos de perfil */
  canChangeAvatar(): boolean {
    return this.isCoordinator();
  },

  /** 
   * 🛡️ GOVERNANÇA PMA: Verifica se o usuário tem autorização para o Núcleo Estratégico
   * Restrito aos líderes: Danielle (5), Amanda (15), Dayane (4), Bruna (3) e Aisamaque (1)
   */
  canEditStrategicInfo(): boolean {
    // 🛡️ Regra de Ouro: Proibido no site público
    if (!this.isStudioContext()) return false;

    const user = this.getCurrentUser();
    if (!user) return false;
    
    if (this.isBypass()) return true;

    // IDs autorizados conforme governança Rede Inova
    const authorizedIds = ['1', '3', '4', '5', '15'];
    return authorizedIds.includes(user.id);
  },

  /** 🔍 GOVERNANÇA PMA: Matriz de Permissões para o Estúdio Digital */
  canPublish(userId: string): boolean {
    if (!this.isStudioContext()) return false;
    
    const user = userId === this.getCurrentUserId() ? this.getCurrentUser() : encontrarUsuarioPorId(userId);
    if (!user) return false;

    // 🔍 Nova verificação granular
    if (user.permissoes?.PUBLISH_CONTENT) return true;

    // Aisamaque (1), Danielle (5), Amanda (15) e Dayane (4 - Backup)
    const publishers = ['1', '5', '15', '4'];
    return publishers.includes(userId);
  },

  canApprove(userId: string): boolean {
    return this.canPublish(userId);
  },

  /** 🔐 PERMISSÃO CMS: Verifica se o usuário pode editar o conteúdo do site (Modo Estúdio) */
  podeEditar(userId: string): boolean {
    if (!this.isStudioContext()) return false;
    if (!userId) return false;
    
    const user = userId === this.getCurrentUserId() ? this.getCurrentUser() : encontrarUsuarioPorId(userId);
    if (!user) return false;

    // 🔍 Nova verificação granular (texto ou visual)
    if (user.permissoes?.EDIT_TEXT || user.permissoes?.EDIT_VISUAL) return true;

    // 🛡️ SOBERANIA ABSOLUTA (Liderança Estratégica)
    // Pode Editar: Aisamaque, Bruna, Dayane, Danielle, Amanda, Sara e Thaissa
    const editors = ['1', '3', '4', '5', '15', '16', '17'];
    if (editors.includes(userId)) return true;

    // Fallback por setor (ASCOM/ACESSIBILIDADE/CGP)
    const allowedSectors = ['ASCOM', 'ACESSIBILIDADE', 'CGP'];
    if (allowedSectors.includes(user.department)) return true;

    return user.role === 'ADMIN' || user.role === 'coordinator' || (user as any).userRole === 'member_editor';
  },

  /** 🛡️ Governança: Apenas quem tem permissão de publicação pode recusar ou solicitar ajustes */
  canRejectContent(userId: string): boolean {
    return this.canPublish(userId);
  },

  /** 📂 Objetivos por Setor (ASCOM, Tecnologia, etc) */
  getSectorObjectives() {
    return staticSectorObjectives;
  },

  getSectorObjective(id: string) {
    return staticSectorObjectives[id] || null;
  },

  // ────────────────────────────────────


  // ────────────────────────────────────
  // PROJECT OBJECTIVES & PROGRESS
  // ────────────────────────────────────

  async getProjectObjectives(): Promise<ProjectObjective[]> {
    // 🛡️ MODO PÚBLICO OU BYPASS: Retorna dados locais imediatamente para evitar erros de permissão
    if (!this.isStudioContext() || this.isBypass() || this.isAuthenticatedLocally()) {
        return [...activeMockObjectives];
    }
    
    try {
      const q = query(collection(db, "projectObjectives"));
      const querySnapshot = await getDocs(q);
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProjectObjective[];
      
      return data.length > 0 ? data : activeMockObjectives;
    } catch (error: any) {
      // 🛡️ FALLBACK RESILIENTE: Se falhar (ex: falta de permissão em ambiente público), usa Mock Data
      console.warn("Firebase Objectives Load (Insufficient Permissions). Falling back to mock data.");
      return [...activeMockObjectives];
    }
  },

  // 🟢 ÁREA: GOVERNANÇA DE EXTENSÃO
  // ────────────────────────────────────

  getExtensionIndicators(): any[] {
    return activeExtensionIndicators;
  },

  updateExtensionIndicator(id: number, value: string): void {
    activeExtensionIndicators = activeExtensionIndicators.map((ind: any) => 
      ind.id === id ? { ...ind, value } : ind
    );
    saveToStorage('extension_indicators', activeExtensionIndicators);
    safeToast({ title: "Indicador Atualizado", description: "O novo valor foi salvo e sincronizado." });
  },

  getStrategicPareceres(): any[] {
    return activeStrategicPareceres;
  },

  addStrategicParecer(content: string): void {
    const user = this.getCurrentUser();
    const newParecer = {
      id: Date.now().toString(),
      content,
      author: user?.name || "Coordenação de Extensão",
      date: new Date().toISOString(),
    };
    activeStrategicPareceres = [newParecer, ...activeStrategicPareceres];
    saveToStorage('strategic_pareceres', activeStrategicPareceres);
    safeToast({ title: "Parecer Registrado", description: "Sua diretriz estratégica foi publicada no Radar." });
  },

  async addExtensionTaskComment(taskId: string, comment: string): Promise<void> {
    const task = projectTasks.find(t => t.id === taskId);
    if (!task) throw new Error("Tarefa não encontrada.");

    this._logAudit(
      task, 
      "PARECER TÉCNICO DE EXTENSÃO", 
      comment, 
      task.status
    );

    saveToStorage('tasks', projectTasks);
    await this._syncTaskToFirestore(task);
    notifyTaskListeners();
    safeToast({ 
      title: "Comentário Enviado", 
      description: `Seu parecer foi anexado à tarefa e ficará visível para o setor responsável (${task.sector}).` 
    });
  },

  async addExtensionRadarAnalysis(taskId: string, analysisData: any): Promise<void> {
    const task = projectTasks.find(t => t.id === taskId);
    if (!task) throw new Error("Tarefa não encontrada.");

    // Registro Estruturado no Histórico
    const auditComment = `
      ANÁLISE ESTRUTURADA:
      - Material desenvolvido: ${analysisData.materialInfo}
      - Corresponde às expectativas: ${analysisData.meetsExpectations ? "SIM" : "NÃO"}
      - Ultrapassou as expectativas: ${analysisData.exceedsExpectations ? "SIM" : "NÃO"}
      - Atividade realizada: ${analysisData.activityNotPerformed ? "NÃO" : "SIM"}
    `;

    this._logAudit(
      task, 
      "ANÁLISE RADAR TRANSVERSAL", 
      auditComment.trim(), 
      'concluida'
    );

    // Atualização de Status e Metadados
    task.status = 'concluida';
    task.statusId = 'st-concluida';
    task.completedAt = new Date().toISOString();
    (task as any).radarAnalyzed = true;
    (task as any).radarAnalysisData = analysisData;

    saveToStorage('tasks', projectTasks);
    await this._syncTaskToFirestore(task);
    notifyTaskListeners();
    
    // Notificação real ao Setor
    safeToast({ 
      title: "Tarefa Concluída via Radar", 
      description: `O setor ${task.sector} foi notificado sobre a conclusão e análise institucional.`,
    });
  },

  async getStrategicPlanning(): Promise<StrategicPlanMonth[]> {
    return strategicPlanning;
  },

  async updateProjectObjective(id: string, updates: Partial<ProjectObjective>): Promise<void> {
    if (!this.canEditStrategicInfo()) {
      throw new Error("Permissão Negada: Apenas os líderes designados do Núcleo Estratégico podem editar este conteúdo.");
    }

    if (this.isBypass() || this.isAuthenticatedLocally()) {
      activeMockObjectives = activeMockObjectives.map((obj: any) => 
        obj.id === id ? { ...obj, ...updates } : obj
      );
      saveToStorage('project_objectives', activeMockObjectives);
      safeToast({ title: "Objetivo Atualizado", description: "O conteúdo institucional foi sincronizado com sucesso." });
      return;
    }
  },

  async updateProjectObjectiveGoal(objectiveId: string, goalId: string, updates: Partial<any>): Promise<void> {
    if (!this.canEditStrategicInfo()) {
      throw new Error("Permissão Negada: Apenas os líderes designados podem editar metas estratégicas.");
    }

    if (this.isBypass() || this.isAuthenticatedLocally()) {
      activeMockObjectives = activeMockObjectives.map((obj: any) => {
        if (obj.id === objectiveId) {
          return {
            ...obj,
            goals: obj.goals.map((g: any) => g.id === goalId ? { ...g, ...updates } : g)
          }
        }
        return obj;
      });
      saveToStorage('project_objectives', activeMockObjectives);
      safeToast({ title: "Meta Atualizada", description: "O progresso e descrição da meta foram sincronizados." });
      return;
    }
  },

  async addProjectGoalToObjective(objectiveId: string, goalData: any): Promise<void> {
     if (!this.canEditStrategicInfo()) {
       throw new Error("Permissão Negada: Apenas os líderes designados podem adicionar novas metas estratégicas.");
     }

     if (this.isBypass() || this.isAuthenticatedLocally()) {
       activeMockObjectives = (activeMockObjectives || []).map((obj: any) => {
         if (obj.id === objectiveId) {
           return {
             ...obj,
             goals: [...(obj.goals || []), { ...goalData, id: `g-${Date.now()}`, logs: [] }]
           }
         }
         return obj;
       });
       saveToStorage('project_objectives', activeMockObjectives);
       safeToast({ title: "Atividade Adicionada", description: "Uma nova frente estratégica foi inserida com sucesso." });
       return;
     }
  },

  async deleteProjectGoalFromObjective(objectiveId: string, goalId: string): Promise<void> {
    if (!this.canEditStrategicInfo()) {
      throw new Error("Permissão Negada: Apenas os líderes designados podem remover metas estratégicas.");
    }

    if (this.isBypass() || this.isAuthenticatedLocally()) {
       activeMockObjectives = activeMockObjectives.map((obj: any) => {
         if (obj.id === objectiveId) {
           return {
             ...obj,
             goals: obj.goals.filter((g: any) => g.id !== goalId)
           }
         }
         return obj;
       });
       saveToStorage('project_objectives', activeMockObjectives);
       safeToast({ title: "Atividade Removida", description: "A atividade foi excluída do pilar estratégico." });
       return;
     }
  },

  async addProjectGoalLog(objectiveId: string, goalId: string, logData: any): Promise<void> {
    if (!this.canEditStrategicInfo()) {
      throw new Error("Permissão Negada: Apenas os líderes designados podem registrar evidências de execução mensal.");
    }

    if (this.isBypass() || this.isAuthenticatedLocally()) {
       activeMockObjectives = (activeMockObjectives || []).map((obj: any) => {
         if (obj.id === objectiveId) {
           return {
             ...obj,
             goals: (obj.goals || []).map((g: any) => {
               if (g.id === goalId) {
                 const newLogs = [...(g.logs || []), { ...logData, id: `log-${Date.now()}`, createdAt: new Date().toISOString() }];
                 
                 let totalProgress = 0;
                 if (g.targetValue && g.targetValue > 0) {
                    // Cálculo baseado em valores absolutos
                    const totalValue = newLogs.reduce((acc, log) => acc + (parseFloat(log.value) || 0), 0);
                    totalProgress = Math.min(Math.round((totalValue / g.targetValue) * 100), 100);
                 } else {
                    // Cálculo baseado em soma de porcentagens (modelo anterior)
                    totalProgress = Math.min(newLogs.reduce((acc, log) => acc + (parseFloat(log.progressPercent) || 0), 0), 100);
                 }

                 return { ...g, logs: newLogs, progress: totalProgress };
               }
               return g;
             })
           }
         }
         return obj;
       });
       saveToStorage('project_objectives', projectObjectives);
       safeToast({ title: "Registro Mensal Salvo", description: "A execução foi documentada e o progresso total atualizado." });
       return;
     }
  },

  /** 📊 Agregação de Impacto Global para o PMA */
  getStrategicImpactStats() {
    const allGoals = (projectObjectives || []).flatMap((obj: any) => obj.goals || []);
    
    // Função auxiliar para somar valores de logs para uma determinada unidade
    const sumByUnit = (unit: string) => {
       return allGoals
         .filter((g: any) => g.unit?.toLowerCase().includes(unit.toLowerCase()))
         .reduce((acc: number, g: any) => {
            return acc + (g.logs || []).reduce((lAcc: number, log: any) => lAcc + (parseFloat(log.value) || 0), 0);
         }, 0);
    };

    return {
      municipalities: sumByUnit('municíp'),
      communities: sumByUnit('comunidad'),
      researchers: sumByUnit('pesquisador'),
      innovations: sumByUnit('inovaç')
    };
  },

  async updateProjectObjectiveProgress(objectiveId: string, goalId: string, progress: number): Promise<void> {
    if (!this.canEditStrategicInfo()) {
      throw new Error("Apenas os líderes designados do Núcleo Estratégico podem atualizar o progresso do projeto.");
    }

    if (this.isBypass() || this.isAuthenticatedLocally()) {
      const obj = projectObjectives.find((o: any) => o.id === objectiveId);
      if (obj) {
        const goal = obj.goals.find((g: any) => g.id === goalId);
        if (goal) {
          goal.progress = progress;
          saveToStorage('project_objectives', projectObjectives);
          
          safeToast({ 
            title: "Progresso Atualizado", 
            description: `A meta para o objetivo '${obj.title}' foi ajustada para ${progress}% e sincronizada no site público.`,
          });
        }
      }
      return;
    }



    try {
      const docRef = doc(db, "projectObjectives", objectiveId);
      const objDocs = await getDocs(query(collection(db, "projectObjectives")));
      const docSnap = objDocs.docs.find(d => d.id === objectiveId);
      
      if (docSnap) {
        const currentData = docSnap.data() as ProjectObjective;
        const updatedGoals = currentData.goals.map(g => g.id === goalId ? { ...g, progress } : g);
        await updateDoc(docSnap.ref, { goals: updatedGoals, updatedAt: new Date().toISOString() });
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  },



  async getNewsById(id: string): Promise<News | null> {
    if (this.isBypass() || this.isAuthenticatedLocally()) {
      return mockNews.find((n: any) => n.id === id) || null;
    }
    // Note: Em produção real buscaria do Firestore
    return mockNews.find((n: any) => n.id === id) || null;
  },

  subscribeToNews(callback: (newsData: News[]) => void): () => void {
    // 🛡️ MODO RESILIENTE: Sempre entrega o mock primeiro para evitar skeleton infinito
    callback([...mockNews]);
    
    // 🛡️ Assinatura em tempo real (Somente se autenticado no Firebase)
    if (auth.currentUser) {
      try {
          const q = query(collection(db, "news"), orderBy("publishedAt", "desc"), limit(10));
        return onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News)));
          }
        }, (error) => {
          if (error.code === 'permission-denied') {
            console.log("Acesso restrito a Notícias (Modo Somente Leitura)");
          } else {
            console.warn("Erro na sincronização de notícias:", error.message);
          }
          // Fallback já garantido pelo callback inicial, mas reforçamos aqui se necessário
          callback([...mockNews]);
        });
      } catch (err) {
          console.error("Falha ao criar listener de notícias:", err);
      }
    }
    return () => {};
  },

  async addNews(newsItem: Omit<News, "id">): Promise<string> {
    if (this.isBypass() || this.isAuthenticatedLocally()) {
      const id = `n-${Date.now()}`;
      const newEntry: News = {
        id,
        ...newsItem,
        publishedAt: newsItem.publishedAt || new Date().toISOString(),
      };
      mockNews.unshift(newEntry);
      notifyNewsListeners();
      safeToast({ title: "Notícia Publicada", description: "O conteúdo já está disponível no portal público." });
      return id;
    }

    try {
      const docRef = await addDoc(collection(db, NEWS_COLLECTION), {
        ...newsItem,
        publishedAt: newsItem.publishedAt || new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding news:", error);
      throw error;
    }
  },

  async updateNews(id: string, newsItem: Partial<News>): Promise<void> {
    if (this.isBypass() || this.isAuthenticatedLocally()) {
      const index = mockNews.findIndex((n: News) => n.id === id);
      if (index !== -1) {
        mockNews[index] = { ...mockNews[index], ...newsItem };
        notifyNewsListeners();
        safeToast({ title: "Notícia Atualizada", description: "As alterações foram salvas com sucesso." });
      }
      return;
    }
    try {
      const docRef = doc(db, NEWS_COLLECTION, id);
      await updateDoc(docRef, newsItem);
    } catch (error) {
      console.error("Error updating news:", error);
      throw error;
    }
  },

  async deleteNews(id: string): Promise<void> {
    if (this.isBypass() || this.isAuthenticatedLocally()) {
      const index = mockNews.findIndex((n: News) => n.id === id);
      if (index !== -1) {
        mockNews.splice(index, 1);
        notifyNewsListeners();
        safeToast({ title: "Notícia Excluída", description: "O conteúdo foi removido permanentemente." });
      }
      return;
    }
    try {
      const docRef = doc(db, NEWS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting news:", error);
      throw error;
    }
  },

  /**
   * 🔄 LISTENER REAL-TIME: REPOSITÓRIO DE DOCUMENTOS
   * Filtra documentos por setor ou visibilidade pública.
   */
  subscribeToDocuments(callback: (docs: InstitutionalFile[]) => void) {
    documentListeners.push(callback);

    // 1. Filtragem de Visibilidade
    const filterVisibleDocs = (allDocs: InstitutionalFile[]) => {
      const user = this.getCurrentUser();
      if (!user) return [];

      return allDocs.filter(doc => {
        // Regra: Documentos Institucionais ou marcados como Públicos são visíveis para todos
        if (doc.category === 'institucional' || doc.isPublic) return true;
        
        // Regra: Documentos de setor só visíveis para membros do setor (ou coordenação)
        const isCoordinator = this.isCoordinator() || this.isBypass();
        const sameSector = user.department === doc.sectorId;
        
        return isCoordinator || sameSector;
      });
    };

    // 2. Abrir listener Firestore
    let unsubscribeFirestore: (() => void) | null = null;
    
    try {
      const q = query(collection(db, DOCUMENTS_COLLECTION), orderBy("createdAt", "desc"));
      unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        const firestoreDocs = snapshot.docs.map(docSnap => ({
          ...docSnap.data(),
          id: docSnap.data().id || docSnap.id,
        })) as InstitutionalFile[];
        
        // Notificar listeners com dados filtrados
        documentListeners.forEach(cb => {
          try { cb(filterVisibleDocs(firestoreDocs)); } catch(e) {}
        });
      }, (error) => {
        if (error.code === 'permission-denied') {
            console.log("Documentos: Acesso restrito (Modo Público)");
        } else {
            console.warn("⚠️ Firestore docs listener falhou:", error.message);
        }
      });
    } catch (e) {
        console.warn("⚠️ Firestore indisponível para documentos.");
    }

    return () => {
      const idx = documentListeners.indexOf(callback);
      if (idx > -1) documentListeners.splice(idx, 1);
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  },

  /**
   * 📤 UPLOAD DE DOCUMENTO (STORAGE + FIRESTORE)
   */
  async uploadDocument(file: File, metadata: { category: InstitutionalFile['category']; isPublic: boolean }): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error("Usuário não autenticado");

    try {
      // 1. Upload para Firebase Storage
      const storagePath = `documents/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      // 2. Persistência de Metadados no Firestore
      const docData: Omit<InstitutionalFile, 'id'> = {
        name: file.name,
        category: metadata.category,
        sectorId: user.department || 'ALL',
        isPublic: metadata.isPublic,
        url: downloadUrl,
        storagePath: storagePath,
        size: file.size,
        type: file.type || 'application/pdf',
        uploadedBy: user.id,
        uploadedByName: user.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, DOCUMENTS_COLLECTION), docData);
      
      safeToast({ title: "Arquivo Enviado", description: `O arquivo ${file.name} foi processado com sucesso.` });
    } catch (error: any) {
      console.error("Erro no upload:", error);
      safeToast({ variant: "destructive", title: "Erro no Upload", description: error.message });
      throw error;
    }
  },

  /**
   * 🗑️ REMOVER DOCUMENTO
   */
  async deleteDocument(docId: string, storagePath: string): Promise<void> {
    try {
      const docRef = doc(db, DOCUMENTS_COLLECTION, docId);
      await deleteDoc(docRef);

      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);

      safeToast({ title: "Arquivo Removido" });
    } catch (error: any) {
      console.error("Erro ao deletar:", error);
      safeToast({ variant: "destructive", title: "Erro ao Deletar", description: error.message });
    }
  },



  saveToStorage(key: string, value: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  },

  getFromStorage<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
        return JSON.parse(value) as T;
    } catch {
        return value as unknown as T;
    }
  },



  /**
   * 🔥 HELPER: Sincroniza uma tarefa individual com o Firestore
   * Usa upsert: se já existe (por _firestoreDocId), atualiza. Senão, cria.
   */
  async _syncTaskToFirestore(task: ProjectTask): Promise<void> {
    try {
      const docId = (task as any)._firestoreDocId;
      const { _firestoreDocId, ...rawTaskData } = task as any;
      // Remove campos 'undefined' para evitar crashes locais do cache do Firestore
      const taskData = JSON.parse(JSON.stringify(rawTaskData, (k, v) => v === undefined ? null : v));

      if (docId) {
        // Atualizar documento existente
        const docRef = doc(db, TASKS_COLLECTION, docId);
        await updateDoc(docRef, { ...taskData, updatedAt: new Date().toISOString() });
      } else {
        // Criar novo documento
        const docRef = await addDoc(collection(db, TASKS_COLLECTION), { 
          ...taskData, 
          updatedAt: new Date().toISOString() 
        });
        (task as any)._firestoreDocId = docRef.id;
      }
    } catch (e: any) {
      console.warn(`⚠️ Firestore sync falhou para tarefa ${task.id}:`, e.message);
      // Fallback: dados continuam em memória + localStorage
    }
  },

  /** Obtém impacto estratégico detalhado de atrasos operacionais */
  getStrategicMetaImpact(): { metaId: string, label: string, affectedBy: string[] }[] {
      const overdue = this.getProcessedTasks().filter(t => t.status === 'atrasada' && t.strategicMetaId);
      
      const impact: Record<string, { metaId: string, label: string, affectedBy: string[] }> = {};

      overdue.forEach(task => {
          if (task.strategicMetaId) {
              if (!impact[task.strategicMetaId]) {
                  impact[task.strategicMetaId] = {
                      metaId: task.strategicMetaId,
                      label: "Meta impactada por atraso operacional",
                      affectedBy: []
                  };
              }
              impact[task.strategicMetaId].affectedBy.push(task.title);
          }
      });

      return Object.values(impact);
  },

  /** Obtém o Pipeline Visual do Projeto */
  getPipeline(): Record<string, ProjectTask[]> {
      const tasks = this.getProcessedTasks();
      return {
          'producao': tasks.filter(t => t.workflowStage === 'producao'),
          'acessibilizacao': tasks.filter(t => t.workflowStage === 'acessibilizacao'),
          'revisao': tasks.filter(t => t.workflowStage === 'revisao'),
          'publicacao': tasks.filter(t => t.workflowStage === 'publicacao')
      };
  },

  /** 
   * Novo Método: Movimentar tarefa entre estágios do fluxo
   */
  async movimentarTarefa(taskId: string, novoStatus: ProjectTask['status'], acao: string): Promise<void> {
    const user = this.getCurrentUser();
    const task = projectTasks.find(t => t.id === taskId);
    if (!task) throw new Error("Tarefa não encontrada.");

    // Permitir se coordenador ou bypass
    const allowed = this.isCoordinator() || this.isBypass();
    if (!allowed) {
      // Também permitir se for o responsável pela tarefa
      const isOwner = this.getCurrentUserId() === task.assignedToId;
      if (!isOwner) {
        throw new Error("Você não tem permissões suficientes para movimentar esta tarefa.");
      }
    }

    // Validação de anexo obrigatório para conclusão
    if (novoStatus === 'concluida' && (!task.attachments || task.attachments.length === 0)) {
        throw new Error("É necessário anexar pelo menos um arquivo ou link de evidência para concluir a tarefa.");
    }

    this._checkFrozen(task);

    // Atualizar status e histórico
    task.status = novoStatus;
    this._logAudit(task, acao);

    // Disparar automações baseadas no movimento
    this._handleAutomationTriggers(task);

    // 🔥 Sincronizar com Firestore e notificar listeners
    await this._syncTaskToFirestore(task);
    notifyTaskListeners();

    safeToast({ title: "Fluxo Atualizado", description: acao });
  },

  /** 
   * Novo Método: Aceitar Atribuição Setorial
   */
  async acceptTask(taskId: string, deadline: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error("Usuário não autenticado.");

    const task = projectTasks.find(t => t.id === taskId);
    if (!task) throw new Error("Tarefa não encontrada.");

    // Regra: Deve pertencer ao setor da tarefa (ou ser coordenador)
    const sameDept = user.department === task.sector;
    const isCoord = this.isCoordinator();

    if (!sameDept && !isCoord) {
      throw new Error("Você não pertence ao setor responsável por esta atribuição.");
    }

    this._checkFrozen(task);
    task.status = 'em_andamento';
    task.assignedToId = user.id;
    task.assignedToName = user.name;
    task.deadline = deadline;
    task.acceptedById = user.id;
    task.acceptedByName = user.name;
    task.acceptedAt = new Date().toISOString();

    this._logAudit(task, "Atribuição aceita pelo membro");

    // 🔥 Sincronizar com Firestore e notificar listeners
    await this._syncTaskToFirestore(task);
    notifyTaskListeners();

    safeToast({ 
      title: "Atribuição Aceita", 
      description: `Você assumiu esta responsabilidade com prazo para ${new Date(deadline).toLocaleDateString()}.` 
    });
  },

  /** 
   * Novo Método: Adicionar Anexo (Foto, PDF ou Link)
   */
  async addAttachment(taskId: string, nome: string, url: string, tipo: 'pdf' | 'imagem' | 'link'): Promise<void> {
    const user = this.getCurrentUser();
    const task = projectTasks.find(t => t.id === taskId);
    if (!task) throw new Error("Tarefa não encontrada.");
 
    if (!task.attachments) task.attachments = [];
    
    task.attachments.push({
      id: `att-${Date.now()}`,
      name: nome,
      url: url,
      type: tipo,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user?.id || 'sistema'
    });

    if (!task.history) task.history = [];
    task.history.push({
      timestamp: new Date().toISOString(),
      userId: user?.id || 'sistema',
      userName: user?.name || 'Sistema',
      action: `Anexo adicionado: ${nome} (${tipo})`,
      status: task.status
    });
 
    safeToast({ title: "Anexo Adicionado", description: "Registro vinculado com sucesso." });

    // 🔥 Sincronizar com Firestore e notificar listeners
    await this._syncTaskToFirestore(task);
    notifyTaskListeners();
  },

  /**
   * Novo Método: Encaminhar Tarefa para Outro Setor (Com Assinatura e Despacho)
   */
  async encaminharTarefa(taskId: string, setorDestino: any, despacho: string, senha: string): Promise<void> {
    // 1. Verificar Senha
    const isPasswordValid = await this.verifyUserPassword(senha);
    if (!isPasswordValid) {
      throw new Error("Senha de acesso incorreta. O trâmite não foi realizado.");
    }

    const task = projectTasks.find(t => t.id === taskId);
    if (!task) throw new Error("Tarefa não encontrada.");

    this._checkFrozen(task);

    const user = this.getCurrentUser();
    const siglaOrigem = this.getSectorSigla(task.sector as string);
    const siglaDestino = this.getSectorSigla(setorDestino);

    // 2. Registrar Saída e Pendência log de Envio e log de Destino
    this._logAudit(task, `ENCAMINHAMENTO: ${siglaOrigem} ➔ ${siglaDestino}`, despacho, 'aguardando_recebimento');

    // 3. Atualizar Status e Setor
    task.sector = setorDestino;
    task.status = 'aguardando_recebimento';
    task.assignedToId = ''; // Limpa o responsável atual ao mudar de setor
    task.assignedToName = 'Aguardando Membro do Setor';

    // 🔥 Sincronizar com Firestore e notificar listeners
    await this._syncTaskToFirestore(task);
    notifyTaskListeners();

    safeToast({ title: "Trâmite Realizado", description: `Enviado para ${siglaDestino}` });
  },

  /**
   * Novo Método: Receber Demanda (Assinado com Senha)
   */
  async receberTarefa(taskId: string, senha: string): Promise<void> {
    // 1. Verificar Senha
    const isPasswordValid = await this.verifyUserPassword(senha);
    if (!isPasswordValid) {
      throw new Error("Senha de acesso incorreta. Recebimento não confirmado.");
    }

    const task = projectTasks.find(t => t.id === taskId);
    if (!task) throw new Error("Tarefa não encontrada.");

    this._checkFrozen(task);

    const user = this.getCurrentUser();
    const sigla = this.getSectorSigla(user?.department || 'GERAL');

    // 2. Registrar Recebimento
    this._logAudit(task, `RECEBIMENTO OFICIAL: ${sigla}`, "Demanda aceita e assumida via assinatura digital.", 'em_andamento');

    // 3. Atualizar Status e Responsável
    task.status = 'em_andamento';
    task.assignedToId = user?.id || '';
    task.assignedToName = user?.name || 'Membro do Setor';

    // 🔥 Sincronizar com Firestore e notificar listeners
    await this._syncTaskToFirestore(task);
    notifyTaskListeners();

    safeToast({ title: "Demanda Recebida", description: "Você agora é o responsável por esta tarefa." });
  },



  /** Obtém etapas de um fluxo específico */
  getWorkflowSteps(flowId: string): FlowStep[] {
    return (standardFlowSteps as any[])
      .filter(s => s.flowId === flowId)
      .sort((a,b) => a.order - b.order);
  },

  /** Solicita ajuste no fluxo (Congela o processo) */
  async requestWorkflowAdjustment(taskId: string, notes: string): Promise<void> {
    const task = projectTasks.find(t => t.id === taskId);
    if (!task) throw new Error("Tarefa não encontrada.");
    
    task.isFlowFrozen = true;
    task.flowAdjustmentNotes = notes;
    
    const user = this.getCurrentUser();
    if (!task.history) task.history = [];
    task.history.push({
      timestamp: new Date().toISOString(),
      userId: user?.id || 'sistema',
      userName: user?.name || 'Sistema',
      action: 'SOLICITAÇÃO DE AJUSTE DE FLUXO',
      comment: `Fluxo congelado por solicitação do membro: ${notes}`,
      status: task.status
    });
    
    safeToast({ 
      title: "Fluxo Congelado", 
      description: "A solicitação foi enviada para a coordenação.",
      variant: "default"
    });
  },

  /** Confirma e ativa o fluxo na tarefa */
  async confirmWorkflow(taskId: string, flowId: string): Promise<void> {
    const task = projectTasks.find(t => t.id === taskId);
    if (!task) throw new Error("Tarefa não encontrada.");
    
    const steps = this.getWorkflowSteps(flowId);
    
    task.flowId = flowId;
    task.currentStepId = steps[0]?.id;
    task.isFlowFrozen = false;
    
    const user = this.getCurrentUser();
    if (!task.history) task.history = [];
    task.history.push({
      timestamp: new Date().toISOString(),
      userId: user?.id || 'sistema',
      userName: user?.name || 'Sistema',
      action: 'FLUXO ATIVADO',
      comment: `O fluxo "${standardFlows.find(f => f.id === flowId)?.name}" foi iniciado.`,
      status: task.status
    });

    // Disparar automações ao ativar fluxo (caso comece em etapa com gatilho)
    this._handleAutomationTriggers(task);
  },

  /**
   * Novo Método: Verificar Senha do Usuário para Atividade Crítica
   */
  async verifyUserPassword(password: string): Promise<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) return false;
    
    const user = getTeamMembers().find(u => u.id === userId);
    if (!user) return false;
    
    // Na nossa simulação, as senhas estão em auth-credentials.ts vinculadas ao StoredUser
    // Mas no User object de mock-data.ts também podemos ter ou simular
    // Para simplificar, comparamos com a senha padrão ou buscamos no vault
    const { encontrarUsuarioPorId } = await import('./auth-credentials');
    const storedUser = encontrarUsuarioPorId(userId);
    
    if (!storedUser) return false;
    
    // Simulação de verificação
    // Inova@2026 é a senha padrão para a maioria
    // A função verifyPassword do auth.ts cuida do hash
    const { verifyPassword } = await import('./auth');
    return verifyPassword(password, storedUser.passwordHash);
  },

  /** 
   * Métodos: Planejamento Estratégico (Roadmap)
   */
  async getPlanningBySector(sector: string): Promise<StrategicPlanMonth[]> {
    if (sector === 'ALL') return strategicPlanning;
    
    // Mapeamento interno de Sigla -> ID de Setor
    const sectorMap: Record<string, string> = {
      'CGP': 'cgp',
      'ADMINISTRATIVO': 'cgp',
      'ASCOM': 'ascom',
      'ACESSIBILIDADE': 'acessibilidade',
      'PLAN': 'plan',
      'SOCIAL': 'social',
      'REDES': 'redes',
      'CURADORIA': 'curadoria',
      'TECH': 'tech'
    };

    const targetSectorId = sectorMap[sector];

    // Filtra tarefas dentro dos meses e remove meses que ficarem vazios
    return strategicPlanning
      .map(month => ({
        ...month,
        tasks: month.tasks.filter(t => t.sectorId === targetSectorId)
      }))
      .filter(month => month.tasks.length > 0);
  },

  async togglePlanningTask(monthId: string, taskId: string): Promise<void> {
    const month = strategicPlanning.find(m => m.id === monthId);
    if (!month) throw new Error("Mês de planejamento não encontrado.");
    
    const task = month.tasks.find(t => t.id === taskId);
    if (!task) throw new Error("Tarefa estratégica não encontrada.");
    
    task.completed = !task.completed;
    
    // Se a tarefa foi completada, marcar todas as subtarefas como completadas também (Cascata)
    if (task.completed && task.subtasks) {
      task.subtasks.forEach(s => s.completed = true);
    }
    
    safeToast({ 
      title: task.completed ? "Meta Batida!" : "Meta Reaberta", 
      description: `O item "${task.label.substring(0, 30)}..." foi atualizado.` 
    });
  },

  async togglePlanningSubtask(monthId: string, taskId: string, subtaskId: string): Promise<void> {
    const month = strategicPlanning.find(m => m.id === monthId);
    if (!month) throw new Error("Mês de planejamento não encontrado.");
    
    const task = month.tasks.find(t => t.id === taskId);
    if (!task) throw new Error("Tarefa estratégica não encontrada.");

    if (!task.subtasks) throw new Error("Tarefa não possui subtarefas.");
    
    const subtask = task.subtasks.find(s => s.id === subtaskId);
    if (!subtask) throw new Error("Subtarefa não encontrada.");

    subtask.completed = !subtask.completed;

    // Se todas as subtarefas estiverem completas, marca a tarefa pai como completa
    const allSubtasksDone = task.subtasks.every(s => s.completed);
    if (allSubtasksDone && !task.completed) {
      task.completed = true;
      safeToast({ title: "Atividade Concluída!", description: "Todas as subtarefas foram entregues." });
    } else if (!allSubtasksDone && task.completed) {
      task.completed = false;
    }
    
    safeToast({ 
      title: subtask.completed ? "Item Concluído" : "Item Reaberto", 
      description: subtask.label 
    });
  },

  /**
   * Métodos: Painel de Rotas (Setoriais)
   */
  async getSectorActivities(sector: string): Promise<SectorActivity[]> {
    return sectorActivities.filter(a => a.sectorId === sector);
  },

  async addSectorActivity(activity: Omit<SectorActivity, 'id' | 'createdAt'>): Promise<string> {
    const id = `act-${Date.now()}`;
    const newActivity: SectorActivity = {
      id,
      ...activity,
      createdAt: new Date().toISOString()
    };
    sectorActivities.push(newActivity);
    safeToast({ title: "Atividade Adicionada", description: "Nova rota criada para o setor." });
    return id;
  },

  async deleteSectorActivity(id: string): Promise<void> {
    const index = sectorActivities.findIndex(a => a.id === id);
    if (index !== -1) {
      sectorActivities.splice(index, 1);
      safeToast({ title: "Atividade Removida", description: "A rota foi excluída do painel." });
    }
  },

  async addActivityStep(activityId: string, step: Omit<ActivityStep, 'id' | 'timestamp'>): Promise<void> {
    const activity = sectorActivities.find(a => a.id === activityId);
    if (!activity) throw new Error("Atividade não encontrada.");

    activity.steps.push({
      id: `step-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...step
    });

    safeToast({ title: "Passo Adicionado", description: "O fluxo da atividade foi atualizado." });
  },

  async updateActivityStatus(activityId: string, status: SectorActivity['status']): Promise<void> {
    const activity = sectorActivities.find(a => a.id === activityId);
    if (activity) {
      activity.status = status;
      safeToast({ title: "Status Atualizado", description: `Atividade agora está em: ${status}` });
    }
  },


  /** 
   * Novo Método: Edição Master para Coordenadores
   */
  async fullUpdateTask(taskId: string, updates: Partial<ProjectTask>): Promise<void> {
    const task = projectTasks.find(t => t.id === taskId);
    if (!task) throw new Error("Tarefa não encontrada.");

    // Permitir se for coordenador OU se for para desativar a trava (admin override)
    const isUnfreezing = updates.isFlowFrozen === false;
    
    if (!this.isCoordinator() && !isUnfreezing && !this.isBypass()) {
      throw new Error("Apenas coordenadores podem realizar edições estruturais ou desbloqueios.");
    }

    // Se a tarefa estiver congelada e não for uma ação de desbloqueio, impede mesmo para quem tem bypass (salvo coord)
    if (task.isFlowFrozen && updates.isFlowFrozen !== false && !this.isCoordinator()) {
        throw new Error("Tarefa Congelada: Contate a coordenação para ajustes.");
    }

    // Aplicar atualizações
    Object.assign(task, updates);
    
    this._logAudit(task, updates.isFlowFrozen === false ? "FLUXO DESBLOQUEADO ADMINISTRATIVAMENTE" : "Edição detalhada pela coordenação");

    safeToast({ title: "Tarefa Atualizada", description: "Alterações estruturais salvas." });
  },

  getPendingTasksCount(): number {
    const userId = this.getCurrentUserId();
    const user = this.getCurrentUser();
    if (!userId) return 0;
    
    // Antigo + Pendente de Aceite no setor do usuário
    return projectTasks.filter(t => {
      const isMine = t.assignedToId === userId && t.status !== 'concluida';
      const isSectorUnstarted = t.status === 'nao_iniciado' && t.sector === user?.department;
      return isMine || isSectorUnstarted;
    }).length;
  },

  // Page Content Management (CMS)
  async getPageContent(pageId: string, defaultContent: string): Promise<string> {
    const data = await this.getCMSData(pageId);
    return data.content || defaultContent;
  },

    /** 🎥 Obtém conteúdo e metadados de Libras para um campo do site */
  /** 🎥 Obtém conteúdo e metadados de Libras para um campo do site */
  async getCMSData(pageId: string, options?: { useDraft?: boolean }): Promise<{ 
    content: string; 
    librasVideoUrl?: string; 
    librasStatus?: 'UPDATED' | 'OUTDATED';
    contentDraft?: string;
    librasVideoUrlDraft?: string;
    history?: any[];
  } | null> {
    // 1. Tenta buscar do Firestore (Leitura é PÚBLICA para o site principal)
    if (typeof window !== 'undefined') {
      try {
        const docRef = doc(db, "editableContent", pageId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const base = {
            content: data.content || (typeof data === 'string' ? data : ""),
            librasVideoUrl: data.librasVideoUrl || "",
            librasStatus: data.librasStatus || 'UPDATED',
            contentDraft: data.contentDraft,
            librasVideoUrlDraft: data.librasVideoUrlDraft,
            history: data.history || []
          };

          // Se estivermos em modo estúdio, sobrepomos com o rascunho se ele existir
          if (options?.useDraft) {
            return {
              ...base,
              content: data.contentDraft !== undefined ? data.contentDraft : base.content,
              librasVideoUrl: data.librasVideoUrlDraft !== undefined ? data.librasVideoUrlDraft : base.librasVideoUrl
            };
          }

          // REGRA: Se o conteúdo está vazio no DB, retornamos null para não apagar o site
          if (!base.content && !base.librasVideoUrl) return null;

          return base;
        }
      } catch (error: any) {
        // Silencia erros de permissão e retorna null para preservação
        if (error.code !== 'permission-denied') {
          console.error("Error fetching CMS data:", error);
        }
        return null;
      }
    }
    
    // 2. Fallback para localStorage
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem(`page_content_metadata_${pageId}`);
      if (local) return JSON.parse(local);
    }

    return null;
  },

  /** 
   * 🌐 INTEGRAÇÃO DE DEMANDAS DO SITE (Fale Conosco)
   * Recebe solicitações da Landing Page e as converte em tarefas operacionais.
   */
  async submitSiteDemand(data: { name: string, email: string, municipality: string, sector: Sector, message: string }): Promise<void> {
    const newId = `site-${Date.now()}`;
    const newDemand: ProjectTask = {
      id: newId,
      publicId: `DM-${newId.slice(-4)}`,
      title: `Demanda do Site: ${data.name}`,
      description: data.message,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'), // 7 dias de prazo
      priority: 'media',
      status: 'pendente',
      statusId: 'st-pendente',
      assignedToId: 'unassigned',
      assignedToName: 'Aguardando Atribuição',
      sectorId: data.sector === 'SOCIAL' ? 'social' : data.sector === 'ASCOM' ? 'ascom' : data.sector === 'CURADORIA' ? 'curadoria' : 'cgp',
      sector: data.sector,
      typeId: 'tt-atividade',
      workflowStage: 'gestao',
      category: 'geral',
      visibility: 'Interno',
      approvalStatus: 'pendente',
      municipality: data.municipality,
      createdAt: new Date().toISOString(),
      history: [{
        timestamp: new Date().toISOString(),
        userId: 'sistema',
        userName: 'Landing Page',
        action: 'SUBMISSÃO EXTERNA',
        status: 'pendente',
        comment: `Contato realizado por ${data.name} (${data.email}) via site.`
      }]
    };

    // 1. Persistência Local
    projectTasks.unshift(newDemand);
    saveToStorage('tasks', projectTasks);

    // 2. Sincronização Firestore (se disponível)
    try {
      await this._syncTaskToFirestore(newDemand);
    } catch (e) {
      console.warn("Sincronização Firestore falhou, demanda mantida localmente.");
    }

    // 3. Notificação em tempo real (Dispara taskListeners na linha 221)
    notifyTaskListeners();
  },

  async updatePageContent(pageId: string, content: string): Promise<void> {
    return this.updatePageCMS(pageId, { content });
  },

  /** 🛠️ Salva apenas como Rascunho (Modo Estúdio) */
  async saveDraftCMS(pageId: string, updates: { content?: string; librasVideoUrl?: string }): Promise<void> {
    const user = this.getCurrentUser();
    if (!this.isAdmin() && user?.department !== 'ASCOM' && user?.department !== 'ACESSIBILIDADE' && user?.department !== 'CGP') {
      throw new Error("Acesso negado para edição de rascunho.");
    }

    if (typeof window !== 'undefined') {
      const docRef = doc(db, "editableContent", pageId);
      const existing = await this.getCMSData(pageId);
      
      const draftUpdates: any = {};
      if (updates.content !== undefined) draftUpdates.contentDraft = updates.content;
      if (updates.librasVideoUrl !== undefined) draftUpdates.librasVideoUrlDraft = updates.librasVideoUrl;

      await setDoc(docRef, {
        ...existing,
        ...draftUpdates,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  },

  /** 🚀 Publica os rascunhos de uma página (Efetiva no site público) */
  async publishCMS(pageId: string): Promise<void> {
    if (typeof window !== 'undefined') {
      const docRef = doc(db, "editableContent", pageId);
      const data = await this.getCMSData(pageId, { useDraft: true }); // Carrega o que está em rascunho
      
      // Carrega o original para gerar histórico
      const original = await this.getCMSData(pageId);

      const updates: any = {
        content: data.content,
        librasVideoUrl: data.librasVideoUrl,
        contentDraft: null, // Limpa rascunho após publicar
        librasVideoUrlDraft: null
      };

      // Chama a atualização com governança (histórico e tarefas)
      return this.updatePageCMS(pageId, updates);
    }
  },

  /** 🛠️ Atualiza conteúdo ou metadados de Libras com Governança */
  async updatePageCMS(pageId: string, updates: { content?: string; librasVideoUrl?: string, contentDraft?: any, librasVideoUrlDraft?: any }): Promise<void> {
    const user = this.getCurrentUser();
    const canEdit = this.isAdmin() || 
                    user?.department === 'ASCOM' || 
                    user?.department === 'ACESSIBILIDADE' ||
                    user?.department === 'CGP';

    if (!canEdit) {
      throw new Error("Acesso negado: Somente perfis autorizados podem gerenciar este conteúdo.");
    }

    if (typeof window !== 'undefined') {
      try {
        const docRef = doc(db, "editableContent", pageId);
        
        // 1. Carrega dados existentes para comparação (Lê sempre o público para histórico)
        const docSnap = await getDoc(docRef);
        const existingData = docSnap.exists() ? docSnap.data() : { content: "", librasVideoUrl: "" };

        let librasStatus = existingData.librasStatus || 'UPDATED';
        let history = [...(existingData.history || [])];

        // 2. Detecção de Mudança de Texto e Gestão de Histórico
        const isContentChanging = updates.content !== undefined && updates.content !== existingData.content;
        const isNewVideoProvided = updates.librasVideoUrl !== undefined && updates.librasVideoUrl !== "" && updates.librasVideoUrl !== existingData.librasVideoUrl;

        if (isContentChanging) {
          // Salva versão anterior no histórico
          history.unshift({
            content: existingData.content || "",
            librasVideoUrl: existingData.librasVideoUrl || "",
            updatedAt: new Date().toISOString(),
            updatedBy: this.getCurrentUserId(),
            updatedByName: user?.name || "Sistema"
          });
          
          if (history.length > 10) history = history.slice(0, 10);

          if (!isNewVideoProvided) {
            librasStatus = 'OUTDATED';
            
            // 🚀 GERAÇÃO AUTOMÁTICA DE TAREFA
            const taskId = `libras-sync-${Date.now()}`;
            const syncTask: ProjectTask = {
              id: taskId,
              publicId: `LBS-${taskId.slice(-4)}`,
              title: `Atualizar Tradução: ${pageId}`,
              description: `O texto da seção [${pageId}] foi alterado. É necessário gravar e vincular um novo vídeo de Libras correspondente.\n\nConteúdo Novo: "${updates.content}"`,
              deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
              priority: 'alta',
              status: 'pendente',
              statusId: 'st-pendente',
              assignedToId: 'unassigned',
              assignedToName: 'Núcleo TILSP',
              sectorId: 'acessibilidade',
              sector: 'ACESSIBILIDADE',
              typeId: 'tt-atividade',
              workflowStage: 'gestao',
              category: 'comunicacao',
              visibility: 'Interno',
              approvalStatus: 'pendente',
              createdAt: new Date().toISOString(),
              history: [{
                timestamp: new Date().toISOString(),
                userId: 'sistema',
                userName: 'Governança TILSP',
                action: 'GERAÇÃO AUTOMÁTICA',
                status: 'pendente',
                comment: `Tarefa gerada autonomamente via Studio.`
              }]
            };

            projectTasks.unshift(syncTask);
            saveToStorage('tasks', projectTasks);
            this._syncTaskToFirestore(syncTask).catch(console.warn);
            notifyTaskListeners();
          }
        }

        if (isNewVideoProvided) {
          librasStatus = 'UPDATED';
        }
        const finalData = {
            ...existingData,
            ...updates,
            librasStatus,
            history,
            pageId,
            updatedAt: new Date().toISOString(),
            updatedBy: this.getCurrentUserId(),
            updatedByName: user?.name || "Sistema"
        };

        await setDoc(docRef, finalData, { merge: true });
        
        // Cache local
        localStorage.setItem(`page_content_metadata_${pageId}`, JSON.stringify(finalData));
      } catch (error) {
        console.error("Erro ao atualizar CMS:", error);
        throw error;
      }
    }
  },

  // ────────────────────────────────────
  // FORMATAÇÃO E UI
  // ────────────────────────────────────



  formatDepartment(dept?: string): string {
    if (!dept) return 'Setor Não Definido';
    const mapping: Record<string, string> = {
      'ASCOM': 'Assessoria de Comunicação',
      'ACESSIBILIDADE': 'Núcleo de Acessibilidade',
      'COORD_GERAL': 'Coordenação Geral',
      'COORD_TECNICO': 'Coordenação Técnica',
      'PLAN': 'Planejamento e Monitoramento',
      'SOCIAL': 'Articulação Social',
      'REDES': 'Parcerias e Redes',
      'CURADORIA': 'Pesquisa e Curadoria',
      'TECH': 'Tecnologia e Dados',
      'INTERNAL_COORDINATION': 'Coordenação Interna',
    };
    return mapping[dept] || dept;
  },

  // ────────────────────────────────────
  // CONFIG & BYPASS
  // ────────────────────────────────────

  /** Obtém um termo do glossário com informações de edição */
  async getGlossaryTerm(eixoId: string, termName: string): Promise<any> {
    if (this.isBypass() || this.isAuthenticatedLocally()) return null;
    
    try {
      const q = query(
        collection(db, "glossaryTerms"),
        orderBy("updatedAt", "desc")
      );
      const snapshot = await getDocs(q);
      const doc = snapshot.docs.find(
        d => d.data().eixoId === eixoId && d.data().term === termName
      );
      
      return doc ? doc.data() : null;
    } catch (error) {
      console.error("Error fetching glossary term:", error);
      return null;
    }
  },

  /** Atualiza um termo do glossário */
  async updateGlossaryTerm(eixoId: string, termName: string, updates: any): Promise<void> {
    if (!this.hasPermission('canEditGlossary')) {
      throw new Error("Você não tem permissão para editar glossários.");
    }

    try {
      const q = query(
        collection(db, "glossaryTerms")
      );
      const snapshot = await getDocs(q);
      const existingDoc = snapshot.docs.find(
        d => d.data().eixoId === eixoId && d.data().term === termName
      );

      if (existingDoc) {
        await updateDoc(existingDoc.ref, {
          ...updates,
          updatedAt: new Date().toISOString(),
          updatedBy: this.getCurrentUserId(),
        });
      } else {
        await addDoc(collection(db, "glossaryTerms"), {
          eixoId,
          term: termName,
          ...updates,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          updatedBy: this.getCurrentUserId(),
        });
      }
    } catch (error) {
      console.error("Error updating glossary term:", error);
      throw error;
    }
  },

  // ────────────────────────────────────
  // LAB LISSA STATIONS MANAGEMENT
  // ────────────────────────────────────

  /** Obtém configurações de uma estação do Lab Lissa */
  async getLabStation(stationId: string): Promise<any> {
    if (this.isBypass() || this.isAuthenticatedLocally()) return null;
    
    try {
      const q = query(
        collection(db, "labStations")
      );
      const snapshot = await getDocs(q);
      const doc = snapshot.docs.find(d => d.data().stationId === stationId);
      
      return doc ? doc.data() : null;
    } catch (error) {
      console.error("Error fetching lab station:", error);
      return null;
    }
  },

  /** Atualiza configurações da estação */
  async updateLabStation(stationId: string, updates: any): Promise<void> {
    if (!this.hasPermission('canEditStation')) {
      throw new Error("Você não tem permissão para editar as estações do Lab.");
    }

    try {
      const q = query(collection(db, "labStations"));
      const snapshot = await getDocs(q);
      const existingDoc = snapshot.docs.find(d => d.data().stationId === stationId);

      if (existingDoc) {
        await updateDoc(existingDoc.ref, {
          ...updates,
          updatedAt: new Date().toISOString(),
          updatedBy: this.getCurrentUserId(),
        });
      } else {
        await addDoc(collection(db, "labStations"), {
          stationId,
          ...updates,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          updatedBy: this.getCurrentUserId(),
        });
      }
    } catch (error) {
      console.error("Error updating lab station:", error);
      throw error;
    }
  },

  // ────────────────────────────────────
  // MULTIMEDIA MANAGEMENT
  // ────────────────────────────────────

  /** Registra um upload de mídia no Firestore */
  async recordMediaUpload(type: 'image' | 'video', data: {
    name: string;
    url: string;
    pageId?: string;
    glossaryTermId?: string;
  }): Promise<string> {
    if (!this.hasPermission('canUploadMedia')) {
      throw new Error("Você não tem permissão para fazer upload de mídia.");
    }

    try {
      const docRef = await addDoc(collection(db, "mediaLibrary"), {
        type,
        ...data,
        uploadedBy: this.getCurrentUserId(),
        uploadedByName: this.getCurrentUser()?.name || "Sistema",
        uploadedAt: new Date().toISOString(),
      });
      
      return docRef.id;
    } catch (error) {
      console.error("Error recording media upload:", error);
      throw error;
    }
  },

// Redundant block removed
  /**
   * OBTER NOTIFICAÇÕES DO USUÁRIO
   */
  obterNotificacoes(usuarioId: string, apenasNaoLidas: boolean = false): any[] {
    let notifs = notificacoes.get(usuarioId);
    
    // Hidratação se o mapa estiver vazio (após refresh)
    if (!notifs) {
      const saved = loadFromStorage(`notifs_${usuarioId}`, []);
      notificacoes.set(usuarioId, saved);
      notifs = saved;
    }
    
    if (apenasNaoLidas) {
      return notifs!.filter((n: any) => !n.lida);
    }
    
    return notifs!;
  },

  /**
   * MARCAR NOTIFICAÇÃO COMO LIDA
   */
  marcarComoLida(notificacaoId: string): boolean {
    const allNotifs = Array.from(notificacoes.values());
    for (const notifs of allNotifs) {
      const notif = notifs.find(n => n.id === notificacaoId);
      if (notif) {
        notif.lida = true;
        notif.dataLeitura = new Date().toISOString();
        return true;
      }
    }
    return false;
  },

  /**
   * MARCAR TODAS AS NOTIFICAÇÕES COMO LIDAS
   */
  marcarTodasComoLidas(usuarioId: string): void {
    const notifs = notificacoes.get(usuarioId) || [];
    notifs.forEach(notif => {
      notif.lida = true;
      notif.dataLeitura = new Date().toISOString();
    });
  },

  /**
   * OBTER CONTAGEM DE NOTIFICAÇÕES NÃO LIDAS
   */
  obterContagemNaoLidas(usuarioId: string): number {
    return (notificacoes.get(usuarioId) || []).filter(n => !n.lida).length;
  },

  /**
   * OBTER ARQUIVOS COM FILTRO DE VISIBILIDADE
   */
  obterArquivosVisiveis(usuarioId: string, area?: AreasAtuacao): ArquivoRastreado[] {
    const usuarioResponsabilidades = this.obterResponsabilidades(usuarioId);
    const areasPrincipiasUsuario = usuarioResponsabilidades?.areasPrincipais || [];

    return Array.from(arquivosRastreados.values()).filter(arquivo => {
      // Se upload foi rejeitado, apenas o uploader vê
      if (arquivo.aprovacao?.status === 'rejeitado') {
        return arquivo.uploadadoPor === usuarioId;
      }

      // Se ainda está pendente, apenas admin ou uploader vê
      if (arquivo.aprovacao?.status === 'pendente') {
        const podeVer = this.podeAprovar(usuarioId) || arquivo.uploadadoPor === usuarioId;
        return podeVer;
      }

      // Arquivo aprovado - aplicar filtro de visibilidade
      if (arquivo.visibilidade === VisibilidadeEnum.PUBLICO) {
        return true; // Todos veem
      }

      if (arquivo.visibilidade === VisibilidadeEnum.INTERNO) {
        // Apenas membros da mesma área veem
        const areasPrincipaisUsuario = usuarioResponsabilidades?.areasPrincipais || [];
        const membroArquivo = Array.from(membrosResponsabilidades.values())
          .find(m => m.usuarioId === arquivo.uploadadoPor);
        
        if (membroArquivo) {
          return areasPrincipaisUsuario.some(a => 
            membroArquivo.areasPrincipais.includes(a)
          );
        }
      }

      if (arquivo.visibilidade === VisibilidadeEnum.BLOQUEADO) {
        // Apenas uploader e aprovador veem
        return arquivo.uploadadoPor === usuarioId || arquivo.aprovacao?.aprovadoPor === usuarioId;
      }

      return false;
    }).filter(arquivo => !area || arquivo.area === area);
  },

  // ────────────────────────────────────
  // ASCOM MANAGEMENT (NEWS & TASKS)
  // ────────────────────────────────────

  /** Atualiza o status de uma notícia (Quadro Trello ASCOM) */
  async updateNewsStatus(newsId: string, status: 'fixed' | 'active' | 'archived'): Promise<void> {
    if (!this.hasPermission('canEditContent')) {
      throw new Error("Sem permissão para gerenciar notícias.");
    }
    
    try {
      const q = query(collection(db, "news"), where("id", "==", newsId));
      const snapshot = await getDocs(q);
      const docRef = snapshot.docs[0]?.ref;

      if (docRef) {
        await updateDoc(docRef, { 
          status,
          updatedAt: new Date().toISOString(),
          updatedBy: this.getCurrentUserId()
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar status da notícia:", error);
      throw error;
    }
  },

  /** Atualiza a imagem de uma notícia */
  async updateNewsImage(newsId: string, imageUrl: string): Promise<void> {
    if (!this.hasPermission('canEditImages')) {
      throw new Error("Sem permissão para editar imagens.");
    }

    try {
      const q = query(collection(db, "news"), where("id", "==", newsId));
      const snapshot = await getDocs(q);
      const docRef = snapshot.docs[0]?.ref;

      if (docRef) {
        await updateDoc(docRef, { 
          imageUrl,
          thumbnailUrl: imageUrl,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar imagem da notícia:", error);
      throw error;
    }
  },

  /** Aprovação de tarefa com Governança e RBAC */
  async aprovarTarefa(taskId: string, aprovado: boolean, feedback?: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error("Usuário não autenticado.");

    // 1. Verificação de Permissão (Coordenação ou Admin no setor ativo)
    if (!this.isCoordinator() && !this.isBypass()) {
      throw new Error("Apenas membros da Coordenação ou Administração podem aprovar atividades.");
    }

    const task = projectTasks.find(t => t.id === taskId);
    if (!task) throw new Error("Tarefa não encontrada.");

    // ⛔ TRAVA DE GOVERNANÇA: Bloqueio de Autoaprovação
    const wasCompletedByMe = task.history?.some(h => 
      h.action.includes('CONCLUÍDA') && h.userId === user.id
    );

    if (wasCompletedByMe && !this.isBypass()) {
      throw new Error("GOVERNANÇA: Você não pode aprovar uma tarefa que você mesmo concluiu. Outro coordenador deve realizar a revisão.");
    }

    if (this.isBypass()) {
      task.approvalStatus = aprovado ? 'aprovada' : 'rejeitada';
      task.approvedBy = user.id;
      task.rejectionFeedback = feedback;
      
      this._logAudit(task, aprovado ? 'APROVAÇÃO FINAL' : 'REPROVAÇÃO / SOLICITAÇÃO DE AJUSTE', feedback);

      safeToast({ 
        title: aprovado ? "Tarefa Aprovada" : "Solicitado Ajuste", 
        description: aprovado ? "A atividade foi finalizada com sucesso." : "O responsável receberá o feedback para correção." 
      });
      return;
    }

    // Lógica Firebase (omitida no bypass mas mantida a estrutura)
    try {
      const q = query(collection(db, "tasks"), where("id", "==", taskId));
      const snapshot = await getDocs(q);
      const docRef = snapshot.docs[0]?.ref;

      if (docRef) {
        await updateDoc(docRef, {
          approvalStatus: aprovado ? 'aprovada' : 'rejeitada',
          approvedBy: user.id,
          rejectionFeedback: feedback,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Erro ao aprovar tarefa:", error);
      throw error;
    }
  },

  /** 
   * CÁLCULO DE MÉTRICAS OPERACIONAIS SETORIAIS (Universal)
   */
  getSectorMetrics(sectorId: string): AscomMetrics {
    const tasks = this.getProcessedTasks().filter(t => t.sectorId === sectorId);
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM

    const publishedMonth = tasks.filter(t => 
      t.status === 'concluida' && 
      (t.isExtra || (t.completedAt && t.completedAt.startsWith(currentMonth)))
    ).length;

    const inProduction = tasks.filter(t => t.status === 'em_andamento').length;
    
    const overdue = tasks.filter(t => 
      new Date(t.deadline) < now && 
      t.status !== 'concluida'
    ).length;

    const waitingTasks = tasks.filter(t => t.status === 'aguardando_outro_setor').length;

    const blocked = tasks.filter(t => t.status === 'bloqueado').length;

    // SLA Médio
    const completedTasks = tasks.filter(t => t.status === 'concluida' && t.completedAt && t.createdAt);
    let avgDeliveryTime = "0 dias";
    
    if (completedTasks.length > 0) {
      const totalTime = completedTasks.reduce((acc, t) => {
        const start = t.createdAt ? new Date(t.createdAt).getTime() : 0;
        const end = t.completedAt ? new Date(t.completedAt).getTime() : 0;
        const diff = (end > 0 && start > 0) ? (end - start) : 0;
        return acc + diff;
      }, 0);
      
      const avgMs = totalTime / completedTasks.length;
      if (!isNaN(avgMs) && avgMs > 0) {
        const avgDays = (avgMs / (1000 * 60 * 60 * 24)).toFixed(1);
        avgDeliveryTime = `${avgDays} dias`;
      }
    }

    return {
      publishedMonth,
      inProduction,
      overdue,
      waitingAccessibility: waitingTasks,
      blocked,
      avgDeliveryTime
    };
  },

  // Mantendo compatibilidade com código existente
  getAscomMetrics(): AscomMetrics {
    return this.getSectorMetrics('ascom');
  },

  /** Atribuir nova atividade para membro */
  async atribuirTarefa(taskData: any): Promise<void> {
    if (!this.hasPermission('canManageTasks')) {
      throw new Error("Sem permissão para atribuir tarefas.");
    }

    try {
      await addDoc(collection(db, "tasks"), {
        ...taskData,
        status: 'pendente',
        approvalStatus: 'pendente',
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUserId()
      });
    } catch (error) {
      console.error("Erro ao atribuir tarefa:", error);
      throw error;
    }
  },

  /** 
   * MÉTRICAS ESPECÍFICAS DE ACESSIBILIDADE (FILA E SLA)
   */
  getAccessibilityMetrics(): AccessibilityMetrics {
    const tasks = this.getProcessedTasks().filter(t => t.sectorId === 'acessibilidade');
    
    const totalQueue = tasks.filter(t => t.status !== 'concluida').length;
    
    const byPriority = {
      alta: tasks.filter(t => t.priority === 'alta' && t.status !== 'concluida').length,
      media: tasks.filter(t => t.priority === 'media' && t.status !== 'concluida').length,
      baixa: tasks.filter(t => t.priority === 'baixa' && t.status !== 'concluida').length,
      urgente: tasks.filter(t => t.priority === 'urgente' && t.status !== 'concluida').length
    };

    const now = new Date();
    const overdueSLA = tasks.filter(t => {
      if (t.status === 'concluida') return false;
      const started = new Date(t.waitingTimeStartedAt || t.createdAt);
      const diffHrs = (now.getTime() - started.getTime()) / (1000 * 60 * 60);
      
      if (t.slaCategory === 'simples' && diffHrs > 2) return true;
      if (t.slaCategory === 'tecnico' && diffHrs > 24) return true;
      if (t.slaCategory === 'critico' && diffHrs > 48) return true;
      return false;
    }).length;

    const blockingTasksCount = tasks.filter(t => t.impactsPublication && t.status !== 'concluida').length;

    return {
      totalQueue,
      byPriority,
      overdueSLA,
      avgResponseTime: "4.2 horas", // Mock simulado
      blockingTasksCount
    };
  },

  /** 
   * TESTE DE ESTRESSE: CARGA DE DADOS EM TEMPO REAL
   */
  async runAccessibilityStressTest(batchSize: number = 15): Promise<void> {
    const stressBatch = Array.from({ length: batchSize }).map((_, i) => {
      // Metade das tarefas criadas estarão já em atraso (prazo no passado)
      const isOverdue = i % 2 === 0;
      const hoursOffset = isOverdue ? -(24 + (i * 2)) : (24 + (i * 2));
      const deadline = new Date(Date.now() + 1000 * 60 * 60 * hoursOffset).toISOString();

      return {
        id: `stress-${Date.now()}-${i}`,
        publicId: `ACESS-STRESS-${i}`,
        title: `Carga de Estresse: Demanda ${isOverdue ? 'Atrasada' : 'Normal'} ${i+1}`,
        description: 'Tarefa injetada sob carga para validação de resiliência e painel PMA.',
        deadline,
        priority: isOverdue ? 'urgente' : (i % 3 === 0 ? 'alta' : 'media'),
        statusId: isOverdue ? 'st-atrasada' : 'st-andamento',
        status: isOverdue ? 'atrasada' : 'em_andamento',
        typeId: 'tt-atividade',
        sectorId: 'acessibilidade',
        sector: 'ACESSIBILIDADE',
        originSectorId: 'ascom',
        impactsPublication: true,
        slaCategory: isOverdue ? 'critico' : 'simples',
        assignedToId: '',
        assignedToName: 'Aguardando Membro',
        category: 'geral',
        visibility: 'Interno',
        approvalStatus: 'pendente',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // Criado há 2 dias
        workflowStage: 'producao',
        waitingTimeStartedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        history: [{
          timestamp: new Date().toISOString(),
          userId: 'sistema',
          userName: 'PMA Audit',
          action: isOverdue ? 'ALERTA DE SOBRECARGA' : 'TAREFA REGISTRADA',
          status: isOverdue ? 'atrasada' : 'em_andamento',
          comment: "Inserção via teste de estresse de carga. " + (isOverdue ? "SLA rompido imediatamente." : "")
        }]
      };
    });

    (projectTasks as any[]).push(...stressBatch);
    if (typeof window !== 'undefined') {
      safeToast({ title: "Teste de Carga PMA Ativado", description: `${batchSize} tarefas injetadas para forçar os alertas e avaliação de resiliência.` });
    }
  },

  /** 
   * VALIDAÇÃO DE FECHAMENTO TERRITORIAL (8 Critérios Obrigatórios)
   */
  validateTerritorialClosure(task: ProjectTask): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!task.municipality) errors.push("Município é obrigatório.");
    if (!task.communityGroup) errors.push("Comunidade ou Grupo é obrigatório.");
    if (!task.targetPublic || task.targetPublic.length === 0) errors.push("Público-alvo é obrigatório.");
    if (!task.actionType) errors.push("Tipo de ação é obrigatório.");
    if (!task.participantCount || task.participantCount <= 0) errors.push("Número de participantes deve ser maior que zero.");
    if (!task.findingsSummary || task.findingsSummary.length < 20) errors.push("Resumo dos achados deve ter pelo menos 20 caracteres.");
    if (!task.generatedForwarding) errors.push("Encaminhamento gerado deve ser preenchido (mesmo que seja 'Nenhum').");
    if (!task.attachments || task.attachments.length === 0) errors.push("Pelo menos uma evidência (anexo) deve ser vinculada.");

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /** 
   * MÉTRICAS OPERACIONAIS TERRITORIAIS
   */
  getTerritorialMetrics(): TerritorialMetrics {
    const tasks = this.getProcessedTasks().filter(t => t.sectorId === 'social' && t.status === 'concluida');
    
    const byMunicipality: { [key: string]: number } = {};
    const byActionType: { [key: string]: number } = {};
    let participantsReached = 0;
    
    tasks.forEach(t => {
      if (t.municipality) {
        byMunicipality[t.municipality] = (byMunicipality[t.municipality] || 0) + 1;
      }
      if (t.actionType) {
        byActionType[t.actionType] = (byActionType[t.actionType] || 0) + 1;
      }
      participantsReached += (t.participantCount || 0);
    });

    const allTerritorialTasks = this.getProcessedTasks().filter(t => t.sectorId === 'social');
    const compliantTasks = tasks.filter(t => t.attachments && t.attachments.length > 0).length;
    const evidenceComplianceRate = tasks.length > 0 ? (compliantTasks / tasks.length) * 100 : 0;

    const pendingForwardings = this.getProcessedTasks().filter(t => t.dependencyId && t.status !== 'concluida').length;

    return {
      totalActions: tasks.length,
      byMunicipality,
      byActionType,
      participantsReached,
      evidenceComplianceRate,
      pendingForwardings
    };
  },

  /** 
   * MÉTRICAS DE PRODUÇÃO CIENTÍFICA
   */
  getScientificMetrics(): ScientificMetrics {
    const tasks = this.getProcessedTasks().filter(t => t.sectorId === 'curadoria');
    const completed = tasks.filter(t => t.status === 'concluida');
    
    return {
      totalInsumosRecebidos: tasks.filter(t => t.dependencyId?.startsWith('trig-')).length,
      emAnalise: tasks.filter(t => t.status === 'em_andamento' || t.status === 'pendente').length,
      produtosDesenvolvidos: completed.length,
      taxaValidacao: completed.length > 0 ? 100 : 0, // Simplificado
      artigosRelatorios: completed.filter(t => t.title.toLowerCase().includes('relatório') || t.title.toLowerCase().includes('artigo')).length,
      indicadoresGerados: completed.filter(t => t.title.toLowerCase().includes('indicador')).length
    };
  },

  /**
   * VALIDAÇÃO DE FECHAMENTO CIENTÍFICO
   */
  validateScientificClosure(task: ProjectTask): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Simulação de campos obrigatórios científicos
    if (!task.findingsSummary || task.findingsSummary.length < 50) {
      errors.push("A sistematização científica requer um resumo detalhado (mín. 50 caracteres).");
    }
    
    if (!task.conclusionLink) {
      errors.push("O link do produto técnico finalizado é obrigatório.");
    }

    // Validação de "Parecer de Curadoria" via comentário ou flag (simulado aqui como flag)
    if (!task.evidenceConfirmed) {
      errors.push("O produto requer validação formal da Curadoria antes de ser finalizado.");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /** 
   * MÉTRICAS DE PARCERIAS INSTITUCIONAIS
   */
  getPartnershipMetrics(): PartnershipMetrics {
    const tasks = this.getProcessedTasks().filter(t => t.sectorId === 'redes' || t.sector === 'REDES');
    
    const emProspeccao = tasks.filter(t => t.partnershipStage === 'prospecção').length;
    const ativas = tasks.filter(t => t.partnershipStage === 'execução').length;
    const concluidas = tasks.filter(t => t.status === 'concluida').length;
    
    // Simulação de demandas atendidas (tarefas que têm dependência)
    const demandasAtendidas = tasks.filter(t => t.status === 'concluida' && t.dependencyId).length;
    
    // Simulação de conversão: (Negociação ou Formalização ou Execução ou Concluída) / Total
    const converted = tasks.filter(t => 
      ['negociação', 'formalização', 'execução', 'avaliação'].includes(t.partnershipStage || '') || 
      t.status === 'concluida'
    ).length;
    
    const taxaConversao = tasks.length > 0 ? (converted / tasks.length) * 100 : 0;

    return {
      totalEmProspeccao: emProspeccao,
      ativas,
      concluidas,
      demandasAtendidas,
      totalParticipantesImpactados: 1250, // Mock simulado baseado em indicadores extraídos
      taxaConversao
    };
  },

  /**
   * VALIDAÇÃO DE FECHAMENTO DE PARCERIA
   */
  validatePartnershipClosure(task: ProjectTask): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!task.partnerName) errors.push("Nome do parceiro é obrigatório.");
    if (!task.partnershipStage) errors.push("Estágio da parceria deve ser definido.");
    
    // Obrigatoriedade de evidência documental para parcerias formalizadas ou concluídas
    if (['formalização', 'execução', 'avaliação'].includes(task.partnershipStage || '') || task.status === 'concluida') {
        const hasDocs = task.attachments && task.attachments.length > 0;
        if (!hasDocs) {
            errors.push("Documentos de formalização ou registros de execução são obrigatórios para este estágio.");
        }
    }

    if (!task.territorialImpactArea) {
      errors.push("Área de impacto territorial deve ser indicada.");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /** 
   * VISÃO ESTRATÉGICA GLOBAL (PMA)
   */
  getStrategicMetrics(): StrategicOverview {
    const allTasks = this.getProcessedTasks();
    const totalTasks = allTasks.length;
    const totalConcluded = allTasks.filter(t => t.status === 'concluida').length;
    const totalOverdue = allTasks.filter(t => t.status === 'atrasada').length;
    const totalBlocked = allTasks.filter(t => t.status === 'bloqueado').length;
    
    // Cálculo de Saúde dos Setores
    const sectorHealth: SectorHealth[] = sectors.map(s => {
      const sectorTasks = allTasks.filter(t => t.sectorId === s.id);
      const overdue = sectorTasks.filter(t => t.status === 'atrasada').length;
      const blocked = sectorTasks.filter(t => t.status === 'bloqueado').length;
      
      // Load Score: (Atrasadas * 2 + Em Andamento) / Total (Simulado)
      const loadScore = sectorTasks.length > 0 
        ? Math.min(100, ((overdue * 10 + blocked * 5) / sectorTasks.length) * 10) 
        : 0;

      return {
        sectorId: s.id,
        name: s.name,
        sigla: s.sigla,
        overdueCount: overdue,
        blockedCount: blocked,
        avgCycleTime: 3.5, // Mock
        loadScore,
        status: loadScore > 70 ? 'crítico' : loadScore > 40 ? 'alerta' : 'estável'
      };
    });

    // Identificação de Gargalos
    const recentBottlenecks = this.identifyBottlenecks(allTasks, sectorHealth);

    // Goal Compliance (Simulado baseado no Strategic Planning)
    const goalCompliance = 78;

    return {
      globalHealthScore: Math.max(0, 100 - (totalOverdue * 2 + totalBlocked * 3)),
      totalTasks,
      totalConcluded,
      totalOverdue,
      totalBlocked,
      sectorHealth,
      goalCompliance,
      recentBottlenecks
    };
  },

  /** Motor de identificação de problemas operacionais */
  identifyBottlenecks(tasks: ProjectTask[], health: SectorHealth[]) {
    const list: StrategicOverview['recentBottlenecks'] = [];
    
    // 1. Gargalos Registrados Manualmente
    const currentMonth = new Date().toISOString().slice(0, 7);
    const manualBottlenecks = bottlenecks.filter(b => b.status === 'ativo' && b.monthKey === currentMonth);
    
    manualBottlenecks.forEach(b => {
      list.push({
        id: b.id,
        type: 'bottleneck',
        sectorId: b.sectorId,
        reason: b.reason,
        severity: b.severity
      });
    });

    // 2. Setores Sobrecaregados (Detecção Automática se não houver manual)
    health.forEach(h => {
        if (h.status === 'crítico' && !manualBottlenecks.find(mb => mb.sectorId === h.sectorId)) {
            list.push({
                id: `bot-${h.sectorId}-${Date.now()}`,
                type: 'overload',
                sectorId: h.sectorId,
                reason: `O setor ${h.sigla} possui alto índice de tarefas atrasadas/travadas.`,
                severity: 'alta'
            });
        }
    });

    // 2. Bloqueios Críticos (Tarefas que bloqueiam muitos outros)
    const blocks = tasks.filter(t => t.status === 'bloqueado');
    if (blocks.length > 3) {
        list.push({
            id: `bot-sync-${Date.now()}`,
            type: 'bottleneck',
            sectorId: 'ALL',
            reason: `Existem ${blocks.length} tarefas travadas aguardando outros setores.`,
            severity: 'media'
        });
    }

    return list.slice(0, 5);
  },

  /** Geração de Ação Corretiva */
  async createCorrectiveAction(sectorId: string, reason: string): Promise<void> {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 2); // 2 dias para correção

    const correctiveTask: Partial<ProjectTask> = {
        id: `corr-${Date.now()}`,
        publicId: `CORR-${Date.now().toString().slice(-4)}`,
        title: "Ação Corretiva: Ajuste de Fluxo",
        description: `Garantir o desbloqueio do setor. Motivo: ${reason}`,
        sectorId: sectorId === 'ALL' ? 'cgp' : sectorId,
        priority: 'urgente',
        status: 'pendente',
        statusId: 'st-nao-iniciado',
        category: 'geral',
        typeId: 'tt-atividade',
        workflowStage: 'producao',
        deadline: deadline.toISOString()
    };

    projectTasks.push(correctiveTask as ProjectTask);
    this._logAudit(correctiveTask as ProjectTask, 'AÇÃO CORRETIVA GERADA', `PMA identificou necessidade de intervenção: ${reason}`);
    
    safeToast({
        title: "Ação Corretiva Gerada",
        description: "Nova tarefa estratégica criada para os responsáveis.",
    });
  },

   /** 
   * GOVERNANÇA E COORDENAÇÃO (CGP)
   */

  identifyInstitutionalRisks(): InstitutionalRisk[] {
    const allTasks = this.getProcessedTasks();
    const now = new Date();
    const risks: InstitutionalRisk[] = [];

    allTasks.forEach(task => {
      // Regra 1: Nunca aceitas (Paradas na fila)
      const isStuck = task.status === 'pendente' || task.status === 'aguardando_recebimento';
      if (isStuck && task.status !== 'concluida') {
        risks.push({
          id: `risk-stuck-${task.id}`,
          taskId: task.id,
          taskTitle: task.title,
          sectorId: task.sectorId,
          sectorSigla: typeof task.sector === 'string' ? task.sector : (task.sector?.sigla || 'SETOR'),
          riskType: 'not_accepted',
          delayDays: 0,
          assignedToName: task.assignedToName,
          severity: 'media',
          suggestedAction: 'Orientar Setor'
        });
      }

      // Regra 2: Atraso vencido
      if (task.status !== 'concluida' && task.deadline) {
        const deadline = new Date(task.deadline);
        if (now > deadline) {
          const diffTime = Math.abs(now.getTime() - deadline.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays >= 1) {
            risks.push({
              id: `risk-overdue-${task.id}`,
              taskId: task.id,
              taskTitle: task.title,
              sectorId: task.sectorId,
              sectorSigla: typeof task.sector === 'string' ? task.sector : (task.sector?.sigla || 'SETOR'),
              riskType: 'overdue',
              delayDays: diffDays,
              assignedToName: task.assignedToName,
              severity: diffDays >= 3 ? 'alta' : diffDays >= 2 ? 'media' : 'baixa',
              suggestedAction: diffDays >= 2 ? 'Registrar na Pasta de Gargalos' : 'Orientar Setor'
            });
          }
        }
      }
    });

    return risks.sort((a, b) => {
      const severityOrder = { alta: 3, media: 2, baixa: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    }).slice(0, 15);
  },

  async orientarSetor(sectorId: string, taskId: string): Promise<void> {
    const task = projectTasks.find(t => t.id === taskId);
    const user = this.getCurrentUser();
    
    // Notificar o Coordenador do Setor (Mock: enviamos para o admin do setor conforme configuração)
    const config = AREAS_CONFIGURACAO[sectorId as AreasAtuacao];
    const targetUserId = config?.responsavelAmministrativo || '1';

    this._createNotification(targetUserId, {
        titulo: "Orientação da Coordenação Executiva",
        descricao: `A coordenação executiva solicita atenção imediata à atividade: ${task?.title}`,
        tipo: 'responsabilidade_modificada',
        origemUsuarioId: user?.id || 'sistema',
        origemUsuarioNome: user?.name || 'Sistema Executivo'
    });

    safeToast({
        title: "Orientação Enviada",
        description: `O coordenador do setor ${sectorId.toUpperCase()} foi notificado.`,
    });
  },

  getExecutiveBriefing(): ExecutiveBriefing {
    const pma = this.getStrategicMetrics();
    const exceptions = this.getExceptionRequests();
    
    return {
      ...pma,
      pendingExceptionsCount: exceptions.filter(e => e.status === 'pendente').length,
      highRiskSectors: pma.sectorHealth.filter(s => s.status === 'crítico').map(s => s.sigla),
      criticalDependencies: projectTasks.filter(t => t.status === 'bloqueado' && t.priority === 'urgente').length,
      institutionalRisks: this.identifyInstitutionalRisks()
    };
  },

  getExceptionRequests(): ExceptionRequest[] {
    return loadFromStorage('exception_requests', INITIAL_EXCEPTIONS);
  },

  async requestException(taskId: string, type: ExceptionRequest['type'], justification: string): Promise<void> {
    const userRole = this.getUserRole();
    const session = this.obterSessaoAtual();
    const task = projectTasks.find(t => t.id === taskId);

    const newRequest: ExceptionRequest = {
        id: `exc-${Date.now()}`,
        taskId,
        taskTitle: task?.title || "Tarefa Desconhecida",
        requesterId: session?.userId || "unknown",
        requesterName: session?.nomeCompleto || "Usuário",
        sectorId: task?.sectorId || "unknown",
        type,
        justification,
        status: 'pendente',
        createdAt: new Date().toISOString()
    };

    const current = this.getExceptionRequests();
    saveToStorage('exception_requests', [newRequest, ...current]);

    safeToast({
        title: "Exceção Solicitada",
        description: "A coordenação foi notificada e analisará o pedido.",
    });
  },

  async processException(requestId: string, status: 'aprovada' | 'rejeitada', notes: string): Promise<void> {
    const session = this.obterSessaoAtual();
    const requests = this.getExceptionRequests();
    const requestIndex = requests.findIndex(r => r.id === requestId);

    if (requestIndex === -1) return;

    requests[requestIndex] = {
        ...requests[requestIndex],
        status,
        decisionNotes: notes,
        decidedBy: session?.userId,
        decidedByName: session?.nomeCompleto,
        decidedAt: new Date().toISOString()
    };

    saveToStorage('exception_requests', requests);

    // Se aprovada, logar no histórico da tarefa
    if (status === 'aprovada') {
        const task = projectTasks.find(t => t.id === requests[requestIndex].taskId);
        if (task) {
            if (!task.history) task.history = [];
            task.history.push({
                action: 'EXCEÇÃO APLICADA',
                timestamp: new Date().toISOString(),
                userId: session?.userId || 'sistema',
                userName: session?.nomeCompleto || "Coordenação",
                status: task.status,
                comment: `Motivo: ${requests[requestIndex].justification}. Decisão: ${notes}`
            });
        }
    }

    safeToast({
        title: status === 'aprovada' ? "Exceção Aprovada" : "Exceção Rejeitada",
        description: "O fluxo da tarefa foi atualizado conforme decisão.",
    });
  },

  hasApprovedException(taskId: string, type: ExceptionRequest['type']): boolean {
    const requests = this.getExceptionRequests();
    return requests.some(r => r.taskId === taskId && r.status === 'aprovada' && r.type === type);
  },

  /** Gerador de Relatório Formal com Filtros */
  generateProjectSnapshot(filters?: { month?: string, taskIds?: string[] }) {
    let tasks = this.getProcessedTasks();
    const sectorsHealth = this.getStrategicMetrics().sectorHealth;
    
    // Filtro por Mês (Baseado em createdAt ou completedAt)
    if (filters?.month) {
      tasks = tasks.filter(t => {
        const createMonth = t.createdAt?.slice(0, 7);
        const completeMonth = t.completedAt?.slice(0, 7);
        return createMonth === filters.month || completeMonth === filters.month;
      });
    }

    // Filtro por Atividades Selecionadas
    if (filters?.taskIds && filters.taskIds.length > 0) {
      tasks = tasks.filter(t => filters.taskIds!.includes(t.id));
    }
    
    return {
        timestamp: new Date().toLocaleString('pt-BR'),
        periodo: filters?.month || 'Geral',
        totalTasks: tasks.length,
        concludedTasks: tasks.filter((t: ProjectTask) => t.status === 'concluida').length,
        criticalDelays: tasks.filter((t: ProjectTask) => t.status === 'atrasada' && t.priority === 'urgente').length,
        // Mantemos os dados das atividades filtradas apenas
        tasks: tasks.map((t: ProjectTask) => ({
          identifier: t.identifier || t.publicId,
          title: t.title,
          status: t.status,
          sector: t.sector
        })),
        sectorPerformance: sectorsHealth.map(s => {
            const sectorTasks = tasks.filter((t: ProjectTask) => t.sectorId === s.sectorId);
            const concluded = sectorTasks.filter((t: ProjectTask) => t.status === 'concluida').length;
            const efficiency = sectorTasks.length > 0 ? Math.round((concluded / sectorTasks.length) * 100) : 100;

            return {
                sector: s.name,
                eficiencia: `${efficiency}%`,
                pendencias: sectorTasks.filter((t: ProjectTask) => t.status !== 'concluida').length
            };
        })
    };
  },

  // ────────────────────────────────────
  // ────────────────────────────────────
  // 🏗️ SISTEMA CMS INSTITUCIONAL (FIRESTORE REAL)
  // Coleções: /cms_drafts, /cms_published, /cms_audit_logs
  // ────────────────────────────────────

  async initializePageBlocks(pageId: string, defaultBlocks: Array<Partial<CMSBlock>>): Promise<void> {
    if (!this.isStudioContext()) return;
    if (!auth.currentUser) {
      console.warn("[CMS] Sem autenticação Firebase. Blocos não inicializados.");
      return;
    }

    try {
      const draftsCol = collection(db, "cms_drafts");
      const q = query(draftsCol, where("pageId", "==", pageId));
      const snapshot = await getDocs(q);

      if (snapshot.empty && defaultBlocks.length > 0) {
        console.log(`🌱 Hidratando página ${pageId} com blocos institucionais...`);
        let index = 0;
        for (const def of defaultBlocks) {
          const blockId = `${pageId}_${def.id}`;
          const newBlock: CMSBlock = {
            id: blockId,
            pageId: pageId,
            type: def.type || 'text',
            status: 'PUBLICADO',
            order: index++,
            content: def.content || '',
            draft: def.content || '',
            data: (def as any).data || {},
            draftData: (def as any).draftData || {},
            accessibility: { librasUrl: '', altText: '', description: '', ...def.accessibility },
            style: { preset: 'neutral', alignment: 'left', ...def.style },
            metadata: {
              lastEditedBy: auth.currentUser.uid,
              lastEditedByName: 'Sistema Inova',
              lastEditedAt: new Date().toISOString(),
              publishedBy: auth.currentUser.uid,
              publishedByName: 'Sistema Inova',
              publishedAt: new Date().toISOString(),
              version: 1
            }
          };
          await setDoc(doc(db, "cms_drafts", blockId), newBlock);
          await setDoc(doc(db, "cms_published", blockId), newBlock);
        }
        console.log(`✅ Página ${pageId}: ${defaultBlocks.length} blocos criados.`);
      }
    } catch (e) {
      console.error("Erro ao inicializar blocos:", e);
    }
  },

  async getPageBlocks(pageId: string): Promise<CMSBlock[]> {
    const isStudio = this.isStudioContext();
    const collectionName = isStudio ? "cms_drafts" : "cms_published";

    try {
      const blocksCol = collection(db, collectionName);
      const q = query(blocksCol, where("pageId", "==", pageId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return [];
      return snapshot.docs
        .map(d => ({ id: d.id, ...d.data() } as CMSBlock))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (e) {
      console.error(`Erro ao buscar blocos de ${collectionName}:`, e);
      return [];
    }
  },

  async updateBlockDraft(blockId: string, draft: string, draftData: any, accessibility: any, style: any): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) return false;
    if (!auth.currentUser) {
      safeToast({ title: "Sessão Expirada", description: "Faça login novamente.", variant: "destructive" });
      return false;
    }

    try {
      const blockRef = doc(db, "cms_drafts", blockId);
      const docSnap = await getDoc(blockRef);

      if (docSnap.exists()) {
        const current = docSnap.data() as CMSBlock;
        const updatedBlock: Partial<CMSBlock> = {
          draft,
          draftData: { ...(current.draftData || {}), ...(draftData || {}) },
          accessibility: { ...current.accessibility, ...accessibility },
          style: { ...current.style, ...style },
          status: 'EM_REVISAO',
          lastAction: 'SUBMIT',
          rejectionReason: '',
          metadata: {
            ...current.metadata,
            lastEditedBy: auth.currentUser.uid,
            lastEditedByName: user.name,
            lastEditedAt: new Date().toISOString()
          }
        };
        await updateDoc(blockRef, updatedBlock);
        await this._logCMSAudit(blockId, 'EDIT', current, updatedBlock);
        safeToast({ title: "Rascunho Salvo", description: "Alterações salvas no servidor." });
        return true;
      }
      return false;
    } catch (e) {
      console.error("Erro ao salvar rascunho:", e);
      safeToast({ title: "Erro", description: "Falha ao salvar rascunho.", variant: "destructive" });
      return false;
    }
  },

  async publishBlockToSite(blockId: string): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user || !this.canPublish(user.id)) {
      safeToast({ title: "Acesso Negado", description: "Sem permissão de publicação.", variant: "destructive" });
      return false;
    }
    if (!auth.currentUser) {
      safeToast({ title: "Sessão Expirada", description: "Faça login novamente.", variant: "destructive" });
      return false;
    }

    try {
      const draftRef = doc(db, "cms_drafts", blockId);
      const draftSnap = await getDoc(draftRef);

      if (!draftSnap.exists()) return false;

      const current = draftSnap.data() as CMSBlock;

      const reqAltTypes = ['image', 'banner', 'gallery'];
      if (reqAltTypes.includes(current.type)) {
        if (!current.accessibility?.altText || current.accessibility.altText.trim() === '') {
          safeToast({ title: "Publicação Bloqueada 🛑", description: "Alt Text obrigatório.", variant: "destructive" });
          return false;
        }
      }
      if (!current.accessibility?.librasUrl) {
        console.warn("[Auditoria] Bloco sem vídeo LIBRAS.");
      }

      const publishedBlock: CMSBlock = {
        ...current,
        status: 'PUBLICADO',
        content: current.draft || current.content,
        data: { ...(current.data || {}), ...(current.draftData || {}) },
        lastAction: 'PUBLISH',
        metadata: {
          ...current.metadata,
          publishedBy: auth.currentUser.uid,
          publishedByName: user.name,
          publishedAt: new Date().toISOString(),
          version: (current.metadata.version || 0) + 1
        }
      };

      await setDoc(doc(db, "cms_published", blockId), publishedBlock);
      await updateDoc(draftRef, {
        status: 'PUBLICADO',
        content: publishedBlock.content,
        data: publishedBlock.data,
        lastAction: 'PUBLISH',
        metadata: publishedBlock.metadata
      });

      await this._logCMSAudit(blockId, 'PUBLISH', current, publishedBlock);
      safeToast({ title: "Publicado! ✅", description: "Conteúdo visível no site público." });
      return true;
    } catch (e) {
      console.error("Erro ao publicar bloco:", e);
      return false;
    }
  },

  async rejectBlockWithNotes(blockId: string, notes: string): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user || !this.canRejectContent(user.id)) return false;
    if (!auth.currentUser) return false;

    try {
      const blockRef = doc(db, "cms_drafts", blockId);
      const docSnap = await getDoc(blockRef);

      if (docSnap.exists()) {
        const current = docSnap.data() as CMSBlock;
        const updatedBlock: Partial<CMSBlock> = {
          status: 'DRAFT',
          rejectionReason: notes,
          lastAction: 'REJECT',
          metadata: {
            ...current.metadata,
            lastEditedBy: auth.currentUser.uid,
            lastEditedByName: user.name,
            lastEditedAt: new Date().toISOString()
          }
        };
        await updateDoc(blockRef, updatedBlock);
        await this._logCMSAudit(blockId, 'REJECT', current, updatedBlock);
        safeToast({ title: "Ajuste Solicitado", description: `Apontamento: "${notes}"` });
        return true;
      }
      return false;
    } catch (e) {
      console.error("Erro ao rejeitar bloco:", e);
      return false;
    }
  },

  // ────────────────────────────────────
  // 🔧 OPERAÇÕES ESTRUTURAIS
  // ────────────────────────────────────

  async addBlock(pageId: string, type: string, orderPosition: number): Promise<boolean> {
    if (!this.isStudioContext() || !auth.currentUser) return false;
    const user = this.getCurrentUser();

    try {
      const newId = `${pageId}_${type}_${Date.now()}`;
      const newBlock: CMSBlock = {
        id: newId,
        pageId,
        type: type as any,
        status: 'DRAFT',
        order: orderPosition,
        content: '',
        draft: '',
        data: {},
        draftData: {},
        accessibility: { librasUrl: '', altText: '', description: '' },
        style: { preset: 'neutral', alignment: 'left' },
        metadata: {
          lastEditedBy: auth.currentUser.uid,
          lastEditedByName: user?.name || 'Sistema Inova',
          lastEditedAt: new Date().toISOString(),
          version: 0
        }
      };
      await setDoc(doc(db, "cms_drafts", newId), newBlock);
      await this._logCMSAudit(newId, 'CREATE', null, newBlock);
      return true;
    } catch (e) {
      console.error("Erro ao adicionar bloco:", e);
      return false;
    }
  },

  async deleteBlock(blockId: string): Promise<boolean> {
    if (!auth.currentUser) return false;
    try {
      const draftRef = doc(db, "cms_drafts", blockId);
      const draftSnap = await getDoc(draftRef);
      const before = draftSnap.exists() ? draftSnap.data() : null;

      await deleteDoc(draftRef);
      try { await deleteDoc(doc(db, "cms_published", blockId)); } catch (_) {}
      await this._logCMSAudit(blockId, 'EDIT', before, { deleted: true });
      return true;
    } catch (e) {
      console.error("Erro ao remover bloco:", e);
      return false;
    }
  },

  async reorderBlock(pageId: string, blockId: string, direction: 'UP' | 'DOWN'): Promise<boolean> {
    try {
      const blocks = await this.getPageBlocks(pageId);
      const idx = blocks.findIndex(b => b.id === blockId);
      if (idx === -1) return false;

      if (direction === 'UP' && idx > 0) {
        const temp = blocks[idx].order;
        blocks[idx].order = blocks[idx - 1].order;
        blocks[idx - 1].order = temp;
        await updateDoc(doc(db, "cms_drafts", blocks[idx].id), { order: blocks[idx].order });
        await updateDoc(doc(db, "cms_drafts", blocks[idx - 1].id), { order: blocks[idx - 1].order });
        return true;
      } else if (direction === 'DOWN' && idx < blocks.length - 1) {
        const temp = blocks[idx].order;
        blocks[idx].order = blocks[idx + 1].order;
        blocks[idx + 1].order = temp;
        await updateDoc(doc(db, "cms_drafts", blocks[idx].id), { order: blocks[idx].order });
        await updateDoc(doc(db, "cms_drafts", blocks[idx + 1].id), { order: blocks[idx + 1].order });
        return true;
      }
      return false;
    } catch (e) {
      console.error("Erro ao reordenar bloco:", e);
      return false;
    }
  },

  // ────────────────────────────────────
  // 📸 MEDIA MANAGER (Firebase Storage)
  // ────────────────────────────────────

  async uploadStudioMedia(file: File, context: 'draft' | 'published' = 'draft'): Promise<string | null> {
    if (!auth.currentUser) return null;

    try {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `media/studio/${context}/${timestamp}_${safeName}`;
      const storageRef = ref(storage, storagePath);

      const uploadResult = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadResult.ref);

      await addDoc(collection(db, "cms_media"), {
        url: downloadUrl,
        storagePath,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        context,
        uploadedBy: auth.currentUser.uid,
        uploadedByName: this.getCurrentUser()?.name || 'Sistema',
        createdAt: new Date().toISOString()
      });

      safeToast({ title: "Mídia Enviada ✅", description: `Arquivo salvo (${context}).` });
      return downloadUrl;
    } catch (e) {
      console.error("Erro ao fazer upload:", e);
      safeToast({ title: "Erro de Upload", description: "Falha ao enviar mídia.", variant: "destructive" });
      return null;
    }
  },

  async listStudioMedia(context: 'draft' | 'published' | 'archive' = 'draft'): Promise<string[]> {
    try {
      const mediaCol = collection(db, "cms_media");
      const q = query(mediaCol, where("context", "==", context), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return [
          "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000",
          "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000",
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2000"
        ];
      }
      return snapshot.docs.map(d => d.data().url as string);
    } catch (e) {
      console.error("Erro ao listar mídia:", e);
      return [];
    }
  },

  async publishPageToSite(pageId: string): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user || !this.canPublish(user.id)) return false;

    try {
      const draftsCol = collection(db, "cms_drafts");
      const q = query(draftsCol, where("pageId", "==", pageId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return true;
      const promises = snapshot.docs.map(d => this.publishBlockToSite(d.id));
      const results = await Promise.all(promises);
      return results.every(r => r === true);
    } catch (e) {
      console.error("Erro ao publicar página:", e);
      return false;
    }
  },

  async _logCMSAudit(blockId: string, action: CMSAuditLog['action'], before: any, after: any) {
    const user = this.getCurrentUser();
    try {
      await addDoc(collection(db, "cms_audit_logs"), {
        blockId,
        action,
        firebaseUid: auth.currentUser?.uid || 'sistema',
        institutionalId: user?.id || 'sistema',
        userName: user?.name || 'Sistema',
        timestamp: new Date().toISOString(),
        before: before ? JSON.parse(JSON.stringify(before)) : null,
        after: after ? JSON.parse(JSON.stringify(after)) : null,
        pageId: before?.pageId || after?.pageId || 'unknown'
      });
    } catch (e) {
      console.error("Erro ao registrar log CMS:", e);
    }
  },

  getBottlenecks(month?: string): ProjectBottleneck[] {
    if (month) {
      return bottlenecks.filter(b => b.monthKey === month);
    }
    const currentMonth = new Date().toISOString().slice(0, 7);
    return bottlenecks.filter(b => b.monthKey === currentMonth);
  },

  getBottleneckMonths(): string[] {
    const months = new Set(bottlenecks.map(b => b.monthKey));
    return Array.from(months).sort().reverse();
  },

  async reportBottleneck(data: Partial<ProjectBottleneck>): Promise<string> {
    const user = this.getCurrentUser();
    const now = new Date();
    const monthKey = now.toISOString().slice(0, 7);
    
    const newBottleneck: ProjectBottleneck = {
      id: `bot-${Date.now()}`,
      reason: data.reason || "Impasse Operacional",
      description: data.description || "",
      severity: data.severity || 'media',
      sectorId: data.sectorId || 'unknown',
      timestamp: now.toISOString(),
      monthKey,
      reportedBy: user?.id || 'sistema',
      reportedByName: user?.name || 'Sistema',
      status: 'ativo'
    };

    bottlenecks.unshift(newBottleneck);
    saveToStorage('bottlenecks', bottlenecks);

    try {
      this._createNotification('1', {
        titulo: "Novo Gargalo Registrado ⚠️",
        descricao: `${user?.name} registrou um impasse: ${newBottleneck.reason}`,
        tipo: 'gargalo_registrado',
        origemUsuarioId: user?.id || 'sistema',
        origemUsuarioNome: user?.name || 'Sistema'
      });
    } catch (e) {}

    try {
      await addDoc(collection(db, "bottlenecks"), newBottleneck);
    } catch (e) {}

    try { notifyTaskListeners(); } catch (e) {} 
    return newBottleneck.id;
  },

  async registerIntervention(taskId: string, type: 'cobrar_prazo' | 'orientacao_direta', content?: string): Promise<void> {
    const user = this.getCurrentUser();
    const task = projectTasks.find(t => t.id === taskId);
    if (!task) throw new Error("Tarefa não encontrada.");

    const now = new Date().toISOString();
    const intervention: ProjectIntervention = {
        id: `int-${Date.now()}`,
        taskId,
        type,
        content,
        timestamp: now,
        userId: user?.id || 'sistema',
        userName: user?.name || 'Sistema'
    };

    if (!task.interventions) task.interventions = [];
    task.interventions.unshift(intervention);
    task.hasIntervention = true;
    task.updatedAt = now;

    // Log no histórico da tarefa
    if (!task.history) task.history = [];
    task.history.unshift({
        timestamp: now,
        userId: user?.id || 'sistema',
        userName: user?.name || 'Sistema',
        action: type === 'cobrar_prazo' ? 'COBRANÇA DE PRAZO (EXECUTIVA)' : 'ORIENTAÇÃO DIRETA (EXECUTIVA)',
        status: task.status,
        comment: content || (type === 'cobrar_prazo' ? 'Cobrança de prazo devido ao atraso crítico.' : '')
    });

    // Notificar o setor responsável
    const sectorCoordinatorId = this.getSectorCoordinatorId(task.sectorId);
    if (sectorCoordinatorId) {
        this._createNotification(sectorCoordinatorId, {
            titulo: "Intervenção da Executiva ⚠️",
            descricao: type === 'cobrar_prazo' 
                ? `Cobrança de prazo para a tarefa: ${task.title}`
                : `Nova orientação para a tarefa ${task.title}: ${content}`,
            tipo: 'intervencao_executiva',
            taskId,
            origemUsuarioId: user?.id || 'sistema',
            origemUsuarioNome: user?.name || 'Sistema'
        });
    }

    saveToStorage('tasks', projectTasks);
    try {
        await this._syncTaskToFirestore(task);
    } catch (e) {}
    
    notifyTaskListeners();

    safeToast({
        title: "Intervenção Registrada",
        description: "O setor responsável foi notificado e o log foi atualizado.",
    });
  },

  getSectorCoordinatorId(sectorId: string): string | null {
     // 1. Tentar obter do cache dinâmico (mais novo)
     const sector = dynamicSectors.find(s => s.id === sectorId || s.sigla === sectorId);
     if (sector?.coordinatorId) return sector.coordinatorId;

     // 2. Fallback: Mapeamento padrão legado
     const mapping: Record<string, string> = {
         'ascom': '2',
         'acessibilidade': '3',
         'plan': '5',
         'social': '6',
         'redes': '7',
         'tech': '8',
         'curadoria': '9',
         'cgp': '1'
     };
     return mapping[sectorId.toLowerCase()] || mapping[sectorId] || null;
  },

  _createNotification(userId: string, data: any) {
    let userNotifs = notificacoes.get(userId);
    
    // Garantir que carregamos o que já existe
    if (!userNotifs) {
      userNotifs = loadFromStorage(`notifs_${userId}`, []);
    }

    const newNotif = {
      id: `not-${Date.now()}`,
      usuarioId: userId,
      lida: false,
      dataCriacao: new Date().toISOString(),
      ...data
    };
    
    userNotifs!.unshift(newNotif);
    notificacoes.set(userId, userNotifs!);
    saveToStorage(`notifs_${userId}`, userNotifs);
  },

  // ────────────────────────────────────
  // GESTÃO DINÂMICA DE SETORES
  // ────────────────────────────────────

  async getSectors(): Promise<SectorDefinition[]> {
    if (!auth.currentUser) return sectors;

    try {
      const q = query(collection(db, SECTORS_COLLECTION), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Se vazio, tenta inicializar, mas não trava se falhar (ex: sem permissão de escrita)
        try {
          await this.initializeDefaultSectors();
        } catch (e) {
          console.warn("Não foi possível inicializar setores no banco. Usando mock local.");
        }
        return sectors;
      }
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SectorDefinition));
    } catch (e) {
      console.error("Erro ao buscar setores dinâmicos:", e);
      return sectors; // Fallback para mock-data
    }
  },

  subscribeToSectors(callback: (sectors: SectorDefinition[]) => void) {
    // Se o usuário não estiver logado, usamos o fallback estático inicial
    if (!auth.currentUser) {
        callback(dynamicSectors);
        return () => {};
    }

    const q = query(collection(db, SECTORS_COLLECTION), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbSectors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SectorDefinition));
      
      if (dbSectors.length > 0) {
          dynamicSectors = dbSectors;
      } else {
          dynamicSectors = [...sectors];
      }
      callback(dynamicSectors);
    }, (error) => {
      console.warn("[Firestore] Erro na assinatura de setores. Usando fallback:", error.message);
      callback(dynamicSectors);
    });

    return unsubscribe;
  },

  async createSector(data: Omit<SectorDefinition, 'id'>) {
    try {
      // Gerar um ID amigável (slug) se não for fornecido
      const slug = data.sigla.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      // Criar o documento usando o sigla como ID ou um ID automático
      const docRef = await setDoc(doc(db, SECTORS_COLLECTION, slug), {
        ...data,
        id: slug,
        createdAt: new Date().toISOString()
      });
      
      return slug;
    } catch (e) {
      console.error("Erro ao criar setor:", e);
      throw e;
    }
  },

  async initializeDefaultSectors() {
    console.log("Inicializando setores padrão no Firestore...");
    for (let i = 0; i < sectors.length; i++) {
        const s = sectors[i];
        const docId = s.id;
        await setDoc(doc(db, SECTORS_COLLECTION, docId), {
            ...s,
            order: i,
            createdAt: new Date().toISOString()
        });
    }
  }
};
