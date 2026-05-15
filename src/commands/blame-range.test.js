import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildBlameRangeArgs, blameRange } from './blame-range.js';
import * as git from '../git.js';
import * as config from '../config.js';

vi.mock('../git.js');
vi.mock('../config.js');

beforeEach(() => {
  vi.clearAllMocks();
  config.loadConfig.mockResolvedValue({ repoPath: '/repo' });
  git.runGit.mockResolvedValue('blame output');
});

describe('buildBlameRangeArgs', () => {
  it('builds basic args with file', () => {
    expect(buildBlameRangeArgs('src/foo.js')).toEqual(['blame', '--', 'src/foo.js']);
  });

  it('adds -L range when startLine and endLine provided', () => {
    const args = buildBlameRangeArgs('foo.js', { startLine: 10, endLine: 20 });
    expect(args).toContain('-L');
    expect(args).toContain('10,20');
  });

  it('adds -L with +1 when only startLine provided', () => {
    const args = buildBlameRangeArgs('foo.js', { startLine: 5 });
    expect(args).toContain('5,+1');
  });

  it('adds commit when provided', () => {
    const args = buildBlameRangeArgs('foo.js', { commit: 'abc123' });
    expect(args).toContain('abc123');
  });

  it('adds --reverse flag', () => {
    const args = buildBlameRangeArgs('foo.js', { reverse: true });
    expect(args).toContain('--reverse');
  });

  it('adds -e for showEmail', () => {
    const args = buildBlameRangeArgs('foo.js', { showEmail: true });
    expect(args).toContain('-e');
  });

  it('adds -w for ignoreWhitespace', () => {
    const args = buildBlameRangeArgs('foo.js', { ignoreWhitespace: true });
    expect(args).toContain('-w');
  });

  it('adds --porcelain flag', () => {
    const args = buildBlameRangeArgs('foo.js', { porcelain: true });
    expect(args).toContain('--porcelain');
  });
});

describe('blameRange', () => {
  it('calls runGit with correct args', async () => {
    await blameRange('src/foo.js', { startLine: 1, endLine: 10 });
    expect(git.runGit).toHaveBeenCalledWith(
      expect.arrayContaining(['blame', '-L', '1,10', '--', 'src/foo.js']),
      '/repo'
    );
  });

  it('throws when file is not provided', async () => {
    await expect(blameRange()).rejects.toThrow('File path is required');
  });

  it('returns output from runGit', async () => {
    const result = await blameRange('foo.js');
    expect(result).toBe('blame output');
  });
});
