const { runGit, isGitRepo } = require('../git');
const { loadConfig } = require('../config');

async function branchCommand(options = {}) {
  const config = await loadConfig();

  if (!config.repoPath) {
    throw new Error('No dotfiles repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  if (!(await isGitRepo(config.repoPath))) {
    throw new Error('Configured path is not a valid git repository.');
  }

  const args = buildBranchArgs(options);
  const result = await runGit(args, config.repoPath);
  return result.trim();
}

function buildBranchArgs(options = {}) {
  const args = ['branch'];

  if (options.all) {
    args.push('--all');
  } else if (options.remotes) {
    args.push('--remotes');
  }

  if (options.delete) {
    args.push('-d', options.delete);
  } else if (options.forceDelete) {
    args.push('-D', options.forceDelete);
  } else if (options.create) {
    args.push(options.create);
  } else if (options.rename) {
    args.push('-m', options.rename);
  } else if (options.checkout) {
    return ['checkout', '-b', options.checkout];
  }

  if (options.verbose && !options.delete && !options.forceDelete && !options.create) {
    args.push('-v');
  }

  return args;
}

module.exports = { branchCommand, buildBranchArgs };
