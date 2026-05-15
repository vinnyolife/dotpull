import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildCountArgs, countCommand } from './count.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn(),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn(),
}));

import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
  runGit.mockResolvedValue('42\n');
});

describe('buildCountArgs', () => {
  it('defaults to HEAD with rev-list --count', () => {
    expect(buildCountArgs()).toEqual(['rev-list', '--count', 'HEAD']);
  });

  it('uses custom ref', () => {
    expect(buildCountArgs({ ref: 'main' })).toEqual(['rev-list', '--count', 'main']);
  });

  it('includes --all flag', () => {
    const args = buildCountArgs({ all: true });
    expect(args).toContain('--all');
  });

  it('includes --merges flag', () => {
    const args = buildCountArgs({ merges: true });
    expect(args).toContain('--merges');
  });

  it('includes --no-merges flag', () => {
    const args = buildCountArgs({ noMerges: true });
    expect(args).toContain('--no-merges');
  });

  it('includes --since filter', () => {
    const args = buildCountArgs({ since: '2024-01-01' });
    expect(args).toContain('--since=2024-01-01');
  });

  it('includes --until filter', () => {
    const args = buildCountArgs({ until: '2024-12-31' });
    expect(args).toContain('--until=2024-12-31');
  });

  it('includes --author filter', () => {
    const args = buildCountArgs({ author: 'Alice' });
    expect(args).toContain('--author=Alice');
  });

  it('combines multiple options', () => {
    const args = buildCountArgs({ since: '2024-01-01', noMerges: true, ref: 'develop' });
    expect(args).toContain('--since=2024-01-01');
    expect(args).toContain('--no-merges');
    expect(args[args.length - 1]).toBe('develop');
  });
});

describe('countCommand', () => {
  it('calls runGit with correct args and repo path', async () => {
    await countCommand();
    expect(runGit).toHaveBeenCalledWith(
      ['rev-list', '--count', 'HEAD'],
      '/home/user/.dotfiles'
    );
  });

  it('returns parsed integer count', async () => {
    const result = await countCommand({ quiet: true });
    expect(result).toBe(42);
  });

  it('throws if no repoPath configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(countCommand()).rejects.toThrow('No dotfiles repo configured');
  });

  it('logs output when not quiet', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await countCommand({ ref: 'main' });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('main'));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('42'));
    spy.mockRestore();
  });
});
