// import FeaturedProducts from "@/components/Index/FeaturedProducts";
// import CtaSection from "@/components/Index/CtaSection";
import StatsBar from "@/components/Index/StatsBar";
import Features from "@/components/Index/Features";
import AbouUsSection from "@/components/Index/AbouUsSection";
import HeroCarousel from "@/components/Index/HeroCarousel";
// import CategoryGrid from "@/components/Index/CategoryGrid";
import { Separator } from "@/components/ui/separator";
import FlashPanel from "@/components/Index/FlashPanel";
// import CategoryWithoutGrid from "@/components/Index/CategoryWithoutGrid";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <FlashPanel />
      <HeroCarousel />
      {/* <CategoryGrid /> */}
      {/* <CategoryWithoutGrid /> */}
      {/* Hero Section */}
      {/* <HeroSection /> */}
      {/* Stats */}
      <StatsBar />
      {/* About Us Section */}
      <AbouUsSection />

      {/* Featured product */}
      {/* <FeaturedProducts /> */}

      {/* CTA Section */}
      {/* <CtaSection /> */}
      <Separator />

      {/* Popular Products */}
      <Features />
    </div>
  );
}
