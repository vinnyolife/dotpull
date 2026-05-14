import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

export function buildLsFilesArgs(options = {}) {
  const args = ['ls-files'];

  if (options.others) args.push('--others');
  if (options.ignored) args.push('--ignored');
  if (options.cached) args.push('--cached');
  if (options.deleted) args.push('--deleted');
  if (options.modified) args.push('--modified');
  if (options.unmerged) args.push('--unmerged');
  if (options.killed) args.push('--killed');
  if (options.excludeStandard) args.push('--exclude-standard');
  if (options.stage) args.push('--stage');
  if (options.deduplicate) args.push('--deduplicate');
  if (options.eol) args.push('--eol');

  if (options.excludePattern) {
    args.push('--exclude', options.excludePattern);
  }

  if (options.withTree) {
    args.push('--with-tree', options.withTree);
  }

  if (Array.isArray(options.paths) && options.paths.length > 0) {
    args.push('--', ...options.paths);
  } else if (typeof options.paths === 'string' && options.paths) {
    args.push('--', options.paths);
  }

  return args;
}

export async function lsFiles(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  const args = buildLsFilesArgs(options);
  const output = await runGit(args, repoPath);

  return output.trim();
}
