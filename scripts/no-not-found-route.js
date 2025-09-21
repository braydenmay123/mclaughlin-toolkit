#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const appDir = path.join(process.cwd(), 'app');
let found = [];

function scan(dir) {
  const entries = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(full);
    else if (/\+not-found\.(t|j)sx?$/.test(entry.name)) found.push(full);
  }
}

scan(appDir);

if (found.length > 0) {
  console.warn('\n[no-not-found-route] Detected +not-found route files:');
  for (const f of found) console.warn(' - ' + path.relative(process.cwd(), f));
  console.warn('\nProceeding without blocking. Ensure these pages are SSR-safe.');
  process.exit(0);
} else {
  console.log('OK: no +not-found routes under /app.');
}
