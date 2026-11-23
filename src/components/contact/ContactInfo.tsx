import { Card } from '../ui/card'
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ContactInfo = ({ contactInfo }: any) =>
{
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5 flex gap-4">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Address</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {contactInfo.address}
            </p>
          </div>
        </Card>
        <Card className="p-5 flex gap-4">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Phone className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Phone</h3>
            {contactInfo.phones.map((p: any) => (
              <a
                key={p.number}
                href={`tel:${p.number.replace(/\s/g, "")}`}
                className="block text-xs text-muted-foreground mt-1 hover:text-accent transition-colors"
              >
                {p.label}: {p.number}
              </a>
            ))}
          </div>
        </Card>
        <Card className="p-5 flex gap-4">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-accent" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-sm">Email</h3>
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-xs text-muted-foreground mt-1 hover:text-accent transition-colors"
            >
              {contactInfo.email}
            </a>

            <a
              href={`mailto:$complaints.smp@gmail.com`}
              className="text-xs text-muted-foreground mt-1 hover:text-accent transition-colors"
            >
              complaints.smp@gmail.com
            </a>
          </div>
        </Card>
        <Card className="p-5 flex gap-4">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Business Hours</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {contactInfo.hours}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ContactInfo