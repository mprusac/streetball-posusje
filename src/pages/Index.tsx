import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import News from "@/components/News";
import Results from "@/components/Results";
import Team from "@/components/Team";
import Gallery from "@/components/Gallery";
import Sponsors from "@/components/Sponsors";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Save scroll position continuously on homepage
    const handleScroll = () => {
      sessionStorage.setItem("homeScrollY", String(window.scrollY));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Restore scroll position if coming back from a sub-page
    const restoreScroll = sessionStorage.getItem("restoreHomeScroll");
    const savedY = sessionStorage.getItem("homeScrollY");
    
    if (restoreScroll === "true") {
      sessionStorage.removeItem("restoreHomeScroll");
      if (savedY) {
        const targetY = parseInt(savedY, 10);
        // Multiple attempts to ensure scroll restoration after PageTransition animation
        const attempts = [50, 150, 350, 500, 700];
        const timers = attempts.map(delay =>
          setTimeout(() => {
            window.scrollTo({ top: targetY, left: 0, behavior: "instant" });
          }, delay)
        );
        return () => timers.forEach(t => clearTimeout(t));
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <ScrollProgressBar />
      <Navbar />
      <main>
        <Hero />
        <Results />
        <News />
        <Team />
        <Gallery />
        <About />
        <Sponsors />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
