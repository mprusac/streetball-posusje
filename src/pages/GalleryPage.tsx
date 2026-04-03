import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

interface GalleryEvent {
  id: string;
  title: string;
  date: string;
  images: string[];
  cover_image: string | null;
  created_at: string;
}

const EventCard = ({ event, index }: { event: GalleryEvent; index: number }) => {
  const coverImage = event.cover_image || event.images?.[0];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <Link to={`/galerija/${event.id}`} className="group block">
        <div className="relative overflow-hidden rounded-lg aspect-[4/3] shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:shadow-[0_0_30px_rgba(234,179,8,0.25)] transition-shadow duration-300">
          {coverImage ? (
            <img
              src={coverImage}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-muted/30 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <Camera className="w-12 h-12 text-primary/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300">
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary-foreground" />
              </div>
              <span className="text-white font-display text-lg tracking-wider uppercase mt-3">
                Otvori album
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <p className="text-primary font-bold mt-1">{event.date}</p>
          <p className="text-muted-foreground text-sm mt-1 hidden md:block">
            {event.images?.length || 0} fotografija
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

const EventAlbum = ({ event }: { event: GalleryEvent }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const allImages = event.images || [];

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/galerija"
              className="inline-flex items-center gap-3 text-primary hover:text-primary/80 transition-colors mb-8 text-lg"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="font-display font-bold uppercase tracking-wider text-xl">NAZAD NA GALERIJU</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-2">
              <span className="text-primary">{event.title}</span>
            </h1>
            <p className="text-primary font-display text-2xl md:text-3xl mt-2">{event.date}</p>
            <p className="text-muted-foreground mt-4">{allImages.length} fotografija</p>
          </motion.div>

          {/* Masonry Gallery */}
          <div className="columns-2 md:columns-3 gap-1.5 max-w-5xl mx-auto">
            {allImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative overflow-hidden cursor-pointer mb-1.5 break-inside-avoid"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={img}
                  alt={`Slika ${index + 1}`}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-4 p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <img
              src={allImages[currentIndex]}
              alt={`Slika ${currentIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-foreground/70 text-sm">
              {currentIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

const GalleryPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [galleries, setGalleries] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState<GalleryEvent | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  useEffect(() => {
    const fetchGalleries = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('galleries')
        .select('*')
        .order('date', { ascending: false });
      
      if (!error && data) {
        // Sort chronologically by parsing date (DD.MM.YYYY. format)
        const sorted = [...data].sort((a, b) => {
          const parseDate = (d: string) => {
            const parts = d.replace(/\./g, '').trim().split(' ').filter(Boolean);
            if (parts.length >= 3) {
              return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
            }
            return 0;
          };
          return parseDate(b.date) - parseDate(a.date);
        });
        setGalleries(sorted as GalleryEvent[]);
      }
      setLoading(false);
    };
    fetchGalleries();
  }, []);

  // Find gallery by ID
  useEffect(() => {
    if (eventId && galleries.length > 0) {
      const found = galleries.find(g => g.id === eventId);
      setSelectedGallery(found || null);
    } else {
      setSelectedGallery(null);
    }
  }, [eventId, galleries]);

  if (eventId && selectedGallery) {
    return <EventAlbum event={selectedGallery} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => { sessionStorage.setItem("restoreHomeScroll", "true"); navigate("/"); }}
              className="inline-flex items-center gap-3 text-primary hover:text-primary/80 transition-colors mb-8 text-lg"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="font-display font-bold uppercase tracking-wider text-xl">NAZAD</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-4">
              <span className="text-white">FOTO</span>
              <span className="text-primary"> GALERIJA</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Zabilježeni trenuci sa našeg turnira
            </p>
          </motion.div>

          {loading ? (
            <p className="text-muted-foreground text-center py-8">Učitavanje galerija...</p>
          ) : galleries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nema galerija za prikaz.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
              {galleries.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GalleryPage;
