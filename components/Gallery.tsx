"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MIN_TILES = 12;

export type GalleryTile = { id: number; url: string; caption: string };

/**
 * The media grid. Real images first, in the backend's order, then empty
 * tiles carrying the placeholder text until there are twelve, so the grid
 * keeps its two-rows-of-six shape while the screenshots trickle in, and
 * simply grows past twelve once there are more.
 *
 * Real tiles open a lightbox; empty ones are inert.
 */
export default function Gallery({ images, placeholder }: { images: GalleryTile[]; placeholder: string }) {
  const [open, setOpen] = useState<GalleryTile | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    document.body.style.overflow = "";
    lastFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const empty = Math.max(0, MIN_TILES - images.length);

  return (
    <>
      <div className="media-grid" aria-label="Screenshots">
        {images.map((img, i) => (
          <button
            key={img.id}
            className="shot shot-img"
            type="button"
            aria-label={img.caption || `View screenshot ${i + 1}`}
            onClick={(e) => {
              lastFocus.current = e.currentTarget;
              setOpen(img);
            }}
          >
            <img src={img.url} alt={img.caption || `In-game screenshot ${i + 1}`} loading="lazy" />
          </button>
        ))}
        {Array.from({ length: empty }, (_, i) => (
          <div key={`empty-${i}`} className="shot shot-empty">
            <p className="soon">{placeholder}</p>
          </div>
        ))}
      </div>

      <div
        className={open ? "lightbox open" : "lightbox"}
        role="dialog"
        aria-modal="true"
        aria-label="Screenshot viewer"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <button ref={closeRef} className="lightbox-close" type="button" aria-label="Close" onClick={close}>
          &times;
        </button>
        {open && (
          <figure style={{ margin: 0, display: "contents" }}>
            <img src={open.url} alt={open.caption} />
            {open.caption && <figcaption>{open.caption}</figcaption>}
          </figure>
        )}
      </div>
    </>
  );
}
