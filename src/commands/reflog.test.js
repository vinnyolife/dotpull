import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildReflogArgs, reflogCommand } from './reflog.js';

vi.mock('../git.js', () => ({ runGit: vi.fn() }));
vi.mock('../config.js', () => ({ loadConfig: vi.fn() }));

import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
});

describe('buildReflogArgs', () => {
  it('returns base reflog args with no options', () => {
    expect(buildReflogArgs()).toEqual(['reflog']);
  });

  it('includes subcommand when provided', () => {
    expect(buildReflogArgs({ subcommand: 'expire' })).toEqual(['reflog', 'expire']);
  });

  it('includes ref when provided', () => {
    expect(buildReflogArgs({ ref: 'HEAD' })).toEqual(['reflog', 'HEAD']);
  });

  it('includes --all flag', () => {
    expect(buildReflogArgs({ all: true })).toContain('--all');
  });

  it('includes --expire option', () => {
    expect(buildReflogArgs({ expire: '30.days.ago' })).toContain('--expire=30.days.ago');
  });

  it('includes -n limit', () => {
    const args = buildReflogArgs({ n: 5 });
    expect(args).toContain('-n');
    expect(args).toContain('5');
  });

  it('includes --format option', () => {
    expect(buildReflogArgs({ format: 'oneline' })).toContain('--format=oneline');
  });

  it('includes --date option', () => {
    expect(buildReflogArgs({ date: 'iso' })).toContain('--date=iso');
  });

  it('combines multiple options correctly', () => {
    const args = buildReflogArgs({ ref: 'main', n: 10, format: 'short' });
    expect(args).toContain('main');
    expect(args).toContain('-n');
    expect(args).toContain('10');
    expect(args).toContain('--format=short');
  });
});

describe('reflogCommand', () => {
  it('throws if no repoPath configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(reflogCommand()).rejects.toThrow('No dotpull repo configured');
  });

  it('runs git reflog with correct args', async () => {
    runGit.mockResolvedValue('abc1234 HEAD@{0}: commit: add zshrc\n');
    await reflogCommand({ ref: 'HEAD' });
    expect(runGit).toHaveBeenCalledWith(['reflog', 'HEAD'], '/home/user/.dotfiles');
  });

  it('prints output when entries exist', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    runGit.mockResolvedValue('abc1234 HEAD@{0}: commit: add zshrc');
    await reflogCommand();
    expect(spy).toHaveBeenCalledWith('abc1234 HEAD@{0}: commit: add zshrc');
    spy.mockRestore();
  });

  it('prints fallback message when output is empty', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    runGit.mockResolvedValue('   ');
    await reflogCommand();
    expect(spy).toHaveBeenCalledWith('No reflog entries found.');
    spy.mockRestore();
  });
});
