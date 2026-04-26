/**
 * 📋 Sistema de Responsabilidades e Controle de Acesso
 * 
 * Define áreas de atuação, responsabilidades e visibilidade de conteúdo
 */

/**
 * ÁREAS DE ATUAÇÃO DO PROJETO
 */
export enum AreasAtuacao {
  COORDENACAO = 'coordenacao',              // Gestão geral
  COMUNICACAO = 'comunicacao',              // CMS, conteúdo, redes
  SEGURANCA_ALIMENTAR = 'seguranca_alimentar',  // Nutrição, alimentação
  LIBRAS = 'libras',                        // Glossário, inclusão
  LABORATORIO = 'laboratorio',              // Lab Lissa, estações
  AGROPECUARIA = 'agropecuaria',            // Agricultura
  FINANCEIRO = 'financeiro',                // Gestão de custos
  TECNOLOGIA = 'tecnologia',                // Infraestrutura IT
  PESQUISA = 'pesquisa',                    // Dados, estudos
  EQUIPE = 'equipe',                        // RH, membros
}

/**
 * TIPOS DE RESPONSABILIDADE
 */
export type Responsabilidade = {
  id: string;                     // "resp-001"
  area: AreasAtuacao;             // Qual área
  titulo: string;                 // "Editor de Conteúdo"
  descricao: string;              // "Responsável por revisar..."
  podeEditar: boolean;            // Pode editar/modificar
  podeUploadInterno: boolean;     // Pode fazer upload interno
  podeUploadExterno: boolean;     // Pode fazer upload público
  podeAprovar: boolean;           // Pode aprovar conteúdos
  podePublicar: boolean;          // Pode publicar
};

/**
 * MEMBRO COM RESPONSABILIDADES
 */
export type MembroResponsabilidades = {
  usuarioId: string;              // ID do usuário
  nomeCompleto: string;           // Nome
  responsabilidades: Responsabilidade[];  // Todas as responsabilidades
  areasPrincipais: AreasAtuacao[];        // Areas principais
  dataAtribuicao: string;         // Quando foi atribuído
  ativo: boolean;                 // Está ativo?
};

/**
 * VISIBILIDADE DE ARQUIVO/CONTEÚDO
 */
export enum VisibilidadeConteudo {
  INTERNO = 'internal',           // Somente membros da plataforma
  PUBLICO = 'public',             // Todos podem ver
  BLOQUEADO = 'blocked',          // Apenas responsável vê
}

/**
 * ARQUIVO COM RASTREAMENTO DE VISIBILIDADE
 */
export type ArquivoRastreado = {
  id: string;
  nome: string;
  url: string;
  tipo: 'documento' | 'imagem' | 'video' | 'audio';
  visibilidade: VisibilidadeConteudo;
  uploadadoPor: string;           // ID do usuário
  dataCriacao: string;
  tamanho: number;               // em bytes
  area: AreasAtuacao;            // Qual área é responsável
  podeEditar: string[];          // IDs dos que podem editar
  podeVisualizacao: string[];    // IDs dos que podem ver
  aprovacao?: {
    status: 'pendente' | 'aprovado' | 'rejeitado';
    aprovadoPor?: string;
    dataAprovacao?: string;
    motivo?: string;
  };
};

/**
 * NOTIFICAÇÕES DO SISTEMA
 */
export type Notificacao = {
  id: string;
  usuarioId: string;              // Destinatário
  tipo: 'responsabilidade_atribuida' | 'upload_aprovado' | 'upload_rejeitado' | 'responsabilidade_modificada' | 'gargalo_registrado';
  titulo: string;
  descricao: string;
  origemUsuarioId: string;        // Quem realizou a ação
  origemUsuarioNome: string;      // Nome de quem realizou
  dataCriacao: string;
  dataLeitura?: string;           // Quando foi lida
  lida: boolean;
  metadata?: {
    responsabilidadeId?: string;
    arquivoId?: string;
    area?: AreasAtuacao;
  };
};

/**
 * CONFIGURAÇÕES DE ÁREA
 */
export type ConfiguracaoArea = {
  area: AreasAtuacao;
  nome: string;
  descricao: string;
  responsavelAmministrativo: string; // ID do membro
  membrosAtivos: string[];           // IDs dos membros
  requerAprovacao: boolean;          // Arquivos precisam aprovação?
  permitirUploadExterno: boolean;    // Permite upload público?
  cores: {
    primary: string;               // Cor primária (Tailwind)
    secondary: string;             // Cor secundária
  };
};

/**
 * LOG DE ACESSO/AUDITORIA
 */
export type LogAuditoria = {
  id: string;
  usuario: string;                // ID do usuário
  acao: 'upload' | 'edit' | 'delete' | 'approve' | 'publish';
  recurso: string;                // O que foi modificado
  visibilidade: VisibilidadeConteudo;
  dataHora: string;
  resultado: 'sucesso' | 'erro' | 'bloqueado';
  motivo?: string;
};

/**
 * PRÉ-CONFIGURAÇÕES DE RESPONSABILIDADES
 */
export const RESPONSABILIDADES_PADRAO: Record<string, Responsabilidade> = {
  ADMIN: {
    id: 'resp-admin',
    area: AreasAtuacao.COORDENACAO,
    titulo: 'Administrador',
    descricao: 'Acesso total ao sistema',
    podeEditar: true,
    podeUploadInterno: true,
    podeUploadExterno: true,
    podeAprovar: true,
    podePublicar: true,
  },

  EDITOR_COMUNICACAO: {
    id: 'resp-editor-com',
    area: AreasAtuacao.COMUNICACAO,
    titulo: 'Editor de Conteúdo',
    descricao: 'Edita e publica conteúdo de comunicação',
    podeEditar: true,
    podeUploadInterno: true,
    podeUploadExterno: false,
    podeAprovar: false,
    podePublicar: true,
  },

  ESPECIALISTA_LIBRAS: {
    id: 'resp-libras',
    area: AreasAtuacao.LIBRAS,
    titulo: 'Especialista em Libras',
    descricao: 'Gerencia glossário de termos em Libras',
    podeEditar: true,
    podeUploadInterno: true,
    podeUploadExterno: false,
    podeAprovar: false,
    podePublicar: true,
  },

  ESPECIALISTA_NUTRIACAO: {
    id: 'resp-nutriacao',
    area: AreasAtuacao.SEGURANCA_ALIMENTAR,
    titulo: 'Especialista em Nutrição',
    descricao: 'Responsável por conteúdo de nutrição e alimentação',
    podeEditar: true,
    podeUploadInterno: true,
    podeUploadExterno: false,
    podeAprovar: false,
    podePublicar: false,
  },

  GERENCIADOR_LAB: {
    id: 'resp-lab',
    area: AreasAtuacao.LABORATORIO,
    titulo: 'Gerenciador Lab Lissa',
    descricao: 'Configura e gerencia estações do laboratório',
    podeEditar: true,
    podeUploadInterno: true,
    podeUploadExterno: false,
    podeAprovar: false,
    podePublicar: true,
  },

  MEMBRO_COMUM: {
    id: 'resp-membro',
    area: AreasAtuacao.EQUIPE,
    titulo: 'Membro Comum',
    descricao: 'Acesso visualização apenas',
    podeEditar: false,
    podeUploadInterno: false,
    podeUploadExterno: false,
    podeAprovar: false,
    podePublicar: false,
  },

  REVISOR: {
    id: 'resp-revisor',
    area: AreasAtuacao.COMUNICACAO,
    titulo: 'Revisor',
    descricao: 'Revisa e aprova conteúdo antes da publicação',
    podeEditar: false,
    podeUploadInterno: false,
    podeUploadExterno: false,
    podeAprovar: true,
    podePublicar: false,
  },
};

/**
 * CONFIGURAÇÕES PADRÃO DAS ÁREAS
 */
export const AREAS_CONFIGURACAO: Record<AreasAtuacao, ConfiguracaoArea> = {
  [AreasAtuacao.COORDENACAO]: {
    area: AreasAtuacao.COORDENACAO,
    nome: 'Coordenação',
    descricao: 'Gestão geral do projeto',
    responsavelAmministrativo: '1', // Admin
    membrosAtivos: ['1'],
    requerAprovacao: true,
    permitirUploadExterno: false,
    cores: { primary: 'bg-blue-600', secondary: 'bg-blue-100' },
  },
  [AreasAtuacao.COMUNICACAO]: {
    area: AreasAtuacao.COMUNICACAO,
    nome: 'Comunicação',
    descricao: 'Conteúdo, CMS e redes sociais',
    responsavelAmministrativo: '3', // Bruna
    membrosAtivos: ['3'],
    requerAprovacao: false,
    permitirUploadExterno: true,
    cores: { primary: 'bg-purple-600', secondary: 'bg-purple-100' },
  },
  [AreasAtuacao.SEGURANCA_ALIMENTAR]: {
    area: AreasAtuacao.SEGURANCA_ALIMENTAR,
    nome: 'Segurança Alimentar',
    descricao: 'Nutrição, alimentação, segurança',
    responsavelAmministrativo: '2', // Andréa
    membrosAtivos: ['2'],
    requerAprovacao: true,
    permitirUploadExterno: false,
    cores: { primary: 'bg-green-600', secondary: 'bg-green-100' },
  },
  [AreasAtuacao.LIBRAS]: {
    area: AreasAtuacao.LIBRAS,
    nome: 'Libras',
    descricao: 'Inclusão, glossário e tradução em Libras',
    responsavelAmministrativo: '4', // Jaqueline
    membrosAtivos: ['4'],
    requerAprovacao: false,
    permitirUploadExterno: false,
    cores: { primary: 'bg-pink-600', secondary: 'bg-pink-100' },
  },
  [AreasAtuacao.LABORATORIO]: {
    area: AreasAtuacao.LABORATORIO,
    nome: 'Lab Lissa',
    descricao: 'Laboratório de experimentação',
    responsavelAmministrativo: '2', // Andréa
    membrosAtivos: ['2'],
    requerAprovacao: false,
    permitirUploadExterno: false,
    cores: { primary: 'bg-orange-600', secondary: 'bg-orange-100' },
  },
  [AreasAtuacao.AGROPECUARIA]: {
    area: AreasAtuacao.AGROPECUARIA,
    nome: 'Agropecuária',
    descricao: 'Conteúdo agrícola e pecuário',
    responsavelAmministrativo: '2', // Andréa
    membrosAtivos: ['2'],
    requerAprovacao: false,
    permitirUploadExterno: true,
    cores: { primary: 'bg-amber-600', secondary: 'bg-amber-100' },
  },
  [AreasAtuacao.FINANCEIRO]: {
    area: AreasAtuacao.FINANCEIRO,
    nome: 'Financeiro',
    descricao: 'Gestão de custos e orçamento',
    responsavelAmministrativo: '1', // Admin
    membrosAtivos: ['1'],
    requerAprovacao: true,
    permitirUploadExterno: false,
    cores: { primary: 'bg-yellow-600', secondary: 'bg-yellow-100' },
  },
  [AreasAtuacao.TECNOLOGIA]: {
    area: AreasAtuacao.TECNOLOGIA,
    nome: 'Tecnologia',
    descricao: 'Infraestrutura e sistemas IT',
    responsavelAmministrativo: '1', // Admin
    membrosAtivos: ['1'],
    requerAprovacao: true,
    permitirUploadExterno: false,
    cores: { primary: 'bg-slate-600', secondary: 'bg-slate-100' },
  },
  [AreasAtuacao.PESQUISA]: {
    area: AreasAtuacao.PESQUISA,
    nome: 'Pesquisa',
    descricao: 'Coleta e análise de dados',
    responsavelAmministrativo: '1', // Admin
    membrosAtivos: ['1'],
    requerAprovacao: true,
    permitirUploadExterno: false,
    cores: { primary: 'bg-indigo-600', secondary: 'bg-indigo-100' },
  },
  [AreasAtuacao.EQUIPE]: {
    area: AreasAtuacao.EQUIPE,
    nome: 'Equipe',
    descricao: 'Gestão de recursos humanos',
    responsavelAmministrativo: '1', // Admin
    membrosAtivos: ['1'],
    requerAprovacao: true,
    permitirUploadExterno: false,
    cores: { primary: 'bg-red-600', secondary: 'bg-red-100' },
  },
};

/**
 * LABELS PARA UI
 */
export const AREA_LABELS: Record<AreasAtuacao, string> = {
  [AreasAtuacao.COORDENACAO]: '👨‍💼 Coordenação',
  [AreasAtuacao.COMUNICACAO]: '📢 Comunicação',
  [AreasAtuacao.SEGURANCA_ALIMENTAR]: '🍎 Segurança Alimentar',
  [AreasAtuacao.LIBRAS]: '🤟 Libras',
  [AreasAtuacao.LABORATORIO]: '🔬 Lab Lissa',
  [AreasAtuacao.AGROPECUARIA]: '🌾 Agropecuária',
  [AreasAtuacao.FINANCEIRO]: '💰 Financeiro',
  [AreasAtuacao.TECNOLOGIA]: '💻 Tecnologia',
  [AreasAtuacao.PESQUISA]: '📊 Pesquisa',
  [AreasAtuacao.EQUIPE]: '👥 Equipe',
};

export const VISIBILIDADE_LABELS: Record<VisibilidadeConteudo, string> = {
  [VisibilidadeConteudo.INTERNO]: '🔒 Interno (Membros)',
  [VisibilidadeConteudo.PUBLICO]: '🌐 Público',
  [VisibilidadeConteudo.BLOQUEADO]: '🚫 Bloqueado',
};
