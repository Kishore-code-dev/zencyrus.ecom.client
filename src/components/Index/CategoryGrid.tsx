import { Link } from "react-router";
import { useEffect, useState, useTransition } from "react";
import { useApiAction } from "@/hooks/use-api-action";
import { AxiosError } from "axios";
import { api } from "@/config/api";
import { Card } from "../ui/card";
import
{
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { ImageOptionItem } from "@/types/common";

interface CategoryGrid
{
  id: string;
  productType: string;
  productImage: string;
}

const CategoryGrid = () =>
{
  const [items, setItems] = useState<ImageOptionItem[]>([]);
  const [_, startTransition] = useTransition();
  const { apiActionAsync } = useApiAction();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>(); // 1. capture the carousel api

  useEffect(() =>
  {
    startTransition(async () =>
    {
      try
      {
        const response = await api.get(`producttype/getall`);
        if (response.status == 200 && response.data)
        {
          setItems(response.data || []);
        }
      } catch (error)
      {
        if (error instanceof AxiosError && error.response)
        {
          await apiActionAsync(error.response);
        }
      }
    });
  }, []);

  // 2. Auto-scroll using the carousel api
  useEffect(() =>
  {
    if (!carouselApi) return;

    const slideTimeout = setInterval(() =>
    {
      if (carouselApi.canScrollNext())
      {
        carouselApi.scrollNext();
      } else
      {
        carouselApi.scrollTo(0); // loop back to start
      }
    }, 2500);

    return () => clearInterval(slideTimeout);
  }, [carouselApi]); // depend on carouselApi, not items

  return (
    <section className="bg-gradient-warm w-full">
      <div className="h-fit w-full p-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display mb-2">
            Our Products
          </h2>
          <p className="text-muted-foreground font-sans">
            Premium offset printing for every need
          </p>
        </div>
        <Carousel
          setApi={setCarouselApi} // 3. pass setApi to get the carousel api instance
          opts={{
            align: "start",
            loop: true, // 4. enable native loop so scrollNext() wraps automatically
          }}
        >
          <CarouselContent className="w-full">
            {items.map((item) => (
              <CarouselItem key={item.value} className="basis-3xs">
                <Link to={`/catalog?label=${item.description}&value=${item.value}`}>
                  <Card className="group relative w-full md:size-48 flex flex-col items-center rounded-xl bg-linear-to-br border border-border p-0 transition-all hover:shadow-card-hover hover:-translate-y-1">
                    <div className="size-full flex items-center justify-center overflow-hidden rounded-md">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={item.label}
                        alt={item.description}
                        className="h-full w-full object-contain transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute top-0 left-0 hidden group-hover:grid rounded-md h-full w-full bg-primary/50">
                      <span className="m-auto text-sm dark:text-primary-foreground font-semibold text-white">
                        {item.description}
                      </span>
                    </div>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryGrid;