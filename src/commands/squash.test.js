import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildSquashArgs, squashCommand } from './squash.js';
import * as git from '../git.js';
import * as config from '../config.js';

vi.mock('../git.js');
vi.mock('../config.js');

const MOCK_CONFIG = { repoPath: '/home/user/.dotfiles' };

beforeEach(() => {
  vi.clearAllMocks();
  config.loadConfig.mockResolvedValue(MOCK_CONFIG);
  git.runGit.mockResolvedValue('');
});

describe('buildSquashArgs', () => {
  it('returns correct args for basic squash', () => {
    const result = buildSquashArgs(3);
    expect(result.args).toEqual(['rebase', '-i', 'HEAD~3']);
  });

  it('throws if count is less than 2', () => {
    expect(() => buildSquashArgs(1)).toThrow('squash requires a count of at least 2');
  });

  it('throws if count is missing', () => {
    expect(() => buildSquashArgs()).toThrow('squash requires a count of at least 2');
  });

  it('includes noEdit flag when specified', () => {
    const result = buildSquashArgs(4, { noEdit: true });
    expect(result.autosquash).toBe(true);
    expect(result.gitFlags).toContain('-c');
  });

  it('carries message through when provided', () => {
    const result = buildSquashArgs(2, { message: 'my squash' });
    expect(result.message).toBe('my squash');
  });
});

describe('squashCommand', () => {
  it('calls reset --soft and commit with message', async () => {
    await squashCommand(3, { message: 'combined commit' });

    expect(git.runGit).toHaveBeenCalledWith(
      ['reset', '--soft', 'HEAD~3'],
      MOCK_CONFIG.repoPath
    );
    expect(git.runGit).toHaveBeenCalledWith(
      ['commit', '-m', 'combined commit'],
      MOCK_CONFIG.repoPath
    );
  });

  it('throws if no message provided', async () => {
    await expect(squashCommand(3, {})).rejects.toThrow('--message is required');
  });

  it('throws if count is less than 2', async () => {
    await expect(squashCommand(1, { message: 'x' })).rejects.toThrow('count >= 2');
  });

  it('throws if count is not provided', async () => {
    await expect(squashCommand(undefined, { message: 'x' })).rejects.toThrow('count >= 2');
  });
});
