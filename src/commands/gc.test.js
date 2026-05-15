import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildGcArgs, gc } from './gc.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn().mockResolvedValue({ stdout: '', stderr: '' }),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn().mockResolvedValue({ repoPath: '/home/user/.dotfiles' }),
}));

import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

describe('buildGcArgs', () => {
  it('returns base gc args with no options', () => {
    expect(buildGcArgs()).toEqual(['gc']);
  });

  it('adds --aggressive flag', () => {
    expect(buildGcArgs({ aggressive: true })).toContain('--aggressive');
  });

  it('adds --auto flag', () => {
    expect(buildGcArgs({ auto: true })).toContain('--auto');
  });

  it('adds --prune=now when prune is true', () => {
    expect(buildGcArgs({ prune: true })).toContain('--prune=now');
  });

  it('adds custom prune date when pruneDate is provided', () => {
    expect(buildGcArgs({ pruneDate: '1.week.ago' })).toContain('--prune=1.week.ago');
  });

  it('pruneDate takes precedence over prune flag', () => {
    const args = buildGcArgs({ prune: true, pruneDate: '3.days.ago' });
    expect(args).toContain('--prune=3.days.ago');
    expect(args).not.toContain('--prune=now');
  });

  it('adds --quiet flag', () => {
    expect(buildGcArgs({ quiet: true })).toContain('--quiet');
  });

  it('adds --force flag', () => {
    expect(buildGcArgs({ force: true })).toContain('--force');
  });

  it('combines multiple flags', () => {
    const args = buildGcArgs({ aggressive: true, quiet: true });
    expect(args).toEqual(['gc', '--aggressive', '--quiet']);
  });
});

describe('gc', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
  });

  it('calls runGit with gc args and repoPath', async () => {
    await gc();
    expect(runGit).toHaveBeenCalledWith(['gc'], '/home/user/.dotfiles');
  });

  it('passes options through to buildGcArgs', async () => {
    await gc({ aggressive: true, prune: true });
    expect(runGit).toHaveBeenCalledWith(
      expect.arrayContaining(['gc', '--aggressive', '--prune=now']),
      '/home/user/.dotfiles'
    );
  });

  it('throws if no repoPath in config', async () => {
    loadConfig.mockResolvedValue({});
    await expect(gc()).rejects.toThrow('No dotpull repo found');
  });
});
