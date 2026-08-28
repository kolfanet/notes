## Summary

Node.js installation on Linux via NVM (Node Version Manager) with NPM (package manager).

## Sources

- [Official download page](https://nodejs.org/en/download)

## Download and install NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
```

## Load NVM into current shell session

```bash
\. "$HOME/.nvm/nvm.sh"
```

## Download and install Node.js

```bash
nvm install 24
```

- Installs Node.js into the user's home directory (`~/.nvm`) — not system-wide, but user-specific
- Modifies user's shell configuration so that `nvm` is available when they log in

## Verify the versions

```bash
node -v
npm -v
```