import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildSparseArgs(options = {}) {
  const args = ['sparse-checkout'];

  if (options.init) {
    args.push('init');
    if (options.cone) args.push('--cone');
    if (options.nocone) args.push('--no-cone');
    return args;
  }

  if (options.list) {
    args.push('list');
    return args;
  }

  if (options.set && options.patterns && options.patterns.length > 0) {
    args.push('set');
    if (options.stdin) {
      args.push('--stdin');
    } else {
      args.push(...options.patterns);
    }
    return args;
  }

  if (options.add && options.patterns && options.patterns.length > 0) {
    args.push('add', ...options.patterns);
    return args;
  }

  if (options.reapply) {
    args.push('reapply');
    return args;
  }

  if (options.disable) {
    args.push('disable');
    return args;
  }

  args.push('list');
  return args;
}

export async function sparse(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;
  const args = buildSparseArgs(options);
  const result = await runGit(args, repoPath);
  return result;
}
