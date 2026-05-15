import { runGit, isGitRepo } from '../git.js';
import { loadConfig } from '../config.js';

export function buildFsckArgs(options = {}) {
  const args = ['fsck'];

  if (options.unreachable) args.push('--unreachable');
  if (options.dangling) args.push('--dangling');
  if (options.noDangling) args.push('--no-dangling');
  if (options.lostFound) args.push('--lost-found');
  if (options.strict) args.push('--strict');
  if (options.verbose) args.push('--verbose');
  if (options.full) args.push('--full');
  if (options.connectivity) args.push('--connectivity-only');
  if (options.object) args.push(options.object);

  return args;
}

export async function fsckCommand(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!(await isGitRepo(repoPath))) {
    throw new Error('Not a git repository. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildFsckArgs(options);
  const output = await runGit(args, repoPath);

  if (output && output.trim()) {
    console.log(output);
  } else {
    console.log('Repository integrity check passed.');
  }
}
