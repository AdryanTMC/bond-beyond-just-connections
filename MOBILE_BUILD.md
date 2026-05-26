# Bond · Android & iOS · Beta build (Capacitor 8)

Bond é empacotado como app nativo usando [Capacitor 8](https://capacitorjs.com).
O Lovable é um ambiente web — **a compilação final do APK / AAB / IPA é feita
na sua máquina (Android Studio / Xcode) ou em CI (Codemagic, EAS, GitHub
Actions)**. Este guia cobre tudo até o Beta (Play Internal Testing + TestFlight).

## 0 · Pré-requisitos

- **Android**: Android Studio Hedgehog+, JDK 17, Android SDK 34+, dispositivo com Android 7+ (API 24).
- **iOS**: macOS + Xcode 15+, conta Apple Developer ($99/ano), CocoaPods (`sudo gem install cocoapods`).
- Bun ou Node 20+.

## 1 · Exportar para o GitHub

1. No Lovable, clique em **GitHub → Connect to GitHub** e crie o repositório.
2. No seu computador: `git clone <seu-repo>` e `cd` no projeto.
3. Rode `bun install` (ou `npm install`).

## 2 · Adicionar as plataformas nativas (uma vez só)

```bash
npx cap add android
npx cap add ios     # somente em Mac com Xcode
```

Isso cria as pastas `android/` e `ios/` (ignoradas no Lovable). **Commit
essas pastas no seu repo local** — elas são o projeto nativo.

## 3 · Build web + sync a cada mudança

```bash
bun run build       # gera dist/ otimizado (Vite tree-shaking + minify)
npx cap sync        # copia dist/ para Android e iOS
```

## 4 · Rodar no dispositivo / emulador

```bash
npx cap run android   # precisa Android Studio
npx cap run ios       # precisa Mac + Xcode
```

```bash
npx cap open android
npx cap open ios
```

## 5 · Ícones e splash (gerados de 1 arquivo)

`src/assets/app-icon.png` (1024×1024 PNG, fundo opaco) é o ícone-fonte.
Para gerar todos os tamanhos Android + iOS + splash automaticamente:

```bash
bun add -d @capacitor/assets
npx capacitor-assets generate \
  --iconBackgroundColor "#FFFFFF" \
  --iconBackgroundColorDark "#0F0F12" \
  --splashBackgroundColor "#FFFFFF" \
  --splashBackgroundColorDark "#0F0F12"
```

## 6 · Hot-reload no celular (opcional, dev)

Descomente o bloco `server: { url: ... }` em `capacitor.config.ts` apontando
para a URL do preview do Lovable, rode `npx cap sync`, e o app vai carregar
direto do preview com hot-reload. **Remova antes de gerar release.**

## 7 · Android — versionar, assinar e gerar APK + AAB Beta

### 7.1 versionCode / versionName
Edite `android/app/build.gradle`:
```gradle
defaultConfig {
    applicationId "app.lovable.bond"
    minSdkVersion 24
    targetSdkVersion 34
    versionCode 1            // incremente a cada upload
    versionName "1.0.0-beta.1"
}
```

### 7.2 Gerar keystore de release (uma vez só, GUARDE COM VIDA)
```bash
keytool -genkey -v -keystore bond-release.keystore \
  -alias bond -keyalg RSA -keysize 2048 -validity 10000
```
Crie `android/keystore.properties` (NÃO commitar):
```
storeFile=../../bond-release.keystore
storePassword=...
keyAlias=bond
keyPassword=...
```
Adicione em `android/app/build.gradle` (bloco `android { ... }`):
```gradle
signingConfigs {
    release {
        def props = new Properties()
        props.load(new FileInputStream(rootProject.file("keystore.properties")))
        storeFile file(props['storeFile'])
        storePassword props['storePassword']
        keyAlias props['keyAlias']
        keyPassword props['keyPassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### 7.3 Comandos de build
```bash
bun run build && npx cap sync android
cd android
./gradlew assembleRelease       # gera APK release → app/build/outputs/apk/release/
./gradlew bundleRelease         # gera AAB → app/build/outputs/bundle/release/  (use para Play)
./gradlew assembleDebug         # gera APK debug → app/build/outputs/apk/debug/
```

### 7.4 Subir Beta no Google Play
1. Play Console → seu app → **Testes → Testes internos** → criar release.
2. Faça upload do `app-release.aab`.
3. Adicione testadores por e-mail ou link público.
4. Promote para **Closed/Open Beta** depois.

## 8 · iOS — TestFlight Beta

### 8.1 Versão
No Xcode: alvo **App** → tab **General** → **Version** `1.0.0`, **Build** `1`.
Incremente o **Build** a cada upload novo.

### 8.2 Signing
- Tab **Signing & Capabilities** → marque **Automatically manage signing** → escolha seu Team.
- Bundle Identifier: `app.lovable.bond` (ou um único seu).

### 8.3 Capabilities recomendadas
- **Push Notifications** (se ativar push depois).
- **Sign in with Apple** (já temos via Lovable Cloud).
- **Associated Domains** (se usar deep links): `applinks:bond-beyond-just-connections.lovable.app`.

### 8.4 Build & Archive
```bash
bun run build && npx cap sync ios
cd ios/App && pod install
npx cap open ios
```
No Xcode: dispositivo = **Any iOS Device (arm64)** → **Product → Archive** →
**Distribute App → App Store Connect → Upload**.

### 8.5 TestFlight
App Store Connect → **TestFlight** → adicione testadores internos (até 100)
ou crie um grupo de teste externo (até 10.000, requer revisão Beta da Apple).

## 9 · Permissões — já configuradas no `capacitor.config.ts`

Se você adicionar features que pedem permissões nativas, declare aqui:

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />               <!-- fotos perfil -->
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />    <!-- galeria, API 33+ -->
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" /> <!-- distância -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />   <!-- push, API 33+ -->
```

**iOS** (`ios/App/App/Info.plist`):
```xml
<key>NSCameraUsageDescription</key>
<string>Bond usa a câmera para você adicionar fotos ao seu perfil.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Bond acessa sua galeria para selecionar fotos de perfil.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Bond usa sua localização para sugerir pessoas próximas.</string>
```

## 10 · Checklist Beta

**Android (Play Internal Testing)**
- [ ] `versionCode` incrementado
- [ ] AAB assinado com keystore de release
- [ ] Ícone 512×512 PNG + screenshots (telefone)
- [ ] Descrição curta + completa em PT/EN
- [ ] Política de privacidade pública (URL)
- [ ] Classificação de conteúdo preenchida
- [ ] Lista de testadores adicionada

**iOS (TestFlight)**
- [ ] Build number incrementado
- [ ] Archive subido sem erros de signing
- [ ] Ícone 1024×1024 sem alpha
- [ ] Screenshots iPhone 6.7" e 6.5"
- [ ] Test Information preenchida (e-mail, descrição)
- [ ] Compliance de criptografia respondida (geralmente "No")
- [ ] Testadores internos adicionados

## 11 · Comandos rápidos

```bash
# rebuild completo após mudança no código web
bun run build && npx cap sync

# atualizar plugins Capacitor
bun update @capacitor/core @capacitor/android @capacitor/ios @capacitor/cli
npx cap sync

# limpar build Android
cd android && ./gradlew clean && cd ..

# limpar build iOS
cd ios/App && pod deintegrate && pod install && cd ../..
```

## Observações

- `appId`: `app.lovable.bond` — troque para o seu domínio reverso antes do
  upload na Play / App Store (ex.: `com.suamarca.bond`).
- Splash e status bar configurados em branco (`#FFFFFF`) para combinar com o
  design system Hinge-style atual. Para dark mode, o `@capacitor/assets`
  já gera variantes via `*Dark` colors acima.
- Sessão Supabase persiste no `localStorage` do WebView nativo — funciona
  offline-first; só precisa de internet quando faz request.
- Google OAuth nativo: Lovable Cloud gerencia os callbacks; a URL
  `https://<projeto>.lovable.app/~oauth/callback` deve estar nos redirect URIs
  (já está, por padrão). No app nativo, o login abre no Custom Tab (Android)
  / SFSafariViewController (iOS) automaticamente.