import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';
import { remove } from './remove.js';

vi.mock('../config.js', () => ({
  loadConfig: vi.fn(),
}));

vi.mock('../git.js', () => ({
  runGit: vi.fn(),
}));

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    unlinkSync: vi.fn(),
  },
}));

import { loadConfig } from '../config.js';
import { runGit } from '../git.js';
import fs from 'fs';

const REPO_PATH = '/home/user/.dotfiles';

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: REPO_PATH });
  fs.existsSync.mockReturnValue(true);
  runGit.mockResolvedValue('');
});

describe('remove', () => {
  it('throws if no repo is configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(remove(['.bashrc'])).rejects.toThrow('No dotpull repo configured');
  });

  it('throws if no files are provided', async () => {
    await expect(remove([])).rejects.toThrow('No files specified');
  });

  it('throws if file is outside the repo directory', async () => {
    const outsideFile = '/tmp/outside.txt';
    await expect(remove([outsideFile])).rejects.toThrow('outside the repo directory');
  });

  it('throws if file does not exist and force is not set', async () => {
    fs.existsSync.mockReturnValue(false);
    const file = path.join(REPO_PATH, '.vimrc');
    await expect(remove([file])).rejects.toThrow('does not exist');
  });

  it('removes a file from git index and commits', async () => {
    const file = path.join(REPO_PATH, '.bashrc');
    const results = await remove([file]);
    expect(runGit).toHaveBeenCalledWith(['rm', '--cached', '.bashrc'], REPO_PATH);
    expect(runGit).toHaveBeenCalledWith(expect.arrayContaining(['commit', '-m']), REPO_PATH);
    expect(results[0].relativePath).toBe('.bashrc');
  });

  it('deletes the file from disk when --delete flag is set', async () => {
    const file = path.join(REPO_PATH, '.bashrc');
    await remove([file], { delete: true });
    expect(fs.unlinkSync).toHaveBeenCalledWith(file);
  });

  it('uses a custom commit message when provided', async () => {
    const file = path.join(REPO_PATH, '.zshrc');
    await remove([file], { message: 'chore: drop zshrc' });
    expect(runGit).toHaveBeenCalledWith(['commit', '-m', 'chore: drop zshrc'], REPO_PATH);
  });

  it('allows removal with --force even if file does not exist', async () => {
    fs.existsSync.mockReturnValue(false);
    const file = path.join(REPO_PATH, '.missing');
    await expect(remove([file], { force: true })).resolves.toBeDefined();
    expect(runGit).toHaveBeenCalledWith(['rm', '--cached', '-f', '.missing'], REPO_PATH);
  });
});
