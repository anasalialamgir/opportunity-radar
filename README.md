# Opportunity Radar

A CV-driven job discovery MVP. A signed-in job seeker uploads a CV, edits the extracted profile, scans published listings, reviews explainable fit scores, opens the original source, and tracks applications. Scans use the [Remotive public jobs API](https://remotive.com/remote-jobs/api) and open GitHub issues labeled `bounty`. AI parses CVs and prepares application advice when configured. It never submits applications.

## Run locally (beginner steps)

1. Install Node.js 20 or later and PostgreSQL 16, or install Docker Desktop.
2. Download the repository and open a terminal in its folder.
3. Copy `.env.example` to `.env`. Change `NEXTAUTH_SECRET` to a fresh long random string (`openssl rand -base64 48`). Set `OPENAI_API_KEY` if you want CV parsing and the application assistant. Never commit `.env` or put the key in a browser field.
4. With Docker Desktop: replace `POSTGRES_PASSWORD` in `.env` with your own long password (letters, numbers, and hyphens); run `docker compose up --build`. Visit `http://localhost:3000`. Docker waits for the database and applies migrations.
5. Without Docker: create an empty PostgreSQL database named `opportunity_radar`, set its `DATABASE_URL` in `.env`, then run `npm ci`, `npm run db:deploy`, and `npm run dev`. Visit `http://localhost:3000`.
6. Create an account with a 12-character password. Upload a PDF, DOCX, TXT or MD CV (5 MB limit), review its skills on the profile page, set your country and remote preference, then select **Trigger Scan** on the dashboard. Review the original listing before applying. You can enter skills manually on the profile page when no AI key is configured.

CV extraction requires an OpenAI API key or a running Ollama installation with `AI_PROVIDER=ollama`. The matching score itself is deterministic and does not require an AI key. A missing or failing AI provider returns an explicit error; it never invents parsed credentials or advice. OpenAI use sends the pasted/extracted CV text to your configured provider. Job feeds only receive skill search terms; GitHub search is based on the first relevant skill. Remotive results are cached for one hour and GitHub results for ten minutes.

### Existing database

The initial migration describes a fresh database. If you previously used `prisma db push`, back up your data before migrating. Prisma may require baselining an existing database; do not run a destructive reset. Existing passwordless demo accounts cannot log in with a new password. Create a new account, or migrate those accounts deliberately with a one-time password reset flow before opening the service to existing users. Previously simulated listings are excluded from the current matches view.

## Deployment

Deploy the Next.js app to a server with persistent PostgreSQL, set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (the exact public HTTPS address), and your AI configuration as environment secrets, then run `npm run db:deploy` once and `npm run build && npm start`. Docker Compose is suitable for a private demonstration on your own machine; publishing on the internet additionally requires HTTPS, backups, monitoring, and rate limits. The build does not mutate the database.

## Checks

`npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`.

## Current boundaries

- Sources are limited to Remotive and GitHub paid-issue labels. Geographic eligibility and job availability require human checking. The Remotive feed is not a full web search and the GitHub label does not prove funding.
- Matching uses interpretable skill, role, capability, and location signals. Percentages are ranking indicators, not hiring probabilities. Salary comparison is only approximate and should be checked against period and currency.
- Email or Telegram alerts and automatic applications are not implemented. Their screens now state this honestly.
- This is an MVP; add password reset/email verification, abuse controls, consent and data deletion tools, more licensed job sources, and end-to-end database tests before a public launch.
