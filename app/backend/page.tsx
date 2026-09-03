import Link from "next/link";
import { Gate } from "./gate";

export const dynamic = "force-dynamic";

export default async function BackendHome() {
  const gate = await Gate();
  return (
    <>
      <h1>Backend</h1>
      <p>Changes go live on the public page within seconds of saving.</p>
      {gate ?? (
        <div className="be-cards">
          <Link className="be-card" href="/backend/text">
            <strong>Text</strong>
            <span>Every line on the page: headings, taglines, the Discord link, the footer.</span>
          </Link>
          <Link className="be-card" href="/backend/news">
            <strong>News</strong>
            <span>Write, edit, unpublish and delete posts. Newest shows first.</span>
          </Link>
          <Link className="be-card" href="/backend/gallery">
            <strong>Gallery</strong>
            <span>Upload screenshots, caption them, reorder, remove.</span>
          </Link>
        </div>
      )}
    </>
  );
}
