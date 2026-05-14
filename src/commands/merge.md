# dotpull merge

Merge a branch into the current branch of your dotfiles repo.

## Usage

```
dotpull merge <branch> [options]
```

## Arguments

| Argument | Description |
|----------|-------------|
| `branch` | The branch to merge into the current branch |

## Options

| Flag | Description |
|------|-------------|
| `--no-ff` | Create a merge commit even when fast-forward is possible |
| `--ff-only` | Refuse to merge unless fast-forward is possible |
| `--squash` | Squash commits from the merged branch into a single commit |
| `--no-commit` | Perform the merge but do not auto-commit |
| `--abort` | Abort the current merge conflict resolution |
| `--continue` | Continue a merge after resolving conflicts |
| `--strategy <name>` | Use a specific merge strategy (e.g. `ours`, `recursive`) |
| `-m <message>` | Set the commit message for the merge commit |

## Examples

```bash
# Merge a feature branch
dotpull merge feature/vim-config

# Merge without fast-forward
dotpull merge --no-ff feature/zsh

# Squash commits before merging
dotpull merge --squash experimental

# Abort a conflicted merge
dotpull merge --abort

# Continue after resolving conflicts
dotpull merge --continue
```
