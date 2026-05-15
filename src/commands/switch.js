import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildSwitchArgs(options = {}) {
  const args = ['switch'];

  if (options.create) {
    args.push('-c', options.create);
  } else if (options.forcCreate) {
    args.push('-C', options.forcCreate);
  }

  if (options.detach) {
    args.push('--detach');
  }

  if (options.orphan) {
    args.push('--orphan', options.orphan);
    return args;
  }

  if (options.discard) {
    args.push('--discard-changes');
  }

  if (options.guess === false) {
    args.push('--no-guess');
  }

  if (options.track) {
    args.push('--track', options.track);
  }

  if (options.branch) {
    args.push(options.branch);
  }

  return args;
}

export async function switchCommand(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!options.branch && !options.orphan && !options.create && !options.forcCreate) {
    throw new Error('Branch name is required');
  }

  const args = buildSwitchArgs(options);
  const result = await runGit(args, repoPath);
  return result;
}
