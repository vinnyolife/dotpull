import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildLintArgs, lintCommand } from './lint.js';
import * as git from '../git.js';
import * as config from '../config.js';

vi.mock('../git.js');
vi.mock('../config.js');

const MOCK_REPO = '/home/user/.dotfiles';

beforeEach(() => {
  vi.clearAllMocks();
  config.loadConfig.mockResolvedValue({ repoPath: MOCK_REPO });
});

describe('buildLintArgs', () => {
  it('returns base diff --check args by default', () => {
    expect(buildLintArgs()).toEqual(['diff', '--check']);
  });

  it('adds --cached when option is set', () => {
    expect(buildLintArgs({ cached: true })).toEqual(['diff', '--check', '--cached']);
  });

  it('appends commit ref when provided', () => {
    expect(buildLintArgs({ commit: 'HEAD~1' })).toEqual(['diff', '--check', 'HEAD~1']);
  });

  it('combines cached and commit', () => {
    expect(buildLintArgs({ cached: true, commit: 'abc123' })).toEqual([
      'diff', '--check', '--cached', 'abc123'
    ]);
  });
});

describe('lintCommand', () => {
  it('throws when no repoPath is configured', async () => {
    config.loadConfig.mockResolvedValue({});
    await expect(lintCommand()).rejects.toThrow('No dotfiles repo configured');
  });

  it('returns passed:true when no issues found', async () => {
    git.runGit.mockResolvedValueOnce('').mockRejectedValueOnce(new Error('exit 1'));
    const result = await lintCommand();
    expect(result.passed).toBe(true);
    expect(result.conflicts).toBe('');
  });

  it('sets passed:false on whitespace errors', async () => {
    git.runGit.mockRejectedValueOnce(new Error('whitespace error in file.txt'));
    git.runGit.mockRejectedValueOnce(new Error('exit 1'));
    const result = await lintCommand();
    expect(result.passed).toBe(false);
    expect(result.whitespace).toMatch('whitespace error');
  });

  it('sets passed:false when conflict markers are found', async () => {
    git.runGit.mockResolvedValueOnce('');
    git.runGit.mockResolvedValueOnce('.bashrc\n.vimrc\n');
    const result = await lintCommand();
    expect(result.passed).toBe(false);
    expect(result.conflicts).toContain('.bashrc');
  });

  it('passes cached option through to runGit', async () => {
    git.runGit.mockResolvedValueOnce('').mockRejectedValueOnce(new Error('exit 1'));
    await lintCommand({ cached: true });
    expect(git.runGit).toHaveBeenCalledWith(
      ['diff', '--check', '--cached'],
      MOCK_REPO
    );
  });
});
