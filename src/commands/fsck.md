# dotpull fsck

Run `git fsck` to verify the integrity of the dotfiles repository.

## Usage

```
dotpull fsck [options]
```

## Options

| Flag | Description |
|------|-------------|
| `--unreachable` | Show objects that exist but are not reachable from any reference |
| `--dangling` | Print dangling objects (default behavior) |
| `--no-dangling` | Suppress dangling object output |
| `--lost-found` | Write dangling objects into `.git/lost-found/` |
| `--strict` | Enable stricter checking |
| `--verbose` | Be verbose about all objects checked |
| `--full` | Check all object packs and loose objects |
| `--connectivity-only` | Only check connectivity, skip object content checks |

## Examples

```bash
# Basic integrity check
dotpull fsck

# Show unreachable objects
dotpull fsck --unreachable

# Strict check with verbose output
dotpull fsck --strict --verbose

# Recover dangling objects
dotpull fsck --lost-found
```

## Notes

If the check passes with no issues, dotpull will print a confirmation message.
This is useful after operations like `reset` or `rebase` to confirm repo health.
