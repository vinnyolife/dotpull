const { loadConfig } = require('../config');
const { runGit, isGitRepo } = require('../git');

async function pull(options = {}) {
  const config = await loadConfig();

  if (!config.repoPath) {
    throw new Error('No dotfiles repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const repoPath = config.repoPath;

  if (!(await isGitRepo(repoPath))) {
    throw new Error(`Path ${repoPath} is not a valid git repository.`);
  }

  const remote = options.remote || config.remote || 'origin';
  const branch = options.branch || config.branch || 'main';

  // Fetch remote changes
  await runGit(['fetch', remote], repoPath);

  // Check if we're behind
  const revList = await runGit(
    ['rev-list', '--count', `HEAD...${remote}/${branch}`],
    repoPath
  );
  const commitsBehind = parseInt(revList.trim(), 10);

  if (isNaN(commitsBehind)) {
    throw new Error(`Could not determine commit distance from ${remote}/${branch}. Does the branch exist on the remote?`);
  }

  if (commitsBehind === 0) {
    console.log('Already up to date.');
    return { pulled: false, reason: 'up_to_date' };
  }

  // Merge fetched changes using fast-forward only to avoid unintended merges
  await runGit(['merge', '--ff-only', `${remote}/${branch}`], repoPath);

  console.log(`Pulled ${commitsBehind} new commit(s) from ${remote}/${branch}.`);
  return { pulled: true, remote, branch, commitsBehind };
}

module.exports = { pull };
