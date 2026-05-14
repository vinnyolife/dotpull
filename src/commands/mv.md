# dotpull mv

Move or rename a tracked dotfile within the repository.

## Usage

```
dotpull mv <source> <destination> [options]
```

## Arguments

| Argument      | Description                          |
|---------------|--------------------------------------|
| `source`      | Current path of the file or directory |
| `destination` | New path or name                     |

## Options

| Flag            | Short | Description                                      |
|-----------------|-------|--------------------------------------------------|
| `--force`       | `-f`  | Force rename even if destination exists          |
| `--dry-run`     | `-n`  | Show what would be moved without doing it        |
| `--verbose`     | `-v`  | Output each file as it is moved                  |
| `--skip-errors` | `-k`  | Skip files that would cause errors and continue  |

## Examples

```bash
# Rename a dotfile
dotpull mv .bashrc .bash_profile

# Move a config file into a subdirectory
dotpull mv .vimrc vim/.vimrc

# Preview a move without applying it
dotpull mv .zshrc configs/.zshrc --dry-run

# Force overwrite destination
dotpull mv old.conf new.conf --force
```

## Notes

- This command wraps `git mv` and stages the rename automatically.
- After moving, run `dotpull push` to commit and sync the change.
- Use `dotpull status` to verify the staged rename before pushing.
