import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildAnnotateArgs, annotate } from './annotate.js';
import * as git from '../git.js';
import * as config from '../config.js';

vi.mock('../git.js');
vi.mock('../config.js');

beforeEach(() => {
  vi.clearAllMocks();
  config.loadConfig.mockResolvedValue({ repoPath: '/repo' });
  git.runGit.mockResolvedValue('annotate output');
});

describe('buildAnnotateArgs', () => {
  it('builds basic args with file', () => {
    expect(buildAnnotateArgs('src/foo.js')).toEqual(['annotate', '--', 'src/foo.js']);
  });

  it('adds -L when lineRange is provided', () => {
    const args = buildAnnotateArgs('foo.js', { lineRange: '10,20' });
    expect(args).toContain('-L');
    expect(args).toContain('10,20');
  });

  it('adds commit ref when provided', () => {
    const args = buildAnnotateArgs('foo.js', { commit: 'deadbeef' });
    expect(args).toContain('deadbeef');
  });

  it('adds -e for showEmail', () => {
    const args = buildAnnotateArgs('foo.js', { showEmail: true });
    expect(args).toContain('-e');
  });

  it('adds -w for ignoreWhitespace', () => {
    const args = buildAnnotateArgs('foo.js', { ignoreWhitespace: true });
    expect(args).toContain('-w');
  });

  it('adds --incremental flag', () => {
    const args = buildAnnotateArgs('foo.js', { incrementalOutput: true });
    expect(args).toContain('--incremental');
  });

  it('does not add optional flags when not set', () => {
    const args = buildAnnotateArgs('foo.js');
    expect(args).not.toContain('-e');
    expect(args).not.toContain('-w');
    expect(args).not.toContain('--incremental');
  });
});

describe('annotate', () => {
  it('calls runGit with correct args and repoPath', async () => {
    await annotate('.bashrc', { lineRange: '5,15' });
    expect(git.runGit).toHaveBeenCalledWith(
      expect.arrayContaining(['annotate', '-L', '5,15', '--', '.bashrc']),
      '/repo'
    );
  });

  it('throws when file is not provided', async () => {
    await expect(annotate()).rejects.toThrow('File path is required');
  });

  it('returns output from runGit', async () => {
    const result = await annotate('.vimrc');
    expect(result).toBe('annotate output');
  });
});
