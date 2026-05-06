import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkoutCommand, buildCheckoutArgs } from './checkout.js';
import { loadConfig } from '../config.js';
import { runGit } from '../git.js';

vi.mock('../config.js');
vi.mock('../git.js');

const mockConfig = { repoPath: '/home/user/.dotfiles' };

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue(mockConfig);
  runGit.mockResolvedValue('');
});

describe('buildCheckoutArgs', () => {
  it('builds args for switching to a branch', () => {
    expect(buildCheckoutArgs({ branch: 'feature/new' })).toEqual(['checkout', 'feature/new']);
  });

  it('builds args for creating a new branch', () => {
    expect(buildCheckoutArgs({ branch: 'dev', create: true })).toEqual(['checkout', '-b', 'dev']);
  });

  it('builds args for detached HEAD at a commit', () => {
    expect(buildCheckoutArgs({ branch: 'abc1234', detach: true })).toEqual(['checkout', '--detach', 'abc1234']);
  });

  it('builds args for checking out specific files', () => {
    expect(buildCheckoutArgs({ branch: 'main', files: ['.bashrc', '.vimrc'] })).toEqual([
      'checkout', 'main', '--', '.bashrc', '.vimrc'
    ]);
  });

  it('throws if no branch provided', () => {
    expect(() => buildCheckoutArgs({})).toThrow('branch is required');
  });
});

describe('checkoutCommand', () => {
  it('runs git checkout with correct args', async () => {
    await checkoutCommand({ branch: 'main' });
    expect(loadConfig).toHaveBeenCalled();
    expect(runGit).toHaveBeenCalledWith(mockConfig.repoPath, ['checkout', 'main']);
  });

  it('creates a new branch when --create is passed', async () => {
    await checkoutCommand({ branch: 'feature/x', create: true });
    expect(runGit).toHaveBeenCalledWith(mockConfig.repoPath, ['checkout', '-b', 'feature/x']);
  });

  it('throws and logs error on git failure', async () => {
    runGit.mockRejectedValue(new Error('pathspec not found'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(checkoutCommand({ branch: 'ghost' })).rejects.toThrow('pathspec not found');
    consoleSpy.mockRestore();
  });
});
