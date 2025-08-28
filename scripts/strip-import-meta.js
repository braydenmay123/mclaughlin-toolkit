// scripts/strip-import-meta.js
// Robust post-export patcher for Expo web export on Vercel:
// 1) Strip `import.meta` from ALL exported JS files.
// 2) Ensure ANY Expo entry <script> tag in ANY HTML file is loaded as type="module".
// 3) Print clear logs so we can verify during Vercel build.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

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

if (!fs.existsSync(DIST)) {
  console.error("[patch] dist/ not found — run the export before this script.");
  process.exit(1);
}

const files = walk(DIST);

// --- 1) Patch ALL JS files (strip import.meta) ---
let jsPatched = 0;
for (const file of files) {
  if (!file.endsWith(".js")) continue;
  const src = fs.readFileSync(file, "utf8");
  if (src.includes("import.meta")) {
    const out = src.replace(/\bimport\.meta\b/g, "{}");
    fs.writeFileSync(file, out, "utf8");
    console.log("[patch] JS   :", path.relative(DIST, file), "— stripped import.meta");
    jsPatched++;
  }
}
console.log(jsPatched ? `[patch] Stripped import.meta in ${jsPatched} JS file(s).` : "[patch] No import.meta found in JS files.");

// --- 2) Patch ALL HTML files (force entry tag to type="module") ---
const entryTagRegex = /<script([^>]*?)\s+src="(\/_expo\/static\/js\/web\/entry-[^"]+\.js)"([^>]*)><\/script>/ig;

let htmlPatched = 0;
for (const file of files) {
  if (!file.endsWith(".html")) continue;
  let html = fs.readFileSync(file, "utf8");

  const before = html;
  html = html.replace(entryTagRegex, (m, preAttrs, src, postAttrs) => {
    const hasType = /\stype\s*=\s*["']module["']/i.test(preAttrs + postAttrs);
    const newPre = hasType ? preAttrs : `${preAttrs || ""} type="module"`;
    const tag = `<script${newPre} src="${src}"${postAttrs}></script>`;
    console.log("[patch] HTML :", path.relative(DIST, file), "— set type=\"module\" on", src);
    return tag;
  });

  if (html !== before) {
    fs.writeFileSync(file, html, "utf8");
    htmlPatched++;
  }
}
console.log(htmlPatched ? `[patch] Updated ${htmlPatched} HTML file(s).` : "[patch] No HTML entry tags needed patching.");

// --- 3) Done ---
console.log("[patch] Post-export patch complete.");
