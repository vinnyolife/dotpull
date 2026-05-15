# dotpull hooks

Manage Git hooks in your dotfiles repository.

## Usage

```
dotpull hooks [options]
```

## Options

| Flag | Description |
|------|-------------|
| `--list` | List all active (non-sample) hooks |
| `--show <hook>` | Print the contents of a hook script |
| `--enable <hook>` | Re-enable a previously disabled hook |
| `--disable <hook>` | Disable a hook without deleting it |

## Examples

### List active hooks

```bash
dotpull hooks --list
# pre-commit
# post-merge
```

### Show a hook's contents

```bash
dotpull hooks --show pre-commit
# #!/bin/sh
# dotpull push --auto
```

### Disable a hook temporarily

```bash
dotpull hooks --disable pre-commit
# Hook 'pre-commit' disabled.
```

The hook file is renamed to `pre-commit.disabled` so it can be re-enabled later.

### Re-enable a hook

```bash
dotpull hooks --enable pre-commit
# Hook 'pre-commit' enabled.
```

## Notes

- Only hooks without the `.sample` extension are considered active.
- Disabling a hook renames it to `<hook>.disabled`; it is not deleted.
- Enabling a hook restores execute permissions (`chmod 755`) automatically.
- Hook files live in `.git/hooks` inside your configured dotfiles repo.
