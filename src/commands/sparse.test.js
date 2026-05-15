import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildSparseArgs, sparse } from './sparse.js';

vi.mock('../git.js', () => ({ runGit: vi.fn().mockResolvedValue('') }));
vi.mock('../config.js', () => ({ loadConfig: vi.fn().mockResolvedValue({ repoPath: '/repo' }) }));

import { runGit } from '../git.js';

describe('buildSparseArgs', () => {
  it('defaults to list when no options given', () => {
    expect(buildSparseArgs()).toEqual(['sparse-checkout', 'list']);
  });

  it('builds init args', () => {
    expect(buildSparseArgs({ init: true })).toEqual(['sparse-checkout', 'init']);
  });

  it('builds init --cone args', () => {
    expect(buildSparseArgs({ init: true, cone: true })).toEqual(['sparse-checkout', 'init', '--cone']);
  });

  it('builds init --no-cone args', () => {
    expect(buildSparseArgs({ init: true, noone: false, noone: true })).toEqual(['sparse-checkout', 'init', '--no-cone']);
  });

  it('builds list args', () => {
    expect(buildSparseArgs({ list: true })).toEqual(['sparse-checkout', 'list']);
  });

  it('builds set with patterns', () => {
    expect(buildSparseArgs({ set: true, patterns: ['src/', 'docs/'] })).toEqual(['sparse-checkout', 'set', 'src/', 'docs/']);
  });

  it('builds add with patterns', () => {
    expect(buildSparseArgs({ add: true, patterns: ['tests/'] })).toEqual(['sparse-checkout', 'add', 'tests/']);
  });

  it('builds reapply args', () => {
    expect(buildSparseArgs({ reapply: true })).toEqual(['sparse-checkout', 'reapply']);
  });

  it('builds disable args', () => {
    expect(buildSparseArgs({ disable: true })).toEqual(['sparse-checkout', 'disable']);
  });

  it('ignores set when no patterns provided', () => {
    expect(buildSparseArgs({ set: true, patterns: [] })).toEqual(['sparse-checkout', 'list']);
  });
});

describe('sparse', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls runGit with correct args and repoPath', async () => {
    await sparse({ list: true });
    expect(runGit).toHaveBeenCalledWith(['sparse-checkout', 'list'], '/repo');
  });

  it('passes set args through', async () => {
    await sparse({ set: true, patterns: ['src/'] });
    expect(runGit).toHaveBeenCalledWith(['sparse-checkout', 'set', 'src/'], '/repo');
  });
});
