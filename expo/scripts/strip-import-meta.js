// scripts/strip-import-meta.js
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
  console.error("[patch] dist/ not found — run expo export before this script.");
  process.exit(1);
}

const files = walk(DIST);

// 1) Patch ALL JS files: strip import.meta (safety)
let jsPatched = 0;
for (const file of files) {
  if (!file.endsWith(".js")) continue;
  const src = fs.readFileSync(file, "utf8");
  if (/\bimport\.meta\b/.test(src)) {
    const out = src.replace(/\bimport\.meta\b/g, "{}");
    fs.writeFileSync(file, out, "utf8");
    console.log("[patch] JS   :", path.relative(DIST, file), "— stripped import.meta");
    jsPatched++;
  }
}
console.log(jsPatched ? `[patch] Stripped import.meta in ${jsPatched} JS file(s).` : "[patch] No import.meta found in JS files.");

// Helper: patch a single HTML string to ensure entry is module
function ensureModuleForEntry(html, relativeHtmlPath) {
  // Match ANY script whose src contains /_expo/static/js/web/entry-*.js (order of attrs doesn't matter)
  const genericScriptTag = /<script([^>]*?)src\s*=\s*["'](\/_expo\/static\/js\/web\/entry-[^"']+?\.js)["']([^>]*)><\/script>/ig;

  let touched = false;
  html = html.replace(genericScriptTag, (m, pre, src, post) => {
    // Already type="module"?
    if (/\stype\s*=\s*["']module["']/i.test(pre + post)) {
      return m;
    }
    // Try minimal change: add type="module"
    const newPre = (pre || "") + ' type="module"';
    const tag = `<script${newPre} src="${src}"${post}></script>`;
    console.log("[patch] HTML :", relativeHtmlPath, "— set type=\"module\" on", src);
    touched = true;
    return tag;
  });

  if (!touched) {
    // Fallback: if we can find the src path at all, replace the WHOLE tag with an inline module import
    const srcMatch = html.match(/\/_expo\/static\/js\/web\/entry-[^"']+?\.js/);
    if (srcMatch) {
      const src = srcMatch[0];
      const tagMatcher = new RegExp(`<script[^>]*?src=["']${src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*><\\/script>`, "i");
      const replacement = `<script type="module">import "${src}";</script>`;
      if (tagMatcher.test(html)) {
        html = html.replace(tagMatcher, replacement);
        console.log("[patch] HTML :", relativeHtmlPath, "— replaced entry tag with inline module import for", src);
        touched = true;
      }
    }
  }
  return { html, touched };
}

// 2) Patch ALL HTML files
let htmlPatched = 0;
for (const file of files) {
  if (!file.endsWith(".html")) continue;
  const rel = path.relative(DIST, file);
  let html = fs.readFileSync(file, "utf8");
  const before = html;
  const result = ensureModuleForEntry(html, rel);
  html = result.html;
  if (html !== before) {
    fs.writeFileSync(file, html, "utf8");
    htmlPatched++;
  }
}
console.log(htmlPatched ? `[patch] Updated ${htmlPatched} HTML file(s).` : "[patch] No HTML files needed patching.");

// 3) FORCE the homepage (and 200.html) just in case
for (const forceName of ["index.html", "200.html"]) {
  const file = path.join(DIST, forceName);
  if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, "utf8");
    const before = html;
    const result = ensureModuleForEntry(html, forceName);
    html = result.html;
    if (html !== before) {
      fs.writeFileSync(file, html, "utf8");
      console.log("[patch] FORCE:", forceName, "— ensured entry is loaded as module.");
    } else {
      console.log("[patch] FORCE:", forceName, "— already OK or no entry tag found.");
    }
  }
}

console.log("[patch] Post-export patch complete.");
