import { loadConfig, saveConfig, getConfigPath } from '../config.js';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export async function initCommand(options = {}) {
  const config = loadConfig();

  if (config.repoUrl && !options.force) {
    console.log(`dotpull is already initialized with repo: ${config.repoUrl}`);
    console.log('Use --force to reinitialize.');
    return;
  }

  const repoUrl = options.repoUrl;
  if (!repoUrl) {
    throw new Error('A Git repository URL is required. Use --repo <url>');
  }

  const localDir = options.localDir || config.localDir;
  const branch = options.branch || config.branch;

  console.log(`Initializing dotpull...`);
  console.log(`  Repo   : ${repoUrl}`);
  console.log(`  Dir    : ${localDir}`);
  console.log(`  Branch : ${branch}`);

  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
    console.log(`Created local dotfiles directory: ${localDir}`);
  }

  const isGitRepo = fs.existsSync(path.join(localDir, '.git'));
  if (!isGitRepo) {
    execSync(`git clone --branch ${branch} ${repoUrl} ${localDir}`, {
      stdio: 'inherit',
    });
    console.log('Repository cloned successfully.');
  } else {
    console.log('Git repo already exists at local dir, skipping clone.');
  }

  const saved = saveConfig({ repoUrl, localDir, branch, lastSync: new Date().toISOString() });
  console.log(`\nConfiguration saved to: ${getConfigPath()}`);
  console.log('dotpull initialized! Run `dotpull sync` to pull latest dotfiles.');
  return saved;
}
