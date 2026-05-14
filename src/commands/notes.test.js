import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildNotesArgs, notesCommand } from './notes.js';

vi.mock('../git.js', () => ({
  runGit: vi.fn().mockResolvedValue({ stdout: '', stderr: '' }),
}));

vi.mock('../config.js', () => ({
  loadConfig: vi.fn().mockResolvedValue({ repoPath: '/home/user/.dotfiles' }),
}));

import { runGit } from '../git.js';

describe('buildNotesArgs', () => {
  it('defaults to list when no action specified', () => {
    expect(buildNotesArgs({})).toEqual(['notes', 'list']);
  });

  it('builds add args with message', () => {
    expect(buildNotesArgs({ add: true, message: 'installed on work laptop', commit: 'HEAD' })).toEqual([
      'notes', 'add', '-m', 'installed on work laptop', 'HEAD',
    ]);
  });

  it('builds add args with force and ref', () => {
    expect(buildNotesArgs({ add: true, force: true, ref: 'dotpull', message: 'note', commit: 'abc123' })).toEqual([
      'notes', 'add', '-f', '-m', 'note', '--ref', 'dotpull', 'abc123',
    ]);
  });

  it('builds show args', () => {
    expect(buildNotesArgs({ show: true, commit: 'HEAD~1' })).toEqual([
      'notes', 'show', 'HEAD~1',
    ]);
  });

  it('builds show args with ref', () => {
    expect(buildNotesArgs({ show: true, ref: 'custom', commit: 'abc' })).toEqual([
      'notes', 'show', '--ref', 'custom', 'abc',
    ]);
  });

  it('builds remove args', () => {
    expect(buildNotesArgs({ remove: true, commit: 'HEAD' })).toEqual([
      'notes', 'remove', 'HEAD',
    ]);
  });

  it('builds list args', () => {
    expect(buildNotesArgs({ list: true })).toEqual(['notes', 'list']);
  });

  it('builds list args with commit', () => {
    expect(buildNotesArgs({ list: true, commit: 'HEAD' })).toEqual(['notes', 'list', 'HEAD']);
  });

  it('builds edit args', () => {
    expect(buildNotesArgs({ edit: true, commit: 'HEAD' })).toEqual(['notes', 'edit', 'HEAD']);
  });

  it('builds copy args', () => {
    expect(buildNotesArgs({ copy: true, from: 'abc123', to: 'def456' })).toEqual([
      'notes', 'copy', 'abc123', 'def456',
    ]);
  });

  it('builds copy args with force', () => {
    expect(buildNotesArgs({ copy: true, force: true, from: 'abc', to: 'def' })).toEqual([
      'notes', 'copy', '-f', 'abc', 'def',
    ]);
  });
});

describe('notesCommand', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls runGit with correct args and repoPath', async () => {
    await notesCommand({ list: true });
    expect(runGit).toHaveBeenCalledWith(
      ['notes', 'list'],
      '/home/user/.dotfiles'
    );
  });

  it('calls runGit for add with message', async () => {
    await notesCommand({ add: true, message: 'test note', commit: 'HEAD' });
    expect(runGit).toHaveBeenCalledWith(
      ['notes', 'add', '-m', 'test note', 'HEAD'],
      '/home/user/.dotfiles'
    );
  });
});
