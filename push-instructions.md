# GitHub Sync & Push Instructions

This environment cannot reach GitHub over HTTPS tunneling (attempts return `403 CONNECT`). Use a machine with outbound
GitHub access—or supply a Personal Access Token (PAT) if your network permits—to pull updates or push work to
`https://github.com/hankerino/AgroConect_ServiceHub.git`.

## One-time remote setup

```bash
# If origin is not configured
git remote add origin https://github.com/hankerino/AgroConect_ServiceHub.git

# Verify the remote URL
git remote -v
```

## Pull the latest changes from GitHub

If your environment allows GitHub access:

```bash
git fetch origin
# To update this branch with the latest remote changes
git pull --rebase origin work  # or replace `work` with your branch name
```

If `git fetch` fails with `403 CONNECT`, pull on another machine with GitHub access and copy the updated repo back
into this workspace (e.g., via archive download or file transfer).

## Push from a machine with GitHub access

```bash
git checkout work
git pull --rebase origin work

git add .
git commit -m "<your message>"

git push -u origin work
```

## Push or pull from this environment with a PAT (if HTTPS is allowed)

1. Create a PAT with `repo` scope on GitHub.
2. Export it before pushing or pulling:

```bash
export GITHUB_TOKEN="<your token>"
# Git uses the token when prompted for a password
```

If the environment still blocks HTTPS CONNECT after providing a token, perform Git operations from a network that
allows outbound GitHub traffic.
