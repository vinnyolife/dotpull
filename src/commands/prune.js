import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args for git remote prune / prune operations
 */
export function buildPruneArgs(options = {}) {
  const args = ['remote', 'prune'];

  if (options.dryRun) {
    args.push('--dry-run');
  }

  const remote = options.remote || 'origin';
  args.push(remote);

  return args;
}

/**
 * Build args for git fetch --prune (prune stale remote-tracking branches)
 */
export function buildFetchPruneArgs(options = {}) {
  const args = ['fetch', '--prune'];

  if (options.pruneTags) {
    args.push('--prune-tags');
  }

  const remote = options.remote || 'origin';
  args.push(remote);

  return args;
}

export async function prune(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (options.fetch) {
    const args = buildFetchPruneArgs(options);
    return runGit(args, repoPath);
  }

  const args = buildPruneArgs(options);
  return runGit(args, repoPath);
}
