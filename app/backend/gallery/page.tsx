import { Gate } from "../gate";
import { getGallery } from "@/lib/content";
import { captionAction, moveAction, removeAction, uploadImageAction } from "./actions";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  blob: "BLOB_READ_WRITE_TOKEN is not set on the deployment. Add a Blob store under Storage and redeploy.",
  nofile: "Choose an image first.",
  type: "That file is not an image. JPEG, PNG, WebP, GIF or AVIF.",
  size: "That image is over 10 MB.",
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; removed?: string; error?: string }>;
}) {
  const gate = await Gate();
  if (gate) return <><h1>Gallery</h1>{gate}</>;

  const { saved, removed, error } = await searchParams;
  const images = await getGallery();

  return (
    <>
      <h1>Gallery</h1>
      <p className="be-hint">
        Images show in this order, newest at the end. Empty tiles up to twelve read the media placeholder from Text.
        Landscape 16:10 crops best.
      </p>
      {saved && <div className="be-msg" data-kind="ok">Saved. The page is updating.</div>}
      {removed && <div className="be-msg" data-kind="ok">Image removed.</div>}
      {error && <div className="be-msg" data-kind="error">{ERRORS[error] ?? "Something went wrong."}</div>}

      <h2>Add an image</h2>
      <form className="be-form" action={uploadImageAction} encType="multipart/form-data">
        <div className="be-field">
          <label htmlFor="file">Image</label>
          <input id="file" name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" required />
        </div>
        <div className="be-field">
          <label htmlFor="caption">Caption (optional)</label>
          <input id="caption" name="caption" type="text" maxLength={300} />
        </div>
        <div className="be-actions">
          <button className="be-btn" type="submit">Upload</button>
        </div>
      </form>

      <h2>Images ({images.length})</h2>
      {images.length === 0 ? (
        <p className="be-hint">None yet. All twelve tiles show the placeholder.</p>
      ) : (
        <ul className="be-list">
          {images.map((img, i) => (
            <li className="be-row" key={img.id}>
              <img className="be-thumb" src={img.url} alt="" />
              <div className="be-grow">
                <form className="be-inline" action={captionAction}>
                  <input type="hidden" name="id" value={img.id} />
                  <input type="text" name="caption" defaultValue={img.caption} placeholder="Caption" maxLength={300} />
                  <button className="be-btn be-quiet be-small" type="submit">Save</button>
                </form>
              </div>
              <form action={moveAction}>
                <input type="hidden" name="id" value={img.id} />
                <input type="hidden" name="direction" value="up" />
                <button className="be-btn be-quiet be-small" type="submit" disabled={i === 0} aria-label="Move earlier">▲</button>
              </form>
              <form action={moveAction}>
                <input type="hidden" name="id" value={img.id} />
                <input type="hidden" name="direction" value="down" />
                <button className="be-btn be-quiet be-small" type="submit" disabled={i === images.length - 1} aria-label="Move later">▼</button>
              </form>
              <form action={removeAction}>
                <input type="hidden" name="id" value={img.id} />
                <button className="be-btn be-danger be-small" type="submit">Remove</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
