# Tampermonkey scripts

## Installation

1. In Chrome/Edge: `chrome://extensions` → enable **Developer mode** (top-right toggle
2. Find Tampermonkey → **Details** → enable **Allow access to file URLs** and **Allow user scripts**
3. In Tampermonkey dashboard → **+** → paste the wrapper for each `.user.js` file below → Save

Changes to `.user.js` files are picked up automatically on the next page reload.

```js
// ==UserScript==
// @name         <script name>
// @match        <copy @match lines from the .user.js file>
// @require      file:///Users/andrei.senaev/projects/senaev-laptop-settings/tampermonkey/<script>.user.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==
```

### `jira`

```js
// ==UserScript==
// @name         Jira: Copy Task Link
// @match        https://*.atlassian.net/browse/*
// @match        https://*.atlassian.net/jira/*
// @require      file:///Users/andrei.senaev/projects/senaev-laptop-settings/tampermonkey/jira.user.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==
```
