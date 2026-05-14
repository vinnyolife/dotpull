import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildRevParseArgs(options = {}) {
  const args = ['rev-parse'];

  if (options.abbrevRef) {
    args.push('--abbrev-ref');
  }

  if (options.short) {
    const len = typeof options.short === 'number' ? `--short=${options.short}` : '--short';
    args.push(len);
  }

  if (options.verify) {
    args.push('--verify');
  }

  if (options.symbolic) {
    args.push('--symbolic');
  }

  if (options.symbolicFullName) {
    args.push('--symbolic-full-name');
  }

  if (options.showToplevel) {
    args.push('--show-toplevel');
  }

  if (options.gitDir) {
    args.push('--git-dir');
  }

  if (options.isBareRepository) {
    args.push('--is-bare-repository');
  }

  if (options.isInsideWorkTree) {
    args.push('--is-inside-work-tree');
  }

  if (options.ref) {
    const refs = Array.isArray(options.ref) ? options.ref : [options.ref];
    args.push(...refs);
  }

  return args;
}

export async function revParse(options = {}) {
  const config = await loadConfig();
  const args = buildRevParseArgs(options);
  const output = await runGit(args, config.repoPath);
  return output.trim();
}
