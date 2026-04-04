import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface FibaRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FibaRegistrationModal = ({ isOpen, onClose }: FibaRegistrationModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current || !scrollAreaRef.current) return;

    const container = containerRef.current;
    const scrollArea = scrollAreaRef.current;

    container.innerHTML = "";

    const scrollToTop = (behavior: ScrollBehavior = "smooth") => {
      scrollArea.scrollTo({ top: 0, behavior });
    };

    const revealAddPlayerModal = () => {
      scrollToTop("auto");
      requestAnimationFrame(() => scrollToTop("smooth"));
      window.setTimeout(() => scrollToTop("smooth"), 180);
    };

    const handleEmbedClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const trigger = target.closest("button, a, [role='button']") as HTMLElement | null;
      const actionText = `${target.textContent ?? ""} ${trigger?.textContent ?? ""}`.toUpperCase();

      if (actionText.includes("ADD PLAYER")) {
        revealAddPlayerModal();
      }
    };

    const observer = new MutationObserver((mutations) => {
      const addPlayerOpened = mutations.some((mutation) =>
        Array.from(mutation.addedNodes).some((node) => {
          if (!(node instanceof HTMLElement)) return false;
          const text = node.textContent?.toUpperCase() ?? "";
          return text.includes("SEARCH FOR A PLAYER'S FIBA 3X3 PROFILE") || text.includes("ADD PLAYER TO TEAM");
        }),
      );

      if (addPlayerOpened) {
        revealAddPlayerModal();
      }
    });

    const script = document.createElement("script");
    script.setAttribute("data-fiba-embedtype", "registration");
    script.setAttribute("data-fiba-eventid", "06f6d620-d5d0-4be1-8cad-1adfeeba8301");
    script.src = "https://play.fiba3x3.com/embed.js";
    script.async = true;

    container.addEventListener("click", handleEmbedClick, true);
    observer.observe(container, { childList: true, subtree: true });
    container.appendChild(script);
    revealAddPlayerModal();

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      container.removeEventListener("click", handleEmbedClick, true);
      observer.disconnect();
      container.innerHTML = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl w-full max-w-lg h-[95vh] flex flex-col shadow-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(0 0% 5%) 0%, hsl(45 100% 51% / 0.08) 50%, hsl(0 0% 8%) 100%)',
          border: '2px solid transparent',
          backgroundClip: 'padding-box',
          boxShadow: '0 0 15px hsl(45 100% 51% / 0.3), 0 0 30px hsl(45 100% 51% / 0.15), inset 0 0 0 2px hsl(45 100% 51% / 0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed header - always on top, NOT inside scroll area */}
        <div className="shrink-0 z-30 border-b border-primary/30 rounded-t-2xl px-6 py-4 flex items-center justify-center relative" style={{ background: 'hsl(0 0% 6%)' }}>
          <h2 className="font-display text-xl md:text-2xl text-primary">
            PRIJAVA NA TURNIR
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable widget area - isolated so FIBA overlays stay contained */}
        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
          style={{ position: 'relative' }}
        >
          <div ref={containerRef} className="p-2 md:p-4" />
        </div>

        {/* Hint footer - fixed at bottom, not inside scroll */}
        <div className="shrink-0 border-t border-primary/20 px-4 py-2 text-center rounded-b-2xl" style={{ background: 'hsl(0 0% 6% / 0.95)' }}>
          <p className="text-xs text-muted-foreground">
            💡 Nakon klika na <span className="text-primary font-medium">Add Player</span>, scrollaj prema vrhu za pretraživanje igrača
          </p>
        </div>
      </div>
    </div>
  );
};

export default FibaRegistrationModal;
