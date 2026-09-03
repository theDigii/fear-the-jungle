import Link from "next/link";
import { notFound } from "next/navigation";
import { Gate } from "../../gate";
import { getPost } from "@/lib/content";
import { deletePostAction, updatePostAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const gate = await Gate();
  if (gate) return <><h1>Edit post</h1>{gate}</>;

  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const post = await getPost(id);
  if (!post) notFound();
  const { saved, error } = await searchParams;

  return (
    <>
      <h1>Edit post</h1>
      <p className="be-hint"><Link href="/backend/news">Back to all posts</Link></p>
      {saved && <div className="be-msg" data-kind="ok">Saved. The page is updating.</div>}
      {error === "title" && <div className="be-msg" data-kind="error">A post needs a title.</div>}

      <form className="be-form" action={updatePostAction}>
        <input type="hidden" name="id" value={post.id} />
        <div className="be-field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" required maxLength={200} defaultValue={post.title} />
        </div>
        <div className="be-field">
          <label htmlFor="body">Body</label>
          <textarea id="body" name="body" defaultValue={post.body} style={{ minHeight: 260 }} />
          <small>Blank line between paragraphs. Web addresses become links.</small>
        </div>
        <label className="be-check">
          <input type="checkbox" name="published" defaultChecked={post.published} /> Published (visible on the site)
        </label>
        <div className="be-actions">
          <button className="be-btn" type="submit">Save</button>
        </div>
      </form>

      <h2>Delete</h2>
      <form action={deletePostAction} className="be-actions">
        <input type="hidden" name="id" value={post.id} />
        <button className="be-btn be-danger" type="submit">Delete this post</button>
        <span className="be-hint">Gone for good; unpublish instead if you might want it back.</span>
      </form>
    </>
  );
}
