import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildSubmoduleArgs, submoduleCommand } from './submodule.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn().mockResolvedValue({ stdout: '', stderr: '' }),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn().mockResolvedValue({ repoPath: '/home/user/.dotfiles' }),
}));

import { runGit } from '../git.js';

describe('buildSubmoduleArgs', () => {
  it('defaults to status when no action specified', () => {
    expect(buildSubmoduleArgs({})).toEqual(['submodule', 'status']);
  });

  it('builds init args', () => {
    expect(buildSubmoduleArgs({ init: true })).toEqual(['submodule', 'init']);
  });

  it('builds init args with path', () => {
    expect(buildSubmoduleArgs({ init: true, path: 'themes/nord' })).toEqual([
      'submodule', 'init', 'themes/nord',
    ]);
  });

  it('builds update args with flags', () => {
    expect(buildSubmoduleArgs({ update: true, recursive: true, remote: true })).toEqual([
      'submodule', 'update', '--recursive', '--remote',
    ]);
  });

  it('builds add args with url', () => {
    expect(buildSubmoduleArgs({ add: true, url: 'https://github.com/user/theme.git' })).toEqual([
      'submodule', 'add', 'https://github.com/user/theme.git',
    ]);
  });

  it('builds add args with branch and path', () => {
    expect(buildSubmoduleArgs({ add: true, url: 'https://github.com/user/theme.git', branch: 'main', path: 'themes/custom' })).toEqual([
      'submodule', 'add', '-b', 'main', 'https://github.com/user/theme.git', 'themes/custom',
    ]);
  });

  it('builds deinit args with force', () => {
    expect(buildSubmoduleArgs({ deinit: true, force: true, path: 'themes/old' })).toEqual([
      'submodule', 'deinit', '--force', 'themes/old',
    ]);
  });

  it('builds sync args', () => {
    expect(buildSubmoduleArgs({ sync: true })).toEqual(['submodule', 'sync']);
  });

  it('builds foreach args', () => {
    expect(buildSubmoduleArgs({ foreach: true, command: 'git pull' })).toEqual([
      'submodule', 'foreach', 'git pull',
    ]);
  });

  it('builds foreach args with recursive', () => {
    expect(buildSubmoduleArgs({ foreach: true, recursive: true, command: 'git status' })).toEqual([
      'submodule', 'foreach', '--recursive', 'git status',
    ]);
  });
});

describe('submoduleCommand', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls runGit with correct args and repoPath', async () => {
    await submoduleCommand({ status: true });
    expect(runGit).toHaveBeenCalledWith(
      ['submodule', 'status'],
      '/home/user/.dotfiles'
    );
  });

  it('calls runGit for update --recursive', async () => {
    await submoduleCommand({ update: true, recursive: true });
    expect(runGit).toHaveBeenCalledWith(
      ['submodule', 'update', '--recursive'],
      '/home/user/.dotfiles'
    );
  });
});
