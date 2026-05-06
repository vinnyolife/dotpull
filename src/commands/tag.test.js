import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildTagArgs, tagCommand } from './tag.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn(),
  isGitRepo: vi.fn(),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn(),
}));

import { runGit, isGitRepo } from '../git.js';
import { loadConfig } from '../config.js';

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
  isGitRepo.mockResolvedValue(true);
  runGit.mockResolvedValue('');
});

describe('buildTagArgs', () => {
  it('returns base tag args for listing', () => {
    expect(buildTagArgs({ list: true })).toEqual(['tag', '-l']);
  });

  it('includes pattern when list is a string', () => {
    expect(buildTagArgs({ list: 'v*' })).toEqual(['tag', '-l', 'v*']);
  });

  it('builds args for creating a lightweight tag', () => {
    expect(buildTagArgs({ name: 'v1.0' })).toEqual(['tag', 'v1.0']);
  });

  it('builds args for annotated tag with message', () => {
    expect(buildTagArgs({ name: 'v1.0', annotate: true, message: 'release' })).toEqual([
      'tag', '-a', 'v1.0', '-m', 'release',
    ]);
  });

  it('builds args for deleting a tag', () => {
    expect(buildTagArgs({ delete: 'v1.0' })).toEqual(['tag', '-d', 'v1.0']);
  });

  it('includes commit ref when provided', () => {
    expect(buildTagArgs({ name: 'v1.0', commit: 'abc123' })).toEqual(['tag', 'v1.0', 'abc123']);
  });
});

describe('tagCommand', () => {
  it('throws if no repoPath in config', async () => {
    loadConfig.mockResolvedValue({});
    await expect(tagCommand({ list: true })).rejects.toThrow('No dotfiles repo found');
  });

  it('throws if path is not a git repo', async () => {
    isGitRepo.mockResolvedValue(false);
    await expect(tagCommand({ list: true })).rejects.toThrow('is not a git repository');
  });

  it('lists tags and prints output', async () => {
    runGit.mockResolvedValue('v1.0\nv1.1\n');
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await tagCommand({ list: true });
    expect(consoleSpy).toHaveBeenCalledWith('v1.0\nv1.1');
    consoleSpy.mockRestore();
  });

  it('prints no tags message when list is empty', async () => {
    runGit.mockResolvedValue('');
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await tagCommand({ list: true });
    expect(consoleSpy).toHaveBeenCalledWith('No tags found.');
    consoleSpy.mockRestore();
  });

  it('prints created message after tagging', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await tagCommand({ name: 'v2.0' });
    expect(consoleSpy).toHaveBeenCalledWith("Created tag 'v2.0'.");
    consoleSpy.mockRestore();
  });

  it('prints deleted message after deleting tag', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await tagCommand({ delete: 'v1.0' });
    expect(consoleSpy).toHaveBeenCalledWith("Deleted tag 'v1.0'.");
    consoleSpy.mockRestore();
  });
});
