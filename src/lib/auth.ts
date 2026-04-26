/**
 * Sistema de Autenticação Seguro
 * CPF formato: XXX.XXX.XXX-XX
 * Senha com hash simples (produção usar bcrypt)
 */

import type { Sector, Role, UserSectorRole } from './schema/models';

export type UserCredentials = {
  cpfOuEmail: string;  // CPF (069.400.574-63) ou Email
  password: string;    // Senha em plain quando submete form
};

export type StoredUser = {
  id: string;
  cpfOuEmail: string;
  nomeCompleto: string;
  role: Role; // Papel global de legado
  assignments: UserSectorRole[];
  activeSector?: Sector;

  passwordHash: string; // Hash da senha (salvo com hash)
  ativo: boolean;
  dataCriacao: string; // ISO string
  criadoPor: string;   // ID de quem criou
  permissoes: {
    // Permissões de Visualização de Ambiente
    VIEW_PUBLIC: boolean;
    VIEW_PANEL: boolean;
    VIEW_STUDIO: boolean;

    // Permissões de Edição e CMS
    EDIT_TEXT: boolean;
    EDIT_VISUAL: boolean;
    EDIT_ACCESSIBILITY: boolean;
    SAVE_DRAFT: boolean;
    REQUEST_REVIEW: boolean;
    APPROVE_CONTENT: boolean;
    PUBLISH_CONTENT: boolean;

    // Permissões de Auditoria e Gestão
    VIEW_AUDIT: boolean;
    EXPORT_AUDIT: boolean;
    MANAGE_MEMBERS: boolean;
    VIEW_ALL_SECTORS: boolean;
  };
  requiresPasswordChange?: boolean; // Se true, o usuário deve trocar a senha no login
  avatarUrl?: string; // URL da imagem de perfil
  cargo?: string;     // Cargo institucional para exibição no menu
  bio?: string;       // Biografia/Mini-currículo (NOVO)
  lattesUrl?: string; // Link para o Currículo Lattes (NOVO)
  department?: Sector; // Legado (setor primário)
};

export type AuthSession = {
  userId: string;
  nomeCompleto: string;
  role: Role;
  assignments: UserSectorRole[];
  activeSector?: Sector;
  logado: boolean;
  datalogin: string; // ISO string
  permissoes: StoredUser['permissoes'];
  department?: Sector;
  avatarUrl?: string;
  cargo?: string;
  bio?: string;
  lattesUrl?: string;
};

export type AuthResponse = {
  sucesso: boolean;
  mensagem: string;
  usuario?: AuthSession;
  erro?: string;
  requiresPasswordChange?: boolean; // Sinaliza que o login foi bem-sucedido mas a troca de senha é obrigatória
};

/**
 * FUNÇÃO: Hash simples de senha (usar bcryptjs em produção)
 * 
 * Exemplo:
 * hashPassword('A1g3d5s@!#') → "hash_base64_aqui"
 */
export function hashPassword(password: string): string {
  // ⚠️ AVISO: Isso é apenas para demo. Em produção usar bcryptjs!
  
  // Solução estável para demo: base64
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  let binary = '';
  data.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  
  return btoa(binary);
}

/**
 * FUNÇÃO: Verificar se hash bate com senha
 * Simples comparação para demo
 */
export function verifyPassword(password: string, hash: string): boolean {
  // ⚠️ AVISO: Isso é apenas para demo. Em produção usar bcryptjs!
  try {
    const encoded = hashPassword(password);
    return encoded === hash;
  } catch {
    return false;
  }
}

/**
 * FUNÇÃO: Formatar CPF para validação
 * "06940057463" → "069.400.574-63"
 * "069.400.574-63" → "069.400.574-63"
 */
export function formatarCPF(cpf: string): string {
  const apenas_numeros = cpf.replace(/\D/g, '');
  
  if (apenas_numeros.length !== 11) {
    return cpf; // Inválido, retorna original
  }
  
  return apenas_numeros.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    '$1.$2.$3-$4'
  );
}

/**
 * FUNÇÃO: Validar CPF (algoritmo real)
 * Verifica dígitos verificadores
 */
export function validarCPF(cpf: string): boolean {
  const apenas_numeros = cpf.replace(/\D/g, '');
  
  if (apenas_numeros.length !== 11) {
    return false;
  }
  
  // Rejeita sequências iguais
  if (/^(\d)\1{10}$/.test(apenas_numeros)) {
    return false;
  }
  
  // Valida primeiro dígito
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(apenas_numeros.charAt(i)) * (10 - i);
  }
  
  let resto = 11 - (soma % 11);
  const dv1 = resto === 10 || resto === 11 ? 0 : resto;
  
  if (parseInt(apenas_numeros.charAt(9)) !== dv1) {
    return false;
  }
  
  // Valida segundo dígito
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(apenas_numeros.charAt(i)) * (11 - i);
  }
  
  resto = 11 - (soma % 11);
  const dv2 = resto === 10 || resto === 11 ? 0 : resto;
  
  return parseInt(apenas_numeros.charAt(10)) === dv2;
}

/**
 * FUNÇÃO: Validar força de senha
 * Retorna score 0-100
 */
export function validarForcaSenha(senha: string): {
  score: number;
  nivel: 'muito_fraca' | 'fraca' | 'media' | 'forte' | 'muito_forte';
  avisos: string[];
} {
  const avisos: string[] = [];
  let score = 0;

  if (senha.length >= 8) score += 10;
  if (senha.length >= 12) score += 10;
  if (/[a-z]/.test(senha)) score += 15;
  if (/[A-Z]/.test(senha)) score += 15;
  if (/\d/.test(senha)) score += 15;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(senha)) score += 20;

  if (senha.length < 8) avisos.push('Use pelo menos 8 caracteres');
  if (!/[a-z]/.test(senha)) avisos.push('Adicione letras minúsculas');
  if (!/[A-Z]/.test(senha)) avisos.push('Adicione letras maiúsculas');
  if (!/\d/.test(senha)) avisos.push('Adicione números');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) avisos.push('Adicione caracteres especiais');

  let nivel: 'muito_fraca' | 'fraca' | 'media' | 'forte' | 'muito_forte';
  if (score < 20) nivel = 'muito_fraca';
  else if (score < 40) nivel = 'fraca';
  else if (score < 60) nivel = 'media';
  else if (score < 80) nivel = 'forte';
  else nivel = 'muito_forte';

  return { score, nivel, avisos };
}
