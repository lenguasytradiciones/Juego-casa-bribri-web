#!/usr/bin/env node
/**
 * moveUnused.js — Mueve a cuarentena los assets que ningún archivo usa
 *
 * NUNCA borra nada. Mueve los archivos a _assets_sin_usar/ conservando
 * la estructura de carpetas, y guarda un manifiesto para poder revertir.
 *
 * Uso:
 *   node tests/moveUnused.js                  # SIMULACIÓN: solo muestra qué movería
 *   node tests/moveUnused.js --apply          # mueve los archivos de verdad
 *   node tests/moveUnused.js --restore        # devuelve todo a su lugar original
 *   node tests/moveUnused.js --apply --si-audio   # incluye también audios (por defecto los omite)
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const CUARENTENA = path.join(RAIZ, '_assets_sin_usar');
const MANIFIESTO = path.join(CUARENTENA, '_manifiesto.json');

const CARPETAS_FUENTE = ['app', 'components', 'hooks', 'constants'];
const EXTENSIONES_FUENTE = ['.ts', '.tsx', '.js', '.jsx'];
const EXTENSIONES_ASSET = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg',
                           '.mp3', '.wav', '.m4a', '.ttf', '.otf', '.pdf'];

// Nunca mover estos, aunque parezcan sin usar.
const EXTENSIONES_PROTEGIDAS = ['.ttf', '.otf'];

const args = process.argv.slice(2);
const aplicar = args.includes('--apply');
const restaurar = args.includes('--restore');
const incluirAudio = args.includes('--si-audio');

// ---------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------
function listarArchivos(dir, extensiones) {
  const encontrados = [];
  if (!fs.existsSync(dir)) return encontrados;
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const ruta = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (entrada.name === 'node_modules' || entrada.name.startsWith('.')) continue;
      if (path.resolve(ruta) === path.resolve(CUARENTENA)) continue;
      encontrados.push(...listarArchivos(ruta, extensiones));
    } else if (extensiones.includes(path.extname(entrada.name).toLowerCase())) {
      encontrados.push(ruta);
    }
  }
  return encontrados;
}

function resolverRuta(ref, archivoOrigen) {
  if (ref.startsWith('@/')) return path.join(RAIZ, ref.slice(2));
  if (ref.startsWith('./') || ref.startsWith('../')) {
    return path.resolve(path.dirname(archivoOrigen), ref);
  }
  return path.join(RAIZ, ref.replace(/^\.\//, ''));
}

// ---------------------------------------------------------------
// MODO RESTAURAR
// ---------------------------------------------------------------
if (restaurar) {
  if (!fs.existsSync(MANIFIESTO)) {
    console.log('No hay nada que restaurar: no existe _assets_sin_usar/_manifiesto.json');
    process.exit(0);
  }
  const manifiesto = JSON.parse(fs.readFileSync(MANIFIESTO, 'utf8'));
  let devueltos = 0;
  let fallidos = 0;

  console.log(`Restaurando ${manifiesto.archivos.length} archivo(s)...\n`);
  for (const item of manifiesto.archivos) {
    const desde = path.join(RAIZ, item.cuarentena);
    const hacia = path.join(RAIZ, item.original);
    if (!fs.existsSync(desde)) {
      console.log(`OMITIDO (ya no está en cuarentena): ${item.original}`);
      fallidos++;
      continue;
    }
    if (fs.existsSync(hacia)) {
      console.log(`OMITIDO (ya existe en su lugar): ${item.original}`);
      fallidos++;
      continue;
    }
    fs.mkdirSync(path.dirname(hacia), { recursive: true });
    fs.renameSync(desde, hacia);
    console.log(`Restaurado: ${item.original}`);
    devueltos++;
  }

  console.log('\n================================');
  console.log(`${devueltos} archivo(s) restaurado(s)` + (fallidos ? `, ${fallidos} omitido(s)` : ''));
  if (devueltos > 0 && fallidos === 0) {
    fs.unlinkSync(MANIFIESTO);
    try { fs.rmSync(CUARENTENA, { recursive: true, force: true }); } catch (e) {}
    console.log('Carpeta de cuarentena eliminada.');
  }
  process.exit(0);
}

// ---------------------------------------------------------------
// 1. Recolectar TODAS las referencias
// ---------------------------------------------------------------
console.log('Buscando assets sin usar...\n');

const usados = new Set();
const dinamicos = [];

// 1a. require() e import en el código fuente
for (const carpeta of CARPETAS_FUENTE) {
  for (const archivo of listarArchivos(path.join(RAIZ, carpeta), EXTENSIONES_FUENTE)) {
    const contenido = fs.readFileSync(archivo, 'utf8');

    // require('...') estático
    const regexRequire = /require\(\s*['"]([^'"]+)['"]\s*\)/g;
    let m;
    while ((m = regexRequire.exec(contenido)) !== null) {
      if (m[1].includes('assets/')) usados.add(path.resolve(resolverRuta(m[1], archivo)));
    }

    // import ... from '...'
    const regexImport = /from\s+['"]([^'"]*assets\/[^'"]+)['"]/g;
    while ((m = regexImport.exec(contenido)) !== null) {
      usados.add(path.resolve(resolverRuta(m[1], archivo)));
    }

    // require() con plantilla o concatenación -> NO se puede resolver
    const regexDinamico = /require\(\s*[`][^`]*\$\{|require\(\s*['"][^'"]*['"]\s*\+/g;
    if (regexDinamico.test(contenido)) {
      dinamicos.push(path.relative(RAIZ, archivo));
    }
  }
}

// 1b. Assets declarados en app.json (icon, splash, favicon, adaptive-icon)
//     Estos NUNCA aparecen en un require(), por eso hay que leerlos aparte.
const rutaAppJson = path.join(RAIZ, 'app.json');
let assetsConfig = 0;
if (fs.existsSync(rutaAppJson)) {
  const crudo = fs.readFileSync(rutaAppJson, 'utf8');
  const regexRuta = /["'](\.\/[^"']*assets\/[^"']+)["']/g;
  let m;
  while ((m = regexRuta.exec(crudo)) !== null) {
    usados.add(path.resolve(path.join(RAIZ, m[1].slice(2))));
    assetsConfig++;
  }
}
console.log(`Referencias en código: ${usados.size - assetsConfig}`);
console.log(`Referencias en app.json: ${assetsConfig} (icono, splash, favicon)`);

// ---------------------------------------------------------------
// 2. Determinar cuáles sobran
// ---------------------------------------------------------------
const carpetaAssets = path.join(RAIZ, 'assets');
if (!fs.existsSync(carpetaAssets)) {
  console.log('\nERROR: no existe la carpeta assets/. ¿Estás en la raíz del proyecto?');
  process.exit(1);
}

const todos = listarArchivos(carpetaAssets, EXTENSIONES_ASSET);
const candidatos = [];
const protegidos = [];

for (const archivo of todos) {
  if (usados.has(path.resolve(archivo))) continue;
  const ext = path.extname(archivo).toLowerCase();
  const esAudio = ['.mp3', '.wav', '.m4a'].includes(ext);

  if (EXTENSIONES_PROTEGIDAS.includes(ext)) {
    protegidos.push({ archivo, razon: 'fuente tipográfica' });
    continue;
  }
  if (esAudio && !incluirAudio) {
    protegidos.push({ archivo, razon: 'audio (usa --si-audio para incluirlos)' });
    continue;
  }
  candidatos.push(archivo);
}

console.log(`Assets en total: ${todos.length}`);
console.log(`Sin usar: ${candidatos.length}`);
if (protegidos.length) console.log(`Protegidos (no se mueven): ${protegidos.length}`);

// ---------------------------------------------------------------
// 3. Avisos importantes
// ---------------------------------------------------------------
if (dinamicos.length) {
  console.log('\n----------------------------------------------------------');
  console.log('ATENCIÓN: estos archivos arman rutas de forma dinámica.');
  console.log('Este script NO puede saber qué assets usan. Revísalos a mano');
  console.log('antes de mover nada:');
  for (const d of dinamicos) console.log(`  - ${d}`);
  console.log('----------------------------------------------------------');
}

if (protegidos.length) {
  console.log('\nProtegidos:');
  for (const p of protegidos) {
    console.log(`  ${path.relative(RAIZ, p.archivo)}  [${p.razon}]`);
  }
}

if (candidatos.length === 0) {
  console.log('\n================================');
  console.log('No hay assets sin usar. Nada que mover.');
  process.exit(0);
}

console.log('\nArchivos sin usar:');
let bytes = 0;
for (const c of candidatos) {
  const tam = fs.statSync(c).size;
  bytes += tam;
  console.log(`  ${path.relative(RAIZ, c)}  (${(tam / 1024).toFixed(1)} KB)`);
}
console.log(`\nEspacio total: ${(bytes / 1024 / 1024).toFixed(2)} MB`);

// ---------------------------------------------------------------
// 4. Simulación o ejecución
// ---------------------------------------------------------------
if (!aplicar) {
  console.log('\n================================');
  console.log('MODO SIMULACIÓN — no se movió ningún archivo.');
  console.log('Para moverlos de verdad, ejecuta:');
  console.log('  node tests/moveUnused.js --apply');
  process.exit(0);
}

fs.mkdirSync(CUARENTENA, { recursive: true });

// Conservar el manifiesto anterior si ya existía
let previos = [];
if (fs.existsSync(MANIFIESTO)) {
  previos = JSON.parse(fs.readFileSync(MANIFIESTO, 'utf8')).archivos || [];
}

const movidos = [];
console.log('\nMoviendo archivos...\n');

for (const archivo of candidatos) {
  const relativo = path.relative(RAIZ, archivo);
  const destino = path.join(CUARENTENA, path.relative(carpetaAssets, archivo));
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.renameSync(archivo, destino);
  movidos.push({
    original: relativo,
    cuarentena: path.relative(RAIZ, destino),
  });
  console.log(`Movido: ${relativo}`);
}

fs.writeFileSync(MANIFIESTO, JSON.stringify({
  fecha: new Date().toISOString(),
  archivos: [...previos, ...movidos],
}, null, 2));

console.log('\n================================');
console.log(`${movidos.length} archivo(s) movido(s) a _assets_sin_usar/`);
console.log('\nSiguiente paso OBLIGATORIO — confirmar que nada se rompió:');
console.log('  npx expo export --platform web --clear');
console.log('  npx serve dist');
console.log('\nSi algo falla, revierte todo con:');
console.log('  node tests/moveUnused.js --restore');
