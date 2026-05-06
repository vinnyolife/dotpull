const { runGit, isGitRepo } = require('../git');
const { loadConfig } = require('../config');

async function checkoutCommand(target, options = {}) {
  if (!target) {
    throw new Error('Branch name or commit ref is required.');
  }

  const config = await loadConfig();

  if (!config.repoPath) {
    throw new Error('No dotfiles repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  if (!(await isGitRepo(config.repoPath))) {
    throw new Error('Configured path is not a valid git repository.');
  }

  const args = buildCheckoutArgs(target, options);
  const result = await runGit(args, config.repoPath);
  return result.trim();
}

function buildCheckoutArgs(target, options = {}) {
  const args = ['checkout'];

  if (options.newBranch) {
    args.push('-b');
  }

  if (options.force) {
    args.push('-f');
  }

  args.push(target);

  if (options.files && options.files.length > 0) {
    args.push('--', ...options.files);
  }

  return args;
}

module.exports = { checkoutCommand, buildCheckoutArgs };
