# dotpull patch

Apply a patch file to your dotfiles repository using `git apply`.

## Usage

```
dotpull patch [options] <patchfile>
```

## Options

| Flag | Description |
|------|-------------|
| `--stat` | Show stats about the patch without applying it |
| `--check` | Dry-run: check if the patch can be applied cleanly |
| `--reverse` | Apply the patch in reverse |
| `--index` | Apply the patch to the index and working tree |
| `--cached` | Apply the patch only to the index |
| `--reject` | Leave rejected hunks in `.rej` files instead of failing |
| `--whitespace=<action>` | Handle whitespace errors (`nowarn`, `warn`, `fix`, `error`) |
| `--directory=<root>` | Prepend a directory prefix to all filenames in the patch |
| `--exclude=<pattern>` | Skip files matching the given pattern |
| `--include=<pattern>` | Only apply to files matching the given pattern |
| `--verbose` | Show verbose output |

## Examples

```bash
# Check if a patch applies cleanly
dotpull patch --check changes.patch

# Apply a patch file
dotpull patch changes.patch

# Apply a patch in reverse (undo it)
dotpull patch --reverse changes.patch

# Apply only to the index (staging area)
dotpull patch --cached staged.patch

# Fix whitespace issues while applying
dotpull patch --whitespace=fix messy.patch
```

## Notes

Patch files can be generated with `dotpull format-patch` or standard `git diff` output.
Use `--check` before applying to avoid conflicts.
