import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

export function buildCherryPickArgs(options) {
  const args = ['cherry-pick'];

  if (options.noCommit) {
    args.push('--no-commit');
  }

  if (options.edit) {
    args.push('--edit');
  }

  if (options.signoff) {
    args.push('--signoff');
  }

  if (options.mainline) {
    args.push('--mainline', String(options.mainline));
  }

  if (options.continue) {
    args.push('--continue');
    return args;
  }

  if (options.abort) {
    args.push('--abort');
    return args;
  }

  if (options.skip) {
    args.push('--skip');
    return args;
  }

  if (options.commits && options.commits.length > 0) {
    args.push(...options.commits);
  }

  return args;
}

export async function cherryPick(options = {}) {
  const config = await loadConfig();
  if (!config.repoPath) {
    throw new Error('No dotpull repo found. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildCherryPickArgs(options);
  const result = await runGit(args, config.repoPath);
  console.log(result || 'Cherry-pick complete.');
}
