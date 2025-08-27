#!/usr/bin/env node
const { execSync } = require('child_process');

try {
  console.log('Building Expo web app...');
  execSync('npx expo export -p web', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}