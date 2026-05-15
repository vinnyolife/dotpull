# `dotpull whatchanged`

Show what files changed in each commit, similar to `git whatchanged`.

## Usage

```
dotpull whatchanged [options]
```

## Options

| Flag | Description |
|------|-------------|
| `--since=<date>` | Show commits more recent than a specific date |
| `--until=<date>` | Show commits older than a specific date |
| `--author=<pattern>` | Filter commits by author name or email |
| `-n <number>` | Limit the number of commits shown |
| `--oneline` | Show each commit on a single line |
| `--no-merges` | Exclude merge commits |
| `-p` | Show the patch (diff) for each commit |
| `<ref>` | Start listing from a specific ref |
| `-- <paths...>` | Limit output to specific files or directories |

## Examples

```bash
# Show all changed files per commit
dotpull whatchanged

# Show last 5 commits with changed files, one line each
dotpull whatchanged -n 5 --oneline

# Show what changed in .bashrc over the past month
dotpull whatchanged --since="1 month ago" -- .bashrc

# Show changes by a specific author
dotpull whatchanged --author="alice" --no-merges

# Show changes on a specific branch
dotpull whatchanged main
```

## Notes

- Unlike `dotpull log`, this command always shows the list of files affected by each commit.
- Useful for auditing which dotfiles were touched in a given time range.
- Combine with `--since` and `-- <path>` to track the history of a single config file.
