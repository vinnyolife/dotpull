import path from 'path';
import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

/**
 * Build git archive args from options
 * @param {object} opts
 * @returns {string[]}
 */
export function buildArchiveArgs(opts = {}) {
  const args = ['archive'];

  if (opts.format) {
    args.push(`--format=${opts.format}`);
  }

  if (opts.prefix) {
    args.push(`--prefix=${opts.prefix}/`);
  }

  if (opts.output) {
    args.push(`--output=${opts.output}`);
  }

  if (opts.worktree) {
    args.push('--worktree-attributes');
  }

  if (opts.verbose) {
    args.push('--verbose');
  }

  const treeish = opts.treeish || 'HEAD';
  args.push(treeish);

  if (opts.paths && opts.paths.length > 0) {
    args.push('--');
    args.push(...opts.paths);
  }

  return args;
}

export async function archiveCommand(opts = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!opts.output) {
    const treeish = opts.treeish || 'HEAD';
    const format = opts.format || 'tar.gz';
    opts.output = path.resolve(process.cwd(), `dotfiles-${treeish}.${format}`);
  }

  const args = buildArchiveArgs(opts);
  const result = await runGit(args, repoPath);

  console.log(`Archive created: ${opts.output}`);
  return result;
}
