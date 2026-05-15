import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildStashPopArgs, stashPop } from './stash-pop.js';
import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

vi.mock('../git.js');
vi.mock('../config.js');

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
  runGit.mockResolvedValue({ stdout: 'Dropped stash@{0}', stderr: '' });
});

describe('buildStashPopArgs', () => {
  it('returns basic stash pop args', () => {
    expect(buildStashPopArgs()).toEqual(['stash', 'pop']);
  });

  it('includes --index flag when set', () => {
    expect(buildStashPopArgs({ index: true })).toEqual(['stash', 'pop', '--index']);
  });

  it('includes stash ref when provided', () => {
    expect(buildStashPopArgs({ stashRef: 'stash@{3}' })).toEqual(['stash', 'pop', 'stash@{3}']);
  });

  it('includes both --index and stash ref', () => {
    expect(buildStashPopArgs({ index: true, stashRef: 'stash@{1}' })).toEqual([
      'stash', 'pop', '--index', 'stash@{1}'
    ]);
  });
});

describe('stashPop', () => {
  it('calls runGit with basic args', async () => {
    await stashPop();
    expect(runGit).toHaveBeenCalledWith(['stash', 'pop'], { cwd: '/home/user/.dotfiles' });
  });

  it('passes --index flag', async () => {
    await stashPop({ index: true });
    expect(runGit).toHaveBeenCalledWith(
      ['stash', 'pop', '--index'],
      { cwd: '/home/user/.dotfiles' }
    );
  });

  it('logs output when verbose', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await stashPop({ verbose: true });
    expect(spy).toHaveBeenCalledWith('Dropped stash@{0}');
    spy.mockRestore();
  });

  it('returns result from runGit', async () => {
    const result = await stashPop();
    expect(result).toEqual({ stdout: 'Dropped stash@{0}', stderr: '' });
  });
});
