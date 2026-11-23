import { useState } from "react";
import { Card } from "@/components/ui/card";
import ContactCards from "@/components/Index/ContactCards";
import HeroSection from "@/components/contact/HeroSection";
import Contactform from "@/components/contact/Contactform";
import ContactInfo from "@/components/contact/ContactInfo";

const contactInfo = {
  company: "SHREE MARUTHI PRINTERS",
  address:
    "427-A Bharathiyar Road, Opp. Womens Polytechnic, New Sidhapudur, Coimbatore - 641 044, Tamil Nadu, India",
  phones: [
    { label: "Main Office", number: "+91 422 4229800" },
    { label: "Online Customer Helpline (Tamil Nadu)", number: "+91 73589 92255" },
  ],
  whatsapp: "+917358992255",
  email: "complaints.smp@gmail.com",
  hours: "10:00 AM – 6:00 PM (Lunch: 1:30 PM – 2:30 PM)",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.123456789!2d76.97648!3d11.017114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8584d7875eb23%3A0x7c3290cc5fef749!2sSHREE%20MARUTHI%20PRINTERS!5e0!3m2!1sen!2sin!4v1700000000000",
  // Department-wise contacts from the "Important Email IDs & Contact Numbers" panel
  departments: [
    {
      title: "Online Customer Helpline",
      numbers: [
        "7358992255 & 7397739633 (Tamil Nadu)",
        "8220118444 (Kerala)",
        "7397132333 & 7397739833 (Other States)",
      ],
    },
    {
      title: "For Any Issues",
      email: "complaints.smp@gmail.com",
    },
    {
      title: "Visiting Cards Jobs",
      email: "jobstosmp@gmail.com",
      numbers: ["0422-4229825 & 4229833"],
    },
    {
      title: "Other Jobs",
      email: "jobstosmp@gmail.com",
      numbers: ["0422-4229818 & 4229833"],
    },
    {
      title: "Quotation of Jobs",
      numbers: ["0422-4229827", "8870006761", "9430046761", "9952566366"],
    },
    {
      title: "Accounts",
      numbers: ["0422-4229802 to 4229804", "9790007888", "8220016761"],
    },
    {
      title: "Local Dispatch",
      numbers: ["0422-4229809"],
    },
    {
      title: "Out Station Dispatch",
      numbers: ["9952406761", "0422-4229814 & 4229815"],
    },
  ],
};

export default function Contact()
{
  const [isSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = () =>
  {
  };

  const openWhatsApp = () =>
  {
    window.open(
      `https://wa.me/${contactInfo.whatsapp}?text=Hi, I have a query about printing services.`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <HeroSection />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <Contactform
              handleSubmit={handleSubmit}
              form={form}
              setForm={setForm}
              isSubmitting={isSubmitting}
              openWhatsApp={openWhatsApp}
            />

            {/* Contact Info & Map */}
            <div className="space-y-8">
              {/* Info Cards */}
              <ContactInfo contactInfo={contactInfo} />

              {/* Google Map */}
              <Card className="overflow-hidden p-0">
                <iframe
                  src={contactInfo.mapEmbedUrl}
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Gokul Printers Location"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>
      <div className="flex p-5">
        <ContactCards />
      </div>
    </div>
  );
}
