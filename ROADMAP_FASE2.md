# 📋 Próximas Tarefas - Roadmap Fase 2

Este documento lista as melhorias recomendadas para as próximas fases do projeto.

---

## 🎯 Fase 2: Integração Profunda (Recomendada)

### 1. Integração do Firebase Storage ⭐⭐⭐
**Prioridade:** ALTA | **Tempo:** 2-3 horas

Conectar o `ImageUploader` e `GlossaryEditor` ao Firebase Storage para upload real.

```typescript
// Exemplo: src/lib/storage.ts
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadImage(folder: string, file: File): Promise<string> {
  const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
```

**Checklist:**
- [ ] Habilitar Firebase Storage no Console
- [ ] Criar função `uploadImage()` 
- [ ] Criar função `uploadVideo()`
- [ ] Atualizar `recordMediaUpload()` com URLs reais
- [ ] Implementar retry automático
- [ ] Adicionar limite de upload simultâneos

---

### 2. Integrar GlossaryEditor no Glossário/Laboratorio ⭐⭐⭐
**Prioridade:** ALTA | **Tempo:** 1-2 horas

Adicionar a interface de edição visual diretamente nas páginas de glossário.

**Arquivo:** `src/app/glossario/page.tsx` ou nova aba de edição

```typescript
// Mostrar botão de edição se tiver permissão
{canEditGlossary && (
  <Button onClick={() => setEditMode(true)}>
    <Edit3 /> Editar Glossário
  </Button>
)}

// Quando em modo edição, renderizar GlossaryEditor
{editMode ? (
  <GlossaryEditor
    eixoTitle={currentEixo.title}
    eixoId={currentEixo.id}
    terms={currentEixo.terms}
    canEdit={true}
    onTermUpdate={handleTermUpdate}
    onTermAdd={handleTermAdd}
    onTermDelete={handleTermDelete}
  />
) : (
  // View normal
)}
```

**Checklist:**
- [ ] Adicionar botão Edit em componentes
- [ ] Integrar GlossaryEditor
- [ ] Implementar lógica de switch edit/view
- [ ] Conectar ao dataService
- [ ] Adicionar confirmação de saída se houver mudanças

---

### 3. Integrar LabStationEditor no Laboratorio ⭐⭐⭐
**Prioridade:** ALTA | **Tempo:** 1-2 horas

Permitir que editores gerenciem estações visualmente.

**Arquivo:** `src/app/laboratorio/page.tsx` ou nova página `/laboratorio/gerenciar`

**Checklist:**
- [ ] Criar página `/laboratorio/gerenciar`
- [ ] Listar todas as estações
- [ ] Permitir criar nova estação
- [ ] Permitir editar estações
- [ ] Vincular materiais a estações
- [ ] Preview ao vivo de mudanças

---

### 4. Sistema de Notificações ⭐⭐
**Prioridade:** MÉDIA | **Tempo:** 2-3 horas

Informar membros quando seu conteúdo foi editado.

```typescript
// Coleção Firestore: notifications
{
  userId: "11",
  type: "term_updated",
  title: "Termo 'Alergia' foi atualizado",
  relatedId: "eixo-imunologico",
  createdBy: "1",
  createdByName: "Aisamaque",
  read: false,
  createdAt: ISOString
}
```

**Checklist:**
- [ ] Criar collection `notifications`
- [ ] Adicionar sistema de notificações reais-time
- [ ] Criar UI de notificações (bell icon)
- [ ] Implementar marcar como lido
- [ ] Email notifications (opcional)

---

## 🔄 Fase 3: Recursos Avançados (Próximas Semanas)

### 5. Histórico de Versões e Rollback
**Prioridade:** MÉDIA | **Tempo:** 3-4 horas

Permitir que coordenador reverta alterações.

```typescript
// Collection: content_history
{
  pageId: "lab_hero_title",
  version: 1,
  content: "Lab LISSA",
  createdBy: "1",
  createdAt: ISOString,
  changedFrom: "Laboratório LISSA"
}
```

**Checklist:**
- [ ] Criar collection `content_history`
- [ ] Registrar versão antes de atualizar
- [ ] UI para visualizar histórico
- [ ] Botão de reverter versão
- [ ] Diff visual entre versões

---

### 6. Colaboração em Tempo Real
**Prioridade:** BAIXA | **Tempo:** 4-6 horas

Mostrar quando outro membro está editando.

```typescript
// Real-time presence usando Firestore
onSnapshot(doc(db, "editing", pageId), (doc) => {
  const editors = doc.data()?.activeEditors || [];
  // Mostrar "Andréa está editando..."
});
```

---

### 7. Preview de Alterações
**Prioridade:** MÉDIA | **Tempo:** 2-3 horas

Mostrar como a página ficará com as mudanças antes de salvar.

**Checklist:**
- [ ] Modo Preview ao lado do editor
- [ ] Atualização em tempo real
- [ ] Viewport responsivo no preview
- [ ] Botão "Visualizar no Site"

---

### 8. Import/Export de Dados
**Prioridade:** BAIXA | **Tempo:** 2-3 horas

Exportar glossários, termos, estações em JSON/Excel.

```typescript
export function exportGlossary(eixoId: string): string {
  const eixo = librasGlossary.find(e => e.id === eixoId);
  return JSON.stringify(eixo, null, 2);
}
```

---

## ✨ Fase 4: Otimizações e UX (Sprint Opcional)

### 9. Migração de Dados para Firestore
**Prioridade:** MÉDIA | **Tempo:** 1-2 horas

Transferir dados atuais de mock-data.ts para Firestore.

```bash
# Script para migrar
node scripts/migrate-to-firestore.js
```

---

### 10. Temas e Customização
**Prioridade:** BAIXA | **Tempo:** 2 horas

Permitir coordenador customizar cores e logos do Lab.

---

### 11. Analytics de Edições
**Prioridade:** BAIXA | **Tempo:** 2-3 horas

Dashboard mostrando:
- Quem editou o quê
- Quando foi alterado
- Quantas edições por semana

---

### 12. Mobile Responsiveness Avançado
**Prioridade:** MÉDIA | **Tempo:** 2-3 horas

Otimizar componentes para celular:
- `ImageUploader` com upload de câmera
- `GlossaryEditor` em abas menores
- `LabStationEditor` em grid mobile

---

## 🎁 Bonus: Ideias Extras

### A. Integração com WhatsApp Bot
Enviar notificações de edições via WhatsApp para o coordenador.

### B. AI-Powered Sugestões
Suggestions automáticas para melhorar descrições usando GenKit.

### C. Validação de Termos
Verificar se termos já existem em outro eixo.

### D. Busca Avançada
Buscar glossários por data, autor, tipo de alteração.

### E. API Pública
Expor conteúdo editável via endpoint:
```
GET /api/glossary/:eixoId/terms
GET /api/lab/stations
POST /api/lab/stations (coordenador só)
```

---

## 📊 Matriz de Prioridade

```
┌──────────────────────────────────────────────────┐
│ PRIORIDADE vs COMPLEXIDADE                       │
├────────────┬──────────┬──────────┬────────────┤
│ Tarefa     │ Benefício│ Tempo    │ Prioridade │
├────────────┼──────────┼──────────┼────────────┤
│ Firebase   │ ⭐⭐⭐ │ 2h       │ ALTA       │
│ Integrar   │ ⭐⭐⭐ │ 2h       │ ALTA       │
│ Notif      │ ⭐⭐    │ 2h       │ MÉDIA      │
│ Versões    │ ⭐⭐⭐ │ 4h       │ MÉDIA      │
│ RT Collab  │ ⭐⭐    │ 5h       │ BAIXA      │
│ Export     │ ⭐      │ 2h       │ BAIXA      │
└────────────┴──────────┴──────────┴────────────┘
```

---

## 🚀 Recomendação de Sequência

### Esta Semana (Sprint 1)
1. ✅ Firebase Storage
2. ✅ Integração GlossaryEditor
3. ✅ Integração LabStationEditor

### Próxima Semana (Sprint 2)  
1. ✅ Sistema de Notificações
2. ✅ Preview de Alterações
3. ✅ Mobile Responsiveness

### Semana 3+ (Sprint 3+)
1. Histórico e Rollback
2. Colaboração Real-Time
3. Analytics

---

## 📝 Checklist de Preparação

Para começar a Fase 2, certifique-se de:

- [ ] Firebase Storage habilitado no Console
- [ ] Rules do Storage configuradas
- [ ] Credenciais do Firestore atualizadas
- [ ] .env.local com chaves secretas
- [ ] Testes unitários iniciais
- [ ] Backup dos dados atuais
- [ ] Contato com equipe para aprovação

---

## 🎓 Aprendizados Aplicáveis

A arquitetura criada permite:

✅ Adicionar novas permissões facilmente
✅ Criar novos componentes editor reutilizáveis
✅ Estender dataService sem breaking changes
✅ Manter tipos TypeScript seguros
✅ Integrar novas features sem refatoração

---

## 📞 Perguntas Frequentes

**P: Por que separar ImageUploader de GlossaryEditor?**
R: Para reutilizar em múltiplas páginas (conteúdo, materiais, etc).

**P: Dça usar localStorage em produção?**
R: Não. Firebase Storage é obrigatório em produção.

**P: Como fazer backup dos glossários?**
R: Usar Firebase Backup ou exportar via `exportGlossary()`.

**P: E se alguém deletar um termo importante?**
R: Histórico de versões permite reverter (Fase 3).

---

*Documento gerado em: 29 de março de 2026*
*Próxima revisão recomendada: 05 de abril de 2026*
