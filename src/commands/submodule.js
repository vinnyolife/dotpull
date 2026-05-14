import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

export function buildSubmoduleArgs(options) {
  const args = ['submodule'];

  if (options.init) {
    args.push('init');
    if (options.path) args.push(options.path);
    return args;
  }

  if (options.update) {
    args.push('update');
    if (options.init) args.push('--init');
    if (options.recursive) args.push('--recursive');
    if (options.remote) args.push('--remote');
    if (options.path) args.push(options.path);
    return args;
  }

  if (options.add) {
    args.push('add');
    if (options.branch) args.push('-b', options.branch);
    args.push(options.url);
    if (options.path) args.push(options.path);
    return args;
  }

  if (options.status) {
    args.push('status');
    if (options.recursive) args.push('--recursive');
    return args;
  }

  if (options.deinit) {
    args.push('deinit');
    if (options.force) args.push('--force');
    args.push(options.path);
    return args;
  }

  if (options.sync) {
    args.push('sync');
    if (options.recursive) args.push('--recursive');
    return args;
  }

  if (options.foreach) {
    args.push('foreach');
    if (options.recursive) args.push('--recursive');
    args.push(options.command);
    return args;
  }

  // default: list submodules
  args.push('status');
  return args;
}

export async function submoduleCommand(options) {
  const config = await loadConfig();
  const repoPath = config.repoPath;
  const args = buildSubmoduleArgs(options);
  const result = await runGit(args, repoPath);
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
}
