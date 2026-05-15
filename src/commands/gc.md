# dotpull gc

Run Git's garbage collection to clean up and optimize your dotfiles repository.

## Usage

```
dotpull gc [options]
```

## Options

| Flag | Description |
|------|-------------|
| `--aggressive` | Use more time to aggressively optimize the repository. May take significantly longer but produces a smaller repo. |
| `--auto` | Check whether gc is needed before running. Exits silently if the repo is already clean enough. |
| `--prune` | Prune loose objects that are unreachable. Defaults to `now` (removes all unreferenced objects). |
| `--prune-date <date>` | Prune loose objects older than the given date (e.g. `1.week.ago`, `3.days.ago`, `now`). |
| `--quiet` | Suppress progress output. |
| `--force` | Force gc to run even if another gc process appears to be running. |

## Examples

```bash
# Basic cleanup
dotpull gc

# Aggressive optimization (slower but more thorough)
dotpull gc --aggressive

# Only run if gc is actually needed
dotpull gc --auto

# Prune all unreachable objects immediately
dotpull gc --prune

# Prune objects older than one week
dotpull gc --prune-date 1.week.ago

# Quiet aggressive gc
dotpull gc --aggressive --quiet
```

## Notes

- Running `gc` periodically helps keep your dotfiles repo lean, especially after many commits or rebases.
- `--auto` is safe to run frequently (e.g. in a cron job) since it skips work when not needed.
- After a `rebase` or `filter-branch` operation, `--prune=now` is recommended to reclaim disk space.
