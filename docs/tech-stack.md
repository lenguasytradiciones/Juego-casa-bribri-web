# Stack Tecnológico - JuegoCasaBribri

Este proyecto utiliza un conjunto de tecnologías modernas enfocadas en el desarrollo de aplicaciones móviles multiplataforma, dada la meta original. A continuación se describen las principales herramientas y librerías utilizadas, organizadas según su función dentro de la arquitectura del proyecto.

## Tabla de contenidos
- [Stack Tecnológico - JuegoCasaBribri](#stack-tecnológico---juegocasabribri)
  - [1. Frontend](#1-frontend)
  - [2. Navegación](#2-navegación)
  - [3. Estado y Almacenamiento](#3-estado-y-almacenamiento)
  - [4. UI y Componentes](#4-ui-y-componentes)
  - [5. Media](#5-media)
  - [6. Utilidades](#6-utilidades)
  - [7. Desarrollo](#7-desarrollo)

## 1. Frontend

Estas tecnologías constituyen la base del desarrollo de la aplicación, proporcionando el entorno de ejecución, el framework de interfaz de usuario y el lenguaje de programación utilizado.

- **React** 19.1.0
- **React Native** 0.81.4
- **Expo** 54.0.8
- **TypeScript** 5.9.2

## 2. Navegación

Las siguientes librerías permiten gestionar la navegación entre pantallas mediante rutas basadas en archivos y navegadores de tipo stack y pestañas.

- **expo-router** 6.0.6 (enrutamiento basado en archivos)
- **@react-navigation/native** 7.1.8
- **@react-navigation/bottom-tabs** 7.3.13
- **@react-navigation/stack** 7.3.2

## 3. Estado y Almacenamiento

Se utilizan herramientas para administrar el estado de la aplicación y almacenar información localmente, permitiendo conservar datos entre sesiones.

- **@react-native-async-storage/async-storage** 2.2.0 (persistencia local)
- React Hooks (useState, useEffect, useRef)

## 4. UI y Componentes

Este conjunto de librerías facilita la creación de interfaces responsivas, animadas e interactivas, mejorando la experiencia del usuario.

- **expo-image** 3.0.8 (optimización de imágenes)
- **expo-blur** 15.0.7 (efectos visuales)
- **react-native-draggable** 3.3.0 (elementos interactivos arrastrables)
- **react-native-responsive-screen** 1.4.2 (diseño responsive)
- **react-native-gesture-handler** 2.28.0 (gestos táctiles)
- **react-native-reanimated** 4.1.0 (animaciones fluidas)

## 5. Media

Estas dependencias permiten incorporar elementos multimedia y mejorar la interacción mediante audio y retroalimentación háptica.

- **expo-av** 16.0.7 (reproducción de audio)
- **expo-haptics** 15.0.7 (feedback háptico)

## 6. Utilidades

Incluye módulos de Expo que proporcionan funcionalidades adicionales como acceso a constantes del sistema, carga de fuentes, navegación mediante enlaces y gestión de la pantalla de inicio.

- **expo-constants** 18.0.9
- **expo-linking** 8.0.8 (deep linking)
- **expo-web-browser** 15.0.7
- **expo-font** 14.0.8
- **expo-splash-screen** 31.0.10

## 7. Desarrollo

Estas herramientas apoyan el proceso de desarrollo al facilitar el análisis estático del código, la ejecución de pruebas y la transformación del código fuente.

- **ESLint** 9.25.0 (linting)
- **Jest** (testing)
- **Babel** 7.25.2 (transpilación)
