import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import About from "@/components/About";
import Achievements from "@/components/Achievements";
import News from "@/components/News";
import Schedule from "@/components/Schedule";
import Prizes from "@/components/Prizes";
import Gallery from "@/components/Gallery";
import Sponsors from "@/components/Sponsors";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const DeferredHomeSections = () => (
  <>
    <hr className="section-divider" />
    <News />
    <hr className="section-divider" />
    <Schedule />
    <hr className="section-divider" />
    <Prizes />
    <hr className="section-divider" />
    <Gallery />
    <hr className="section-divider" />
    <About />
    <hr className="section-divider" />
    <Achievements />
    <hr className="section-divider" />
    <Sponsors />
    <hr className="section-divider" />
    <Contact />
    <Footer />
  </>
);

const Index = () => {
  const location = useLocation();
  const [showDeferredContent, setShowDeferredContent] = useState(() =>
    typeof window !== "undefined" && sessionStorage.getItem("restoreHomeScroll") === "true"
  );

  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem("homeScrollY", String(window.scrollY));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showDeferredContent) return;

    const revealDeferredContent = () => setShowDeferredContent(true);

    const browserWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (browserWindow.requestIdleCallback && browserWindow.cancelIdleCallback) {
      const idleId = browserWindow.requestIdleCallback(revealDeferredContent, { timeout: 1200 });
      return () => browserWindow.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(revealDeferredContent, 350);
    return () => window.clearTimeout(timeoutId);
  }, [showDeferredContent]);

  useEffect(() => {
    const restoreScroll = sessionStorage.getItem("restoreHomeScroll");
    const savedY = sessionStorage.getItem("homeScrollY");
    const returnTarget = sessionStorage.getItem("homeReturnTarget");

    if (restoreScroll === "true") {
      setShowDeferredContent(true);
      sessionStorage.removeItem("restoreHomeScroll");
      const attempts = [80, 200, 350, 550, 800];

      const restoreToTarget = () => {
        if (returnTarget) {
          const targetEl = document.getElementById(returnTarget);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "auto", block: "center" });
            return;
          }
        }

        if (savedY) {
          window.scrollTo(0, parseInt(savedY, 10));
        }
      };

      const timers = attempts.map((delay) => setTimeout(restoreToTarget, delay));
      sessionStorage.removeItem("homeReturnTarget");
      return () => timers.forEach((timer) => clearTimeout(timer));
    }

    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <ScrollProgressBar />
      <Navbar />
      <main>
        <Hero />
        {showDeferredContent && <DeferredHomeSections />}
      </main>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a
          href="https://www.instagram.com/streetball_posusje/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="w-11 h-11 rounded-full bg-background/80 border border-primary/40 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/30"
        >
          <Instagram size={20} />
        </a>
        <a
          href="https://www.facebook.com/StreetballPosusje"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="w-11 h-11 rounded-full bg-background/80 border border-primary/40 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/30"
        >
          <Facebook size={20} />
        </a>
      </div>
    </div>
  );
};

export default Index;
