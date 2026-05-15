import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildWhatchangedArgs(options = {}) {
  const args = ['whatchanged'];

  if (options.since) {
    args.push(`--since=${options.since}`);
  }

  if (options.until) {
    args.push(`--until=${options.until}`);
  }

  if (options.author) {
    args.push(`--author=${options.author}`);
  }

  if (options.n) {
    args.push(`-n`, String(options.n));
  }

  if (options.oneline) {
    args.push('--oneline');
  }

  if (options.noMerges) {
    args.push('--no-merges');
  }

  if (options.diff) {
    args.push('-p');
  }

  if (options.ref) {
    args.push(options.ref);
  }

  if (options.paths && options.paths.length > 0) {
    args.push('--', ...options.paths);
  }

  return args;
}

export async function whatchanged(options = {}) {
  const config = await loadConfig();
  if (!config.repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildWhatchangedArgs(options);
  const output = await runGit(args, config.repoPath);
  return output;
}
