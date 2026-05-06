import { runGit, isGitRepo } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Builds the git log argument list from CLI options.
 * @param {object} opts
 * @returns {string[]}
 */
export function buildLogArgs(opts = {}) {
  const args = ['log', '--oneline'];

  if (opts.graph) {
    args.push('--graph');
  }

  if (opts.all) {
    args.push('--all');
  }

  if (opts.stat) {
    args.push('--stat');
  }

  if (opts.limit != null) {
    args.push(`--max-count=${opts.limit}`);
  }

  if (opts.file) {
    args.push('--');
    args.push(opts.file);
  }

  return args;
}

/**
 * Runs git log in the configured dotfiles repo.
 * @param {object} opts - CLI options passed from the log command handler
 */
export default async function log(opts = {}) {
  const config = loadConfig();
  const { repoPath } = config;

  const isRepo = await isGitRepo(repoPath);
  if (!isRepo) {
    throw new Error(
      `No git repository found at ${repoPath}. Run 'dotpull init' or 'dotpull clone' first.`
    );
  }

  const args = buildLogArgs(opts);

  try {
    const output = await runGit(repoPath, args);
    if (output && output.trim()) {
      console.log(output.trim());
    } else {
      console.log('No commits found.');
    }
  } catch (err) {
    throw new Error(`Failed to retrieve log: ${err.message}`);
  }
}
