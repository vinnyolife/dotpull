import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildShowArgs(options = {}) {
  const args = ['show'];

  if (options.object) {
    args.push(options.object);
  }

  if (options.stat) {
    args.push('--stat');
  }

  if (options.namOnly) {
    args.push('--name-only');
  }

  if (options.nameStatus) {
    args.push('--name-status');
  }

  if (options.format) {
    args.push(`--format=${options.format}`);
  }

  if (options.noColor) {
    args.push('--no-color');
  }

  if (options.unified !== undefined) {
    args.push(`--unified=${options.unified}`);
  }

  if (Array.isArray(options.paths) && options.paths.length > 0) {
    args.push('--');
    args.push(...options.paths);
  }

  return args;
}

export async function showCommand(options = {}) {
  const config = await loadConfig();
  if (!config.repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildShowArgs(options);
  const output = await runGit(args, config.repoPath);

  if (output.trim()) {
    console.log(output.trim());
  } else {
    console.log('Nothing to show.');
  }
}
