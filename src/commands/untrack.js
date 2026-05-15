import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build git args to remove a file from tracking without deleting it.
 * Uses `git rm --cached` under the hood.
 */
export function buildUntrackArgs(filePath, options = {}) {
  const args = ['rm', '--cached'];

  if (options.recursive) {
    args.push('-r');
  }

  if (options.force) {
    args.push('--force');
  }

  if (!filePath) {
    throw new Error('A file path is required for untrack.');
  }

  args.push('--', filePath);
  return args;
}

/**
 * Untrack a dotfile — removes it from the git index but keeps it on disk.
 * Optionally appends the path to .gitignore so it stays untracked.
 */
export async function untrack(filePath, options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildUntrackArgs(filePath, options);
  const result = await runGit(args, repoPath);

  if (options.ignore) {
    const fs = await import('fs/promises');
    const path = await import('path');
    const gitignorePath = path.join(repoPath, '.gitignore');

    let existing = '';
    try {
      existing = await fs.readFile(gitignorePath, 'utf8');
    } catch {
      // file may not exist yet
    }

    const lines = existing.split('\n');
    const entry = path.relative(repoPath, filePath) || filePath;

    if (!lines.includes(entry)) {
      await fs.appendFile(gitignorePath, `\n${entry}\n`);
    }
  }

  return result;
}
