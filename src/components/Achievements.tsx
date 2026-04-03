import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Trophy, Sun, Users, Star, Medal } from "lucide-react";

const achievements = [
  {
    title: "DIO FIBA 3x3 KALENDARA 🏀",
    highlight: "Turnir službeno prijavljen na FIBA 3x3 platformi",
    detail: "Uključen u raspored lokalnih i regionalnih 3x3 natjecanja",
    icon: Trophy,
  },
  {
    title: "MEĐUNARODNI KARAKTER TURNIRA 🌍",
    highlight: "Ekipe iz više europskih država",
    detail: "Sudionici iz Hrvatske, Srbije, Crne Gore i Nizozemske",
    icon: Users,
  },
  {
    title: "ODLIČNO PRIHVAĆEN DOGAĐAJ LJETNOG PROGRAMA ☀️",
    highlight: "Iznimno pozitivan odjek među građanima",
    detail: "Jedna od najposjećenijih ljetnih manifestacija u Posušju",
    icon: Sun,
  },
  {
    title: "ODLIČNA PROMOCIJA ZA TVRTKE 📈",
    highlight: "Prilika za promociju i podršku privatnog sektora",
    detail: "Vidljivost brenda pred velikim brojem posjetitelja",
    icon: Medal,
  },
];

const Achievements = () => {
  const { elementRef, isVisible } = useScrollReveal();

  return (
    <section id="postignuca" className="py-20">
      <div
        ref={elementRef}
        className={`container mx-auto px-4 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="section-title text-center mb-4">
          <span className="section-title-gold">POSTIGNUĆA</span>
        </h2>

        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto text-base md:text-lg">
          Rezultati koji potvrđuju rast i značaj turnira
        </p>

        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {achievements.map((item, index) => {
            const IconComponent = item.icon;
            return (
            <div
              key={item.title}
              className="group relative overflow-hidden border border-primary/20 rounded-xl p-5 md:p-6 hover:border-primary/60 transition-all duration-500 hover:shadow-[0_0_25px_rgba(234,179,8,0.15)]"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s ease ${index * 0.12}s`,
                background: 'linear-gradient(135deg, hsl(0 0% 6%) 0%, hsl(45 100% 51% / 0.05) 100%)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="p-2.5 md:p-3.5 bg-primary/15 rounded-xl group-hover:bg-primary/30 group-hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all duration-500 text-primary flex-shrink-0">
                  <IconComponent className="w-5 h-5 md:w-6 md:h-6 group-hover:drop-shadow-[0_0_6px_rgba(234,179,8,0.6)] transition-all duration-300" />
                </div>
                <div>
                  <h3 className="font-display text-base md:text-lg text-foreground tracking-wide leading-snug mb-1 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-primary/90 text-xs md:text-sm mb-0.5 font-medium">{item.highlight}</p>
                  <p className="text-muted-foreground text-xs md:text-sm">{item.detail}</p>
                </div>
              </div>
            </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default Achievements;
