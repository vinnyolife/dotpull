import { runGit } from '../git.js';
import { loadConfig } from '../config.js';
import path from 'path';
import fs from 'fs';

export function buildHooksArgs(options = {}) {
  const args = ['hooks'];

  if (options.list) {
    args.push('list');
    return args;
  }

  if (options.enable) {
    args.push('enable', options.enable);
    return args;
  }

  if (options.disable) {
    args.push('disable', options.disable);
    return args;
  }

  if (options.show) {
    args.push('show', options.show);
    return args;
  }

  return args;
}

export async function hooksCommand(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const hooksDir = path.join(repoPath, '.git', 'hooks');

  if (options.list) {
    if (!fs.existsSync(hooksDir)) {
      console.log('No hooks directory found.');
      return;
    }
    const hooks = fs.readdirSync(hooksDir).filter(f => !f.endsWith('.sample'));
    if (hooks.length === 0) {
      console.log('No active hooks installed.');
    } else {
      hooks.forEach(h => console.log(h));
    }
    return;
  }

  if (options.show) {
    const hookFile = path.join(hooksDir, options.show);
    if (!fs.existsSync(hookFile)) {
      throw new Error(`Hook '${options.show}' not found.`);
    }
    console.log(fs.readFileSync(hookFile, 'utf8'));
    return;
  }

  if (options.enable || options.disable) {
    const hookName = options.enable || options.disable;
    const hookFile = path.join(hooksDir, hookName);
    const disabledFile = hookFile + '.disabled';

    if (options.enable) {
      if (!fs.existsSync(disabledFile)) {
        throw new Error(`Disabled hook '${hookName}' not found.`);
      }
      fs.renameSync(disabledFile, hookFile);
      fs.chmodSync(hookFile, 0o755);
      console.log(`Hook '${hookName}' enabled.`);
    } else {
      if (!fs.existsSync(hookFile)) {
        throw new Error(`Hook '${hookName}' not found.`);
      }
      fs.renameSync(hookFile, disabledFile);
      console.log(`Hook '${hookName}' disabled.`);
    }
    return;
  }

  console.log('Usage: dotpull hooks [--list] [--show <hook>] [--enable <hook>] [--disable <hook>]');
}
