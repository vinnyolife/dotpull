# dotpull describe

Show the most recent tag reachable from a commit, optionally with additional commit distance and hash info.

## Usage

```
dotpull describe [options] [<commit-ish>]
```

## Options

| Flag | Description |
|------|-------------|
| `--tags` | Use any tag (not just annotated tags) |
| `--long` | Always output the long format even when a tag matches exactly |
| `--dirty[=<mark>]` | Append a mark if the working tree is dirty (default mark: `-dirty`) |
| `--match <pattern>` | Only consider tags matching the given glob pattern |
| `--exclude <pattern>` | Do not consider tags matching the given glob pattern |
| `--abbrev <n>` | Use `n` digits to abbreviate the object name (default: 7) |
| `--always` | Fall back to showing the abbreviated commit hash if no tag is found |

## Examples

```bash
# Describe HEAD using the nearest annotated tag
dotpull describe

# Include lightweight tags
dotpull describe --tags

# Always show something even if no tag exists
dotpull describe --always

# Show long format with dirty indicator
dotpull describe --long --dirty

# Describe a specific commit
dotpull describe --tags abc1234

# Only match version tags
dotpull describe --tags --match 'v*'
```

## Notes

- Runs `git describe` inside the configured dotfiles repository.
- Useful for generating version strings in scripts or prompts.
- If no suitable tag is found and `--always` is not set, the command will exit with an error.
