import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args for git cherry command
 * @param {object} options
 * @param {string} [options.upstream] - upstream branch to compare against
 * @param {string} [options.head] - head branch/commit
 * @param {string} [options.limit] - limit commits
 * @param {boolean} [options.verbose] - show commit subjects
 * @param {boolean} [options.abbrev] - abbreviate commit hashes
 */
export function buildCherryArgs(options = {}) {
  const args = ['cherry'];

  if (options.verbose) {
    args.push('-v');
  }

  if (options.abbrev) {
    args.push('--abbrev');
  }

  if (options.upstream) {
    args.push(options.upstream);
  }

  if (options.head) {
    if (!options.upstream) {
      throw new Error('--head requires --upstream to be specified');
    }
    args.push(options.head);
  }

  if (options.limit) {
    if (!options.upstream) {
      throw new Error('--limit requires --upstream to be specified');
    }
    args.push(options.limit);
  }

  return args;
}

export async function cherryCommand(options = {}) {
  const config = await loadConfig();

  if (!config.repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildCherryArgs(options);
  const output = await runGit(args, config.repoPath);
  return output;
}
