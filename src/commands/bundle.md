# bundle

Create, verify, or unpack Git bundle files from your dotfiles repo.

Bundles let you transfer repository history as a single portable file — useful for offline backups or moving dotfiles to air-gapped machines.

## Usage

```
dotpull bundle <subcommand> <file> [options]
```

## Subcommands

### create

Create a bundle file from the current repo.

```
dotpull bundle create dots.bundle --all
dotpull bundle create dots.bundle main
dotpull bundle create recent.bundle --since=2024-01-01
```

| Flag | Description |
|------|-------------|
| `--all` | Include all refs (branches, tags) |
| `<branch>` | Include only commits reachable from this branch |
| `--since=<date>` | Limit commits to those newer than the given date |

### verify

Verify that a bundle file is valid and can be applied to the current repo.

```
dotpull bundle verify dots.bundle
dotpull bundle verify dots.bundle --quiet
```

### list-heads

List the refs contained in a bundle file.

```
dotpull bundle list-heads dots.bundle
```

### unbundle

Unpack and apply a bundle into the current repo.

```
dotpull bundle unbundle dots.bundle
```

## Examples

```bash
# Back up everything to a portable file
dotpull bundle create ~/backup/dotfiles.bundle --all

# On another machine, verify before applying
dotpull bundle verify ~/backup/dotfiles.bundle
dotpull bundle unbundle ~/backup/dotfiles.bundle
```
