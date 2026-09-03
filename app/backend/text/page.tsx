import { Gate } from "../gate";
import { getAllText, TEXT_DEFAULTS, TEXT_LABELS, type TextKey } from "@/lib/content";
import { saveTextAction } from "./actions";

export const dynamic = "force-dynamic";

const LONG: TextKey[] = ["about_body", "signup_label", "site_description"];

export default async function TextPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const gate = await Gate();
  if (gate) return <><h1>Text</h1>{gate}</>;

  const { saved, error } = await searchParams;
  const text = await getAllText();

  return (
    <>
      <h1>Text</h1>
      <p className="be-hint">
        Clear a field to go back to the built-in wording. Line breaks in the About body become paragraphs.
      </p>
      {saved && <div className="be-msg" data-kind="ok">Saved. The page is updating.</div>}
      {error === "discord" && (
        <div className="be-msg" data-kind="error">The Discord link must start with https://discord.gg/ or https://discord.com/. Nothing was saved.</div>
      )}
      <form className="be-form" action={saveTextAction}>
        {(Object.keys(TEXT_DEFAULTS) as TextKey[]).map((key) => (
          <div className="be-field" key={key}>
            <label htmlFor={key}>{TEXT_LABELS[key]}</label>
            <textarea
              id={key}
              name={key}
              className={LONG.includes(key) ? "" : "be-short"}
              defaultValue={text[key]}
              placeholder={TEXT_DEFAULTS[key]}
            />
            {text[key] !== TEXT_DEFAULTS[key] && (
              <small>Built-in: {TEXT_DEFAULTS[key]}</small>
            )}
          </div>
        ))}
        <div className="be-actions">
          <button className="be-btn" type="submit">Save all</button>
        </div>
      </form>
    </>
  );
}
