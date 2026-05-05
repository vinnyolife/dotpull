import os from 'os';
import path from 'path';
import fs from 'fs';

const CONFIG_DIR = path.join(os.homedir(), '.dotpull');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const DEFAULTS = {
  repoUrl: null,
  branch: 'main',
  localDir: path.join(os.homedir(), '.dotfiles'),
  autoSync: false,
  lastSync: null,
};

export function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function loadConfig() {
  ensureConfigDir();
  if (!fs.existsSync(CONFIG_FILE)) {
    return { ...DEFAULTS };
  }
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch (err) {
    throw new Error(`Failed to parse config file: ${err.message}`);
  }
}

export function saveConfig(config) {
  ensureConfigDir();
  const merged = { ...loadConfig(), ...config };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2), 'utf-8');
  return merged;
}

export function getConfigPath() {
  return CONFIG_FILE;
}

export { CONFIG_DIR, CONFIG_FILE, DEFAULTS };
