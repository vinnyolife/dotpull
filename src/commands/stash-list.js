import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

export function buildStashListArgs(opts = {}) {
  const args = ['stash', 'list'];

  if (opts.format) {
    args.push(`--format=${opts.format}`);
  }

  if (opts.limit) {
    args.push(`-${parseInt(opts.limit, 10)}`);
  }

  return args;
}

export default async function stashList(opts = {}) {
  const config = await loadConfig();
  const args = buildStashListArgs(opts);
  const output = await runGit(config.repoPath, args);

  if (!output || !output.trim()) {
    console.log('No stashes found.');
    return;
  }

  console.log(output.trimEnd());
}
