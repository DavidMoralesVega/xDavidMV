#!/usr/bin/env node

/**
 * Script para reorganizar la carpeta public/ con una estructura coherente
 * - Elimina archivos temporales
 * - Reorganiza carpetas con nombres descriptivos
 * - Actualiza todas las referencias en el código
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Colores para consola
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m",
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}\n`),
};

// Mapeo de rutas antiguas a nuevas
const pathMappings = {
  // Videos
  "/videos/": "/videos/",

  // Images - estructura general
  "/images/": "/images/",

  // Subdirectorios específicos de imágenes
  "/images/works/": "/images/conferences/",
  "/images/tech/": "/images/tech-stack/",
  "/images/favicon/": "/favicon/",

  // Documentos
  "/images/brand/DavidMoralesVega-CV.pdf": "/documents/cv/DavidMoralesVega-CV.pdf",
};

// Archivos y carpetas a procesar
const filesToSearch = [
  "components/**/*.{ts,tsx,js,jsx}",
  "app/**/*.{ts,tsx,js,jsx}",
  "lib/**/*.{ts,tsx,js,jsx}",
  "data/**/*.json",
  "content/**/*.mdx",
  "public/css/**/*.css",
  "scripts/**/*.js",
  ".well-known/**/*.json",
];

let stats = {
  tmpDeleted: 0,
  directoriesCreated: 0,
  filesMoved: 0,
  filesUpdated: 0,
  referencesUpdated: 0,
};

/**
 * Paso 1: Eliminar archivos temporales
 */
function cleanTempFiles() {
  log.title("📁 Paso 1: Eliminando archivos temporales");

  const tmpFiles = [
    "public/images/blog/article/dayli-sprint.webp.tmp",
    "public/images/blog/article/education.webp.tmp",
    "public/images/blog/article/https-seguridad.webp.tmp",
    "public/images/blog/article/problema-seo.webp.tmp",
    "public/images/blog/article/programar-horas.webp.tmp",
    "public/images/brand/404.webp.tmp",
    "public/images/brand/contact.webp.tmp",
    "public/images/og/og-default.webp.tmp",
    "public/videos/hero-video.webp.tmp",
  ];

  tmpFiles.forEach((file) => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      stats.tmpDeleted++;
      log.success(`Eliminado: ${file}`);
    }
  });

  log.info(`Total archivos temporales eliminados: ${stats.tmpDeleted}`);
}

/**
 * Paso 2: Crear nueva estructura de directorios
 */
function createNewDirectories() {
  log.title("📂 Paso 2: Creando nueva estructura de directorios");

  const newDirs = [
    "public/videos",
    "public/images",
    "public/images/backgrounds",
    "public/images/blog",
    "public/images/blog/article",
    "public/images/blog/preview",
    "public/images/brand",
    "public/images/conferences",
    "public/images/conferences/preview",
    "public/images/hero",
    "public/images/icons",
    "public/images/illustrations",
    "public/images/og",
    "public/images/services",
    "public/images/team",
    "public/images/tech-stack",
    "public/favicon",
    "public/documents",
    "public/documents/cv",
  ];

  newDirs.forEach((dir) => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      stats.directoriesCreated++;
      log.success(`Creado: ${dir}`);
    }
  });

  log.info(`Total directorios creados: ${stats.directoriesCreated}`);
}

/**
 * Paso 3: Mover archivos a nueva estructura
 */
function moveFiles() {
  log.title("🚚 Paso 3: Moviendo archivos a nueva estructura");

  const moves = [
    // Videos
    { from: "public/video", to: "public/videos" },

    // Favicon
    { from: "public/images/favicon", to: "public/favicon" },

    // Documentos
    {
      from: "public/images/brand/DavidMoralesVega-CV.pdf",
      to: "public/documents/cv/DavidMoralesVega-CV.pdf",
      type: "file"
    },

    // Images - carpetas completas
    { from: "public/images/backgrounds", to: "public/images/backgrounds" },
    { from: "public/images/blog", to: "public/images/blog" },
    { from: "public/images/brand", to: "public/images/brand" },
    { from: "public/images/works", to: "public/images/conferences" },
    { from: "public/images/hero", to: "public/images/hero" },
    { from: "public/images/icons", to: "public/images/icons" },
    { from: "public/images/illustrations", to: "public/images/illustrations" },
    { from: "public/images/og", to: "public/images/og" },
    { from: "public/images/services", to: "public/images/services" },
    { from: "public/images/team", to: "public/images/team" },
    { from: "public/images/tech", to: "public/images/tech-stack" },

    // Logos al final (están en img/ root)
    {
      from: "public/images/logo.png",
      to: "public/images/brand/logo.png",
      type: "file"
    },
    {
      from: "public/images/logo-small.png",
      to: "public/images/brand/logo-small.png",
      type: "file"
    },
  ];

  moves.forEach(({ from, to, type = "dir" }) => {
    const fromPath = path.join(process.cwd(), from);
    const toPath = path.join(process.cwd(), to);

    if (!fs.existsSync(fromPath)) {
      log.warning(`No existe: ${from}`);
      return;
    }

    if (fs.existsSync(toPath)) {
      log.warning(`Ya existe: ${to}`);
      return;
    }

    try {
      // Asegurar que el directorio padre existe
      const toDir = path.dirname(toPath);
      if (!fs.existsSync(toDir)) {
        fs.mkdirSync(toDir, { recursive: true });
      }

      // Mover archivo o directorio
      fs.renameSync(fromPath, toPath);
      stats.filesMoved++;
      log.success(`${from} → ${to}`);
    } catch (error) {
      log.error(`Error moviendo ${from}: ${error.message}`);
    }
  });

  log.info(`Total archivos/directorios movidos: ${stats.filesMoved}`);
}

/**
 * Paso 4: Actualizar referencias en archivos
 */
function updateReferences() {
  log.title("🔄 Paso 4: Actualizando referencias en el código");

  // Función para actualizar un archivo
  function updateFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, "utf-8");
      let originalContent = content;
      let fileUpdated = false;

      // Aplicar cada mapeo de ruta
      Object.entries(pathMappings).forEach(([oldPath, newPath]) => {
        // Para rutas que terminan en /, reemplazar como prefijo
        if (oldPath.endsWith("/") && newPath.endsWith("/")) {
          const regex = new RegExp(oldPath.replace(/\//g, "\\/"), "g");
          if (regex.test(content)) {
            const matches = content.match(regex);
            if (matches) {
              stats.referencesUpdated += matches.length;
              fileUpdated = true;
            }
            content = content.replace(regex, newPath);
          }
        } else {
          // Para rutas específicas (archivos)
          if (content.includes(oldPath)) {
            stats.referencesUpdated++;
            fileUpdated = true;
            content = content.replace(new RegExp(oldPath.replace(/\//g, "\\/"), "g"), newPath);
          }
        }
      });

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, "utf-8");
        stats.filesUpdated++;
        log.success(`Actualizado: ${filePath.replace(process.cwd(), "")}`);
      }

      return fileUpdated;
    } catch (error) {
      log.error(`Error actualizando ${filePath}: ${error.message}`);
      return false;
    }
  }

  // Buscar archivos usando find en Windows/Unix
  const findCommand = process.platform === "win32"
    ? 'dir /s /b *.ts *.tsx *.js *.jsx *.json *.css *.mdx 2>nul'
    : 'find . -type f \\( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.css" -o -name "*.mdx" \\)';

  try {
    // Obtener lista de archivos según la plataforma
    let files;
    if (process.platform === "win32") {
      // En Windows, buscar en directorios específicos
      const dirs = ["components", "app", "lib", "data", "content", "public", "scripts", ".well-known"];
      files = [];
      dirs.forEach(dir => {
        const dirPath = path.join(process.cwd(), dir);
        if (fs.existsSync(dirPath)) {
          const dirFiles = getAllFiles(dirPath);
          files.push(...dirFiles.filter(f =>
            /\.(ts|tsx|js|jsx|json|css|mdx)$/.test(f)
          ));
        }
      });
    } else {
      const output = execSync(findCommand, { cwd: process.cwd(), encoding: "utf-8" });
      files = output.split("\n").filter(f => f.trim());
    }

    // Actualizar cada archivo
    files.forEach(file => {
      const fullPath = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        updateFile(fullPath);
      }
    });
  } catch (error) {
    log.error(`Error buscando archivos: ${error.message}`);
  }

  log.info(`Total archivos actualizados: ${stats.filesUpdated}`);
  log.info(`Total referencias actualizadas: ${stats.referencesUpdated}`);
}

/**
 * Función auxiliar para obtener todos los archivos recursivamente (Windows)
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      // Ignorar node_modules y .next
      if (file !== "node_modules" && file !== ".next" && file !== "out") {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

/**
 * Paso 5: Limpiar directorios vacíos
 */
function cleanEmptyDirectories() {
  log.title("🧹 Paso 5: Limpiando directorios vacíos");

  const oldDirs = [
    "public/img",
    "public/video",
  ];

  oldDirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      try {
        // Verificar si está vacío
        const files = fs.readdirSync(dirPath);
        if (files.length === 0) {
          fs.rmdirSync(dirPath);
          log.success(`Eliminado directorio vacío: ${dir}`);
        } else {
          log.warning(`Directorio no vacío (revisar manualmente): ${dir}`);
          log.warning(`  Contiene: ${files.slice(0, 5).join(", ")}${files.length > 5 ? "..." : ""}`);
        }
      } catch (error) {
        log.error(`Error eliminando ${dir}: ${error.message}`);
      }
    }
  });
}

/**
 * Función principal
 */
function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  🎨  REORGANIZACIÓN DE CARPETA PUBLIC                    ║
║  Estructura coherente y profesional                      ║
╚═══════════════════════════════════════════════════════════╝
  `);

  try {
    cleanTempFiles();
    createNewDirectories();
    moveFiles();
    updateReferences();
    cleanEmptyDirectories();

    log.title("📊 Resumen de cambios");
    console.log(`  Archivos temporales eliminados: ${colors.green}${stats.tmpDeleted}${colors.reset}`);
    console.log(`  Directorios creados: ${colors.green}${stats.directoriesCreated}${colors.reset}`);
    console.log(`  Archivos/carpetas movidos: ${colors.green}${stats.filesMoved}${colors.reset}`);
    console.log(`  Archivos de código actualizados: ${colors.green}${stats.filesUpdated}${colors.reset}`);
    console.log(`  Referencias actualizadas: ${colors.green}${stats.referencesUpdated}${colors.reset}`);

    log.title("✨ Reorganización completada exitosamente!");
    log.info("Ejecuta 'npm run build' para verificar que todo funciona correctamente.");

  } catch (error) {
    log.error(`Error fatal: ${error.message}`);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { main, pathMappings };
