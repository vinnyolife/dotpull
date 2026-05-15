# stash-list

List all stash entries in the dotfiles repository.

## Usage

```
dotpull stash-list [options]
```

## Options

| Option | Description |
|--------|-------------|
| `--format <fmt>` | Custom format string for stash entries (passed to `--format`) |
| `--limit <n>` | Limit output to the most recent `n` stash entries |

## Examples

List all stashes:
```
dotpull stash-list
```

List with a custom format:
```
dotpull stash-list --format "%gd: %s"
```

Show only the 3 most recent stashes:
```
dotpull stash-list --limit 3
```

## Notes

- Output mirrors `git stash list` behavior.
- If no stashes exist, a friendly message is displayed instead of empty output.
- Use `dotpull stash-pop` to apply and remove a stash entry.
- Use `dotpull stash-branch` to create a branch from a stash.
