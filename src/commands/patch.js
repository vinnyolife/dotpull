import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildPatchArgs(options = {}) {
  const args = ['apply'];

  if (options.stat) args.push('--stat');
  if (options.check) args.push('--check');
  if (options.reverse) args.push('--reverse');
  if (options.index) args.push('--index');
  if (options.cached) args.push('--cached');
  if (options.reject) args.push('--reject');
  if (options.whitespace) args.push(`--whitespace=${options.whitespace}`);
  if (options.directory) args.push(`--directory=${options.directory}`);
  if (options.exclude) args.push(`--exclude=${options.exclude}`);
  if (options.include) args.push(`--include=${options.include}`);
  if (options.verbose) args.push('--verbose');

  if (options.patchFile) args.push(options.patchFile);

  return args;
}

export async function patch(options = {}) {
  const config = await loadConfig();
  if (!config.repoPath) {
    throw new Error('No dotpull repo found. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildPatchArgs(options);
  const output = await runGit(args, config.repoPath);
  return output;
}
