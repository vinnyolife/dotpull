import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildFsckArgs } from './fsck.js';
import { runGit } from '../git.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn(),
  isGitRepo: vi.fn().mockResolvedValue(true),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn().mockResolvedValue({ repoPath: '/fake/repo' }),
}));

describe('buildFsckArgs', () => {
  it('returns base fsck args with no options', () => {
    expect(buildFsckArgs({})).toEqual(['fsck']);
  });

  it('adds --unreachable flag', () => {
    expect(buildFsckArgs({ unreachable: true })).toEqual(['fsck', '--unreachable']);
  });

  it('adds --dangling flag', () => {
    expect(buildFsckArgs({ dangling: true })).toEqual(['fsck', '--dangling']);
  });

  it('adds --no-dangling flag', () => {
    expect(buildFsckArgs({ noDangling: true })).toEqual(['fsck', '--no-dangling']);
  });

  it('adds --lost-found flag', () => {
    expect(buildFsckArgs({ lostFound: true })).toEqual(['fsck', '--lost-found']);
  });

  it('adds --strict flag', () => {
    expect(buildFsckArgs({ strict: true })).toEqual(['fsck', '--strict']);
  });

  it('adds --verbose flag', () => {
    expect(buildFsckArgs({ verbose: true })).toEqual(['fsck', '--verbose']);
  });

  it('combines multiple flags', () => {
    const args = buildFsckArgs({ unreachable: true, strict: true, verbose: true });
    expect(args).toContain('--unreachable');
    expect(args).toContain('--strict');
    expect(args).toContain('--verbose');
    expect(args[0]).toBe('fsck');
  });

  it('adds specific object ref', () => {
    expect(buildFsckArgs({ object: 'HEAD' })).toEqual(['fsck', 'HEAD']);
  });
});
