import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args for git describe
 * @param {Object} opts
 * @param {boolean} opts.tags - use any tag, not just annotated
 * @param {boolean} opts.long - always output long format
 * @param {boolean} opts.dirty - append dirty suffix if working tree is dirty
 * @param {string} opts.match - only consider tags matching glob pattern
 * @param {string} opts.exclude - do not consider tags matching glob pattern
 * @param {number} opts.abbrev - use n digits to abbreviate object name
 * @param {string} opts.commit - describe this commit-ish instead of HEAD
 */
export function buildDescribeArgs(opts = {}) {
  const args = ['describe'];

  if (opts.tags) args.push('--tags');
  if (opts.long) args.push('--long');
  if (opts.dirty) {
    args.push(typeof opts.dirty === 'string' ? `--dirty=${opts.dirty}` : '--dirty');
  }
  if (opts.match) args.push(`--match=${opts.match}`);
  if (opts.exclude) args.push(`--exclude=${opts.exclude}`);
  if (opts.abbrev !== undefined) args.push(`--abbrev=${opts.abbrev}`);
  if (opts.always) args.push('--always');
  if (opts.commit) args.push(opts.commit);

  return args;
}

export async function describe(opts = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  const args = buildDescribeArgs(opts);

  try {
    const result = await runGit(args, repoPath);
    console.log(result.trim());
  } catch (err) {
    console.error('describe failed:', err.message);
    process.exit(1);
  }
}
