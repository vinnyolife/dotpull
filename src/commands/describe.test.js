import { describe as describeCmd, buildDescribeArgs } from './describe.js';
import { runGit } from '../git.js';
import { loadConfig } from '../config.js';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../git.js');
vi.mock('../config.js');

const mockConfig = { repoPath: '/home/user/.dotfiles' };

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue(mockConfig);
});

describe('buildDescribeArgs', () => {
  it('returns base describe args with no options', () => {
    expect(buildDescribeArgs()).toEqual(['describe']);
  });

  it('adds --tags when tags is true', () => {
    expect(buildDescribeArgs({ tags: true })).toContain('--tags');
  });

  it('adds --long when long is true', () => {
    expect(buildDescribeArgs({ long: true })).toContain('--long');
  });

  it('adds --dirty with no suffix when dirty is true', () => {
    expect(buildDescribeArgs({ dirty: true })).toContain('--dirty');
  });

  it('adds --dirty=<suffix> when dirty is a string', () => {
    expect(buildDescribeArgs({ dirty: '-modified' })).toContain('--dirty=-modified');
  });

  it('adds --match=<pattern> when match is provided', () => {
    expect(buildDescribeArgs({ match: 'v*' })).toContain('--match=v*');
  });

  it('adds --exclude=<pattern> when exclude is provided', () => {
    expect(buildDescribeArgs({ exclude: 'rc*' })).toContain('--exclude=rc*');
  });

  it('adds --abbrev=<n> when abbrev is provided', () => {
    expect(buildDescribeArgs({ abbrev: 7 })).toContain('--abbrev=7');
  });

  it('adds --always when always is true', () => {
    expect(buildDescribeArgs({ always: true })).toContain('--always');
  });

  it('appends commit-ish when commit is provided', () => {
    const args = buildDescribeArgs({ commit: 'abc1234' });
    expect(args[args.length - 1]).toBe('abc1234');
  });

  it('combines multiple options correctly', () => {
    const args = buildDescribeArgs({ tags: true, long: true, abbrev: 8 });
    expect(args).toEqual(['describe', '--tags', '--long', '--abbrev=8']);
  });
});

describe('describe command', () => {
  it('calls runGit with correct args and logs result', async () => {
    runGit.mockResolvedValue('v1.2.3-4-gabcdef\n');
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await describeCmd({ tags: true });

    expect(runGit).toHaveBeenCalledWith(['describe', '--tags'], mockConfig.repoPath);
    expect(consoleSpy).toHaveBeenCalledWith('v1.2.3-4-gabcdef');
    consoleSpy.mockRestore();
  });

  it('logs error and exits on failure', async () => {
    runGit.mockRejectedValue(new Error('No tags found'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});

    await describeCmd();

    expect(consoleSpy).toHaveBeenCalledWith('describe failed:', 'No tags found');
    expect(exitSpy).toHaveBeenCalledWith(1);
    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
