import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

export function buildBlameArgs(file, options = {}) {
  const args = ['blame'];

  if (options.line) {
    args.push('-L', options.line);
  }

  if (options.showEmail) {
    args.push('-e');
  }

  if (options.showTimestamp) {
    args.push('-t');
  }

  if (options.ignoreWhitespace) {
    args.push('-w');
  }

  if (options.porcelain) {
    args.push('--porcelain');
  }

  if (options.commit) {
    args.push(options.commit);
    args.push('--');
  }

  if (!file) {
    throw new Error('A file path is required for blame');
  }

  args.push(file);

  return args;
}

export async function blame(file, options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildBlameArgs(file, options);
  const output = await runGit(args, repoPath);
  console.log(output);
}
