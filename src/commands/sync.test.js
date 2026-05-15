import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildSyncArgs, sync } from './sync.js';

vi.mock('../git.js', () => ({ runGit: vi.fn() }));
vi.mock('../config.js', () => ({ loadConfig: vi.fn() }));

import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

describe('buildSyncArgs', () => {
  it('defaults to rebase pull and plain push', () => {
    const { pullArgs, pushArgs } = buildSyncArgs();
    expect(pullArgs).toEqual(['pull', '--rebase']);
    expect(pushArgs).toEqual(['push']);
  });

  it('respects rebase: false', () => {
    const { pullArgs } = buildSyncArgs({ rebase: false });
    expect(pullArgs).not.toContain('--rebase');
  });

  it('appends remote and branch when provided', () => {
    const { pullArgs, pushArgs } = buildSyncArgs({ remote: 'origin', branch: 'main' });
    expect(pullArgs).toContain('origin');
    expect(pullArgs).toContain('main');
    expect(pushArgs).toContain('origin');
    expect(pushArgs).toContain('main');
  });

  it('adds --force-with-lease when force is true', () => {
    const { pushArgs } = buildSyncArgs({ force: true });
    expect(pushArgs).toContain('--force-with-lease');
  });
});

describe('sync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    runGit.mockResolvedValue('');
  });

  it('runs pull then push against the configured repo path', async () => {
    await sync();
    expect(runGit).toHaveBeenCalledTimes(2);
    const [firstCall, secondCall] = runGit.mock.calls;
    expect(firstCall[0][0]).toBe('pull');
    expect(secondCall[0][0]).toBe('push');
    expect(firstCall[1]).toBe('/home/user/.dotfiles');
  });

  it('throws when repoPath is not configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(sync()).rejects.toThrow('No dotfiles repo configured');
  });

  it('passes options through to buildSyncArgs', async () => {
    await sync({ remote: 'upstream', branch: 'dev', force: true });
    const pushCall = runGit.mock.calls[1][0];
    expect(pushCall).toContain('upstream');
    expect(pushCall).toContain('dev');
    expect(pushCall).toContain('--force-with-lease');
  });
});
