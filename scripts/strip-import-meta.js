// scripts/strip-import-meta.js
// Post-process Expo web export to neutralize `import.meta` in classic scripts.
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const TARGET_DIRS = [
  path.join(DIST, "_expo", "static", "js"),
  path.join(DIST, "assets"),
  path.join(DIST, "static"),
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function patchFile(file) {
  if (!file.endsWith(".js")) return;
  let src = fs.readFileSync(file, "utf8");
  if (src.includes("import.meta")) {
    const patched = src.replace(/\bimport\.meta\b/g, "{}");
    fs.writeFileSync(file, patched, "utf8");
    console.log("Patched:", path.relative(DIST, file));
  }
}

let foundAny = false;
for (const dir of TARGET_DIRS) {
  const files = walk(dir);
  for (const file of files) {
    const before = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
    if (before.includes("import.meta")) foundAny = true;
  }
}
if (!fs.existsSync(DIST)) {
  console.error("dist/ not found — run the export before this script.");
  process.exit(1);
}

for (const dir of TARGET_DIRS) {
  walk(dir).forEach(patchFile);
}

console.log(foundAny ? "import.meta patches applied." : "No import.meta found to patch.");
