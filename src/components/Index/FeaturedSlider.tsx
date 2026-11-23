import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import
{
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

import hospitalFilesImg from "@/assets/hospital-files.jpg";
import syntheticCardsImg from "@/assets/synthetic-cards.jpg";
import walletPaymentImg from "@/assets/wallet-payment.jpg";
import weddingInvitationsImg from "@/assets/wedding-invitations.jpg";
import calendarMountsImg from "@/assets/calendar-mounts.jpg";

import slideBgHospital from "@/assets/slide-bg-hospital.jpg";
import slideBgCards from "@/assets/slide-bg-cards.jpg";
import slideBgWedding from "@/assets/slide-bg-wedding.jpg";
import slideBgCalendar from "@/assets/slide-bg-calendar.jpg";
import slideBgWallet from "@/assets/slide-bg-wallet.jpg";

const slides = [
  {
    id: 1,
    title: "Hospital Files",
    subtitle: "Customised finishing",
    features: [
      "Patient details pocket",
      "Report paper filing clips",
      "Multiple color options",
    ],
    image: hospitalFilesImg,
    bgImage: slideBgHospital,
    gradient: "from-teal-800/85 to-teal-900/70",
    cta: "Order Now",
    link: "/catalog",
  },
  {
    id: 2,
    title: "Synthetic Cards",
    subtitle: "Non-tearable & Durable",
    features: ["Superior UV ink", "Branded 180 microns", "Water resistant"],
    image: syntheticCardsImg,
    bgImage: slideBgCards,
    gradient: "from-orange-800/85 to-orange-900/70",
    cta: "Explore Cards",
    link: "/catalog",
  },
  {
    id: 3,
    title: "Wedding Invitations",
    subtitle: "Elegant & Premium",
    features: [
      "Gold foil printing",
      "Thick premium paper",
      "Custom floral designs",
    ],
    image: weddingInvitationsImg,
    bgImage: slideBgWedding,
    gradient: "from-rose-800/85 to-pink-900/70",
    cta: "Design Now",
    link: "/catalog",
  },
  {
    id: 4,
    title: "Calendar Mounts",
    subtitle: "Year-round Branding",
    features: ["Spiral binding", "Full-color printing", "Custom layouts"],
    image: calendarMountsImg,
    bgImage: slideBgCalendar,
    gradient: "from-sky-800/85 to-blue-900/70",
    cta: "Order Calendars",
    link: "/catalog",
  },
  {
    id: 5,
    title: "Wallet System",
    subtitle: "24/7 Instant Approval",
    features: [
      "Scan dynamic QR code",
      "Instant wallet top-up",
      "Track all transactions",
    ],
    image: walletPaymentImg,
    bgImage: slideBgWallet,
    gradient: "from-emerald-800/85 to-teal-900/70",
    cta: "Add Money",
    link: "/wallet",
  },
];

export function FeaturedSlider()
{
  const navigate = useNavigate();
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <Carousel
          plugins={[plugin.current]}
          opts={{ loop: true }}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="relative rounded-2xl overflow-hidden min-h-[280px] sm:min-h-[320px]">
                  {/* Background Image */}
                  <img
                    loading="lazy"
                    decoding="async"
                    src={slide.bgImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}
                  />

                  <div className="relative p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-32 h-32 sm:w-44 sm:h-44 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm shadow-strong">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                      <p className="text-white/80 text-sm font-medium mb-2">
                        {slide.subtitle}
                      </p>
                      <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                        {slide.title}
                      </h3>
                      <ul className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                        {slide.features.map((feature) => (
                          <li
                            key={feature}
                            className="text-sm text-white/90 bg-white/10 px-3 py-1 rounded-full"
                          >
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant="default"
                        size="lg"
                        onClick={() => navigate(slide.link)}
                        className="shadow-strong"
                      >
                        {slide.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex left-4" />
          <CarouselNext className="hidden md:flex right-4" />
        </Carousel>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-muted-foreground/30"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
