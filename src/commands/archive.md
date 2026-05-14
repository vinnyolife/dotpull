# `dotpull archive`

Create a compressed archive of your dotfiles repository at a given tree-ish (commit, tag, or branch).

## Usage

```
dotpull archive [options]
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--format <fmt>` | Archive format: `tar`, `tar.gz`, `zip` | `tar.gz` |
| `--output <path>` | Output file path | `dotfiles-<treeish>.<format>` in cwd |
| `--prefix <name>` | Prepend a directory prefix inside the archive | none |
| `--treeish <ref>` | Commit, tag, or branch to archive | `HEAD` |
| `--worktree` | Respect `.gitattributes` export-ignore rules | false |
| `--verbose` | Print files as they are archived | false |
| `[paths...]` | Limit archive to specific paths | all files |

## Examples

```bash
# Archive HEAD as a tar.gz in the current directory
dotpull archive

# Archive a specific tag as a zip file
dotpull archive --format zip --treeish v2.0.0 --output ~/backups/dots-v2.zip

# Archive only shell configs from main branch
dotpull archive --treeish main -- .bashrc .zshrc .profile

# Include a top-level directory prefix inside the archive
dotpull archive --prefix dotfiles --format zip
```

## Notes

- Uses `git archive` under the hood.
- The `--worktree` flag enables `--worktree-attributes`, which respects
  `export-ignore` attributes defined in `.gitattributes`.
- When `--output` is omitted, the filename is auto-generated as
  `dotfiles-<treeish>.<format>` in your current working directory.
