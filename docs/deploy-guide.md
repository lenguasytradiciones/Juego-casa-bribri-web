# Guía de Instalación y Despliegue - JuegoCasaBribri


## Tabla de Contenidos
- [Guía de Instalación y Despliegue - JuegoCasaBribri](#guía-de-instalación-y-despliegue---juegocasabribri)
  - [1. Introducción](#1-introducción)
  - [2. Requisitos previos](#2-requisitos-previos)
    - [2.1. Node.js (versión 18 o superior, recomendado 20 LTS)](#21-nodejs-versión-18-o-superior-recomendado-20-lts)
    - [2.2. Git (opcional, para clonar el repositorio)](#22-git-opcional-para-clonar-el-repositorio)
    - [2.3. Un navegador moderno](#23-un-navegador-moderno)
  - [3. Tutorial de Instalación y Despliegue](#3-tutorial-de-instalación-y-despliegue)
    - [3.1. Paso 1 — Obtener el código](#31-paso-1--obtener-el-código)
    - [3.2. Paso 2 — Instalar dependencias](#32-paso-2--instalar-dependencias)
      - [3.2.1 Verificar la configuración web](#321-verificar-la-configuración-web)
    - [3.3. Paso 3 — Probar en modo desarrollo](#33-paso-3--probar-en-modo-desarrollo)
    - [3.4. Paso 4 — Compilar la versión web](#34-paso-4--compilar-la-versión-web)
    - [3.5. Paso 5 — Probar la compilación localmente (importante)](#35-paso-5--probar-la-compilación-localmente-importante)
      - [3.5.1. Qué revisar en esta prueba](#351-qué-revisar-en-esta-prueba)
    - [3.6. Paso 6 — Verificar que todo está cargado correctamente (script de diagnóstico)](#36-paso-6--verificar-que-todo-está-cargado-correctamente-script-de-diagnóstico)
      - [3.6.1. Cómo resolver los errores que aparezcan](#361-cómo-resolver-los-errores-que-aparezcan)
    - [3.7. Paso 7 — Desplegar en producción](#37-paso-7--desplegar-en-producción)
      - [3.7.1. Opción A — Vercel (recomendado)](#371-opción-a--vercel-recomendado)
      - [3.7.2. Opción B — Netlify](#372-opción-b--netlify)
      - [3.7.3. Opción C — Servidor propio (Nginx / Apache)](#373-opción-c--servidor-propio-nginx--apache)
      - [3.7.4. Opción D — EAS Hosting (de Expo)](#374-opción-d--eas-hosting-de-expo)
  - [4. Resumen de puertos y URLs](#4-resumen-de-puertos-y-urls)
  - [5. Verificación rápida — ¿Todo funciona?](#5-verificación-rápida--todo-funciona)
  - [6. Solución de problemas comunes](#6-solución-de-problemas-comunes)
  - [7. Flujo recomendado antes de cada despliegue](#7-flujo-recomendado-antes-de-cada-despliegue)


  
## 1. Introducción
Este documento explica cómo instalar, compilar y publicar la **versión web** del proyecto **JuegoCasaBribri** en un servidor o computadora nueva desde cero.

---

## 2. Requisitos previos

Antes de empezar, instala lo siguiente:

### 2.1. Node.js (versión 18 o superior, recomendado 20 LTS)
- Descárgalo desde: https://nodejs.org
- Selecciona la versión **LTS** (Long Term Support).
- Para verificar que quedó instalado, abre una terminal y ejecuta:
  ```
  node --version
  npm --version
  ```
  Deben mostrar números de versión sin errores.

### 2.2. Git (opcional, para clonar el repositorio)
- Descárgalo desde: https://git-scm.com

### 2.3. Un navegador moderno
Chrome, Edge o Firefox actualizados. La aplicación usa audio y almacenamiento local del navegador.

---

## 3. Tutorial de Instalación y Despliegue
## 3.1. Paso 1 — Obtener el código

Si tienes el código como archivo comprimido (ZIP), descomprímelo en una carpeta de tu elección, por ejemplo:

```
C:\Proyectos\Juego-casa-bribri-web\
```

Si vas a clonarlo con Git:
```bash
git clone https://github.com/lenguasytradiciones/Juego-casa-bribri-web.git
```

A partir de ahora, todos los pasos asumen que estás dentro de la carpeta raíz del proyecto (`Juego-casa-bribri-web`), es decir, la carpeta donde está el archivo `app.json`.

---

## 3.2. Paso 2 — Instalar dependencias

Desde la carpeta raíz del proyecto, ejecuta:

```bash
npm install
```

Esto descargará todas las librerías necesarias. Puede tomar varios minutos la primera vez.

### 3.2.1 Verificar la configuración web

Abre `app.json` y confirma que la sección `web` se vea así:

```json
"web": {
  "bundler": "metro",
  "output": "static",
  "favicon": "./assets/images/favicon.png"
}
```

- `bundler: "metro"` — usa el mismo empaquetador que la app móvil.
- `output: "static"` — genera un archivo HTML por cada ruta de `expo-router`. Esto es lo que permite publicar en cualquier hosting estático **sin configurar reglas de reescritura**.

> Si `output` estuviera en `"single"`, el sitio sería una SPA y tendrías que configurar redirecciones en el servidor para que las rutas internas no den error 404.

---

## 3.3. Paso 3 — Probar en modo desarrollo

Este es el modo rápido para trabajar mientras editas código. Levanta un servidor con recarga automática.

Desde la carpeta raíz:

```bash
npx expo start --web
```

Deberías ver algo como:
```
  Web is waiting on http://localhost:8081
```

Abre el navegador en `http://localhost:8081` y verifica que la pantalla principal carga con el fondo, el botón "Jugar" ("Inúk") y los botones de información y créditos en la esquina inferior derecha.

Para detener el servidor, presiona `Ctrl + C` en la terminal.

> **Ojo:** el modo desarrollo **no es** lo mismo que la versión que vas a publicar. Sirve para programar, pero no prueba el resultado real de la compilación. Para eso está el Paso 5, y es el paso que más problemas detecta.

---

## 3.4. Paso 4 — Compilar la versión web

Cuando la aplicación funciona bien en desarrollo, genera la versión de producción:

```bash
npx expo export --platform web
```

Esto crea una carpeta `dist/` en la raíz del proyecto con todos los archivos estáticos listos para servir:

```
dist/
├── index.html
├── _expo/
│   └── static/
│       └── js/         ← el código JavaScript empaquetado
├── assets/             ← imágenes, audios y fuentes procesados
└── (un .html por cada ruta de expo-router)
```

> **Nota:** la carpeta `dist/` se regenera completa en cada compilación. Si cambias algo en el código, hay que volver a ejecutar este comando.

> Si quieres empezar de cero, borra `dist/` y la caché antes de compilar:
> ```bash
> npx expo export --platform web --clear
> ```

---

## 3.5. Paso 5 — Probar la compilación localmente (importante)

**Este es el paso clave para confirmar que el despliegue va a funcionar antes de subir nada.** Sirve la carpeta `dist/` como lo haría un servidor real:

```bash
npx serve dist
```

Verás algo como:
```
  Serving!
  Local:  http://localhost:3000
```

Abre `http://localhost:3000` en el navegador.

### 3.5.1. Qué revisar en esta prueba

Recorre la aplicación completa y confirma cada punto:

| Qué probar | Cómo saber que está bien |
|---|---|
| Pantalla principal | Carga el fondo, el botón "Jugar" ("Inúk") y los botones de información y créditos en la esquina inferior derecha. |
| Navegación a niveles | El botón "Jugar" lleva al mapa de niveles sin error 404 |
| Recarga directa de una ruta | Estando en el mapa de niveles, presiona F5. **Debe recargar la misma pantalla, no dar 404** |
| Imágenes de los niveles | Todas las imágenes cargan, ninguna aparece rota |
| Audio | En modo escucha, los audios suenan al presionarlos |
| Progreso | Completa un nivel, recarga la página y confirma que sigue marcada como completa |
| Consola del navegador | Presiona F12 → pestaña *Console*. No debe haber errores en rojo |

> **Sobre el progreso guardado:** en la app móvil `AsyncStorage` guarda en el dispositivo; en web usa `localStorage` del navegador. Funciona igual, pero el progreso es **por navegador**: si el usuario entra desde otro navegador o en modo incógnito, empieza de cero.

> **Sobre el audio:** los navegadores bloquean la reproducción automática hasta que el usuario interactúa con la página. Si un audio no suena al cargar la pantalla pero sí después de tocar algo, ese es el comportamiento normal del navegador, no un error del proyecto.

Para detener el servidor, `Ctrl + C`.

---

## 3.6. Paso 6 — Verificar que todo está cargado correctamente (script de diagnóstico)

El proyecto incluye un script que revisa automáticamente que cada imagen, audio y fuente referenciada en el código exista realmente en disco, y que la compilación haya quedado completa.

Guarda el archivo `fullCheck.js` dentro de una carpeta `tests/` en la raíz del proyecto.

**¿Qué verifica exactamente?**
- Que la versión de Node.js sea 18 o superior.
- Que `app.json` esté configurado para exportación web estática (`metro` + `static`).
- Que **cada** `require('@/assets/...')` del código apunte a un archivo que existe (revisa `app/`, `components/`, `hooks/` y `constants/`).
- Que no haya assets huérfanos en `assets/` que ningún archivo use (advertencia, no error).
- Que la carpeta `dist/` exista, tenga `index.html` y no esté vacía.
- Que el sitio responda por HTTP cuando lo estás sirviendo localmente.

### Cómo ejecutarlo

**Revisión básica del código** (no requiere compilar nada):
```bash
node tests/fullCheck.js
```

**Revisión incluyendo la compilación** (ejecuta primero el Paso 4):
```bash
node tests/fullCheck.js --dist
```

**Revisión completa incluyendo HTTP** (deja `npx serve dist` corriendo en otra terminal):
```bash
node tests/fullCheck.js --url http://localhost:3000
```

### Cómo interpretar la salida

Si todo está bien:

```
Iniciando validación de datos...

Node.js 20.11.0 — correcto
app.json — configuración web correcta

Verificando assets referenciados en el código...

142 referencias encontradas, 138 archivos distintos.

Verificando la compilación en dist/...

dist/index.html — presente
dist/ contiene 197 archivos.
dist/ contiene 12 archivo(s) HTML (uno por ruta de expo-router).

================================
Validación completada sin errores
```

Si hay problemas, verás líneas con `ERROR` o `ADVERTENCIA` indicando exactamente qué falló y en qué archivo:

```
ERROR: Asset no existe -> @/assets/images/nivel_8.png  (referenciado en app/misc/constants.ts)
ADVERTENCIA: Asset sin usar -> assets/images/nivel_viejo.png

================================
Se encontraron 1 error(es)
Se encontraron 1 advertencia(s)
```

### 3.6.1. Cómo resolver los errores que aparezcan

| Mensaje de error | Qué significa | Solución |
|---|---|---|
| `ERROR: Asset no existe` | El código pide un archivo que no está en `assets/` | Copia el archivo faltante a la ruta indicada, o corrige el `require()` en el archivo señalado |
| `ERROR: No se encontró app.json` | Estás ejecutando el script desde la carpeta equivocada | Ejecútalo desde la raíz del proyecto: `node tests/fullCheck.js` |
| `ERROR: se esperaba web.bundler = "metro"` | `app.json` no está configurado para web | Corrige la sección `web` de `app.json` según el Paso 2.1 |
| `ERROR: No existe la carpeta dist/` | No has compilado todavía | Ejecuta `npx expo export --platform web` |
| `ERROR: dist/index.html no existe` | La exportación quedó incompleta o falló a medias | Borra `dist/` y recompila con `--clear` |
| `ERROR: No se pudo conectar` | No hay nada sirviendo en esa URL | Levanta `npx serve dist` en otra terminal antes de usar `--url` |
| `ADVERTENCIA: Asset sin usar` | Hay un archivo en `assets/` que nadie referencia | No rompe nada, pero engorda la compilación. Bórralo si ya no se usa |


---

## 3.7. Paso 7 — Desplegar en producción

La carpeta `dist/` es un sitio estático: sirve en cualquier hosting sin configuración de servidor.

### 3.7.1. Opción A — Vercel (recomendado)

1. Sube el repositorio a GitHub.
2. Entra a [vercel.com](https://vercel.com) e importa el repositorio.
3. Configura el proyecto así:

   | Campo | Valor |
   |---|---|
   | Framework Preset | `Other` |
   | Build Command | `npx expo export --platform web` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |

4. Haz clic en **Deploy**.

Cada `push` a la rama principal vuelve a compilar y publicar automáticamente.

### 3.7.2. Opción B — Netlify

Mismos valores: build command `npx expo export --platform web`, publish directory `dist`. También puedes arrastrar la carpeta `dist/` directamente a [app.netlify.com/drop](https://app.netlify.com/drop) para una prueba rápida sin repositorio.

### 3.7.3. Opción C — Servidor propio (Nginx / Apache)

Copia el **contenido** de `dist/` a la carpeta pública del servidor (por ejemplo `/var/www/bribri/`) y apunta el sitio a esa ruta. Como `output` es `static`, no necesitas reglas de reescritura.

Ejemplo mínimo de bloque Nginx:
```nginx
server {
    listen 80;
    server_name midominio.com;
    root /var/www/bribri;
    index index.html;
}
```

### 3.7.4. Opción D — EAS Hosting (de Expo)

```bash
npm install -g eas-cli
eas login
npx expo export --platform web
eas deploy
```

> **Nota:** ninguna de estas opciones requiere PM2. PM2 sirve para mantener procesos de Node corriendo, y aquí no hay ningún proceso de servidor: solo archivos estáticos.

---

## 4. Resumen de puertos y URLs

| Componente | Puerto por defecto | URL local |
|---|---|---|
| Servidor de desarrollo (`expo start --web`) | 8081 | http://localhost:8081 |
| Compilación servida (`npx serve dist`) | 3000 | http://localhost:3000 |

---

## 5. Verificación rápida — ¿Todo funciona?

1. `npm install` termina sin errores.
2. `npx expo start --web` abre la app en `http://localhost:8081`.
3. `npx expo export --platform web` genera la carpeta `dist/` con un `index.html` dentro.
4. `node tests/fullCheck.js --dist` reporta `0 errores`.
5. `npx serve dist` sirve la app en `http://localhost:3000` y la navegación entre pantallas funciona, incluso al recargar con F5.
6. La consola del navegador (F12) no muestra errores en rojo.

Si estos seis puntos pasan, el despliegue en Vercel va a funcionar.

---

## 6. Solución de problemas comunes

| Problema | Causa probable | Solución |
|---|---|---|
| `command not found: expo` | Expo CLI no está instalado globalmente | Usa siempre `npx expo ...` en vez de `expo ...` |
| Puerto 8081 ya está en uso | Otro proceso Metro quedó abierto | Ciérralo, o ejecuta `npx expo start --web --port 8082` |
| Pantalla en blanco tras compilar | Error de JavaScript en producción | Abre F12 → *Console* y revisa el error. Recompila con `npx expo export --platform web --clear` |
| Error 404 al recargar una ruta interna | `output` está en `"single"` en vez de `"static"` | Corrige `app.json` según el Paso 2.1 y recompila |
| Imágenes rotas en producción pero bien en desarrollo | Un `require()` apunta a un archivo inexistente | Ejecuta `node tests/fullCheck.js` para identificar cuál |
| El progreso se pierde al recargar | `localStorage` bloqueado (modo incógnito o cookies deshabilitadas) | Prueba en una ventana normal del navegador |
| Arrastrar palabras no funciona bien con el mouse | Los componentes de arrastre están pensados para eventos táctiles | Verifica en un dispositivo táctil; puede requerir ajuste del componente en web |
| `Cannot find module '@/...'` | El alias de rutas no resuelve | Confirma que existe `tsconfig.json` con el alias `@/*` apuntando a la raíz |

---

## 7. Flujo recomendado antes de cada despliegue

```bash
npm install
node tests/fullCheck.js              # 1. revisar assets
npx expo export --platform web       # 2. compilar
node tests/fullCheck.js --dist       # 3. revisar la compilación
npx serve dist                       # 4. probar en el navegador
# (en otra terminal)
node tests/fullCheck.js --url http://localhost:3000   # 5. revisar por HTTP
```

Si los cinco pasos pasan sin errores, ya puedes publicar.