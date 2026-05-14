# squash

Squash the last N commits into a single commit with a new message.

## Usage

```
dotpull squash <count> --message "<new message>"
```

## Arguments

| Argument | Description |
|----------|-------------|
| `count`  | Number of commits to squash (must be ≥ 2) |

## Options

| Option | Description |
|--------|-------------|
| `-m, --message <msg>` | Commit message for the resulting squashed commit (required) |

## Examples

Squash the last 3 commits:

```bash
dotpull squash 3 --message "consolidate zsh config updates"
```

Squash the last 5 commits:

```bash
dotpull squash 5 --message "refactor: clean up vim and tmux dotfiles"
```

## How it works

Under the hood, `squash` performs a `git reset --soft HEAD~N` to unstage the
last N commits while preserving all changes in the index, then creates a fresh
commit with the provided message.

This is a non-interactive alternative to `git rebase -i` and is well-suited for
scripting and CLI workflows where you know exactly how many commits to collapse.

## Notes

- The working tree is **not** modified; only commit history is rewritten.
- This rewrites history — avoid squashing commits that have already been pushed
  to a shared remote unless you intend to force-push.
- Use `dotpull log` to review recent commits before squashing.
