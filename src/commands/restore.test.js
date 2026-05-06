import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildRestoreArgs, restore } from './restore.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn().mockResolvedValue(''),
  isGitRepo: vi.fn().mockResolvedValue(true),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn().mockResolvedValue({ repoPath: '/home/user/.dotfiles' }),
}));

import { runGit, isGitRepo } from '../git.js';
import { loadConfig } from '../config.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('buildRestoreArgs', () => {
  it('defaults to HEAD when no ref provided', () => {
    expect(buildRestoreArgs('.bashrc')).toEqual(['checkout', 'HEAD', '--', '.bashrc']);
  });

  it('uses the supplied ref', () => {
    expect(buildRestoreArgs('.vimrc', 'abc123')).toEqual(['checkout', 'abc123', '--', '.vimrc']);
  });
});

describe('restore', () => {
  it('calls runGit with correct args for a relative path', async () => {
    await restore({ file: '.bashrc' });
    expect(runGit).toHaveBeenCalledWith(
      ['checkout', 'HEAD', '--', '.bashrc'],
      '/home/user/.dotfiles'
    );
  });

  it('converts absolute path to relative before calling git', async () => {
    await restore({ file: '/home/user/.dotfiles/.vimrc' });
    expect(runGit).toHaveBeenCalledWith(
      ['checkout', 'HEAD', '--', '.vimrc'],
      '/home/user/.dotfiles'
    );
  });

  it('respects a custom ref', async () => {
    await restore({ file: '.zshrc', ref: 'v1.2.3' });
    expect(runGit).toHaveBeenCalledWith(
      ['checkout', 'v1.2.3', '--', '.zshrc'],
      '/home/user/.dotfiles'
    );
  });

  it('dry-run skips runGit and returns dry flag', async () => {
    const result = await restore({ file: '.tmux.conf', dry: true });
    expect(runGit).not.toHaveBeenCalled();
    expect(result.dry).toBe(true);
    expect(result.relativePath).toBe('.tmux.conf');
  });

  it('throws when repoPath is not configured', async () => {
    loadConfig.mockResolvedValueOnce({});
    await expect(restore({ file: '.bashrc' })).rejects.toThrow('No dotpull repo configured');
  });

  it('throws when directory is not a git repo', async () => {
    isGitRepo.mockResolvedValueOnce(false);
    await expect(restore({ file: '.bashrc' })).rejects.toThrow('not a git repo');
  });
});
