import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildFormatPatchArgs, formatPatch } from './format-patch.js';

vi.mock('../git.js', () => ({ runGit: vi.fn() }));
vi.mock('../config.js', () => ({ loadConfig: vi.fn() }));

import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

describe('buildFormatPatchArgs', () => {
  it('defaults to HEAD with no options', () => {
    expect(buildFormatPatchArgs()).toEqual(['format-patch', 'HEAD']);
  });

  it('uses count flag when provided', () => {
    expect(buildFormatPatchArgs({ count: 3 })).toEqual(['format-patch', '-3']);
  });

  it('uses range when provided', () => {
    expect(buildFormatPatchArgs({ range: 'main..feature' })).toEqual(['format-patch', 'main..feature']);
  });

  it('count takes priority over range', () => {
    const args = buildFormatPatchArgs({ count: 2, range: 'main..feature' });
    expect(args).toContain('-2');
    expect(args).not.toContain('main..feature');
  });

  it('includes --stdout flag', () => {
    expect(buildFormatPatchArgs({ stdout: true })).toContain('--stdout');
  });

  it('includes --cover-letter flag', () => {
    expect(buildFormatPatchArgs({ cover: true })).toContain('--cover-letter');
  });

  it('includes --output-directory with value', () => {
    const args = buildFormatPatchArgs({ outputDir: './patches' });
    expect(args).toContain('--output-directory');
    expect(args).toContain('./patches');
  });

  it('includes --subject-prefix with value', () => {
    const args = buildFormatPatchArgs({ subject: 'PATCH v2' });
    expect(args).toContain('--subject-prefix');
    expect(args).toContain('PATCH v2');
  });

  it('includes --from flag', () => {
    const args = buildFormatPatchArgs({ from: 'user@example.com' });
    expect(args).toContain('--from=user@example.com');
  });

  it('includes --signoff flag', () => {
    expect(buildFormatPatchArgs({ signoff: true })).toContain('--signoff');
  });

  it('includes --binary flag', () => {
    expect(buildFormatPatchArgs({ binary: true })).toContain('--binary');
  });

  it('includes --no-stat flag', () => {
    expect(buildFormatPatchArgs({ noStat: true })).toContain('--no-stat');
  });
});

describe('formatPatch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws if no repoPath configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(formatPatch()).rejects.toThrow('No dotfiles repo configured');
  });

  it('runs git with correct args and prints output', async () => {
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    runGit.mockResolvedValue('0001-Add-zshrc.patch\n');
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await formatPatch({ count: 1 });

    expect(runGit).toHaveBeenCalledWith(['format-patch', '-1'], '/home/user/.dotfiles');
    expect(consoleSpy).toHaveBeenCalledWith('0001-Add-zshrc.patch');
    consoleSpy.mockRestore();
  });

  it('prints fallback message when no patches generated', async () => {
    loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
    runGit.mockResolvedValue('');
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await formatPatch();

    expect(consoleSpy).toHaveBeenCalledWith('No patches generated.');
    consoleSpy.mockRestore();
  });
});
