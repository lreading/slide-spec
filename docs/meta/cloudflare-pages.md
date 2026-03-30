# Deploying to Cloudflare Pages

For most slide-spec projects, the simplest deployment model is to connect your GitHub repository directly to Cloudflare Pages and let Pages run the build on each push.

You do not need a GitHub Action just because you are using `@slide-spec/cli`.

This guide assumes:

- your project lives in a GitHub repository
- `generated.yaml` is committed as point-in-time content
- Cloudflare Pages should build the site from source

If that matches your setup, this is the recommended approach.

---

## When direct Git deploys are the right fit

Direct Git-connected Pages deploys are a good default when:

- `presentation.yaml` and `generated.yaml` are already in the repo
- you want deploys to reflect committed content only
- you do not need a deploy-time `slide-spec fetch`
- you want the fewest moving parts

That is the common case for slide-spec sites.

---

## When GitHub Actions make sense instead

Use a GitHub Action only if you need extra deployment logic that Cloudflare Pages should not own, for example:

- fetching fresh GitHub data during deploy
- generating artifacts from private systems
- enforcing a custom promotion flow before deploy
- publishing multiple outputs with one orchestrated pipeline

If your site is meant to be a point-in-time snapshot, committing `generated.yaml` and building directly in Cloudflare Pages is the simpler model.

---

## Prerequisites

Before you start:

- a Cloudflare account
- a GitHub repository containing your slide-spec project
- your domain added to Cloudflare if you plan to use a custom domain

---

## Step 1: Connect the repository to Cloudflare Pages

1. In the Cloudflare dashboard, open **Workers & Pages**.
2. Create a new **Pages** project.
3. Choose **Connect to Git**.
4. Authorize GitHub if Cloudflare prompts you.
5. Select the repository that contains your slide-spec project.

If your slides project lives in a subdirectory, that is fine. You will point Cloudflare at the right root/build settings in the next step.

---

## Step 2: Configure the build

Use these settings for a standard slides site:

| Setting | Value |
|---|---|
| Framework preset | `None` |
| Build command | `npx @slide-spec/cli build` |
| Build output directory | `dist` |
| Root directory | your project root, for example `slides` |

If the slide-spec project is at the repository root, leave **Root directory** empty.

If you want sitemap generation, set a deployment URL in your content or pass it through the build command instead:

```bash
npx @slide-spec/cli build --deployment-url https://updates.example.com
```

In most cases it is cleaner to set `site.deployment_url` in `content/site.yaml` and keep the build command simple.

---

## Step 3: Make sure the repo already contains generated content

Cloudflare Pages should build from committed files. That means:

- `presentation.yaml` should already exist
- `generated.yaml` should already exist if the deck uses generated data

You can refresh generated content locally before committing:

```bash
npx @slide-spec/cli fetch --presentation-id 2026-launch --from-date 2026-03-15 --force
npx @slide-spec/cli validate
npx @slide-spec/cli build
```

Then commit the updated YAML and push.

That keeps deployment deterministic: Cloudflare builds exactly what is in Git.

---

## Step 4: Configure a custom domain

After the first successful deploy:

1. Open your Pages project in Cloudflare.
2. Go to **Custom domains**.
3. Add your domain, for example `updates.example.com`.
4. Let Cloudflare create the required DNS record.

If the domain is already managed in Cloudflare, the setup is usually automatic.

Cloudflare Pages will provision TLS for the custom domain automatically.

---

## Step 5: Ongoing workflow

Once the project is connected:

- every push to the configured branch triggers a build
- preview deployments are created for pull requests and branch pushes
- production deploys come from your production branch

A practical workflow looks like this:

1. Update `presentation.yaml` and `generated.yaml` locally.
2. Run `npx @slide-spec/cli validate`.
3. Run `npx @slide-spec/cli build` or `npx @slide-spec/cli serve` if you want a local preview.
4. Commit and push.
5. Let Cloudflare Pages build the committed snapshot.

---

## Optional: separate docs and slides projects

If your repository contains both a slide-spec site and a docs site, create two separate Pages projects.

Example:

- slides project
  Root directory: `slides`
  Build command: `npx @slide-spec/cli build`
  Output directory: `dist`
- docs project
  Root directory: `docs`
  Build command: `npm ci && npm run build`
  Output directory: `.vitepress/dist`

Keep them separate unless you have a strong reason to deploy both from one pipeline.

---

## Optional: add CI without making CI the deploy path

You can still use GitHub Actions for quality gates without using Actions for deployment.

A good split is:

- GitHub Actions runs lint, tests, accessibility checks, and visual regression
- Cloudflare Pages handles preview and production deploys from Git

That gives you a simple deployment model without giving up CI.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Build fails because `@slide-spec/cli` is not found | Confirm the package is published and the Pages environment can install from npm. |
| Site deploys but content is wrong | Run `npx @slide-spec/cli validate` locally and verify the committed YAML, especially `generated.yaml`. |
| Sitemap is missing | Set `site.deployment_url` in `content/site.yaml`, or pass `--deployment-url` in the build command. |
| Project is in a subdirectory and Pages cannot find it | Set the Pages root directory to that subdirectory, such as `slides`. |
| You need fresh GitHub data on every deploy | That is the case where a GitHub Action or another external fetch pipeline may be worth adding. |
