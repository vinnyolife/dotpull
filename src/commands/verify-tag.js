import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args array for git verify-tag
 * @param {string} tag - Tag name to verify
 * @param {object} opts
 * @param {boolean} [opts.verbose] - Output more information
 * @param {string} [opts.format] - Custom output format
 * @returns {string[]}
 */
export function buildVerifyTagArgs(tag, opts = {}) {
  if (!tag) throw new Error('Tag name is required');

  const args = ['verify-tag'];

  if (opts.verbose) args.push('--verbose');
  if (opts.format) args.push(`--format=${opts.format}`);

  args.push(tag);

  return args;
}

/**
 * Verify a GPG-signed tag
 * @param {string} tag - Tag name to verify
 * @param {object} opts
 * @returns {Promise<string>}
 */
export async function verifyTag(tag, opts = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildVerifyTagArgs(tag, opts);
  const output = await runGit(args, repoPath);
  return output;
}
