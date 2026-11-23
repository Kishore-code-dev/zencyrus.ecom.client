
import { Card } from '../ui/card'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface ContactFormProps
{
  handleSubmit: (e: React.FormEvent) => void;
  form: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      phone: string;
      message: string;
    }>
  >;
  isSubmitting: boolean;
  openWhatsApp: () => void;
}

const Contactform: React.FC<ContactFormProps> = ({
  handleSubmit,
  form,
  setForm,
  isSubmitting,
  openWhatsApp,
}) =>
{
  return (
    <div>
      <Card className="p-8">
        <h2 className="font-display text-2xl font-bold mb-2">Write Us</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Jot us a note and we'll get back to you as quickly as possible.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">What's on your mind? *</Label>
            <Textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              placeholder="Tell us about your printing requirements..."
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={openWhatsApp}
              className="gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default Contactform