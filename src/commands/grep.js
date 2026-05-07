import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

/**
 * Build git grep argument array from options.
 * @param {object} opts
 * @returns {string[]}
 */
export function buildGrepArgs(opts) {
  if (!opts.pattern) throw new Error('search pattern is required');

  const args = ['grep'];

  if (opts.ignoreCase) args.push('-i');
  if (opts.lineNumber) args.push('-n');
  if (opts.count) args.push('--count');
  if (opts.invert) args.push('-v');
  if (opts.word) args.push('-w');
  if (opts.fixedStrings) args.push('-F');
  if (opts.extendedRegexp) args.push('-E');
  if (opts.perlRegexp) args.push('-P');
  if (opts.untracked) args.push('--untracked');
  if (opts.recurseSubmodules) args.push('--recurse-submodules');

  args.push(opts.pattern);

  if (opts.revision) args.push(opts.revision);

  if (opts.pathspecs && opts.pathspecs.length > 0) {
    args.push('--');
    args.push(...opts.pathspecs);
  }

  return args;
}

export async function grepCommand(opts) {
  const config = await loadConfig();
  const args = buildGrepArgs(opts);
  const output = await runGit(args, { cwd: config.repoPath });
  if (output) process.stdout.write(output + '\n');
}
