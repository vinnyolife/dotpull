import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

/**
 * Build git bisect argument list.
 * @param {object} opts
 * @param {string} opts.subcommand - start | good | bad | reset | log | skip
 * @param {string[]} [opts.args] - extra args forwarded to bisect subcommand
 * @returns {string[]}
 */
export function buildBisectArgs(opts = {}) {
  const { subcommand = 'log', args = [] } = opts;
  const validSubs = ['start', 'good', 'bad', 'reset', 'log', 'skip', 'run'];
  if (!validSubs.includes(subcommand)) {
    throw new Error(`Unknown bisect subcommand: ${subcommand}`);
  }
  return ['bisect', subcommand, ...args];
}

/**
 * Execute git bisect inside the dotfiles repo.
 * @param {object} opts
 */
export async function bisectCommand(opts = {}) {
  const config = await loadConfig();
  if (!config.repoPath) {
    throw new Error('No dotfiles repo configured. Run `dotpull init` or `dotpull clone` first.');
  }
  const args = buildBisectArgs(opts);
  const output = await runGit(config.repoPath, args);
  if (output) {
    console.log(output);
  }
}
