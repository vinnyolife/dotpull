import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args array for git format-patch
 */
export function buildFormatPatchArgs(options = {}) {
  const args = ['format-patch'];

  if (options.numbered) args.push('-n');
  if (options.stdout) args.push('--stdout');
  if (options.cover) args.push('--cover-letter');
  if (options.outputDir) args.push('--output-directory', options.outputDir);
  if (options.subject) args.push('--subject-prefix', options.subject);
  if (options.from) args.push(`--from=${options.from}`);
  if (options.signoff) args.push('--signoff');
  if (options.noStat) args.push('--no-stat');
  if (options.binary) args.push('--binary');

  if (options.count) {
    args.push(`-${options.count}`);
  } else if (options.range) {
    args.push(options.range);
  } else {
    args.push('HEAD');
  }

  return args;
}

/**
 * Run the format-patch command in the dotfiles repo
 */
export async function formatPatch(options = {}) {
  const config = await loadConfig();
  if (!config.repoPath) {
    throw new Error('No dotfiles repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const args = buildFormatPatchArgs(options);
  const output = await runGit(args, config.repoPath);

  if (output.trim()) {
    console.log(output.trim());
  } else {
    console.log('No patches generated.');
  }

  return output;
}

export default formatPatch;
