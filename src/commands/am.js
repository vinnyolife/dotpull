import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * git am — apply a series of patches from a mailbox
 */
export function buildAmArgs(options = {}) {
  const args = ['am'];

  if (options.signoff) args.push('--signoff');
  if (options.keep) args.push('--keep');
  if (options.keepCr) args.push('--keep-cr');
  if (options.noKeepCr) args.push('--no-keep-cr');
  if (options.scissors) args.push('--scissors');
  if (options.noScissors) args.push('--no-scissors');
  if (options.resolved) args.push('--resolved');
  if (options.skip) args.push('--skip');
  if (options.abort) args.push('--abort');
  if (options.quit) args.push('--quit');
  if (options.showCurrentPatch) args.push('--show-current-patch');
  if (options.messageid) args.push('--message-id');
  if (options.whitespace) args.push(`--whitespace=${options.whitespace}`);
  if (options.patchFormat) args.push(`--patch-format=${options.patchFormat}`);

  if (options.mboxFile) args.push(options.mboxFile);

  return args;
}

export async function am(options = {}) {
  const config = await loadConfig();
  if (!config.repoPath) {
    throw new Error('No dotpull repo found. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildAmArgs(options);
  const output = await runGit(args, config.repoPath);
  return output;
}
