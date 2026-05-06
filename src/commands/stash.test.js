import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildStashArgs, stash } from './stash.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn().mockResolvedValue('Saved working directory'),
  isGitRepo: vi.fn().mockResolvedValue(true),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn().mockResolvedValue({ repoPath: '/home/user/.dotfiles' }),
}));

import { runGit, isGitRepo } from '../git.js';
import { loadConfig } from '../config.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('buildStashArgs', () => {
  it('maps save -> stash push', () => {
    expect(buildStashArgs('save')).toEqual(['stash', 'push']);
  });

  it('includes message when provided for save', () => {
    expect(buildStashArgs('save', 'wip changes')).toEqual(['stash', 'push', '-m', 'wip changes']);
  });

  it('builds pop args', () => {
    expect(buildStashArgs('pop')).toEqual(['stash', 'pop']);
  });

  it('builds list args', () => {
    expect(buildStashArgs('list')).toEqual(['stash', 'list']);
  });

  it('builds drop args', () => {
    expect(buildStashArgs('drop')).toEqual(['stash', 'drop']);
  });

  it('throws on invalid action', () => {
    expect(() => buildStashArgs('apply')).toThrow("Invalid stash action 'apply'");
  });
});

describe('stash', () => {
  it('calls runGit with save args by default', async () => {
    await stash({});
    expect(runGit).toHaveBeenCalledWith(['stash', 'push'], '/home/user/.dotfiles');
  });

  it('passes message through for save action', async () => {
    await stash({ action: 'save', message: 'before sync' });
    expect(runGit).toHaveBeenCalledWith(
      ['stash', 'push', '-m', 'before sync'],
      '/home/user/.dotfiles'
    );
  });

  it('calls runGit with pop args', async () => {
    await stash({ action: 'pop' });
    expect(runGit).toHaveBeenCalledWith(['stash', 'pop'], '/home/user/.dotfiles');
  });

  it('returns action and output in result', async () => {
    const result = await stash({ action: 'list' });
    expect(result.action).toBe('list');
    expect(result.output).toBe('Saved working directory');
  });

  it('throws when repoPath is missing', async () => {
    loadConfig.mockResolvedValueOnce({});
    await expect(stash({})).rejects.toThrow('No dotpull repo configured');
  });

  it('throws when directory is not a git repo', async () => {
    isGitRepo.mockResolvedValueOnce(false);
    await expect(stash({})).rejects.toThrow('not a git repo');
  });
});
