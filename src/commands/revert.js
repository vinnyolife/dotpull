import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildRevertArgs(options = {}) {
  const args = ['revert'];

  if (options.noEdit) args.push('--no-edit');
  if (options.noCommit) args.push('--no-commit');
  if (options.mainline) args.push('-m', String(options.mainline));
  if (options.abort) {
    args.push('--abort');
    return args;
  }
  if (options.continue) {
    args.push('--continue');
    return args;
  }

  if (options.commits && options.commits.length > 0) {
    args.push(...options.commits);
  } else if (options.commit) {
    args.push(options.commit);
  }

  return args;
}

export async function revert(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildRevertArgs(options);
  const result = await runGit(args, repoPath);
  return result;
}
