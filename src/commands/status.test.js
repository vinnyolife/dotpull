import { jest } from '@jest/globals';
import { statusCommand } from './status.js';

const mockRunGit = jest.fn();
const mockLoadConfig = jest.fn();
const mockIsGitRepo = jest.fn();

jest.mock('../git.js', () => ({
  runGit: (...args) => mockRunGit(...args),
  isGitRepo: (...args) => mockIsGitRepo(...args),
}));

jest.mock('../config.js', () => ({
  loadConfig: (...args) => mockLoadConfig(...args),
}));

describe('status command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return clean status when nothing changed', async () => {
    mockLoadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    mockIsGitRepo.mockResolvedValue(true);
    mockRunGit.mockResolvedValue({ stdout: '', stderr: '' });

    const result = await statusCommand();

    expect(result.clean).toBe(true);
    expect(result.staged).toHaveLength(0);
    expect(result.unstaged).toHaveLength(0);
    expect(result.untracked).toHaveLength(0);
  });

  it('should detect staged files', async () => {
    mockLoadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    mockIsGitRepo.mockResolvedValue(true);
    mockRunGit.mockResolvedValue({ stdout: 'M  .bashrc\nA  .vimrc', stderr: '' });

    const result = await statusCommand();

    expect(result.clean).toBe(false);
    expect(result.staged).toContain('.bashrc');
    expect(result.staged).toContain('.vimrc');
  });

  it('should detect untracked files', async () => {
    mockLoadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    mockIsGitRepo.mockResolvedValue(true);
    mockRunGit.mockResolvedValue({ stdout: '?? .zshrc', stderr: '' });

    const result = await statusCommand();

    expect(result.untracked).toContain('.zshrc');
    expect(result.clean).toBe(false);
  });

  it('should throw if config is missing', async () => {
    mockLoadConfig.mockResolvedValue(null);

    await expect(statusCommand()).rejects.toThrow('No dotpull config found');
  });

  it('should throw if not a git repo', async () => {
    mockLoadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    mockIsGitRepo.mockResolvedValue(false);

    await expect(statusCommand()).rejects.toThrow('Not a git repository');
  });
});
