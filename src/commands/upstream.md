# upstream

Manage upstream tracking branches for your dotfiles repo.

## Usage

```
dotpull upstream [options]
```

## Options

| Option | Description |
|--------|-------------|
| `--set <remote/branch>` | Set the upstream tracking branch |
| `--unset` | Remove upstream tracking for the current or specified branch |
| `--branch <name>` | Target a specific branch instead of the current one |

## Examples

### Show tracking info for all branches

```bash
dotpull upstream
```

Outputs verbose branch info including upstream tracking (equivalent to `git branch -vv`).

### Set upstream tracking

```bash
dotpull upstream --set origin/main
```

Sets the upstream of the current branch to `origin/main`.

```bash
dotpull upstream --set origin/dev --branch dev
```

Sets the upstream of the `dev` branch to `origin/dev`.

### Remove upstream tracking

```bash
dotpull upstream --unset
```

Removes upstream tracking from the current branch.

```bash
dotpull upstream --unset --branch feature
```

Removes upstream tracking from the `feature` branch.

## Notes

- This wraps `git branch --set-upstream-to` and `git branch --unset-upstream`.
- Useful when you've added a new remote and want to point your local branch at it.
