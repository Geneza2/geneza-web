#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function removeComments(content, filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    content = content.replace(/\/\/ .+$/gm, '');
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    content = content.replace(/^\s*[\r\n]/gm, (match, offset, string) => {
      const prevChar = string[offset - 1];
      const nextChar = string[offset + match.length];
      if (prevChar === '\n' && nextChar === '\n') return match;
      if (!prevChar || prevChar === '\n') return '';
      return match;
    });
    content = content.replace(/\n{3,}/g, '\n\n');
  }
  
  return content;
}

function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!item.startsWith('.') && item !== 'node_modules') {
        processDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const cleaned = removeComments(content, fullPath);
          
          if (content !== cleaned) {
            fs.writeFileSync(fullPath, cleaned, 'utf8');
            console.log(`Cleaned: ${fullPath.replace(srcDir, 'src')}`);
          }
        } catch (error) {
          console.error(`Error processing ${fullPath}:`, error.message);
        }
      }
    }
  });
}

console.log('Cleaning comments from source files...\n');
processDirectory(srcDir);
console.log('\nDone!');
