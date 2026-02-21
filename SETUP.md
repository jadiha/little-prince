# Setup Guide

## First time (fresh clone)

Run these two commands in order:

```bash
# 1. Install ALL dependencies (Three.js, React, animations, everything)
npm install --no-audit --no-fund

# 2. Start the app
npm run dev
```

Then open **http://localhost:5173** in your browser.

> **If npm install hangs:** you're on a restricted network.
> Switch to personal wifi or a phone hotspot and run it again.
> The `.npmrc` file in this folder handles the registry settings automatically.

---

## Every time after the first

```bash
npm run dev
```

---

## Optional: Anthropic API key (for the live Prince voice)

Without a key the app works fully — the Little Prince uses pre-written
quotes from the book. Stars, rose, planets, all goal tracking: everything works.

If you want him to respond personally to your goals and progress:

1. Get a key at https://console.anthropic.com
2. Create `.env.local` in the project root:

```
ANTHROPIC_API_KEY=your-key-here
```

> `.env.local` is gitignored — never committed, never shared.

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add `ANTHROPIC_API_KEY` in Vercel Dashboard → Settings → Environment Variables.
