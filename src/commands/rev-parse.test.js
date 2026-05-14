import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildRevParseArgs, revParse } from './rev-parse.js';

vi.mock('../git.js', () => ({ runGit: vi.fn() }));
vi.mock('../config.js', () => ({ loadConfig: vi.fn() }));

import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
});

describe('buildRevParseArgs', () => {
  it('returns base command with no options', () => {
    expect(buildRevParseArgs()).toEqual(['rev-parse']);
  });

  it('adds --abbrev-ref flag', () => {
    expect(buildRevParseArgs({ abbrevRef: true })).toContain('--abbrev-ref');
  });

  it('adds --short flag without length', () => {
    expect(buildRevParseArgs({ short: true })).toContain('--short');
  });

  it('adds --short=N flag with numeric length', () => {
    expect(buildRevParseArgs({ short: 7 })).toContain('--short=7');
  });

  it('adds --verify flag', () => {
    expect(buildRevParseArgs({ verify: true })).toContain('--verify');
  });

  it('adds --show-toplevel flag', () => {
    expect(buildRevParseArgs({ showToplevel: true })).toContain('--show-toplevel');
  });

  it('adds --git-dir flag', () => {
    expect(buildRevParseArgs({ gitDir: true })).toContain('--git-dir');
  });

  it('adds --is-bare-repository flag', () => {
    expect(buildRevParseArgs({ isBareRepository: true })).toContain('--is-bare-repository');
  });

  it('adds --is-inside-work-tree flag', () => {
    expect(buildRevParseArgs({ isInsideWorkTree: true })).toContain('--is-inside-work-tree');
  });

  it('appends a single ref', () => {
    expect(buildRevParseArgs({ ref: 'HEAD' })).toContain('HEAD');
  });

  it('appends multiple refs', () => {
    const args = buildRevParseArgs({ ref: ['HEAD', 'main'] });
    expect(args).toContain('HEAD');
    expect(args).toContain('main');
  });

  it('combines abbrev-ref with HEAD ref', () => {
    const args = buildRevParseArgs({ abbrevRef: true, ref: 'HEAD' });
    expect(args).toEqual(['rev-parse', '--abbrev-ref', 'HEAD']);
  });
});

describe('revParse', () => {
  it('calls runGit with correct args and repoPath', async () => {
    runGit.mockResolvedValue('main\n');
    const result = await revParse({ abbrevRef: true, ref: 'HEAD' });
    expect(runGit).toHaveBeenCalledWith(
      ['rev-parse', '--abbrev-ref', 'HEAD'],
      '/home/user/.dotfiles'
    );
    expect(result).toBe('main');
  });

  it('trims whitespace from output', async () => {
    runGit.mockResolvedValue('  abc1234  \n');
    const result = await revParse({ ref: 'HEAD' });
    expect(result).toBe('abc1234');
  });
});
