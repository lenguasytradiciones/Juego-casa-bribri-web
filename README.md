# JuegoCasaBribri - Aplicación de Aprendizaje del Idioma Bribri

Aplicación móvil educativa multiplataforma para el aprendizaje del idioma indígena Bribri mediante ejercicios interactivos de lectura, escucha y pronunciación.

## Información General

- **Nombre:** CasaBriBri
- **Versión:** 1.0.0
- **Framework:** React Native con Expo
- **Orientación:** Horizontal (Landscape)
- **Plataformas:** iOS, Android, Web
- **Package ID:** com.alexander22.BriBriNew

---

## Estructura del Proyecto

```
CasaBriBri/
│
├── app/                              # Código fuente principal de la aplicación
│   ├── (tabs)/                       # Navegación por pestañas (ocultas)
│   │   ├── _layout.tsx              # Configuración del layout de pestañas
│   │   ├── index.tsx                # Pantalla de inicio (tab principal)
│   │   ├── explore.tsx              # Pantalla de exploración
│   │   ├── homepage.tsx             # Página principal personalizada
│   │   └── level_mapping.tsx        # Selector de niveles
│   │
│   ├── levels/                       # Niveles de lectura/pronunciación (1-7)
│   │   ├── 1/
│   │   │   ├── level_1.tsx          # Juego del nivel 1
│   │   │   └── guide_1.tsx          # Tutorial del nivel 1
│   │   ├── 2/ ... 7/                # Estructura similar para niveles 2-7
│   │
│   ├── levels_listen/               # Niveles de comprensión auditiva (1-7)
│   │   ├── 1/
│   │   │   ├── level_1_listen.tsx   # Ejercicios de escucha nivel 1
│   │   │   └── guide_1_listen.tsx   # Tutorial de escucha nivel 1
│   │   ├── 2/ ... 7/                # Estructura similar para niveles 2-7
│   │
│   ├── components/                   # Componentes específicos de la app
│   │   └── ToucanGuide.tsx          # Personaje guía (tucán mascota)
│   │
│   ├── screens/                      # Pantallas modales y overlays
│   │   ├── LevelCompleteModal.tsx   # Modal de nivel completado
│   │   ├── LevelStar.tsx            # Componente de estrella individual
│   │   ├── StarsProgress.tsx        # Visualización de progreso
│   │   └── ToucanSettings.tsx       # Pantalla de configuración
│   │
│   ├── misc/                         # Utilidades y helpers
│   │   ├── constants.ts             # Array de LEVELS con imágenes
│   │   ├── levelCompletion.ts       # Lógica de completado y navegación
│   │   ├── progress.ts              # Sistema de tracking de progreso
│   │   ├── wordPracticeTracker.tsx  # Seguimiento de intentos de palabras
│   │   ├── responsivePosition.ts    # Helpers para posicionamiento responsive
│   │   ├── BackButton.tsx           # Botón de retroceso
│   │   └── NextButton.tsx           # Botón de siguiente
│   │
│   ├── backend/                      # Utilidades de backend
│   │   └── storage.js               # Inicialización de AsyncStorage
│   │
│   ├── _layout.tsx                  # Layout raíz con provider de tema
│   └── +not-found.tsx               # Pantalla de error 404
│
├── components/                       # Componentes UI compartidos y reutilizables
│   ├── Collapsible.tsx              # Componente plegable
│   ├── ExternalLink.tsx             # Enlaces externos
│   ├── HapticTab.tsx                # Pestañas con feedback háptico
│   ├── HelloWave.tsx                # Componente de saludo animado
│   ├── ParallaxScrollView.tsx       # Vista con efecto parallax
│   ├── ThemedText.tsx               # Texto con soporte de temas
│   ├── ThemedView.tsx               # Vista con soporte de temas
│   └── ui/                          # Primitivos de UI
│       ├── IconSymbol.tsx           # Componente de íconos
│       ├── IconSymbol.ios.tsx       # Íconos específicos para iOS
│       ├── TabBarBackground.tsx     # Fondo de la barra de pestañas
│       └── TabBarBackground.ios.tsx # Fondo específico para iOS
│
├── constants/                        # Constantes globales
│   └── Colors.ts                    # Colores del tema (claro/oscuro)
│
├── hooks/                            # Custom React Hooks
│   ├── useColorScheme.ts            # Hook para detectar tema del sistema
│   ├── useColorScheme.web.ts        # Implementación específica para web
│   └── useThemeColor.ts             # Hook para obtener colores del tema
│
├── assets/                           # Recursos estáticos
│   ├── audios/                      # ~45 archivos de audio WAV
│   │   └── *.wav                    # Pronunciaciones en idioma Bribri
│   │
│   ├── images/                      # Recursos de imagen
│   │   ├── nivel_[1-7].png          # Miniaturas de niveles
│   │   ├── nivel_[1-7]E.png         # Variantes de imágenes de niveles
│   │   ├── guia[1-7].png            # Imágenes de pantallas guía
│   │   ├── *_normal.png             # Estados normales de personajes
│   │   ├── *_sombra.png             # Estados seleccionados/sombra
│   │   ├── adaptive-icon.png        # Ícono adaptativo (Android)
│   │   ├── favicon.png              # Favicon para web
│   │   ├── icon.png                 # Ícono principal
│   │   └── splash-icon.png          # Imagen de splash screen
│   │
│   └── fonts/
│       └── SpaceMono-Regular.ttf    # Fuente monoespaciada
│
├── scripts/                          # Scripts de construcción/utilidades
│   └── reset-project.js             # Script de reseteo del proyecto
│
├── node_modules/                     # Dependencias (generado automáticamente)
├── .expo/                           # Cache y configuración de Expo
├── .git/                            # Repositorio Git
├── .vscode/                         # Configuración de VS Code
│
└── Archivos de Configuración:
    ├── package.json                 # Dependencias y scripts npm
    ├── package-lock.json            # Lock file de dependencias
    ├── tsconfig.json                # Configuración de TypeScript
    ├── app.json                     # Configuración de Expo
    ├── eslint.config.js             # Configuración de ESLint
    ├── expo-env.d.ts                # Tipos de entorno de Expo
    ├── .gitignore                   # Archivos ignorados por Git
    └── README.md                    # Este archivo
```

---

## Descripción de Archivos Clave

### Configuración Principal

#### `package.json`
Define las dependencias del proyecto y scripts disponibles:
- **Scripts:**
  - `npm start` - Inicia el servidor de desarrollo
  - `npm run android` - Ejecuta en Android
  - `npm run ios` - Ejecuta en iOS
  - `npm run web` - Ejecuta versión web
  - `npm test` - Ejecuta pruebas con Jest
  - `npm run lint` - Ejecuta linter ESLint

#### `app.json`
Configuración de Expo:
- Nombre de la app: BriBriNew
- Orientación forzada: landscape (horizontal)
- Soporte para iOS tablets
- Configuración de splash screen
- Package ID de Android
- Plugins habilitados (router, splash, font, web-browser)

#### `tsconfig.json`
Configuración de TypeScript:
- Extiende configuración base de Expo
- Modo estricto habilitado
- Alias de rutas: `@/*` apunta a la raíz del proyecto

### Sistema de Navegación

#### `app/_layout.tsx`
Layout raíz de la aplicación:
- Configura el provider de temas
- Inicializa React Navigation
- Maneja la carga de fuentes personalizadas
- Define el stack principal de navegación

#### `app/(tabs)/_layout.tsx`
Layout de pestañas (ocultas mediante `tabBarStyle: { display: 'none' }`):
- Define las pestañas principales aunque no se muestren visualmente
- Configura íconos y nombres de pestañas

### Sistema de Niveles

Cada nivel tiene dos modos de aprendizaje:

#### **Modo Lectura/Pronunciación** (`app/levels/[N]/`)
- `level_[N].tsx` - Pantalla de juego interactivo donde el usuario:
  - Ve objetos/personajes con sus imágenes
  - Toca los objetos para escuchar su pronunciación
  - Aprende vocabulario en Bribri
  - Avanza al completar el nivel

- `guide_[N].tsx` - Pantalla tutorial que explica:
  - Objetivos del nivel
  - Instrucciones de uso
  - Cómo interactuar con los elementos

#### **Modo Escucha** (`app/levels_listen/[N]/`)
- `level_[N]_listen.tsx` - Ejercicios de comprensión auditiva donde:
  - Se reproduce un audio
  - El usuario debe seleccionar la imagen correcta
  - Se evalúa la comprensión auditiva

- `guide_[N]_listen.tsx` - Tutorial del modo de escucha

### Sistema de Progreso

#### `app/misc/progress.ts`
Maneja el seguimiento del progreso del usuario:
- **Funciones principales:**
  - `completeLevel(levelId, mode)` - Marca un nivel como completado
  - `getLevelProgress()` - Obtiene todo el progreso guardado
  - `isLevelCompleted(levelId, mode)` - Verifica si un nivel está completo
  - `resetProgress()` - Borra todo el progreso

- **Storage:**
  - Usa AsyncStorage para persistencia local
  - Guarda arrays separados para niveles de lectura y escucha
  - Keys: `completedReadLevels` y `completedListenLevels`

#### `app/misc/levelCompletion.ts`
Lógica de completado de niveles:
- `handleLevelCompletion()` - Muestra modal de nivel completado
- `getNextLevelId()` - Calcula el siguiente nivel (1-7, o null si es el último)
- `getNextLevelScreenName()` - Determina la ruta del siguiente nivel

#### `app/misc/wordPracticeTracker.tsx`
Seguimiento de intentos de práctica de palabras durante los niveles

### Componentes UI

#### `app/components/ToucanGuide.tsx`
Personaje mascota (tucán) que guía al usuario a través de los niveles

#### `app/screens/LevelCompleteModal.tsx`
Modal que se muestra al completar un nivel:
- Felicita al usuario
- Muestra estrellas de progreso
- Ofrece opciones para continuar

#### `app/screens/StarsProgress.tsx`
Componente de visualización de progreso mediante estrellas

#### `app/screens/ToucanSettings.tsx`
Pantalla de configuración de la aplicación

### Utilidades

#### `app/misc/constants.ts`
Define el array LEVELS con información de cada nivel:
```typescript
const LEVELS = [
  {
    id: 1,
    image: require('@/assets/images/nivel_1.png'),
    image2: require('@/assets/images/nivel_1E.png')
  },
  // ... niveles 2-7
]
```

#### `app/misc/responsivePosition.ts`
Helpers para calcular posiciones responsive basadas en dimensiones de pantalla:
- Usa `react-native-responsive-screen` para escalado
- Función `getResponsivePos()` para posicionamiento dinámico

#### `app/misc/BackButton.tsx` y `NextButton.tsx`
Componentes reutilizables para navegación entre pantallas

### Componentes Compartidos

#### `components/ThemedText.tsx` y `components/ThemedView.tsx`
Componentes base con soporte automático para modo claro/oscuro

#### `constants/Colors.ts`
Define la paleta de colores:
```typescript
Modo Claro:
- Primario: #0a7ea4 (verde azulado)
- Texto: #11181C (gris oscuro)
- Fondo: #fff (blanco)

Modo Oscuro:
- Primario: #fff (blanco)
- Texto: #ECEDEE (gris claro)
- Fondo: #151718 (casi negro)
```

---

## Stack Tecnológico

### Frontend
- **React** 19.1.0
- **React Native** 0.81.4
- **Expo** 54.0.8
- **TypeScript** 5.9.2

### Navegación
- **expo-router** 6.0.6 (enrutamiento basado en archivos)
- **@react-navigation/native** 7.1.8
- **@react-navigation/bottom-tabs** 7.3.13
- **@react-navigation/stack** 7.3.2

### Estado y Almacenamiento
- **@react-native-async-storage/async-storage** 2.2.0 (persistencia local)
- React Hooks (useState, useEffect, useRef)

### UI y Componentes
- **expo-image** 3.0.8 (optimización de imágenes)
- **expo-blur** 15.0.7 (efectos visuales)
- **react-native-draggable** 3.3.0 (elementos interactivos arrastrables)
- **react-native-responsive-screen** 1.4.2 (diseño responsive)
- **react-native-gesture-handler** 2.28.0 (gestos táctiles)
- **react-native-reanimated** 4.1.0 (animaciones fluidas)

### Media
- **expo-av** 16.0.7 (reproducción de audio)
- **expo-haptics** 15.0.7 (feedback háptico)

### Utilidades
- **expo-constants** 18.0.9
- **expo-linking** 8.0.8 (deep linking)
- **expo-web-browser** 15.0.7
- **expo-font** 14.0.8
- **expo-splash-screen** 31.0.10

### Desarrollo
- **ESLint** 9.25.0 (linting)
- **Jest** (testing)
- **Babel** 7.25.2 (transpilación)

---

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión LTS recomendada)
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Para desarrollo móvil:
  - Android Studio (para Android)
  - Xcode (para iOS, solo macOS)

### Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/lenguasytradiciones/Juego-casa-bribri-web
cd CasaBriBri
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar servidor de desarrollo:**
```bash
npm start
```

4. **Ejecutar en plataforma específica:**
```bash
npm run android    # Android
npm run ios        # iOS (solo macOS)
npm run web        # Navegador web
```

---

## Trabajo Pendiente para Deployment

### 🔴 Crítico (Necesario antes de publicar)

#### 1. Configuración de Build de Producción
- [ ] Configurar EAS (Expo Application Services) para builds
- [ ] Crear cuenta de Expo si no existe
- [ ] Ejecutar `eas build:configure`
- [ ] Configurar variables de entorno (si las hay)
- [ ] Definir eas.json con perfiles de build (development, preview, production)

#### 2. Configuración de App Store (iOS)
- [ ] Cuenta de Apple Developer (requiere pago anual de $99 USD)
- [ ] Crear App ID en Apple Developer Console
- [ ] Configurar certificados de firma de código
- [ ] Crear perfil de aprovisionamiento
- [ ] Configurar `ios` section en app.json:
  - bundleIdentifier
  - buildNumber
  - Permisos necesarios (Info.plist)
- [ ] Agregar iconos para todas las resoluciones de iOS
- [ ] Screenshots para App Store (varios tamaños)
- [ ] Política de privacidad (requerida si se recopilan datos)

#### 3. Configuración de Google Play (Android)
- [ ] Cuenta de Google Play Console (pago único de $25 USD)
- [ ] Configurar keystore para firma de APK/AAB:
  ```bash
  keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore \
  -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
  ```
- [ ] Guardar keystore de forma segura (NO incluir en Git)
- [ ] Configurar credenciales en EAS:
  ```bash
  eas credentials
  ```
- [ ] Completar `android` section en app.json:
  - versionCode (número entero incremental)
  - permissions (si se necesitan permisos especiales)
- [ ] Crear listing en Google Play Console
- [ ] Screenshots para Google Play (varios tamaños)
- [ ] Política de privacidad (URL pública requerida)

#### 4. Assets y Recursos
- [ ] Verificar que todos los assets están optimizados:
  - Imágenes en formato óptimo (PNG, WebP)
  - Audios en formato comprimido si es necesario
  - Verificar tamaños de archivos
- [ ] Crear splash screen adaptado para todas las resoluciones
- [ ] Iconos de app en todas las resoluciones requeridas:
  - iOS: 1024x1024 (App Store)
  - Android: adaptive icon (foreground + background)

#### 5. Testing Pre-Producción
- [ ] Probar en dispositivos físicos (iOS y Android)
- [ ] Verificar que AsyncStorage persiste correctamente
- [ ] Probar todos los niveles (1-7) en ambos modos
- [ ] Verificar reproducción de audios en todos los dispositivos
- [ ] Probar rotación de pantalla (debe mantenerse landscape)
- [ ] Verificar que el progreso se guarda correctamente
- [ ] Probar modo claro/oscuro
- [ ] Verificar navegación entre niveles

### 🟡 Importante (Recomendado antes de publicar)

#### 6. Optimización de Rendimiento
- [ ] Ejecutar Expo Doctor: `npx expo-doctor`
- [ ] Analizar bundle size: `npx expo export --platform ios/android`
- [ ] Optimizar imágenes (usar expo-image optimization)
- [ ] Implementar lazy loading si es necesario
- [ ] Verificar que no hay memory leaks
- [ ] Revisar uso de dependencias innecesarias

#### 7. Analytics y Monitoreo
- [ ] Implementar analytics (ej: Firebase Analytics, Amplitude)
- [ ] Configurar crash reporting (ej: Sentry, Bugsnag)
- [ ] Implementar event tracking para:
  - Niveles completados
  - Tiempo en cada nivel
  - Errores de audio/carga
  - Sesiones de usuario

#### 8. Configuración de Versiones
- [ ] Actualizar version en app.json (semantic versioning)
- [ ] Crear sistema de versionado consistente
- [ ] Documentar changelog

#### 9. Seguridad y Privacidad
- [ ] Revisar datos almacenados en AsyncStorage
- [ ] Crear política de privacidad (requerida por stores)
- [ ] Crear términos de servicio si es necesario
- [ ] Configurar permisos mínimos necesarios

#### 10. Internacionalización (i18n)
- [ ] Implementar sistema de traducciones si se planea soporte multiidioma
- [ ] Actualmente la app parece estar en español/Bribri
- [ ] Considerar agregar inglés para mayor alcance

### 🟢 Opcional (Mejoras futuras)

#### 11. Backend y Sincronización
- [ ] Considerar backend para sincronizar progreso entre dispositivos
- [ ] Implementar autenticación de usuarios (opcional)
- [ ] Sistema de respaldo de progreso en la nube

#### 12. Features Adicionales
- [ ] Sistema de logros/badges
- [ ] Tabla de clasificación (leaderboard)
- [ ] Modo offline completo
- [ ] Compartir progreso en redes sociales
- [ ] Sistema de notificaciones push para recordatorios de práctica

#### 13. Marketing y Distribución
- [ ] Crear página web landing page
- [ ] Preparar materiales de marketing
- [ ] Plan de lanzamiento (soft launch vs full launch)
- [ ] Estrategia de ASO (App Store Optimization):
  - Keywords relevantes
  - Descripción atractiva
  - Screenshots optimizados

#### 14. Documentación
- [ ] Guía de usuario dentro de la app
- [ ] FAQ
- [ ] Soporte al cliente (email de contacto)
- [ ] Video tutorial de la app

---

## Comandos de Build para Deployment

### Crear Build de Producción (iOS)
```bash
# Configurar EAS (primera vez)
npm install -g eas-cli
eas login
eas build:configure

# Crear build para iOS
eas build --platform ios --profile production

# Submit a App Store
eas submit --platform ios
```

### Crear Build de Producción (Android)
```bash
# Crear build para Android
eas build --platform android --profile production

# Submit a Google Play
eas submit --platform android
```

### Build Local (alternativa)
```bash
# Android APK local
npx expo run:android --variant release

# iOS local (requiere Mac)
npx expo run:ios --configuration Release
```

### Comandos Adicionales de Build

#### Build para Testing (sin publicar)
```bash
# Build de desarrollo
npx expo run:android

# Build con prebuild (limpio)
npx expo prebuild --platform android --clean
cd android
gradlew assembleRelease
```

#### Usando ADB (Android Debug Bridge)
```bash
# Ver dispositivos conectados
C:\Users\AlexQQ\AppData\Local\Android\Sdk\platform-tools\adb.exe devices

# Instalar APK en dispositivo
adb install app-release.apk

# Ver logs en tiempo real
adb logcat
```

---

## Checklist de Pre-Lanzamiento

Antes de hacer submit a las stores, verificar:

- [ ] Versión actualizada en app.json
- [ ] Todas las imágenes y assets optimizados
- [ ] Splash screen funcional
- [ ] Íconos de app correctos
- [ ] Sin errores de consola en producción
- [ ] Probado en dispositivos reales
- [ ] Política de privacidad publicada (URL)
- [ ] Descripción de la app en español
- [ ] Screenshots de calidad
- [ ] Video preview (opcional pero recomendado)
- [ ] Categoría apropiada en las stores (Educación)
- [ ] Rating de edad apropiado (probablemente 4+)
- [ ] Palabras clave para búsqueda definidas
- [ ] Build firmado correctamente
- [ ] Credenciales de firma guardadas de forma segura

---

## Estructura de Datos

### AsyncStorage Keys
```typescript
'completedReadLevels'    // Array de IDs de niveles de lectura completados
'completedListenLevels'  // Array de IDs de niveles de escucha completados
```

### Level Mode Enum
```typescript
enum LevelMode {
  READ = 'read',
  LISTEN = 'listen'
}
```

---

## Desarrollo y Contribución

### Añadir un Nuevo Nivel

1. Crear carpetas en `app/levels/[N]/` y `app/levels_listen/[N]/`
2. Crear archivos:
   - `level_[N].tsx`
   - `guide_[N].tsx`
   - `level_[N]_listen.tsx`
   - `guide_[N]_listen.tsx`
3. Añadir imágenes correspondientes en `assets/images/`
4. Añadir audios en `assets/audios/`
5. Actualizar `app/misc/constants.ts` con el nuevo nivel
6. Actualizar lógica en `levelCompletion.ts` si es necesario

### Estructura de un Nivel Típico
```typescript
// level_N.tsx
import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';
import { completeLevel } from '@/app/misc/progress';

export default function LevelN() {
  // Estado para objetos seleccionados
  // Carga de audios
  // Lógica de interacción
  // Verificación de completado
  // Navegación a siguiente nivel
}
```

---

## Recursos Educativos

Esta aplicación está diseñada para preservar y enseñar el idioma Bribri, lengua indígena de Costa Rica. Los niveles progresivamente enseñan:

- **Nivel 1-2:** Vocabulario básico (objetos cotidianos)
- **Nivel 3-4:** Elementos naturales y animales
- **Nivel 5-6:** Acciones y verbos
- **Nivel 7:** Frases y conversación básica

Cada nivel incluye:
- Modo visual (lectura y asociación)
- Modo auditivo (comprensión oral)
- Retroalimentación inmediata
- Sistema de estrellas de progreso

---

## Soporte y Contacto

- **Repositorio:** https://github.com/lenguasytradiciones/Juego-casa-bribri-web
- **Problemas/Issues:** [GitHub Issues](https://github.com/lenguasytradiciones/Juego-casa-bribri-web/issues)
- **Desarrollador:** alexander22

---

## Licencia

[Actualmente no definida en el proyecto]

---

## Actividad Reciente

Últimos commits:
1. Merge branch 'main' de repositorio remoto
2. Refactorización de lógica de tutorial y tracking de completado de niveles
3. Actualización de niveles diokol
4. Actualización de level_5_listen.tsx
5. Actualización de homepage.tsx

**Enfoque Actual:** Mejoras en sistema de tracking de completado de niveles y lógica de tutoriales

---

## Notas Adicionales

### Orientación Landscape
La app está configurada para funcionar únicamente en modo horizontal (landscape). Esto está definido en `app.json`:
```json
"orientation": "landscape"
```

### Nueva Arquitectura de React Native
El proyecto tiene habilitada la nueva arquitectura:
```json
"newArchEnabled": true
```

### Soporte Multiplataforma
- **iOS:** Soporta iPad y iPhone
- **Android:** Edge-to-edge habilitado
- **Web:** Configurado con Metro bundler y output estático

---

**Última actualización:** 2025-10-26
