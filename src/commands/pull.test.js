import { jest } from '@jest/globals';
import { pullCommand } from './pull.js';

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

describe('pull command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pull latest changes from remote', async () => {
    mockLoadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles', remote: 'origin' });
    mockIsGitRepo.mockResolvedValue(true);
    mockRunGit.mockResolvedValue({ stdout: 'Already up to date.', stderr: '' });

    const result = await pullCommand();

    expect(mockRunGit).toHaveBeenCalledWith('/home/user/.dotfiles', ['pull', 'origin', 'main']);
    expect(result.success).toBe(true);
  });

  it('should fail if no config found', async () => {
    mockLoadConfig.mockResolvedValue(null);

    await expect(pullCommand()).rejects.toThrow('No dotpull config found');
  });

  it('should fail if directory is not a git repo', async () => {
    mockLoadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles', remote: 'origin' });
    mockIsGitRepo.mockResolvedValue(false);

    await expect(pullCommand()).rejects.toThrow('Not a git repository');
  });

  it('should use branch from config if specified', async () => {
    mockLoadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles', remote: 'origin', branch: 'master' });
    mockIsGitRepo.mockResolvedValue(true);
    mockRunGit.mockResolvedValue({ stdout: 'Updating abc..def', stderr: '' });

    await pullCommand();

    expect(mockRunGit).toHaveBeenCalledWith('/home/user/.dotfiles', ['pull', 'origin', 'master']);
  });

  it('should report when already up to date', async () => {
    mockLoadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles', remote: 'origin' });
    mockIsGitRepo.mockResolvedValue(true);
    mockRunGit.mockResolvedValue({ stdout: 'Already up to date.', stderr: '' });

    const result = await pullCommand();

    expect(result.alreadyUpToDate).toBe(true);
  });
});
