import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args array for git gc command
 * @param {Object} options
 * @param {boolean} options.aggressive - use more time to optimize
 * @param {boolean} options.auto - check if gc is needed before running
 * @param {boolean} options.prune - prune loose objects (default: 2 weeks ago)
 * @param {string} options.pruneDate - custom date for prune (e.g. 'now', '1.week.ago')
 * @param {boolean} options.quiet - suppress progress output
 * @param {boolean} options.force - force gc even if another gc is running
 * @returns {string[]}
 */
export function buildGcArgs(options = {}) {
  const args = ['gc'];

  if (options.aggressive) args.push('--aggressive');
  if (options.auto) args.push('--auto');
  if (options.pruneDate) {
    args.push(`--prune=${options.pruneDate}`);
  } else if (options.prune) {
    args.push('--prune=now');
  }
  if (options.quiet) args.push('--quiet');
  if (options.force) args.push('--force');

  return args;
}

/**
 * Run git gc to clean up and optimize the local repository
 * @param {Object} options
 */
export async function gc(options = {}) {
  const config = await loadConfig();
  if (!config.repoPath) {
    throw new Error('No dotpull repo found. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildGcArgs(options);
  const result = await runGit(args, config.repoPath);
  return result;
}
