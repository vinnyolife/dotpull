import path from 'path';
import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

export function buildMvArgs(source, destination, opts = {}) {
  const args = ['mv'];

  if (opts.force) args.push('-f');
  if (opts.dryRun) args.push('-n');
  if (opts.verbose) args.push('-v');
  if (opts.skipErrors) args.push('-k');

  if (!source) throw new Error('Source path is required');
  if (!destination) throw new Error('Destination path is required');

  args.push(source);
  args.push(destination);

  return args;
}

export async function mvCommand(source, destination, opts = {}) {
  const config = await loadConfig();
  if (!config.repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildMvArgs(source, destination, opts);
  const result = await runGit(args, config.repoPath);

  if (opts.verbose || opts.dryRun) {
    console.log(result.stdout || `Renamed '${source}' to '${destination}'`);
  } else {
    console.log(`Moved: ${path.basename(source)} → ${path.basename(destination)}`);
  }

  return result;
}
