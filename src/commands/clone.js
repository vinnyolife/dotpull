const path = require('path');
const os = require('os');
const { cloneRepo, isGitRepo } = require('../git');
const { loadConfig, saveConfig } = require('../config');

const DEFAULT_DOTFILES_DIR = path.join(os.homedir(), '.dotfiles');

async function clone(remoteUrl, options = {}) {
  if (!remoteUrl || typeof remoteUrl !== 'string') {
    throw new Error('A remote URL is required');
  }

  const targetDir = options.dir || DEFAULT_DOTFILES_DIR;

  if (isGitRepo(targetDir)) {
    throw new Error(
      `${targetDir} already contains a git repo. Use 'dotpull pull' to sync instead.`
    );
  }

  console.log(`Cloning ${remoteUrl} into ${targetDir}...`);

  try {
    cloneRepo(remoteUrl, targetDir);
  } catch (err) {
    throw new Error(`Clone failed: ${err.message}`);
  }

  const config = loadConfig();
  config.dotfilesDir = targetDir;
  config.remote = remoteUrl;
  saveConfig(config);

  console.log(`Done! Dotfiles cloned to ${targetDir}`);
  console.log(`Remote saved as: ${remoteUrl}`);

  return { targetDir, remoteUrl };
}

module.exports = { clone, DEFAULT_DOTFILES_DIR };
