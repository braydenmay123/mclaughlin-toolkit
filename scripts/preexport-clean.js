// scripts/preexport-clean.js
const fs = require('fs');
const path = require('path');

const TARGETS = [
  '.expo',
  '.expo-shared',
  '.expo/web',
  '.expo/web/cache',
  '.cache',
  '.next',
  'dist',
  '.vercel/output'
];

function rmrf(p) {
  try {
    const full = path.join(process.cwd(), p);
    if (!fs.existsSync(full)) return;
    const stat = fs.lstatSync(full);
    if (stat.isDirectory()) {
      for (const f of fs.readdirSync(full)) {
        rmrf(path.join(p, f));
      }
      fs.rmdirSync(full);
    } else {
      fs.unlinkSync(full);
    }
    console.log(`[preexport-clean] removed: ${p}`);
  } catch (e) {
    console.log(`[preexport-clean] skip (not found or locked): ${p}`);
  }
}

console.log('[preexport-clean] start');
for (const t of TARGETS) rmrf(t);
console.log('[preexport-clean] done');
