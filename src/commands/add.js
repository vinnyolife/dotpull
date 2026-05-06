import path from 'path';
import fs from 'fs';
import { loadConfig } from '../config.js';
import { runGit, isGitRepo } from '../git.js';

export async function addFiles(files, options = {}) {
  const config = await loadConfig();

  if (!config.repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  if (!(await isGitRepo(config.repoPath))) {
    throw new Error(`Repo path ${config.repoPath} is not a valid git repository.`);
  }

  if (!files || files.length === 0) {
    throw new Error('No files specified. Provide at least one file path to add.');
  }

  const results = [];

  for (const file of files) {
    const absolutePath = path.resolve(file);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    const relativePath = path.relative(config.repoPath, absolutePath);

    if (relativePath.startsWith('..')) {
      throw new Error(
        `File ${absolutePath} is outside the repo directory ${config.repoPath}`
      );
    }

    results.push(relativePath);
  }

  const args = ['add', ...results];
  if (options.force) {
    args.splice(1, 0, '--force');
  }

  const output = await runGit(args, config.repoPath);
  return { added: results, output };
}

export async function addCommand(files, options = {}) {
  const { added } = await addFiles(files, options);
  console.log(`Added ${added.length} file(s) to staging:`);
  added.forEach((f) => console.log(`  + ${f}`));
}
