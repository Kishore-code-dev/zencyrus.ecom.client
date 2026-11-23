import
{
  Truck,
  Shield,
  Clock,
  Award,
} from "lucide-react";
import StatsBar from "@/components/Index/StatsBar";
import FeaturedProducts from "@/components/Index/FeaturedProducts";
import Features from "@/components/Index/Features";
import AbouUsSection from "@/components/Index/AbouUsSection";
import CtaSection from "@/components/Index/CtaSection";
// import { ProductCategoryCarousel } from "@/components/Index/ProductCategoryCarousel";
// import { FeaturedSlider } from "@/components/Index/FeaturedSlider";
import NavItem from "@/components/nav-item/nav-item";
import HeroCarousel from "@/components/Index/HeroCarousel";
import CategoryGrid from "@/components/Index/CategoryGrid";
import { Header } from "@/components/Headers/Header";

export const features = [
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Rush orders available with 24-48 hour delivery options.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "100% satisfaction guarantee on every print order.",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Complimentary shipping on orders over $500.",
  },
  {
    icon: Award,
    title: "B2B Pricing",
    description: "Volume discounts and dedicated account managers.",
  },
];

export default function Index()
{
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/** Mega Nav Item */}
      <NavItem />
      <HeroCarousel />
      <CategoryGrid />
      {/* Hero Section */}
      {/* <HeroSection /> */}

      {/* Stats */}
      <StatsBar />

      {/* Product Category Carousel */}
      {/* <ProductCategoryCarousel /> */}

      {/* Feature slider */}
      {/* <FeaturedSlider /> */}

      {/* About Us Section */}
      <AbouUsSection />

      {/* Featured product */}
      <FeaturedProducts />

      {/* CTA Section */}
      <CtaSection />

      {/* Popular Products */}
      <Features />
    </div>
  );
}