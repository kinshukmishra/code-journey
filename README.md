# Code Journey

An interactive web app that teaches programming from binary to the agentic era. Built for middle schoolers (and curious learners of any age) to understand how programming evolved and to become proficient in **spec-driven development (SDD)** — the skill of describing what you want so AI can help you build it.

## What You'll Learn

| Module | Era | Topics |
|--------|-----|--------|
| Thinking in Binary | 1940s–1950s | Bits, bytes, ASCII, binary math |
| Assembly Language | 1950s–1960s | Registers, instructions, jumps, loops |
| High-Level Languages | 1960s–1980s | BASIC — variables, IF/THEN, FOR loops |
| Modern Programming | 1990s–2020s | Python — functions, lists, FizzBuzz |
| Spec-Driven Development | 2024–Future | Writing specs, edge cases, the build-test-refine cycle |

Each module includes narrative lessons followed by hands-on challenges with real-time feedback. Code runs directly in the browser — no setup, no installs, no accounts.

## Features

- **Interactive code editors** with syntax highlighting (CodeMirror)
- **Binary toggle widget** — click switches ON/OFF to learn binary visually
- **Built-in interpreters** for Assembly, BASIC, and Python (all run client-side)
- **Adaptive feedback** — hints change based on what you got wrong
- **Star rating system** — 3 stars for first try, fewer if you need hints
- **Progress tracking** — saved in your browser, pick up where you left off
- **Sequential unlock** — modules build on each other naturally

## Try It

**Live site:** Visit the GitHub Pages deployment (enable Pages on your fork)

**Run locally:**

```bash
git clone https://github.com/YOUR_USERNAME/code-journey.git
cd code-journey
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Deploy Your Own

This is a fully static site — no backend, no database, no API keys. Deploy anywhere:

**GitHub Pages (recommended):**
1. Fork this repo
2. Go to Settings > Pages > Source: "GitHub Actions"
3. Push to `main` — the included workflow auto-deploys

**Other platforms:** Run `npm run build` and deploy the `dist/` folder to Vercel, Netlify, Cloudflare Pages, or any static host.

## Built With

- React + TypeScript + Vite
- CodeMirror (code editor)
- Lucide React (icons)
- Custom interpreters for Assembly, BASIC, and Python
- No backend — everything runs in the browser

## Why This Exists

Programming education typically starts with syntax. But the agentic era demands a different skill: the ability to clearly describe what you want built. This curriculum walks learners through the *history* of programming to build intuition, then bridges to spec-driven development — where you're the architect and AI is the construction crew.

## License

MIT — use it, fork it, teach with it, share it freely.
