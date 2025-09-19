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
  console.error('\nBuild blocked: +not-found route files detected.');
  for (const f of found) console.error(' - ' + path.relative(process.cwd(), f));
  console.error('\nRemove all +not-found files and rely on public/404.html instead.');
  process.exit(1);
} else {
  console.log('OK: no +not-found routes under /app.');
}
