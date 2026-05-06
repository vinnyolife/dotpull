const { branchCommand, buildBranchArgs } = require('./branch');
const { runGit, isGitRepo } = require('../git');
const { loadConfig } = require('../config');

jest.mock('../git');
jest.mock('../config');

describe('buildBranchArgs', () => {
  it('returns base branch args with no options', () => {
    expect(buildBranchArgs()).toEqual(['branch']);
  });

  it('adds --all flag', () => {
    expect(buildBranchArgs({ all: true })).toEqual(['branch', '--all']);
  });

  it('adds --remotes flag', () => {
    expect(buildBranchArgs({ remotes: true })).toEqual(['branch', '--remotes']);
  });

  it('adds -d for delete', () => {
    expect(buildBranchArgs({ delete: 'old-branch' })).toEqual(['branch', '-d', 'old-branch']);
  });

  it('adds -D for force delete', () => {
    expect(buildBranchArgs({ forceDelete: 'old-branch' })).toEqual(['branch', '-D', 'old-branch']);
  });

  it('adds branch name for create', () => {
    expect(buildBranchArgs({ create: 'new-feature' })).toEqual(['branch', 'new-feature']);
  });

  it('uses checkout -b for checkout option', () => {
    expect(buildBranchArgs({ checkout: 'new-branch' })).toEqual(['checkout', '-b', 'new-branch']);
  });

  it('adds -v for verbose listing', () => {
    expect(buildBranchArgs({ verbose: true })).toEqual(['branch', '-v']);
  });
});

describe('branchCommand', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    isGitRepo.mockResolvedValue(true);
    runGit.mockResolvedValue('  main\n* dev\n');
  });

  it('returns trimmed branch output', async () => {
    const result = await branchCommand();
    expect(result).toBe('main\n* dev');
  });

  it('throws if repoPath is not configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(branchCommand()).rejects.toThrow('No dotfiles repo configured');
  });

  it('throws if path is not a git repo', async () => {
    isGitRepo.mockResolvedValue(false);
    await expect(branchCommand()).rejects.toThrow('not a valid git repository');
  });

  it('passes options to runGit', async () => {
    await branchCommand({ all: true });
    expect(runGit).toHaveBeenCalledWith(['branch', '--all'], '/home/user/.dotfiles');
  });

  it('handles delete branch option', async () => {
    runGit.mockResolvedValue('Deleted branch old-branch');
    const result = await branchCommand({ delete: 'old-branch' });
    expect(result).toBe('Deleted branch old-branch');
    expect(runGit).toHaveBeenCalledWith(['branch', '-d', 'old-branch'], '/home/user/.dotfiles');
  });
});
