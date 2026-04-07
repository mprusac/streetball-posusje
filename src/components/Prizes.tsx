import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Trophy, Medal, Target, Star } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

const Prizes = () => {
  const { elementRef, isVisible } = useScrollReveal();
  const { count, elementRef: countRef } = useCountUp({ end: 7000 });

  return (
    <section id="nagrade" className="py-20 -mt-6">
      <div
        ref={elementRef}
        className={`container mx-auto px-4 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div ref={countRef} className="flex justify-center mb-12">
          <div
            className="group inline-block px-8 md:px-14 py-5 md:py-7 rounded-2xl border-2 border-primary/60 hover:border-primary transition-all duration-500 hover:shadow-[0_0_40px_rgba(234,179,8,0.2)] cursor-default"
            style={{
              background: 'linear-gradient(135deg, hsl(0 0% 5%) 0%, hsl(45 100% 51% / 0.08) 50%, hsl(0 0% 8%) 100%)',
            }}
          >
            <div className="flex items-center gap-3 md:gap-4 justify-center mb-2 md:mb-3">
              <Trophy className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <span className="text-sm md:text-base tracking-[0.3em] text-primary font-bold font-display drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
                NAGRADNI FOND
              </span>
              <Trophy className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="text-3xl md:text-5xl font-display font-bold text-center group-hover:scale-105 transition-transform duration-300">
              <span
                style={{
                  backgroundImage: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 40%, hsl(0 0% 100% / 0.9) 50%, hsl(var(--primary)) 60%, hsl(var(--primary)) 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 3s ease-in-out infinite',
                }}
              >
                {count.toLocaleString('de-DE')} KM
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {/* Seniori */}
          <div
            className="card-micro bg-secondary/30 border border-border rounded-xl p-5 md:p-6 hover:border-primary/30 group"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.5s ease 0s",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="icon-bounce p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-all duration-300">
                <Trophy className="text-primary w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg md:text-xl text-foreground tracking-wide">SENIORI</h3>
                <p className="text-xs text-muted-foreground">Kotizacija: 100 KM</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded-lg bg-background/50 border border-border/50 animate-shimmer">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Medal className="w-4 h-4 text-primary" /> 1. mjesto
                </span>
                <span className="text-sm font-bold text-primary">4.500 KM</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-background/50 border border-border/50">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Medal className="w-4 h-4 text-muted-foreground" /> 2. mjesto
                </span>
                <span className="text-sm font-bold text-primary">1.000 KM</span>
              </div>
            </div>
          </div>

          {/* Posebne nagrade */}
          <div
            className="card-micro bg-secondary/30 border border-border rounded-xl p-5 md:p-6 hover:border-primary/30 group"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.5s ease 0.1s",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="icon-bounce p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-all duration-300">
                <Star className="text-primary w-5 h-5" />
              </div>
              <h3 className="font-display text-lg md:text-xl text-foreground tracking-wide">POSEBNE NAGRADE</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded-lg bg-background/50 border border-border/50">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" /> Pobjednik u zakucavanju
                </span>
                <span className="text-sm font-bold text-primary">100 KM</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-background/50 border border-border/50">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" /> Pobjednik u tricama
                </span>
                <span className="text-sm font-bold text-primary">100 KM</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-background/50 border border-border/50">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-primary" /> MVP turnira
                </span>
                <span className="text-sm font-bold text-primary">200 KM</span>
              </div>
            </div>
          </div>

          {/* Amateri, Juniori, Seniorke */}
          <div
            className="md:col-span-2 max-w-md mx-auto w-full card-micro bg-secondary/30 border border-border rounded-xl p-5 md:p-6 hover:border-primary/30 group"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.5s ease 0.2s",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="icon-bounce p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-all duration-300">
                <Medal className="text-primary w-6 h-6" />
              </div>
              <div className="leading-tight">
                <h3 className="font-display text-sm md:text-base text-foreground tracking-wide">
                  AMATERI (Posuške ekipe)
                </h3>
                <h3 className="font-display text-xs md:text-sm text-foreground tracking-wide mt-0.5">
                  JUNIORI (U-18), SENIORKE
                </h3>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded-lg bg-background/50 border border-border/50">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Medal className="w-4 h-4 text-primary" /> Amateri - 1. mjesto
                </span>
                <span className="text-sm font-bold text-primary">300 KM</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-background/50 border border-border/50">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Medal className="w-4 h-4 text-primary" /> Juniori - 1. mjesto
                </span>
                <span className="text-sm font-bold text-primary">300 KM</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-background/50 border border-border/50">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Medal className="w-4 h-4 text-primary" /> Seniorke - 1. mjesto
                </span>
                <span className="text-sm font-bold text-primary">300 KM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Prizes;
