const path = require('path');
const os = require('os');
const { clone, DEFAULT_DOTFILES_DIR } = require('./clone');
const git = require('../git');
const config = require('../config');

jest.mock('../git');
jest.mock('../config');

describe('clone command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    config.loadConfig.mockReturnValue({});
    config.saveConfig.mockImplementation(() => {});
    git.isGitRepo.mockReturnValue(false);
    git.cloneRepo.mockReturnValue(true);
  });

  it('throws if no remote URL provided', async () => {
    await expect(clone()).rejects.toThrow('A remote URL is required');
    await expect(clone('')).rejects.toThrow('A remote URL is required');
  });

  it('throws if target dir is already a git repo', async () => {
    git.isGitRepo.mockReturnValue(true);
    await expect(clone('https://github.com/user/dots.git')).rejects.toThrow(
      'already contains a git repo'
    );
  });

  it('clones into default dir when no dir option given', async () => {
    await clone('https://github.com/user/dots.git');
    expect(git.cloneRepo).toHaveBeenCalledWith(
      'https://github.com/user/dots.git',
      DEFAULT_DOTFILES_DIR
    );
  });

  it('clones into custom dir when dir option provided', async () => {
    const customDir = '/tmp/my-dots';
    await clone('https://github.com/user/dots.git', { dir: customDir });
    expect(git.cloneRepo).toHaveBeenCalledWith(
      'https://github.com/user/dots.git',
      customDir
    );
  });

  it('saves config with dotfilesDir and remote after clone', async () => {
    await clone('https://github.com/user/dots.git');
    expect(config.saveConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        dotfilesDir: DEFAULT_DOTFILES_DIR,
        remote: 'https://github.com/user/dots.git'
      })
    );
  });

  it('wraps clone errors with a friendly message', async () => {
    git.cloneRepo.mockImplementation(() => { throw new Error('repository not found'); });
    await expect(clone('https://github.com/user/dots.git')).rejects.toThrow('Clone failed:');
  });

  it('returns targetDir and remoteUrl on success', async () => {
    const result = await clone('https://github.com/user/dots.git');
    expect(result).toEqual({
      targetDir: DEFAULT_DOTFILES_DIR,
      remoteUrl: 'https://github.com/user/dots.git'
    });
  });
});
