import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildLsRemoteArgs, lsRemote } from './ls-remote.js';

vi.mock('../git.js', () => ({ runGit: vi.fn() }));
vi.mock('../config.js', () => ({ loadConfig: vi.fn() }));

import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('buildLsRemoteArgs', () => {
  it('returns base args with no options', () => {
    expect(buildLsRemoteArgs()).toEqual(['ls-remote']);
  });

  it('includes --heads flag', () => {
    expect(buildLsRemoteArgs({ heads: true })).toContain('--heads');
  });

  it('includes --tags flag', () => {
    expect(buildLsRemoteArgs({ tags: true })).toContain('--tags');
  });

  it('includes --refs flag', () => {
    expect(buildLsRemoteArgs({ refs: true })).toContain('--refs');
  });

  it('includes --symref flag', () => {
    expect(buildLsRemoteArgs({ symref: true })).toContain('--symref');
  });

  it('includes --get-url flag', () => {
    expect(buildLsRemoteArgs({ getUrl: true })).toContain('--get-url');
  });

  it('includes remote name', () => {
    const args = buildLsRemoteArgs({ remote: 'origin' });
    expect(args).toContain('origin');
  });

  it('includes patterns after remote', () => {
    const args = buildLsRemoteArgs({ remote: 'origin', patterns: ['refs/heads/*'] });
    expect(args).toContain('origin');
    expect(args).toContain('refs/heads/*');
  });

  it('includes --upload-pack with value', () => {
    const args = buildLsRemoteArgs({ uploadPack: '/usr/bin/git-upload-pack' });
    expect(args).toContain('--upload-pack');
    expect(args).toContain('/usr/bin/git-upload-pack');
  });

  it('combines multiple flags', () => {
    const args = buildLsRemoteArgs({ heads: true, tags: true, remote: 'upstream' });
    expect(args).toContain('--heads');
    expect(args).toContain('--tags');
    expect(args).toContain('upstream');
  });
});

describe('lsRemote', () => {
  it('throws if no repoPath configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(lsRemote()).rejects.toThrow('No dotpull repo configured');
  });

  it('calls runGit with correct args and repoPath', async () => {
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    runGit.mockResolvedValue('abc123\trefs/heads/main\n');
    const result = await lsRemote({ remote: 'origin', heads: true });
    expect(runGit).toHaveBeenCalledWith(
      ['ls-remote', '--heads', 'origin'],
      '/home/user/.dotfiles'
    );
    expect(result).toBe('abc123\trefs/heads/main');
  });

  it('returns trimmed output', async () => {
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    runGit.mockResolvedValue('  deadbeef\trefs/tags/v1.0  \n');
    const result = await lsRemote({ tags: true });
    expect(result).toBe('deadbeef\trefs/tags/v1.0');
  });
});
