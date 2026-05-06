import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

const DEFAULT_LIMIT = 10;

/**
 * Show commit log for the dotfiles repo.
 * @param {object} options
 * @param {number} [options.limit] - Number of commits to show (default: 10)
 * @param {boolean} [options.oneline] - Show each commit on a single line
 * @param {string} [options.file] - Show commits touching a specific file
 */
export async function logCommand(options = {}) {
  const cfg = await loadConfig();

  const limit = options.limit ? parseInt(options.limit, 10) : DEFAULT_LIMIT;

  if (isNaN(limit) || limit < 1) {
    throw new Error('--limit must be a positive integer');
  }

  const args = buildLogArgs({ ...options, limit });
  const output = await runGit(args, cfg.repoPath);

  if (!output || output.trim() === '') {
    console.log('No commits yet.');
    return;
  }

  console.log(output);
}

function buildLogArgs({ limit, oneline = false, file } = {}) {
  const args = ['log', `-${limit}`];

  if (oneline) {
    args.push('--oneline');
  } else {
    args.push('--pretty=format:%C(yellow)%h%Creset %s %C(dim)(%cr) <%an>%Creset');
  }

  if (file) {
    args.push('--', file);
  }

  return args;
}

export default logCommand;
