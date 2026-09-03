import type { Post } from "@/lib/content";

/**
 * Post bodies are plain text from the backend: a blank line starts a new
 * paragraph, a single line break stays a line break, and anything that looks
 * like a web address becomes a link. No HTML is ever interpreted, so a post
 * cannot inject markup into the page.
 */
function renderBody(body: string) {
  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return paragraphs.map((para, pi) => (
    <p key={pi}>
      {para.split("\n").map((line, li) => (
        <span key={li}>
          {li > 0 && <br />}
          {linkify(line)}
        </span>
      ))}
    </p>
  ));
}

const URL_RE = /(https?:\/\/[^\s<>"']+)/g;

function linkify(line: string) {
  const parts = line.split(URL_RE);
  return parts.map((part, i) =>
    URL_RE.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function when(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function News({ posts, empty }: { posts: Post[]; empty: string }) {
  if (posts.length === 0) return <p className="soon">{empty}</p>;
  return (
    <div className="posts">
      {posts.map((post) => (
        <article className="post" key={post.id}>
          <h3>{post.title}</h3>
          <time dateTime={post.published_at}>{when(post.published_at)}</time>
          {renderBody(post.body)}
        </article>
      ))}
    </div>
  );
}
