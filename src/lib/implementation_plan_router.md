# Plano Roteamento Inteligente (Smart Navigation) do Estúdio

Detectamos bloqueio no roteamento de navegação no CMS (O `next/link` tradicional força um reload de fora do provedor do estúdio). Como resultado, o estúdio é quebrado. A correção é vital.

## Design do SmartLink

Criaremos o `<SmartLink>` para envelopar de forma inteligente todo `<Link>` da aplicação.

1. **Intercepção de Contexto**: O `<SmartLink>` varrerá o `window.location.pathname`. Se reconhecer estar em `/studio`, ele nunca permitirá navegação crua para `/href`.
2. **Transformação de Rota**: Em vez de navegar para `/jornada`, ele redirecionará transparentemente para `/studio?page=jornada`. Isso tranca o usuário no sandbox.

## Arquitetura no Painel Studio (`app/studio/page.tsx`)

Atualmente o painel Studio "chumba" o HTML `<LandingPage />`.
Mapearemos a recepção do Query Parameter `?page`:

- Se `page===jornada` -> Importa dinamicamente a página da Jornada (`app/jornada/page.tsx`).
- Se `page===noticias` -> Importa dinamicamente Notícias.
- Fallback natural -> `<LandingPage />`

## O que será atualizado:
1. **[NEW]** `src/components/smart-link.tsx`: Wrapper seguro substituto do `next/link`.
2. **[MODIFY]** `src/components/main-header.tsx`: Injeta o `SmartLink` na Navbar.
3. **[MODIFY]** `src/components/cms/CMSPageRenderer.tsx` (Renderização Estática da UI de Botões): Em vez de `<a href>`, passa a usar `<SmartLink>`.
4. **[MODIFY]** `src/app/(app)/studio/page.tsx`: Modifica para escutar os search params e renderizar dinamicamente `Jornada`, `Agenda`, `Noticias`, etc...

## User Review Required

> [!WARNING]
> **Page Mapper (Mapeamento de Importações):**
> Para que o `Studio` exiba a página de "Noticias" ao receber `?page=noticias`, ele deverá ter um mapa conectando as *views* públicas (`import Jornada from "@/app/jornada/page"`, etc).
> No momento mapearei as 4 páginas principais (`Landing`, `Jornada`, `Laboratorio`, `Noticias`). Confirma se quer que eu aplique dessa forma para resolver a quebra de edição do Estúdio?
