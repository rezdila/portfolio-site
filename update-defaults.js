import fs from 'fs';
import path from 'path';

// Locate exported JSON files in the root folder
const files = fs.readdirSync('.')
  .filter(f => f.startsWith('portfolio-data') && f.endsWith('.json'))
  .map(f => ({ name: f, time: fs.statSync(f).mtime.getTime() }));

if (files.length === 0) {
  console.error('\x1b[31mError: No exported JSON files found in the root directory.\x1b[0m');
  console.log('Please export your data from the Admin panel, download the JSON file, copy it into this folder, and make sure it has a name like "portfolio-data.json" or "portfolio-data-xxxx.json".');
  process.exit(1);
}

// Sort by modification time to get the newest file
files.sort((a, b) => b.time - a.time);
const targetFile = files[0].name;

console.log(`Reading newest data export file: ${targetFile}...`);

try {
  const content = fs.readFileSync(targetFile, 'utf8');
  // Validate it's parsed as JSON
  const parsed = JSON.parse(content);
  
  // Format the file contents
  const outputContent = `// js/data.js — Real portfolio data for Yuresh Dilshan
// Generated dynamically from backup file: ${targetFile}
export const defaultPortfolioData = ${JSON.stringify(parsed, null, 2)};
`;

  fs.writeFileSync(path.join('js', 'data.js'), outputContent, 'utf8');
  console.log('\x1b[32m✔ Successfully updated default portfolio data in js/data.js!\x1b[0m');
  console.log('You can now commit the changes and push them to GitHub. The changes will show up for everyone visiting your site!');
} catch (err) {
  console.error('\x1b[31mError processing file:\x1b[0m', err.message);
}
