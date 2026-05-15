import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  buildAliasesArgs,
  listAliases,
  setAlias,
  removeAlias,
  resolveAlias,
} from './aliases.js';

vi.mock('../config.js', () => ({
  loadConfig: vi.fn(),
  saveConfig: vi.fn(),
}));

import { loadConfig, saveConfig } from '../config.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('buildAliasesArgs', () => {
  it('returns empty array by default', () => {
    expect(buildAliasesArgs()).toEqual([]);
  });

  it('includes --list flag when list option is set', () => {
    expect(buildAliasesArgs({ list: true })).toContain('--list');
  });

  it('includes name and value when provided', () => {
    const args = buildAliasesArgs({ name: 'foo', value: 'log' });
    expect(args).toContain('foo');
    expect(args).toContain('log');
  });
});

describe('listAliases', () => {
  it('returns builtin aliases merged with user aliases', async () => {
    loadConfig.mockResolvedValue({ aliases: { mylog: 'log --oneline' } });
    const result = await listAliases();
    expect(result.st).toBe('status');
    expect(result.mylog).toBe('log --oneline');
  });

  it('returns only builtins when no user aliases configured', async () => {
    loadConfig.mockResolvedValue({});
    const result = await listAliases();
    expect(result.co).toBe('checkout');
  });
});

describe('setAlias', () => {
  it('saves a new alias to config', async () => {
    loadConfig.mockResolvedValue({ aliases: {} });
    saveConfig.mockResolvedValue();
    await setAlias('myalias', 'log --oneline');
    expect(saveConfig).toHaveBeenCalledWith(
      expect.objectContaining({ aliases: { myalias: 'log --oneline' } })
    );
  });

  it('throws on invalid alias name', async () => {
    await expect(setAlias('Bad Name', 'log')).rejects.toThrow('Invalid alias name');
  });

  it('throws when name or value is missing', async () => {
    await expect(setAlias('foo', '')).rejects.toThrow('required');
  });
});

describe('removeAlias', () => {
  it('removes an existing alias', async () => {
    loadConfig.mockResolvedValue({ aliases: { foo: 'log' } });
    saveConfig.mockResolvedValue();
    await removeAlias('foo');
    expect(saveConfig).toHaveBeenCalledWith({ aliases: {} });
  });

  it('throws when alias does not exist', async () => {
    loadConfig.mockResolvedValue({ aliases: {} });
    await expect(removeAlias('nonexistent')).rejects.toThrow('not found');
  });
});

describe('resolveAlias', () => {
  it('resolves a known alias', async () => {
    loadConfig.mockResolvedValue({ aliases: { mylog: 'log --graph' } });
    expect(await resolveAlias('mylog')).toBe('log --graph');
  });

  it('returns null for unknown alias', async () => {
    loadConfig.mockResolvedValue({});
    expect(await resolveAlias('unknown')).toBeNull();
  });
});
