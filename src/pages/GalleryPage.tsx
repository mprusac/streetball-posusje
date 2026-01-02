import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import eventTomislav from "@/assets/event-tomislav.png";
import eventSiroki from "@/assets/event-siroki.png";
import eventRama from "@/assets/event-rama.png";

// Import existing gallery images for album content
import action1 from "@/assets/action-1.jpg";
import action2 from "@/assets/action-2.jpg";
import action3 from "@/assets/action-3.jpg";
import action4 from "@/assets/action-4.png";
import action5 from "@/assets/action-5.png";
import action6 from "@/assets/action-6.png";

const events = [
  {
    id: "tomislav",
    title: "HKK Posušje - HKK Tomislav",
    date: "02.11.2025.",
    description: "Galerija s utakmice Posušje - Tomislav",
    coverImage: eventTomislav,
    images: [action1, action2, action3, action4, action5, action6],
  },
  {
    id: "siroki",
    title: "HKK Posušje - HKK Široki II",
    date: "15.11.2025.",
    description: "Galerija s utakmice Posušje - Široki II",
    coverImage: eventSiroki,
    images: [action2, action3, action1, action5, action6, action4],
  },
  {
    id: "rama",
    title: "HKK Posušje - HKK Rama",
    date: "23.11.2025.",
    description: "Galerija s utakmice Posušje - Rama",
    coverImage: eventRama,
    images: [action3, action1, action2, action6, action4, action5],
  },
];

const EventCard = ({ event, index }: { event: typeof events[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <Link to={`/galerija/${event.id}`} className="group block">
        <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary-foreground" />
              </div>
              <span className="text-white font-display text-lg tracking-wider uppercase">
                Otvori album
              </span>
            </motion.div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <p className="text-primary font-bold mt-1">{event.date}</p>
          <p className="text-muted-foreground text-sm mt-1">{event.description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

const EventAlbum = ({ event }: { event: typeof events[0] }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

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
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? event.images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === event.images.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/galerija"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-display tracking-wider">Nazad na galeriju</span>
            </Link>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-2">
              <span className="text-white">{event.title.split(" - ")[0]}</span>
              <span className="text-primary"> - {event.title.split(" - ")[1]}</span>
            </h1>
            <p className="text-primary font-display text-2xl md:text-3xl mt-2">{event.date}</p>
            <p className="text-muted-foreground mt-4">{event.description}</p>
          </motion.div>

          {/* Bento Grid Album */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-5xl mx-auto" style={{ gridAutoRows: "100px" }}>
            {event.images.map((img, index) => {
              const spanClasses = [
                "row-span-3 col-span-1",
                "row-span-2 col-span-1",
                "row-span-2 col-span-1",
                "row-span-3 col-span-1",
                "row-span-2 col-span-1",
                "row-span-2 col-span-1",
              ];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`group relative overflow-hidden rounded-lg cursor-pointer ${spanClasses[index % 6]}`}
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={img}
                    alt={`Slika ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                </motion.div>
              );
            })}
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-4 p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </motion.button>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={currentIndex}
                src={event.images[currentIndex]}
                alt={`Slika ${currentIndex + 1}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-foreground/70 text-sm"
            >
              {currentIndex + 1} / {event.images.length}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

const GalleryPage = () => {
  const { eventId } = useParams();

  // If eventId is provided, show the album
  if (eventId) {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      return <EventAlbum event={event} />;
    }
  }

  // Otherwise show the events list
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
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
              Zabilježeni trenuci sa naših utakmica - svaka fotografija priča svoju priču
            </p>
          </motion.div>

          {/* Events Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GalleryPage;
