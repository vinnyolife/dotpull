import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildCherryPickArgs, cherryPick } from './cherry-pick.js';

vi.mock('../config.js', () => ({
  loadConfig: vi.fn(),
}));

vi.mock('../git.js', () => ({
  runGit: vi.fn(),
}));

import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

describe('buildCherryPickArgs', () => {
  it('returns base cherry-pick args with a commit', () => {
    const args = buildCherryPickArgs({ commits: ['abc1234'] });
    expect(args).toEqual(['cherry-pick', 'abc1234']);
  });

  it('adds --no-commit flag', () => {
    const args = buildCherryPickArgs({ commits: ['abc1234'], noCommit: true });
    expect(args).toContain('--no-commit');
  });

  it('adds --edit flag', () => {
    const args = buildCherryPickArgs({ commits: ['abc1234'], edit: true });
    expect(args).toContain('--edit');
  });

  it('adds --signoff flag', () => {
    const args = buildCherryPickArgs({ commits: ['abc1234'], signoff: true });
    expect(args).toContain('--signoff');
  });

  it('adds --mainline with value', () => {
    const args = buildCherryPickArgs({ commits: ['abc1234'], mainline: 1 });
    expect(args).toContain('--mainline');
    expect(args).toContain('1');
  });

  it('returns --continue args and ignores commits', () => {
    const args = buildCherryPickArgs({ continue: true, commits: ['abc1234'] });
    expect(args).toContain('--continue');
    expect(args).not.toContain('abc1234');
  });

  it('returns --abort args', () => {
    const args = buildCherryPickArgs({ abort: true });
    expect(args).toContain('--abort');
  });

  it('returns --skip args', () => {
    const args = buildCherryPickArgs({ skip: true });
    expect(args).toContain('--skip');
  });

  it('handles multiple commits', () => {
    const args = buildCherryPickArgs({ commits: ['aaa', 'bbb', 'ccc'] });
    expect(args).toContain('aaa');
    expect(args).toContain('bbb');
    expect(args).toContain('ccc');
  });
});

describe('cherryPick', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws if no repoPath configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(cherryPick({ commits: ['abc'] })).rejects.toThrow('No dotpull repo found');
  });

  it('calls runGit with correct args', async () => {
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    runGit.mockResolvedValue('1 file changed');
    await cherryPick({ commits: ['abc1234'] });
    expect(runGit).toHaveBeenCalledWith(
      ['cherry-pick', 'abc1234'],
      '/home/user/.dotfiles'
    );
  });
});
