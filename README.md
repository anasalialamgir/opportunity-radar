# Opportunity Radar

A deployable CV-driven job search website. People can create accounts, upload and review a CV, state their next career goals, scan real job feeds, compare profile matches, save listings, track applications, create email alerts, reset their password, and export or delete their data. The app does not apply for jobs on anyone's behalf.

## Start on your computer

1. Install Docker Desktop. Download this repository and open a terminal in its folder.
2. Copy `.env.example` to `.env`. Set new random values for `NEXTAUTH_SECRET`, `CRON_SECRET`, and `POSTGRES_PASSWORD` (use letters, digits and hyphens in the database password). On macOS/Linux, `openssl rand -base64 48` generates a secret. Keep `.env` private.
3. Set `AI_PROVIDER=gemini` and `GEMINI_API_KEY` to enable AI CV parsing, application advice, and semantic matching. OpenAI remains supported with `AI_PROVIDER=openai` and `OPENAI_API_KEY`; Ollama supports parsing and advice locally. Without an AI key, people can fill in skills and goals manually and use lexical matching.
4. To deliver verification emails, password reset links, and alerts, fill `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `EMAIL_FROM` with your email provider's SMTP details. For Resend: use `smtp.resend.com`, port `465`, user `resend`, and your Resend API key as the SMTP password. Verify a sending domain in Resend first and set `EMAIL_FROM` to an address on that domain. Set `NEXTAUTH_URL` to the URL people actually visit.
5. Run `docker compose up --build -d`. Visit `http://localhost:3000`. The database migration runs automatically. The worker begins checking alerts and retries if the web service is not ready.
6. Create an account, upload a PDF/DOCX/TXT/MD CV under 5 MB, review the extracted skills in Profile, add target roles and country, then press **Trigger Scan**. Open a listing's original URL to confirm it is still available and accepts applications from your location. Verify your email and add alerts on the Alerts page.

### Publish at a domain with HTTPS

1. Arrange a Linux server with Docker Compose and a domain name. Point a DNS A record for your chosen subdomain to the server's public IP. Allow ports 80 and 443. Keep PostgreSQL inaccessible from the public internet.
2. On that server, clone the repository. Set `DOMAIN=jobs.your-domain.com` in `.env`. Also configure the secrets, OpenAI key, and SMTP values above. `compose.prod.yml` sets `NEXTAUTH_URL` to `https://$DOMAIN`.
3. Run `docker compose -f compose.prod.yml up --build -d`. Caddy requests an HTTPS certificate and proxies to the app; Docker keeps PostgreSQL data in a volume. Check `docker compose -f compose.prod.yml logs -f app worker web` for startup and email errors.
4. After a deployment, open the site, create a test account, verify its email, upload a CV, scan, save a job, create an alert, and check that the scheduled worker sends a digest. SMTP may require a verified sender domain at your provider.
5. Back up the `postgres_data` volume regularly; back up before changing database migrations. Run updates with `git pull` then `docker compose -f compose.prod.yml up --build -d`.

The local Compose file uses port 3000 and is meant for private use. The production Compose file exposes only Caddy on 80/443 and persists the database and TLS certificates. Hosting, DNS, SMTP, and AI API accounts are external services that must be provided by the site operator; this repository contains no credentials.

### Deploy on Vercel (existing Vercel project)

1. Merge the tested changes into the GitHub branch connected to your Vercel project, usually `main`. In Vercel, confirm the project is linked to this repository and check its configured production branch.
2. Connect a persistent hosted PostgreSQL database. Set `DATABASE_URL` to its connection URL in Vercel **Production** environment variables. Back up an existing database first. Apply schema migrations with `npx prisma migrate deploy` in an environment where `DATABASE_URL` is set to that database; never reset a production database. This is an explicit deployment step, not part of the Next.js build.
3. In Vercel's project Settings → Environment Variables (Production), set `NEXTAUTH_URL` to the public HTTPS URL, `NEXTAUTH_SECRET` and `CRON_SECRET` to separate long random values, `AI_PROVIDER=gemini`, `GEMINI_API_KEY`, `SMTP_HOST=smtp.resend.com`, `SMTP_PORT=465`, `SMTP_USER=resend`, `SMTP_PASSWORD` to the Resend API key, and `EMAIL_FROM` to a sender on your verified domain. Store both API keys as sensitive variables. Do not put keys in GitHub, the browser's client-side variables, source files, or issues.
4. Redeploy Production after changing variables. `vercel.json` schedules a daily alert scan at 06:00 UTC; Vercel sends its `CRON_SECRET` automatically. The Docker alert worker is for Docker deployments only. Vercel's Hobby plan limits cron to daily runs, so this configuration uses a daily schedule. For larger user counts, move scanning to a queue/worker rather than relying on a single serverless invocation.
5. Visit `/api/health`: it should report `database: connected`, `ai: configured`, and `email: configured`. Then test registration, verification email, CV upload, job scan, save, password reset, and an alert. A configured status only checks presence of settings; a real test email and CV parse are needed to confirm provider access.

The Vercel URL can be used without buying a custom website domain. Resend still requires a verified sending domain to send production email. If the Vercel project is currently running older code, changing its environment variables alone will not deploy these changes.

### Existing database

The initial migration describes a fresh database. If this repository previously used `prisma db push`, back up its data and baseline the existing schema before applying migrations. Do not reset a database with real users. Old passwordless demo accounts need a deliberate password migration or new registration. Previous simulated listings are excluded from current matches.

## What a scan does

- Pulls published listings from the [Remotive API](https://remotive.com/remote-jobs/api), [Jobicy API](https://jobicy.com/jobs-rss-feed), and open GitHub issues labeled `bounty`. The public Jobicy link goes to Jobicy's listing; it is not a direct employer application URL.
- Uses target roles and CV skills to query relevant sources, saves linked listings, then ranks up to 500 recent listings. Matching considers title, skills, experience, capabilities, location restrictions, and comparable compensation when stated. With a Gemini or OpenAI key, embeddings add semantic similarity. Fit percentages are ranking indicators, not hiring probabilities.
- Sends verified users a digest when a scheduled scan finds previously unnotified matches for their active alert rules. The worker defaults to every six hours. Jobicy requests are cached at least an hour in accordance with its published polling guidance. A GitHub bounty label does not guarantee funding; always check the original issue.
- Sends extracted CV text to the configured AI provider only when the user requests parsing, and sends concise profile/job text for semantic matching when enabled. Credentials stay on the server. No application is submitted automatically.

## Commands and operational notes

`npm ci`, `npm run db:deploy`, `npm run dev`, `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`.

The HTTP health of a job source can vary; one failing source does not create fake jobs. If all sources fail, the scan reports an error. Email delivery and account recovery require SMTP; without it, scanning and manual profile editing remain available. The server's database and AI provider must be reachable for those features to run.
