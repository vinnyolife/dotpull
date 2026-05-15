import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args array for git fsck command
 * @param {Object} options
 * @param {boolean} options.unreachable - show unreachable objects
 * @param {boolean} options.dangling - show dangling objects (default git behavior)
 * @param {boolean} options.noReflogs - do not consider reflog entries
 * @param {boolean} options.full - check loose objects in alternate object pools
 * @param {boolean} options.strict - enable strict checking
 * @param {boolean} options.verbose - verbose output
 * @param {boolean} options.lostFound - write dangling objects into .git/lost-found
 * @returns {string[]}
 */
export function buildFsckArgs(options = {}) {
  const args = ['fsck'];

  if (options.unreachable) args.push('--unreachable');
  if (options.dangling === false) args.push('--no-dangling');
  if (options.noReflogs) args.push('--no-reflogs');
  if (options.full) args.push('--full');
  if (options.strict) args.push('--strict');
  if (options.verbose) args.push('--verbose');
  if (options.lostFound) args.push('--lost-found');

  return args;
}

/**
 * Run git fsck to verify the integrity of the dotfiles repository
 * @param {Object} options
 */
export async function fsck(options = {}) {
  const config = await loadConfig();
  if (!config.repoPath) {
    throw new Error('No dotpull repo found. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildFsckArgs(options);
  const result = await runGit(args, config.repoPath);
  return result;
}
