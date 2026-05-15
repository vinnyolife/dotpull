import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Convenience wrapper: atomically replace sparse patterns and reapply.
 * Equivalent to: sparse set <patterns> && sparse reapply
 */
export function buildSparseSetArgs(patterns = [], options = {}) {
  if (!patterns || patterns.length === 0) {
    throw new Error('At least one pattern is required for sparse-set');
  }

  const args = ['sparse-checkout', 'set'];

  if (options.cone) args.push('--cone');
  if (options.noone) args.push('--no-cone');

  args.push(...patterns);
  return args;
}

export async function sparseSet(patterns = [], options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  const args = buildSparseSetArgs(patterns, options);
  await runGit(args, repoPath);

  if (options.reapply !== false) {
    await runGit(['sparse-checkout', 'reapply'], repoPath);
  }
}
