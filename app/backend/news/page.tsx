import Link from "next/link";
import { Gate } from "../gate";
import { getAllPosts } from "@/lib/content";
import { createPostAction } from "./actions";

export const dynamic = "force-dynamic";

function when(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; deleted?: string }>;
}) {
  const gate = await Gate();
  if (gate) return <><h1>News</h1>{gate}</>;

  const { error, deleted } = await searchParams;
  const posts = await getAllPosts();

  return (
    <>
      <h1>News</h1>
      {deleted && <div className="be-msg" data-kind="ok">Post deleted.</div>}
      {error === "title" && <div className="be-msg" data-kind="error">A post needs a title.</div>}

      <h2>New post</h2>
      <form className="be-form" action={createPostAction}>
        <div className="be-field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" required maxLength={200} />
        </div>
        <div className="be-field">
          <label htmlFor="body">Body</label>
          <textarea id="body" name="body" />
          <small>Blank line between paragraphs. Web addresses become links.</small>
        </div>
        <label className="be-check">
          <input type="checkbox" name="published" defaultChecked /> Published (visible on the site)
        </label>
        <div className="be-actions">
          <button className="be-btn" type="submit">Post</button>
        </div>
      </form>

      <h2>Posts</h2>
      {posts.length === 0 ? (
        <p className="be-hint">Nothing yet. The site shows its "no news" line until the first post is published.</p>
      ) : (
        <ul className="be-list">
          {posts.map((post) => (
            <li className="be-row" key={post.id}>
              <div className="be-grow">
                <Link className="be-title" href={`/backend/news/${post.id}`}>{post.title}</Link>
                <span className="be-meta">{when(post.published_at)}</span>
              </div>
              <span className={post.published ? "be-badge be-live" : "be-badge"}>
                {post.published ? "Live" : "Draft"}
              </span>
              <Link className="be-btn be-quiet be-small" href={`/backend/news/${post.id}`}>Edit</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
