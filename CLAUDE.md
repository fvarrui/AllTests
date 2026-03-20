# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LogAppEda** - A browser-based quiz trainer for Spanish competitive exams (oposiciones), specifically for speech therapy (Logopeda) positions in the Canary Islands Health Service (SCS 2026). All UI text is in Spanish.

## Running the Application

No build step required. Open `docs/Logopeda/index.html` directly in a browser, or serve with any static HTTP server:

```bash
npx serve docs/
# or
python -m http.server --directory docs/
```

## Architecture

The app is a vanilla JS single-page application with three screens: **Menu → Quiz → Results**.

### Key Files

- `docs/Logopeda/index.html` — Full application (structure + all JS logic inline)
- `docs/Logopeda/config.js` — App metadata, defaults, scoring thresholds, themes
- `docs/Logopeda/questions.js` — Array of 540 question objects `{id, question, options: {A,B,C,D}, correct}`
- `docs/themes/dark.css` / `light.css` — CSS custom properties for theming

### State Management

All state lives in global JS variables inside `index.html`. Key variables: `currentMode` (immediate/final correction), `currentOrder` (random/sequential), `selectionMode` (count/range), `questions[]`, `currentIndex`, `answers[]`.

### Configuration (`config.js`)

Controls defaults (30 questions, slider 5–540, presets 10/25/50/100), scoring thresholds (excellent ≥80%, good ≥60%, average ≥40%), and result messages. Add new exam types by creating a new directory under `docs/` with its own `config.js` and `questions.js`.

### Adding Questions

Questions in `questions.js` follow this format:
```js
{ id: 1, question: "...", options: { A: "...", B: "...", C: "...", D: "..." }, correct: "A" }
```

## Allowed Commands

The `.claude/settings.local.json` permits `sed` and `node` for scripted question/content manipulation tasks.
