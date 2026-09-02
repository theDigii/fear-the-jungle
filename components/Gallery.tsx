const TILES = 12;

/**
 * The media grid, holding its place until there are screenshots to put in
 * it. Twelve tiles, two rows of six; each tile carries the
 * site's "Coming soon!" line instead of an image, and there is no lightbox
 * because there is nothing to open. When real shots exist, put them back in
 * public/media/ and give each tile an <img> (the lightbox lives in git
 * history at commit a51fbab).
 */
export default function Gallery() {
  return (
    <div className="media-grid" aria-label="Screenshots coming soon">
      {Array.from({ length: TILES }, (_, i) => (
        <div key={i} className="shot shot-empty">
          <p className="soon">Coming soon!</p>
        </div>
      ))}
    </div>
  );
}
