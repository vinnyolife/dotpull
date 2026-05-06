import { runGit, isGitRepo } from '../git.js';
import { loadConfig } from '../config.js';

export function buildRemoteArgs(options) {
  const args = ['remote'];

  if (options.verbose) {
    args.push('-v');
  }

  if (options.add) {
    args.push('add', options.add.name, options.add.url);
    return args;
  }

  if (options.remove) {
    args.push('remove', options.remove);
    return args;
  }

  if (options.rename) {
    args.push('rename', options.rename.old, options.rename.new);
    return args;
  }

  if (options.setUrl) {
    args.push('set-url', options.setUrl.name, options.setUrl.url);
    return args;
  }

  if (options.getUrl) {
    args.push('get-url', options.getUrl);
    return args;
  }

  return args;
}

export async function remoteCommand(options) {
  const config = await loadConfig();

  if (!config.repoPath) {
    throw new Error('No dotfiles repo found. Run `dotpull init` or `dotpull clone` first.');
  }

  if (!(await isGitRepo(config.repoPath))) {
    throw new Error(`Path ${config.repoPath} is not a git repository.`);
  }

  const args = buildRemoteArgs(options);
  const result = await runGit(args, config.repoPath);

  if (options.add) {
    console.log(`Added remote '${options.add.name}' -> ${options.add.url}`);
  } else if (options.remove) {
    console.log(`Removed remote '${options.remove}'.`);
  } else if (options.rename) {
    console.log(`Renamed remote '${options.rename.old}' to '${options.rename.new}'.`);
  } else if (options.setUrl) {
    console.log(`Updated URL for remote '${options.setUrl.name}'.`);
  } else if (result.trim()) {
    console.log(result.trim());
  } else {
    console.log('No remotes configured.');
  }
}
