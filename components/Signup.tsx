"use client";

import { useState } from "react";

const DISCORD_URL = "https://discord.gg/your-invite";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit() {
    const value = email.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Try again.");
      }
      setStatus("ok");
      setMessage("You're on the list. Watch your inbox.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  }

  return (
    <>
    <div className="signup">
          <label className="signup-label" htmlFor="email">Enter your email for news, updates, and closed testing announcements.</label>
          <div className="actions">
            <input
              className="email"
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              aria-label="Email address"
              value={email}
              disabled={status === "sending"}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") { setStatus("idle"); setMessage(""); }
              }}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            />
            <button
              className="submit"
              type="button"
              onClick={submit}
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending" : "Sign up"}
            </button>
          </div>
          <p
            className="note"
            role="status"
            data-state={status === "error" ? "error" : status === "ok" ? "ok" : ""}
          >
            {message || "No spam. Unsubscribe anytime."}
          </p>
        </div>

        <div className="community">
          <p className="community-head">Join our Discord Community!</p>
          <a className="discord" href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.32 4.57A19.8 19.8 0 0 0 15.43 3c-.24.42-.5.98-.69 1.43a18.3 18.3 0 0 0-5.48 0C9.07 3.98 8.8 3.42 8.57 3a19.7 19.7 0 0 0-4.9 1.57C.57 9.2-.26 13.7.16 18.14A19.9 19.9 0 0 0 6.2 21.2c.49-.66.92-1.37 1.29-2.11-.71-.27-1.38-.6-2.02-.98.17-.13.34-.26.5-.4a14.2 14.2 0 0 0 12.07 0c.16.14.33.27.5.4-.64.38-1.32.71-2.03.98.37.74.8 1.45 1.29 2.11a19.9 19.9 0 0 0 6.04-3.06c.5-5.15-.84-9.61-3.52-13.57ZM8.02 15.42c-1.18 0-2.15-1.09-2.15-2.42s.95-2.42 2.15-2.42c1.2 0 2.17 1.09 2.15 2.42 0 1.33-.95 2.42-2.15 2.42Zm7.95 0c-1.18 0-2.15-1.09-2.15-2.42s.95-2.42 2.15-2.42c1.2 0 2.17 1.09 2.15 2.42 0 1.33-.95 2.42-2.15 2.42Z"/></svg>
            Join the Discord
          </a>
        </div>
    </>
  );
}
