import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * buildSyncArgs - builds args for pull then push in sequence
 * sync = pull (rebase) + push, a common dotfiles workflow shortcut
 */
export function buildSyncArgs(options = {}) {
  const pullArgs = ['pull'];
  if (options.rebase !== false) pullArgs.push('--rebase');
  if (options.remote) pullArgs.push(options.remote);
  if (options.branch) pullArgs.push(options.branch);

  const pushArgs = ['push'];
  if (options.force) pushArgs.push('--force-with-lease');
  if (options.remote) pushArgs.push(options.remote);
  if (options.branch) pushArgs.push(options.branch);

  return { pullArgs, pushArgs };
}

export async function sync(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!repoPath) {
    throw new Error('No dotfiles repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const { pullArgs, pushArgs } = buildSyncArgs(options);

  console.log('Pulling latest changes...');
  const pullOutput = await runGit(pullArgs, repoPath);
  if (pullOutput.trim()) console.log(pullOutput.trim());

  console.log('Pushing local commits...');
  const pushOutput = await runGit(pushArgs, repoPath);
  if (pushOutput.trim()) console.log(pushOutput.trim());

  console.log('Sync complete.');
}
