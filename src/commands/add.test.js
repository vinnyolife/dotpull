import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';
import { addFiles } from './add.js';

vi.mock('../config.js');
vi.mock('../git.js');
vi.mock('fs');

import { loadConfig } from '../config.js';
import { runGit, isGitRepo } from '../git.js';
import fs from 'fs';

const REPO_PATH = '/home/user/.dotfiles';

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: REPO_PATH });
  isGitRepo.mockResolvedValue(true);
  fs.existsSync.mockReturnValue(true);
  runGit.mockResolvedValue('');
});

describe('addFiles', () => {
  it('throws if no repoPath configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(addFiles(['.bashrc'])).rejects.toThrow('No dotpull repo configured');
  });

  it('throws if repoPath is not a git repo', async () => {
    isGitRepo.mockResolvedValue(false);
    await expect(addFiles(['.bashrc'])).rejects.toThrow('not a valid git repository');
  });

  it('throws if no files provided', async () => {
    await expect(addFiles([])).rejects.toThrow('No files specified');
  });

  it('throws if a file does not exist', async () => {
    fs.existsSync.mockReturnValue(false);
    await expect(addFiles(['/home/user/.bashrc'])).rejects.toThrow('File not found');
  });

  it('throws if file is outside the repo directory', async () => {
    fs.existsSync.mockReturnValue(true);
    await expect(addFiles(['/tmp/outside.txt'])).rejects.toThrow('outside the repo directory');
  });

  it('calls runGit with add and relative paths', async () => {
    const file = path.join(REPO_PATH, '.vimrc');
    fs.existsSync.mockReturnValue(true);
    const result = await addFiles([file]);
    expect(runGit).toHaveBeenCalledWith(['add', '.vimrc'], REPO_PATH);
    expect(result.added).toEqual(['.vimrc']);
  });

  it('includes --force flag when option is set', async () => {
    const file = path.join(REPO_PATH, '.zshrc');
    fs.existsSync.mockReturnValue(true);
    await addFiles([file], { force: true });
    expect(runGit).toHaveBeenCalledWith(['add', '--force', '.zshrc'], REPO_PATH);
  });

  it('handles multiple files', async () => {
    const files = ['.bashrc', '.vimrc'].map((f) => path.join(REPO_PATH, f));
    fs.existsSync.mockReturnValue(true);
    const result = await addFiles(files);
    expect(result.added).toHaveLength(2);
    expect(runGit).toHaveBeenCalledWith(['add', '.bashrc', '.vimrc'], REPO_PATH);
  });
});
