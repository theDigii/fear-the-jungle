import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Signup from "@/components/Signup";
import Gallery from "@/components/Gallery";
import News from "@/components/News";
import { getSiteContent } from "@/lib/content";

// Rendered once and cached; every backend save calls revalidatePath("/"),
// and this is the ceiling on how stale the page can get if one is missed.
export const revalidate = 300;

function paragraphs(text: string, className: string) {
  const parts = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) return <p className={className}>{text}</p>;
  return parts.map((p, i) => <p className={className} key={i}>{p}</p>);
}

export default async function Page() {
  const { text, posts, gallery } = await getSiteContent();

  return (
    <>
      <Nav />
      <Hero tagline={text.hero_tagline} />
      <div className="wrap">
        <section className="section" id="about">
          <h2>{text.about_heading}</h2>
          <p className="kicker">{text.about_kicker}</p>
          {paragraphs(text.about_body, "soon")}
        </section>

        <section className="section" id="news">
          <h2>{text.news_heading}</h2>
          <News posts={posts} empty={text.news_empty} />
          <Signup
            label={text.signup_label}
            note={text.signup_note}
            button={text.signup_button}
            communityHead={text.community_head}
            discordLabel={text.discord_label}
            discordUrl={text.discord_url}
          />
        </section>

        <section className="section" id="media">
          <h2>{text.media_heading}</h2>
          <Gallery images={gallery} placeholder={text.media_placeholder} />
        </section>

        <footer className="footer">
          <img className="primal" src="/primal.webp" alt="Primal Interactive" />
          <small>{text.footer_copy}</small>
        </footer>
      </div>
    </>
  );
}
