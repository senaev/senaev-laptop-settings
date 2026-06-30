# AGENTS.md

This is a macOS dotfiles/settings repository for Andrei Senaev's laptop.
It stores configuration files for various tools, versioned in one place for backup and portability.

## Contents

| Path | Tool | Description |
|------|------|-------------|
| `espanso/external-matches.yaml` | [Espanso](https://espanso.org) | Text expander triggers and replacements (emoji shortcuts, snippets) |
| `ghostty/config.ghostty` | [Ghostty](https://ghostty.org) | Terminal emulator config |
| `starship/starship.toml` | [Starship](https://starship.rs) | Shell prompt config |
| `tmux/.tmux.conf` | [tmux](https://github.com/tmux/tmux) | Terminal multiplexer config |
| `zsh/utils.sh` | zsh | Shell utility functions and aliases |
| `layouts/` | macOS | Custom keyboard layouts (installed to `/Library/Keyboard Layouts/`) |
| `karabiner-complex-modification.json` | [Karabiner-Elements](https://karabiner-elements.pqrs.org) | Key remapping rules |
| `snippets.xml` | VS Code | Custom code snippets |
| `.vscode/settings.json` | VS Code | Editor settings |

## Notes for the AI agent

- This repo has no build system, no tests, and no CI. Changes are applied manually by copying/symlinking files to their target locations.
- Most edits are small: adding/removing a trigger in `espanso/`, tweaking a config value, etc.
- After any change the user will typically ask to commit and push — follow the commit naming convention from the global AGENTS.md.
