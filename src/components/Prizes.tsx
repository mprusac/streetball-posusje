import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Trophy, Medal, Target, Star } from "lucide-react";

const Prizes = () => {
  const { elementRef, isVisible } = useScrollReveal();

  return (
    <section id="nagrade" className="py-20">
      <div
        ref={elementRef}
        className={`container mx-auto px-4 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="section-title text-center mb-2">
          <span className="section-title-gold">NAGRADNI FOND</span>
        </h2>
        <p className="text-center text-3xl md:text-4xl font-display font-bold text-primary mb-12">
          7.000 KM
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {/* Seniori */}
          <div className="bg-secondary/30 border border-border rounded-xl p-5 md:p-6 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Trophy className="text-primary w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg md:text-xl text-foreground tracking-wide">SENIORI</h3>
                <p className="text-xs text-muted-foreground">Kotizacija: 100 KM</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded-lg bg-background/50 border border-border/50">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Medal className="w-4 h-4 text-yellow-500" /> 1. mjesto
                </span>
                <span className="text-sm font-bold text-primary">4.500 KM</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-background/50 border border-border/50">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Medal className="w-4 h-4 text-gray-400" /> 2. mjesto
                </span>
                <span className="text-sm font-bold text-primary">1.000 KM</span>
              </div>
            </div>
          </div>

          {/* Posebne nagrade */}
          <div className="bg-secondary/30 border border-border rounded-xl p-5 md:p-6 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary/20 rounded-lg">
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
          <div className="md:col-span-2 bg-secondary/30 border border-border rounded-xl p-5 md:p-6 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Medal className="text-primary w-5 h-5" />
              </div>
              <h3 className="font-display text-base md:text-lg text-foreground tracking-wide">
                AMATERI (Posuške ekipe), JUNIORI (U-18), SENIORKE
              </h3>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-background/50 border border-border/50">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <Medal className="w-4 h-4 text-yellow-500" /> 1. mjesto
              </span>
              <span className="text-sm font-bold text-primary">300 KM x3</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Prizes;
