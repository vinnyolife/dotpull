# blame-range

Show git blame output for a specific line range in a file.

## Usage

```
dotpull blame-range <file> [options]
```

## Arguments

| Argument | Description |
|----------|-------------|
| `file`   | Path to the file to blame |

## Options

| Option | Description |
|--------|-------------|
| `--start <n>` | Start line number |
| `--end <n>` | End line number |
| `--commit <ref>` | Blame relative to a specific commit |
| `--reverse` | Walk history forward instead of backward |
| `--email` | Show author email instead of name |
| `--ignore-whitespace` | Ignore whitespace when comparing lines |
| `--porcelain` | Output in porcelain format for machine consumption |

## Examples

```bash
# Blame lines 10-25 of .bashrc
dotpull blame-range .bashrc --start 10 --end 25

# Blame a single line
dotpull blame-range .vimrc --start 42

# Blame with email output
dotpull blame-range .zshrc --start 1 --end 50 --email

# Blame at a specific commit
dotpull blame-range .gitconfig --start 5 --end 15 --commit HEAD~3
```

## Notes

This command is a focused wrapper around `git blame -L` to make it easy
to inspect authorship of specific sections of your dotfiles without
scrolling through the entire file history.
