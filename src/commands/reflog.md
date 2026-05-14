# dotpull reflog

View and manage the reflog for your dotfiles repository.

## Usage

```
dotpull reflog [subcommand] [ref] [options]
```

## Subcommands

| Subcommand | Description |
|------------|-------------|
| _(none)_   | Show reflog entries |
| `expire`   | Prune older reflog entries |
| `delete`   | Delete a single reflog entry |
| `exists`   | Check if a ref has a reflog |

## Options

| Flag | Description |
|------|-------------|
| `--all` | Process all refs |
| `--expire=<time>` | Prune entries older than the given time (e.g. `30.days.ago`) |
| `--expire-unreachable=<time>` | Prune unreachable entries older than the given time |
| `-n <number>` | Limit the number of entries shown |
| `--format=<format>` | Output format (`oneline`, `short`, `medium`, etc.) |
| `--date=<format>` | Date format (`relative`, `iso`, `local`, etc.) |

## Examples

```bash
# Show full reflog
dotpull reflog

# Show reflog for a specific ref
dotpull reflog HEAD

# Show last 5 entries
dotpull reflog -n 5

# Expire old entries
dotpull reflog expire --expire=90.days.ago --all

# Show with ISO dates
dotpull reflog --date=iso
```

## Notes

The reflog records every time the tip of a branch or other reference is updated. It is useful for recovering lost commits or understanding recent changes to your dotfiles.
