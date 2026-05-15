import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildStashBranchArgs, stashBranch } from './stash-branch.js';
import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

vi.mock('../git.js');
vi.mock('../config.js');

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
  runGit.mockResolvedValue({ stdout: 'Switched to a new branch "my-branch"', stderr: '' });
});

describe('buildStashBranchArgs', () => {
  it('returns basic stash branch args', () => {
    expect(buildStashBranchArgs('my-branch')).toEqual(['stash', 'branch', 'my-branch']);
  });

  it('includes stash ref when provided', () => {
    expect(buildStashBranchArgs('my-branch', 'stash@{2}')).toEqual([
      'stash', 'branch', 'my-branch', 'stash@{2}'
    ]);
  });

  it('throws if branch name is missing', () => {
    expect(() => buildStashBranchArgs()).toThrow('Branch name is required');
  });

  it('throws if branch name is empty string', () => {
    expect(() => buildStashBranchArgs('')).toThrow('Branch name is required');
  });
});

describe('stashBranch', () => {
  it('calls runGit with correct args', async () => {
    await stashBranch('feature-x');
    expect(runGit).toHaveBeenCalledWith(
      ['stash', 'branch', 'feature-x'],
      { cwd: '/home/user/.dotfiles' }
    );
  });

  it('passes stash ref when provided', async () => {
    await stashBranch('feature-x', { stashRef: 'stash@{1}' });
    expect(runGit).toHaveBeenCalledWith(
      ['stash', 'branch', 'feature-x', 'stash@{1}'],
      { cwd: '/home/user/.dotfiles' }
    );
  });

  it('logs output when verbose is true', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await stashBranch('feature-x', { verbose: true });
    expect(spy).toHaveBeenCalledWith('Switched to a new branch "my-branch"');
    spy.mockRestore();
  });

  it('does not log when verbose is false', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await stashBranch('feature-x', { verbose: false });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
