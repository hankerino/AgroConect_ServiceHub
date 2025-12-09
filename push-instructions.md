# How to Push Changes to the AgroConect ServiceHub Repository

This guide provides step-by-step instructions on how to push your local changes to the GitHub repository.

## 1. Configure Your GitHub Personal Access Token (PAT)

To push changes, you need a GitHub Personal Access Token (PAT) with the correct permissions.

1.  **Go to your GitHub settings:**
    *   Click on your profile picture in the top-right corner and select "Settings".
    *   In the left sidebar, click on "Developer settings".
    *   Click on "Personal access tokens" and then "Tokens (classic)".

2.  **Generate a new token (or edit an existing one):**
    *   Click "Generate new token" (or edit your existing token for this repository).
    *   Give your token a descriptive name (e.g., "AgroConect-ServiceHub-Token").
    *   **Crucially, you must select the following scopes:**
        *   `repo` (Full control of private repositories)
        *   `workflow` (Update GitHub Action workflows)

3.  **Copy and save your token:**
    *   Click "Generate token" at the bottom of the page.
    *   Copy the token and save it in a safe place. You will not be able to see it again.

## 2. The Git Workflow

Follow these steps every time you want to push your changes:

1.  **Pull the latest changes:**
    *   Before you start working, and before you push, always pull the latest changes from the remote repository to avoid merge conflicts:
        ```bash
        git pull origin main
        ```

2.  **Add your changes:**
    *   Stage all your changes for commit:
        ```bash
        git add .
        ```

3.  **Commit your changes:**
    *   Commit your staged changes with a descriptive message:
        ```bash
        git commit -m "Your descriptive commit message"
        ```

4.  **Push your changes:**
    *   Push your committed changes to the remote repository:
        ```bash
        git push origin main
        ```

## 3. Troubleshooting: Credential Caching

If you have previously entered an incorrect password or token, your computer may have cached it. If you get a permission error even after creating a new token with the correct scopes, you may need to clear your cached credentials.

**On macOS:**

1.  Open the "Keychain Access" application.
2.  Search for `github.com`.
3.  Find the "internet password" entry for `github.com` and delete it.
4.  The next time you push, you will be prompted to enter your username and password. Use your new PAT as the password.

**On Windows:**

1.  Open the "Credential Manager".
2.  Go to "Windows Credentials".
3.  Find the entry for `git:https://github.com` and remove it.
4.  The next time you push, you will be prompted to sign in.
