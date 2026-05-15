# aliases

Manage custom command aliases for dotpull. Aliases let you create shorthand names for frequently used commands.

## Usage

```
dotpull aliases --list
dotpull aliases <name> <command>
dotpull aliases --remove <name>
```

## Options

| Option | Description |
|--------|-------------|
| `--list` | List all aliases (builtin and user-defined) |
| `--remove <name>` | Remove a user-defined alias |

## Examples

### List all aliases
```bash
dotpull aliases --list
# st  → status
# co  → checkout
# lg  → log
# mylog → log --oneline --graph
```

### Create an alias
```bash
dotpull aliases mylog "log --oneline --graph"
# Alias "mylog" → "log --oneline --graph" saved
```

### Remove an alias
```bash
dotpull aliases --remove mylog
# Alias "mylog" removed
```

## Builtin Aliases

The following aliases are available by default and cannot be removed:

| Alias | Command |
|-------|---------|
| `st` | `status` |
| `co` | `checkout` |
| `sw` | `switch` |
| `rb` | `rebase` |
| `cp` | `cherry-pick` |
| `lg` | `log` |
| `br` | `branch` |

## Notes

- Alias names must be lowercase and may contain letters, digits, and hyphens.
- User aliases override builtins if names conflict.
- Aliases are stored in the dotpull config file.
