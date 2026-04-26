pq# Rede de Inovação Social - Gerenciador de Projeto

Esta é uma aplicação web desenvolvida para o gerenciamento interno do projeto de extensão universitária "Rede de Inovação Social". O sistema foi construído com Next.js, Tailwind CSS e Firebase.

## Visão Geral

O projeto visa combater desigualdades sociais através de alimentação saudável e tecnologia. A aplicação web serve como uma ferramenta central para a comunicação da equipe, gerenciamento de tarefas e compartilhamento de mídias.

## Funcionalidades

- **Dashboard:** Feed de notícias e resumo de tarefas pendentes.
- **Página da Equipe:** Um organograma interativo da equipe do projeto.
- **Galeria de Fotos:** Um espaço para compartilhar e visualizar fotos de eventos e atividades.
- **Autenticação:** Sistema de login seguro para membros da equipe.

## Primeiros Passos

Para rodar este projeto localmente, siga os passos abaixo:

### 1. Pré-requisitos

- Node.js (versão 18 ou superior)
- `npm`, `pnpm` ou `yarn` como gerenciador de pacotes

### 2. Instalação

Clone o repositório e instale as dependências:

```bash
git clone <URL_DO_REPOSITORIO>
cd rede-inova-social
npm install
```

### 3. Configuração do Firebase

Este projeto usa Firebase para autenticação, banco de dados e armazenamento de arquivos.

1.  Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2.  Adicione um novo aplicativo da Web ao seu projeto.
3.  Copie as credenciais de configuração do seu aplicativo (apiKey, authDomain, etc.).
4.  Crie um arquivo `.env.local` na raiz do projeto e adicione suas credenciais do Firebase:

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=SUA_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=SEU_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=SEU_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=SEU_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=SEU_APP_ID
    ```

5.  No Firebase Console, habilite os seguintes serviços:
    *   **Authentication:** Ative o provedor "E-mail/senha".
    *   **Firestore Database:** Crie um novo banco de dados.
    *   **Storage:** Crie um novo bucket de armazenamento.

### 4. Rodando a Aplicação

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:9002](http://localhost:9002) no seu navegador.

## Configuração das Regras de Segurança do Firestore

Para garantir que apenas usuários autenticados possam ler e escrever no banco de dados, você deve configurar as regras de segurança do Firestore.

Vá para o seu projeto no Firebase Console, acesse `Firestore Database > Regras`. Substitua as regras padrão pelo seguinte:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Permite leitura e escrita em qualquer documento
    // apenas se o usuário estiver autenticado.
    match /{document=**} {
      allow read, write: if request.auth != null;
    }

    // Exemplo de regra mais restritiva:
    // Apenas o dono do perfil de usuário pode alterá-lo.
    match /users/{userId} {
      allow read: if request.auth != null;
      allow update, delete: if request.auth.uid == userId;
    }

    // Qualquer usuário autenticado pode criar tarefas, mas só
    // o responsável pode atualizar ou deletar.
    match /tasks/{taskId} {
       allow read, create: if request.auth != null;
       allow update, delete: if request.auth.uid == resource.data.assignedTo || request.auth.uid == resource.data.authorId;
    }

    // Qualquer usuário autenticado pode ler notícias e fotos,
    // mas apenas 'coordenadores' (definido em um 'claim' ou no perfil) podem criar/editar.
    // Para um exemplo simples, vamos manter a regra geral de autenticação.
    match /news/{newsId} {
       allow read: if request.auth != null;
       allow write: if request.auth != null; // Refinar com base em roles
    }

    match /gallery/{imageId} {
       allow read, create: if request.auth != null;
       allow delete: if request.auth.uid == resource.data.uploaderId;
    }
  }
}
```

**Importante:** As regras acima são um ponto de partida. Você deve ajustá-las para atender às necessidades específicas de segurança e autorização do seu aplicativo, especialmente em relação às `roles` (funções) dos usuários.
