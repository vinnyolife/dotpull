import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildSparseSetArgs, sparseSet } from './sparse-set.js';

vi.mock('../git.js', () => ({ runGit: vi.fn().mockResolvedValue('') }));
vi.mock('../config.js', () => ({ loadConfig: vi.fn().mockResolvedValue({ repoPath: '/repo' }) }));

import { runGit } from '../git.js';

describe('buildSparseSetArgs', () => {
  it('builds basic set args with patterns', () => {
    expect(buildSparseSetArgs(['src/', 'docs/'])).toEqual(['sparse-checkout', 'set', 'src/', 'docs/']);
  });

  it('includes --cone flag when option set', () => {
    expect(buildSparseSetArgs(['src/'], { cone: true })).toEqual(['sparse-checkout', 'set', '--cone', 'src/']);
  });

  it('throws when no patterns provided', () => {
    expect(() => buildSparseSetArgs([])).toThrow('At least one pattern is required');
  });

  it('throws when patterns is undefined', () => {
    expect(() => buildSparseSetArgs()).toThrow('At least one pattern is required');
  });

  it('handles single pattern', () => {
    expect(buildSparseSetArgs(['.config/'])).toEqual(['sparse-checkout', 'set', '.config/']);
  });
});

describe('sparseSet', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls runGit twice: set then reapply', async () => {
    await sparseSet(['src/']);
    expect(runGit).toHaveBeenCalledTimes(2);
    expect(runGit).toHaveBeenNthCalledWith(1, ['sparse-checkout', 'set', 'src/'], '/repo');
    expect(runGit).toHaveBeenNthCalledWith(2, ['sparse-checkout', 'reapply'], '/repo');
  });

  it('skips reapply when reapply option is false', async () => {
    await sparseSet(['src/'], { reapply: false });
    expect(runGit).toHaveBeenCalledTimes(1);
    expect(runGit).toHaveBeenCalledWith(['sparse-checkout', 'set', 'src/'], '/repo');
  });

  it('passes cone flag through', async () => {
    await sparseSet(['.zshrc'], { cone: true });
    expect(runGit).toHaveBeenNthCalledWith(1, ['sparse-checkout', 'set', '--cone', '.zshrc'], '/repo');
  });
});
