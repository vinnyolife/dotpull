import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildBisectArgs, bisectCommand } from './bisect.js';
import * as git from '../git.js';
import * as config from '../config.js';

vi.mock('../git.js');
vi.mock('../config.js');

describe('buildBisectArgs', () => {
  it('defaults to log subcommand', () => {
    expect(buildBisectArgs({})).toEqual(['bisect', 'log']);
  });

  it('builds start subcommand', () => {
    expect(buildBisectArgs({ subcommand: 'start' })).toEqual(['bisect', 'start']);
  });

  it('builds good subcommand with a ref', () => {
    expect(buildBisectArgs({ subcommand: 'good', args: ['abc123'] })).toEqual(['bisect', 'good', 'abc123']);
  });

  it('builds bad subcommand', () => {
    expect(buildBisectArgs({ subcommand: 'bad' })).toEqual(['bisect', 'bad']);
  });

  it('builds reset subcommand with optional ref', () => {
    expect(buildBisectArgs({ subcommand: 'reset', args: ['HEAD'] })).toEqual(['bisect', 'reset', 'HEAD']);
  });

  it('builds run subcommand with script', () => {
    expect(buildBisectArgs({ subcommand: 'run', args: ['./test.sh'] })).toEqual(['bisect', 'run', './test.sh']);
  });

  it('throws on unknown subcommand', () => {
    expect(() => buildBisectArgs({ subcommand: 'invalid' })).toThrow('Unknown bisect subcommand: invalid');
  });
});

describe('bisectCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    config.loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    git.runGit.mockResolvedValue('bisecting: 3 revisions left');
  });

  it('calls runGit with correct args', async () => {
    await bisectCommand({ subcommand: 'start' });
    expect(git.runGit).toHaveBeenCalledWith(
      '/home/user/.dotfiles',
      ['bisect', 'start']
    );
  });

  it('prints output when present', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await bisectCommand({ subcommand: 'log' });
    expect(spy).toHaveBeenCalledWith('bisecting: 3 revisions left');
    spy.mockRestore();
  });

  it('does not print when output is empty', async () => {
    git.runGit.mockResolvedValue('');
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await bisectCommand({ subcommand: 'reset' });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('throws when repoPath is missing', async () => {
    config.loadConfig.mockResolvedValue({});
    await expect(bisectCommand({ subcommand: 'start' })).rejects.toThrow(
      'No dotfiles repo configured'
    );
  });
});
