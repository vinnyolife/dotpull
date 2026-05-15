import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildAnnotateArgs(file, options = {}) {
  const args = ['annotate'];

  if (options.lineRange) {
    args.push('-L', options.lineRange);
  }

  if (options.commit) {
    args.push(options.commit);
  }

  if (options.showEmail) {
    args.push('-e');
  }

  if (options.ignoreWhitespace) {
    args.push('-w');
  }

  if (options.incrementalOutput) {
    args.push('--incremental');
  }

  args.push('--', file);
  return args;
}

export async function annotate(file, options = {}) {
  if (!file) {
    throw new Error('File path is required for annotate');
  }

  const config = await loadConfig();
  const repoPath = config.repoPath;
  const args = buildAnnotateArgs(file, options);
  const output = await runGit(args, repoPath);
  return output;
}
