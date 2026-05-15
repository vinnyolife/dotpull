import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildPruneArgs, buildFetchPruneArgs, prune } from './prune.js';

vi.mock('../git.js', () => ({ runGit: vi.fn().mockResolvedValue('') }));
vi.mock('../config.js', () => ({
  loadConfig: vi.fn().mockResolvedValue({ repoPath: '/home/user/.dotfiles' }),
}));

import { runGit } from '../git.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('buildPruneArgs', () => {
  it('defaults to origin remote', () => {
    expect(buildPruneArgs()).toEqual(['remote', 'prune', 'origin']);
  });

  it('uses provided remote', () => {
    expect(buildPruneArgs({ remote: 'upstream' })).toEqual([
      'remote', 'prune', 'upstream',
    ]);
  });

  it('adds --dry-run flag', () => {
    expect(buildPruneArgs({ dryRun: true })).toEqual([
      'remote', 'prune', '--dry-run', 'origin',
    ]);
  });

  it('combines dry-run with custom remote', () => {
    expect(buildPruneArgs({ dryRun: true, remote: 'backup' })).toEqual([
      'remote', 'prune', '--dry-run', 'backup',
    ]);
  });
});

describe('buildFetchPruneArgs', () => {
  it('defaults to fetch --prune origin', () => {
    expect(buildFetchPruneArgs()).toEqual(['fetch', '--prune', 'origin']);
  });

  it('adds --prune-tags when requested', () => {
    expect(buildFetchPruneArgs({ pruneTags: true })).toEqual([
      'fetch', '--prune', '--prune-tags', 'origin',
    ]);
  });

  it('uses provided remote', () => {
    expect(buildFetchPruneArgs({ remote: 'upstream' })).toEqual([
      'fetch', '--prune', 'upstream',
    ]);
  });
});

describe('prune', () => {
  it('calls remote prune by default', async () => {
    await prune();
    expect(runGit).toHaveBeenCalledWith(
      ['remote', 'prune', 'origin'],
      '/home/user/.dotfiles'
    );
  });

  it('calls fetch --prune when fetch option set', async () => {
    await prune({ fetch: true });
    expect(runGit).toHaveBeenCalledWith(
      ['fetch', '--prune', 'origin'],
      '/home/user/.dotfiles'
    );
  });

  it('passes dry-run through', async () => {
    await prune({ dryRun: true });
    expect(runGit).toHaveBeenCalledWith(
      ['remote', 'prune', '--dry-run', 'origin'],
      '/home/user/.dotfiles'
    );
  });
});
