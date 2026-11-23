
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
const HeroSection = () =>
{
  const navigate = useNavigate();
  const { user } = useAuth();
  const username = user?.name ?? "";

  return (
    <section className="relative overflow-hidden">
      {/* Hero Banner Image */}
      <div className="relative w-full min-h-[80vh] flex items-center">
        <img
          loading="lazy"
          decoding="async"
          src={heroBanner}
          alt="Gokul Printers - Professional Printing Services"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-r from-primary/80 via-primary/50 to-transparent" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 py-16 text-center sm:text-left">
            <div className="max-w-xl sm:max-w-2xl">
              {username && (
                <p className="text-white text-2xl mb-4 font-medium">
                  Welcome, {username}!
                </p>
              )}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm text-white">
                <span className="flex h-2 w-2 rounded-full bg-accent"></span>
                Celebrating 30 Years of Printing Excellence
              </div>

              <h1 className="font-display text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Professional Printing
                <span className="block text-accent mt-2">
                  For Modern Business
                </span>
              </h1>

              <p
                className="mt-6 text-lg text-white/90 sm:text-xl animate-fade-up max-w-xl"
                style={{ animationDelay: "0.1s" }}
              >
                From business cards to large format banners, we deliver premium
                quality prints with fast turnaround. Upload your designs and
                order online.
              </p>

              <div
                className="mt-8 flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-4 animate-fade-up"
                style={{ animationDelay: "0.2s" }}
              >
                <Button
                  variant="accent"
                  size="xl"
                  onClick={() => navigate("/catalog")}
                >
                  Browse Catalog
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white/50 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm bg-white/15"
                  onClick={() => navigate("/customquote")}
                >
                  Get Custom Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
