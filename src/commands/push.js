const { loadConfig } = require('../config');
const { runGit, isGitRepo } = require('../git');
const path = require('path');

async function push(options = {}) {
  const config = await loadConfig();

  if (!config.repoPath) {
    throw new Error('No dotfiles repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const repoPath = config.repoPath;

  if (!(await isGitRepo(repoPath))) {
    throw new Error(`Path ${repoPath} is not a valid git repository.`);
  }

  // Stage all changes
  await runGit(['add', '-A'], repoPath);

  // Check if there's anything to commit
  const status = await runGit(['status', '--porcelain'], repoPath);
  if (!status.trim()) {
    console.log('Nothing to commit, working tree clean.');
    return { pushed: false, reason: 'nothing_to_commit' };
  }

  const message = options.message || `sync: update dotfiles from ${require('os').hostname()}`;
  await runGit(['commit', '-m', message], repoPath);

  const branch = options.branch || config.branch || 'main';
  const remote = options.remote || config.remote || 'origin';

  await runGit(['push', remote, branch], repoPath);

  console.log(`Dotfiles pushed to ${remote}/${branch}.`);
  return { pushed: true, remote, branch, message };
}

module.exports = { push };
