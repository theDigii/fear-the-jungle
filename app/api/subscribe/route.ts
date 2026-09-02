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
    console.error("Buttondown error", res.status, await res.text());
    return NextResponse.json(
      { error: "Couldn't sign you up. Try again in a moment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, persisted: true });
}
