import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildVerifyCommitArgs } from './verify-commit.js';
import { runGit } from '../git.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn(),
  isGitRepo: vi.fn().mockResolvedValue(true),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn().mockResolvedValue({ repoPath: '/fake/repo' }),
}));

describe('buildVerifyCommitArgs', () => {
  it('defaults to HEAD when no commit specified', () => {
    expect(buildVerifyCommitArgs({})).toEqual(['verify-commit', 'HEAD']);
  });

  it('uses provided commit hash', () => {
    expect(buildVerifyCommitArgs({ commit: 'abc123' })).toEqual(['verify-commit', 'abc123']);
  });

  it('adds --verbose flag', () => {
    const args = buildVerifyCommitArgs({ verbose: true, commit: 'HEAD' });
    expect(args).toContain('--verbose');
    expect(args).toContain('HEAD');
  });

  it('adds --raw flag', () => {
    const args = buildVerifyCommitArgs({ raw: true });
    expect(args).toContain('--raw');
  });

  it('handles multiple commits array', () => {
    const args = buildVerifyCommitArgs({ commits: ['abc123', 'def456'] });
    expect(args).toEqual(['verify-commit', 'abc123', 'def456']);
  });

  it('prefers commits array over single commit', () => {
    const args = buildVerifyCommitArgs({ commits: ['abc123'], commit: 'HEAD' });
    expect(args).toContain('abc123');
    expect(args).not.toContain('HEAD');
  });

  it('combines verbose and raw flags', () => {
    const args = buildVerifyCommitArgs({ verbose: true, raw: true, commit: 'HEAD' });
    expect(args).toContain('--verbose');
    expect(args).toContain('--raw');
    expect(args[0]).toBe('verify-commit');
  });
});
