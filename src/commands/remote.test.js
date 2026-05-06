import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildRemoteArgs, remoteCommand } from './remote.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn(),
  isGitRepo: vi.fn(),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn(),
}));

import { runGit, isGitRepo } from '../git.js';
import { loadConfig } from '../config.js';

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
  isGitRepo.mockResolvedValue(true);
  runGit.mockResolvedValue('');
});

describe('buildRemoteArgs', () => {
  it('returns base remote args', () => {
    expect(buildRemoteArgs({})).toEqual(['remote']);
  });

  it('adds verbose flag', () => {
    expect(buildRemoteArgs({ verbose: true })).toEqual(['remote', '-v']);
  });

  it('builds add remote args', () => {
    expect(buildRemoteArgs({ add: { name: 'origin', url: 'git@github.com:u/r.git' } })).toEqual([
      'remote', 'add', 'origin', 'git@github.com:u/r.git',
    ]);
  });

  it('builds remove remote args', () => {
    expect(buildRemoteArgs({ remove: 'origin' })).toEqual(['remote', 'remove', 'origin']);
  });

  it('builds rename remote args', () => {
    expect(buildRemoteArgs({ rename: { old: 'origin', new: 'upstream' } })).toEqual([
      'remote', 'rename', 'origin', 'upstream',
    ]);
  });

  it('builds set-url args', () => {
    expect(buildRemoteArgs({ setUrl: { name: 'origin', url: 'https://github.com/u/r.git' } })).toEqual([
      'remote', 'set-url', 'origin', 'https://github.com/u/r.git',
    ]);
  });

  it('builds get-url args', () => {
    expect(buildRemoteArgs({ getUrl: 'origin' })).toEqual(['remote', 'get-url', 'origin']);
  });
});

describe('remoteCommand', () => {
  it('throws if no repoPath in config', async () => {
    loadConfig.mockResolvedValue({});
    await expect(remoteCommand({})).rejects.toThrow('No dotfiles repo found');
  });

  it('throws if not a git repo', async () => {
    isGitRepo.mockResolvedValue(false);
    await expect(remoteCommand({})).rejects.toThrow('is not a git repository');
  });

  it('prints remote list when output is returned', async () => {
    runGit.mockResolvedValue('origin\nupstream\n');
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await remoteCommand({});
    expect(spy).toHaveBeenCalledWith('origin\nupstream');
    spy.mockRestore();
  });

  it('prints no remotes when output is empty', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await remoteCommand({});
    expect(spy).toHaveBeenCalledWith('No remotes configured.');
    spy.mockRestore();
  });

  it('prints confirmation after adding remote', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await remoteCommand({ add: { name: 'origin', url: 'git@github.com:u/r.git' } });
    expect(spy).toHaveBeenCalledWith("Added remote 'origin' -> git@github.com:u/r.git");
    spy.mockRestore();
  });

  it('prints confirmation after removing remote', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await remoteCommand({ remove: 'origin' });
    expect(spy).toHaveBeenCalledWith("Removed remote 'origin'.");
    spy.mockRestore();
  });
});
