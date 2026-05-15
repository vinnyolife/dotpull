# dotpull stash-branch

Create a new branch from a stash entry and apply the stash to it. This is useful when changes stashed were too large for the current branch and you want to move them to a dedicated branch.

## Usage

```
dotpull stash-branch <branch-name> [stash-ref]
```

## Arguments

| Argument | Description |
|---|---|
| `branch-name` | Name of the new branch to create |
| `stash-ref` | Optional stash entry (e.g. `stash@{2}`). Defaults to `stash@{0}` |

## Options

| Flag | Description |
|---|---|
| `--verbose` | Print git output to stdout |

## Examples

```bash
# Create branch from latest stash
dotpull stash-branch my-feature

# Create branch from a specific stash entry
dotpull stash-branch my-feature stash@{2}

# With verbose output
dotpull stash-branch my-feature --verbose
```

## Notes

- The stash entry is dropped after being applied to the new branch.
- If the branch already exists the command will fail.
- Equivalent to `git stash branch <branch-name> [<stash>]`.
