# Newsletter design (Buttondown)

The email mirrors the site: black ground, bone text (`#b8bbc0`), Metal Mania
for display, Spectral for body. Email clients cannot load the site's
stylesheet or its CSS filters, and the header and footer fields take Markdown only, so all styling lives in
the custom CSS; the header and footer are Markdown plus two images the site serves.

| Piece | Goes in Buttondown | Notes |
|---|---|---|
| `custom.css` | Settings > Design > Custom CSS | fonts via `@import`; falls back to Impact / Georgia |
| `header.md` | Settings > Design > Header | Markdown only; h6 is the kicker, styled by the CSS |
| `footer.md` | Settings > Design > Footer | Markdown only; h6 links, h5 fine print; keep `{{ unsubscribe_url }}` |
| `public/email/logo.png` | referenced by the header | the nav logo with the site's white glow baked in, on black, because email cannot do `drop-shadow` |
| `public/email/primal.png` | referenced by the footer | the studio wordmark as PNG (WebP does not render in Outlook) |

The images are served from `https://fearthejungle.gg/email/…`, so a change to
them is a push to `main` like any other site change.

Send yourself a test after pasting. Check it in Gmail's web view and on a
phone; those two cover most of the list. A `.btn` class exists for a
call-to-action link in the body.
