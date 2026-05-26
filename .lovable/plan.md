## Objetivo

1. Garantir tradução 100% em todas as páginas/componentes (web + app).
2. Preços por país já existem — auditar e expandir cobertura de moedas.
3. Reforçar a landing `/` (capture page) com mais elementos visuais chamativos (corações, sparkles, banner de casal já adicionado).
4. Ligar preferências/gostos ao matching estilo apps de namoro (parcialmente feito em `/app/discover` — auditar e completar).
5. **Transformar o projeto em app mobile nativo para Android e iOS** usando Capacitor (wrapper do web app atual).

---

## Parte 1 — Auditoria de tradução (i18n)

Varrer e corrigir strings hardcoded em:

- `src/routes/app.tsx` (shell/nav inferior)
- `src/routes/app.index.tsx`
- `src/routes/app.discover.tsx`
- `src/routes/app.messages.tsx`
- `src/routes/app.profile.tsx`
- `src/routes/app.identity.tsx`
- `src/routes/app.premium.tsx`
- `src/routes/app.settings.tsx`
- `src/components/site-footer.tsx` (lista de idiomas, copy)
- `src/components/cinematic-hero.tsx`
- `src/routes/index.tsx` (revisar)

Adicionar todas as chaves faltantes em `src/i18n/dictionaries.ts` nos 8 idiomas (en, pt, es, fr, de, it, ja, ko).

**Primeiro acesso**: já há detecção via `navigator.language` + timezone. Adicionar também leitura do país para escolher moeda automaticamente e persistir em `bond.country` no localStorage, com override em `/app/settings`.

---

## Parte 2 — Preços por país

Auditar `formatPrice` em `dictionaries.ts`. Garantir cobertura:
- BR → BRL (R$)
- US → USD
- EU (ES/FR/DE/IT) → EUR (€)
- JP → JPY (¥)
- KR → KRW (₩)
- UK → GBP (£)

Mostrar moeda local nos cards de pricing automaticamente.

---

## Parte 3 — Landing mais chamativa

Em `src/routes/index.tsx` e `src/components/cinematic-hero.tsx`:
- Adicionar mais widgets flutuantes (corações, sparkles, estrelas) ao redor de seções-chave (categorias, pricing, CTA final).
- Banner de casal feliz já está no hero — adicionar segundo mini-banner na seção de categorias "Romantic".
- Confirmar título da rota `/` como "Capture page" (já feito em `head().meta`).

---

## Parte 4 — Matching estilo apps de namoro

Auditar `src/routes/app.discover.tsx`:
- Filtragem por gênero/idade/distância/país/interesses já existe.
- Adicionar: ações de "Like" / "Pass" / "Super Like" persistentes em localStorage.
- Adicionar tela de "Match!" quando like mútuo (mockado).
- Botões na parte inferior do card (coração, X, estrela) traduzidos.

---

## Parte 5 — App mobile Android/iOS (Capacitor)

A stack é TanStack Start (web). Para virar app nativo:

1. Adicionar dependências: `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios`.
2. Criar `capacitor.config.ts` com `appId: app.lovable.bond`, `appName: Bond`, `webDir: dist`.
3. Configurar build estático (SPA mode) que gere `dist/` consumível pelo Capacitor.
4. Adicionar scripts no `package.json`:
   - `build:mobile` → build web + `cap sync`
   - `cap:android`, `cap:ios`
5. Documentar no chat o fluxo para o usuário:
   - Conectar ao GitHub via botão do Lovable
   - `git pull` local
   - `npm install`
   - `npx cap add android` / `npx cap add ios`
   - `npm run build && npx cap sync`
   - `npx cap run android` (precisa Android Studio) / `npx cap run ios` (precisa Mac + Xcode)
6. Adicionar plugins úteis: `@capacitor/status-bar`, `@capacitor/splash-screen`, `@capacitor/preferences` (substitui localStorage no nativo).
7. Ajustar `src/i18n/index.tsx` e `app.settings.tsx` para usar `@capacitor/preferences` quando rodando em nativo, com fallback para localStorage no web.

**Importante**: O Lovable não compila APK/IPA. O usuário precisa exportar para GitHub e buildar localmente (ou via EAS/Codemagic). Vou explicar isso claramente.

---

## Detalhes técnicos

- Capacitor wrapping mantém todo o código React atual.
- Hot-reload no device: `server.url` no `capacitor.config.ts` apontando para preview Lovable durante dev.
- Ícone e splash: gerar via `@capacitor/assets` a partir de um PNG 1024×1024 (vou gerar com o logo Bond).
- SSR não é usado no app nativo — Capacitor serve o bundle estático. Manter SSR ativo para a web continua funcionando.

---

## Entrega

Vou implementar tudo em uma sequência:
1. Dicionários completos + auditoria de strings
2. Preços por país expandidos
3. Visual da landing reforçado
4. Like/Pass/Match no discover
5. Setup Capacitor + ícones + instruções de build

Posso confirmar antes se quer **todos os 5 itens em sequência** ou priorizar algum (ex: só Capacitor + i18n primeiro)?
