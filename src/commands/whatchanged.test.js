import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildWhatchangedArgs, whatchanged } from './whatchanged.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn().mockResolvedValue('mock output'),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn().mockResolvedValue({ repoPath: '/home/user/.dotfiles' }),
}));

import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

describe('buildWhatchangedArgs', () => {
  it('returns base args with no options', () => {
    expect(buildWhatchangedArgs()).toEqual(['whatchanged']);
  });

  it('adds --since flag', () => {
    expect(buildWhatchangedArgs({ since: '2024-01-01' })).toContain('--since=2024-01-01');
  });

  it('adds --until flag', () => {
    expect(buildWhatchangedArgs({ until: '2024-12-31' })).toContain('--until=2024-12-31');
  });

  it('adds --author flag', () => {
    expect(buildWhatchangedArgs({ author: 'alice' })).toContain('--author=alice');
  });

  it('adds -n limit', () => {
    const args = buildWhatchangedArgs({ n: 5 });
    expect(args).toContain('-n');
    expect(args).toContain('5');
  });

  it('adds --oneline flag', () => {
    expect(buildWhatchangedArgs({ oneline: true })).toContain('--oneline');
  });

  it('adds --no-merges flag', () => {
    expect(buildWhatchangedArgs({ noMerges: true })).toContain('--no-merges');
  });

  it('adds -p for diff output', () => {
    expect(buildWhatchangedArgs({ diff: true })).toContain('-p');
  });

  it('adds a ref', () => {
    expect(buildWhatchangedArgs({ ref: 'main' })).toContain('main');
  });

  it('adds paths after --', () => {
    const args = buildWhatchangedArgs({ paths: ['.bashrc', '.vimrc'] });
    expect(args).toContain('--');
    expect(args).toContain('.bashrc');
    expect(args).toContain('.vimrc');
  });

  it('combines multiple options correctly', () => {
    const args = buildWhatchangedArgs({ oneline: true, n: 10, author: 'bob' });
    expect(args).toContain('--oneline');
    expect(args).toContain('--author=bob');
    expect(args).toContain('-n');
    expect(args).toContain('10');
  });
});

describe('whatchanged', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    runGit.mockResolvedValue('commit abc\nM .bashrc');
  });

  it('calls runGit with correct args and repoPath', async () => {
    await whatchanged({ oneline: true });
    expect(runGit).toHaveBeenCalledWith(
      ['whatchanged', '--oneline'],
      '/home/user/.dotfiles'
    );
  });

  it('returns git output', async () => {
    const result = await whatchanged();
    expect(result).toBe('commit abc\nM .bashrc');
  });

  it('throws if no repoPath configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(whatchanged()).rejects.toThrow('No dotpull repo configured');
  });
});
