import { runGit, isGitRepo } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Returns the current git status of the dotfiles repo.
 * @returns {Promise<{ clean: boolean, staged: string[], unstaged: string[], untracked: string[] }>}
 */
export async function statusCommand() {
  const config = await loadConfig();
  if (!config) {
    throw new Error('No dotpull config found. Run `dotpull init` first.');
  }

  const { repoPath } = config;

  const repoExists = await isGitRepo(repoPath);
  if (!repoExists) {
    throw new Error('Not a git repository: ' + repoPath);
  }

  const { stdout } = await runGit(repoPath, ['status', '--porcelain']);

  const staged = [];
  const unstaged = [];
  const untracked = [];

  const lines = stdout.split('\n').filter(Boolean);

  for (const line of lines) {
    const index = line[0];
    const workTree = line[1];
    const file = line.slice(3).trim();

    if (line.startsWith('??')) {
      untracked.push(file);
    } else {
      if (index !== ' ' && index !== '?') staged.push(file);
      if (workTree !== ' ' && workTree !== '?') unstaged.push(file);
    }
  }

  const clean = staged.length === 0 && unstaged.length === 0 && untracked.length === 0;

  return { clean, staged, unstaged, untracked };
}
