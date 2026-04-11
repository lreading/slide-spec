export const buildSiteNotFoundPage = (): string => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>Page not found | Slide Spec</title>
    <style>
      :root {
        --page-background: #121824;
        --panel-background: rgba(18, 24, 36, 0.92);
        --accent-color: #e8341c;
        --accent-soft: #ff8d78;
        --primary-text: #f5f7ff;
        --secondary-text: #d0d7e8;
        --muted-text: #93a0bd;
        --font-sans: "Poppins", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        --font-mono: "Roboto Mono", "SFMono-Regular", ui-monospace, monospace;
      }

      * {
        box-sizing: border-box;
      }

      body {
        min-width: 320px;
        min-height: 100vh;
        margin: 0;
        display: grid;
        place-items: center;
        padding: clamp(1.5rem, 4vw, 4rem);
        color: var(--primary-text);
        background:
          radial-gradient(circle at top left, rgba(232, 52, 28, 0.18), transparent 24rem),
          radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.08), transparent 20rem),
          linear-gradient(180deg, #121824 0%, #1b2434 100%);
        font-family: var(--font-sans);
      }

      main {
        width: min(100%, 58rem);
        display: grid;
        gap: 2rem;
        justify-items: center;
        text-align: center;
      }

      .mascot {
        width: min(100%, 25rem);
        filter: drop-shadow(0 1.5rem 2.5rem rgba(0, 0, 0, 0.35));
      }

      .eyebrow {
        color: var(--accent-soft);
        font: 700 0.9rem/1.2 var(--font-mono);
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      h1 {
        margin: 0;
        font-size: clamp(3.5rem, 13vw, 8rem);
        line-height: 0.9;
        letter-spacing: -0.06em;
      }

      .headline {
        max-width: 43rem;
        margin: 0;
        color: var(--secondary-text);
        font-size: clamp(1.2rem, 3vw, 2rem);
        font-weight: 300;
        line-height: 1.35;
      }

      .copy {
        max-width: 38rem;
        margin: 0;
        color: var(--muted-text);
        font-size: 1.05rem;
        line-height: 1.75;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
      }

      .button {
        min-width: 12rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.9rem 1.15rem;
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 999px;
        color: var(--primary-text);
        text-decoration: none;
        background: rgba(28, 35, 51, 0.84);
      }

      .button:hover,
      .button:focus-visible {
        border-color: rgba(232, 52, 28, 0.6);
        outline: none;
      }

      .button--primary {
        background: rgba(232, 52, 28, 0.18);
      }

      @media (max-width: 640px) {
        .actions {
          width: 100%;
          flex-direction: column;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <svg class="mascot" viewBox="0 0 420 260" role="img" aria-labelledby="not-found-title not-found-desc">
        <title id="not-found-title">A small deck hound sniffing around missing slides</title>
        <desc id="not-found-desc">A playful dog beside a scattered slide card and a 404 sign.</desc>
        <defs>
          <linearGradient id="cardGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#f5f7ff" />
            <stop offset="100%" stop-color="#d0d7e8" />
          </linearGradient>
        </defs>
        <path d="M68 211c55 28 230 25 284-2" fill="none" stroke="#2d384e" stroke-width="16" stroke-linecap="round" />
        <rect x="238" y="48" width="112" height="80" rx="14" fill="url(#cardGradient)" />
        <path d="M258 76h54M258 96h35" stroke="#1b2434" stroke-width="10" stroke-linecap="round" />
        <text x="288" y="151" fill="#e8341c" font-family="monospace" font-size="34" font-weight="700" text-anchor="middle">404</text>
        <path d="M129 151c7-37 41-59 87-44 26 9 44 29 48 61 6 42-20 63-74 63-51 0-70-27-61-80z" fill="#f5b083" />
        <path d="M216 107c11-26 39-40 59-22-8 28-27 42-58 43zM139 119c-24-11-48 0-56 25 24 13 47 8 66-16z" fill="#7c4a32" />
        <circle cx="177" cy="148" r="7" fill="#121824" />
        <circle cx="234" cy="148" r="7" fill="#121824" />
        <path d="M204 167c8 12 21 12 29 0" fill="none" stroke="#121824" stroke-width="7" stroke-linecap="round" />
        <path d="M202 162c-4 10-19 11-25 2" fill="none" stroke="#121824" stroke-width="6" stroke-linecap="round" />
        <path d="M185 217c-5 22-22 27-44 19M237 216c6 21 24 26 45 15" fill="none" stroke="#7c4a32" stroke-width="13" stroke-linecap="round" />
        <path d="M112 190c-31 11-47 1-55-18" fill="none" stroke="#f5b083" stroke-width="14" stroke-linecap="round" />
        <rect x="63" y="37" width="118" height="74" rx="15" fill="#1c2333" stroke="#e8341c" stroke-width="6" />
        <path d="M87 63h62M87 87h38" stroke="#d0d7e8" stroke-width="9" stroke-linecap="round" />
      </svg>
      <div class="eyebrow">Slide Spec 404</div>
      <h1>Slide not found.</h1>
      <p class="headline">The deck hound checked the YAML, sniffed the routes, and still came up empty.</p>
      <p class="copy">This page is not in the published presentation site. Try the catalog, or head back to the project overview.</p>
      <div class="actions">
        <a class="button button--primary" href="/presentations">View presentations</a>
        <a class="button" href="/">Back home</a>
      </div>
    </main>
  </body>
</html>
`
