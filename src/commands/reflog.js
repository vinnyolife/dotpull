import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildReflogArgs(options = {}) {
  const args = ['reflog'];

  if (options.subcommand) {
    args.push(options.subcommand);
  }

  if (options.ref) {
    args.push(options.ref);
  }

  if (options.all) {
    args.push('--all');
  }

  if (options.expire) {
    args.push(`--expire=${options.expire}`);
  }

  if (options.expireUnreachable) {
    args.push(`--expire-unreachable=${options.expireUnreachable}`);
  }

  if (options.n) {
    args.push(`-n`, String(options.n));
  }

  if (options.format) {
    args.push(`--format=${options.format}`);
  }

  if (options.date) {
    args.push(`--date=${options.date}`);
  }

  return args;
}

export async function reflogCommand(options = {}) {
  const config = await loadConfig();
  if (!config.repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildReflogArgs(options);
  const output = await runGit(args, config.repoPath);

  if (output.trim()) {
    console.log(output.trim());
  } else {
    console.log('No reflog entries found.');
  }
}
