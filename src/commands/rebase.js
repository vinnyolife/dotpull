const { runGit } = require('../git');
const { loadConfig } = require('../config');

/**
 * Build args array for git rebase command
 */
function buildRebaseArgs(options = {}) {
  const args = ['rebase'];

  if (options.interactive) {
    args.push('--interactive');
  }

  if (options.abort) {
    args.push('--abort');
    return args;
  }

  if (options.continue) {
    args.push('--continue');
    return args;
  }

  if (options.skip) {
    args.push('--skip');
    return args;
  }

  if (options.onto) {
    args.push('--onto', options.onto);
  }

  if (options.autosquash) {
    args.push('--autosquash');
  }

  if (options.noFf) {
    args.push('--no-ff');
  }

  if (options.branch) {
    args.push(options.branch);
  }

  return args;
}

async function rebaseCommand(options = {}) {
  const config = await loadConfig();

  if (!config.repoPath) {
    throw new Error('No dotpull repo found. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildRebaseArgs(options);
  const result = await runGit(args, config.repoPath);
  return result;
}

module.exports = { rebaseCommand, buildRebaseArgs };
