import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

export function buildShortlogArgs(options = {}) {
  const args = ['shortlog'];

  if (options.summary) {
    args.push('-s');
  }

  if (options.numbered) {
    args.push('-n');
  }

  if (options.email) {
    args.push('-e');
  }

  if (options.all) {
    args.push('--all');
  }

  if (options.since) {
    args.push(`--since=${options.since}`);
  }

  if (options.until) {
    args.push(`--until=${options.until}`);
  }

  if (options.range) {
    args.push(options.range);
  }

  return args;
}

export async function shortlog(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildShortlogArgs(options);
  const output = await runGit(args, repoPath);
  console.log(output);
}
