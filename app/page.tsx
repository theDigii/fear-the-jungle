import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Signup from "@/components/Signup";

export default function Page() {
  return (
    <>
      <Nav />
      <Hero />
      <div className="wrap">


        <section className="section" id="about">
          <h2>About</h2>
          <p className="kicker">PvP / PvE online game</p>
          <p className="soon">Coming soon!</p>
        </section>

        <section className="section" id="news">
          <h2>News</h2>
          <p className="soon">Coming soon!</p>

          <Signup />
          </section>

        <section className="section" id="media">
          <h2>Media</h2>
          <p className="soon">Coming soon!</p>
        </section>

        <footer className="footer">
          <img className="primal" src="/primal.webp" alt="Primal Interactive" />
          <small>© 2026 Primal Interactive. All rights reserved.</small>
        </footer>

      </div>
    </>
  );
}
