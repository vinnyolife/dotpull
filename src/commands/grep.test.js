import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildGrepArgs } from './grep.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn(),
  isGitRepo: vi.fn(),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn(),
}));

import { runGit, isGitRepo } from '../git.js';
import { loadConfig } from '../config.js';
import { grep } from './grep.js';

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
  isGitRepo.mockResolvedValue(true);
});

describe('buildGrepArgs', () => {
  it('returns basic grep args with pattern', () => {
    expect(buildGrepArgs('alias', {})).toEqual(['grep', 'alias']);
  });

  it('adds -n flag for line numbers', () => {
    expect(buildGrepArgs('alias', { lineNumber: true })).toEqual(['grep', '-n', 'alias']);
  });

  it('adds -i flag for case insensitive', () => {
    expect(buildGrepArgs('alias', { ignoreCase: true })).toEqual(['grep', '-i', 'alias']);
  });

  it('adds -l flag for files only', () => {
    expect(buildGrepArgs('alias', { filesOnly: true })).toEqual(['grep', '-l', 'alias']);
  });

  it('adds -c flag for count', () => {
    expect(buildGrepArgs('alias', { count: true })).toEqual(['grep', '-c', 'alias']);
  });

  it('adds --and with multiple patterns', () => {
    expect(buildGrepArgs('alias', { and: 'export' })).toEqual(['grep', '-e', 'alias', '--and', '-e', 'export']);
  });

  it('combines multiple flags', () => {
    expect(buildGrepArgs('TODO', { lineNumber: true, ignoreCase: true })).toEqual(['grep', '-n', '-i', 'TODO']);
  });

  it('appends pathspec when provided', () => {
    expect(buildGrepArgs('alias', { path: '.zshrc' })).toEqual(['grep', 'alias', '--', '.zshrc']);
  });
});

describe('grep command', () => {
  it('runs grep with correct args', async () => {
    runGit.mockResolvedValue('10:alias ll="ls -la"');
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await grep('alias', {});

    expect(isGitRepo).toHaveBeenCalledWith('/home/user/.dotfiles');
    expect(runGit).toHaveBeenCalledWith(['grep', 'alias'], '/home/user/.dotfiles');
    expect(consoleSpy).toHaveBeenCalledWith('10:alias ll="ls -la"');
    consoleSpy.mockRestore();
  });

  it('throws if not a git repo', async () => {
    isGitRepo.mockResolvedValue(false);
    await expect(grep('alias', {})).rejects.toThrow('not a git repository');
  });

  it('warns when grep finds no matches', async () => {
    runGit.mockResolvedValue('');
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await grep('nothinghere', {});
    expect(consoleSpy).toHaveBeenCalledWith('No matches found.');
    consoleSpy.mockRestore();
  });
});
