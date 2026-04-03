import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const ResultsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.setAttribute("data-fiba-embedtype", "results");
    script.setAttribute("data-fiba-eventid", "3eab0fdf-75f7-48a3-a788-51e5cccf0021");
    script.src = "https://play.fiba3x3.com/embed.js";
    script.async = true;
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link
            to="/"
            onClick={() => {
              sessionStorage.setItem("restoreHomeScroll", "true");
            }}
            className="inline-flex items-center gap-3 text-primary hover:text-primary/80 transition-colors mb-8 text-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-display tracking-wider">Nazad</span>
          </Link>

          <h1 className="font-display text-3xl md:text-5xl text-center mb-4">
            <span className="text-foreground">FIBA 3X3 </span>
            <span className="text-primary">REZULTATI</span>
          </h1>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Službeni rezultati turnira Streetball Posušje 2026
          </p>

          <div
            ref={containerRef}
            className="bg-card rounded-xl border border-border p-4 md:p-6 min-h-[400px]"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResultsPage;
