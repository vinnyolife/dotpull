import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

import { execSync } from 'child_process';
import { initCommand } from './init.js';
import { loadConfig, saveConfig } from '../config.js';

vi.mock('../config.js', () => ({
  loadConfig: vi.fn(),
  saveConfig: vi.fn((c) => c),
  getConfigPath: vi.fn(() => '/mock/.dotpull/config.json'),
}));

describe('initCommand', () => {
  const mockLocalDir = path.join(os.tmpdir(), 'dotpull-test-' + Date.now());

  beforeEach(() => {
    vi.clearAllMocks();
    loadConfig.mockReturnValue({
      repoUrl: null,
      branch: 'main',
      localDir: mockLocalDir,
      autoSync: false,
      lastSync: null,
    });
  });

  afterEach(() => {
    if (fs.existsSync(mockLocalDir)) {
      fs.rmSync(mockLocalDir, { recursive: true, force: true });
    }
  });

  it('throws if no repoUrl is provided', async () => {
    await expect(initCommand({})).rejects.toThrow('A Git repository URL is required');
  });

  it('skips re-init if already configured without --force', async () => {
    loadConfig.mockReturnValue({ repoUrl: 'https://github.com/user/dots.git', branch: 'main', localDir: mockLocalDir });
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await initCommand({ repoUrl: 'https://github.com/user/dots.git' });
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('already initialized'));
    consoleSpy.mockRestore();
  });

  it('clones the repo if localDir has no .git', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await initCommand({ repoUrl: 'https://github.com/user/dots.git', localDir: mockLocalDir });
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining('git clone'),
      expect.any(Object)
    );
    expect(saveConfig).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('saves config with provided values', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    await initCommand({ repoUrl: 'https://github.com/user/dots.git', localDir: mockLocalDir, branch: 'dev' });
    expect(saveConfig).toHaveBeenCalledWith(expect.objectContaining({
      repoUrl: 'https://github.com/user/dots.git',
      branch: 'dev',
    }));
  });
});
