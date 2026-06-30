# Viral Suite Dating

AI dating profile makeover service — upload photos, get 100 professional AI-generated dating pictures.

## Quick Start

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Replit

If `npm run dev` says **Missing script: "dev"**, Replit replaced the repo with its pnpm monorepo template. Fix it:

```bash
npm run replit:fix
```

Or click **Run** — `.replit` runs `scripts/replit-dev.sh`, which auto-restores from GitHub and starts the server.

After it starts, add secrets from `.env.example` under **Tools → Secrets**.

See [REQUIREMENTS.md](./REQUIREMENTS.md) for full setup including Firebase, Stripe, Higgsfield, and FAL.

**Support:** contact@viral-suite.com
