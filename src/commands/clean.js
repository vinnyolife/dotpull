import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args for git clean command
 * @param {Object} options
 * @returns {string[]}
 */
export function buildCleanArgs(options = {}) {
  const args = ['clean'];

  if (options.force) {
    args.push('-f');
  }

  if (options.dryRun) {
    args.push('-n');
  }

  if (options.directories) {
    args.push('-d');
  }

  if (options.ignored) {
    args.push('-x');
  }

  if (options.onlyIgnored) {
    args.push('-X');
  }

  if (options.quiet) {
    args.push('-q');
  }

  if (options.paths && options.paths.length > 0) {
    args.push('--');
    args.push(...options.paths);
  }

  return args;
}

/**
 * Run git clean in the dotfiles repo
 * @param {Object} options
 */
export async function clean(options = {}) {
  const config = await loadConfig();

  if (!options.force && !options.dryRun) {
    throw new Error('git clean requires either --force or --dry-run to prevent accidental deletion');
  }

  const args = buildCleanArgs(options);
  const output = await runGit(args, config.repoPath);

  if (output.trim()) {
    console.log(output.trim());
  } else if (options.dryRun) {
    console.log('Nothing to clean.');
  }
}
