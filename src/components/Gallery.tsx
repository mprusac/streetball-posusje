import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import action1 from "@/assets/action-1.jpg";
import action2 from "@/assets/action-2.jpg";
import action3 from "@/assets/action-3.jpg";
import action4 from "@/assets/action-4.png";
import action5 from "@/assets/action-5.png";
import action6 from "@/assets/action-6.png";

const images = [
  { id: 1, src: action1, title: "Juniori na Telemach Sarajevo Cupu" },
  { id: 2, src: action2, title: "Prodor mladog Davida Dragoje" },
  { id: 3, src: action3, title: "Mladi centar Marko Protrka" },
  { id: 4, src: action4, title: "Timeout" },
  { id: 5, src: action5, title: "Iskusni Mirko Đerek" },
  { id: 6, src: action6, title: "Prvi tim" },
];

const Gallery = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
  };

  return (
    <section id="galerija" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-12">
          <span className="section-title-white">U </span>
          <span className="section-title-gold">AKCIJI</span>
        </h2>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto">
          {/* Row 1: Tall left, Square middle, Wide right */}
          <div 
            className="row-span-2 group relative overflow-hidden rounded-xl cursor-pointer animate-fade-in-up hover-lift aspect-[3/4]"
            onClick={() => openLightbox(1)}
          >
            <img
              src={action2}
              alt={images[1].title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-primary font-bold text-sm uppercase tracking-wider drop-shadow-lg">{images[1].title}</span>
            </div>
          </div>

          <div 
            className="group relative overflow-hidden rounded-xl cursor-pointer animate-fade-in-up hover-lift aspect-square"
            style={{ animationDelay: "100ms" }}
            onClick={() => openLightbox(4)}
          >
            <img
              src={action5}
              alt={images[4].title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-primary font-bold text-sm uppercase tracking-wider drop-shadow-lg">{images[4].title}</span>
            </div>
          </div>

          <div 
            className="group relative overflow-hidden rounded-xl cursor-pointer animate-fade-in-up hover-lift aspect-[4/3]"
            style={{ animationDelay: "150ms" }}
            onClick={() => openLightbox(0)}
          >
            <img
              src={action1}
              alt={images[0].title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-primary font-bold text-sm uppercase tracking-wider drop-shadow-lg">{images[0].title}</span>
            </div>
          </div>

          {/* Row 2: Square middle (continues tall left), Wide right bottom */}
          <div 
            className="group relative overflow-hidden rounded-xl cursor-pointer animate-fade-in-up hover-lift aspect-square"
            style={{ animationDelay: "200ms" }}
            onClick={() => openLightbox(2)}
          >
            <img
              src={action3}
              alt={images[2].title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-primary font-bold text-sm uppercase tracking-wider drop-shadow-lg">{images[2].title}</span>
            </div>
          </div>

          <div 
            className="group relative overflow-hidden rounded-xl cursor-pointer animate-fade-in-up hover-lift aspect-[4/3]"
            style={{ animationDelay: "250ms" }}
            onClick={() => openLightbox(3)}
          >
            <img
              src={action4}
              alt={images[3].title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-primary font-bold text-sm uppercase tracking-wider drop-shadow-lg">{images[3].title}</span>
            </div>
          </div>

          {/* Row 3: Wide bottom spanning 2 cols + Tall right */}
          <div 
            className="col-span-2 group relative overflow-hidden rounded-xl cursor-pointer animate-fade-in-up hover-lift aspect-[2/1]"
            style={{ animationDelay: "300ms" }}
            onClick={() => openLightbox(5)}
          >
            <img
              src={action6}
              alt={images[5].title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-primary font-bold text-sm uppercase tracking-wider drop-shadow-lg">{images[5].title}</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-wider"
          >
            Sva galerija
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Image */}
          <img
            src={images[currentIndex].src}
            alt={`Galerija ${currentIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-foreground/70 text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
