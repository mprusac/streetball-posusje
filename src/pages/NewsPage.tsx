import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Trophy, Users, Megaphone, Newspaper, ArrowRight, X, ChevronLeft, ChevronRight, Pin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import streetball2025 from "@/assets/streetball-2025.jpg";
import streetball2025Banner from "@/assets/streetball-2025-banner.png";
import josipMamicHks from "@/assets/news/josip-mamic-hks.jpg";
import croFlag from "@/assets/flags/cro-flag.png";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: "utakmica" | "najava" | "klub";
  image: string;
  cardImage?: string;
  cardImagePosition?: string;
  galleryImages?: string[];
  flagImage?: string;
  pinned?: boolean;
}

const allNews: NewsItem[] = [
  { id: 48, title: "Streetball Turnir Posušje 2025 - Prijave otvorene! ⛹️", excerpt: "Streetball turnir Posušje se vraća! Nagradni fond 7.000 KM. Prijave su otvorene, ne propustite priliku za sudjelovanje!", content: "Streetball Posušje 2025 – Prijavi ekipu i osvoji nagrade! 🏀\n\nOvog ljeta, 18. i 19. srpnja 2025., Trg Hrvatskih branitelja u Posušju postaje centar vrhunske 3x3 košarke!\n\nU sklopu Posuškog Lita održava se Streetball Posušje, turnir koji okuplja sve generacije. Pripremili smo vrhunski program za sve posjetitelje koji će moći uživati u vrhunskoj košarci i odličnoj ponudi hrane i pića!\n\nNagradni fond: 7000 KM\n\nSeniori: Kotizacija - 100KM\n1. mjesto 4.500 KM\n2. mjesto 1.000 KM\n\nNatjecanja u tricama i zakucavanju po 100 KM\nMVP turnira - 200 KM\n\nAmateri, Juniori i Seniorke: Kotizacija besplatna\n1. mjesto 300KM\n\nSlužbena FIBA pravila, profesionalni teren i oprema!\nOdlična ponuda hrane i pića!\nDJ program\n\nPrijavi svoju ekipu i osvoji vrijedne nagrade! Vidimo se na Trgu hrvatskih branitelja u Posušju! 🏀🔥\n\nKontakt osoba: Petar Šušnjar (+387 63 390 237, +385 91 6082969), Zvonimir Biško (+387 63 420 125, +385 95 3303102)", date: "05. 04. 2025.", category: "najava", image: streetball2025Banner, cardImage: streetball2025, cardImagePosition: "center", pinned: true },
  { id: 47, title: "Josip Mamić na radaru HKS-a!", excerpt: "S velikim ponosom objavljujemo vijest da je naš talentirani predkadet Josip Mamić dobio službeni poziv Hrvatskog košarkaškog saveza!", content: "POZIV U REPREZENTACIJU: Josip Mamić na radaru HKS-a!\n\nS velikim ponosom objavljujemo vijest da je naš talentirani predkadet, Josip Mamić, dobio službeni poziv Hrvatskog košarkaškog saveza za sudjelovanje na kontrolnom treningu regije JUG!\n\nOvo veliko priznanje potvrda je predanog rada u omladinskom pogonu našeg kluba. Kontrolni trening održao se ovog četvrtka, 19. ožujka, u kultnoj sportskoj dvorani Baldekin u Šibeniku.\n\nJosipu želimo puno sreće i uspjeha u nastavku – sigurni smo da će dostojno predstaviti sebe i žuti dres KK Posušje!\n\nAjmo žuti! 💪\n\n#ajmozuti #kkposusje", date: "22. 03. 2026.", category: "klub", image: josipMamicHks, cardImage: josipMamicHks, cardImagePosition: "top", flagImage: croFlag },
];

const categories = [
  { id: "sve", label: "Sve", icon: Newspaper },
  { id: "utakmica", label: "Utakmice", icon: Trophy },
  { id: "najava", label: "Najave", icon: Megaphone },
  { id: "klub", label: "Klub", icon: Newspaper },
] as const;

const getCategoryLabel = (cat: string) => {
  const found = categories.find(c => c.id === cat);
  return found?.label || cat;
};

const ArticleDetail = ({ article }: { article: NewsItem }) => {
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryImages = article.galleryImages || [];

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const goToPrevious = () => setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  const goToNext = () => setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <div className="min-h-screen bg-background" style={{ zoom: 0.9 }}>
      <div className="pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <button onClick={() => navigate("/vijesti")} className="inline-flex items-center gap-3 text-primary hover:text-primary/80 transition-colors mb-8 text-lg">
              <ArrowLeft className="w-6 h-6" />
              <span className="font-display tracking-wider text-xl">Nazad na vijesti</span>
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm rounded mb-4">{getCategoryLabel(article.category)}</span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-primary mb-4">{article.title}{article.flagImage && <img src={article.flagImage} alt="flag" className="inline-block w-8 h-5 md:w-10 md:h-6 ml-2 align-middle" />}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-8">
              <Calendar size={16} />
              <span>{article.date}</span>
              <span className="mx-2">•</span>
              <span>{getCategoryLabel(article.category)}</span>
            </div>
            
            <div className="relative overflow-hidden rounded-lg mb-8">
              <img src={article.image} alt={article.title} className="w-full rounded-lg" />
            </div>

            <div className="prose prose-invert max-w-none">
              {article.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-foreground/90 text-lg leading-relaxed mb-4">
                  {paragraph.split('\n').map((line, j, arr) => (
                    <span key={j}>{line}{i === 0 && j === 0 && article.flagImage && <img src={article.flagImage} alt="flag" className="inline-block w-6 h-4 ml-1.5 align-middle" />}{j < arr.length - 1 && <br />}</span>
                  ))}
                </p>
              ))}
            </div>

            {galleryImages.length > 0 && (
              <div className="mt-8 columns-2 md:columns-3 gap-3">
                {galleryImages.map((img, i) => (
                  <img key={i} src={img} alt={`${article.title} - slika ${i + 1}`} className="w-full rounded-lg mb-3 break-inside-avoid cursor-pointer hover:opacity-90 transition-opacity" onClick={() => openLightbox(i)} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && galleryImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
          >
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} onClick={closeLightbox} className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-10">
              <X className="w-6 h-6" />
            </motion.button>
            <button onClick={(e) => { e.stopPropagation(); goToPrevious(); }} className="absolute left-4 p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-10">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <img src={galleryImages[currentIndex]} alt={`Slika ${currentIndex + 1}`} className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
            <button onClick={(e) => { e.stopPropagation(); goToNext(); }} className="absolute right-4 p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-10">
              <ChevronRight className="w-8 h-8" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-foreground/70 text-sm">
              {currentIndex + 1} / {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NewsPage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("sve");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  if (articleId) {
    const article = allNews.find(n => n.id === parseInt(articleId));
    if (article) return <ArticleDetail article={article} />;
  }

  const filteredNews = activeCategory === "sve" ? allNews : allNews.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-background" style={{ zoom: 0.9 }}>
      <div className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <button onClick={() => { sessionStorage.setItem("restoreHomeScroll", "true"); navigate("/"); }} className="inline-flex items-center gap-3 text-primary hover:text-primary/80 transition-colors mb-8 text-lg">
              <ArrowLeft className="w-6 h-6" />
              <span className="font-display tracking-wider text-xl">Nazad</span>
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-4">
              <span className="text-white">NAJNOVIJE </span>
              <span className="text-primary">VIJESTI</span>
            </h1>
            <p className="text-muted-foreground text-lg">Ostani u toku sa svim događanjima iz kluba</p>
          </motion.div>

          <div className="flex justify-center gap-1 md:gap-2 mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-3 rounded-full text-xs md:text-base font-medium transition-all duration-300 ${activeCategory === category.id ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-foreground hover:bg-secondary hover:text-primary"}`}>
                  <IconComponent size={16} />
                  {category.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto">
            {filteredNews.map((item, index) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                <Link to={`/vijesti/${item.id}`} className="group block bg-background rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover-lift border border-transparent hover:border-primary/30">
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.cardImage || item.image} alt={item.title} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${item.cardImagePosition === 'center' ? 'object-center' : item.cardImagePosition === 'upper' ? 'object-[center_5%]' : item.cardImagePosition === 'top' ? 'object-top' : item.cardImagePosition === 'lower' ? 'object-[center_35%]' : item.cardImagePosition === 'bottom' ? 'object-bottom' : 'object-[center_25%]'}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <span className="absolute top-3 left-3 px-2 py-1 bg-primary/90 text-primary-foreground text-xs rounded flex items-center gap-1 font-bold">
                      {(() => { const cat = item.category; const icons: Record<string, typeof Trophy> = { utakmica: Trophy, najava: Megaphone, klub: Newspaper }; const labels: Record<string, string> = { utakmica: "Utakmice", najava: "Najave", klub: "Klub" }; const Icon = icons[cat]; return <><Icon size={12} strokeWidth={3} />{labels[cat]}</>; })()}
                    </span>
                    {item.pinned && (
                      <span className="absolute top-3 right-3 p-1.5 bg-primary/90 text-primary-foreground rounded-full shadow-lg">
                        <Pin size={14} strokeWidth={2.5} className="rotate-45" />
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                      <Calendar size={14} />
                      {item.date}
                    </div>
                    <h3 className="text-xl font-display text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">{item.title}{item.flagImage && <img src={item.flagImage} alt="flag" className="inline-block h-4 md:h-5 ml-1.5 align-middle object-contain" />}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{item.excerpt}</p>
                    <div className="mt-auto inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                      Pročitaj više <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewsPage;
