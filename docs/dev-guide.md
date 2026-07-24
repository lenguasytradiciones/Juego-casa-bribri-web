# Guía del Desarrollador - JuegoCasaBribri

## Tabla de contenidos
- [Guía del Desarrollador - JuegoCasaBribri](#guía-del-desarrollador---juegocasabribri)
  - [1. Estructura del Proyecto](#1-estructura-del-proyecto)
  - [2. Descripción de Archivos Clave](#2-descripción-de-archivos-clave)
    - [2.1. Configuración Principal](#21-configuración-principal)
    - [2.2. Sistema de Progreso](#22-sistema-de-progreso)
    - [2.3. Componentes UI](#23-componentes-ui)
    - [2.4. Utilidades](#24-utilidades)
  - [3. Estructuras de Datos](#3-estructuras-de-datos)
    - [3.1. AsyncStorage Keys](#31-asyncstorage-keys)
    - [3.2. Level Mode Enum](#32-level-mode-enum)
  - [4. Desarrollo y Contribución](#4-desarrollo-y-contribución)
    - [4.1. Añadir un Nuevo Nivel](#41-añadir-un-nuevo-nivel)
    - [4.2. Estructura de un Nivel Típico](#42-estructura-de-un-nivel-típico)

## 1. Estructura del Proyecto

```
Juego-casa-bribri-web/
│
├── app/                              # Código fuente principal de la aplicación
│   ├── _layout.tsx                  # Layout raíz con provider de tema
│   ├── +not-found.tsx               # Pantalla de error 404
│   ├── (tabs)/                       # Navegación por pestañas (ocultas)
│   │   ├── _layout.tsx              # Configuración del layout de pestañas
│   │   ├── index.tsx                # Pantalla de inicio (tab principal)
│   │   ├── homepage.tsx             # Página principal personalizada
│   │   └── level_mapping.tsx        # Selector de niveles
│   │
│   ├── levels/                       # Niveles de lectura/pronunciación (1-7)
│   │   ├── 1/
│   │   │   ├── guide_1.tsx          # Tutorial del nivel 1
│   │   │   └── level_1.tsx          # Juego del nivel 1
│   │   └── 2/ ... 7/                # Estructura similar para niveles 2-7
│   │
│   ├── levels_listen/               # Niveles de comprensión auditiva (1-7)
│   │   ├── 1/
│   │   │   ├── guide_1_listen.tsx   # Tutorial de escucha nivel 1
│   │   │   └── level_1_listen.tsx   # Ejercicios de escucha nivel 1
│   │   └── 2/ ... 7/                # Estructura similar para niveles 2-7
│   │
│   ├── misc/                         # Utilidades y helpers
│   │   ├── BackButton.tsx           # Botón de retroceso
│   │   ├── constants.ts             # Array de LEVELS con imágenes
│   │   ├── instructions.ts          # Textos/instrucciones reutilizables
│   │   ├── levelCompletion.ts       # Lógica de completado y navegación
│   │   ├── NextButton.tsx           # Botón de siguiente
│   │   ├── progress.ts              # Sistema de tracking de progreso
│   │   └── responsivePosition.ts    # Helpers para posicionamiento responsive
│   │
│   └── screens/                      # Pantallas modales y overlays
│       ├── AboutTheResourceModal.tsx
│       ├── CreditsModal.tsx
│       ├── InformationModal.tsx
│       ├── InstructionsBanner.tsx
│       ├── LevelStatusFlag.tsx
│       ├── ModeProgress.tsx
│       ├── ResetModeModal.tsx
│       ├── ResetProgressModal.tsx
│       └── RestartModal.tsx
│
├── backend/                          # Utilidades de backend
│   └── storage.js                   # Inicialización de AsyncStorage
│
├── assets/                           # Recursos estáticos
│   ├── audios/                      # Archivos de audio del juego
│   ├── fonts/                       # Fuentes personalizadas
│   └── images/                      # Recursos de imagen y utilidades
│       ├── ic_launcher_background.xml
│       ├── Proceso de Background PseudoCodigo (1).txt
│       ├── Proceso de Background PseudoCodigo.txt
│       └── replace.bat
│
├── components/                       # Componentes UI compartidos y reutilizables
│   ├── Collapsible.tsx
│   ├── ExternalLink.tsx
│   ├── HapticTab.tsx
│   ├── HelloWave.tsx
│   ├── HoverTooltip.tsx
│   ├── ParallaxScrollView.tsx
│   ├── ThemedText.tsx
│   ├── ThemedView.tsx
│   └── ui/
│       ├── IconSymbol.ios.tsx
│       ├── IconSymbol.tsx
│       ├── TabBarBackground.ios.tsx
│       └── TabBarBackground.tsx
│
├── constants/                        # Constantes globales
│   └── Colors.ts                    # Colores del tema (claro/oscuro)
│
├── hooks/                            # Custom React Hooks
│   ├── useColorScheme.ts
│   ├── useColorScheme.web.ts
│   └── useThemeColor.ts
│
├── scripts/                          # Scripts de construcción/utilidades
│   └── reset-project.js             # Script de reseteo del proyecto
│
├── app.json                         # Configuración de Expo
├── eslint.config.js                 # Configuración de ESLint
├── expo-env.d.ts                    # Tipos de entorno de Expo
├── package.json                     # Dependencias y scripts npm
├── README.md                        # Este archivo
└── tsconfig.json                    # Configuración de TypeScript
```

---

## 2. Descripción de Archivos Clave

### 2.1. Configuración Principal

#### `package.json`
Define las dependencias del proyecto y scripts disponibles:
- **Scripts:**
  - `npm start` - Inicia el servidor de desarrollo
  - `npm run android` - Ejecuta en Android
  - `npm run ios` - Ejecuta en iOS
  - `npm run web` - Ejecuta versión web
  - `npm test` - Ejecuta pruebas con Jest
  - `npm run lint` - Ejecuta linter ESLint

> **Nota**: Hasta la fecha, solo se planea desarrollar la versión web de la aplicación, por lo que `npm start` puede usarse para probar localmente con un navegador. 

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

### 2.2. Sistema de Progreso

#### `app/misc/progress.ts`
Maneja el seguimiento del progreso del usuario:
- **Funciones principales:**
  - `completeLevel(levelId, mode)` - Marca un nivel como completado
  - `getLevelProgress()` - Obtiene todo el progreso guardado
  - `isLevelCompleted(levelId, mode)` - Verifica si un nivel está completo
  - `resetProgress()` - Borra todo el progreso
  - `resetModeProgress(mode)` - Borra progreso del modo especificado.

- **Storage:**
  - Usa AsyncStorage para persistencia local
  - Guarda arrays separados para niveles de lectura y escucha
  - Keys: `completedReadLevels` y `completedListenLevels`

### 2.3. Componentes UI

#### `app/screens/LevelCompleteModal.tsx`
Modal que se muestra al completar un nivel:
- Felicita al usuario
- Muestra estrellas de progreso
- Ofrece opciones para continuar

#### `app/screens/LevelStatusFlag.tsx`
Componente de visualización de progreso

### 2.4. Utilidades

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


## 3. Estructuras de Datos

### 3.1. AsyncStorage Keys
```typescript
'completedReadLevels'    // Array de IDs de niveles de lectura completados
'completedListenLevels'  // Array de IDs de niveles de escucha completados
```

### 3.2. Level Mode Enum
```typescript
enum LevelMode {
  READ = 'read',
  LISTEN = 'listen'
}
```

---

## 4. Desarrollo y Contribución

### 4.1. Añadir un Nuevo Nivel

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

### 4.2. Estructura de un Nivel Típico
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