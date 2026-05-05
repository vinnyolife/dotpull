const { execSync, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

function runGit(args, cwd) {
  return execSync(`git ${args}`, { cwd, stdio: 'pipe' }).toString().trim();
}

function isGitRepo(dir) {
  try {
    runGit('rev-parse --is-inside-work-tree', dir);
    return true;
  } catch {
    return false;
  }
}

function initRepo(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (isGitRepo(dir)) {
    throw new Error(`Directory ${dir} is already a git repository`);
  }
  runGit('init', dir);
  return true;
}

function cloneRepo(remoteUrl, targetDir) {
  if (fs.existsSync(targetDir)) {
    throw new Error(`Target directory ${targetDir} already exists`);
  }
  execSync(`git clone ${remoteUrl} ${targetDir}`, { stdio: 'pipe' });
  return true;
}

function addRemote(dir, name, url) {
  runGit(`remote add ${name} ${url}`, dir);
}

function getRemotes(dir) {
  try {
    const output = runGit('remote -v', dir);
    if (!output) return [];
    return output.split('\n').map(line => {
      const [name, rest] = line.split('\t');
      const [url] = rest.split(' ');
      return { name, url };
    }).filter((r, i, arr) => arr.findIndex(x => x.name === r.name) === i);
  } catch {
    return [];
  }
}

function hasCommits(dir) {
  try {
    runGit('rev-parse HEAD', dir);
    return true;
  } catch {
    return false;
  }
}

module.exports = { isGitRepo, initRepo, cloneRepo, addRemote, getRemotes, hasCommits, runGit };
