import { useState } from "react";
import { ChevronUp, ChevronDown, Crown, Medal, Award, Heart, Star, Trophy } from "lucide-react";

import vokelLogo from "@/assets/sponsors/vokel-logo.png";
import planetLogo from "@/assets/sponsors/planet-logo.png";
import binvestLogo from "@/assets/sponsors/binvest-logo.png";
import sisovicLogo from "@/assets/sponsors/sisovic.png";
import ledaLogo from "@/assets/sponsors/leda-logo.png";
import adeoLogo from "@/assets/sponsors/adeo-logo.png";
import antikLogo from "@/assets/sponsors/antik-logo.png";
import astoriaLogo from "@/assets/sponsors/astoria-logo.png";
import dravelLogo from "@/assets/sponsors/dravel-logo.png";
import gaudeamusLogo from "@/assets/sponsors/gaudeamus-logo.png";
import grillkongLogo from "@/assets/sponsors/grillkong-logo.png";
import hydraLogo from "@/assets/sponsors/hydra-logo.png";
import jvstudioLogo from "@/assets/sponsors/jvstudio-logo.png";
import markotaLogo from "@/assets/sponsors/markota-logo.png";
import meggleLogo from "@/assets/sponsors/meggle-logo.png";

interface SponsorTier {
  name: string;
  price: string;
  benefits: string[];
  icon: React.ReactNode;
  color: string;
}

const sponsorTiers: SponsorTier[] = [
  {
    name: "ZLATNI",
    price: "1.000 KM",
    benefits: [
      "Logo na terenu, zaštitnim spužvama ili tabli koša",
      "\"Naming rights\" – natjecanje nosi ime sponzora",
      "Najviša rotacija logotipa na LED ekranima",
      "Zasebna PR objava/intervju na društvenim mrežama",
      "Predstavnik dodjeljuje pehar/nagrade pobjednicima",
    ],
    icon: <Crown className="w-4 h-4 md:w-8 md:h-8" />,
    color: "text-primary",
  },
  {
    name: "SREBRENI",
    price: "500 KM",
    benefits: [
      "Logo na LED ekranima (srednja rotacija)",
      "MC spominje tvrtku u najavama i odjavama",
      "Pravo na promotivni štand, roll-up ili podjelu letaka",
      "Logo srednje veličine na službenim najavama",
    ],
    icon: <Medal className="w-4 h-4 md:w-8 md:h-8" />,
    color: "text-[hsl(0,0%,75%)]",
  },
  {
    name: "BRONČANI",
    price: "250 KM",
    benefits: [
      "Logo na službenim plakatima",
      "Istaknuto mjesto na \"zidu za slikanje\" (press wall)",
      "Logo na LED ekranima (osnovna rotacija)",
      "Spominjanje u završnoj grupnoj zahvali na mrežama",
    ],
    icon: <Award className="w-4 h-4 md:w-8 md:h-8" />,
    color: "text-[hsl(30,60%,45%)]",
  },
  {
    name: "ROBNO PARTNERSTVO",
    price: "Kompenzacija",
    benefits: [
      "Ostvarite sponzorski paket kompenzacijom proizvoda/usluga",
      "Ekskluzivna \"Timeout\" minuta – vaš brend na svim ekranima",
      "Nagradni izazovi na terenu s vašim proizvodom",
    ],
    icon: <Star className="w-4 h-4 md:w-8 md:h-8" />,
    color: "text-primary",
  },
  {
    name: "DONACIJA",
    price: "Bilo koji iznos",
    benefits: ["Spiker će uputiti zahvalu i pročitati ime donatora"],
    icon: <Heart className="w-4 h-4 md:w-8 md:h-8" />,
    color: "text-primary",
  },
];

const goldBorder = "border-[hsl(48,96%,53%)]";
const goldGlow = "hover:[box-shadow:0_0_25px_8px_hsl(48,96%,53%,0.35)]";

const sponsors = [
  { name: "Vokel d.o.o.", image: vokelLogo, imgClass: "scale-[1.3]", url: "https://vokel.com/" },
  { name: "Meggle", image: meggleLogo, imgClass: "!object-contain scale-[0.85]", url: null },
  { name: "Bin Vest", image: binvestLogo, imgClass: "!object-contain scale-[1.6]", url: "https://binvest-po.com/" },
  { name: "Adeo Sports", image: adeoLogo, imgClass: "!object-contain scale-[1.1]", url: null },
  { name: "Miviko", image: null, imgClass: "", url: null },
  { name: "Planet", image: planetLogo, imgClass: "scale-[1.6]", url: "https://www.facebook.com/planetbih/" },
  { name: "Gaudeamus", image: gaudeamusLogo, imgClass: "!object-contain scale-[1.1]", url: null },
  { name: "WWin", image: null, imgClass: "", url: null },
  { name: "Grill Kong", image: grillkongLogo, imgClass: "!object-contain scale-[1.1]", url: null },
  { name: "Agencija Laguna", image: null, imgClass: "", url: null },
  { name: "Dravel", image: dravelLogo, imgClass: "!object-contain scale-[1.1]", url: null },
  { name: "Šišović Rakitno", image: sisovicLogo, imgClass: "!object-contain scale-[2.5]", url: "https://www.sisovic.com/" },
  { name: "Antik", image: antikLogo, imgClass: "!object-contain scale-[1.1]", url: null },
  { name: "Mrvelji d.o.o.", image: null, imgClass: "", url: null },
  { name: "Astoria Restoran", image: astoriaLogo, imgClass: "!object-contain scale-[1.1]", url: null },
  { name: "Leda", image: ledaLogo, imgClass: "", url: "http://www.leda.ba/" },
  { name: "JV Studio", image: jvstudioLogo, imgClass: "!object-contain scale-[1.1]", url: null },
  { name: "Weltplast", image: null, imgClass: "", url: null },
  { name: "Markota", image: markotaLogo, imgClass: "!object-contain scale-[1.1]", url: null },
  { name: "Croatia Osiguranje", image: null, imgClass: "", url: null },
  { name: "Hydra Iso", image: hydraLogo, imgClass: "!object-contain scale-[1.1]", url: null },
  { name: "Ljekarna Blanka", image: null, imgClass: "", url: null },
  { name: "Winners", image: null, imgClass: "", url: null },
  { name: "Restoran Bosiljna", image: null, imgClass: "", url: null },
  { name: "KTM Brina", image: null, imgClass: "", url: null },
  { name: "Ardu", image: null, imgClass: "", url: null },
];

const Sponsors = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="sponzori" className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-3 md:mb-4">
          <span className="section-title-white">NAŠI </span>
          <span className="section-title-gold">SPONZORI</span>
        </h2>

        <p className="text-muted-foreground text-center mb-8 md:mb-16 max-w-2xl mx-auto text-base md:text-lg">
          Naši partneri koji podržavaju razvoj turnira i omogućavaju ostvarivanje naših ciljeva
        </p>

        {/* Sponsor Logos */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-5 max-w-4xl mx-auto mb-8 md:mb-16">
          {sponsors.map((sponsor, index) => {
            const Wrapper = sponsor.url ? 'a' : 'div';
            const linkProps = sponsor.url ? { href: sponsor.url, target: "_blank", rel: "noopener noreferrer" } : {};
            return (
              <Wrapper
                key={sponsor.name}
                {...linkProps as any}
                className={`bg-secondary/50 border-2 ${goldBorder} rounded-2xl overflow-hidden hover:scale-[1.05] ${goldGlow} transition-all duration-300 animate-fade-in-up aspect-[2/1] flex items-center justify-center ${sponsor.name === "Ardu" ? "hidden md:block" : ""}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {sponsor.image ? (
                  <img 
                    src={sponsor.image} 
                    alt={sponsor.name} 
                    loading="lazy"
                    className={`w-full h-full object-cover ${sponsor.imgClass}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/80">
                    <span className="text-muted-foreground text-xs md:text-sm font-semibold text-center px-2">{sponsor.name}</span>
                  </div>
                )}
              </Wrapper>
            );
          })}
        </div>

        {/* Become a Sponsor */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="rounded-xl overflow-hidden border-2 border-primary shadow-[0_0_30px_hsl(48,96%,53%,0.2)]"
            style={{
              background: 'linear-gradient(135deg, hsl(0 0% 5%) 0%, hsl(48 96% 53% / 0.1) 50%, hsl(0 0% 8%) 100%)',
            }}
          >
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full p-6 flex items-center justify-between transition-all duration-300"
            >
              <div className="p-2 rounded-full opacity-0 pointer-events-none">
                <ChevronDown size={24} />
              </div>
              <div className="text-center flex-1">
                <h3 className="text-2xl md:text-3xl font-display">
                  <span 
                    className="text-primary bg-clip-text relative"
                    style={{
                      backgroundImage: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 40%, hsl(0 0% 100% / 0.9) 50%, hsl(var(--primary)) 60%, hsl(var(--primary)) 100%)',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: 'shimmer 3s ease-in-out infinite',
                    }}
                  >
                    POSTANI SPONZOR
                  </span>
                </h3>
                <p className="text-muted-foreground text-base mt-1">
                  <span className="md:hidden">Pogledaj sponzorske pakete<br />i podrži turnir</span>
                  <span className="hidden md:inline">Pogledaj sponzorske pakete i podrži turnir</span>
                </p>
              </div>
              <div className={`p-2 rounded-full bg-primary/20 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown className="text-primary" size={24} />
              </div>
            </button>

            {/* Expandable Content */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                isExpanded ? "max-h-[4000px]" : "max-h-0"
              }`}
            >
              <div className="px-3 pb-4 md:px-6 md:pb-6">
                {/* Horizontal scrollable tiers */}
                <div className="flex gap-3 md:gap-4 mb-4 md:mb-6 mt-2 md:mt-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  {sponsorTiers.map((tier, index) => {
                    const shadowColor = tier.name === "ZLATNI" 
                      ? "hover:[box-shadow:0_0_20px_6px_hsl(48,96%,53%,0.3)]" 
                      : tier.name === "SREBRENI" 
                      ? "hover:[box-shadow:0_0_20px_6px_hsl(0,0%,70%,0.2)]" 
                      : tier.name === "BRONČANI" 
                      ? "hover:[box-shadow:0_0_20px_6px_hsl(30,60%,45%,0.2)]" 
                      : "hover:[box-shadow:0_0_20px_6px_hsl(48,96%,53%,0.2)]";
                    
                    return (
                      <div
                        key={tier.name}
                        className={`group bg-secondary/40 border border-border rounded-lg p-3 md:p-4 animate-fade-in-up transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 ${shadowColor} snap-start shrink-0 w-[calc(50%-6px)] md:w-[220px] lg:w-auto lg:flex-1 cursor-default select-none`}
                        style={{ animationDelay: `${index * 80}ms` }}
                      >
                        <div className="flex items-center gap-2 mb-1 min-h-[44px] md:min-h-[52px]">
                          <div className={`${tier.color} transition-transform duration-300 group-hover:scale-110 w-4 md:w-8 flex items-center justify-center shrink-0`}>{tier.icon}</div>
                          <div className="leading-[1.1]">
                            <h4 className={`font-semibold text-xs md:text-sm ${tier.color}`}>{tier.name}</h4>
                            <p className="text-primary text-sm md:text-base font-display font-bold">{tier.price}</p>
                          </div>
                        </div>
                        <ul className="space-y-1">
                          {tier.benefits.map((benefit) => (
                            <li
                              key={benefit}
                              className="text-muted-foreground text-[11px] md:text-xs flex items-start gap-1.5 leading-snug"
                            >
                              <span className="text-primary mt-0.5 shrink-0">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                {/* Payment Info */}
                <div className="bg-background/50 border border-border rounded-lg p-4 md:p-5">
                  <h4 className="font-display text-base md:text-lg mb-3">
                    <span className="text-primary">PODACI ZA </span>
                    <span className="text-primary">PLAĆANJE</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs md:text-sm">
                    <div>
                      <span className="text-muted-foreground block mb-1">PRIMATELJ</span>
                      <span className="text-foreground">Udruga Pulse, Ričina 3, Čitluk, Posušje</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">BANKA</span>
                      <span className="text-foreground">Intesa Sanpaolo Banka BiH</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">BROJ RAČUNA</span>
                      <span className="text-foreground break-all">1544002022913382</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
