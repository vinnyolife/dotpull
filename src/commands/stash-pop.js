import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args for git stash pop
 * @param {object} options
 * @param {string} [options.stashRef]
 * @param {boolean} [options.index] - try to reinstate index state too
 * @returns {string[]}
 */
export function buildStashPopArgs(options = {}) {
  const args = ['stash', 'pop'];
  if (options.index) args.push('--index');
  if (options.stashRef) args.push(options.stashRef);
  return args;
}

/**
 * Pop a stash entry and apply it to the working tree
 * @param {object} options
 * @param {string} [options.stashRef]
 * @param {boolean} [options.index]
 * @param {boolean} [options.verbose]
 */
export async function stashPop(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  const args = buildStashPopArgs(options);
  const result = await runGit(args, { cwd: repoPath });

  if (options.verbose) {
    console.log(result.stdout);
  }

  return result;
}
