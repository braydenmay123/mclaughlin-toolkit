// scripts/strip-import-meta.js
// 1) Strip `import.meta` from exported JS (so classic scripts won't crash)
// 2) Ensure the entry <script> in index.html is loaded as a module

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const TARGET_DIRS = [
  path.join(DIST, "_expo", "static", "js"),
  path.join(DIST, "assets"),
  path.join(DIST, "static"),
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function patchJs(file) {
  if (!file.endsWith(".js")) return false;
  const src = fs.readFileSync(file, "utf8");
  if (src.includes("import.meta")) {
    const patched = src.replace(/\bimport\.meta\b/g, "{}");
    fs.writeFileSync(file, patched, "utf8");
    console.log("Patched JS:", path.relative(DIST, file));
    return true;
  }
  return false;
}

function patchIndexHtml() {
  const indexFile = path.join(DIST, "index.html");
  if (!fs.existsSync(indexFile)) {
    console.warn("index.html not found in dist/; skipping HTML patch.");
    return;
  }
  let html = fs.readFileSync(indexFile, "utf8");

  // Add type="module" to the Expo web entry script if missing
  // Matches something like: <script src="/_expo/static/js/web/entry-xxxx.js" defer></script>
  const patched = html.replace(
    /<script(\s+[^>]*?)\s*src="(\/_expo\/static\/js\/web\/entry-[^"]+\.js)"([^>]*)><\/script>/i,
    (m, preAttrs, src, postAttrs) => {
      // if it already has type="module", keep it; otherwise add it
      const hasTypeModule = /\stype\s*=\s*["']module["']/i.test(preAttrs + postAttrs);
      const newAttrs = hasTypeModule ? preAttrs : `${preAttrs || ""} type="module"`;
      const finalTag = `<script${newAttrs} src="${src}"${postAttrs}></script>`;
      console.log('Patched HTML: set type="module" on', src);
      return finalTag;
    }
  );

  if (patched !== html) {
    fs.writeFileSync(indexFile, patched, "utf8");
  } else {
    console.log("No entry <script> tag patch needed (already module or not found).");
  }
}

if (!fs.existsSync(DIST)) {
  console.error("dist/ not found — run the export before this script.");
  process.exit(1);
}

// 1) Patch JS files (strip import.meta)
let patchedCount = 0;
for (const dir of TARGET_DIRS) {
  for (const file of walk(dir)) {
    if (patchJs(file)) patchedCount++;
  }
}
console.log(patchedCount ? `import.meta removed from ${patchedCount} file(s).` : "No import.meta found in JS files.");

// 2) Patch HTML entry script to load as a module
patchIndexHtml();
