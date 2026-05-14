import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildFetchArgs, fetchCommand } from './fetch.js';

vi.mock('../git.js', () => ({ runGit: vi.fn() }));
vi.mock('../config.js', () => ({ loadConfig: vi.fn() }));

import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
  runGit.mockResolvedValue('');
});

describe('buildFetchArgs', () => {
  it('returns base fetch args with no options', () => {
    expect(buildFetchArgs()).toEqual(['fetch']);
  });

  it('includes remote when provided', () => {
    expect(buildFetchArgs({ remote: 'origin' })).toContain('origin');
  });

  it('includes branch when provided', () => {
    const args = buildFetchArgs({ remote: 'origin', branch: 'main' });
    expect(args).toContain('main');
  });

  it('adds --all flag', () => {
    expect(buildFetchArgs({ all: true })).toContain('--all');
  });

  it('adds --prune flag', () => {
    expect(buildFetchArgs({ prune: true })).toContain('--prune');
  });

  it('adds --prune-tags flag', () => {
    expect(buildFetchArgs({ pruneTags: true })).toContain('--prune-tags');
  });

  it('adds --tags flag', () => {
    expect(buildFetchArgs({ tags: true })).toContain('--tags');
  });

  it('adds --depth with value', () => {
    expect(buildFetchArgs({ depth: 5 })).toContain('--depth=5');
  });

  it('adds --dry-run flag', () => {
    expect(buildFetchArgs({ dryRun: true })).toContain('--dry-run');
  });

  it('adds --verbose flag', () => {
    expect(buildFetchArgs({ verbose: true })).toContain('--verbose');
  });
});

describe('fetchCommand', () => {
  it('calls runGit with fetch args and repoPath', async () => {
    await fetchCommand({ remote: 'origin' });
    expect(runGit).toHaveBeenCalledWith(
      expect.arrayContaining(['fetch', 'origin']),
      '/home/user/.dotfiles'
    );
  });

  it('throws if no repoPath is configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(fetchCommand()).rejects.toThrow('No dotpull repo configured');
  });

  it('throws a wrapped error on git failure', async () => {
    runGit.mockRejectedValue(new Error('network error'));
    await expect(fetchCommand()).rejects.toThrow('Fetch failed: network error');
  });

  it('logs output when runGit returns text', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    runGit.mockResolvedValue('From github.com:user/dotfiles');
    await fetchCommand();
    expect(spy).toHaveBeenCalledWith('From github.com:user/dotfiles');
    spy.mockRestore();
  });
});
