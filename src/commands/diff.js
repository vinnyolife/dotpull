import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Show diff of uncommitted changes in the dotfiles repo.
 * @param {object} options
 * @param {boolean} [options.staged] - Show staged changes instead of unstaged
 * @param {string} [options.file] - Limit diff to a specific file
 */
export async function diffCommand(options = {}) {
  const cfg = await loadConfig();

  const args = buildDiffArgs(options);
  const output = await runGit(args, cfg.repoPath);

  if (!output || output.trim() === '') {
    console.log('No changes detected.');
    return;
  }

  console.log(output);
}

function buildDiffArgs({ staged = false, file } = {}) {
  if (file) {
    return ['diff', 'HEAD', '--', file];
  }

  if (staged) {
    return ['diff', '--staged'];
  }

  return ['diff', 'HEAD'];
}

export default diffCommand;
