# snapshot

Save or restore a point-in-time snapshot of your dotfiles using git stash.

## Usage

```
dotpull snapshot [options]
dotpull snapshot list
dotpull snapshot restore [index] [options]
```

## Commands

| Command | Description |
|---------|-------------|
| `snapshot` | Create a new snapshot of current dotfile changes |
| `snapshot list` | List all saved dotpull snapshots |
| `snapshot restore [index]` | Restore a snapshot by its stash index (default: 0) |

## Options

### snapshot

| Flag | Description |
|------|-------------|
| `-m, --message <msg>` | Label the snapshot with a custom message |
| `-u, --include-untracked` | Include untracked files in the snapshot |
| `--keep-index` | Keep staged changes in the index after snapshotting |

### snapshot restore

| Flag | Description |
|------|-------------|
| `--index` | Restore staged changes to the index as well |

## Examples

```bash
# Create a snapshot before making changes
dotpull snapshot -m before-nvim-overhaul

# Snapshot including new untracked dotfiles
dotpull snapshot -u

# See all snapshots
dotpull snapshot list

# Restore the most recent snapshot
dotpull snapshot restore

# Restore a specific snapshot
dotpull snapshot restore 2
```

## Notes

Snapshots are stored as git stash entries prefixed with `dotpull-snapshot-`.
They persist across sessions and can be managed with `dotpull stash` commands as well.
