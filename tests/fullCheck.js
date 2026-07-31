#!/usr/bin/env node
/**
 * fullCheck.js — Validación previa al despliegue web de BriBriNew
 *
 * Uso:
 *   node tests/fullCheck.js                          # solo revisa el código fuente
 *   node tests/fullCheck.js --dist                   # además revisa la carpeta dist/
 *   node tests/fullCheck.js --url http://localhost:3000   # además revisa por HTTP
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const CARPETAS_FUENTE = ['app', 'components', 'hooks', 'constants'];
const EXTENSIONES_FUENTE = ['.ts', '.tsx', '.js', '.jsx'];

const args = process.argv.slice(2);
const revisarDist = args.includes('--dist') || args.includes('--url');
const urlIndex = args.indexOf('--url');
const urlBase = urlIndex !== -1 ? args[urlIndex + 1] : null;

let errores = 0;
let advertencias = 0;

const error = (msg) => { console.log(`ERROR: ${msg}`); errores++; };
const advertencia = (msg) => { console.log(`ADVERTENCIA: ${msg}`); advertencias++; };

/** Recorre un directorio y devuelve todos los archivos con las extensiones dadas. */
function listarArchivos(dir, extensiones) {
  const encontrados = [];
  if (!fs.existsSync(dir)) return encontrados;
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const ruta = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (entrada.name === 'node_modules' || entrada.name.startsWith('.')) continue;
      encontrados.push(...listarArchivos(ruta, extensiones));
    } else if (extensiones.includes(path.extname(entrada.name))) {
      encontrados.push(ruta);
    }
  }
  return encontrados;
}

/** Extrae todas las rutas de assets referenciadas con require(...) en un archivo. */
function extraerAssets(archivo) {
  const contenido = fs.readFileSync(archivo, 'utf8');
  const regex = /require\(\s*['"]([^'"]+)['"]\s*\)/g;
  const rutas = [];
  let m;
  while ((m = regex.exec(contenido)) !== null) {
    const ref = m[1];
    if (!ref.includes('assets/')) continue;
    rutas.push(ref);
  }
  return rutas;
}

/** Convierte una referencia (@/... o relativa) en una ruta absoluta en disco. */
function resolverRuta(ref, archivoOrigen) {
  if (ref.startsWith('@/')) return path.join(RAIZ, ref.slice(2));
  if (ref.startsWith('.')) return path.resolve(path.dirname(archivoOrigen), ref);
  return path.join(RAIZ, ref);
}

console.log('Iniciando validación de datos...\n');

// ---------------------------------------------------------------
// 1. Node.js 18 o superior
// ---------------------------------------------------------------
const versionMayor = parseInt(process.versions.node.split('.')[0], 10);
if (versionMayor < 18) {
  error(`Node.js ${process.versions.node} es demasiado antiguo. Se requiere 18 o superior.`);
} else {
  console.log(`Node.js ${process.versions.node} — correcto`);
}

// ---------------------------------------------------------------
// 2. app.json configurado para exportación web estática
// ---------------------------------------------------------------
const rutaAppJson = path.join(RAIZ, 'app.json');
if (!fs.existsSync(rutaAppJson)) {
  error('No se encontró app.json en la raíz del proyecto.');
} else {
  const appJson = JSON.parse(fs.readFileSync(rutaAppJson, 'utf8'));
  const web = (appJson.expo && appJson.expo.web) || {};
  if (web.bundler !== 'metro') {
    error(`app.json: se esperaba web.bundler = "metro", se encontró "${web.bundler}".`);
  }
  if (web.output !== 'static') {
    advertencia(`app.json: web.output = "${web.output}". Con "static" cada ruta genera su propio HTML.`);
  }
  if (!errores) console.log('app.json — configuración web correcta');
}

// ---------------------------------------------------------------
// 3. Cada asset referenciado en el código existe en disco
// ---------------------------------------------------------------
console.log('\nVerificando assets referenciados en el código...\n');

const referenciados = new Set();
let totalReferencias = 0;

for (const carpeta of CARPETAS_FUENTE) {
  const archivos = listarArchivos(path.join(RAIZ, carpeta), EXTENSIONES_FUENTE);
  for (const archivo of archivos) {
    for (const ref of extraerAssets(archivo)) {
      totalReferencias++;
      const destino = resolverRuta(ref, archivo);
      const relativo = path.relative(RAIZ, archivo);
      if (!fs.existsSync(destino)) {
        error(`Asset no existe -> ${ref}  (referenciado en ${relativo})`);
      } else {
        referenciados.add(path.resolve(destino));
      }
    }
  }
}
console.log(`${totalReferencias} referencias encontradas, ${referenciados.size} archivos distintos.`);

// ---------------------------------------------------------------
// 4. Assets huérfanos (existen pero nadie los usa)
// ---------------------------------------------------------------
// Assets declarados en app.json (icono, splash, favicon) nunca aparecen
// en un require(), hay que leerlos aparte para no reportarlos como huerfanos.
if (fs.existsSync(rutaAppJson)) {
  const crudoAppJson = fs.readFileSync(rutaAppJson, 'utf8');
  const regexRutaConfig = /["'](\.\/[^"']*assets\/[^"']+)["']/g;
  let mc;
  while ((mc = regexRutaConfig.exec(crudoAppJson)) !== null) {
    referenciados.add(path.resolve(path.join(RAIZ, mc[1].slice(2))));
  }
}

const carpetaAssets = path.join(RAIZ, 'assets');
if (fs.existsSync(carpetaAssets)) {
  const todos = listarArchivos(carpetaAssets, ['.png', '.jpg', '.jpeg', '.gif', '.mp3', '.wav', '.m4a', '.ttf', '.otf', '.pdf']);
  const huerfanos = todos.filter((a) => !referenciados.has(path.resolve(a)));
  for (const h of huerfanos) {
    advertencia(`Asset sin usar -> ${path.relative(RAIZ, h)}`);
  }
}

// ---------------------------------------------------------------
// 5. Revisión de la carpeta dist/ (solo con --dist o --url)
// ---------------------------------------------------------------
if (revisarDist) {
  console.log('\nVerificando la compilación en dist/...\n');
  const dist = path.join(RAIZ, 'dist');
  if (!fs.existsSync(dist)) {
    error('No existe la carpeta dist/. Ejecuta primero: npx expo export --platform web');
  } else {
    if (!fs.existsSync(path.join(dist, 'index.html'))) {
      error('dist/index.html no existe. La exportación quedó incompleta.');
    } else {
      console.log('dist/index.html — presente');
    }
    const archivosDist = listarArchivos(dist, ['.html', '.js', '.css', '.png', '.jpg', '.mp3', '.ttf']);
    console.log(`dist/ contiene ${archivosDist.length} archivos.`);
    const htmls = archivosDist.filter((a) => a.endsWith('.html'));
    console.log(`dist/ contiene ${htmls.length} archivo(s) HTML (uno por ruta de expo-router).`);
    if (archivosDist.length === 0) error('dist/ está vacía.');
  }
}

// ---------------------------------------------------------------
// 6. Revisión por HTTP (solo con --url)
// ---------------------------------------------------------------
async function revisarHttp() {
  if (!urlBase) return;
  console.log(`\nVerificando acceso HTTP en ${urlBase} ...\n`);
  try {
    const res = await fetch(urlBase);
    if (res.ok) {
      const html = await res.text();
      console.log(`${urlBase} responde ${res.status}`);
      if (!html.includes('<div id="root"') && !html.includes('<div id="__next"') && html.length < 200) {
        advertencia('La respuesta parece vacía. Revisa que estés sirviendo la carpeta dist/.');
      }
    } else {
      error(`${urlBase} respondió ${res.status}`);
    }
  } catch (e) {
    error(`No se pudo conectar a ${urlBase} -> ${e.message}`);
  }
}

// ---------------------------------------------------------------
// Resumen
// ---------------------------------------------------------------
revisarHttp().then(() => {
  console.log('\n================================');
  if (errores === 0 && advertencias === 0) {
    console.log('Validación completada sin errores');
  } else {
    if (errores > 0) console.log(`Se encontraron ${errores} error(es)`);
    if (advertencias > 0) console.log(`Se encontraron ${advertencias} advertencia(s)`);
  }
  process.exit(errores > 0 ? 1 : 0);
});