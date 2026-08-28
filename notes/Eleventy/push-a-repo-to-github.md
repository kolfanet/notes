## Summary

A set of commands to push an existing repository to GitHub from the command line.

## Set your git identity

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

### Check

```bash
git config --list
```

## Push the repo to GitHub

```bash
git init
git add --all
git commit -m "Initial commit"
git remote add origin https://github.com/<username>/<repo>.git
git branch -M main
git push -u origin main
```

- If you want to use SSH instead of HTTPS, use `git remote add origin git@github.com:<username>/<repo>.git` instead.