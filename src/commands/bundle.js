import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildBundleArgs(options) {
  const args = ['bundle'];

  if (options.subcommand === 'create') {
    args.push('create');
    if (!options.file) throw new Error('bundle create requires a file path');
    args.push(options.file);
    if (options.all) args.push('--all');
    if (options.branch) args.push(options.branch);
    if (options.tag) args.push(options.tag);
    if (options.since) args.push(`--since=${options.since}`);
  } else if (options.subcommand === 'verify') {
    args.push('verify');
    if (!options.file) throw new Error('bundle verify requires a file path');
    args.push(options.file);
    if (options.quiet) args.push('--quiet');
  } else if (options.subcommand === 'list-heads') {
    args.push('list-heads');
    if (!options.file) throw new Error('bundle list-heads requires a file path');
    args.push(options.file);
  } else if (options.subcommand === 'unbundle') {
    args.push('unbundle');
    if (!options.file) throw new Error('bundle unbundle requires a file path');
    args.push(options.file);
  } else {
    throw new Error(`unknown bundle subcommand: ${options.subcommand}`);
  }

  return args;
}

export async function bundleCommand(options) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  const args = buildBundleArgs(options);
  const output = await runGit(args, repoPath);

  if (output && output.trim()) {
    console.log(output.trim());
  }
}
