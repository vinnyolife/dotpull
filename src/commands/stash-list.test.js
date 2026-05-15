import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildStashListArgs } from './stash-list.js';
import * as git from '../git.js';
import * as config from '../config.js';

vi.mock('../git.js');
vi.mock('../config.js');

describe('buildStashListArgs', () => {
  it('returns base stash list args', () => {
    expect(buildStashListArgs({})).toEqual(['stash', 'list']);
  });

  it('appends --format when provided', () => {
    const args = buildStashListArgs({ format: '%gd: %s' });
    expect(args).toContain('--format=%gd: %s');
  });

  it('appends limit flag when provided', () => {
    const args = buildStashListArgs({ limit: 5 });
    expect(args).toContain('-5');
  });

  it('handles string limit by parsing as int', () => {
    const args = buildStashListArgs({ limit: '3' });
    expect(args).toContain('-3');
  });

  it('does not add extra flags when opts is empty', () => {
    expect(buildStashListArgs({})).toHaveLength(2);
  });
});

describe('stashList command', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    config.loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
  });

  it('prints stash entries when they exist', async () => {
    git.runGit.mockResolvedValue('stash@{0}: WIP on main: abc123 some message\n');
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { default: stashList } = await import('./stash-list.js');
    await stashList({});
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('stash@{0}'));
    consoleSpy.mockRestore();
  });

  it('prints no stashes message when output is empty', async () => {
    git.runGit.mockResolvedValue('');
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { default: stashList } = await import('./stash-list.js');
    await stashList({});
    expect(consoleSpy).toHaveBeenCalledWith('No stashes found.');
    consoleSpy.mockRestore();
  });

  it('calls runGit with correct repoPath', async () => {
    git.runGit.mockResolvedValue('stash@{0}: WIP\n');
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const { default: stashList } = await import('./stash-list.js');
    await stashList({});
    expect(git.runGit).toHaveBeenCalledWith('/home/user/.dotfiles', expect.any(Array));
  });
});
