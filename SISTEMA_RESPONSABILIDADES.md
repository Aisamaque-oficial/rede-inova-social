# 📋 Sistema de Responsabilidades - Rede Inova

## 📝 Visão Geral

Sistema completo de atribuição de responsabilidades aos membros com controle granular de quem pode:
- ✏️ Editar conteúdo
- 🔒 Fazer upload interno (membros apenas)  
- 🌐 Fazer upload público
- ✅ Aprovar conteúdo
- 📢 Publicar conteúdo

---

## 🎯 Componentes Principais

### 1. **AreasAtuacao** (Enum)
Define os 10 departamentos do projeto:

```
✓ Coordenação         (Gestão geral)
✓ Comunicação         (CMS, redes)
✓ Segurança Alimentar (Nutrição)
✓ Libras              (Inclusão)
✓ Laboratório         (Lab Lissa)
✓ Agropecuária        (Agricultura)
✓ Financeiro          (Custos)
✓ Tecnologia          (IT)
✓ Pesquisa            (Dados)
✓ Equipe              (RH)
```

### 2. **Responsabilidade** (Type)
Define o que um membro pode fazer:

```typescript
{
  id: "resp-editor-com"
  area: AreasAtuacao.COMUNICACAO
  titulo: "Editor de Conteúdo"
  podeEditar: true
  podeUploadInterno: true
  podeUploadExterno: false
  podeAprovar: false
  podePublicar: true
}
```

### 3. **VisibilidadeConteudo** (Enum)
Controla quem vê o arquivo:

```
🔒 INTERNO  → Somente membros da plataforma
🌐 PUBLICO  → Todos podem ver
🚫 BLOQUEADO → Apenas responsável
```

### 4. **MembroResponsabilidades** (Type)
Mapeia responsabilidades para membro:

```typescript
{
  usuarioId: "user-123"
  nomeCompleto: "Bruna Almeida"
  responsabilidades: [...]  // Array de Responsabilidade
  areasPrincipais: [COMUNICACAO, LIBRAS]
  dataAtribuicao: "2026-03-29T..."
  ativo: true
}
```

---

## 🔄 Fluxo de Atribuição (Admin)

```
1. Admin vai para /admin/responsabilidades
   └─ TAB: "Atribuir Responsabilidades"

2. Seleciona membro na lista
   └─ Interface destaca membro selecionado

3. Marca responsabilidades desejadas
   ├─ Editor de Conteúdo ✓
   ├─ Especialista Libras ✗
   ├─ Revisor ✓
   └─ ...

4. Clica "Salvar Responsabilidades"
   ├─ Valida seleção
   ├─ Salva em membrosResponsabilidades Map
   ├─ Registra em log de auditoria
   └─ Mostra notificação de sucesso

5. Membro recebe atualizações automáticas
   └─ Acesso refletido imediatamente
```

---

## 🛡️ Verificações de Permissão

### No Frontend (Controle de UI)
```typescript
// Mostrar/esconder botões de edição
if (dataService.podeEditar(usuarioId)) {
  // Mostrar botão "Editar"
}

// Permitir upload externo
if (dataService.podeUploadExterno(usuarioId)) {
  // Mostrar input "Upload Público"
}
```

### No Backend (data-service)
```typescript
dataService.podeEditar(usuarioId)         // boolean
dataService.podeUploadInterno(usuarioId)  // boolean
dataService.podeUploadExterno(usuarioId)  // boolean
dataService.podeAprovar(usuarioId)        // boolean
```

---

## 📊 Responsabilidades Pré-configuradas

### Admin
```
✓ Editar
✓ Upload Interno
✓ Upload Externo
✓ Aprovar
✓ Publicar
```

### Editor de Conteúdo
```
✓ Editar
✓ Upload Interno
✗ Upload Externo
✗ Aprovar
✓ Publicar
```

### Especialista Libras
```
✓ Editar
✓ Upload Interno
✗ Upload Externo
✗ Aprovar
✓ Publicar
```

### Especialista em Nutrição
```
✓ Editar
✓ Upload Interno
✗ Upload Externo
✗ Aprovar
✗ Publicar
```

### Gerenciador Lab
```
✓ Editar
✓ Upload Interno
✗ Upload Externo
✗ Aprovar
✓ Publicar
```

### Revisor
```
✗ Editar
✗ Upload Interno
✗ Upload Externo
✓ Aprovar
✗ Publicar
```

### Membro Comum
```
✗ Editar
✗ Upload Interno
✗ Upload Externo
✗ Aprovar
✗ Publicar
```

---

## 📁 Arquivo com Visibilidade

Quando um membro faz upload, o arquivo fica registrado assim:

```typescript
{
  id: "arquivo-123456",
  nome: "receita_saudavel.pdf",
  tipo: "documento",
  visibilidade: "internal"  // ou "public"
  uploadadoPor: "user-3",   // Bruna
  area: "comunicacao",      // Qual área responsável
  podeEditar: ["user-3"],   // Bruna pode editar
  podeVisualizacao: ["user-3", "user-4", "user-11"],  // Membros da área
  apropenação: {
    status: "pendente",     // Se requer aprovação
    // Será "aprovado" quando revisor com podeAprovar revisar
  }
}
```

---

## 🔐 Regras de Segurança

### Upload Público (🌐)
- ✅ Somente membros com `podeUploadExterno: true`
- ✅ Arquivo visível para público
- ⚠️ Pode requerer aprovação (configurável por área)

### Upload Interno (🔒)
- ✅ Somente membros com `podeUploadInterno: true`
- ✅ Somente membros da mesma área podem ver
- ⚠️ Pode requerer aprovação conforme configuração

### Edição (✏️)
- ✅ Somente criador + membros com `podeEditar: true`
- ✅ Rastreado em LogAuditoria

### Aprovação (✅)
- ✅ Somente membros com `podeAprovar: true`
- ✅ Muda status de "pendente" para "aprovado"
- ✅ Registra quem, quando e por quê

### Publicação (📢)
- ✅ Somente membros com `podePublicar: true`
- ✅ Conteúdo fica visível no site público
- ✅ Registra log de auditoria

---

## 📋 Página de Admin: `/admin/responsabilidades`

### TAB 1: Atribuir Responsabilidades

**Coluna 1 - Selecionar Membro:**
```
┌──────────────────────────┐
│ 👤 Bruna Almeida         │ ← Clique para selecionar
│    bruna@rede-inova.br   │
│    [Editor de Conteúdo]  │
└──────────────────────────┘
```

**Coluna 2 - Responsabilidades:**
```
┌──────────────────────────────┐
│ Selecione Responsabilidades  │
├──────────────────────────────┤
│ ☑ Editor de Conteúdo        │
│   (Edita e publica conteúdo) │
│   [✏️ Editar] [🔒 Interno]   │
│                              │
│ ☐ Especialista Libras        │
│ ☑ Revisor                    │
│ ...                          │
└──────────────────────────────┘
     [Salvar Responsabilidades]
```

### TAB 2: Visualizar Atribuições

```
┌─ Bruna Almeida ─────────────────────────┐
│ Ativo desde 29/03/2026   [✓ Ativo]     │
├─────────────────────────────────────────┤
│ 📍 Áreas: [Comunicação] [Libras]        │
│                                         │
│ 💼 Responsabilidades:                   │
│  ┌─ Editor de Conteúdo ──────┐         │
│  │ Edita e publica conteúdo  │         │
│  │ [✏️ Editar] [🔒 Interno]   │         │
│  │ [📢 Publicar]              │         │
│  └────────────────────────────┘         │
│                                         │
│  ┌─ Especialista Libras ──────┐        │
│  │ Gerencia glossário         │        │
│  │ [✏️ Editar] [🌐 Externo]    │        │
│  └────────────────────────────┘        │
│                                         │
│ ⚙️ Configurações das Areas:             │
│  • Comunicação 🔔 Requer Aprovação     │
│  • Comunicação 🌐 Upload Público       │
└─────────────────────────────────────────┘
```

---

## 🔄 Exemplo Completo: Criar e Publicar Artigo

### Dia 1: Admin atribui responsabilidades
```
Admin vai para /admin/responsabilidades
├─ Seleciona: Bruna Almeida
├─ Marca: ✓ Editor de Conteúdo
├─ Marca: ✓ Revisor
└─ Clica: Salvar

// Resultado:
membrosResponsabilidades.get("bruna-id") = {
  usuarioId: "bruna-id",
  nomeCompleto: "Bruna Almeida",
  responsabilidades: [
    RESPONSABILIDADES_PADRAO.EDITOR_COMUNICACAO,
    RESPONSABILIDADES_PADRAO.REVISOR
  ],
  areasPrincipais: [COMUNICACAO],
  ativo: true
}
```

### Dia 2: Bruna cria artigo
```
Bruna acessa página de edição
├─ dataService.podeEditar("bruna-id") ✓
├─ Mostra botão "Criar Artigo"
├─ Bruna clica "Criar"
├─ Preenche: Título, Conteúdo
├─ Escolhe visibilidade: 🌐 Público
└─ Clica "Criar + Enviar para Aprovação"

// Backend:
dataService.registrarUpload(
  "artigo-refeicoes.pdf",
  VisibilidadeConteudo.PUBLICO,
  AreasAtuacao.COMUNICACAO,
  "documento"
)

// Resultado: Arquivo criado com status "pendente"
// (porque AREAS_CONFIGURACAO[COMUNICACAO].requerAprovacao = true)
```

### Dia 3: Revisor aprova
```
Revisor (também tem podeAprovar: true) acessa
├─ Vê artigo de Bruna em estado "pendente"
├─ Lê o conteúdo
├─ dataService.podeAprovar("revisor-id") ✓
├─ Clica "Aprovar"
└─ Aprova com comentário: "Excelente!"

// Resultado: Arquivo fica com status "aprovado"
```

### Dia 4: Artigo fica público
```
Público acessa site.redeinova.com
├─ Vê artigo de Bruna
├─ Lê: "Refeições Saudáveis"
└─ Compartilha em redes!

// Log de auditoria registra:
{
  usuario: "bruna-id",
  acao: "publish",
  recurso: "artigo-refeicoes.pdf",
  visibilidade: "public",
  dataHora: "2026-03-30T14:30:00Z",
  resultado: "sucesso"
}
```

---

## 🚀 Próximas Features (Phase 3)

- [ ] Workflow de aprovação multi-nível
- [ ] Notificações de alteração de status
- [ ] Histórico completo de auditori (com filtros)
- [ ] Exportar relatório de permissões
- [ ] Integração com email para notificações
- [ ] Dashboard com estatísticas de uploads
- [ ] Versionamento de arquivos
- [ ] Recuperação de versões antigas

---

## 📁 Arquivos Envolvidos

| Arquivo | Propósito |
|---------|-----------|
| `src/lib/responsabilidades.ts` | Tipos e configurações |
| `src/lib/data-service.ts` | Métodos de gerenciamento |
| `src/app/(app)/admin/responsabilidades/page.tsx` | Interface de Admin |

---

## ✅ Checklist de Implementação

- [x] Tipos criados (Responsabilidade, MembroResponsabilidades, etc)
- [x] 10 Áreas de Atuação definidas
- [x] 7 Responsabilidades pré-configuradas
- [x] storage em memória (membrosResponsabilidades, arquivosRastreados)
- [x] Métodos no data-service (atribuir, verificar permissões, registrar upload)
- [x] Página de admin para atribuição
- [x] Log de auditoria básico
- [ ] Integração com componentes de upload
- [ ] Email de notificação
- [ ] Dashboard de estatísticas

---

*Última atualização: 29 de março de 2026*
*Versão: 1.0*
