import { useNavigate } from 'react-router';
import
{
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import businessCardsImg from '../../assets/business-cards.jpg';
import flyersImg from '../../assets/flyers.jpg';
import letterheadsImg from '../../assets/booklets.jpg';
import postersImg from '../../assets/posters.jpg';
import envelopesImg from '../../assets/envelopes.jpg';
import labelsImg from '../../assets/labels.jpg';
import bookletsImg from '../../assets/booklets.jpg';

const categories = [
  { name: 'Visiting Card', image: businessCardsImg, link: '/catalog' },
  { name: 'Flyers', image: flyersImg, link: '/catalog' },
  { name: 'Letterheads', image: letterheadsImg, link: '/catalog' },
  { name: 'Envelopes', image: envelopesImg, link: '/catalog' },
  { name: 'Stickers', image: labelsImg, link: '/catalog' },
  { name: 'Posters', image: postersImg, link: '/catalog' },
  { name: 'Brochure', image: bookletsImg, link: '/catalog' },
];

export function ProductCategoryCarousel()
{
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {categories.map((category) => (
              <CarouselItem
                key={category.name}
                className="pl-2 md:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/7"
              >
                <button
                  onClick={() => navigate(category.link)}
                  className="group flex flex-col items-center gap-3 w-full"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-accent/20 group-hover:border-accent transition-colors shadow-soft group-hover:shadow-medium">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-sm font-medium text-center group-hover:text-accent transition-colors">
                    {category.name}
                  </span>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-2" />
          <CarouselNext className="hidden sm:flex -right-2" />
        </Carousel>
      </div>
    </section>
  );
}
