import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Calendar, Clock } from "lucide-react";

interface ScheduleDay {
  day: string;
  date: string;
  events: string[];
}

const schedule: ScheduleDay[] = [
  {
    day: "Četvrtak",
    date: "16.7.2026.",
    events: [
      "Muški U-14 (2012. i mlađi)",
      "Ženske U-14 (2012. i mlađi)",
      "Muški U-16 (2010. i mlađi)",
      "Cure U-16 (2010. i mlađi)",
      "Amateri - Posuške Ekipe",
    ],
  },
  {
    day: "Petak",
    date: "17.7.2026.",
    events: [
      "Seniorke",
      "Juniori (U-19)",
    ],
  },
  {
    day: "Subota",
    date: "18.7.2026.",
    events: [
      "Seniori - Grupe",
    ],
  },
  {
    day: "Nedjelja",
    date: "19.7.2026.",
    events: [
      "Seniori - Play-Off",
    ],
  },
];

const Schedule = () => {
  const { elementRef, isVisible } = useScrollReveal();

  return (
    <section id="raspored" className="py-20">
      <div
        ref={elementRef}
        className={`container mx-auto px-4 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="section-title text-center mb-4">
          <span className="section-title-gold">RASPORED</span>
        </h2>

        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto text-sm md:text-base">
          Raspored turnira po danima i kategorijama
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {schedule.map((day, dayIndex) => (
            <div
              key={day.date}
              className="group bg-secondary/30 border border-border rounded-xl md:rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-all duration-300"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s ease ${dayIndex * 0.15}s`,
              }}
            >
              {/* Day Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 md:p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-all duration-300">
                  <Calendar className="text-primary w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl md:text-2xl text-foreground tracking-wide">
                    {day.day}
                  </h3>
                  <p className="text-primary text-sm md:text-base font-semibold">
                    {day.date}
                  </p>
                </div>
              </div>

              {/* Events */}
              <div className="space-y-3">
                {day.events.map((event, eventIndex) => (
                  <div
                    key={event}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/20 transition-all duration-300"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? "translateX(0)" : "translateX(-10px)",
                      transition: `all 0.4s ease ${dayIndex * 0.15 + eventIndex * 0.08}s`,
                    }}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm md:text-base text-foreground font-medium">
                      {event}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
