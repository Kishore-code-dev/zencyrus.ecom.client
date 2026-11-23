import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const FeaturedProducts = () =>
{
  const navigate = useNavigate();
  return (
    <section className="bg-secondary/30 py-5">
      <div className="container mx-auto px-4 lg:px-18">
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold">
              Popular Products
            </h2>
            <p className="mt-2 text-muted-foreground">
              Our most ordered printing solutions for businesses
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/catalog")}>
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))} */}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
