import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildSwitchArgs, switchCommand } from './switch.js';
import * as git from '../git.js';
import * as config from '../config.js';

vi.mock('../git.js');
vi.mock('../config.js');

beforeEach(() => {
  vi.clearAllMocks();
  config.loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
  git.runGit.mockResolvedValue('');
});

describe('buildSwitchArgs', () => {
  it('switches to a branch by name', () => {
    expect(buildSwitchArgs({ branch: 'main' })).toEqual(['switch', 'main']);
  });

  it('creates and switches to a new branch', () => {
    expect(buildSwitchArgs({ create: 'feature/new' })).toEqual(['switch', '-c', 'feature/new']);
  });

  it('force-creates a branch with -C', () => {
    expect(buildSwitchArgs({ forcCreate: 'hotfix' })).toEqual(['switch', '-C', 'hotfix']);
  });

  it('detaches HEAD', () => {
    expect(buildSwitchArgs({ detach: true, branch: 'abc123' })).toEqual(['switch', '--detach', 'abc123']);
  });

  it('creates an orphan branch', () => {
    expect(buildSwitchArgs({ orphan: 'fresh-start' })).toEqual(['switch', '--orphan', 'fresh-start']);
  });

  it('discards local changes on switch', () => {
    expect(buildSwitchArgs({ discard: true, branch: 'main' })).toEqual(['switch', '--discard-changes', 'main']);
  });

  it('disables remote tracking guess', () => {
    expect(buildSwitchArgs({ guess: false, branch: 'origin/dev' })).toEqual(['switch', '--no-guess', 'origin/dev']);
  });

  it('sets explicit tracking', () => {
    expect(buildSwitchArgs({ track: 'origin/main', branch: 'main' })).toEqual(['switch', '--track', 'origin/main', 'main']);
  });

  it('returns base args with no options', () => {
    expect(buildSwitchArgs()).toEqual(['switch']);
  });
});

describe('switchCommand', () => {
  it('throws if no branch specified', async () => {
    await expect(switchCommand({})).rejects.toThrow('Branch name is required');
  });

  it('calls runGit with correct args', async () => {
    await switchCommand({ branch: 'dev' });
    expect(git.runGit).toHaveBeenCalledWith(['switch', 'dev'], '/home/user/.dotfiles');
  });

  it('passes create flag correctly', async () => {
    await switchCommand({ create: 'new-branch' });
    expect(git.runGit).toHaveBeenCalledWith(['switch', '-c', 'new-branch'], '/home/user/.dotfiles');
  });
});
