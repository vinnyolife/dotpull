import { runGit, isGitRepo } from '../git.js';
import { loadConfig } from '../config.js';

export function buildResetArgs(options) {
  const args = ['reset'];

  if (options.hard) {
    args.push('--hard');
  } else if (options.soft) {
    args.push('--soft');
  } else if (options.mixed) {
    args.push('--mixed');
  }

  if (options.commit) {
    args.push(options.commit);
  }

  if (options.files && options.files.length > 0) {
    args.push('--', ...options.files);
  }

  return args;
}

export async function resetCommand(options) {
  const config = await loadConfig();

  if (!config.repoPath) {
    throw new Error('No dotfiles repo found. Run `dotpull init` or `dotpull clone` first.');
  }

  if (!(await isGitRepo(config.repoPath))) {
    throw new Error(`Path ${config.repoPath} is not a git repository.`);
  }

  if (options.hard && !options.confirm) {
    throw new Error('Hard reset is destructive. Pass --confirm to proceed.');
  }

  const args = buildResetArgs(options);
  const result = await runGit(args, config.repoPath);

  if (options.files && options.files.length > 0) {
    console.log(`Unstaged ${options.files.length} file(s).`);
  } else if (options.hard) {
    console.log(`Hard reset to ${options.commit || 'HEAD'}.`);
  } else if (options.soft) {
    console.log(`Soft reset to ${options.commit || 'HEAD'}.`);
  } else {
    console.log(`Reset to ${options.commit || 'HEAD'}.`);
    if (result.trim()) console.log(result.trim());
  }
}
