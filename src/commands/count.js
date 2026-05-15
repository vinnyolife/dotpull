import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args for git rev-list --count
 */
export function buildCountArgs(options = {}) {
  const args = ['rev-list', '--count'];

  if (options.all) {
    args.push('--all');
  }

  if (options.merges) {
    args.push('--merges');
  }

  if (options.noMerges) {
    args.push('--no-merges');
  }

  if (options.since) {
    args.push(`--since=${options.since}`);
  }

  if (options.until) {
    args.push(`--until=${options.until}`);
  }

  if (options.author) {
    args.push(`--author=${options.author}`);
  }

  const ref = options.ref || 'HEAD';
  args.push(ref);

  return args;
}

export async function countCommand(options = {}) {
  const config = await loadConfig();
  if (!config.repoPath) {
    throw new Error('No dotfiles repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildCountArgs(options);
  const result = await runGit(args, config.repoPath);
  const count = parseInt(result.trim(), 10);

  if (options.quiet) {
    return count;
  }

  const ref = options.ref || 'HEAD';
  console.log(`Commit count for ${ref}: ${count}`);
  return count;
}
