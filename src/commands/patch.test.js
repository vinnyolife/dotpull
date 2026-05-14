import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildPatchArgs, patch } from './patch.js';
import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

vi.mock('../git.js');
vi.mock('../config.js');

describe('buildPatchArgs', () => {
  it('returns base apply args with no options', () => {
    expect(buildPatchArgs()).toEqual(['apply']);
  });

  it('adds --stat flag', () => {
    expect(buildPatchArgs({ stat: true })).toContain('--stat');
  });

  it('adds --check flag', () => {
    expect(buildPatchArgs({ check: true })).toContain('--check');
  });

  it('adds --reverse flag', () => {
    expect(buildPatchArgs({ reverse: true })).toContain('--reverse');
  });

  it('adds --index flag', () => {
    expect(buildPatchArgs({ index: true })).toContain('--index');
  });

  it('adds --cached flag', () => {
    expect(buildPatchArgs({ cached: true })).toContain('--cached');
  });

  it('adds --reject flag', () => {
    expect(buildPatchArgs({ reject: true })).toContain('--reject');
  });

  it('adds --whitespace option', () => {
    expect(buildPatchArgs({ whitespace: 'fix' })).toContain('--whitespace=fix');
  });

  it('adds --directory option', () => {
    expect(buildPatchArgs({ directory: 'home' })).toContain('--directory=home');
  });

  it('adds --exclude option', () => {
    expect(buildPatchArgs({ exclude: '*.log' })).toContain('--exclude=*.log');
  });

  it('adds --include option', () => {
    expect(buildPatchArgs({ include: '*.conf' })).toContain('--include=*.conf');
  });

  it('appends patchFile at the end', () => {
    const args = buildPatchArgs({ patchFile: 'changes.patch' });
    expect(args[args.length - 1]).toBe('changes.patch');
  });

  it('combines multiple flags', () => {
    const args = buildPatchArgs({ check: true, reverse: true, patchFile: 'fix.patch' });
    expect(args).toContain('--check');
    expect(args).toContain('--reverse');
    expect(args[args.length - 1]).toBe('fix.patch');
  });
});

describe('patch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotpull' });
    runGit.mockResolvedValue('');
  });

  it('throws if no repoPath configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(patch()).rejects.toThrow('No dotpull repo found');
  });

  it('calls runGit with apply args and repoPath', async () => {
    await patch({ check: true });
    expect(runGit).toHaveBeenCalledWith(
      expect.arrayContaining(['apply', '--check']),
      '/home/user/.dotpull'
    );
  });

  it('returns git output', async () => {
    runGit.mockResolvedValue('Applied patch successfully');
    const result = await patch({ patchFile: 'my.patch' });
    expect(result).toBe('Applied patch successfully');
  });
});
