import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildSwitchListArgs(options = {}) {
  const args = ['branch'];

  if (options.all) {
    args.push('-a');
  } else if (options.remotes) {
    args.push('-r');
  }

  if (options.verbose) {
    args.push('-vv');
  }

  if (options.merged) {
    args.push('--merged', options.merged);
  }

  if (options.noMerged) {
    args.push('--no-merged', options.noMerged);
  }

  return args;
}

export async function switchListCommand(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;
  const args = buildSwitchListArgs(options);
  const output = await runGit(args, repoPath);

  const lines = output.trim().split('\n').filter(Boolean);
  return lines.map(line => {
    const current = line.startsWith('*');
    const name = line.replace(/^[* ] /, '').trim().split(/\s+/)[0];
    return { name, current };
  });
}
