import type { MetadataRoute } from "next";

// Android home screen and Chrome's install prompt read the icons from here.
// The tab favicon, the Apple icon and the 512 icon come from app/favicon.ico,
// app/apple-icon.png and app/icon.png, which Next.js links automatically.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fear the Jungle",
    short_name: "Fear the Jungle",
    description: "A primitive-era extraction PvP game.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0a08",
    theme_color: "#0b0a08",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
