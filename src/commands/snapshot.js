import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args for git stash with a snapshot label
 */
export function buildSnapshotArgs(options = {}) {
  const args = ['stash', 'push'];

  if (options.message) {
    args.push('-m', options.message);
  } else {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    args.push('-m', `dotpull-snapshot-${timestamp}`);
  }

  if (options.includeUntracked) {
    args.push('--include-untracked');
  }

  if (options.keepIndex) {
    args.push('--keep-index');
  }

  return args;
}

/**
 * List all dotpull snapshots from stash
 */
export function buildSnapshotListArgs() {
  return ['stash', 'list', '--grep=dotpull-snapshot'];
}

/**
 * Restore a named snapshot by stash index
 */
export function buildSnapshotRestoreArgs(index, options = {}) {
  const ref = index !== undefined ? `stash@{${index}}` : 'stash@{0}';
  const args = ['stash', 'apply', ref];

  if (options.index) {
    args.push('--index');
  }

  return args;
}

export async function snapshot(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  const args = buildSnapshotArgs(options);
  const result = await runGit(args, repoPath);
  return result;
}
