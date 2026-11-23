

const stats = [
  { value: '10K+', label: 'Business Clients' },
  { value: '500K+', label: 'Orders Completed' },
  { value: '99.8%', label: 'On-Time Delivery' },
  { value: '24/7', label: 'Support Available' },
];


const StatsBar = () =>
{
  return (
    <section className="border-b border-border bg-card py-8">
      <div className="container mx-auto px-4 lg:px-18">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-bold text-accent">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsBar