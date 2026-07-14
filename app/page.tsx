import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import RandomThought from "../components/RandomThought";
import Lore from "../components/Lore";
import Incident from "../components/Incident";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";
import ChaosCounter from "../components/ChaosCounter";

export default function Home() {
  return (
    <main
      style={{
        backgroundColor: "#050505",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Hero />
      <RandomThought />
      <Lore />
      <Incident />
      <Gallery />
      <Footer />
      <ChaosCounter />
      </main>
  );
}