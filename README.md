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
3. Media: the section reads "Coming soon!" for now. The gallery component
   and its lightbox were removed with the placeholder crops; when real
   screenshots exist, add a grid of `public/media/*.webp` back.
4. Add an OG image. A flat 1200x630 JPG screenshot of the finished hero
   is the right call; the transparent logo composites badly on link previews.

Discord invite is `DISCORD_URL` at the top of `components/Signup.tsx`.

## Hero layers

Three stacked layers in `components/Hero.tsx`, all 1536x1024 and rendered
with identical geometry so they stay in register:

    z-10  background   moves  +16px x / +11px y   (with the cursor)
    z-15  vignette
    z-25  hero-fade    gradient to black, sits UNDER the text
    z-20  logo         no transform, never moves
    z-30  hero-text    tagline + chevron
    z-40  foliage      moves  -48px x / -30px y   (against the cursor)
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
