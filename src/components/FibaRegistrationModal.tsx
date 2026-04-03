import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface FibaRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FibaRegistrationModal = ({ isOpen, onClose }: FibaRegistrationModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.setAttribute("data-fiba-embedtype", "registration");
    script.setAttribute("data-fiba-eventid", "3eab0fdf-75f7-48a3-a788-51e5cccf0021");
    script.src = "https://play.fiba3x3.com/embed.js";
    script.async = true;
    containerRef.current.appendChild(script);

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative border-2 border-primary rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, hsl(0 0% 5%) 0%, hsl(45 100% 51% / 0.08) 50%, hsl(0 0% 8%) 100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 border-b border-primary/30 rounded-t-2xl px-6 py-4 flex items-center justify-between" style={{ background: 'hsl(0 0% 6%)' }}>
          <h2 className="font-display text-xl md:text-2xl">
            <span className="text-foreground">PRIJAVA NA </span>
            <span className="text-primary">TURNIR</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={containerRef} className="p-4 md:p-6 min-h-[300px]" />
      </div>
    </div>
  );
};

export default FibaRegistrationModal;
