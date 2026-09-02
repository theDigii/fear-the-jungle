import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let email: string | undefined;

  try {
    const body = await req.json();
    email = typeof body?.email === "string" ? body.email.trim() : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const key = process.env.BUTTONDOWN_API_KEY;

  if (!key) {
    console.warn("BUTTONDOWN_API_KEY not set. Signup not persisted:", email);
    return NextResponse.json({ ok: true, persisted: false });
  }

  const res = await fetch("https://api.buttondown.com/v1/subscribers", {
    method: "POST",
    headers: { Authorization: `Token ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email_address: email, tags: ["playtest"] }),
  });

  if (res.status === 409) return NextResponse.json({ ok: true, persisted: true });

  if (!res.ok) {
    const text = await res.text();
    console.error("Buttondown error", res.status, text);
    // Buttondown's subscriber firewall refuses an address by rule (its
    // own account setting, not ours). Say so: "try again" is wrong advice
    // when a retry gives the same answer.
    if (res.status === 400 && text.includes("subscriber_blocked")) {
      return NextResponse.json(
        { error: "That address was refused by the mailing list. Try a different one." },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { error: "Couldn't sign you up. Try again in a moment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, persisted: true });
}
