import { runGit } from '../git.js';
import { loadConfig } from '../config.js';

/**
 * Build args to drop a specific snapshot from the stash
 */
export function buildSnapshotDropArgs(index) {
  const ref = index !== undefined ? `stash@{${index}}` : 'stash@{0}';
  return ['stash', 'drop', ref];
}

/**
 * Build args to clear ALL dotpull snapshots (stash clear is nuclear;
 * we drop one at a time by scanning the list)
 */
export function buildSnapshotDropAllArgs(indices = []) {
  // Drop in reverse order so indices stay valid
  return [...indices]
    .sort((a, b) => b - a)
    .map((i) => ['stash', 'drop', `stash@{${i}}`]);
}

export async function snapshotDrop(index) {
  const config = await loadConfig();
  const repoPath = config.repoPath;
  const args = buildSnapshotDropArgs(index);
  return runGit(args, repoPath);
}

export async function snapshotDropAll(indices) {
  const config = await loadConfig();
  const repoPath = config.repoPath;
  const commandSets = buildSnapshotDropAllArgs(indices);
  const results = [];
  for (const args of commandSets) {
    results.push(await runGit(args, repoPath));
  }
  return results;
}
