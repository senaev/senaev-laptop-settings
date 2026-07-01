# AGENTS.md

This is a macOS dotfiles/settings repository for Andrei Senaev's laptop.
It stores configuration files for various tools, versioned in one place for backup and portability.

## Contents

| Path                                  | Tool                                                      | Description                                                         |
| ------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------- |
| `espanso/external-matches.yaml`       | [Espanso](https://espanso.org)                            | Text expander triggers and replacements (emoji shortcuts, snippets) |
| `ghostty/config.ghostty`              | [Ghostty](https://ghostty.org)                            | Terminal emulator config                                            |
| `starship/starship.toml`              | [Starship](https://starship.rs)                           | Shell prompt config                                                 |
| `tmux/.tmux.conf`                     | [tmux](https://github.com/tmux/tmux)                      | Terminal multiplexer config                                         |
| `zsh/utils.sh`                        | zsh                                                       | Shell utility functions and aliases                                 |
| `layouts/`                            | macOS                                                     | Custom keyboard layouts (installed to `/Library/Keyboard Layouts/`) |
| `karabiner-complex-modification.json` | [Karabiner-Elements](https://karabiner-elements.pqrs.org) | Key remapping rules                                                 |
| `snippets.xml`                        | VS Code                                                   | Custom code snippets                                                |
| `.vscode/settings.json`               | VS Code                                                   | Editor settings                                                     |
| `tampermonkey/`                       | [Tampermonkey](https://www.tampermonkey.net)              | Userscripts for browser automation and UI enhancements              |

## Tampermonkey scripts

Scripts live in `tampermonkey/*.user.js`. Each file is a self-contained userscript with a standard `==UserScript==` header.

### Installation (live-reload via `@require file://`)

Instead of pasting script contents manually, install a thin wrapper that points at the local file.
Changes to the repo file are picked up automatically on the next page reload.

**One-time browser setup** (Chrome/Edge — do this once per browser):  
`chrome://extensions` → Tampermonkey → Details → enable **"Allow access to file URLs"**

**Per-script setup:** in Tampermonkey dashboard → **+** (Create new script) → replace the
default content with only the header below (no body), adjusting the `@require` path if needed:

```js
// ==UserScript==
// @name         <script name>
// @match        <same @match lines as in the .user.js file>
// @require      file:///Users/andrei.senaev/projects/senaev-laptop-settings/tampermonkey/<script>.user.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==
```

Save. From now on Tampermonkey reads the local file on every page load — no reinstalling needed after edits.

## Notes for the AI agent

- This repo has no build system, no tests, and no CI. Changes are applied manually by copying/symlinking files to their target locations.
- Most edits are small: adding/removing a trigger in `espanso/`, tweaking a config value, etc.
- After any change the user will typically ask to commit and push — follow the commit naming convention from the global AGENTS.md.
