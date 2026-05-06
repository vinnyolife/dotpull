import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildLogArgs } from './log.js';
import * as git from '../git.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn(),
  isGitRepo: vi.fn(),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn(() => ({ repoPath: '/home/user/.dotfiles' })),
}));

describe('buildLogArgs', () => {
  it('returns default log args with no options', () => {
    const args = buildLogArgs({});
    expect(args).toContain('log');
    expect(args).toContain('--oneline');
  });

  it('includes --max-count when limit is provided', () => {
    const args = buildLogArgs({ limit: 10 });
    expect(args).toContain('--max-count=10');
  });

  it('includes --all when all flag is set', () => {
    const args = buildLogArgs({ all: true });
    expect(args).toContain('--all');
  });

  it('includes --stat when stat flag is set', () => {
    const args = buildLogArgs({ stat: true });
    expect(args).toContain('--stat');
  });

  it('does not include --stat by default', () => {
    const args = buildLogArgs({});
    expect(args).not.toContain('--stat');
  });

  it('includes --graph when graph flag is set', () => {
    const args = buildLogArgs({ graph: true });
    expect(args).toContain('--graph');
  });

  it('includes file path when file is provided', () => {
    const args = buildLogArgs({ file: '.bashrc' });
    expect(args).toContain('--');
    expect(args).toContain('.bashrc');
  });

  it('combines multiple options correctly', () => {
    const args = buildLogArgs({ limit: 5, all: true, graph: true });
    expect(args).toContain('--max-count=5');
    expect(args).toContain('--all');
    expect(args).toContain('--graph');
  });
});

describe('log command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    git.isGitRepo.mockResolvedValue(true);
    git.runGit.mockResolvedValue('abc1234 add .bashrc\ndef5678 update .vimrc');
  });

  it('calls runGit with log args', async () => {
    const { default: log } = await import('./log.js');
    await log({});
    expect(git.runGit).toHaveBeenCalledWith(
      '/home/user/.dotfiles',
      expect.arrayContaining(['log'])
    );
  });

  it('throws if not a git repo', async () => {
    git.isGitRepo.mockResolvedValue(false);
    const { default: log } = await import('./log.js');
    await expect(log({})).rejects.toThrow();
  });
});
