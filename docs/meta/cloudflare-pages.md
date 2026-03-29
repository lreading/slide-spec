# Deploying to Cloudflare Pages

This guide walks through setting up Cloudflare Pages to host a slide-spec site. It covers the one-time setup steps you need before the `Main` GitHub Actions workflow can deploy the slides and docs sites.

The instructions here are written for `slide-spec.dev` but apply to any custom domain.

---

## Prerequisites

Before you start:

- A Cloudflare account ([dash.cloudflare.com](https://dash.cloudflare.com))
- Your domain (`slide-spec.dev`) added to Cloudflare with its nameservers pointing to Cloudflare
- Admin access to the GitHub repository

---

## Step 1: Add your domain to Cloudflare

If your domain is not already on Cloudflare:

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com) and click **Add a site**.
2. Enter your domain name (`slide-spec.dev`) and click **Continue**.
3. Choose a plan (the Free plan is sufficient).
4. Cloudflare will scan your existing DNS records. Review and confirm.
5. Update your domain registrar's nameservers to the two Cloudflare nameservers shown (e.g. `aria.ns.cloudflare.com`, `eli.ns.cloudflare.com`). This step takes 5–30 minutes to propagate.

---

## Step 2: Create a Cloudflare Pages project

### Option A: Via the Cloudflare dashboard

1. In the Cloudflare dashboard, go to **Workers & Pages** → **Pages** → **Create a project**.
2. Choose **Direct Upload** (you will push from GitHub Actions, not connect a Git repo).
3. Name the project `slide-spec-homepage`. This name must match the `--project-name` flag in the deploy workflow.
4. Click **Create project**. You can skip the initial upload — the GitHub Actions workflow will do the first deploy.

### Option B: Via the Wrangler CLI (local)

```bash
npm install -g wrangler
wrangler login
# Build first
cd cli && npm ci && npm run build
node dist/index.js build ../slides --deployment-url https://slide-spec.dev
# Deploy
wrangler pages deploy slides/dist --project-name=slide-spec-homepage
```

---

## Step 3: Configure a custom domain

1. In the Cloudflare dashboard, go to **Workers & Pages** → **slide-spec-homepage** → **Custom domains**.
2. Click **Set up a custom domain**.
3. Enter `slide-spec.dev` and click **Continue**.
4. Cloudflare will automatically add a `CNAME` record pointing to `slide-spec-homepage.pages.dev`. Click **Activate domain**.

For `www.slide-spec.dev` (optional), repeat the same steps with `www.slide-spec.dev`.

> Cloudflare Pages custom domains always use Cloudflare's proxy (orange cloud), so no additional DNS setup is needed if the domain is already on Cloudflare.

---

## Step 4: Configure GitHub Actions authentication

Choose **one** of the two authentication approaches below. OIDC is preferred because it requires no long-lived secrets.

---

### Option A: API Token (simpler)

1. In the Cloudflare dashboard, go to **My Profile** → **API Tokens** → **Create Token**.
2. Use the **Edit Cloudflare Workers** template, or create a custom token with these permissions:
   - **Account** → **Cloudflare Pages** → Edit
3. Under **Account Resources**, select your account.
4. Click **Continue to summary** → **Create Token**.
5. Copy the token value — you will not see it again.

Add the token to GitHub:

1. Go to your repository on GitHub → **Settings** → **Secrets and variables** → **Actions**.
2. Click **New repository secret**.
3. Name: `CF_API_TOKEN`, Value: the token you just copied.

---

### Option B: OIDC (recommended — no long-lived secrets)

Cloudflare supports OIDC via Workload Identity Federation, allowing GitHub Actions to authenticate without storing a static API token.

#### 1. Enable OIDC in the deploy workflow

The `deploy-slides` job in the `Main` workflow already has `id-token: write` in its permissions block, which is required for OIDC.

#### 2. Create a Cloudflare API token scoped for OIDC

Even with OIDC you need a Cloudflare API token, but it is bound to a specific subject (your GitHub repository) rather than being a general secret.

1. In the Cloudflare dashboard, go to **My Profile** → **API Tokens** → **Create Token**.
2. Create a custom token with:
   - **Account** → **Cloudflare Pages** → Edit
3. Under **Client IP Address Filtering**, leave blank.
4. Create the token and copy the value.

#### 3. Set GitHub secrets

Add these two secrets to your repository (**Settings** → **Secrets and variables** → **Actions** → **New repository secret**):

| Secret name | Value |
|---|---|
| `CF_API_TOKEN` | The Cloudflare API token from step 2 |
| `CF_ACCOUNT_ID` | Your Cloudflare account ID (found in the dashboard URL: `dash.cloudflare.com/<account-id>`) |

> **Finding your account ID:** Go to the Cloudflare dashboard. The account ID is the alphanumeric string after `dash.cloudflare.com/` in the URL, e.g. `dash.cloudflare.com/abc123def456` → account ID is `abc123def456`. It is also shown on the right sidebar of any domain overview page under **Account ID**.

---

## Step 5: First deploy

After completing Steps 2–4, trigger a deploy manually:

1. Go to your repository on GitHub → **Actions** → **Main**.
2. Click **Run workflow** → **Run workflow**.

The workflow will:
1. Run the full quality gate suite.
2. In parallel, build and deploy the slides and docs sites.
3. For the slides site: install and build the CLI, run `cli fetch --force` to refresh GitHub data, run `cli build`, then push `slides/dist/` to Cloudflare Pages.
4. For the docs: run `npm run build` in `docs/`, then push `docs/.vitepress/dist/` to Cloudflare Pages.

Once it completes, visit `slide-spec.dev` to verify the site is live.

---

## Step 6: SSL/TLS configuration

Cloudflare handles TLS automatically for Pages custom domains. To verify:

1. Go to **slide-spec-homepage** → **Custom domains** and confirm the status shows **Active**.
2. Go to your domain in the Cloudflare dashboard → **SSL/TLS** → **Overview**.
3. Set the encryption mode to **Full (strict)**.

The site will be available at `https://slide-spec.dev` within a few minutes of the first successful deploy.

---

## Ongoing workflow

After the one-time setup:

- **Automatic deploys:** every push to `main` triggers the Main workflow, which deploys both the slides and docs sites after the quality gates pass.
- **Manual deploys:** use the **Run workflow** button on the Main action.
- **GitHub data:** `cli fetch --force` runs automatically on every deploy using the built-in `GITHUB_TOKEN`. No additional secrets are required for public repositories.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Deploy step fails with `Authentication error` | Verify `CF_API_TOKEN` and `CF_ACCOUNT_ID` secrets are set correctly in GitHub. |
| Deploy succeeds but custom domain shows the default Pages domain | Make sure you completed Step 3 (custom domain setup) and the status is **Active**. |
| `wrangler pages deploy` fails with `project not found` | The project name in the workflow (`--project-name=slide-spec-homepage`) must exactly match the project name you created in Step 2. |
| Site builds but shows wrong content | Run `cli validate slides` locally to check for YAML errors. |
| Fetch step fails with rate limit errors | The built-in `GITHUB_TOKEN` is used. For private repositories or very large repos, you may need a `GH_PAT` secret with `repo` read scope. Add it under `env:` in the fetch step as `GITHUB_TOKEN` mapped to your PAT secret. |
