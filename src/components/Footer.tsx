import { Link } from "react-router";


const year = new Date().getFullYear()

export function Footer()
{
  return (
    <footer className="border-t border-border bg-card overflow-hidden">
      <div className="container mx-auto px-4 py-12 lg:px-18">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                loading="lazy"
                decoding="async"
                src="/images/logo.svg"
                alt="Gokul Printers"
                className="size-32 object-contain"
              />
              <div>
                <h3 className="font-display text-lg font-bold">
                  Gokul Printers
                </h3>
                <p className="text-xs text-muted-foreground">
                  B2B Printing Solutions
                </p>
              </div>
            </div>
            <p className="w-full text-sm text-muted-foreground">
              30+ years. 14 national awards. 10,000+ printers served across India.
            </p>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Our Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:text-foreground transition-colors"
                >
                  Customer service
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/privacypolicy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/termsandconditions"
                  className="hover:text-foreground transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li> */}
              <li>
                <Link
                  to="/returncancellationpolicy"
                  className="hover:text-foreground transition-colors"
                >
                  Return & Cancellation
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/account/delete"
                  className="hover:text-foreground transition-colors"
                >
                  Account Delete
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          {/* <div className="space-y-4">
            <h4 className="font-display font-semibold">Products</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-foreground transition-colors"
                >
                  Visiting Cards
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-foreground transition-colors"
                >
                  Brochures
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-foreground transition-colors"
                >
                  Banners & Signage
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-foreground transition-colors"
                >
                  Custom Packaging
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Contact</h4>
            <ul className="space-y-3 w-full text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                {/* <Mail className="text-accent" /> */}
                <a
                  href="mailto:info@gokulprinters.com"
                  className="hover:text-foreground transition-colors"
                >
                  info@gokulprinters.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                {/* <Phone className="text-accent" /> */}
                <a
                  href="tel:+914224229800"
                  className="hover:text-foreground transition-colors"
                >
                  +91 422 4229800
                </a>
              </li>
              <li className="flex items-start gap-2">
                {/* <MapPin className="text-accent" /> */}
                <span>
                  427-A, Bharathiyar Rd, Siddhapudur
                  <br />
                  Coimbatore, Tamil Nadu 641044
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {year} Gokul Printers. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link
              to="/privacypolicy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link to="/termsandconditions" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
