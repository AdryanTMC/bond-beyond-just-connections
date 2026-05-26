# Bond · Android & iOS build (Capacitor)

Bond foi empacotado como app nativo usando [Capacitor](https://capacitorjs.com).
O Lovable é um ambiente web, então **a compilação final do APK/IPA é feita na
sua máquina** (ou em um serviço de CI como Codemagic / EAS). Siga os passos:

## 1 · Exportar para o GitHub

1. No Lovable, clique em **GitHub → Connect to GitHub** e crie o repositório.
2. No seu computador: `git clone <seu-repo>` e `cd` no projeto.
3. Rode `bun install` (ou `npm install`).

## 2 · Adicionar as plataformas nativas (uma vez só)

```bash
npx cap add android
npx cap add ios     # somente em Mac com Xcode
```

Isso cria as pastas `android/` e `ios/` (ignoradas no Lovable).

## 3 · Build + sync a cada mudança

```bash
bun run build       # gera dist/
npx cap sync        # copia dist/ para Android e iOS
```

## 4 · Rodar no dispositivo / emulador

```bash
npx cap run android   # precisa Android Studio
npx cap run ios       # precisa Mac + Xcode
```

Ou abra os projetos nativos diretamente:

```bash
npx cap open android
npx cap open ios
```

## 5 · Ícone e splash

O arquivo `src/assets/app-icon.png` (1024×1024) é o ícone oficial. Para gerar
todos os tamanhos automaticamente:

```bash
bun add -d @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor "#0F1B3D" --splashBackgroundColor "#0F1B3D"
```

## 6 · Hot-reload no celular durante dev (opcional)

Descomente o bloco `server: { url: ... }` em `capacitor.config.ts` apontando
para a URL do preview do Lovable e rode `npx cap sync` de novo. O app no
celular vai carregar direto do preview, com hot-reload.

## 7 · Publicar

- **Android**: `Build → Generate Signed Bundle/APK` no Android Studio →
  upload no Google Play Console.
- **iOS**: `Product → Archive` no Xcode → upload no App Store Connect.

## Observações

- `appId`: `app.lovable.bond` — altere em `capacitor.config.ts` antes de publicar.
- Splash e status bar já vêm configurados (cor midnight indigo `#0F1B3D`).
- O app usa `localStorage` para preferências, que funciona perfeitamente no
  WebView nativo do Capacitor — nenhum código adicional é necessário.