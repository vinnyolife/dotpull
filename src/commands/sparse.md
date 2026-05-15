# sparse

Manage sparse checkout patterns to limit which files are checked out in your dotfiles repo.

## Usage

```
dotpull sparse [subcommand] [options]
```

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `init` | Enable sparse checkout for the repo |
| `list` | Show current sparse patterns (default) |
| `set <patterns...>` | Replace all patterns with the given list |
| `add <patterns...>` | Append new patterns to the existing list |
| `reapply` | Reapply the current patterns to the working tree |
| `disable` | Disable sparse checkout and restore all files |

## Options

| Flag | Description |
|------|-------------|
| `--cone` | Use cone mode (faster, directory-based matching) |
| `--no-cone` | Use non-cone mode (full pattern matching) |

## Examples

```bash
# Enable sparse checkout in cone mode
dotpull sparse init --cone

# Only check out specific directories
dotpull sparse set home/.config/nvim home/.zshrc

# Add another pattern without removing existing ones
dotpull sparse add home/.tmux.conf

# See what patterns are active
dotpull sparse list

# Turn off sparse checkout
dotpull sparse disable
```

## Notes

Sparse checkout is useful when your dotfiles repo is large but you only need
a subset of files on a particular machine.
