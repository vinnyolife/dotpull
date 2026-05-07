import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

/**
 * Build git worktree argument array from options.
 * @param {object} opts
 * @returns {string[]}
 */
export function buildWorktreeArgs(opts) {
  const base = ['worktree'];

  if (opts.list) {
    base.push('list');
    if (opts.porcelain) base.push('--porcelain');
    return base;
  }

  if (opts.add) {
    base.push('add');
    if (opts.newBranch && opts.branch) {
      base.push('-b', opts.branch, opts.path);
    } else {
      base.push(opts.path);
      if (opts.branch) base.push(opts.branch);
    }
    return base;
  }

  if (opts.remove) {
    base.push('remove');
    if (opts.force) base.push('--force');
    base.push(opts.path);
    return base;
  }

  if (opts.prune) {
    base.push('prune');
    if (opts.dryRun) base.push('--dry-run');
    return base;
  }

  if (opts.lock) {
    base.push('lock', opts.path);
    return base;
  }

  if (opts.unlock) {
    base.push('unlock', opts.path);
    return base;
  }

  if (opts.move) {
    base.push('move', opts.path, opts.destination);
    return base;
  }

  throw new Error('worktree subcommand required');
}

export async function worktreeCommand(opts) {
  const config = await loadConfig();
  const args = buildWorktreeArgs(opts);
  const output = await runGit(args, { cwd: config.repoPath });
  if (output) process.stdout.write(output + '\n');
}
