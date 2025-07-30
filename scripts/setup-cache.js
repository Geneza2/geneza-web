const fs = require('fs');
const path = require('path');

// Create Next.js cache directories
const cacheDirs = [
  '.next/cache/images',
  '.next/cache/next-babel-loader',
  '.next/cache/next-minifier',
  '.next/cache/swc',
];

cacheDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created cache directory: ${dir}`);
  } else {
    console.log(`Cache directory already exists: ${dir}`);
  }
});

console.log('Cache directories setup complete!'); 