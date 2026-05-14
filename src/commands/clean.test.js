import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildCleanArgs, clean } from './clean.js';

vi.mock('../git.js', () => ({ runGit: vi.fn() }));
vi.mock('../config.js', () => ({ loadConfig: vi.fn() }));

import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
});

describe('buildCleanArgs', () => {
  it('returns base clean command with no options', () => {
    expect(buildCleanArgs()).toEqual(['clean']);
  });

  it('adds -f for force', () => {
    expect(buildCleanArgs({ force: true })).toContain('-f');
  });

  it('adds -n for dry run', () => {
    expect(buildCleanArgs({ dryRun: true })).toContain('-n');
  });

  it('adds -d for directories', () => {
    expect(buildCleanArgs({ force: true, directories: true })).toContain('-d');
  });

  it('adds -x for ignored files', () => {
    expect(buildCleanArgs({ force: true, ignored: true })).toContain('-x');
  });

  it('adds -X for only ignored files', () => {
    expect(buildCleanArgs({ force: true, onlyIgnored: true })).toContain('-X');
  });

  it('adds -q for quiet', () => {
    expect(buildCleanArgs({ force: true, quiet: true })).toContain('-q');
  });

  it('appends paths after --', () => {
    const args = buildCleanArgs({ force: true, paths: ['src/', 'tmp/'] });
    expect(args).toContain('--');
    expect(args).toContain('src/');
    expect(args).toContain('tmp/');
  });

  it('does not add -- when no paths provided', () => {
    const args = buildCleanArgs({ force: true });
    expect(args).not.toContain('--');
  });
});

describe('clean', () => {
  it('throws if neither force nor dryRun is set', async () => {
    await expect(clean({})).rejects.toThrow(/force or --dry-run/);
  });

  it('calls runGit with correct args and repoPath for dry run', async () => {
    runGit.mockResolvedValue('Would remove tmp/foo.txt');
    await clean({ dryRun: true });
    expect(runGit).toHaveBeenCalledWith(
      expect.arrayContaining(['clean', '-n']),
      '/home/user/.dotfiles'
    );
  });

  it('prints output when files would be removed', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    runGit.mockResolvedValue('Would remove tmp/foo.txt');
    await clean({ dryRun: true });
    expect(consoleSpy).toHaveBeenCalledWith('Would remove tmp/foo.txt');
    consoleSpy.mockRestore();
  });

  it('prints nothing to clean when dry run yields empty output', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    runGit.mockResolvedValue('');
    await clean({ dryRun: true });
    expect(consoleSpy).toHaveBeenCalledWith('Nothing to clean.');
    consoleSpy.mockRestore();
  });

  it('works with force flag', async () => {
    runGit.mockResolvedValue('Removing tmp/foo.txt');
    await clean({ force: true });
    expect(runGit).toHaveBeenCalledWith(
      expect.arrayContaining(['clean', '-f']),
      '/home/user/.dotfiles'
    );
  });
});
