import path from 'path';
import fs from 'fs';
import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

export async function remove(files, options = {}) {
  const config = await loadConfig();

  if (!config.repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const repoPath = config.repoPath;

  if (!files || files.length === 0) {
    throw new Error('No files specified. Provide at least one file to remove.');
  }

  const results = [];

  for (const file of files) {
    const absolutePath = path.isAbsolute(file)
      ? file
      : path.resolve(process.cwd(), file);

    const relativePath = path.relative(repoPath, absolutePath);

    if (relativePath.startsWith('..')) {
      throw new Error(`File "${file}" is outside the repo directory.`);
    }

    const exists = fs.existsSync(absolutePath);

    if (!exists && !options.force) {
      throw new Error(`File "${file}" does not exist. Use --force to remove from index anyway.`);
    }

    await runGit(['rm', '--cached', options.force ? '-f' : null, relativePath].filter(Boolean), repoPath);

    if (options.delete && exists) {
      fs.unlinkSync(absolutePath);
    }

    results.push({ file, relativePath, deleted: !!(options.delete && exists) });
  }

  const message = options.message || `remove: untrack ${files.join(', ')}`;
  await runGit(['commit', '-m', message], repoPath);

  return results;
}
