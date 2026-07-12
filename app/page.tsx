import Hero from "../components/Hero";
import Lore from "../components/Lore";
import Incident from "../components/Incident";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main style={{ backgroundColor: "#050505", minHeight: "100vh" }}>
      <Hero />
      <Lore />
      <Incident />
      <Gallery />
      <Footer />
    </main>
  );
}