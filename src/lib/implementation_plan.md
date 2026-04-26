# Plan: Evolução do Estúdio para CMS Visual Completo

Este documento detalha o plano de arquitetura para transformar o Estúdio em um sistema de blocos de edição visual (*Page Builder*), com suporte a edição *inline*, reordenação, gerenciamento de mídia, e aderência estrita à matriz de governança.

## User Review Required

> [!IMPORTANT]
> **Adição de campo JSON ao Schema**: Para suportar componentes complexos (como links de botões, URLs de imagens e itens de galeria) sem quebrar o banco atual onde `content` é uma string simples, proponho transformar ou adicionar um campo `draftData` / `data` no schema `CMSBlock` (ex: salvando via JSON ou adaptando os tipos existentes). Isso permite flexibilidade infinita.

> [!TIP]
> **Módulo de Mídia Simulado vs Firebase Storage**: O plano atual irá construir o painel `MediaManagerModal` conectando ao serviço existente. Se já houver Firebase Storage ativo para você, eu conecto direto nele. Do contrário, deixarei preparado com uploads "mockados" inicialmente mas arquitetura pronta para nuvem. Você autoriza seguir integrando aos adaptadores do `dataService`?

## Proposed Changes

A arquitetura será refatorada para transformar os tradicionais "formulários puros" em **blocos WYSIWYG** (O que você vê é o que você obtém).

### 1. `lib/cms-schema.ts`
Expansão profunda da tipagem de blocos e adição de suporte de reordenação.
#### [MODIFY] `cms-schema.ts`
- Adicionar novos valores ao enum `CMSBlockType` (`quote`, `list`, `gallery`, `card`, `banner`).
- Incluir as propriedades `order: number` na interface do bloco para estruturar a página cima/baixo.
- Incluir `data?: Record<string, any>` e `draftData?: Record<string, any>` para armazenar URLs de botões, tipos de destinos e fontes de mídia preservando os fluxos paralelos (Rascunho vs Publicado).

### 2. `lib/data-service.ts`
Suporte a interações estruturais dentro da camada do banco.
#### [MODIFY] `data-service.ts`
- Adicionar métodos estruturais de bloco: `reorderBlock(pageId, blockId, direction)`, `duplicateBlock(blockId)`, `deleteBlock(blockId)`, `addBlock(pageId, type)`.
- Atualizar o SSR/Hidratação para classificar os blocos retornados usando `.sort((a,b) => a.order - b.order)`.
- Implementar métodos do `MediaManager` (`uploadMedia`, `listMedia`) para interagir com o repositório de documentos/imagens.

### 3. Editor de Página & Renderizador de Blocos
Aqui é onde a experiência *WordPress/Page Builder* toma forma.

#### [NEW] `src/components/cms/MediaManagerModal.tsx`
- Modal flutuante invocado ao clicar em "Trocar Imagem".
- UI com grid de fotos já enviadas + botão de "Arrastar e Soltar" novos arquivos.
- Integração de `Alt Text` obrigatório ao selecionar a imagem.

#### [MODIFY] `src/components/cms/BlockEditor.tsx`
- **Substituição dos Forms longos**: O componente `BlockEditor` passará a agir apenas como um "Wrapper Inteligente" (HOC). Ele renderizará visualmente o resultado *idêntico* à página pública.
- **Edição Inline (`contentEditable`)**: O texto do site, quando focado, vira caixa de digitação automaticamente sem abrir abas.
- **Menu Rápido Flutuante (Hover Menu)**: Ao cruzar com o mouse no bloco, surge uma barra flutuante elegante acima dele contendo: `[↑] [↓] [Duplicar] [Acessibilidade ♿️] [Estilos 🎨] [Lixeira 🗑]`.
- Ao clicar em links e botões, aparece um tooltip modal pequeno para colar a URL de destino diretamente.

#### [MODIFY] `src/components/cms/CMSPageRenderer.tsx`
- Adaptação do mapeamento de renderização `mode === 'live'` vs `mode === 'draft'`.
- Botão permanente no final da página: `[ + Adicionar Novo Bloco (Banner, Texto, Imagem, Destaque) ]`.
- Ao clicar em adicionar, dispara a query para a coleção que instanciará um novo ID com status de `DRAFT` na ordem final `len + 1`.

### 4. Componentização de Tipos Específicos
Na transição para edição *Inline*, cada tipo de bloco precisa de renderização condicional. O próprio `BlockEditor` será refatorado usando Switch-cases baseados no `block.type` e exibindo interfaces híbridas. Exemplo:
- **Button View**: Exibe um Botão. No `Hover`: ícone de link permitindo customizar cores institucionais (sem hex livre) de `Primary/Secondary/Neutral` via um Dropdown nativo da UI.

## Open Questions
- **Acessibilidade Bloqueante?** O sistema deve "Bloquear" o salvamento do botão (Publish) caso uma imagem nova seja inserida *sem definir `alt` obrigatoriamente*, atuando como barreira contra conteúdos não acessíveis?
- O módulo de mídia do Estúdio será compartilhado com o painel `/documentos` do sistema administrativo que vimos anteriormente, ou será uma "biblioteca" de ativos isolada do Estúdio?

## Verification Plan
### Automated & Visual Tests
- Entrar no modo Estúdio `/studio/x`, inserir um novo botão, usar edição visual.
- Arrastar o botão um nível para cima (ou mover pra cima `[↑]`) e verificar se persiste.
- Simular perfil Colaborador local que pode alterar Rascunho sem publicar, verificando se o Toolbar bloqueia aprovação sem as permissões adequadas de Coordenador.
- Abrir modo *Preview*; a UI de Edição perde os contornos pontilhados, virando 100% "what-you-see-is-what-you-get".
