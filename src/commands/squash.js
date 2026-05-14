import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args for squashing commits via interactive rebase
 * @param {number} count - number of commits to squash
 * @param {object} opts
 * @param {string} [opts.message] - new commit message
 * @param {boolean} [opts.noEdit] - skip editor, use first commit message
 */
export function buildSquashArgs(count, opts = {}) {
  if (!count || typeof count !== 'number' || count < 2) {
    throw new Error('squash requires a count of at least 2');
  }

  const args = ['rebase', '-i', `HEAD~${count}`];

  if (opts.noEdit) {
    args.unshift('-c', 'core.editor=true');
    // prepend git -c flag properly
    return { gitFlags: ['-c', 'core.editor=true'], args: ['rebase', '-i', `HEAD~${count}`], autosquash: true };
  }

  return { gitFlags: [], args, autosquash: false, message: opts.message || null };
}

/**
 * Squash last N commits using soft reset + recommit
 * @param {number} count
 * @param {object} opts
 * @param {string} opts.message - required commit message for the squashed commit
 */
export async function squashCommand(count, opts = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!count || count < 2) {
    throw new Error('Provide a count >= 2 to squash commits.');
  }

  if (!opts.message) {
    throw new Error('A --message is required when squashing commits.');
  }

  // soft reset back N commits, keeping changes staged
  await runGit(['reset', '--soft', `HEAD~${count}`], repoPath);

  // recommit with the new message
  await runGit(['commit', '-m', opts.message], repoPath);

  console.log(`Squashed last ${count} commits into one: "${opts.message}"`);
}
