import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Trophy } from "lucide-react";

const achievements = [
  {
    title: "ODLIČNO PRIHVAĆEN DOGAĐAJ LJETNJEG PROGRAMA ☀",
    highlight: "Iznimno pozitivan odjek među građanima",
    detail: "Jedna od najposjećenijih ljetnih manifestacija u Posušju",
  },
  {
    title: "MEĐUNARODNI KARAKTER TURNIRA 🌍",
    highlight: "Ekipe iz više europskih država",
    detail: "Sudionici iz Hrvatske, Srbije, Crne Gore i Nizozemske",
  },
  {
    title: "DIO FIBA 3x3 KALENDARA 🏀",
    highlight: "Turnir službeno prijavljen na FIBA 3x3 platformi",
    detail: "Uključen u raspored lokalnih i regionalnih 3x3 natjecanja",
  },
  {
    title: "ODLIČNA PROMOCIJA ZA TVRTKE 📈",
    highlight: "Prilika za promociju i podršku privatnog sektora",
    detail: "Vidljivost brenda pred velikim brojem posjetitelja",
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

        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {achievements.map((item, index) => (
            <div
              key={item.title}
              className="group bg-secondary/30 border border-border rounded-xl p-5 md:p-6 hover:border-primary/30 transition-all duration-300"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s ease ${index * 0.12}s`,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 md:p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300 text-primary flex-shrink-0">
                  <Trophy className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="font-display text-sm md:text-base text-foreground tracking-wide leading-snug mb-1">
                    {item.title}
                  </h3>
                  <p className="text-primary text-xs md:text-sm italic mb-0.5">{item.highlight}</p>
                  <p className="text-muted-foreground text-xs md:text-sm">{item.detail}</p>
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
