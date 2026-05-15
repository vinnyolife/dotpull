import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args for git stash branch
 * @param {string} branchName - new branch name
 * @param {string} [stashRef] - optional stash ref (e.g. stash@{2})
 * @returns {string[]}
 */
export function buildStashBranchArgs(branchName, stashRef) {
  if (!branchName) throw new Error('Branch name is required for stash-branch');
  const args = ['stash', 'branch', branchName];
  if (stashRef) args.push(stashRef);
  return args;
}

/**
 * Create a new branch from a stash entry and apply it
 * @param {string} branchName
 * @param {object} options
 * @param {string} [options.stashRef]
 * @param {boolean} [options.verbose]
 */
export async function stashBranch(branchName, options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  const args = buildStashBranchArgs(branchName, options.stashRef);

  const result = await runGit(args, { cwd: repoPath });

  if (options.verbose) {
    console.log(result.stdout);
  }

  return result;
}
