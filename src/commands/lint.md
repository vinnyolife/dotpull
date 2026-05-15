# dotpull lint

Check your dotfiles repository for common issues before committing or pushing.

## Usage

```
dotpull lint [options]
```

## Options

| Flag | Description |
|------|-------------|
| `--cached` | Lint only staged (cached) changes |
| `--commit <ref>` | Lint changes relative to a specific commit |

## What it checks

### 1. Whitespace errors
Runs `git diff --check` to detect:
- Trailing whitespace
- Lines with only whitespace
- Spaces before tabs

### 2. Conflict markers
Scans tracked files for leftover merge/rebase conflict markers:
```
<<<<<<< HEAD
=======
>>>>>>> branch
```

## Examples

```bash
# Lint all uncommitted changes
dotpull lint

# Lint only staged changes
dotpull lint --cached

# Lint changes since a specific commit
dotpull lint --commit HEAD~3
```

## Exit codes

- `0` — No issues found
- `1` — One or more lint checks failed

## Notes

Running `dotpull lint` before `dotpull push` is recommended to keep your
dotfiles history clean and conflict-free across machines.
