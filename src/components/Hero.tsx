import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";

const TOURNAMENT_DATE = new Date("2026-07-18T18:00:00");
const MOBILE_HERO_VIDEO = "/hero-video-mobile.mp4";
const DESKTOP_HERO_VIDEO = "/hero-video-optimized.mp4";
const DESKTOP_BREAKPOINT = 768;

const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};

const TYPEWRITER_TEXT = "Igra koja spaja";

const WordReveal = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const words = text.split(" ");

  return (
    <span className="inline-flex flex-wrap justify-center gap-x-[0.3em]">
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <span
            className="inline-block"
            style={{
              animation: `word-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
              animationDelay: `${delay + i * 0.12}s`,
              opacity: 0,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
};

const Hero = () => {
  const countdown = useCountdown(TOURNAMENT_DATE);
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isDesktopViewport, setIsDesktopViewport] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= DESKTOP_BREAKPOINT : true
  );
  const [videoSrc, setVideoSrc] = useState(() =>
    typeof window !== "undefined" && window.innerWidth >= DESKTOP_BREAKPOINT
      ? MOBILE_HERO_VIDEO
      : MOBILE_HERO_VIDEO
  );
  const typewriterStarted = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pendingPlaybackTime = useRef<number | null>(null);

  useEffect(() => {
    if (typewriterStarted.current) return;
    typewriterStarted.current = true;

    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayedText(TYPEWRITER_TEXT.slice(0, i));
      if (i >= TYPEWRITER_TEXT.length) {
        clearInterval(timer);
        setTimeout(() => setShowCursor(false), 1500);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopViewport(window.innerWidth >= DESKTOP_BREAKPOINT);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isDesktopViewport) {
      pendingPlaybackTime.current = null;
      setVideoSrc(MOBILE_HERO_VIDEO);
      return;
    }

    setVideoSrc(MOBILE_HERO_VIDEO);

    const preloadVideo = document.createElement("video");
    preloadVideo.src = DESKTOP_HERO_VIDEO;
    preloadVideo.preload = "auto";
    preloadVideo.muted = true;
    preloadVideo.playsInline = true;

    const promoteDesktopVideo = () => {
      pendingPlaybackTime.current = videoRef.current?.currentTime ?? 0;
      setVideoSrc((currentSrc) => (currentSrc === DESKTOP_HERO_VIDEO ? currentSrc : DESKTOP_HERO_VIDEO));
    };

    preloadVideo.addEventListener("canplay", promoteDesktopVideo, { once: true });
    preloadVideo.load();

    return () => {
      preloadVideo.removeEventListener("canplay", promoteDesktopVideo);
      preloadVideo.src = "";
      preloadVideo.load();
    };
  }, [isDesktopViewport]);

  const syncAndPlayVideo = () => {
    const video = videoRef.current;

    if (!video) return;

    if (videoSrc === DESKTOP_HERO_VIDEO && pendingPlaybackTime.current !== null) {
      const nextTime = Math.min(pendingPlaybackTime.current, Math.max(video.duration - 0.1, 0));

      if (Number.isFinite(nextTime) && nextTime > 0) {
        video.currentTime = nextTime;
      }

      pendingPlaybackTime.current = null;
    }

    void video.play().catch(() => undefined);
  };

  return (
    <section
      id="pocetna"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full bg-background">
        <video
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={syncAndPlayVideo}
          onCanPlay={syncAndPlayVideo}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center -mt-20 md:mt-0">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display tracking-wider mb-4 mt-24 md:mt-10">
            <span className="block text-foreground">
              <WordReveal text="STREETBALL" delay={0.2} />
            </span>
            <span className="block text-primary">
              <WordReveal text="POSUŠJE 2026" delay={0.5} />
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-8 animate-fade-in-up delay-200">
            {displayedText}
            {showCursor && <span className="inline-block w-[2px] h-[1em] bg-primary ml-1 animate-pulse align-middle" />}
          </p>

          <div className="animate-fade-in-up delay-400">
            <Button
              size="lg"
              className="group relative overflow-hidden bg-transparent border-2 border-primary text-primary hover:text-primary-foreground font-display uppercase tracking-widest px-6 sm:px-10 py-5 sm:py-7 text-base sm:text-lg transition-all duration-500 hover:shadow-[0_0_30px_hsl(48,96%,53%,0.4)]"
              asChild
            >
              <a href="#kontakt">
                <span className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10">Prijavi se</span>
              </a>
            </Button>
          </div>

          <div className="mt-8 sm:mt-10 animate-fade-in-up delay-400">
            <p className="font-display text-sm sm:text-base tracking-[0.2em] text-foreground/80 mb-3 uppercase">Turnir počinje za:</p>
            <div className="flex justify-center gap-3 sm:gap-6">
              {[
                { value: countdown.days, label: "Dana" },
                { value: countdown.hours, label: "Sati" },
                { value: countdown.minutes, label: "Minuta" },
                { value: countdown.seconds, label: "Sekundi" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                  <span className="font-display text-3xl sm:text-5xl md:text-6xl text-primary tabular-nums leading-none">
                    {String(item.value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <a
          href="#vijesti"
          className="text-primary animate-bounce"
          aria-label="Scroll down"
        >
          <ChevronDown size={32} />
        </a>
      </div>
    </section>
  );
};

export default Hero;
