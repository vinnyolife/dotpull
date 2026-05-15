import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildVerifyTagArgs, verifyTag } from './verify-tag.js';
import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

vi.mock('../git.js');
vi.mock('../config.js');

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
  runGit.mockResolvedValue('tag v1.0.0\nobject abc1234\ntype commit\ngpg: Good signature');
});

describe('buildVerifyTagArgs', () => {
  it('returns base args with tag name', () => {
    expect(buildVerifyTagArgs('v1.0.0')).toEqual(['verify-tag', 'v1.0.0']);
  });

  it('includes --verbose when opt is set', () => {
    expect(buildVerifyTagArgs('v1.0.0', { verbose: true })).toEqual([
      'verify-tag', '--verbose', 'v1.0.0'
    ]);
  });

  it('includes --format when provided', () => {
    expect(buildVerifyTagArgs('v1.0.0', { format: '%(tag)' })).toEqual([
      'verify-tag', '--format=%(tag)', 'v1.0.0'
    ]);
  });

  it('combines verbose and format', () => {
    expect(buildVerifyTagArgs('v2.0.0', { verbose: true, format: '%(contents)' })).toEqual([
      'verify-tag', '--verbose', '--format=%(contents)', 'v2.0.0'
    ]);
  });

  it('throws if tag name is missing', () => {
    expect(() => buildVerifyTagArgs('')).toThrow('Tag name is required');
    expect(() => buildVerifyTagArgs()).toThrow('Tag name is required');
  });
});

describe('verifyTag', () => {
  it('calls runGit with correct args and repoPath', async () => {
    await verifyTag('v1.0.0');
    expect(runGit).toHaveBeenCalledWith(['verify-tag', 'v1.0.0'], '/home/user/.dotfiles');
  });

  it('returns output from runGit', async () => {
    const result = await verifyTag('v1.0.0');
    expect(result).toContain('Good signature');
  });

  it('throws if no repoPath configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(verifyTag('v1.0.0')).rejects.toThrow('No dotpull repo configured');
  });

  it('passes verbose option through', async () => {
    await verifyTag('v1.0.0', { verbose: true });
    expect(runGit).toHaveBeenCalledWith(['verify-tag', '--verbose', 'v1.0.0'], '/home/user/.dotfiles');
  });
});
