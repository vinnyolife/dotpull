import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildTrailersArgs, trailers } from './trailers.js';

vi.mock('../git.js', () => ({ runGit: vi.fn() }));
vi.mock('../config.js', () => ({ loadConfig: vi.fn() }));

import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

beforeEach(() => {
  vi.clearAllMocks();
  loadConfig.mockResolvedValue({ repoPath: '/home/user/.dotfiles' });
  runGit.mockResolvedValue('');
});

describe('buildTrailersArgs', () => {
  it('returns base args with no options', () => {
    expect(buildTrailersArgs()).toEqual(['interpret-trailers']);
  });

  it('adds a single --trailer flag', () => {
    const args = buildTrailersArgs({ trailer: 'Signed-off-by: Alice <alice@example.com>' });
    expect(args).toContain('--trailer');
    expect(args).toContain('Signed-off-by: Alice <alice@example.com>');
  });

  it('adds multiple --trailer flags for an array', () => {
    const args = buildTrailersArgs({
      trailer: ['Signed-off-by: Alice <alice@example.com>', 'Co-authored-by: Bob <bob@example.com>']
    });
    const trailerIdx = args.filter(a => a === '--trailer');
    expect(trailerIdx).toHaveLength(2);
  });

  it('adds --trim-empty when trim is set', () => {
    const args = buildTrailersArgs({ trim: true });
    expect(args).toContain('--trim-empty');
  });

  it('adds --unfold when unfold is set', () => {
    const args = buildTrailersArgs({ unfold: true });
    expect(args).toContain('--unfold');
  });

  it('adds --only-trailers when only is set', () => {
    const args = buildTrailersArgs({ only: true });
    expect(args).toContain('--only-trailers');
  });

  it('adds --parse when parse is set', () => {
    const args = buildTrailersArgs({ parse: true });
    expect(args).toContain('--parse');
  });

  it('appends file path at end when provided', () => {
    const args = buildTrailersArgs({ file: 'COMMIT_EDITMSG' });
    expect(args[args.length - 1]).toBe('COMMIT_EDITMSG');
  });
});

describe('trailers()', () => {
  it('calls runGit with correct args and repoPath', async () => {
    await trailers({ trailer: 'Reviewed-by: Carol <carol@example.com>' });
    expect(runGit).toHaveBeenCalledWith(
      ['interpret-trailers', '--trailer', 'Reviewed-by: Carol <carol@example.com>'],
      '/home/user/.dotfiles'
    );
  });

  it('throws if no repoPath is configured', async () => {
    loadConfig.mockResolvedValue({});
    await expect(trailers()).rejects.toThrow('No dotpull repo configured');
  });

  it('returns output from runGit', async () => {
    runGit.mockResolvedValue('Signed-off-by: Alice <alice@example.com>');
    const result = await trailers({ parse: true, file: 'msg.txt' });
    expect(result).toBe('Signed-off-by: Alice <alice@example.com>');
  });
});
