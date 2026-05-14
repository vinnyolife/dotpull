import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildMergeArgs(options = {}) {
  const args = ['merge'];

  if (options.noFf) args.push('--no-ff');
  if (options.ffOnly) args.push('--ff-only');
  if (options.squash) args.push('--squash');
  if (options.abort) args.push('--abort');
  if (options.continue) args.push('--continue');
  if (options.noCommit) args.push('--no-commit');
  if (options.strategy) args.push('--strategy', options.strategy);
  if (options.message) args.push('-m', options.message);

  if (!options.abort && !options.continue && options.branch) {
    args.push(options.branch);
  }

  return args;
}

export async function merge(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildMergeArgs(options);
  const result = await runGit(args, repoPath);
  return result;
}
