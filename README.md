# dotpull

> CLI tool to sync and version dotfiles across machines using a Git backend

---

## Installation

```bash
npm install -g dotpull
```

---

## Usage

Initialize dotpull in your home directory and link it to a remote Git repository:

```bash
# Initialize with a remote repo
dotpull init https://github.com/yourname/dotfiles.git

# Add a dotfile to track
dotpull add ~/.bashrc

# Push changes to remote
dotpull push

# Pull latest dotfiles on a new machine
dotpull pull
```

Dotpull will symlink tracked files back to their original locations automatically after a pull.

---

## Commands

| Command | Description |
|---|---|
| `dotpull init <repo>` | Initialize with a remote Git repository |
| `dotpull add <file>` | Start tracking a dotfile |
| `dotpull push` | Commit and push changes to remote |
| `dotpull pull` | Pull latest dotfiles and apply symlinks |
| `dotpull status` | Show tracked files and sync status |

---

## Requirements

- Node.js >= 14
- Git installed and available in `PATH`

---

## License

MIT © [Your Name](https://github.com/yourname)