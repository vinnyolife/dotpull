import { runGit, isGitRepo } from '../git.js';
import { loadConfig } from '../config.js';

export function buildVerifyCommitArgs(options = {}) {
  const args = ['verify-commit'];

  if (options.verbose) args.push('--verbose');
  if (options.raw) args.push('--raw');

  if (Array.isArray(options.commits) && options.commits.length > 0) {
    args.push(...options.commits);
  } else if (options.commit) {
    args.push(options.commit);
  } else {
    args.push('HEAD');
  }

  return args;
}

export async function verifyCommitCommand(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!(await isGitRepo(repoPath))) {
    throw new Error('Not a git repository. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildVerifyCommitArgs(options);
  const output = await runGit(args, repoPath);

  if (output && output.trim()) {
    console.log(output);
  } else {
    const target = options.commit || 'HEAD';
    console.log(`Commit ${target} GPG signature verified successfully.`);
  }
}
