import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildUntrackArgs, untrack } from './untrack.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn().mockResolvedValue({ stdout: '', stderr: '' }),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn().mockResolvedValue({ repoPath: '/home/user/.dotfiles' }),
}));

vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn().mockResolvedValue('.DS_Store\n'),
    appendFile: vi.fn().mockResolvedValue(undefined),
  },
}));

import { runGit } from '../git.js';

describe('buildUntrackArgs', () => {
  it('returns basic rm --cached args for a file', () => {
    const args = buildUntrackArgs('.bashrc');
    expect(args).toEqual(['rm', '--cached', '--', '.bashrc']);
  });

  it('includes -r flag when recursive option is set', () => {
    const args = buildUntrackArgs('configs/', { recursive: true });
    expect(args).toContain('-r');
  });

  it('includes --force flag when force option is set', () => {
    const args = buildUntrackArgs('.vimrc', { force: true });
    expect(args).toContain('--force');
  });

  it('includes both -r and --force when both options are set', () => {
    const args = buildUntrackArgs('configs/', { recursive: true, force: true });
    expect(args).toContain('-r');
    expect(args).toContain('--force');
  });

  it('throws if no file path is provided', () => {
    expect(() => buildUntrackArgs('')).toThrow('A file path is required for untrack.');
  });

  it('throws if file path is undefined', () => {
    expect(() => buildUntrackArgs(undefined)).toThrow();
  });
});

describe('untrack', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls runGit with correct args and repoPath', async () => {
    await untrack('.bashrc');
    expect(runGit).toHaveBeenCalledWith(
      ['rm', '--cached', '--', '.bashrc'],
      '/home/user/.dotfiles'
    );
  });

  it('throws if no repoPath is configured', async () => {
    const { loadConfig } = await import('../config.js');
    loadConfig.mockResolvedValueOnce({ repoPath: null });
    await expect(untrack('.bashrc')).rejects.toThrow('No dotpull repo configured');
  });

  it('appends to .gitignore when ignore option is true', async () => {
    const fs = (await import('fs/promises')).default;
    await untrack('.envrc', { ignore: true });
    expect(fs.appendFile).toHaveBeenCalled();
  });

  it('does not touch .gitignore when ignore option is false', async () => {
    const fs = (await import('fs/promises')).default;
    await untrack('.bashrc', { ignore: false });
    expect(fs.appendFile).not.toHaveBeenCalled();
  });
});
