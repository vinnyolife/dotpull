import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildNotesArgs(options) {
  const args = ['notes'];

  if (options.add) {
    args.push('add');
    if (options.force) args.push('-f');
    if (options.message) args.push('-m', options.message);
    if (options.ref) args.push('--ref', options.ref);
    if (options.commit) args.push(options.commit);
    return args;
  }

  if (options.show) {
    args.push('show');
    if (options.ref) args.push('--ref', options.ref);
    if (options.commit) args.push(options.commit);
    return args;
  }

  if (options.remove) {
    args.push('remove');
    if (options.ref) args.push('--ref', options.ref);
    if (options.commit) args.push(options.commit);
    return args;
  }

  if (options.list) {
    args.push('list');
    if (options.commit) args.push(options.commit);
    return args;
  }

  if (options.edit) {
    args.push('edit');
    if (options.ref) args.push('--ref', options.ref);
    if (options.commit) args.push(options.commit);
    return args;
  }

  if (options.copy) {
    args.push('copy');
    if (options.force) args.push('-f');
    if (options.from) args.push(options.from);
    if (options.to) args.push(options.to);
    return args;
  }

  // default: list all notes
  args.push('list');
  return args;
}

export async function notesCommand(options) {
  const config = await loadConfig();
  const repoPath = config.repoPath;
  const args = buildNotesArgs(options);
  const result = await runGit(args, repoPath);
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
}
