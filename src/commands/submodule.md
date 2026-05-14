# submodule

Manage Git submodules inside your dotfiles repository.

## Usage

```
dotpull submodule [action] [options]
```

## Actions

| Action     | Description                                      |
|------------|--------------------------------------------------|
| *(none)*   | List all submodules (runs `git submodule status`)|
| `init`     | Initialize submodule config                      |
| `update`   | Update submodules to recorded commits            |
| `add`      | Add a new submodule                              |
| `deinit`   | Unregister a submodule                           |
| `sync`     | Sync submodule remote URLs from `.gitmodules`    |
| `foreach`  | Run a shell command in each submodule            |

## Options

| Flag          | Description                                  |
|---------------|----------------------------------------------|
| `--recursive` | Recurse into nested submodules               |
| `--remote`    | Update to latest remote commit (update only) |
| `--force`     | Force operation (deinit only)                |
| `-b, --branch`| Branch to track when adding a submodule      |
| `--path`      | Path for the submodule                       |
| `--url`       | Remote URL when adding a submodule           |
| `--command`   | Shell command to run (foreach only)          |

## Examples

```bash
# List all submodules
dotpull submodule

# Add a Vim plugin as a submodule
dotpull submodule add --url https://github.com/tpope/vim-sensible.git --path vim/pack/plugins/vim-sensible

# Update all submodules recursively to latest remote
dotpull submodule update --recursive --remote

# Run git pull in every submodule
dotpull submodule foreach --command "git pull origin main"

# Remove an old submodule
dotpull submodule deinit --force --path vim/pack/plugins/old-plugin
```
