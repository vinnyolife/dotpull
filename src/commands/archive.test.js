import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildArchiveArgs, archiveCommand } from './archive.js';

vi.mock('../config.js', () => ({
  loadConfig: vi.fn().mockResolvedValue({ repoPath: '/home/user/.dotfiles' }),
}));

vi.mock('../git.js', () => ({
  runGit: vi.fn().mockResolvedValue(''),
}));

describe('buildArchiveArgs', () => {
  it('defaults to HEAD with no options', () => {
    const args = buildArchiveArgs();
    expect(args).toEqual(['archive', 'HEAD']);
  });

  it('includes --format when provided', () => {
    const args = buildArchiveArgs({ format: 'zip' });
    expect(args).toContain('--format=zip');
  });

  it('includes --prefix when provided', () => {
    const args = buildArchiveArgs({ prefix: 'dotfiles' });
    expect(args).toContain('--prefix=dotfiles/');
  });

  it('includes --output when provided', () => {
    const args = buildArchiveArgs({ output: '/tmp/out.tar.gz' });
    expect(args).toContain('--output=/tmp/out.tar.gz');
  });

  it('includes --worktree-attributes when worktree is true', () => {
    const args = buildArchiveArgs({ worktree: true });
    expect(args).toContain('--worktree-attributes');
  });

  it('includes --verbose when verbose is true', () => {
    const args = buildArchiveArgs({ verbose: true });
    expect(args).toContain('--verbose');
  });

  it('uses custom treeish', () => {
    const args = buildArchiveArgs({ treeish: 'v1.2.3' });
    expect(args).toContain('v1.2.3');
    expect(args).not.toContain('HEAD');
  });

  it('appends paths after --', () => {
    const args = buildArchiveArgs({ paths: ['.bashrc', '.vimrc'] });
    const sepIdx = args.indexOf('--');
    expect(sepIdx).toBeGreaterThan(-1);
    expect(args[sepIdx + 1]).toBe('.bashrc');
    expect(args[sepIdx + 2]).toBe('.vimrc');
  });

  it('combines multiple options correctly', () => {
    const args = buildArchiveArgs({
      format: 'zip',
      treeish: 'main',
      output: '/tmp/dots.zip',
      verbose: true,
    });
    expect(args).toContain('--format=zip');
    expect(args).toContain('--output=/tmp/dots.zip');
    expect(args).toContain('--verbose');
    expect(args).toContain('main');
  });
});

describe('archiveCommand', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls runGit with archive args', async () => {
    const { runGit } = await import('../git.js');
    await archiveCommand({ output: '/tmp/dots.tar.gz', treeish: 'HEAD' });
    expect(runGit).toHaveBeenCalledWith(
      expect.arrayContaining(['archive', 'HEAD']),
      '/home/user/.dotfiles'
    );
  });

  it('generates a default output path when none given', async () => {
    const { runGit } = await import('../git.js');
    await archiveCommand({ format: 'zip', treeish: 'main' });
    const calledArgs = runGit.mock.calls[0][0];
    const outputArg = calledArgs.find((a) => a.startsWith('--output='));
    expect(outputArg).toBeDefined();
    expect(outputArg).toMatch(/dotfiles-main\.zip$/);
  });
});
