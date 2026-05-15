import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args for `git interpret-trailers`
 * Trailers are key: value lines appended to commit messages (e.g. Signed-off-by, Co-authored-by)
 */
export function buildTrailersArgs(options = {}) {
  const args = ['interpret-trailers'];

  if (options.trailer) {
    const trailers = Array.isArray(options.trailer) ? options.trailer : [options.trailer];
    for (const t of trailers) {
      args.push('--trailer', t);
    }
  }

  if (options.trim) {
    args.push('--trim-empty');
  }

  if (options.unfold) {
    args.push('--unfold');
  }

  if (options.only) {
    args.push('--only-trailers');
  }

  if (options.parse) {
    args.push('--parse');
  }

  if (options.file) {
    args.push(options.file);
  }

  return args;
}

export async function trailers(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildTrailersArgs(options);
  const output = await runGit(args, repoPath);
  return output;
}
