import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildFetchArgs(options = {}) {
  const args = ['fetch'];

  if (options.remote) {
    args.push(options.remote);
  }

  if (options.branch) {
    args.push(options.branch);
  }

  if (options.all) {
    args.push('--all');
  }

  if (options.prune) {
    args.push('--prune');
  }

  if (options.pruneTags) {
    args.push('--prune-tags');
  }

  if (options.tags) {
    args.push('--tags');
  }

  if (options.depth) {
    args.push(`--depth=${options.depth}`);
  }

  if (options.dryRun) {
    args.push('--dry-run');
  }

  if (options.verbose) {
    args.push('--verbose');
  }

  return args;
}

export async function fetchCommand(options = {}) {
  const config = await loadConfig();

  if (!config.repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildFetchArgs(options);

  try {
    const output = await runGit(args, config.repoPath);
    console.log(output || 'Fetch complete.');
  } catch (err) {
    throw new Error(`Fetch failed: ${err.message}`);
  }
}
