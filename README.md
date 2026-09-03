# Fear the Jungle

One-page teaser site. Next.js App Router, plain CSS, no framework.

## Run

    npm install
    npm run dev

## Before deploying

1. Newsletter: create a Buttondown account and set `BUTTONDOWN_API_KEY`
   in Vercel project settings (and `.env.local` for dev). Without it the
   form still succeeds but only logs the address server-side.
2. `metadataBase` in `app/layout.tsx` -> your real domain.
3. Media: the six gallery tiles read "Coming soon!" until there are
   screenshots. Put them in `public/media/`, give each tile an <img>, and
   bring the lightbox back from commit a51fbab if you want click-to-enlarge.
4. Add an OG image. A flat 1200x630 JPG screenshot of the finished hero
   is the right call; the transparent logo composites badly on link previews.

Discord invite is `DISCORD_URL` at the top of `components/Signup.tsx`.

## Backend (/backend)

News posts, the gallery and every line of text on the page are edited at
`/backend`. It is server-rendered forms over Neon Postgres and Vercel Blob,
behind Clerk.

### How access works

1. `middleware.ts` runs ONLY on `/backend/*`. Anyone signed out is sent to
   `/backend/sign-in`, which is Clerk's hosted form. Clerk owns the password
   rules, rate limiting, bot detection and (if you enable it) MFA, which is
   what makes the login un-brute-forceable.
2. Being signed in is not enough. `lib/admin.ts` checks the account's email
   against `BACKEND_ADMIN_EMAILS`. No list means nobody gets in. Every page
   AND every server action runs this check.
3. In the Clerk dashboard set sign-up mode to **Restricted** so strangers
   cannot create accounts at all, and turn on MFA for your own account.
4. `/backend` sends `X-Robots-Tag: noindex` from the middleware, carries a
   noindex meta tag, is disallowed in `robots.txt`, and is never in
   `sitemap.xml`.

### Setup, once

Environment variables on the Vercel project (see `.env.example`):

    DATABASE_URL                       Neon connection string
    BLOB_READ_WRITE_TOKEN              from a Vercel Blob store (Storage tab)
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY  Clerk > API keys
    CLERK_SECRET_KEY
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/backend/sign-in
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/backend
    BACKEND_ADMIN_EMAILS               comma-separated emails allowed in

The database tables are created on first use; there is no migration step.
The public page renders its built-in text until something is saved, and
keeps rendering it if the database is unreachable.

### What the backend can change

- **Text**: every key in `lib/content.ts` `TEXT_DEFAULTS`. Clearing a field
  restores the built-in wording.
- **News**: posts with title, plain-text body (blank line = paragraph, URLs
  become links, HTML is never interpreted), published flag. Newest first.
- **Gallery**: upload (JPEG/PNG/WebP/GIF/AVIF, 10 MB), caption, reorder,
  remove. Real images come first; empty tiles up to twelve show the media
  placeholder text.

Every save calls `revalidatePath("/")`, so the public page updates within
seconds; `app/page.tsx` also revalidates every five minutes as a ceiling.

## Hero layers

The foliage layer has two plates: `foliage-layer.webp` (1536x1024) on
screens wider than 760px and `foliage-layer-mobile.webp` (portrait, leaves
top and bottom) below that, chosen by a `<picture>` source and preloaded
by the same media query. Both live in Pictures/FearTheJungle/finalcut.

Three stacked layers in `components/Hero.tsx`, all 1536x1024 and rendered
with identical geometry so they stay in register:

    z-10  background   moves  +16px x / +11px y   (with the cursor)
    z-15  vignette
    z-25  hero-fade    gradient to black, sits UNDER the text
    z-20  logo         no transform, never moves
    z-40  foliage      moves  -48px x / -30px y   (against the cursor)
    z-50  hero-text    tagline + chevron, OVER the foliage
    z-60  nav

Layers are inset -6% so their edges never enter frame when they shift.
The foliage carries its own `mask-image` fading it out at the bottom, so
it dissolves into the black band instead of floating over it. Those mask
stops (66% / 95%) assume the -6% inset; change one and you must change
the other.

Parallax is rAF-throttled and disabled on coarse pointers and under
`prefers-reduced-motion`.

## Type

Display (nav, headings, tagline, kicker): Metal Mania, one weight only.
Never apply a bold weight to it, the browser will fake it and the
letterforms turn to mush.
Body: Spectral. Palette is built on the Primal Interactive grey #B8BBC0.
