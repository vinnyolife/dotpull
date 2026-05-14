import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildShowArgs, showCommand } from './show.js';

vi.mock('../git.js', () => ({ runGit: vi.fn() }));
vi.mock('../config.js', () => ({ loadConfig: vi.fn() }));

import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
});

describe('buildShowArgs', () => {
  it('returns base show args with no options', () => {
    expect(buildShowArgs()).toEqual(['show']);
  });

  it('includes object ref when provided', () => {
    expect(buildShowArgs({ object: 'HEAD~1' })).toEqual(['show', 'HEAD~1']);
  });

  it('includes --stat flag', () => {
    expect(buildShowArgs({ stat: true })).toContain('--stat');
  });

  it('includes --name-only flag', () => {
    expect(buildShowArgs({ namOnly: true })).toContain('--name-only');
  });

  it('includes --name-status flag', () => {
    expect(buildShowArgs({ nameStatus: true })).toContain('--name-status');
  });

  it('includes --format option', () => {
    expect(buildShowArgs({ format: 'short' })).toContain('--format=short');
  });

  it('includes --no-color flag', () => {
    expect(buildShowArgs({ noColor: true })).toContain('--no-color');
  });

  it('includes --unified option', () => {
    expect(buildShowArgs({ unified: 3 })).toContain('--unified=3');
  });

  it('appends paths after -- separator', () => {
    const args = buildShowArgs({ paths: ['.zshrc', '.vimrc'] });
    expect(args).toContain('--');
    expect(args).toContain('.zshrc');
    expect(args).toContain('.vimrc');
  });

  it('does not append -- when paths is empty', () => {
    expect(buildShowArgs({ paths: [] })).not.toContain('--');
  });
});

describe('showCommand', () => {
  it('throws if no repoPath configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(showCommand()).rejects.toThrow('No dotpull repo configured');
  });

  it('runs git show with correct args', async () => {
    runGit.mockResolvedValue('commit abc123\nAuthor: user\n\nadd vimrc');
    await showCommand({ object: 'HEAD' });
    expect(runGit).toHaveBeenCalledWith(['show', 'HEAD'], '/home/user/.dotfiles');
  });

  it('prints output when result is non-empty', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    runGit.mockResolvedValue('commit abc123\nsome diff');
    await showCommand();
    expect(spy).toHaveBeenCalledWith('commit abc123\nsome diff');
    spy.mockRestore();
  });

  it('prints fallback when output is blank', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    runGit.mockResolvedValue('\n');
    await showCommand();
    expect(spy).toHaveBeenCalledWith('Nothing to show.');
    spy.mockRestore();
  });
});
