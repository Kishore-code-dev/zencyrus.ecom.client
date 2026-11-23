import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { api } from "@/config/api";
import type { CmsHeroBanner } from "@/types/cms-hero-banner";
import { AxiosError } from "axios";
import { useApiAction } from "@/hooks/use-api-action";
import { useTheme } from "@/hooks/use-theme";
import HeroSection from "@/components/Index/HeroSection";

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [items, setItems] = useState<CmsHeroBanner[]>([]);
  const { apiActionAsync } = useApiAction();
  const { theme } = useTheme(); // "light" | "dark"
  const isDark = theme === "dark";

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => setCurrent(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const response = await api.get(`cmsherobanner/getall`);

        if (response.status === 200) {
          setItems(response.data || []);
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          await apiActionAsync(error.response);
        }
      }
    };

    fetchCarousel();
  }, []);

  if (items.length === 0) {
    return <HeroSection />;
  }

  return (
    <section className="relative overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {items?.map((slide, index) => {
            const textColor = isDark
              ? slide.textColorDark
              : slide.textColorLight;
            const bgColor =
              (isDark
                ? slide.backgroundColorDark
                : slide.backgroundColorLight) ||
              (isDark ? "#000000" : "#000000");

            return (
              <div
                key={index}
                className="relative min-h-125 md:min-h-150 flex items-center flex-[0_0_100%]"
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-fill"
                />

                {/* Dynamic overlay, theme-aware base color */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to right, ${bgColor}D9, ${bgColor}99, ${bgColor}4D)`,
                  }}
                />

                <div className="container relative z-10 p-16">
                  <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {slide.badge && (
                      <Badge
                        className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium mb-4 backdrop-blur-sm"
                        style={{ color: textColor }}
                      >
                        {slide.badge}
                      </Badge>
                    )}
                    {slide.title && (
                      <h1
                        className="text-4xl md:text-6xl font-bold mb-4 font-display"
                        style={{ color: textColor }}
                      >
                        {slide.title}
                      </h1>
                    )}
                    {slide.description && (
                      <p
                        className="text-lg mb-8 font-sans opacity-80"
                        style={{ color: textColor }}
                      >
                        {slide.description}
                      </p>
                    )}
                    {/* {`${Boolean(slide.badgeNavigationUrl)}`}
                    {`${Boolean(slide.badgeText)}`} */}
                    {slide.cta == "none" &&
                    Boolean(slide.badgeText) &&
                    Boolean(slide.badgeNavigationUrl) ? (
                      <Button
                        asChild
                        className="rounded-lg px-8 py-3 text-sm font-semibold shadow-lg hover:scale-105 transition-transform"
                      >
                        <a
                          href={slide.badgeNavigationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {slide.badgeText}
                        </a>
                      </Button>
                    ) : (
                      slide.cta != "none" && (
                        <Button
                          asChild
                          className="rounded-lg px-8 py-3 text-sm font-semibold shadow-lg hover:scale-105 transition-transform"
                        >
                          <Link to="/catalog">{slide.cta}</Link>
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prev / Next */}
      <Button
        variant="outline"
        size="icon"
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card border-none shadow-md"
      >
        <ChevronLeft className="h-5 w-5 text-foreground" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card border-none shadow-md"
      >
        <ChevronRight className="h-5 w-5 text-foreground" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-primary" : "w-2 bg-card/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
