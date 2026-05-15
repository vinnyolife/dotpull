import { describe, it, expect, vi } from 'vitest';
import {
  buildSnapshotDropArgs,
  buildSnapshotDropAllArgs,
  snapshotDrop,
  snapshotDropAll,
} from './snapshot-drop.js';

const mockRunGit = vi.fn().mockResolvedValue({ stdout: 'Dropped stash@{0}', stderr: '' });

vi.mock('../git.js', () => ({ runGit: mockRunGit }));
vi.mock('../config.js', () => ({
  loadConfig: vi.fn().mockResolvedValue({ repoPath: '/home/user/.dotfiles' }),
}));

describe('buildSnapshotDropArgs', () => {
  it('drops stash@{0} by default', () => {
    expect(buildSnapshotDropArgs()).toEqual(['stash', 'drop', 'stash@{0}']);
  });

  it('drops the specified index', () => {
    expect(buildSnapshotDropArgs(2)).toEqual(['stash', 'drop', 'stash@{2}']);
  });
});

describe('buildSnapshotDropAllArgs', () => {
  it('returns an array of drop command arrays', () => {
    const result = buildSnapshotDropAllArgs([0, 1, 2]);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(['stash', 'drop', 'stash@{2}']);
    expect(result[1]).toEqual(['stash', 'drop', 'stash@{1}']);
    expect(result[2]).toEqual(['stash', 'drop', 'stash@{0}']);
  });

  it('returns empty array for no indices', () => {
    expect(buildSnapshotDropAllArgs([])).toEqual([]);
  });

  it('sorts indices in descending order', () => {
    const result = buildSnapshotDropAllArgs([3, 1]);
    expect(result[0]).toContain('stash@{3}');
    expect(result[1]).toContain('stash@{1}');
  });
});

describe('snapshotDrop', () => {
  it('calls runGit with correct args', async () => {
    mockRunGit.mockClear();
    await snapshotDrop(1);
    expect(mockRunGit).toHaveBeenCalledWith(
      ['stash', 'drop', 'stash@{1}'],
      '/home/user/.dotfiles'
    );
  });
});

describe('snapshotDropAll', () => {
  it('calls runGit once per index in reverse order', async () => {
    mockRunGit.mockClear();
    await snapshotDropAll([0, 2]);
    expect(mockRunGit).toHaveBeenCalledTimes(2);
    expect(mockRunGit.mock.calls[0][0]).toEqual(['stash', 'drop', 'stash@{2}']);
    expect(mockRunGit.mock.calls[1][0]).toEqual(['stash', 'drop', 'stash@{0}']);
  });
});
