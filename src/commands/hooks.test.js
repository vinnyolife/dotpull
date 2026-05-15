import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildHooksArgs, hooksCommand } from './hooks.js';
import * as config from '../config.js';
import fs from 'fs';
import path from 'path';

vi.mock('../config.js');
vi.mock('fs');

describe('buildHooksArgs', () => {
  it('returns base args with no options', () => {
    expect(buildHooksArgs()).toEqual(['hooks']);
  });

  it('includes list subcommand', () => {
    expect(buildHooksArgs({ list: true })).toEqual(['hooks', 'list']);
  });

  it('includes enable subcommand with hook name', () => {
    expect(buildHooksArgs({ enable: 'pre-commit' })).toEqual(['hooks', 'enable', 'pre-commit']);
  });

  it('includes disable subcommand with hook name', () => {
    expect(buildHooksArgs({ disable: 'post-merge' })).toEqual(['hooks', 'disable', 'post-merge']);
  });

  it('includes show subcommand with hook name', () => {
    expect(buildHooksArgs({ show: 'pre-push' })).toEqual(['hooks', 'show', 'pre-push']);
  });
});

describe('hooksCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    config.loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
  });

  it('throws if no repoPath configured', async () => {
    config.loadConfig.mockResolvedValue({});
    await expect(hooksCommand({ list: true })).rejects.toThrow('No dotpull repo configured');
  });

  it('lists active hooks', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue(['pre-commit', 'post-merge', 'pre-push.sample']);
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await hooksCommand({ list: true });
    expect(spy).toHaveBeenCalledWith('pre-commit');
    expect(spy).toHaveBeenCalledWith('post-merge');
    expect(spy).not.toHaveBeenCalledWith('pre-push.sample');
    spy.mockRestore();
  });

  it('prints message when no active hooks', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue(['pre-commit.sample']);
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await hooksCommand({ list: true });
    expect(spy).toHaveBeenCalledWith('No active hooks installed.');
    spy.mockRestore();
  });

  it('shows hook content', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue('#!/bin/sh\necho hello');
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await hooksCommand({ show: 'pre-commit' });
    expect(spy).toHaveBeenCalledWith('#!/bin/sh\necho hello');
    spy.mockRestore();
  });

  it('throws when showing non-existent hook', async () => {
    fs.existsSync.mockReturnValue(false);
    await expect(hooksCommand({ show: 'pre-commit' })).rejects.toThrow("Hook 'pre-commit' not found");
  });

  it('enables a disabled hook', async () => {
    fs.existsSync.mockReturnValue(true);
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await hooksCommand({ enable: 'pre-commit' });
    expect(fs.renameSync).toHaveBeenCalled();
    expect(fs.chmodSync).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('disables an active hook', async () => {
    fs.existsSync.mockReturnValue(true);
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await hooksCommand({ disable: 'post-merge' });
    expect(fs.renameSync).toHaveBeenCalled();
    spy.mockRestore();
  });
});
