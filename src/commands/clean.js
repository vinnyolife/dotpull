import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args for git clean command
 * @param {Object} options
 * @param {boolean} [options.force] - Force deletion of untracked files
 * @param {boolean} [options.dryRun] - Show what would be deleted without actually deleting
 * @param {boolean} [options.directories] - Also remove untracked directories
 * @param {boolean} [options.ignored] - Also remove ignored files
 * @param {boolean} [options.onlyIgnored] - Remove only ignored files
 * @param {boolean} [options.quiet] - Suppress output for removed files
 * @param {string[]} [options.paths] - Limit cleaning to specific paths
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

  if (options.ignored && options.onlyIgnored) {
    throw new Error('Cannot use both --ignored and --only-ignored at the same time');
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
