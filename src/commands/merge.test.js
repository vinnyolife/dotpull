import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildMergeArgs, merge } from './merge.js';
import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

vi.mock('../git.js');
vi.mock('../config.js');

describe('buildMergeArgs', () => {
  it('returns base merge command', () => {
    expect(buildMergeArgs()).toEqual(['merge']);
  });

  it('adds branch name', () => {
    expect(buildMergeArgs({ branch: 'feature/x' })).toEqual(['merge', 'feature/x']);
  });

  it('adds --no-ff flag', () => {
    expect(buildMergeArgs({ noFf: true, branch: 'dev' })).toEqual(['merge', '--no-ff', 'dev']);
  });

  it('adds --ff-only flag', () => {
    expect(buildMergeArgs({ ffOnly: true, branch: 'dev' })).toEqual(['merge', '--ff-only', 'dev']);
  });

  it('adds --squash flag', () => {
    expect(buildMergeArgs({ squash: true, branch: 'dev' })).toEqual(['merge', '--squash', 'dev']);
  });

  it('adds --abort flag and omits branch', () => {
    expect(buildMergeArgs({ abort: true, branch: 'dev' })).toEqual(['merge', '--abort']);
  });

  it('adds --continue flag and omits branch', () => {
    expect(buildMergeArgs({ continue: true })).toEqual(['merge', '--continue']);
  });

  it('adds --no-commit flag', () => {
    expect(buildMergeArgs({ noCommit: true, branch: 'dev' })).toEqual(['merge', '--no-commit', 'dev']);
  });

  it('adds --strategy option', () => {
    expect(buildMergeArgs({ strategy: 'ours', branch: 'dev' })).toEqual(['merge', '--strategy', 'ours', 'dev']);
  });

  it('adds -m message', () => {
    expect(buildMergeArgs({ message: 'Merging dev', branch: 'dev' })).toEqual(['merge', '-m', 'Merging dev', 'dev']);
  });
});

describe('merge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    runGit.mockResolvedValue('Already up to date.');
  });

  it('runs merge with correct args', async () => {
    await merge({ branch: 'main' });
    expect(runGit).toHaveBeenCalledWith(['merge', 'main'], '/home/user/.dotfiles');
  });

  it('throws if no repoPath configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(merge({ branch: 'main' })).rejects.toThrow('No dotpull repo configured');
  });

  it('returns git output', async () => {
    runGit.mockResolvedValue('Merge made by the recursive strategy.');
    const result = await merge({ branch: 'feature/vim' });
    expect(result).toBe('Merge made by the recursive strategy.');
  });
});
