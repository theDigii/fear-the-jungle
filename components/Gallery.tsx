"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SHOTS = [
  "/media/g1.webp",
  "/media/g2.webp",
  "/media/g3.webp",
  "/media/g4.webp",
  "/media/g5.webp",
  "/media/g6.webp",
];

export default function Gallery() {
  const [open, setOpen] = useState<string | null>(null);
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

  return (
    <>
      <div className="media-grid">
        {SHOTS.map((src, i) => (
          <button
            key={src}
            className="shot"
            type="button"
            aria-label={`View screenshot ${i + 1}`}
            onClick={(e) => {
              lastFocus.current = e.currentTarget;
              setOpen(src);
            }}
          >
            <img src={src} alt={`In-game screenshot ${i + 1}`} loading="lazy" />
          </button>
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
        <button
          ref={closeRef}
          className="lightbox-close"
          type="button"
          aria-label="Close"
          onClick={close}
        >
          &times;
        </button>
        {open && <img src={open} alt="" />}
      </div>
    </>
  );
}
