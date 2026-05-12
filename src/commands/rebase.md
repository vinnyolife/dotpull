# `dotpull rebase`

Rebase the dotfiles repository branch onto another branch or commit.

## Usage

```
dotpull rebase [branch]
dotpull rebase --interactive [branch]
dotpull rebase --onto <newbase> [branch]
dotpull rebase --abort
dotpull rebase --continue
dotpull rebase --skip
```

## Options

| Flag | Description |
|------|-------------|
| `--interactive`, `-i` | Start an interactive rebase session |
| `--onto <newbase>` | Rebase onto a different base commit |
| `--abort` | Abort an in-progress rebase |
| `--continue` | Continue after resolving conflicts |
| `--skip` | Skip the current conflicting commit |
| `--autosquash` | Auto-squash fixup commits |
| `--no-ff` | Disable fast-forward during rebase |

## Examples

```bash
# Rebase current branch onto main
dotpull rebase main

# Interactive rebase of last 3 commits
dotpull rebase --interactive HEAD~3

# Rebase a branch onto a new base
dotpull rebase --onto main feature/old feature/new

# Abort an in-progress rebase
dotpull rebase --abort
```

## Notes

- Rebase rewrites commit history. Avoid rebasing branches shared with others.
- After resolving merge conflicts, use `dotpull rebase --continue`.
- Use `dotpull rebase --abort` to restore the original branch state.
