import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildBlameRangeArgs(file, options = {}) {
  const args = ['blame'];

  if (options.startLine && options.endLine) {
    args.push('-L', `${options.startLine},${options.endLine}`);
  } else if (options.startLine) {
    args.push('-L', `${options.startLine},+1`);
  }

  if (options.commit) {
    args.push(options.commit);
  }

  if (options.reverse) {
    args.push('--reverse');
  }

  if (options.showEmail) {
    args.push('-e');
  }

  if (options.ignoreWhitespace) {
    args.push('-w');
  }

  if (options.porcelain) {
    args.push('--porcelain');
  }

  args.push('--', file);
  return args;
}

export async function blameRange(file, options = {}) {
  if (!file) {
    throw new Error('File path is required for blame-range');
  }

  const config = await loadConfig();
  const repoPath = config.repoPath;
  const args = buildBlameRangeArgs(file, options);
  const output = await runGit(args, repoPath);
  return output;
}
