import { jest } from '@jest/globals';
import { diffCommand } from './diff.js';
import * as git from '../git.js';
import * as config from '../config.js';

jest.mock('../git.js');
jest.mock('../config.js');

describe('diffCommand', () => {
  const mockConfig = {
    repoPath: '/home/user/.dotfiles',
    remote: 'origin'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    config.loadConfig.mockResolvedValue(mockConfig);
  });

  it('should show diff output when there are changes', async () => {
    const diffOutput = 'diff --git a/.bashrc b/.bashrc\n+alias ll="ls -la"';
    git.runGit.mockResolvedValue(diffOutput);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await diffCommand({});

    expect(git.runGit).toHaveBeenCalledWith(
      ['diff', 'HEAD'],
      mockConfig.repoPath
    );
    expect(consoleSpy).toHaveBeenCalledWith(diffOutput);
    consoleSpy.mockRestore();
  });

  it('should show staged diff when --staged flag is passed', async () => {
    const diffOutput = 'diff --git a/.vimrc b/.vimrc\n+set number';
    git.runGit.mockResolvedValue(diffOutput);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await diffCommand({ staged: true });

    expect(git.runGit).toHaveBeenCalledWith(
      ['diff', '--staged'],
      mockConfig.repoPath
    );
    consoleSpy.mockRestore();
  });

  it('should print message when no changes detected', async () => {
    git.runGit.mockResolvedValue('');

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await diffCommand({});

    expect(consoleSpy).toHaveBeenCalledWith('No changes detected.');
    consoleSpy.mockRestore();
  });

  it('should handle diff for a specific file', async () => {
    const diffOutput = 'diff --git a/.zshrc b/.zshrc\n-old line\n+new line';
    git.runGit.mockResolvedValue(diffOutput);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await diffCommand({ file: '.zshrc' });

    expect(git.runGit).toHaveBeenCalledWith(
      ['diff', 'HEAD', '--', '.zshrc'],
      mockConfig.repoPath
    );
    consoleSpy.mockRestore();
  });

  it('should throw if config is not found', async () => {
    config.loadConfig.mockRejectedValue(new Error('Config not found'));

    await expect(diffCommand({})).rejects.toThrow('Config not found');
  });
});
