import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  buildSnapshotArgs,
  buildSnapshotListArgs,
  buildSnapshotRestoreArgs,
} from './snapshot.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn().mockResolvedValue({ stdout: '', stderr: '' }),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn().mockResolvedValue({ repoPath: '/home/user/.dotfiles' }),
}));

describe('buildSnapshotArgs', () => {
  it('uses custom message when provided', () => {
    const args = buildSnapshotArgs({ message: 'before-upgrade' });
    expect(args).toContain('push');
    expect(args).toContain('-m');
    expect(args).toContain('before-upgrade');
  });

  it('generates timestamp message when no message provided', () => {
    const args = buildSnapshotArgs();
    expect(args).toContain('-m');
    const msgIndex = args.indexOf('-m');
    expect(args[msgIndex + 1]).toMatch(/^dotpull-snapshot-/);
  });

  it('includes --include-untracked flag', () => {
    const args = buildSnapshotArgs({ includeUntracked: true });
    expect(args).toContain('--include-untracked');
  });

  it('includes --keep-index flag', () => {
    const args = buildSnapshotArgs({ keepIndex: true });
    expect(args).toContain('--keep-index');
  });

  it('does not include untracked flag by default', () => {
    const args = buildSnapshotArgs();
    expect(args).not.toContain('--include-untracked');
  });
});

describe('buildSnapshotListArgs', () => {
  it('returns stash list with grep filter', () => {
    const args = buildSnapshotListArgs();
    expect(args).toEqual(['stash', 'list', '--grep=dotpull-snapshot']);
  });
});

describe('buildSnapshotRestoreArgs', () => {
  it('defaults to stash@{0} when no index given', () => {
    const args = buildSnapshotRestoreArgs();
    expect(args).toContain('stash@{0}');
  });

  it('uses the given index', () => {
    const args = buildSnapshotRestoreArgs(3);
    expect(args).toContain('stash@{3}');
  });

  it('includes --index flag when option set', () => {
    const args = buildSnapshotRestoreArgs(1, { index: true });
    expect(args).toContain('--index');
  });

  it('does not include --index by default', () => {
    const args = buildSnapshotRestoreArgs(0);
    expect(args).not.toContain('--index');
  });
});
