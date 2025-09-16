#!/usr/bin/env node

/**
 * Route conflict checker for Expo Router
 * Prevents conflicting file routes and folder routes
 */

const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(process.cwd(), 'app');

function checkRouteConflicts() {
  const conflicts = [];
  
  // Check for education route conflict specifically
  const educationFile = path.join(APP_DIR, 'education.tsx');
  const educationJsFile = path.join(APP_DIR, 'education.js');
  const educationJsxFile = path.join(APP_DIR, 'education.jsx');
  const educationTsFile = path.join(APP_DIR, 'education.ts');
  const educationIndexFile = path.join(APP_DIR, 'education', 'index.tsx');
  
  const fileRouteExists = fs.existsSync(educationFile) || 
                         fs.existsSync(educationJsFile) || 
                         fs.existsSync(educationJsxFile) || 
                         fs.existsSync(educationTsFile);
  
  const folderRouteExists = fs.existsSync(educationIndexFile);
  
  if (fileRouteExists && folderRouteExists) {
    conflicts.push({
      route: 'education',
      fileRoute: 'app/education.*',
      folderRoute: 'app/education/index.*'
    });
  }
  
  return conflicts;
}

function main() {
  console.log('🔍 Checking for Expo Router conflicts...');
  
  const conflicts = checkRouteConflicts();
  
  if (conflicts.length === 0) {
    console.log('✅ No route conflicts found');
    process.exit(0);
  }
  
  console.error('❌ Route conflicts detected:');
  conflicts.forEach(conflict => {
    console.error(`  - Route '${conflict.route}' conflicts:`);
    console.error(`    File route: ${conflict.fileRoute}`);
    console.error(`    Folder route: ${conflict.folderRoute}`);
    console.error(`    Both resolve to the same pattern '${conflict.route}'`);
  });
  
  console.error('\n💡 To fix: rename the file route to avoid conflicts');
  console.error('   Example: app/education.tsx → app/education/home.tsx');
  
  process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = { checkRouteConflicts };