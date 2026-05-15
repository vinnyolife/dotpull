import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args for git diff --check (whitespace/conflict marker linting)
 */
export function buildLintArgs(options = {}) {
  const args = ['diff', '--check'];

  if (options.cached) {
    args.push('--cached');
  }

  if (options.commit) {
    args.push(options.commit);
  }

  return args;
}

/**
 * Run lint checks on the dotfiles repo:
 *  1. whitespace errors via `git diff --check`
 *  2. conflict markers check
 */
export async function lintCommand(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!repoPath) {
    throw new Error('No dotfiles repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const results = { whitespace: null, conflicts: null, passed: true };

  // Check for whitespace errors
  try {
    const wsArgs = buildLintArgs({ cached: options.cached, commit: options.commit });
    results.whitespace = await runGit(wsArgs, repoPath);
  } catch (err) {
    results.whitespace = err.message;
    results.passed = false;
  }

  // Check for conflict markers in tracked files
  try {
    const conflictArgs = ['grep', '-l', '--extended-regexp', '^(<{7}|={7}|>{7}) '];
    results.conflicts = await runGit(conflictArgs, repoPath);
    if (results.conflicts && results.conflicts.trim().length > 0) {
      results.passed = false;
    }
  } catch (err) {
    // git grep exits non-zero when no matches found — that's good
    results.conflicts = '';
  }

  return results;
}
