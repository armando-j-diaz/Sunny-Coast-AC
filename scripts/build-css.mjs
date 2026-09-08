// Rebuild the committed stylesheet; GitHub Pages still serves plain static files.
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const root = new URL('../', import.meta.url);
const input = ['fonts.css', 'tokens.css', 'styles.css']
  .map(file => readFileSync(new URL(file, root), 'utf8')).join('\n');
const output = execFileSync('npx', ['--yes', 'esbuild@0.28.1', '--loader=css', '--minify'],
  { input, encoding: 'utf8' });
writeFileSync(new URL('site.min.css', root), output);
console.log('Updated site.min.css');
