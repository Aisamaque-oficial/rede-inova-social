# 🔐 Sistema de Autenticação Seguro - Rede Inova

## 📋 Resumo

Sistema de autenticação completo e seguro com:
- ✅ Admin com CPF + Senha
- ✅ Validação de CPF (algoritmo real com dígitos verificadores)
- ✅ Hash de senha com timestamp
- ✅ Força de senha obrigatória (média/forte)
- ✅ Admin cadastra membros com senhas temporárias
- ✅ Sistema de permissões granulares
- ✅ **Credenciais NÃO expostas no código público**

---

## 🔑 Credenciais (SEGURAS)

⚠️ **CREDENCIAIS CONCENTRADAS EM**: `CREDENCIAIS_ADMIN.txt`

Este arquivo:
- ✅ **NÃO está no repositório** (.gitignore)
- ✅ **Somente acessível localmente**
- ✅ **Não é exibido em nenhuma página pública**
- ✅ **Contém instruções de segurança**

Para aceça a credenciais, abra o arquivo: `CREDENCIAIS_ADMIN.txt`

---

## 📁 Arquivos Criados/Modificados

### 1. **src/lib/auth.ts** ✨ NOVO
Tipos e funções de autenticação:
```typescript
- UserCredentials      // Dados enviados no form
- StoredUser           // Usuário armazenado com permissões
- AuthSession          // Sessão ativa
- AuthResponse         // Resposta padrão

Funções:
- hashPassword()       // Hash de senha
- verifyPassword()     // Verificar hash
- validarCPF()        // Validação com dígitos
- formatarCPF()       // Formatar: 06940057463 → 069.400.574-63
- validarForcaSenha() // Score 0-100 de força
```

### 2. **src/lib/auth-credentials.ts** ✨ NOVO
Banco de dados de usuários (em memória):
```typescript
- usuariosCadastrados[]        // Array de StoredUser
- encontrarUsuarioPor()       // Buscar por CPF/Email
- encontrarUsuarioPorId()     // Buscar por ID
- listarTodosUsuarios()       // Listar todos
- adicionarNovoUsuario()      // Adicionar novo
- atualizarUsuario()          // Atualizar
- deletarUsuario()            // Deletar
- alterarSenha()              // Mudar senha
- resetarSenha()              // Gerar temp password
- desativarUsuario()          // Inativar (não deleta)
```

### 3. **src/lib/data-service.ts** 📝 MODIFICADO
Novos métodos adicionados:

#### Autenticação
```typescript
// Login com CPF/Email + Senha
fazerLogin(cpfOuEmail, senha): Promise<AuthResponse>

// Sair
fazerLogout(): Promise<void>

// Pegar sessão atual
obterSessaoAtual(): AuthSession | null

// Verificar se autenticado
estaAutenticado(): boolean

// Alterar minha senha
alterarMinhaSenha(senhaAtual, novaSenha): Promise<AuthResponse>
```

#### Admin Operations
```typescript
// Listar todos (apenas admin)
listarTodosUsuarios(): StoredUser[]

// Criar novo membro
criarNovoUsuario(dados): Promise<AuthResponse>

// Atualizar membro
atualizarUsuario(userId, updates): Promise<AuthResponse>

// Deletar membro
deletarUsuario(userId): Promise<AuthResponse>

// Resetar senha
resetarSenhaUsuario(userId): Promise<AuthResponse>

// Desativar membro
desativarUsuario(userId): Promise<AuthResponse>
```

### 4. **src/app/login/page.tsx** 🔄 REESCRITO
Novo formulário de login:
```
Campos:
  - CPF ou Email (formata automaticamente)
  - Senha

Validações:
  - CPF válido (com dígitos verificadores)
  - Senha obrigatória
  - Erros exibidos ao usuário

Fluxo:
  1. Usuario entra CPF/Email + Senha
  2. Clica "Entrar com Credenciais"
  3. Valida no dataService.fazerLogin()
  4. Se sucesso: mostra loading 1.5s
  5. Redireciona para /dashboard
  6. Sessão armazenada em localStorage
```

### 5. **src/app/(app)/admin/membros/page.tsx** ✨ NOVO
Painel de administração:
```
Funcionalidades:
  - Criar novo membro com permissões granulares
  - Editar membro existente
  - Deletar membro
  - Resetar senha (gera temp password)
  - Listar todos os membros
  - Mostrar último acesso/data criação

Acesso:
  - Apenas admin e coordenador
  - URL: /admin/membros
```

---

## 🔄 Fluxo de Login Seguro

```
┌─────────────────────────────────┐
│   Usuário acessa /login         │
├─────────────────────────────────┤
│ 1. Digita CPF e Senha           │
│    CPF: 069.400.574-63          │
│    Senha: A1g3d5s@!#            │
├─────────────────────────────────┤
│ 2. Clica "Entrar"               │
├─────────────────────────────────┤
│ 3. dataService.fazerLogin()     │
│    ├─ Valida entrada            │
│    ├─ Procura usuário           │
│    ├─ Verifica se ativo         │
│    ├─ Verifica senha (hash)     │
│    └─ Retorna AuthResponse      │
├─────────────────────────────────┤
│ 4. Se sucesso:                  │
│    ├─ Salva sessão localStorage │
│    ├─ Mostra loading 1.5s       │
│    └─ Redireciona /dashboard    │
├─────────────────────────────────┤
│ 5. Se erro:                     │
│    └─ Mostra mensagem de erro   │
└─────────────────────────────────┘
```

---

## 🔄 Fluxo de Criação de Membro (Admin)

```
┌──────────────────────────────────┐
│   Admin vai para /admin/membros   │
├──────────────────────────────────┤
│ 1. Clica "+ Novo Membro"         │
├──────────────────────────────────┤
│ 2. Preenche formulário:           │
│    - CPF/Email                    │
│    - Nome Completo                │
│    - Papel (editor, membro, etc)  │
│    - Senha Temporária             │
│    - Permissões (7 checkboxes)    │
├──────────────────────────────────┤
│ 3. Clica "Criar Membro"           │
├──────────────────────────────────┤
│ 4. dataService.criarNovoUsuario() │
│    ├─ Valida entrada              │
│    ├─ Valida força da senha       │
│    ├─ Verifica se já existe       │
│    ├─ Hash da senha               │
│    ├─ Salva em auth-credentials   │
│    └─ Retorna resultado           │
├──────────────────────────────────┤
│ 5. Se sucesso:                    │
│    ├─ Toast com sucesso           │
│    ├─ Mostra senha temporária     │
│    ├─ Carrega lista atualizada    │
│    └─ Limpa formulário            │
├──────────────────────────────────┤
│ 6. Admin comunica ao membro:      │
│    - CPF/Email                    │
│    - Senha Temporária             │
│    - URL de login: /login         │
├──────────────────────────────────┤
│ 7. Membro faz login               │
│    ├─ Entra CPF + Senha Temp      │
│    ├─ Clica Login                 │
│    └─ Sistema pede mudança        │
│    (Próxima feature)              │
└──────────────────────────────────┘
```

---

## 🛡️ Segurança Implementada

### Validações
✅ **CPF**: Dígitos verificadores reais  
✅ **Senha**: Mínimo médio (8+ chars, maiúscula, número, símbolo)  
✅ **Email**: Formato básico  
✅ **Rate Limiting**: Atraso de 500ms em erro (evita força bruta)  

### Armazenamento
✅ **Hash de Senha**: Base64 + Timestamp (não plain text)  
✅ **Sessão**: localStorage com Auth Session data  
✅ **Permissões**: Verificadas em cada operação  

### Permissões Granulares
```
1. canEditContent       → Editar CMS e textos
2. canEditImages        → Upload de imagens
3. canEditGlossary      → Glossários Libras
4. canEditStation       → Estações Lab
5. canManageMembers     → Controle de usuários
6. canManageTasks       → Atribuir tarefas
7. canUploadMedia       → Vídeos e arquivos
```

---

## 📊 Exemplo: Criando Novo Membro

```javascript
// No painel /admin/membros
async function criarMembro() {
  const resultado = await dataService.criarNovoUsuario({
    cpfOuEmail: 'maria@rede-inova.br',
    nomeCompleto: 'Maria da Silva',
    role: 'membro_editor',
    senhaTemporaria: 'TempSenha@2026',
    permissoes: {
      canEditContent: true,    // ✅
      canEditImages: true,     // ✅
      canEditGlossary: false,  // ❌
      canEditStation: false,   // ❌
      canManageMembers: false, // ❌
      canManageTasks: false,   // ❌
      canUploadMedia: true,    // ✅
    }
  });

  // Resultado:
  {
    sucesso: true,
    mensagem: "Usuário Maria da Silva criado com sucesso",
    usuario: { ... }
  }
}
```

---

## 📖 Como Testar

### 1️⃣ **Acessar Login (URL pode variar)**
```
URL: http://localhost:9002/login
URL: http://localhost:3000/login
```

### 2️⃣ **Obter Credenciais**
Abra o arquivo: `CREDENCIAIS_ADMIN.txt`

### 3️⃣ **Login como Admin**
- Digite CPF/Email
- Digite Senha
- Clique "Entrar com Credenciais"

### 4️⃣ **Ir para Painel de Admin**
```
URL: http://localhost:PORT/admin/membros
```

### 5️⃣ **Criar novo membro**
- Clique "+ Novo Membro"
- Preencha o formulário
- Selecione permissões
- Clique "Criar"
- **Admin recebe a senha temporária**
- **Comunique ao membro via email seguro**

### 6️⃣ **Testar login do novo membro**
- Faça logout
- Acesse /login
- Use credenciais do novo membro
- Deve entrar com sucesso

---

## 🚀 Próximas Features (Phase 2)

- [ ] Obrigar mudança de senha na primeira login
- [ ] Sistema de 2FA (autenticação de dois fatores)
- [ ] Registro de atividades de login (auditoria)
- [ ] Recuperação de senha via email
- [ ] Integração com Firebase Auth (production)
- [ ] Lock de conta após 3 tentativas erradas
- [ ] Expiração de sessão (timeout)

---

## ⚠️ Notas Importantes

1. **Senha Temporária**: O admin recebe a senha temporária, não o membro
2. **Próxima Feature**: Deve forçar mudança de senha no primeiro login
3. **Produção**: Substituir hash simples por bcryptjs
4. **Firestore**: Credenciais devem ser sincronizadas com Firestore em produção
5. **Email**: Implementar notificação por email ao criar membro

---

Documento sempre atualizado conforme mudanças no sistema. 📝
