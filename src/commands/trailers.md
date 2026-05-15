# dotpull trailers

Append or parse [Git trailers](https://git-scm.com/docs/git-interpret-trailers) in commit messages.
Trailers are structured key-value lines at the end of a commit message, commonly used for sign-offs and co-authorship.

## Usage

```
dotpull trailers [options] [file]
```

## Options

| Flag | Description |
|------|-------------|
| `--trailer <token>` | Add a trailer line (can be repeated) |
| `--trim` | Remove empty trailers |
| `--unfold` | Unfold multi-line trailer values into a single line |
| `--only` | Output only trailer lines |
| `--parse` | Parse and output existing trailers from the given file |

## Examples

### Add a sign-off trailer

```bash
dotpull trailers --trailer "Signed-off-by: Alice <alice@example.com>" COMMIT_EDITMSG
```

### Add multiple trailers

```bash
dotpull trailers \
  --trailer "Signed-off-by: Alice <alice@example.com>" \
  --trailer "Co-authored-by: Bob <bob@example.com>" \
  COMMIT_EDITMSG
```

### Parse trailers from a commit message file

```bash
dotpull trailers --parse COMMIT_EDITMSG
```

### Extract only trailer lines, trimming empty ones

```bash
dotpull trailers --only --trim COMMIT_EDITMSG
```

## Notes

- Wraps `git interpret-trailers` under the hood.
- Useful for enforcing contribution policies across dotfile commits.
- Combine with `dotpull hooks` to automatically append trailers on commit.
