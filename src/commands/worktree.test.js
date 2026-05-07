import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildWorktreeArgs } from './worktree.js';

describe('buildWorktreeArgs', () => {
  it('returns list args by default', () => {
    const args = buildWorktreeArgs({ list: true });
    expect(args).toEqual(['worktree', 'list']);
  });

  it('returns list with --porcelain flag', () => {
    const args = buildWorktreeArgs({ list: true, porcelain: true });
    expect(args).toEqual(['worktree', 'list', '--porcelain']);
  });

  it('adds a new worktree', () => {
    const args = buildWorktreeArgs({ add: true, path: '../feature-branch', branch: 'feature' });
    expect(args).toEqual(['worktree', 'add', '../feature-branch', 'feature']);
  });

  it('adds a new worktree without branch', () => {
    const args = buildWorktreeArgs({ add: true, path: '../detached' });
    expect(args).toEqual(['worktree', 'add', '../detached']);
  });

  it('adds worktree with -b to create new branch', () => {
    const args = buildWorktreeArgs({ add: true, path: '../new-feat', branch: 'new-feat', newBranch: true });
    expect(args).toEqual(['worktree', 'add', '-b', 'new-feat', '../new-feat']);
  });

  it('removes a worktree', () => {
    const args = buildWorktreeArgs({ remove: true, path: '../feature-branch' });
    expect(args).toEqual(['worktree', 'remove', '../feature-branch']);
  });

  it('removes a worktree with --force', () => {
    const args = buildWorktreeArgs({ remove: true, path: '../feature-branch', force: true });
    expect(args).toEqual(['worktree', 'remove', '--force', '../feature-branch']);
  });

  it('prunes worktree info', () => {
    const args = buildWorktreeArgs({ prune: true });
    expect(args).toEqual(['worktree', 'prune']);
  });

  it('prunes with dry-run', () => {
    const args = buildWorktreeArgs({ prune: true, dryRun: true });
    expect(args).toEqual(['worktree', 'prune', '--dry-run']);
  });

  it('locks a worktree', () => {
    const args = buildWorktreeArgs({ lock: true, path: '../feature-branch' });
    expect(args).toEqual(['worktree', 'lock', '../feature-branch']);
  });

  it('unlocks a worktree', () => {
    const args = buildWorktreeArgs({ unlock: true, path: '../feature-branch' });
    expect(args).toEqual(['worktree', 'unlock', '../feature-branch']);
  });

  it('moves a worktree', () => {
    const args = buildWorktreeArgs({ move: true, path: '../old-path', destination: '../new-path' });
    expect(args).toEqual(['worktree', 'move', '../old-path', '../new-path']);
  });

  it('throws if no subcommand provided', () => {
    expect(() => buildWorktreeArgs({})).toThrow('worktree subcommand required');
  });
});
