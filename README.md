# Smart Tip Calculator

A Next.js + Tailwind CSS tip calculator with dark mode, quick-tip presets, a custom tip slider, bill splitting, and repeatable round-up/round-down controls.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Push to GitHub

1. Create a new empty repository on GitHub (no README/license, so it starts blank): https://github.com/new
2. From inside this `tip-calculator` folder, run:

```bash
git init
git add .
git commit -m "Initial commit: Smart Tip Calculator"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

## Deploy on Vercel

1. Go to https://vercel.com/new
2. Import the GitHub repository you just pushed.
3. Leave all settings at their defaults — Vercel auto-detects Next.js.
4. Click **Deploy**.

Every future push to `main` will auto-deploy. For a one-off deploy without GitHub, you can also install the Vercel CLI and run:

```bash
npm i -g vercel
vercel
```
