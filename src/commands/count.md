# dotpull count

Count commits in the dotfiles repository using `git rev-list --count`.

## Usage

```
dotpull count [ref] [options]
```

## Arguments

| Argument | Description                          | Default |
|----------|--------------------------------------|---------|
| `ref`    | Branch, tag, or commit to count from | `HEAD`  |

## Options

| Flag          | Description                              |
|---------------|------------------------------------------|
| `--all`       | Count commits across all branches        |
| `--merges`    | Count only merge commits                 |
| `--no-merges` | Exclude merge commits from count         |
| `--since`     | Count commits after a given date         |
| `--until`     | Count commits before a given date        |
| `--author`    | Count commits by a specific author       |
| `--quiet`     | Suppress output, return count only       |

## Examples

```bash
# Count all commits on HEAD
dotpull count

# Count commits on a specific branch
dotpull count main

# Count commits since a date
dotpull count --since=2024-01-01

# Count non-merge commits by author
dotpull count --no-merges --author="Alice"

# Count all commits across all branches
dotpull count --all
```

## Notes

- Useful for auditing how active your dotfiles history is.
- Combine `--since` and `--until` to count commits in a date range.
