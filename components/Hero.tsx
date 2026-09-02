"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const folRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const onMove = (e: MouseEvent) => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        if (bgRef.current) {
          bgRef.current.style.transform =
            "translate3d(" + x * 16 + "px," + y * 11 + "px,0)";
        }
        if (folRef.current) {
          folRef.current.style.transform =
            "translate3d(" + x * -48 + "px," + y * -30 + "px,0)";
        }
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
      <section className="hero" id="top">
        <div className="layer layer-bg" ref={bgRef}><img src="/bg-jungle-lush.webp" alt="" fetchPriority="high" /></div>
        <div className="vignette"></div>
        <div className="hero-fade"></div>
        <div className="layer layer-logo"><img src="/logo.webp" alt="Fear the Jungle" fetchPriority="high" /></div>

        <div className="hero-text">
          <p className="tagline">In Development</p>
          <a className="scroll-cue" href="#about" aria-label="Scroll to about">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                 strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 8.5 12 16.5 20 8.5"/>
            </svg>
          </a>
        </div>

        <div className="layer layer-foliage" ref={folRef}><img src="/foliage-layer.webp" alt="" fetchPriority="high" /></div>
      </section>
  );
}
