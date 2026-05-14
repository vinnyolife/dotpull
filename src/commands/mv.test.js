import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildMvArgs, mvCommand } from './mv.js';

vi.mock('../config.js', () => ({
  loadConfig: vi.fn()
}));

vi.mock('../git.js', () => ({
  runGit: vi.fn()
}));

import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotpull' });
  runGit.mockResolvedValue({ stdout: '', stderr: '' });
});

describe('buildMvArgs', () => {
  it('builds basic mv args', () => {
    expect(buildMvArgs('old.txt', 'new.txt')).toEqual(['mv', 'old.txt', 'new.txt']);
  });

  it('adds force flag', () => {
    expect(buildMvArgs('a', 'b', { force: true })).toContain('-f');
  });

  it('adds dry-run flag', () => {
    expect(buildMvArgs('a', 'b', { dryRun: true })).toContain('-n');
  });

  it('adds verbose flag', () => {
    expect(buildMvArgs('a', 'b', { verbose: true })).toContain('-v');
  });

  it('adds skip-errors flag', () => {
    expect(buildMvArgs('a', 'b', { skipErrors: true })).toContain('-k');
  });

  it('throws if source is missing', () => {
    expect(() => buildMvArgs(null, 'dest')).toThrow('Source path is required');
  });

  it('throws if destination is missing', () => {
    expect(() => buildMvArgs('src', null)).toThrow('Destination path is required');
  });

  it('includes both paths at end of args', () => {
    const args = buildMvArgs('foo/a.sh', 'bar/a.sh');
    expect(args[args.length - 2]).toBe('foo/a.sh');
    expect(args[args.length - 1]).toBe('bar/a.sh');
  });
});

describe('mvCommand', () => {
  it('calls runGit with correct args and repoPath', async () => {
    await mvCommand('.bashrc', '.bash_profile');
    expect(runGit).toHaveBeenCalledWith(
      ['mv', '.bashrc', '.bash_profile'],
      '/home/user/.dotpull'
    );
  });

  it('throws if no repo configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(mvCommand('a', 'b')).rejects.toThrow('No dotpull repo configured');
  });

  it('passes force option through', async () => {
    await mvCommand('a', 'b', { force: true });
    expect(runGit).toHaveBeenCalledWith(
      expect.arrayContaining(['-f']),
      expect.any(String)
    );
  });

  it('logs output when verbose', async () => {
    runGit.mockResolvedValue({ stdout: 'Renaming a to b', stderr: '' });
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await mvCommand('a', 'b', { verbose: true });
    expect(spy).toHaveBeenCalledWith('Renaming a to b');
    spy.mockRestore();
  });
});
