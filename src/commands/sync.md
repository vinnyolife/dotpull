# sync

Pull the latest changes from the remote and push any local commits in a single step.
This is the most common dotfiles workflow: keep your machines in sync with one command.

## Usage

```
dotpull sync [options]
```

## Options

| Flag | Description |
|------|-------------|
| `--no-rebase` | Merge instead of rebase when pulling |
| `--remote <name>` | Remote to sync with (default: `origin`) |
| `--branch <name>` | Branch to sync (default: current branch) |
| `--force` | Push with `--force-with-lease` |

## Examples

```bash
# Standard sync (pull --rebase then push)
dotpull sync

# Sync against a specific remote and branch
dotpull sync --remote origin --branch main

# Merge instead of rebase
dotpull sync --no-rebase

# Force push after local history rewrite
dotpull sync --force
```

## Notes

- `sync` is equivalent to running `dotpull pull` followed by `dotpull push`.
- Uses `--rebase` by default to keep a clean linear history.
- `--force` uses `--force-with-lease` to avoid overwriting remote commits you haven't seen.
