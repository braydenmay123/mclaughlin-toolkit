// scripts/ssr-audit.js
const { readdirSync, readFileSync, statSync } = require('fs');
const { join } = require('path');

const ROOTS = ['app', 'components', 'utils'];
const IGNORE = [
  'utils/runtime.ts',
  'utils/mappingStorage.ts',
  'components/GateModal.tsx',
];

const PATTERNS = [
  /(^|\W)window\./,
  /(^|\W)document\./,
  /(^|\W)localStorage\./,
  /(^|\W)navigator\./,
  /(^|\W)URL\./,
  /(^|\W)new\s+Blob\(/,
  /(^|\W)FileReader\(/,
];

let bad = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/(\.tsx?|\.jsx?)$/.test(p)) {
      const rel = p.replace(process.cwd() + '/', '');
      if (IGNORE.some((g) => rel.endsWith(g))) continue;
      const txt = readFileSync(p, 'utf8');
      for (const rx of PATTERNS) {
        if (rx.test(txt)) bad.push(rel);
      }
    }
  }
}

for (const r of ROOTS) {
  try {
    walk(join(process.cwd(), r));
  } catch {}
}

if (bad.length) {
  const unique = [...new Set(bad)].sort();
  console.error('\n[ssr-audit] Potential SSR-unsafe browser API usages found:');
  for (const f of unique) console.error(' -', f);
  console.error('\nTips: move usage into `useEffect` or a click handler, or guard with `isBrowser`/`safeLocalStorage` from utils/runtime.');
  process.exit(2);
} else {
  console.log('[ssr-audit] OK — no obvious browser API usage detected.');
}