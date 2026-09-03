import type { Metadata } from "next";
import { ClerkProvider, Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import "./backend.css";

// Belt to the middleware's braces: the header covers every response, this
// covers anything that reads the HTML instead.
export const metadata: Metadata = {
  title: "Fear the Jungle — backend",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

/**
 * ClerkProvider lives HERE, not in the root layout, so the public page never
 * loads Clerk and never needs its keys. Everything under /backend gets it.
 */
export default function BackendLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <div className="be">
        <nav className="be-nav">
          <Link href="/backend">Backend</Link>
          <Link href="/backend/text">Text</Link>
          <Link href="/backend/news">News</Link>
          <Link href="/backend/gallery">Gallery</Link>
          <span className="be-spacer" />
          <a className="be-site" href="/" target="_blank" rel="noopener noreferrer">View site</a>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </nav>
        <main className="be-main">{children}</main>
      </div>
    </ClerkProvider>
  );
}
