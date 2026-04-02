import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Sun, Globe, Trophy, TrendingUp } from "lucide-react";

const achievements = [
  {
    icon: <Sun className="w-6 h-6 md:w-8 md:h-8" />,
    title: "ODLIČNO PRIHVAĆEN DOGAĐAJ LJETNJEG PROGRAMA ☀",
    points: [
      "Iznimno pozitivan odjek među građanima",
      "Jedna od najposjećenijih ljetnih manifestacija u Posušju",
    ],
  },
  {
    icon: <Globe className="w-6 h-6 md:w-8 md:h-8" />,
    title: "MEĐUNARODNI KARAKTER TURNIRA 🌍",
    points: [
      "Ekipe iz više europskih država",
      "Sudionici iz Hrvatske, Srbije, Crne Gore i Nizozemske",
    ],
  },
  {
    icon: <Trophy className="w-6 h-6 md:w-8 md:h-8" />,
    title: "DIO FIBA 3x3 KALENDARA 🏀",
    points: [
      "Turnir službeno prijavljen na FIBA 3x3 platformi",
      "Uključen u raspored lokalnih i regionalnih 3x3 natjecanja",
    ],
  },
  {
    icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />,
    title: "ODLIČNA PROMOCIJA ZA TVRTKE 📈",
    points: [
      "Prilika za promociju i podršku privatnog sektora",
      "Vidljivost brenda pred velikim brojem posjetitelja",
    ],
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

        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto text-sm md:text-base">
          Rezultati koji govore sami za sebe
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {achievements.map((item, index) => (
            <div
              key={item.title}
              className="group bg-secondary/30 border border-border rounded-xl md:rounded-2xl p-5 md:p-8 hover:border-primary/30 transition-all duration-300"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s ease ${index * 0.12}s`,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 md:p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300 text-primary flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-display text-sm md:text-base text-foreground mb-3 tracking-wide leading-snug">
                    {item.title}
                  </h3>
                  <ul className="space-y-2">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="text-muted-foreground text-xs md:text-sm flex items-start gap-2"
                      >
                        <span className="text-primary mt-0.5">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
