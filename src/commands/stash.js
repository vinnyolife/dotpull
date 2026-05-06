import { runGit, isGitRepo } from '../git.js';
import { loadConfig } from '../config.js';

const VALID_ACTIONS = ['save', 'pop', 'list', 'drop'];

/**
 * Build stash args.
 * @param {'save'|'pop'|'list'|'drop'} action
 * @param {string} [message]
 * @returns {string[]}
 */
export function buildStashArgs(action, message) {
  if (!VALID_ACTIONS.includes(action)) {
    throw new Error(`Invalid stash action '${action}'. Must be one of: ${VALID_ACTIONS.join(', ')}`);
  }
  const args = ['stash', action === 'save' ? 'push' : action];
  if (action === 'save' && message) {
    args.push('-m', message);
  }
  return args;
}

/**
 * Stash or unstash local dotfile changes.
 *
 * @param {object} options
 * @param {'save'|'pop'|'list'|'drop'} options.action
 * @param {string} [options.message] - stash message (only for 'save')
 */
export async function stash({ action = 'save', message } = {}) {
  const config = await loadConfig();
  const repoDir = config.repoPath;

  if (!repoDir) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  if (!(await isGitRepo(repoDir))) {
    throw new Error(`Directory is not a git repo: ${repoDir}`);
  }

  const args = buildStashArgs(action, message);
  const output = await runGit(args, repoDir);

  if (output) {
    console.log(output);
  }

  return { repoDir, action, output };
}
