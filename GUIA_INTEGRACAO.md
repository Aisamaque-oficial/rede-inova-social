# 📚 Guia de Integração - Componentes Novos

Este guia mostra como usar os componentes recém-criados em suas páginas.

---

## 1️⃣ ImageUploader - Upload de Imagens

### Importação
```typescript
import { ImageUploader } from "@/components/image-uploader";
import { dataService } from "@/lib/data-service";
```

### Uso Básico
```tsx
export default function MyPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const user = dataService.getCurrentUser();

  const handleImageSelect = async (file: File, preview: string) => {
    // Fazer upload do arquivo
    try {
      const mediaId = await dataService.recordMediaUpload('image', {
        name: file.name,
        url: preview, // Em produção, enviar para Firebase Storage
        pageId: 'my_page'
      });
      setSelectedImage(preview);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div>
      <ImageUploader
        canEditImages={user?.permissions.canEditImages || false}
        onImageSelect={handleImageSelect}
        maxSize={5}
        onClose={() => console.log('Closed')}
      />
    </div>
  );
}
```

### Props
```typescript
interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  onClose?: () => void;
  canEditImages: boolean;                          // Validação de permissão
  defaultImage?: string;                           // Imagem inicial
  maxSize?: number;                                // MB
  acceptedFormats?: string[];                      // MIME types
}
```

### Exemplo com Modal
```tsx
const [showUploader, setShowUploader] = useState(false);

return (
  <>
    <Button onClick={() => setShowUploader(true)}>
      <Upload /> Upload Imagem
    </Button>
    
    {showUploader && (
      <Dialog open={showUploader} onOpenChange={setShowUploader}>
        <DialogContent className="max-w-md">
          <ImageUploader
            canEditImages={user?.permissions.canEditImages || false}
            onImageSelect={handleImageSelect}
            onClose={() => setShowUploader(false)}
          />
        </DialogContent>
      </Dialog>
    )}
  </>
);
```

---

## 2️⃣ GlossaryEditor - Editor de Termos

### Importação
```typescript
import { GlossaryEditor } from "@/components/glossary-editor";
import { dataService } from "@/lib/data-service";
import { librasGlossary } from "@/lib/mock-data";
```

### Uso Básico
```tsx
export default function GlosarioPage() {
  const [glossary, setGlossary] = useState(librasGlossary);
  const user = dataService.getCurrentUser();
  const [eixoId, setEixoId] = useState('eixo-imunologico');

  const eixo = glossary.find(e => e.id === eixoId);

  const handleTermUpdate = async (termName: string, updates: any) => {
    try {
      await dataService.updateGlossaryTerm(eixoId, termName, updates);
      // Atualizar estado local
      setGlossary(prev => prev.map(e => 
        e.id === eixoId 
          ? { ...e, terms: e.terms.map(t => t.term === termName ? {...t, ...updates} : t) }
          : e
      ));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleTermAdd = async (term: any) => {
    try {
      await dataService.updateGlossaryTerm(eixoId, term.term, term);
      setGlossary(prev => prev.map(e => 
        e.id === eixoId 
          ? { ...e, terms: [...e.terms, term] }
          : e
      ));
    } catch (error) {
      console.error("Add failed:", error);
    }
  };

  const handleTermDelete = async (termName: string) => {
    try {
      // Em Firestore, você faria um delete
      setGlossary(prev => prev.map(e => 
        e.id === eixoId 
          ? { ...e, terms: e.terms.filter(t => t.term !== termName) }
          : e
      ));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <GlossaryEditor
      eixoTitle={eixo?.title || ""}
      eixoId={eixoId}
      terms={eixo?.terms || []}
      canEdit={user?.permissions.canEditGlossary || false}
      onTermUpdate={handleTermUpdate}
      onTermAdd={handleTermAdd}
      onTermDelete={handleTermDelete}
    />
  );
}
```

### Props
```typescript
interface GlossaryEditorProps {
  eixoTitle: string;                           // Título do eixo
  eixoId: string;                              // ID do eixo
  terms: any[];                                // Array de termos
  onTermUpdate: (termName: string, updates: any) => Promise<void>;
  onTermAdd: (term: any) => Promise<void>;
  onTermDelete: (termName: string) => Promise<void>;
  canEdit: boolean;                            // Validação de permissão
}
```

### Estrutura de Termo
```typescript
interface GlossaryTermForm {
  term: string;                    // "Alergia"
  description: string;             // "Reação do sistema imunológico..."
  videoUrl?: string;              // "https://youtube.com/embed/..."
  examples?: string[];            // ["Amendoim...", "Fruto do mar..."]
  related?: string[];             // ["Imunidade", "Histamina"]
}
```

---

## 3️⃣ LabStationEditor - Gerenciador de Estações

### Importação
```typescript
import { LabStationEditor, type LabStation } from "@/components/lab-station-editor";
import { dataService } from "@/lib/data-service";
```

### Uso Básico
```tsx
export default function LabManagerPage() {
  const [stations, setStations] = useState<LabStation[]>([
    {
      id: "nutricao",
      label: "Cozinha Nutricional",
      description: "Aprenda sobre comida de verdade",
      icon: "🍎",
      color: "bg-orange-500",
      active: true,
      materials: ["receita1", "receita2"]
    },
    // ... mais estações
  ]);

  const user = dataService.getCurrentUser();

  const handleStationUpdate = async (stationId: string, updates: Partial<LabStation>) => {
    try {
      await dataService.updateLabStation(stationId, updates);
      setStations(prev => prev.map(s => 
        s.id === stationId ? {...s, ...updates} : s
      ));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleStationAdd = async (station: LabStation) => {
    try {
      await dataService.updateLabStation(station.id, station);
      setStations(prev => [...prev, station]);
    } catch (error) {
      console.error("Add failed:", error);
    }
  };

  const handleStationDelete = async (stationId: string) => {
    try {
      // Em Firestore, você faria um delete
      setStations(prev => prev.filter(s => s.id !== stationId));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <LabStationEditor
      stations={stations}
      canEdit={user?.permissions.canEditStation || false}
      onStationUpdate={handleStationUpdate}
      onStationAdd={handleStationAdd}
      onStationDelete={handleStationDelete}
    />
  );
}
```

### Props
```typescript
interface LabStationEditorProps {
  stations: LabStation[];
  onStationUpdate: (stationId: string, updates: Partial<LabStation>) => Promise<void>;
  onStationAdd: (station: LabStation) => Promise<void>;
  onStationDelete: (stationId: string) => Promise<void>;
  canEdit: boolean;                          // Validação de permissão
}
```

### Estrutura de Estação
```typescript
interface LabStation {
  id: string;                      // "nutricao"
  label: string;                   // "Cozinha Nutricional"
  description: string;             // "Aprenda sobre comida de verdade"
  icon: string;                    // "🍎" (emoji)
  color: string;                   // "bg-orange-500" (classe Tailwind)
  active: boolean;                 // true
  materials?: string[];            // ["material1", "material2"]
}
```

### Ícones Disponíveis
```
🍎 🍌 📚 📖 🤟 👋 🖐️ ✌️ 🌱 🎮 🔬 🎨 🎯
```

### Cores Disponíveis
```
bg-orange-500  → Laranja
bg-blue-500    → Azul
bg-purple-600  → Roxo
bg-green-600   → Verde
bg-indigo-600  → Indigo
bg-pink-600    → Rosa
```

---

## 🔐 Verificação de Permissões

### Antes de Renderizar Componentes

```tsx
// ❌ ERRADO
<GlossaryEditor ... />

// ✅ CORRETO
{user?.permissions.canEditGlossary ? (
  <GlossaryEditor ... />
) : (
  <Alert>
    <AlertCircle />
    Você não tem permissão para editar glossários.
  </Alert>
)}
```

### Usar Helper do DataService

```tsx
const canEditContent = dataService.hasPermission('canEditContent');
const canUploadMedia = dataService.hasPermission('canUploadMedia');
const currentUser = dataService.getCurrentUser();

if (currentUser?.permissions.canEditGlossary) {
  // Mostrar editor
}
```

---

## 📱 Exemplo Completo - Página de Gerenciamento

```tsx
"use client";

import React, { useState } from "react";
import { dataService } from "@/lib/data-service";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/image-uploader";
import { GlossaryEditor } from "@/components/glossary-editor";
import { LabStationEditor } from "@/components/lab-station-editor";

export default function AdminPage() {
  const user = dataService.getCurrentUser();
  const isCoordinator = dataService.isCoordinator();

  if (!user) {
    return <div>Acesso negado</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Painel de Administração</h1>
        <p className="text-muted-foreground">Bem-vindo, {user.name}</p>
      </div>

      <Tabs defaultValue="conteudo" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
          <TabsTrigger value="glossario">Glossário</TabsTrigger>
          <TabsTrigger value="lab">Lab LISSA</TabsTrigger>
          {isCoordinator && <TabsTrigger value="membros">Membros</TabsTrigger>}
        </TabsList>

        {/* Aba de Conteúdo */}
        <TabsContent value="conteudo">
          {user.permissions.canEditContent ? (
            <Card>
              <CardHeader>
                <CardTitle>Editar Conteúdo</CardTitle>
              </CardHeader>
              <ImageUploader
                canEditImages={user.permissions.canEditImages}
                onImageSelect={(file, preview) => {
                  console.log("Image selected:", file.name);
                }}
              />
            </Card>
          ) : (
            <p>Sem permissão</p>
          )}
        </TabsContent>

        {/* Aba de Glossário */}
        <TabsContent value="glossario">
          <GlossaryEditor
            eixoTitle="Eixo Imunológico"
            eixoId="eixo-imunologico"
            terms={[]}
            canEdit={user.permissions.canEditGlossary}
            onTermUpdate={async () => {}}
            onTermAdd={async () => {}}
            onTermDelete={async () => {}}
          />
        </TabsContent>

        {/* Aba Lab LISSA */}
        <TabsContent value="lab">
          <LabStationEditor
            stations={[]}
            canEdit={user.permissions.canEditStation}
            onStationUpdate={async () => {}}
            onStationAdd={async () => {}}
            onStationDelete={async () => {}}
          />
        </TabsContent>

        {/* Aba Membros (apenas para coordenador) */}
        {isCoordinator && (
          <TabsContent value="membros">
            <div>
              {/* Aqui vai a página de gerenciamento de membros */}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
```

---

## 🧪 Testando Localmente

### Passo 1: Iniciar o App
```bash
npm run dev
```

### Passo 2: Ir para Login
```
http://localhost:3000/login
```

### Passo 3: Selecionar Modo
- Clique "Acessar como Coordenador" → Acesso total
- Clique "Acessar como Membro (Editor)" → Selecione Bruna ou Jaqueline

### Passo 4: Testar Componentes
- Vá para `/laboratorio` para editar termos
- Vá para `/gerenciar/usuarios` para gerenciar permissões
- Use `ImageUploader` em qualquer página

---

## 🐛 Troubleshooting

### Erro: "Você não tem permissão"
```
Verifique se o membro selecionado tem a permissão no mock-data.ts
```

### Componente não aparece
```
Verifique se canEdit={boolean} foi passado e é true
```

### Firestore não salva
```
Verifique se está em modo bypass (dev_bypass = true no localStorage)
Verifique as regras do Firestore em firestore.rules
```

### Imagem muito grande
```
Aumente maxSize={10} ou reduza o arquivo
```

---

## 📞 Suporte

Para adicionar novos componentes ou modificar:

1. **Criar nova permissão:**
   - Adicionar em `UserPermissions` tipo
   - Atualizar permissões de cada membro
   - Adicionar valor padrão em `dataService.hasPermission()`

2. **Adicionar nova collection:**
   - Criar método `get` e `update` no `dataService`
   - Definir interface TypeScript
   - Atualizar Firestore rules

3. **Criar novo componente:**
   - Seguir padrão de `canEdit` prop
   - Adicionar validação de erro
   - Usar Framer Motion para animações
   - Exportar interfaces TypeScript

---

*Última atualização: 29 de março de 2026*
