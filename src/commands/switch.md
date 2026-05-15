# dotpull switch

Switch branches in your dotfiles repository. A safer, more expressive alternative to `checkout` for branch navigation.

## Usage

```
dotpull switch <branch>
dotpull switch -c <new-branch>
dotpull switch --orphan <new-branch>
```

## Options

| Flag | Description |
|------|-------------|
| `-c <name>` | Create and switch to a new branch |
| `-C <name>` | Force-create branch (resets if exists) |
| `--detach` | Switch in detached HEAD state |
| `--orphan <name>` | Create a new orphan branch with no history |
| `--discard-changes` | Discard local modifications when switching |
| `--no-guess` | Do not attempt to track remote branches |
| `--track <upstream>` | Set tracking for the new branch |

## Examples

```bash
# Switch to existing branch
dotpull switch work-laptop

# Create and switch to a new branch
dotpull switch -c experiment/zsh-overhaul

# Start fresh with no history
dotpull switch --orphan minimal-setup

# Switch and discard uncommitted changes
dotpull switch --discard-changes main
```

## Notes

`switch` was introduced in Git 2.23 as a cleaner alternative to `git checkout` for branch operations. Use `dotpull checkout` if you need to restore file contents.
