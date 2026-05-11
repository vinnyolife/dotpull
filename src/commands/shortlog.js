import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

export function buildShortlogArgs(options) {
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

  if (options.group) {
    args.push(`--group=${options.group}`);
  }

  if (options.range) {
    args.push(options.range);
  }

  return args;
}

export async function shortlog(options = {}) {
  const config = await loadConfig();
  if (!config.repoPath) {
    throw new Error('No dotpull repo found. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildShortlogArgs(options);
  const result = await runGit(args, config.repoPath);
  console.log(result || 'No commits found.');
}
