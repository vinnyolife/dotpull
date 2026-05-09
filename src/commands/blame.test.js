import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildBlameArgs, blame } from './blame.js';

vi.mock('../config.js', () => ({
  loadConfig: vi.fn(),
}));

vi.mock('../git.js', () => ({
  runGit: vi.fn(),
}));

import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('buildBlameArgs', () => {
  it('builds basic blame args for a file', () => {
    const args = buildBlameArgs('.bashrc');
    expect(args).toEqual(['blame', '.bashrc']);
  });

  it('includes -L flag when line range is provided', () => {
    const args = buildBlameArgs('.bashrc', { line: '10,20' });
    expect(args).toContain('-L');
    expect(args).toContain('10,20');
  });

  it('includes -e flag for show email', () => {
    const args = buildBlameArgs('.vimrc', { showEmail: true });
    expect(args).toContain('-e');
  });

  it('includes -t flag for show timestamp', () => {
    const args = buildBlameArgs('.vimrc', { showTimestamp: true });
    expect(args).toContain('-t');
  });

  it('includes -w flag for ignore whitespace', () => {
    const args = buildBlameArgs('.vimrc', { ignoreWhitespace: true });
    expect(args).toContain('-w');
  });

  it('includes --porcelain flag', () => {
    const args = buildBlameArgs('.vimrc', { porcelain: true });
    expect(args).toContain('--porcelain');
  });

  it('includes commit hash and -- separator when commit is provided', () => {
    const args = buildBlameArgs('.bashrc', { commit: 'abc123' });
    expect(args).toContain('abc123');
    expect(args).toContain('--');
  });

  it('throws if no file is provided', () => {
    expect(() => buildBlameArgs()).toThrow('A file path is required for blame');
  });

  it('combines multiple options', () => {
    const args = buildBlameArgs('.zshrc', { showEmail: true, ignoreWhitespace: true });
    expect(args).toContain('-e');
    expect(args).toContain('-w');
    expect(args).toContain('.zshrc');
  });
});

describe('blame', () => {
  it('runs git blame with the correct args', async () => {
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    runGit.mockResolvedValue('abc123 (.bashrc)');

    await blame('.bashrc');

    expect(runGit).toHaveBeenCalledWith(['blame', '.bashrc'], '/home/user/.dotfiles');
  });

  it('throws if no repoPath is configured', async () => {
    loadConfig.mockResolvedValue({});

    await expect(blame('.bashrc')).rejects.toThrow('No dotpull repo configured');
  });
});
