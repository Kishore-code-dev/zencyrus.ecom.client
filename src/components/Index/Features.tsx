import
{
  Truck,
  Shield,
  Clock,
  Award,
} from "lucide-react";
const features = [
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
    title: "Preferred Shipping",
    description: "Choose your own delivery partner.",
  },
  {
    icon: Award,
    title: "B2B Pricing",
    description: "Volume discounts and dedicated account managers.",
  },
];

const Features = () =>
{
  return (
    <section className="py-5">
      <div className="container mx-auto px-4 lg:px-18">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
