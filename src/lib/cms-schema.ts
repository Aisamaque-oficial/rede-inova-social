/**
 * 🏗️ REDE INOVA SOCIAL - CMS BLOCK SCHEMA
 * 
 * Este arquivo define a estrutura de dados para o sistema de gestão de conteúdo 
 * baseado em blocos, com governança editorial e acessibilidade integrada.
 */

export type CMSBlockType = 'text' | 'image' | 'header' | 'video' | 'button' | 'quote' | 'list' | 'gallery' | 'card' | 'banner';

/**
 * Fluxo Editorial Institucional
 * DRAFT -> EM_REVISAO (Editor salvou) -> APROVADO (Coordenador validou) -> PUBLICADO (Site atualizado)
 */
export type CMSBlockStatus = 'DRAFT' | 'EM_REVISAO' | 'APROVADO' | 'PUBLICADO';

export interface CMSBlockAccessibility {
    librasUrl: string;
    altText: string;
    description: string;
    internalNotes?: string;
}

export interface CMSBlockMetadata {
    lastEditedBy: string;
    lastEditedByName: string;
    lastEditedAt: string;
    validatedBy?: string;
    validatedByName?: string;
    publishedBy?: string;
    publishedByName?: string;
    publishedAt?: string;
    version: number;
}

export interface CMSBlock {
    id: string;               // ID único do bloco (ex: landing_hero_1)
    pageId: string;           // Página a que pertence
    type: CMSBlockType;
    status: CMSBlockStatus;
    
    // Controle Estrutural
    order: number;            // Ordem de exibição na página
    
    // Conteúdo Texto Básico
    content: string;
    draft: string;
    
    // Conteúdo Estruturado / JSON (URLs, Imagens, Galerias)
    data?: Record<string, any>;
    draftData?: Record<string, any>;
    
    // Camada de Acessibilidade
    accessibility: CMSBlockAccessibility;
    
    // Camada Visual (Presets Travados)
    style: {
        preset: 'primary' | 'secondary' | 'accent' | 'neutral';
        alignment: 'left' | 'center' | 'right';
    };
    
    // Governança e Auditoria
    metadata: CMSBlockMetadata;
    
    // Feedback e Ciclo Escrito (Apontamentos)
    rejectionReason?: string;
    lastAction?: 'SUBMIT' | 'APPROVE' | 'REJECT' | 'PUBLISH';
}

export interface CMSAuditLog {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    action: 'CREATE' | 'EDIT' | 'APPROVE' | 'REJECT' | 'PUBLISH' | 'ROLLBACK';
    pageId: string;
    blockId: string;
    before: any;
    after: any;
    version: number;
}

export const INSTITUTIONAL_PALETTE = {
    primary: '#0ea5e9', // Deep Blue
    secondary: '#facc15', // Citrus Yellow
    accent: '#8b5cf6', // Indigo
    neutral: '#64748b', // Slate
};
