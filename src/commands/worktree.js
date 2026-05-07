import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

/**
 * Build git worktree argument list.
 * @param {object} opts
 * @param {string} opts.subcommand - add | list | remove | prune | move | lock | unlock
 * @param {string} [opts.path] - worktree path (required for add/remove/move/lock/unlock)
 * @param {string} [opts.branch] - branch name for add
 * @param {string} [opts.destination] - destination for move
 * @param {boolean} [opts.verbose] - pass --verbose to list/prune
 * @returns {string[]}
 */
export function buildWorktreeArgs(opts = {}) {
  const { subcommand = 'list', path: wtPath, branch, destination, verbose } = opts;
  const validSubs = ['add', 'list', 'remove', 'prune', 'move', 'lock', 'unlock'];
  if (!validSubs.includes(subcommand)) {
    throw new Error(`Unknown worktree subcommand: ${subcommand}`);
  }

  const args = ['worktree', subcommand];

  if (verbose && (subcommand === 'list' || subcommand === 'prune')) {
    args.push('--verbose');
  }

  if (subcommand === 'add') {
    if (!wtPath) throw new Error('worktree add requires a path');
    args.push(wtPath);
    if (branch) args.push('-b', branch);
  } else if (subcommand === 'move') {
    if (!wtPath || !destination) throw new Error('worktree move requires path and destination');
    args.push(wtPath, destination);
  } else if (['remove', 'lock', 'unlock'].includes(subcommand)) {
    if (!wtPath) throw new Error(`worktree ${subcommand} requires a path`);
    args.push(wtPath);
  }

  return args;
}

/**
 * Execute git worktree inside the dotfiles repo.
 * @param {object} opts
 */
export async function worktreeCommand(opts = {}) {
  const config = await loadConfig();
  if (!config.repoPath) {
    throw new Error('No dotfiles repo configured. Run `dotpull init` or `dotpull clone` first.');
  }
  const args = buildWorktreeArgs(opts);
  const output = await runGit(config.repoPath, args);
  if (output) {
    console.log(output);
  }
}
