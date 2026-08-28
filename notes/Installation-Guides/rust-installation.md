## Sources

- [Official documentation](https://rust-lang.org/tools/install/)

## Install Rust (via rustup)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Notes:

- installs Rust for current user only

## Restart current shell

For bash:

```bash
. "$HOME/.cargo/env"
```

## Check the version

```bash
rustc --version
cargo --version
```

## Install `build-essential` package

```bash
sudo apt install build-essential
```

On Fedora:

```bash
sudo dnf group install development-tools
```
## Create test project

```bash
cargo new test_project
cd test_project
cargo run
```

## Update rust

```bash
rustup update
```

## Uninstall rust

```bash
rustup self uninstall
```
