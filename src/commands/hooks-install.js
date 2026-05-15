import { loadConfig } from '../config.js';
import path from 'path';
import fs from 'fs';

const DEFAULT_HOOKS = {
  'post-merge': '#!/bin/sh\n# dotpull: auto-pull after git merge\ndotpull pull --quiet\n',
  'pre-push': '#!/bin/sh\n# dotpull: validate before push\ndotpull status --short\n',
};

export async function installHooks(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!repoPath) {
    throw new Error('No dotpull repo configured. Run `dotpull init` or `dotpull clone` first.');
  }

  const hooksDir = path.join(repoPath, '.git', 'hooks');

  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  const hooksToInstall = options.hooks
    ? Object.fromEntries(Object.entries(DEFAULT_HOOKS).filter(([k]) => options.hooks.includes(k)))
    : DEFAULT_HOOKS;

  const installed = [];
  const skipped = [];

  for (const [name, content] of Object.entries(hooksToInstall)) {
    const hookPath = path.join(hooksDir, name);

    if (fs.existsSync(hookPath) && !options.force) {
      skipped.push(name);
      continue;
    }

    fs.writeFileSync(hookPath, content, { mode: 0o755 });
    installed.push(name);
  }

  if (installed.length > 0) {
    console.log(`Installed hooks: ${installed.join(', ')}`);
  }

  if (skipped.length > 0) {
    console.log(`Skipped (already exist): ${skipped.join(', ')} — use --force to overwrite`);
  }

  if (installed.length === 0 && skipped.length === 0) {
    console.log('No hooks to install.');
  }
}

export async function uninstallHooks(options = {}) {
  const config = await loadConfig();
  const repoPath = config.repoPath;

  if (!repoPath) {
    throw new Error('No dotpull repo configured.');
  }

  const hooksDir = path.join(repoPath, '.git', 'hooks');
  const hookNames = options.hooks || Object.keys(DEFAULT_HOOKS);
  const removed = [];

  for (const name of hookNames) {
    const hookPath = path.join(hooksDir, name);
    if (fs.existsSync(hookPath)) {
      fs.unlinkSync(hookPath);
      removed.push(name);
    }
  }

  if (removed.length > 0) {
    console.log(`Removed hooks: ${removed.join(', ')}`);
  } else {
    console.log('No dotpull-managed hooks found to remove.');
  }
}
