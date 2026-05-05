import { runGit, isGitRepo } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Shows the diff of uncommitted changes in the dotfiles repo.
 * @param {{ staged?: boolean }} options
 * @returns {Promise<{ diff: string, isEmpty: boolean }>}
 */
export async function diffCommand(options = {}) {
  const config = await loadConfig();
  if (!config) {
    throw new Error('No dotpull config found. Run `dotpull init` first.');
  }

  const { repoPath } = config;

  const repoExists = await isGitRepo(repoPath);
  if (!repoExists) {
    throw new Error('Not a git repository: ' + repoPath);
  }

  const args = ['diff'];
  if (options.staged) {
    args.push('--staged');
  }

  const { stdout } = await runGit(repoPath, args);

  return {
    diff: stdout,
    isEmpty: stdout.trim().length === 0,
  };
}
