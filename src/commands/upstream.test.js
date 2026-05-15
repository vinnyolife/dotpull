import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildUpstreamArgs, upstreamCommand } from './upstream.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn(),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn(),
}));

import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
  runGit.mockResolvedValue({ stdout: '', stderr: '' });
});

describe('buildUpstreamArgs', () => {
  it('returns branch -vv by default', () => {
    expect(buildUpstreamArgs()).toEqual(['branch', '-vv']);
  });

  it('includes branch name when provided in show mode', () => {
    expect(buildUpstreamArgs({ branch: 'main' })).toEqual(['branch', '-vv', 'main']);
  });

  it('builds set-upstream-to args', () => {
    expect(buildUpstreamArgs({ set: 'origin/main' })).toEqual([
      'branch', '--set-upstream-to', 'origin/main',
    ]);
  });

  it('builds set-upstream-to args with branch name', () => {
    expect(buildUpstreamArgs({ set: 'origin/dev', branch: 'dev' })).toEqual([
      'branch', '--set-upstream-to', 'origin/dev', 'dev',
    ]);
  });

  it('builds unset-upstream args', () => {
    expect(buildUpstreamArgs({ unset: true })).toEqual(['branch', '--unset-upstream']);
  });

  it('builds unset-upstream args with branch name', () => {
    expect(buildUpstreamArgs({ unset: true, branch: 'feature' })).toEqual([
      'branch', '--unset-upstream', 'feature',
    ]);
  });
});

describe('upstreamCommand', () => {
  it('throws if no repoPath configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(upstreamCommand()).rejects.toThrow('No dotpull repo configured');
  });

  it('calls runGit with correct args for default show', async () => {
    runGit.mockResolvedValue({ stdout: '* main abc123 [origin/main] msg', stderr: '' });
    await upstreamCommand();
    expect(runGit).toHaveBeenCalledWith(['branch', '-vv'], '/home/user/.dotfiles');
  });

  it('calls runGit with set-upstream args', async () => {
    await upstreamCommand({ set: 'origin/main' });
    expect(runGit).toHaveBeenCalledWith(
      ['branch', '--set-upstream-to', 'origin/main'],
      '/home/user/.dotfiles'
    );
  });

  it('calls runGit with unset-upstream args', async () => {
    await upstreamCommand({ unset: true, branch: 'main' });
    expect(runGit).toHaveBeenCalledWith(
      ['branch', '--unset-upstream', 'main'],
      '/home/user/.dotfiles'
    );
  });
});
