
import { Button } from '../ui/button'
import { CheckCircle } from 'lucide-react'
import { useNavigate } from "react-router";

const CtaSection = () =>
{
  const navigate = useNavigate();
  return (
    <div>
      <section className="py-5 bg-secondary">
        <div className="container mx-auto px-4 lg:px-18">
          <div className="rounded-2xl hero-gradient p-8 sm:p-12 lg:p-16 text-center shadow-strong">
            <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
              Ready to Elevate Your Brand?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-primary/80">
              Join thousands of businesses who trust Gokul Printers for
              their printing needs. Sign up today and get 15% off your first
              order.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="default"
                size="lg"
                onClick={() => navigate("/auth/register")}
              >
                Create Free Account
              </Button>
              <div className="flex items-center gap-2 text-sm text-primary/70">
                <CheckCircle className="h-4 w-4" />
                No credit card required
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CtaSection