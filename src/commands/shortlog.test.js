import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildShortlogArgs } from './shortlog.js';

describe('buildShortlogArgs', () => {
  it('returns base shortlog args with no options', () => {
    const args = buildShortlogArgs({});
    expect(args).toEqual(['shortlog']);
  });

  it('adds -s flag for summary mode', () => {
    const args = buildShortlogArgs({ summary: true });
    expect(args).toContain('-s');
  });

  it('adds -n flag to sort by number of commits', () => {
    const args = buildShortlogArgs({ numbered: true });
    expect(args).toContain('-n');
  });

  it('adds -e flag to show email addresses', () => {
    const args = buildShortlogArgs({ email: true });
    expect(args).toContain('-e');
  });

  it('adds --all flag to include all refs', () => {
    const args = buildShortlogArgs({ all: true });
    expect(args).toContain('--all');
  });

  it('adds range when provided', () => {
    const args = buildShortlogArgs({ range: 'HEAD~10..HEAD' });
    expect(args).toContain('HEAD~10..HEAD');
  });

  it('combines summary, numbered, and email flags', () => {
    const args = buildShortlogArgs({ summary: true, numbered: true, email: true });
    expect(args).toContain('-s');
    expect(args).toContain('-n');
    expect(args).toContain('-e');
  });

  it('adds --group flag when group option provided', () => {
    const args = buildShortlogArgs({ group: 'author' });
    expect(args).toContain('--group=author');
  });

  it('does not add range if not provided', () => {
    const args = buildShortlogArgs({ summary: true });
    expect(args.some(a => a.includes('..'))).toBe(false);
  });
});
