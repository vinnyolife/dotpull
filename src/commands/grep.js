import { runGit, isGitRepo } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args array for git grep command.
 * @param {string} pattern - Search pattern
 * @param {object} opts - Options
 * @returns {string[]}
 */
export function buildGrepArgs(pattern, opts = {}) {
  const args = ['grep'];

  if (opts.lineNumber) args.push('-n');
  if (opts.ignoreCase) args.push('-i');
  if (opts.filesOnly) args.push('-l');
  if (opts.count) args.push('-c');

  if (opts.and) {
    args.push('-e', pattern, '--and', '-e', opts.and);
  } else {
    args.push(pattern);
  }

  if (opts.path) {
    args.push('--', opts.path);
  }

  return args;
}

/**
 * Run git grep in the dotfiles repo.
 * @param {string} pattern - Search pattern
 * @param {object} opts - CLI options
 */
export async function grep(pattern, opts = {}) {
  const config = await loadConfig();
  const { repoPath } = config;

  const isRepo = await isGitRepo(repoPath);
  if (!isRepo) {
    throw new Error('dotpull: not a git repository. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildGrepArgs(pattern, opts);

  try {
    const output = await runGit(args, repoPath);
    if (!output || output.trim() === '') {
      console.log('No matches found.');
    } else {
      console.log(output);
    }
  } catch (err) {
    // git grep exits with code 1 when no matches — treat as no matches
    if (err.message && err.message.includes('exit code 1')) {
      console.log('No matches found.');
    } else {
      throw err;
    }
  }
}
