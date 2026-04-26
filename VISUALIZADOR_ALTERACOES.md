# 📊 Visualizador de Alterações - Rede Inova

## 🗂️ Estrutura de Alterações

### ✅ ARQUIVOS CRIADOS (3 novos componentes)

```
📂 src/components/
  ├── 🆕 image-uploader.tsx          ← Upload de imagens com crop/zoom
  ├── 🆕 glossary-editor.tsx         ← Editor de termos bilíngues 
  └── 🆕 lab-station-editor.tsx      ← Gerenciador de estações
```

---

## 📝 ARQUIVOS MODIFICADOS (4 principais)

### 1️⃣ src/lib/mock-data.ts
**O que mudou:**
- ✅ Adicionado enum `UserRole` com 5 valores
- ✅ Adicionado tipo `UserPermissions` com 7 permissões
- ✅ Tipo `User` expandido com permissões granulares
- ✅ Todos os 14 membros atualizados com permissões específicas

**Visualização:**
```typescript
// ANTES
export type User = {
  id: string;
  name: string;
  canEditContent?: boolean;  // ❌ Apenas 1 boolean
};

// DEPOIS
export enum UserRole {
  COORDINATOR = 'coordinator',
  MEMBER_EDITOR = 'member_editor',
  MEMBER_SPECIALIST = 'member_specialist',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export type UserPermissions = {
  canEditContent: boolean;    // Editar CMS
  canEditImages: boolean;     // Upload de imagens
  canEditGlossary: boolean;   // Editar glossários
  canEditStation: boolean;    // Editar estações Lab
  canManageMembers: boolean;  // Gerenciar membros
  canManageTasks: boolean;    // Gerenciar tarefas
  canUploadMedia: boolean;    // Upload de mídia
};

export type User = {
  userRole: UserRole;         // ✅ Novo
  permissions: UserPermissions; // ✅ Novo
};
```

---

### 2️⃣ src/lib/data-service.ts
**O que mudou:**
- ✅ Novos métodos de verificação: `hasPermission()`, `getCurrentUser()`, `isCoordinator()`
- ✅ Métodos de conteúdo: `updatePageContent()`, `getPageContent()`
- ✅ Métodos de glossário: `updateGlossaryTerm()`, `getGlossaryTerm()`
- ✅ Métodos de Lab: `updateLabStation()`, `getLabStation()`
- ✅ Método de mídia: `recordMediaUpload()`

**Fluxo novo:**
```
├─ Verificações de Permissão
│  ├─ hasPermission('canEditContent')
│  ├─ getCurrentUser()
│  └─ isCoordinator()
│
├─ Gerenciar Conteúdo (CMS)
│  ├─ updatePageContent(pageId, content)
│  └─ getPageContent(pageId, default)
│
├─ Gerenciar Glossários
│  ├─ updateGlossaryTerm(eixoId, termName, updates)
│  └─ getGlossaryTerm(eixoId, termName)
│
├─ Gerenciar Estações
│  ├─ updateLabStation(stationId, updates)
│  └─ getLabStation(stationId)
│
└─ Gerenciar Mídia
   └─ recordMediaUpload(type, data)
```

---

### 3️⃣ src/app/login/page.tsx
**O que mudou:**
- ✅ Adicionado seletor visual de membros
- ✅ Import de `teamMembers` para mostrar lista
- ✅ Modal de seleção com avatares
- ✅ 5 modos de acesso rápido:
  1. Email + Senha
  2. Coordenador
  3. Seletor de Membro Editor ← **NOVO**
  4. Membro Comum
  5. Modo Convidado

**Visualização:**
```
┌─────────────────────────────────────┐
│  TELAS DE LOGIN NOVAS               │
├─────────────────────────────────────┤
│ 1. Email + Senha (Firebase)         │
│ 2. [Acessar como Coordenador]       │
│ 3. [Seletor de Membro Editor] ✨    │
│    ├─ Bruna (CMS + Imagens)        │
│    ├─ Jaqueline (Libras + Mídia)   │
│    ├─ Andréa (Agropecuária)        │
│    └─ [Mais membros...]            │
│ 4. [Acessar como Membro Comum]     │
│ 5. [Modo Convidado]                │
└─────────────────────────────────────┘
```

---

### 4️⃣ src/app/(app)/gerenciar/usuarios/page.tsx
**O que mudou:**
- ✅ Interface completamente redesenhada
- ✅ Cada membro em card colapsível
- ✅ Mostra contador de permissões (ex: "5/7")
- ✅ Ícones visuais para cada permissão
- ✅ Toggles granulares para ativar/desativar
- ✅ Apenas coordenador pode editar

**Visualização:**
```
┌─────────────────────────────────────────────────┐
│  Antes: 1 toggle por membro (canEditContent)   │
│                                                 │
│  Depois: 7 toggles por membro                   │
│  ┌────────────────────────────────────────────┐ │
│  │ 👤 Bruna Almeida | 5/7 permissões    ▼    │ │
│  │                                        ### │ │
│  │ [Expandido]                              │ │
│  │ ✓ Editar Conteúdo        [Toggle ON]     │ │
│  │ ✓ Editar Imagens         [Toggle ON]     │ │
│  │ ✓ Editar Glossário       [Toggle ON]     │ │
│  │ ✗ Editar Estações        [Toggle OFF]    │ │
│  │ ✗ Gerenciar Membros      [Toggle OFF]    │ │
│  │ ✗ Gerenciar Tarefas      [Toggle OFF]    │ │
│  │ ✓ Upload de Mídia        [Toggle ON]     │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 🎨 COMPONENTES NOVOS EM DETALHES

### Component 1: ImageUploader
```
Localização: src/components/image-uploader.tsx
Tamanho: ~250 linhas

Recursos:
├─ Drag & Drop automático
├─ Preview em tempo real
├─ Zoom (0.5x até 3x)
├─ Validação tipo/tamanho
└─ Permissão obrigatória: canEditImages

Props:
├─ onImageSelect: (file, preview) => void
├─ canEditImages: boolean
├─ maxSize?: number (default: 5MB)
└─ acceptedFormats?: string[] (default: jpg/png/webp)

Estados:
├─ selectedFile: File | null
├─ preview: string | null
├─ isDragging: boolean
├─ isEditing: boolean
├─ zoom: number (1-3)
└─ error: string | null

Fluxo:
1. Usuário arrasta ou clica
2. Valida arquivo
3. Mostra preview
4. Zoom/edit opcional
5. Clica "Confirmar"
6. Retorna file + preview URL
```

---

### Component 2: GlossaryEditor
```
Localização: src/components/glossary-editor.tsx
Tamanho: ~350 linhas

Recursos:
├─ Criar novo termo
├─ Editar termo existente
├─ Deletar termo
├─ Link YouTube Libras
├─ Múltiplos exemplos
├─ Termos relacionados
└─ Permissão obrigatória: canEditGlossary

Props:
├─ eixoTitle: string
├─ eixoId: string
├─ terms: GlossaryTermForm[]
├─ onTermUpdate: async (termName, updates) => void
├─ onTermAdd: async (term) => void
├─ onTermDelete: async (termName) => void
└─ canEdit: boolean

Campos Editáveis:
├─ term: string        ("Alergia")
├─ description: string ("Reação do sistema...")
├─ videoUrl?: string   ("https://youtube.com/embed/...")
├─ examples?: string[] (["Amendoim...", "Fruto do mar..."])
└─ related?: string[]  (["Imunidade", "Histamina"])

Validações:
├─ Termo não pode ser vazio
├─ Descrição obrigatória
├─ Video deve ser YouTube válido
└─ URL do YouTube detecta automaticamente

Fluxo:
1. Clica "+ Novo Termo"
2. Preenche campos
3. Cola link YouTube (preview automático)
4. Adiciona exemplos
5. Clica "Salvar"
6. Retorna para lista
```

---

### Component 3: LabStationEditor
```
Localização: src/components/lab-station-editor.tsx
Tamanho: ~300 linhas

Recursos:
├─ Criar nova estação
├─ Editar estação
├─ Deletar estação
├─ Escolher emoji (8 opções)
├─ Escolher cor (6 opções)
├─ Ativar/Desativar
└─ Permissão obrigatória: canEditStation

Props:
├─ stations: LabStation[]
├─ onStationUpdate: async (id, updates) => void
├─ onStationAdd: async (station) => void
├─ onStationDelete: async (id) => void
└─ canEdit: boolean

Campos Editáveis:
├─ label: string      ("Cozinha Nutricional")
├─ description: string ("Aprenda sobre comida...")
├─ icon: string       ("🍎" - emoji)
├─ color: string      ("bg-orange-500")
├─ active: boolean    (true/false)
└─ materials?: string[]

Cores Disponíveis:
├─ bg-orange-500  (Laranja)
├─ bg-blue-500    (Azul)
├─ bg-purple-600  (Roxo)
├─ bg-green-600   (Verde)
├─ bg-indigo-600  (Indigo)
└─ bg-pink-600    (Rosa)

Emojis Disponíveis:
├─ 🍎 (Nutrição)
├─ 📚 (Biblioteca)
├─ 🤟 (Libras)
├─ 🌱 (Agricultura)
├─ 🎮 (Jogos)
├─ 🔬 (Ciência)
├─ 🎨 (Arte)
└─ 🎯 (Alvo)

Fluxo:
1. Clica "+ Nova Estação"
2. Seleciona emoji + cor
3. Edita nome e descrição
4. Clica status (ativo/inativo)
5. Clica "Salvar"
6. Mostra em grid de cards
```

---

## 📊 COLEÇÕES FIRESTORE CRIADAS

```
Firebase Console → Firestore Database
├─ editableContent/       ← Conteúdo do CMS
│  └─ {documentId}
│     ├─ pageId: "lab_hero_title"
│     ├─ content: "Lab LISSA"
│     ├─ updatedAt: ISOString
│     ├─ updatedBy: "1"
│     └─ updatedByName: "Aisamaque"
│
├─ glossaryTerms/         ← Termos bilíngues
│  └─ {documentId}
│     ├─ eixoId: "eixo-imunologico"
│     ├─ term: "Alergia"
│     ├─ description: "Reação do sistema..."
│     ├─ videoUrl: "https://..."
│     ├─ examples: ["Amendoim...", "..."]
│     └─ updatedBy: "11"
│
├─ labStations/          ← Configurações Lab
│  └─ {documentId}
│     ├─ stationId: "nutricao"
│     ├─ label: "Cozinha Nutricional"
│     ├─ description: "..."
│     ├─ icon: "🍎"
│     ├─ color: "bg-orange-500"
│     └─ active: true
│
└─ mediaLibrary/         ← Registro de mídia
   └─ {documentId}
      ├─ type: "image" | "video"
      ├─ name: "logo_lab.png"
      ├─ url: "gs://bucket/..."
      ├─ uploadedBy: "1"
      └─ uploadedAt: ISOString
```

---

## 🔐 PERMISSÕES GRANULARES

```
┌────────────────────────────────────────────────┐
│ 7 PERMISSÕES IMPLEMENTADAS                    │
├────────────────────────────────────────────────┤
│ 📝 canEditContent         (Editar CMS)       │
│ 🖼️  canEditImages         (Upload imagens)   │
│ 📚 canEditGlossary        (Glossários Libras)│
│ 🏛️  canEditStation        (Estações Lab)    │
│ 👥 canManageMembers       (Gerenciar team)  │
│ ✅ canManageTasks         (Atribuir tarefas)│
│ 📹 canUploadMedia         (Vídeos/áudio)    │
└────────────────────────────────────────────────┘

Permissões por Membro:
├─ Aisamaque       [7/7] ✅✅✅✅✅✅✅
├─ Bruna           [5/7] ✅✅✅❌❌❌✅
├─ Andréa          [4/7] ✅✅✅✅❌❌❌
├─ Jaqueline       [2/7] ❌❌✅❌❌❌✅
├─ Dayane          [1/7] ❌❌❌❌❌✅❌
└─ (Membros comuns) [0/7] ❌❌❌❌❌❌❌
```

---

## 🔄 FLUXO DE EDIÇÃO COMPLETO

```
EXEMPLO: Editar termo "Alergia" em Libras

1️⃣ LOGIN
   login/page.tsx
   └─ Seleciona "Jaqueline" (permissão canEditGlossary)
      └─ Armazena current_user_id = "11"

2️⃣ NAVEGAR
   /laboratorio ou /glossario
   └─ Mostra botão "Editar" (se tem permissão)

3️⃣ COMPONENTE ABRE
   GlossaryEditor renderiza
   └─ Permite editar termos do eixo

4️⃣ EDITAR
   Clica em "termo" ou "Novo Termo"
   └─ Form abre (com validação)

5️⃣ SALVAR
   Clica "Salvar Termo"
   └─ onTermUpdate() executado

6️⃣ PERSISTÊNCIA
   dataService.updateGlossaryTerm()
   ├─ Firestore collection:glossaryTerms atualizado
   ├─ Registra updatedBy: "11"
   ├─ Registra updatedAt: "2026-03-29T..."
   └─ SE FIRESTORE FALHAR → Fallback localStorage

7️⃣ RESULTADO
   ✅ Alteração PERMANENTE
   └─ Próximo acesso ao glossário mostra versão nova
```

---

## 🎯 CHECKLIST - O QUE FOI FEITO

### Arquivos
- [x] 3 componentes criados (image-uploader, glossary-editor, lab-station-editor)
- [x] 4 arquivos modificados (mock-data, data-service, login, usuarios)
- [x] 0 arquivos deletados (apenas adições)

### Funcionalidades
- [x] Sistema de 7 permissões granulares
- [x] 5 roles de usuário
- [x] 4 collections Firestore
- [x] Login com seletor visual de membros
- [x] Gerenciador de permissões por membro
- [x] Upload de imagens com crop/zoom
- [x] Editor de glossários com vídeo Libras
- [x] Gerenciador de estações Lab
- [x] Rastreamento de autor/data

### Documentação
- [x] MELHORIAS_IMPLEMENTADAS.md
- [x] GUIA_INTEGRACAO.md
- [x] ROADMAP_FASE2.md

---

## 🚀 COMO TESTAR (Se npm funcionar)

```bash
# 1. Abrir navegador
http://localhost:3000

# 2. Ir para LOGIN
http://localhost:3000/login

# 3. Clicar "Seletor de Membro"
└─ Ver modal com avatares

# 4. Selecionar "Bruna Almeida Batista"
└─ Vai ter acesso editável

# 5. Ir para /gerenciar/usuarios
└─ Ver todas as 7 permissões com toggles

# 6. Ir para /laboratorio
└─ Ver componentes de edição (se habilitados)
```

---

*Documento gerado automaticamente*
*Data: 29 de março de 2026*
