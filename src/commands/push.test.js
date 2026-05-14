const { push } = require('./push');
const { loadConfig } = require('../config');
const { runGit, isGitRepo } = require('../git');

jest.mock('../config');
jest.mock('../git');
jest.mock('os', () => ({ hostname: () => 'test-machine' }));

describe('push command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    loadConfig.mockResolvedValue({
      repoPath: '/home/user/.dotfiles',
      branch: 'main',
      remote: 'origin',
    });
    isGitRepo.mockResolvedValue(true);
  });

  it('should push changes when there are uncommitted files', async () => {
    runGit
      .mockResolvedValueOnce('') // add -A
      .mockResolvedValueOnce('M .bashrc\n') // status --porcelain
      .mockResolvedValueOnce('') // commit
      .mockResolvedValueOnce(''); // push

    const result = await push();

    expect(result.pushed).toBe(true);
    expect(result.remote).toBe('origin');
    expect(result.branch).toBe('main');
    expect(runGit).toHaveBeenCalledWith(['push', 'origin', 'main'], '/home/user/.dotfiles');
  });

  it('should use custom commit message when provided', async () => {
    runGit
      .mockResolvedValueOnce('')
      .mockResolvedValueOnce('M .vimrc\n')
      .mockResolvedValueOnce('')
      .mockResolvedValueOnce('');

    await push({ message: 'chore: add vimrc' });

    expect(runGit).toHaveBeenCalledWith(
      ['commit', '-m', 'chore: add vimrc'],
      '/home/user/.dotfiles'
    );
  });

  it('should use hostname-based default commit message when no message provided', async () => {
    runGit
      .mockResolvedValueOnce('')
      .mockResolvedValueOnce('M .bashrc\n')
      .mockResolvedValueOnce('')
      .mockResolvedValueOnce('');

    await push();

    expect(runGit).toHaveBeenCalledWith(
      ['commit', '-m', expect.stringContaining('test-machine')],
      '/home/user/.dotfiles'
    );
  });

  it('should skip commit and push when working tree is clean', async () => {
    runGit
      .mockResolvedValueOnce('') // add -A
      .mockResolvedValueOnce('  '); // status --porcelain (empty)

    const result = await push();

    expect(result.pushed).toBe(false);
    expect(result.reason).toBe('nothing_to_commit');
    expect(runGit).toHaveBeenCalledTimes(2);
  });

  it('should throw if no repo is configured', async () => {
    loadConfig.mockResolvedValue({});

    await expect(push()).rejects.toThrow('No dotfiles repo configured');
  });

  it('should throw if repoPath is not a git repo', async () => {
    isGitRepo.mockResolvedValue(false);

    await expect(push()).rejects.toThrow('is not a valid git repository');
  });
});
