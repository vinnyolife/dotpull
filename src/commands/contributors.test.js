import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildContributorsArgs, contributors } from './contributors.js';

vi.mock('../git.js', () => ({ runGit: vi.fn() }));
vi.mock('../config.js', () => ({ loadConfig: vi.fn() }));

import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

describe('buildContributorsArgs', () => {
  it('returns base args by default', () => {
    expect(buildContributorsArgs()).toEqual(['shortlog', '-s', '-n']);
  });

  it('includes -e when email option is set', () => {
    expect(buildContributorsArgs({ email: true })).toContain('-e');
  });

  it('includes --all when all option is set', () => {
    expect(buildContributorsArgs({ all: true })).toContain('--all');
  });

  it('includes --since when since option is provided', () => {
    const args = buildContributorsArgs({ since: '2024-01-01' });
    expect(args).toContain('--since=2024-01-01');
  });

  it('includes --until when until option is provided', () => {
    const args = buildContributorsArgs({ until: '2024-12-31' });
    expect(args).toContain('--until=2024-12-31');
  });

  it('appends -- and path when path option is provided', () => {
    const args = buildContributorsArgs({ path: '.bashrc' });
    expect(args).toContain('--');
    expect(args).toContain('.bashrc');
  });

  it('combines multiple options correctly', () => {
    const args = buildContributorsArgs({ email: true, since: '2023-01-01', all: true });
    expect(args).toContain('-e');
    expect(args).toContain('--all');
    expect(args).toContain('--since=2023-01-01');
  });
});

describe('contributors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws if no repoPath is configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(contributors()).rejects.toThrow('No dotfiles repo configured');
  });

  it('prints contributors when output is returned', async () => {
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    runGit.mockResolvedValue('   42\tAlice\n   17\tBob\n');
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await contributors();
    expect(runGit).toHaveBeenCalledWith(
      ['shortlog', '-s', '-n'],
      '/home/user/.dotfiles'
    );
    expect(consoleSpy).toHaveBeenCalledWith('Contributors:\n');
    consoleSpy.mockRestore();
  });

  it('prints fallback message when output is empty', async () => {
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    runGit.mockResolvedValue('');
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await contributors();
    expect(consoleSpy).toHaveBeenCalledWith('No contributors found.');
    consoleSpy.mockRestore();
  });
});
