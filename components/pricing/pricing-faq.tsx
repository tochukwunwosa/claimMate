import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { faqs } from "@/const/pricing"
import { motion, AnimatePresence } from "framer-motion"

export function PricingFAQ() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-6">
      <AnimatePresence>
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.question + faq.answer}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <AccordionItem
              value={`item-${index}`}
            >
              <AccordionTrigger >{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </AnimatePresence>
    </Accordion>
  )
}
