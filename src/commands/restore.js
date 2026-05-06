import { runGit, isGitRepo } from '../git.js';
import { loadConfig } from '../config.js';
import path from 'path';

/**
 * Build restore args for git checkout
 * @param {string} file - file path to restore
 * @param {string} [ref] - git ref to restore from (default: HEAD)
 * @returns {string[]}
 */
export function buildRestoreArgs(file, ref = 'HEAD') {
  return ['checkout', ref, '--', file];
}

/**
 * Restore a tracked dotfile to its last committed state (or a specific ref).
 *
 * @param {object} options
 * @param {string}   options.file  - relative or absolute path to the dotfile
 * @param {string}  [options.ref]  - git ref / commit hash to restore from
 * @param {boolean} [options.dry]  - print what would happen without doing it
 */
export async function restore({ file, ref = 'HEAD', dry = false } = {}) {
  const config = await loadConfig();
  const repoDir = config.repoPath;

  if (!repoDir) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  if (!(await isGitRepo(repoDir))) {
    throw new Error(`Directory is not a git repo: ${repoDir}`);
  }

  // Normalise to a path relative to the repo root
  const relativePath = path.isAbsolute(file)
    ? path.relative(repoDir, file)
    : file;

  if (dry) {
    console.log(`[dry-run] would restore '${relativePath}' from ${ref}`);
    return { repoDir, relativePath, ref, dry: true };
  }

  const args = buildRestoreArgs(relativePath, ref);
  await runGit(args, repoDir);

  console.log(`Restored '${relativePath}' from ${ref}`);
  return { repoDir, relativePath, ref };
}
