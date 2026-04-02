import { useCountUp } from "@/hooks/useCountUp";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Trophy, Calendar, MapPin, Users } from "lucide-react";

interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 7000, suffix: " KM", label: "NAGRADNI FOND" },
  { value: 60, suffix: "+", label: "BROJ EKIPA" },
  { value: 150, suffix: "+", label: "BROJ IGRAČA" },
  { value: 200, suffix: "+", label: "BROJ UTAKMICA" },
  { value: 8, label: "KATEGORIJE" },
];

// categories removed

const StatCounter = ({ stat, index }: { stat: StatItem; index: number }) => {
  const { count, elementRef } = useCountUp({ end: stat.value });

  return (
    <div
      ref={elementRef}
      className="text-center group animate-fade-in-up"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="stat-number text-3xl md:text-5xl group-hover:text-primary/80 transition-colors duration-300">
        {count}
        {stat.suffix}
      </div>
      <div className="stat-label text-xs md:text-sm">{stat.label}</div>
    </div>
  );
};

const About = () => {
  const { elementRef: aboutRef, isVisible: aboutVisible } = useScrollReveal();
  const { elementRef: catRef, isVisible: catVisible } = useScrollReveal();
  const { elementRef: visRef, isVisible: visVisible } = useScrollReveal();

  return (
    <section id="o-klubu" className="py-20 overflow-hidden">
      {/* Stats */}
      <div className="container mx-auto px-4 mb-12 md:mb-20">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <StatCounter key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>

      {/* About Content */}
      <div className="container mx-auto px-4">
        <div 
          ref={aboutRef}
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            aboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="section-title mb-8 md:mb-12 text-center">
            <span className="section-title-white">O </span>
            <span className="section-title-gold">TURNIRU</span>
          </h2>

          <div className="gold-border-left mb-10 md:mb-16 text-left mx-auto pl-4 md:pl-6 pr-2 md:pr-0" style={{ maxWidth: "800px" }}>
            <p className="text-sm md:text-xl text-muted-foreground mb-3 md:mb-6 leading-relaxed">
              <span className="text-primary font-bold">Streetball Posušje 2026</span> je ulični košarkaški turnir koji okuplja igrače iz cijele regije na jednom mjestu.
            </p>
            <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 leading-relaxed">
              Turnir se igra po <span className="text-primary font-semibold">FIBA 3x3 pravilima</span> na otvorenom terenu u srcu Posušja.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Bilo da si iskusni igrač ili tek počinješ, ovo je prilika da pokažeš svoje vještine, upoznaš nove ljude i uživaš u <span className="text-primary font-semibold">čistoj energiji ulične košarke</span>. Atmosfera, glazba i natjecateljski duh – sve na jednom mjestu.
            </p>
          </div>
        </div>

        {/* Categories */}
        <div 
          ref={catRef}
          className={`mb-20 max-w-4xl mx-auto transition-all duration-700 ${
            catVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h3 className="text-3xl md:text-4xl font-display text-foreground mb-8 uppercase tracking-wider text-center">
            Kategorije
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat, index) => (
              <div
                key={cat.name}
                className="group bg-gradient-to-r from-secondary/60 to-secondary/30 border border-border rounded-lg px-6 py-5 text-center font-medium text-foreground hover:border-primary hover:from-primary/20 hover:to-primary/10 transition-all duration-300 cursor-default"
                style={{ 
                  opacity: catVisible ? 1 : 0,
                  transform: catVisible ? "translateY(0)" : "translateY(20px)",
                  transition: `all 0.5s ease ${index * 0.1}s`
                }}
              >
                <span className="group-hover:text-primary transition-colors duration-300 text-sm md:text-base block font-display">
                  {cat.name}
                </span>
                <span className="text-muted-foreground text-xs mt-1 block">{cat.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vision */}
        <div 
          ref={visRef}
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            visVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div 
            className="relative group rounded-2xl md:rounded-3xl p-6 md:p-10 transition-all duration-300 text-center overflow-hidden border-2 border-primary"
            style={{
              background: 'linear-gradient(135deg, hsl(0 0% 5%) 0%, hsl(45 100% 51% / 0.1) 50%, hsl(0 0% 8%) 100%)',
            }}
          >
            <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
            
            <h3 className="text-2xl md:text-4xl font-display mb-4 md:mb-6 tracking-wide relative z-10">
              <span className="text-foreground">ZAŠTO </span>
              <span className="text-primary">3x3?</span>
            </h3>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed text-sm md:text-lg relative z-10">
              3x3 košarka je <span className="text-primary font-bold">najbrže rastući urbani sport na svijetu</span> i olimpijska disciplina od 2021. Brza igra, kraći format i intenzivna atmosfera čine je savršenom za sve koji vole košarku u njenom najčišćem obliku. <span className="text-primary font-bold">Streetball Posušje 2026</span> donosi tu energiju u naš grad – jedan dan, jedna lopta, čista strast.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
