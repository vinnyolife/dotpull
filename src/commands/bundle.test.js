import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildBundleArgs, bundleCommand } from './bundle.js';

vi.mock('../git.js', () => ({ runGit: vi.fn() }));
vi.mock('../config.js', () => ({ loadConfig: vi.fn() }));

import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
  runGit.mockResolvedValue('');
});

describe('buildBundleArgs', () => {
  it('builds create args with file', () => {
    const args = buildBundleArgs({ subcommand: 'create', file: 'dots.bundle', all: true });
    expect(args).toEqual(['bundle', 'create', 'dots.bundle', '--all']);
  });

  it('builds create args with branch', () => {
    const args = buildBundleArgs({ subcommand: 'create', file: 'dots.bundle', branch: 'main' });
    expect(args).toEqual(['bundle', 'create', 'dots.bundle', 'main']);
  });

  it('builds create args with since', () => {
    const args = buildBundleArgs({ subcommand: 'create', file: 'dots.bundle', since: '2024-01-01' });
    expect(args).toEqual(['bundle', 'create', 'dots.bundle', '--since=2024-01-01']);
  });

  it('builds verify args', () => {
    const args = buildBundleArgs({ subcommand: 'verify', file: 'dots.bundle' });
    expect(args).toEqual(['bundle', 'verify', 'dots.bundle']);
  });

  it('builds verify args with quiet', () => {
    const args = buildBundleArgs({ subcommand: 'verify', file: 'dots.bundle', quiet: true });
    expect(args).toEqual(['bundle', 'verify', 'dots.bundle', '--quiet']);
  });

  it('builds list-heads args', () => {
    const args = buildBundleArgs({ subcommand: 'list-heads', file: 'dots.bundle' });
    expect(args).toEqual(['bundle', 'list-heads', 'dots.bundle']);
  });

  it('builds unbundle args', () => {
    const args = buildBundleArgs({ subcommand: 'unbundle', file: 'dots.bundle' });
    expect(args).toEqual(['bundle', 'unbundle', 'dots.bundle']);
  });

  it('throws if create has no file', () => {
    expect(() => buildBundleArgs({ subcommand: 'create' })).toThrow('bundle create requires a file path');
  });

  it('throws on unknown subcommand', () => {
    expect(() => buildBundleArgs({ subcommand: 'explode', file: 'x' })).toThrow('unknown bundle subcommand');
  });
});

describe('bundleCommand', () => {
  it('calls runGit with correct args', async () => {
    await bundleCommand({ subcommand: 'verify', file: 'dots.bundle' });
    expect(runGit).toHaveBeenCalledWith(
      ['bundle', 'verify', 'dots.bundle'],
      '/home/user/.dotfiles'
    );
  });

  it('logs output when present', async () => {
    runGit.mockResolvedValue('The bundle is valid');
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await bundleCommand({ subcommand: 'verify', file: 'dots.bundle' });
    expect(spy).toHaveBeenCalledWith('The bundle is valid');
    spy.mockRestore();
  });

  it('does not log when output is empty', async () => {
    runGit.mockResolvedValue('');
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await bundleCommand({ subcommand: 'list-heads', file: 'dots.bundle' });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
