# prune

Remove stale remote-tracking references from your dotfiles repo.

## Usage

```
dotpull prune [options]
```

## Options

| Flag | Description |
|------|-------------|
| `--fetch` | Use `git fetch --prune` instead of `git remote prune` |
| `--prune-tags` | Also prune stale remote tags (only with `--fetch`) |
| `--dry-run` | Show what would be pruned without making changes |
| `--remote <name>` | Target remote (default: `origin`) |

## Examples

```bash
# Prune stale remote-tracking branches for origin
dotpull prune

# Preview what would be pruned without applying changes
dotpull prune --dry-run

# Prune via fetch (also updates remote refs)
dotpull prune --fetch

# Prune stale branches and tags via fetch
dotpull prune --fetch --prune-tags

# Target a different remote
dotpull prune --remote upstream
```

## Notes

- `git remote prune` only removes stale remote-tracking refs locally.
- `git fetch --prune` also fetches new changes while pruning stale refs.
- Use `--dry-run` to safely inspect before modifying your local refs.
