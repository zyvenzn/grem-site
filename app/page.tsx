import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import RandomThought from "../components/RandomThought";
import Lore from "../components/Lore";
import Incident from "../components/Incident";
import ChaosCounter from "../components/ChaosCounter";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="site-shell">
      <Navbar />
      <Hero />
      <RandomThought />
      <Lore />
      <Incident />
      <ChaosCounter />
      <Gallery />
      <Footer />
    </main>
  );
}
