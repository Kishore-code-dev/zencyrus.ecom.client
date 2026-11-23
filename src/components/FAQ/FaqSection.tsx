import { Card } from '../ui/card'
import
{
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqSection = ({ faqSections }: any) =>
{
  return (
    <div>
      <section className="pb-16">
        <div className="container mx-auto px-4 space-y-8">
          {faqSections.map((section: any) => (
            <Card key={section.title} className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <section.icon className="h-5 w-5 text-accent" />
                </div>
                <h2 className="font-display text-xl font-bold">
                  {section.title}
                </h2>
              </div>
              <Accordion type="multiple" className="w-full">
                {section.faqs.map((faq: any, idx: any) => (
                  <AccordionItem key={idx} value={`${section.title}-${idx}`}>
                    <AccordionTrigger className="text-left text-sm sm:text-base">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default FaqSection