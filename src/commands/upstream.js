import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args for git branch --set-upstream-to or --unset-upstream
 */
export function buildUpstreamArgs(options = {}) {
  const args = ['branch'];

  if (options.unset) {
    args.push('--unset-upstream');
    if (options.branch) args.push(options.branch);
    return args;
  }

  if (options.set) {
    args.push('--set-upstream-to', options.set);
    if (options.branch) args.push(options.branch);
    return args;
  }

  // Default: show upstream tracking info
  args.push('-vv');
  if (options.branch) args.push(options.branch);
  return args;
}

export async function upstreamCommand(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildUpstreamArgs(options);
  const result = await runGit(args, repoPath);

  if (options.unset) {
    console.log('Upstream tracking removed.');
  } else if (options.set) {
    console.log(`Upstream set to: ${options.set}`);
  } else {
    console.log(result.stdout || '(no output)');
  }

  return result;
}
