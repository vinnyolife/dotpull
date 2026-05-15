import { loadConfig, saveConfig } from '../config.js';

const BUILTIN_ALIASES = {
  st: 'status',
  co: 'checkout',
  sw: 'switch',
  rb: 'rebase',
  cp: 'cherry-pick',
  lg: 'log',
  br: 'branch',
};

export function buildAliasesArgs(options = {}) {
  const args = [];
  if (options.list) args.push('--list');
  if (options.name) args.push(options.name);
  if (options.value) args.push(options.value);
  return args;
}

export async function listAliases() {
  const config = await loadConfig();
  const userAliases = config.aliases || {};
  return { ...BUILTIN_ALIASES, ...userAliases };
}

export async function setAlias(name, value) {
  if (!name || !value) {
    throw new Error('Both alias name and target command are required');
  }
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    throw new Error(`Invalid alias name: "${name}". Use lowercase letters, digits, and hyphens.`);
  }
  const config = await loadConfig();
  config.aliases = config.aliases || {};
  config.aliases[name] = value;
  await saveConfig(config);
  return config.aliases[name];
}

export async function removeAlias(name) {
  const config = await loadConfig();
  if (!config.aliases || !config.aliases[name]) {
    throw new Error(`Alias "${name}" not found`);
  }
  delete config.aliases[name];
  await saveConfig(config);
}

export async function resolveAlias(name) {
  const aliases = await listAliases();
  return aliases[name] || null;
}
