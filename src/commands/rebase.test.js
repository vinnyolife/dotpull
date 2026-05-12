const { buildRebaseArgs, rebaseCommand } = require('./rebase');

jest.mock('../git', () => ({
  runGit: jest.fn(),
}));

jest.mock('../config', () => ({
  loadConfig: jest.fn(),
}));

const { runGit } = require('../git');
const { loadConfig } = require('../config');

describe('buildRebaseArgs', () => {
  it('returns base rebase args with no options', () => {
    expect(buildRebaseArgs()).toEqual(['rebase']);
  });

  it('includes --interactive flag', () => {
    expect(buildRebaseArgs({ interactive: true })).toContain('--interactive');
  });

  it('returns abort args and stops early', () => {
    const args = buildRebaseArgs({ abort: true });
    expect(args).toEqual(['rebase', '--abort']);
  });

  it('returns continue args and stops early', () => {
    const args = buildRebaseArgs({ continue: true });
    expect(args).toEqual(['rebase', '--continue']);
  });

  it('returns skip args and stops early', () => {
    const args = buildRebaseArgs({ skip: true });
    expect(args).toEqual(['rebase', '--skip']);
  });

  it('includes --onto with value', () => {
    const args = buildRebaseArgs({ onto: 'main' });
    expect(args).toContain('--onto');
    expect(args).toContain('main');
  });

  it('includes --autosquash flag', () => {
    expect(buildRebaseArgs({ autosquash: true })).toContain('--autosquash');
  });

  it('includes --no-ff flag', () => {
    expect(buildRebaseArgs({ noFf: true })).toContain('--no-ff');
  });

  it('appends branch name', () => {
    const args = buildRebaseArgs({ branch: 'feature/x' });
    expect(args[args.length - 1]).toBe('feature/x');
  });

  it('abort flag ignores other options like branch and interactive', () => {
    const args = buildRebaseArgs({ abort: true, branch: 'main', interactive: true });
    expect(args).toEqual(['rebase', '--abort']);
  });

  it('continue flag ignores other options like branch', () => {
    const args = buildRebaseArgs({ continue: true, branch: 'main' });
    expect(args).toEqual(['rebase', '--continue']);
  });
});

describe('rebaseCommand', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    runGit.mockResolvedValue('Successfully rebased');
  });

  it('throws if no repoPath configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(rebaseCommand()).rejects.toThrow('No dotpull repo found');
  });

  it('calls runGit with rebase args and repoPath', async () => {
    await rebaseCommand({ branch: 'main' });
    expect(runGit).toHaveBeenCalledWith(
      expect.arrayContaining(['rebase', 'main']),
      '/home/user/.dotfiles'
    );
  });

  it('returns the result from runGit', async () => {
    const result = await rebaseCommand();
    expect(result).toBe('Successfully rebased');
  });
});
