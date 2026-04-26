/**
 * 🔐 CREDENCIAIS DE AUTENTICAÇÃO (VAULT)
 * 
 * Este arquivo funciona como um cofre seguro para as credenciais.
 * Em produção, estes dados estariam em um serviço de Auth (Firebase Auth / Supabase).
 */

import type { StoredUser } from './auth';
import { hashPassword } from './auth';

const SENHA_PADRAO = hashPassword('123@Mudar');
const SENHA_ADMIN = hashPassword('A1g3d5s@!#');

const STORAGE_KEY = 'redeinova_usuarios_cadastrados';

// 🛠️ FUNÇÕES DE APOIO À PERSISTÊNCIA NO NAVEGADOR (MOCK)
const carregarDoStorage = (padrao: StoredUser[]): StoredUser[] => {
  if (typeof window === 'undefined') return padrao;
  const salvo = localStorage.getItem(STORAGE_KEY);
  if (!salvo) return padrao;
  
  try {
    const parsed = JSON.parse(salvo) as StoredUser[];
    
    // ⚙️ MECANISMO DE AUTO-CURA (Self-Healing)
    // Se um usuário administrador ou da coordenação geral estiver com dados defasados no computador do usuário,
    // o sistema força a restauração das permissões originais do código-mestre.
    const syncedUsers = parsed.map(u => {
      const master = padrao.find(p => p.id === u.id);
      
      // ⚙️ SELEÇÃO DE PERFIS CRÍTICOS PARA SINCRONIZAÇÃO FORÇADA
      // Amanda (ID 15) foi adicionada à lista de prioridade para correção de acesso.
      const isCritical = master && (
        master.role === 'ADMIN' || 
        master.department === 'CGP' || 
        ['1', '3', '4', '5', '12', '14', '15', '16', '17', '19'].includes(master.id)
      );

      if (isCritical && master) {
        return { 
          ...master,           // Base de dados mestre (Garante permissões/vinculos)
          ...u,                // Sobrescreve com dados do usuário (Avatar, Bio, Lattes)
          cpfOuEmail: master.cpfOuEmail,      // Força CPF correto
          passwordHash: master.passwordHash,  // 🔐 NOVO: Força hash estável do código (Correção de Segurança)
          role: master.role, 
          department: master.department, 
          assignments: master.assignments,
          permissoes: master.permissoes,
          cargo: master.cargo
        };
      }
      return u;
    });

    return syncedUsers;
  } catch (e) {
    console.error("Erro ao carregar usuários do storage", e);
    return padrao;
  }
};

const salvarNoStorage = (usuarios: StoredUser[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
  } catch (err) {
    console.error("❌ Falha crítica ao salvar usuários no Storage (Quota excedida?):", err);
    // Em caso de erro de quota, a aplicação ainda rodará em memória,
    // garantindo que não haja um 'Application Error' travando a tela.
  }
};

// 🛡️ PRESETS DE PERMISSÕES
const PERMS_ADMIN = {
    VIEW_PUBLIC: true, VIEW_PANEL: true, VIEW_STUDIO: true,
    EDIT_TEXT: true, EDIT_VISUAL: true, EDIT_ACCESSIBILITY: true,
    SAVE_DRAFT: true, REQUEST_REVIEW: true, APPROVE_CONTENT: true, PUBLISH_CONTENT: true,
    VIEW_AUDIT: true, EXPORT_AUDIT: true, MANAGE_MEMBERS: true, VIEW_ALL_SECTORS: true
};

const PERMS_ASCOM_LIDER = {
    VIEW_PUBLIC: true, VIEW_PANEL: true, VIEW_STUDIO: true,
    EDIT_TEXT: true, EDIT_VISUAL: true, EDIT_ACCESSIBILITY: true,
    SAVE_DRAFT: true, REQUEST_REVIEW: true, APPROVE_CONTENT: false, PUBLISH_CONTENT: true,
    VIEW_AUDIT: true, EXPORT_AUDIT: false, MANAGE_MEMBERS: false, VIEW_ALL_SECTORS: false
};

const PERMS_ASCOM_COLABORADOR = {
    VIEW_PUBLIC: true, VIEW_PANEL: true, VIEW_STUDIO: true,
    EDIT_TEXT: true, EDIT_VISUAL: true, EDIT_ACCESSIBILITY: true,
    SAVE_DRAFT: true, REQUEST_REVIEW: true, APPROVE_CONTENT: false, PUBLISH_CONTENT: false,
    VIEW_AUDIT: true, EXPORT_AUDIT: false, MANAGE_MEMBERS: false, VIEW_ALL_SECTORS: false
};

const PERMS_COLABORADOR_GERAL = {
    VIEW_PUBLIC: true, VIEW_PANEL: true, VIEW_STUDIO: false,
    EDIT_TEXT: false, EDIT_VISUAL: false, EDIT_ACCESSIBILITY: false,
    SAVE_DRAFT: false, REQUEST_REVIEW: false, APPROVE_CONTENT: false, PUBLISH_CONTENT: false,
    VIEW_AUDIT: false, EXPORT_AUDIT: false, MANAGE_MEMBERS: false, VIEW_ALL_SECTORS: false
};

const USUARIOS_INICIAIS: StoredUser[] = [
  // 1. COORDENAÇÃO GERAL
  {
    id: '1',
    cpfOuEmail: '069.400.574-63', 
    nomeCompleto: 'Aisamaque Gomes de Souza',
    role: 'ADMIN',
    assignments: [
      { sector: 'tech', role: 'ADMIN' },
      { sector: 'acessibilidade', role: 'ADMIN' },
      { sector: 'cgp', role: 'ADMIN' }
    ],
    activeSector: 'tech',
    passwordHash: SENHA_ADMIN,
    ativo: true,
    department: 'CGP',
    cargo: 'Coordenador Geral',
    dataCriacao: new Date('2026-01-01').toISOString(),
    criadoPor: 'sistema',
    bio: "Coordenação científica, técnica e institucional do projeto Rede Inova Social.",
    lattesUrl: "http://lattes.cnpq.br/5221614942183842",
    permissoes: PERMS_ADMIN
  },
  {
    id: '2',
    cpfOuEmail: '123.123.123-02', 
    nomeCompleto: 'Andréa Gomes',
    role: 'COORDENADOR',
    assignments: [{ sector: 'cgp', role: 'COORDENADOR' }],
    passwordHash: SENHA_PADRAO,
    ativo: true,
    department: 'CGP',
    dataCriacao: new Date('2026-01-01').toISOString(),
    criadoPor: 'admin',
    bio: "",
    lattesUrl: "",
    cargo: "Coordenadora de Extensão",
    permissoes: PERMS_ADMIN
  },
  {
    id: '5',
    cpfOuEmail: '069.202.525-11', 
    nomeCompleto: 'Danielle Silva Gonçalves',
    role: 'COORDENADOR',
    passwordHash: SENHA_PADRAO,
    ativo: true,
    department: 'CURADORIA',
    assignments: [
        { sector: 'curadoria', role: 'COORDENADOR' },
        { sector: 'cgp', role: 'COORDENADOR' }
    ],
    dataCriacao: new Date('2026-01-01').toISOString(),
    criadoPor: 'admin',
    bio: "Coordenação de Ações Extensionistas e Curadoria Científica do Projeto Rede Inova Social.",
    lattesUrl: "",
    cargo: "Coordenação de Extensão e Curadoria",
    permissoes: {
        ...PERMS_ASCOM_COLABORADOR,
        APPROVE_CONTENT: true,
        PUBLISH_CONTENT: true,
        VIEW_ALL_SECTORS: true
    }
  },

  // 2. COORDENAÇÃO INTERNA (DAYANE)
  {
    id: '4',
    cpfOuEmail: '369.439.348-05', 
    nomeCompleto: 'Dayane Lopes',
    role: 'COORDENADOR',
    assignments: [
      { sector: 'cgp', role: 'COORDENADOR' },
      { sector: 'plan', role: 'COORDENADOR' }
    ],
    passwordHash: SENHA_PADRAO,
    ativo: true,
    department: 'CGP',
    dataCriacao: new Date('2026-01-01').toISOString(),
    criadoPor: 'admin',
    bio: "Planejamento e acompanhamento financeiro do projeto.",
    lattesUrl: "",
    cargo: "Coordenadora de Articulações Internas",
    permissoes: {
        ...PERMS_ADMIN,
        EDIT_VISUAL: false,
        EXPORT_AUDIT: true
    }
  },

  // 3. ASCOM
  {
    id: '15',
    cpfOuEmail: '051.602.625-98', 
    nomeCompleto: 'Amanda Milly',
    role: 'COORDENADOR',
    assignments: [
      { sector: 'ascom', role: 'COORDENADOR' },
      { sector: 'social', role: 'COLABORADOR' }
    ],
    passwordHash: hashPassword('123@Mudar'),
    ativo: true,
    department: 'ASCOM',
    dataCriacao: new Date('2026-01-01').toISOString(),
    criadoPor: 'admin',
    cargo: 'Coordenação Geral da ASCOM',
    bio: "Gestão de fluxos, articulação entre setores e estratégia de comunicação.",
    lattesUrl: "",
    permissoes: PERMS_ASCOM_LIDER
  },
  {
    id: '16',
    cpfOuEmail: '092.084.635-16', 
    nomeCompleto: 'Sara Freire',
    role: 'COLABORADOR',
    assignments: [
      { sector: 'ascom', role: 'COLABORADOR' },
      { sector: 'acessibilidade', role: 'COLABORADOR' }
    ],
    passwordHash: SENHA_PADRAO,
    ativo: true,
    department: 'ASCOM',
    dataCriacao: new Date('2026-01-01').toISOString(),
    criadoPor: 'admin',
    avatarUrl: 'https://i.pravatar.cc/150?u=sara',
    cargo: 'Produção de Conteúdo e Acessibilidade',
    bio: "",
    lattesUrl: "",
    permissoes: PERMS_ASCOM_COLABORADOR
  },
  {
    id: '17',
    cpfOuEmail: '491.899.738-44', 
    nomeCompleto: 'Thaissa Carvalho',
    role: 'COLABORADOR',
    assignments: [
       { sector: 'ascom', role: 'COLABORADOR' },
       { sector: 'cgp', role: 'COLABORADOR' } // Coord. Extensão mapeada via CGP ou outro setor técnico
    ],
    passwordHash: SENHA_PADRAO,
    ativo: true,
    department: 'ASCOM',
    dataCriacao: new Date('2026-01-01').toISOString(),
    criadoPor: 'admin',
    avatarUrl: 'https://i.pravatar.cc/150?u=thaissa',
    cargo: 'Conteúdo e Coordenação de Extensão',
    bio: "",
    lattesUrl: "",
    permissoes: {
        ...PERMS_ASCOM_COLABORADOR,
        EDIT_VISUAL: true
    }
  },

  // 4. ACESSIBILIDADE
  {
    id: '3',
    cpfOuEmail: '033.292.575-71', 
    nomeCompleto: 'Bruna Almeida',
    role: 'COORDENADOR',
    assignments: [{ sector: 'acessibilidade', role: 'COORDENADOR' }],
    passwordHash: SENHA_PADRAO,
    ativo: true,
    department: 'ACESSIBILIDADE',
    dataCriacao: new Date('2026-01-01').toISOString(),
    criadoPor: 'admin',
    bio: "",
    lattesUrl: "",
    cargo: "Núcleo de Acessibilidade",
    permissoes: {
        ...PERMS_ASCOM_COLABORADOR,
        EDIT_ACCESSIBILITY: true,
        VIEW_AUDIT: true
    }
  },
  {
    id: '12',
    cpfOuEmail: '038.863.805-21', 
    nomeCompleto: 'Ilana Anunciação',
    role: 'COLABORADOR',
    assignments: [
      { sector: 'acessibilidade', role: 'COLABORADOR' },
      { sector: 'cgp', role: 'COLABORADOR' } // Coord. Extensão
    ],
    passwordHash: SENHA_PADRAO,
    ativo: true,
    department: 'ACESSIBILIDADE',
    dataCriacao: new Date('2026-01-01').toISOString(),
    criadoPor: 'admin',
    bio: "",
    lattesUrl: "",
    cargo: "Núcleo de Acessibilidade e Extensão",
    permissoes: PERMS_COLABORADOR_GERAL
  },
  {
    id: '14',
    cpfOuEmail: '057.725.205-47', 
    nomeCompleto: 'Bêide Hayalla',
    role: 'COLABORADOR',
    assignments: [
      { sector: 'acessibilidade', role: 'COLABORADOR' },
      { sector: 'cgp', role: 'COLABORADOR' } // Coord. Extensão
    ],
    passwordHash: SENHA_PADRAO,
    ativo: true,
    department: 'ACESSIBILIDADE',
    dataCriacao: new Date('2026-01-01').toISOString(),
    criadoPor: 'admin',
    bio: "",
    lattesUrl: "",
    cargo: "Núcleo de Acessibilidade e Extensão",
    permissoes: PERMS_COLABORADOR_GERAL
  },
  {
    id: '19',
    cpfOuEmail: '017.173.215-42', 
    nomeCompleto: 'Thaís Dutra',
    role: 'COLABORADOR',
    assignments: [{ sector: 'acessibilidade', role: 'COLABORADOR' }],
    passwordHash: SENHA_PADRAO,
    ativo: true,
    department: 'ACESSIBILIDADE',
    dataCriacao: new Date('2026-01-01').toISOString(),
    criadoPor: 'admin',
    bio: "",
    lattesUrl: "",
    cargo: "Núcleo de Acessibilidade",
    permissoes: PERMS_COLABORADOR_GERAL
  },
  {
    id: '13',
    cpfOuEmail: '123.123.123-13', 
    nomeCompleto: 'Shirlene',
    role: 'COLABORADOR',
    assignments: [{ sector: 'acessibilidade', role: 'COLABORADOR' }],
    passwordHash: SENHA_PADRAO,
    ativo: true,
    department: 'ACESSIBILIDADE',
    dataCriacao: new Date('2026-01-01').toISOString(),
    criadoPor: 'admin',
    bio: "",
    lattesUrl: "",
    cargo: "Núcleo de Acessibilidade",
    permissoes: PERMS_COLABORADOR_GERAL
  },
  {
    id: '20',
    cpfOuEmail: '123.123.123-20', 
    nomeCompleto: 'Behatryz',
    role: 'COLABORADOR',
    assignments: [{ sector: 'acessibilidade', role: 'COLABORADOR' }],
    passwordHash: SENHA_PADRAO,
    ativo: true,
    department: 'ACESSIBILIDADE',
    dataCriacao: new Date('2026-01-01').toISOString(),
    criadoPor: 'admin',
    bio: "",
    lattesUrl: "",
    cargo: "Núcleo de Acessibilidade",
    permissoes: PERMS_COLABORADOR_GERAL
  }
];

// 🔄 Inicialização reativa ao Storage com Sincronização Forçada
export const usuariosCadastrados: StoredUser[] = carregarDoStorage(USUARIOS_INICIAIS);

// Garante que as correções de sincronização sejam persistidas imediatamente
if (typeof window !== 'undefined') {
    salvarNoStorage(usuariosCadastrados);
}

export function encontrarUsuarioPor(cpfOuEmail: string): StoredUser | undefined {
    if (!Array.isArray(usuariosCadastrados)) return undefined;
    return usuariosCadastrados.find(u => u.cpfOuEmail === cpfOuEmail);
}

export function encontrarUsuarioPorId(id: string): StoredUser | undefined {
    if (!Array.isArray(usuariosCadastrados)) return undefined;
    return usuariosCadastrados.find(u => u.id === id);
}

export function listarTodosUsuarios(): StoredUser[] {
    return usuariosCadastrados;
}

export function adicionarNovoUsuario(usuario: StoredUser): boolean {
    if (encontrarUsuarioPor(usuario.cpfOuEmail)) return false;
    usuariosCadastrados.push(usuario);
    salvarNoStorage(usuariosCadastrados);
    return true;
}

export function atualizarUsuario(id: string, updates: Partial<StoredUser>): boolean {
    const usuario = encontrarUsuarioPorId(id);
    if (!usuario) return false;
    Object.assign(usuario, updates);
    salvarNoStorage(usuariosCadastrados);
    return true;
}

export function deletarUsuario(id: string): boolean {
    const index = usuariosCadastrados.findIndex((u) => u.id === id);
    if (index === -1) return false;
    usuariosCadastrados.splice(index, 1);
    salvarNoStorage(usuariosCadastrados);
    return true;
}

export function alterarSenha(id: string, novaSenha: string): boolean {
    const usuario = encontrarUsuarioPorId(id);
    if (!usuario) return false;
    usuario.passwordHash = hashPassword(novaSenha);
    salvarNoStorage(usuariosCadastrados);
    return true;
}

export function resetarSenha(id: string): string | null {
    const usuario = encontrarUsuarioPorId(id);
    if (!usuario) return null;
    const senhaTemp = `Temp@${Math.random().toString(36).substring(2, 8)}`;
    usuario.passwordHash = hashPassword(senhaTemp);
    return senhaTemp;
}

export function desativarUsuario(id: string): boolean {
    const usuario = encontrarUsuarioPorId(id);
    if (!usuario) return false;
    usuario.ativo = false;
    salvarNoStorage(usuariosCadastrados);
    return true;
}

export function reativarUsuario(id: string): boolean {
    const usuario = encontrarUsuarioPorId(id);
    if (!usuario) return false;
    usuario.ativo = true;
    salvarNoStorage(usuariosCadastrados);
    return true;
}
