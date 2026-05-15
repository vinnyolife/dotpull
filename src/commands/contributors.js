import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildContributorsArgs(options = {}) {
  const args = ['shortlog', '-s', '-n'];

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

  if (options.path) {
    args.push('--', options.path);
  }

  return args;
}

export async function contributors(options = {}) {
  const config = await loadConfig();

  if (!config.repoPath) {
    throw new Error('No dotfiles repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildContributorsArgs(options);
  const output = await runGit(args, config.repoPath);

  if (!output.trim()) {
    console.log('No contributors found.');
    return;
  }

  console.log('Contributors:\n');
  console.log(output);
}
