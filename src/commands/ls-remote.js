import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildLsRemoteArgs(options = {}) {
  const args = ['ls-remote'];

  if (options.heads) args.push('--heads');
  if (options.tags) args.push('--tags');
  if (options.refs) args.push('--refs');
  if (options.quiet) args.push('--quiet');
  if (options.exitCode) args.push('--exit-code');
  if (options.getUrl) args.push('--get-url');
  if (options.symref) args.push('--symref');

  if (options.uploadPack) {
    args.push('--upload-pack', options.uploadPack);
  }

  if (options.remote) {
    args.push(options.remote);
  }

  if (options.patterns && options.patterns.length > 0) {
    args.push(...options.patterns);
  }

  return args;
}

export async function lsRemote(options = {}) {
  const config = await loadConfig();

  if (!config.repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildLsRemoteArgs(options);
  const output = await runGit(args, config.repoPath);
  return output.trim();
}
