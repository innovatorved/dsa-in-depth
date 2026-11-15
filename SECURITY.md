# Security Policy

## Architecture & Threat Model

DSA In Depth is a pure static client-side web application (`https://dsa-in-depth.vedgupta.in`) with zero backend execution servers and zero user authentication databases.

1. **Client-Side CodeLab Isolation (`@innovatorved/code-lab` `v0.6.1`)**:
   - User-authored C++20, TypeScript, JavaScript, and Python code in Guided Labs and From-Scratch Builds executes exclusively inside the visitor's own browser inside a dedicated `Blob`-backed Web Worker with hard timeout preemption and iframe `sandbox` isolation (`allow-scripts allow-forms allow-modals`, opaque `null` origin).
   - Dynamic prose, search queries, and simulator inputs are HTML-escaped before DOM insertion.
2. **Static Hosting Headers (`_headers`)**:
   - Deployed with `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and immutable caching on content-stamped assets.

## Supported Versions

Security fixes are applied to the latest commit on the `main` branch.

## Reporting a Vulnerability

Please report security vulnerabilities (such as DOM XSS via URL parameters or sandbox escapes) privately via [GitHub Security Advisories](https://github.com/innovatorved/dsa-in-depth/security/advisories/new) rather than opening a public issue. Include:

1. Affected route and component (`renderer`, `simulators`, `search`, `sandbox`, or `code-lab`).
2. Minimal reproduction URL or payload.
3. Expected vs. actual security boundary behavior.

We aim to acknowledge reports within 48 hours and publish a fix once verified.
