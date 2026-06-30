# Viral Suite Dating

AI dating profile makeover service — upload photos, get 100 professional AI-generated dating pictures.

## Quick Start

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Replit

Replit often replaces imports with a pnpm monorepo template. **Do not merge or pull** — force-reset instead.

**One command fix** (paste in Replit Shell):

```bash
curl -fsSL https://raw.githubusercontent.com/gmwhipple/viral-suite-dating/main/scripts/replit-reset.sh | sh
```

That aborts any stuck merge, hard-resets to GitHub `main`, cleans template junk, installs deps, and starts the app.

Or click **Run** after reset — `.replit` uses `scripts/replit-dev.sh`, which auto-fixes the wrong template.

Add secrets from `.env.example` under **Tools → Secrets**.

See [REQUIREMENTS.md](./REQUIREMENTS.md) for full setup including Firebase, Stripe, Higgsfield, and FAL.

**Support:** contact@viral-suite.com
