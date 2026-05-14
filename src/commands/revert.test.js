import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildRevertArgs, revert } from './revert.js';
import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

vi.mock('../git.js');
vi.mock('../config.js');

describe('buildRevertArgs', () => {
  it('returns base revert command', () => {
    expect(buildRevertArgs()).toEqual(['revert']);
  });

  it('adds a single commit', () => {
    expect(buildRevertArgs({ commit: 'abc123' })).toEqual(['revert', 'abc123']);
  });

  it('adds multiple commits', () => {
    expect(buildRevertArgs({ commits: ['abc123', 'def456'] })).toEqual(['revert', 'abc123', 'def456']);
  });

  it('adds --no-edit flag', () => {
    expect(buildRevertArgs({ noEdit: true, commit: 'abc123' })).toEqual(['revert', '--no-edit', 'abc123']);
  });

  it('adds --no-commit flag', () => {
    expect(buildRevertArgs({ noCommit: true, commit: 'abc123' })).toEqual(['revert', '--no-commit', 'abc123']);
  });

  it('adds -m mainline option', () => {
    expect(buildRevertArgs({ mainline: 1, commit: 'abc123' })).toEqual(['revert', '-m', '1', 'abc123']);
  });

  it('adds --abort and ignores commit', () => {
    expect(buildRevertArgs({ abort: true, commit: 'abc123' })).toEqual(['revert', '--abort']);
  });

  it('adds --continue and ignores commit', () => {
    expect(buildRevertArgs({ continue: true, commit: 'abc123' })).toEqual(['revert', '--continue']);
  });
});

describe('revert', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    runGit.mockResolvedValue('[main abc1234] Revert "add zshrc"');
  });

  it('runs revert with correct args', async () => {
    await revert({ commit: 'HEAD' });
    expect(runGit).toHaveBeenCalledWith(['revert', 'HEAD'], '/home/user/.dotfiles');
  });

  it('throws if no repoPath configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(revert({ commit: 'HEAD' })).rejects.toThrow('No dotpull repo configured');
  });

  it('returns git output', async () => {
    const result = await revert({ commit: 'abc123' });
    expect(result).toBe('[main abc1234] Revert "add zshrc"');
  });

  it('handles --no-edit flag', async () => {
    await revert({ noEdit: true, commit: 'HEAD~1' });
    expect(runGit).toHaveBeenCalledWith(['revert', '--no-edit', 'HEAD~1'], '/home/user/.dotfiles');
  });
});
