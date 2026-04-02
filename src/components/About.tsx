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
  // catRef removed
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
            <span className="section-title-gold">NAMA</span>
          </h2>

          <div className="gold-border-left mb-10 md:mb-16 text-left mx-auto pl-4 md:pl-6 pr-2 md:pr-0" style={{ maxWidth: "800px" }}>
            <p className="text-sm md:text-xl text-muted-foreground mb-3 md:mb-6 leading-relaxed">
              <span className="text-primary font-bold">Udruga Pulse</span> ponosni je organizator turnira Streetball Posušje.
            </p>
            <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 leading-relaxed">
              Naša udruga okuplja entuzijaste s ciljem promicanja sporta, poticanja mladih na stvaranje novih sportskih događaja i ulaganja energije u razvoj sporta u našem gradu.
            </p>
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
