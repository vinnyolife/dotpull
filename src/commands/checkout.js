import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

/**
 * Build the git checkout argument list.
 * @param {object} opts
 * @param {string} opts.branch - Branch name or commit ref to checkout.
 * @param {boolean} [opts.create] - Create the branch if it does not exist (-b).
 * @param {boolean} [opts.detach] - Checkout in detached HEAD mode.
 * @param {string[]} [opts.files] - Specific files to checkout from the ref.
 * @returns {string[]}
 */
export function buildCheckoutArgs({ branch, create = false, detach = false, files = [] } = {}) {
  if (!branch) throw new Error('branch is required');

  const args = ['checkout'];

  if (create) {
    args.push('-b');
  } else if (detach) {
    args.push('--detach');
  }

  args.push(branch);

  if (files.length > 0) {
    args.push('--', ...files);
  }

  return args;
}

/**
 * Switch branches or restore working tree files in the dotfiles repo.
 * @param {object} opts - Options forwarded to buildCheckoutArgs.
 */
export async function checkoutCommand(opts = {}) {
  const config = await loadConfig();
  const args = buildCheckoutArgs(opts);

  try {
    const output = await runGit(config.repoPath, args);
    if (output) console.log(output);
    else console.log(`Switched to branch '${opts.branch}'`);
  } catch (err) {
    console.error(`checkout failed: ${err.message}`);
    throw err;
  }
}
