import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildSwitchListArgs } from './switch-list.js';
import * as git from '../git.js';
import * as config from '../config.js';

vi.mock('../git.js');
vi.mock('../config.js');

describe('buildSwitchListArgs', () => {
  it('returns base branch list args', () => {
    const args = buildSwitchListArgs({});
    expect(args).toEqual(['branch', '--list']);
  });

  it('includes --all when all flag is set', () => {
    const args = buildSwitchListArgs({ all: true });
    expect(args).toContain('--all');
  });

  it('includes --remotes when remotes flag is set', () => {
    const args = buildSwitchListArgs({ remotes: true });
    expect(args).toContain('--remotes');
  });

  it('includes pattern when provided', () => {
    const args = buildSwitchListArgs({ pattern: 'feat/*' });
    expect(args).toContain('feat/*');
  });

  it('does not include pattern when not provided', () => {
    const args = buildSwitchListArgs({});
    expect(args).toHaveLength(2);
  });
});

describe('switchList command', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    config.loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    git.runGit.mockResolvedValue('  main\n* develop\n  feat/test\n');
  });

  it('runs git branch --list with resolved config', async () => {
    const { default: switchList } = await import('./switch-list.js');
    await switchList({});
    expect(git.runGit).toHaveBeenCalledWith(
      '/home/user/.dotfiles',
      expect.arrayContaining(['branch', '--list'])
    );
  });

  it('passes --all flag through to git', async () => {
    const { default: switchList } = await import('./switch-list.js');
    await switchList({ all: true });
    expect(git.runGit).toHaveBeenCalledWith(
      '/home/user/.dotfiles',
      expect.arrayContaining(['--all'])
    );
  });
});
