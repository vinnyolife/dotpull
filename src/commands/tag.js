import { runGit, isGitRepo } from '../git.js';
import { loadConfig } from '../config.js';

export function buildTagArgs(options) {
  const args = ['tag'];

  if (options.delete) {
    args.push('-d', options.delete);
    return args;
  }

  if (options.list) {
    args.push('-l');
    if (typeof options.list === 'string') {
      args.push(options.list);
    }
    return args;
  }

  if (options.name) {
    if (options.annotate) {
      args.push('-a', options.name);
      if (options.message) {
        args.push('-m', options.message);
      }
    } else {
      args.push(options.name);
    }

    if (options.commit) {
      args.push(options.commit);
    }
  }

  return args;
}

export async function tagCommand(options) {
  const config = await loadConfig();

  if (!config.repoPath) {
    throw new Error('No dotfiles repo found. Run `dotpull init` or `dotpull clone` first.');
  }

  if (!(await isGitRepo(config.repoPath))) {
    throw new Error(`Path ${config.repoPath} is not a git repository.`);
  }

  const args = buildTagArgs(options);
  const result = await runGit(args, config.repoPath);

  if (options.delete) {
    console.log(`Deleted tag '${options.delete}'.`);
  } else if (options.list || args.length === 1) {
    if (result.trim()) {
      console.log(result.trim());
    } else {
      console.log('No tags found.');
    }
  } else if (options.name) {
    console.log(`Created tag '${options.name}'.`);
  }
}
