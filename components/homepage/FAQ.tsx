"use client"

const faqs = [
  {
    question: "How accurate is the AI?",
    answer: "Our AI is trained on thousands of real insurance claims and industry standards. It achieves over 95% accuracy in formatting and content structure, while you maintain full control to review and edit before finalizing."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use enterprise-grade encryption and secure cloud storage. Your data is never shared or used for training. We comply with all relevant data protection regulations."
  },
  {
    question: "Can I edit claims before sending?",
    answer: "Absolutely! You have full control to review, edit, and customize any claim before finalizing. Our editor is intuitive and allows for quick modifications."
  }
]

export function FAQ() {
  return (
    <section className="py-24 px-4 w-full">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-8">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="text-xl font-semibold text-primary mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 