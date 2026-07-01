// ==UserScript==
// @name         Jira: Copy Task Link
// @namespace    https://github.com/senaev
// @version      2.6.0
// @description  Adds a "Copy link" button in the Jira top nav that copies "KEY-123: Task name" as a rich clickable link
// @author       Andrei Senaev
// @match        https://*.atlassian.net/browse/*
// @match        https://*.atlassian.net/jira/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  const BUTTON_ID = "tm-copy-task-link-btn";

  // ── Insertion point ───────────────────────────────────────────────────────
  // The current-issue breadcrumb container — prepend our button so it appears
  // before the "change work type" icon and the key link.
  const BREADCRUMB_CONTAINER_SELECTOR =
    '[data-testid="issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue-container"]';

  // ── Extractors ────────────────────────────────────────────────────────────

  function getIssueKey() {
    const match = location.pathname.match(/\/(?:browse|issue|issues)\/([\w]+-\d+)/i);
    return match ? match[1].toUpperCase() : null;
  }

  function getIssueSummary() {
    const selectors = [
      '[data-testid="issue.views.issue-base.foundation.summary.heading"]',
      'h1[data-testid*="summary"]',
      "h1.summary",
      "#summary-val", // Classic Jira
      "h1",
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el?.textContent.trim()) return el.textContent.trim();
    }
    // Last resort: parse the page title ("KEY-123 Summary text - Jira")
    const titleMatch = document.title.match(/[\w]+-\d+\s+(.+?)\s*[-|]/);
    return titleMatch ? titleMatch[1].trim() : null;
  }

  // ── Clipboard ─────────────────────────────────────────────────────────────

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function copyRichLink(text, url) {
    const html = `<a href="${escapeHtml(url)}">${escapeHtml(text)}</a>`;
    if (window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": new Blob([text], { type: "text/plain" }),
          "text/html": new Blob([html], { type: "text/html" }),
        }),
      ]);
    } else {
      await navigator.clipboard.writeText(text);
    }
  }

  // ── Button ────────────────────────────────────────────────────────────────

  function showFeedback(btn, message, durationMs = 1500) {
    const original = btn.textContent;
    btn.textContent = message;
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, durationMs);
  }

  function createButton() {
    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.textContent = "🔗";
    btn.title = 'Copy "KEY-123: Task name" as a clickable link';

    // Compact icon button styled to blend with the breadcrumb row.
    Object.assign(btn.style, {
      display: "inline-flex",
      alignItems: "center",
      alignSelf: "center",
      flexShrink: "0",
      padding: "2px 4px",
      marginRight: "6px",
      fontSize: "13px",
      lineHeight: "1",
      cursor: "pointer",
      border: "none",
      borderRadius: "3px",
      background: "transparent",
      color: "inherit",
      opacity: "0.5",
      transition: "opacity 0.1s, background 0.1s",
    });

    btn.addEventListener("mouseenter", () => {
      btn.style.opacity = "1";
      btn.style.background = "rgba(9,30,66,0.08)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.opacity = "0.5";
      btn.style.background = "transparent";
    });

    btn.addEventListener("click", async () => {
      const key = getIssueKey();
      if (!key) {
        alert("Not on a Jira issue page.");
        return;
      }
      const summary = getIssueSummary();
      if (!summary) {
        alert("Could not read the issue summary — try again once the page has fully loaded.");
        return;
      }
      const text = `${key}: ${summary}`;
      const url = `${location.origin}/browse/${key}`;
      try {
        await copyRichLink(text, url);
        showFeedback(btn, "✅");
      } catch (err) {
        console.warn("[CopyTaskLink] Clipboard write failed:", err);
        prompt("Copy this link text:", text);
      }
    });

    return btn;
  }

  // ── Injection ─────────────────────────────────────────────────────────────

  function insertBtn(container) {
    if (document.getElementById(BUTTON_ID)) return;
    container.insertBefore(createButton(), container.firstChild);
  }

  // Targeted observer on the breadcrumb container — re-injects immediately
  // when React removes our button as a direct child.
  let watchedContainer = null;
  let containerObserver = null;

  function watchContainer(container) {
    if (container === watchedContainer) return;
    if (containerObserver) containerObserver.disconnect();
    watchedContainer = container;
    containerObserver = new MutationObserver(() => insertBtn(container));
    containerObserver.observe(container, { childList: true });
  }

  function injectButton() {
    const container = document.querySelector(BREADCRUMB_CONTAINER_SELECTOR);
    if (!container) return;
    insertBtn(container);
    watchContainer(container);
  }

  // Global observer — detects the container appearing on first load or after
  // SPA navigation. No debounce: the `container === watchedContainer` guard
  // makes it a no-op on every call after the container is already being
  // watched, so it never hammers even during React re-render bursts.
  const globalObserver = new MutationObserver(() => {
    const container = document.querySelector(BREADCRUMB_CONTAINER_SELECTOR);
    if (!container || container === watchedContainer) return;
    injectButton();
  });
  globalObserver.observe(document.body, { childList: true, subtree: true });

  injectButton();
})();
