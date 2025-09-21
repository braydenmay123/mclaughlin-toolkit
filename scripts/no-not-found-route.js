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
  console.warn('\n[no-not-found-route] Removing +not-found route files before static export:');
  for (const f of found) {
    try {
      fs.unlinkSync(f);
      console.warn(' - removed ' + path.relative(process.cwd(), f));
    } catch (e) {
      console.warn(' - failed to remove ' + path.relative(process.cwd(), f) + ': ' + e.message);
    }
  }
  process.exit(0);
} else {
  console.log('OK: no +not-found routes under /app.');
}
