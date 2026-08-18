import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const root = new URL('..', import.meta.url);

async function findJavaScript(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await findJavaScript(new URL(`${entry.name}/`, directory), relative)));
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) {
      files.push(relative);
    }
  }

  return files;
}

const files = (await findJavaScript(root)).sort();

let failed = false;

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], {
    cwd: root,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    failed = true;
    process.stderr.write(result.stderr);
  }
}

if (failed) process.exit(1);
console.log(`Syntax OK: ${files.join(', ')}`);
