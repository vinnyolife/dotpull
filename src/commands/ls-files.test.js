import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildLsFilesArgs, lsFiles } from './ls-files.js';

vi.mock('../config.js', () => ({
  loadConfig: vi.fn().mockResolvedValue({ repoPath: '/home/user/.dotfiles' }),
}));

vi.mock('../git.js', () => ({
  runGit: vi.fn().mockResolvedValue('.bashrc\n.vimrc\n.zshrc\n'),
}));

import { runGit } from '../git.js';

describe('buildLsFilesArgs', () => {
  it('returns base args with no options', () => {
    expect(buildLsFilesArgs()).toEqual(['ls-files']);
  });

  it('includes --others flag', () => {
    expect(buildLsFilesArgs({ others: true })).toContain('--others');
  });

  it('includes --cached flag', () => {
    expect(buildLsFilesArgs({ cached: true })).toContain('--cached');
  });

  it('includes --deleted flag', () => {
    expect(buildLsFilesArgs({ deleted: true })).toContain('--deleted');
  });

  it('includes --modified flag', () => {
    expect(buildLsFilesArgs({ modified: true })).toContain('--modified');
  });

  it('includes --ignored and --exclude-standard together', () => {
    const args = buildLsFilesArgs({ ignored: true, excludeStandard: true });
    expect(args).toContain('--ignored');
    expect(args).toContain('--exclude-standard');
  });

  it('includes --stage flag', () => {
    expect(buildLsFilesArgs({ stage: true })).toContain('--stage');
  });

  it('includes --exclude with pattern', () => {
    const args = buildLsFilesArgs({ excludePattern: '*.log' });
    expect(args).toContain('--exclude');
    expect(args).toContain('*.log');
  });

  it('includes --with-tree option', () => {
    const args = buildLsFilesArgs({ withTree: 'HEAD' });
    expect(args).toContain('--with-tree');
    expect(args).toContain('HEAD');
  });

  it('appends path array after --', () => {
    const args = buildLsFilesArgs({ paths: ['.bashrc', '.vimrc'] });
    expect(args).toContain('--');
    expect(args).toContain('.bashrc');
    expect(args).toContain('.vimrc');
  });

  it('appends single string path after --', () => {
    const args = buildLsFilesArgs({ paths: '.zshrc' });
    expect(args).toContain('--');
    expect(args).toContain('.zshrc');
  });

  it('does not append -- when paths is empty array', () => {
    const args = buildLsFilesArgs({ paths: [] });
    expect(args).not.toContain('--');
  });
});

describe('lsFiles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    runGit.mockResolvedValue('.bashrc\n.vimrc\n.zshrc\n');
  });

  it('calls runGit with correct args and repoPath', async () => {
    await lsFiles({ cached: true });
    expect(runGit).toHaveBeenCalledWith(
      ['ls-files', '--cached'],
      '/home/user/.dotfiles'
    );
  });

  it('returns trimmed output', async () => {
    const result = await lsFiles();
    expect(result).toBe('.bashrc\n.vimrc\n.zshrc');
  });

  it('handles empty output', async () => {
    runGit.mockResolvedValue('\n');
    const result = await lsFiles({ others: true });
    expect(result).toBe('');
  });
});
