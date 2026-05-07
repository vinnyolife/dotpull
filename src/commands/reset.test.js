import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildResetArgs, resetCommand } from './reset.js';
import * as git from '../git.js';
import * as config from '../config.js';

vi.mock('../git.js');
vi.mock('../config.js');

describe('buildResetArgs', () => {
  it('defaults to --mixed HEAD', () => {
    expect(buildResetArgs({})).toEqual(['reset', '--mixed', 'HEAD']);
  });

  it('uses --soft when soft flag is set', () => {
    expect(buildResetArgs({ soft: true })).toEqual(['reset', '--soft', 'HEAD']);
  });

  it('uses --hard when hard flag is set', () => {
    expect(buildResetArgs({ hard: true })).toEqual(['reset', '--hard', 'HEAD']);
  });

  it('appends a custom commit ref', () => {
    expect(buildResetArgs({ commit: 'abc123' })).toEqual(['reset', '--mixed', 'abc123']);
  });

  it('combines hard flag with commit ref', () => {
    expect(buildResetArgs({ hard: true, commit: 'HEAD~2' })).toEqual(['reset', '--hard', 'HEAD~2']);
  });

  it('appends specific files after --', () => {
    expect(buildResetArgs({ files: ['a.txt', 'b.txt'] })).toEqual(['reset', '--mixed', 'HEAD', '--', 'a.txt', 'b.txt']);
  });
});

describe('resetCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    config.loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    git.runGit.mockResolvedValue('');
  });

  it('runs git reset with resolved args', async () => {
    await resetCommand({ hard: true, commit: 'HEAD~1' });
    expect(git.runGit).toHaveBeenCalledWith(
      '/home/user/.dotfiles',
      ['reset', '--hard', 'HEAD~1']
    );
  });

  it('throws if config is missing repoPath', async () => {
    config.loadConfig.mockResolvedValue({});
    await expect(resetCommand({})).rejects.toThrow();
  });
});
