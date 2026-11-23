import { Settings, Upload, Package, CreditCard, MoveRight, MoveDown } from 'lucide-react'

const AbouUsSection = () =>
{
  return (
    <div>
      <section className="py-5">
        <div className="container mx-auto px-4 lg:px-18 space-y-5">
          <div className="grid gap-12 lg:grid-cols-1 items-center">
            {/* About Content */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent font-medium">
                First in Tamil Nadu - 10 Color Offset Machine
              </div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                About Shree Maruthi Printers
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Shree Maruthi Printers is an exclusive factory for printers and
                DTP operators across various cities and states throughout India.
                Our products range from business cards, envelopes, letterheads,
                manuals and similar office stationery items to flyers,
                brochures, posters, stickers and similar marketing materials.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We are one of the fastest commercial offset printers in the
                heart of Coimbatore City. We are passionate about finest, most
                cost-effective and timely printing service and promotional items
                available anywhere in the country.
              </p>
              <p className="mt-4 text-sm text-muted-foreground italic border-l-4 border-accent pl-4">
                This website is exclusively for printers and designers who have
                knowledge in offset printing. Others kindly visit nearby
                printers for their printing needs.
              </p>

              {/* Achievement Stats */}
              <div className="mt-8 grid grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-card border border-border">
                  <p className="font-display text-2xl font-bold text-accent">
                    30+
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Years Experience
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-card border border-border">
                  <p className="font-display text-2xl font-bold text-accent">
                    14
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    National Awards
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-card border border-border">
                  <p className="font-display text-2xl font-bold text-accent">
                    #1
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Short Run Offset
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* How It Works */}
          <div className="bg-card rounded-2xl border border-border p-8 shadow-soft">
            <h3 className="font-display text-xl font-bold mb-6">
              4 Easy Steps to Print Online
            </h3>
            <div className="space-y-6 grid md:grid-cols-4">
              <div className="flex flex-row items-center-safe p-2.5 gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold">1. Configure Product</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose your desired print product, size, paper type, and
                    quantity.
                  </p>
                </div>
                <MoveRight className='md:block hidden min-h-6 min-w-6' />
                <MoveDown className='md:hidden block min-h-6 min-w-6' />
              </div>
              <div className="flex flex-row items-center-safe p-2.5 gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold">2. Select Files</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload the files you want us to print with ease.
                  </p>
                </div>
                <MoveRight className='md:block hidden min-h-6 min-w-6' />
                <MoveDown className='md:hidden block min-h-6 min-w-6' />
              </div>
              <div className="flex flex-row items-center-safe p-2.5 gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold">3. Make a Payment</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete your order with our secure payment options.
                  </p>
                </div>
                <MoveRight className='md:block hidden min-h-6 min-w-6' />
                <MoveDown className='md:hidden block min-h-6 min-w-6' />
              </div>
              <div className="flex flex-row items-center-safe p-2.5 gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold">4. Receive the Products</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get your prints delivered right to your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AbouUsSection