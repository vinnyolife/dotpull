import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildAmArgs, am } from './am.js';
import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

vi.mock('../git.js');
vi.mock('../config.js');

describe('buildAmArgs', () => {
  it('returns base am args with no options', () => {
    expect(buildAmArgs()).toEqual(['am']);
  });

  it('adds --signoff', () => {
    expect(buildAmArgs({ signoff: true })).toContain('--signoff');
  });

  it('adds --keep', () => {
    expect(buildAmArgs({ keep: true })).toContain('--keep');
  });

  it('adds --keep-cr', () => {
    expect(buildAmArgs({ keepCr: true })).toContain('--keep-cr');
  });

  it('adds --no-keep-cr', () => {
    expect(buildAmArgs({ noKeepCr: true })).toContain('--no-keep-cr');
  });

  it('adds --resolved', () => {
    expect(buildAmArgs({ resolved: true })).toContain('--resolved');
  });

  it('adds --skip', () => {
    expect(buildAmArgs({ skip: true })).toContain('--skip');
  });

  it('adds --abort', () => {
    expect(buildAmArgs({ abort: true })).toContain('--abort');
  });

  it('adds --quit', () => {
    expect(buildAmArgs({ quit: true })).toContain('--quit');
  });

  it('adds --show-current-patch', () => {
    expect(buildAmArgs({ showCurrentPatch: true })).toContain('--show-current-patch');
  });

  it('adds --whitespace option', () => {
    expect(buildAmArgs({ whitespace: 'fix' })).toContain('--whitespace=fix');
  });

  it('adds --patch-format option', () => {
    expect(buildAmArgs({ patchFormat: 'mboxrd' })).toContain('--patch-format=mboxrd');
  });

  it('appends mboxFile at the end', () => {
    const args = buildAmArgs({ mboxFile: 'patches.mbox' });
    expect(args[args.length - 1]).toBe('patches.mbox');
  });

  it('combines multiple options', () => {
    const args = buildAmArgs({ signoff: true, skip: true });
    expect(args).toContain('--signoff');
    expect(args).toContain('--skip');
  });
});

describe('am', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotpull' });
    runGit.mockResolvedValue('');
  });

  it('throws if no repoPath configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(am()).rejects.toThrow('No dotpull repo found');
  });

  it('calls runGit with am args and repoPath', async () => {
    await am({ signoff: true });
    expect(runGit).toHaveBeenCalledWith(
      expect.arrayContaining(['am', '--signoff']),
      '/home/user/.dotpull'
    );
  });

  it('returns git output', async () => {
    runGit.mockResolvedValue('Applying: add zshrc');
    const result = await am({ mboxFile: 'patches.mbox' });
    expect(result).toBe('Applying: add zshrc');
  });

  it('passes abort flag through', async () => {
    await am({ abort: true });
    expect(runGit).toHaveBeenCalledWith(
      expect.arrayContaining(['--abort']),
      '/home/user/.dotpull'
    );
  });
});
