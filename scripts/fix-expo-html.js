/* Force Expo web entry scripts to load as ES modules in any emitted HTML. */
const fs = require('fs');
const path = require('path');

const TARGET_DIRS = [
  process.cwd(),                           // repo root (in case HTML is committed)
  '/vercel/output',                        // Vercel build output root
  '/vercel/output/static',                 // common static dir
];

const ENTRY_RE = /<script([^>]*?)\s+src="\/_expo\/static\/js\/web\/(entry-[^"]+\.js)"([^>]*)><\/script>/gi;

function fixHtmlFile(file) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;

  html = html.replace(ENTRY_RE, (_m, beforeAttrs, entryName, afterAttrs) => {
    // Drop defer/async/crossorigin/etc. on this tag; force type="module"
    changed = true;
    return `<script type="module" src="/_expo/static/js/web/${entryName}"></script>`;
  });

  if (changed) {
    fs.writeFileSync(file, html);
    console.log(`[fix-expo-html] patched: ${path.relative(process.cwd(), file)}`);
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      // skip huge generated bundles and node_modules
      if (p.includes('/_expo/static/js/web') || p.includes('node_modules') || p.includes('/.next/')) continue;
      walk(p);
    } else if (e.isFile() && p.endsWith('.html')) {
      try { fixHtmlFile(p); } catch {}
    }
  }
}

(function main() {
  for (const d of TARGET_DIRS) walk(d);
})();