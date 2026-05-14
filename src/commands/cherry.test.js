import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildCherryArgs, cherryCommand } from './cherry.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn(),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn(),
}));

import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

describe('buildCherryArgs', () => {
  it('returns base cherry command with no options', () => {
    expect(buildCherryArgs()).toEqual(['cherry']);
  });

  it('adds -v flag when verbose is true', () => {
    expect(buildCherryArgs({ verbose: true })).toEqual(['cherry', '-v']);
  });

  it('adds --abbrev flag when abbrev is true', () => {
    expect(buildCherryArgs({ abbrev: true })).toEqual(['cherry', '--abbrev']);
  });

  it('adds upstream when provided', () => {
    expect(buildCherryArgs({ upstream: 'main' })).toEqual(['cherry', 'main']);
  });

  it('adds verbose and upstream together', () => {
    expect(buildCherryArgs({ verbose: true, upstream: 'main' })).toEqual(['cherry', '-v', 'main']);
  });

  it('adds head after upstream when both provided', () => {
    expect(buildCherryArgs({ upstream: 'main', head: 'feature' })).toEqual(['cherry', 'main', 'feature']);
  });

  it('throws if head is set without upstream', () => {
    expect(() => buildCherryArgs({ head: 'feature' })).toThrow('--head requires --upstream');
  });

  it('throws if limit is set without upstream', () => {
    expect(() => buildCherryArgs({ limit: 'abc123' })).toThrow('--limit requires --upstream');
  });

  it('adds limit after upstream and head', () => {
    const args = buildCherryArgs({ upstream: 'main', head: 'feature', limit: 'abc123' });
    expect(args).toEqual(['cherry', 'main', 'feature', 'abc123']);
  });
});

describe('cherryCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws if no repoPath in config', async () => {
    loadConfig.mockResolvedValue({});
    await expect(cherryCommand()).rejects.toThrow('No dotpull repo configured');
  });

  it('calls runGit with correct args and repoPath', async () => {
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    runGit.mockResolvedValue('+ abc123 some commit');

    const result = await cherryCommand({ verbose: true, upstream: 'main' });

    expect(runGit).toHaveBeenCalledWith(['cherry', '-v', 'main'], '/home/user/.dotfiles');
    expect(result).toBe('+ abc123 some commit');
  });

  it('returns output from runGit', async () => {
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    runGit.mockResolvedValue('');

    const result = await cherryCommand();
    expect(result).toBe('');
  });
});
