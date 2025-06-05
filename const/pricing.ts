import { Clock, Zap, Shield, Award, FileCheck, Users, LucideIcon } from "lucide-react"

interface ROI {
  claims: number
  hoursPerClaim: number
  hourlyRate: number
  monthlySavings: number
}

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Faq {
  question: string;
  answer: string;
}

interface Testimonial {
  content: string
  author: {
    name: string
    role: string
    company: string
    avatar?: string
  }
}


export const rois: ROI[] = [
  {
    claims: 5,
    hoursPerClaim: 5,
    hourlyRate: 50,
    monthlySavings: 1000
  },
  {
    claims: 5,
    hoursPerClaim: 5,
    hourlyRate: 50,
    monthlySavings: 1000
  },
  {
    claims: 5,
    hoursPerClaim: 5,
    hourlyRate: 50,
    monthlySavings: 1000
  }
]

export const benefits: Benefit[] = [
  {
    icon: Clock,
    title: "Save 5+ Hours Weekly",
    description: "Automate repetitive tasks and focus on what matters - serving your clients."
  },
  {
    icon: FileCheck,
    title: "Close Claims Faster",
    description: "Process claims up to 3x faster with AI-powered drafting and smart templates."
  },
  {
    icon: Award,
    title: "Boost Your Revenue",
    description: "Handle more claims without hiring additional staff. Grow your business efficiently."
  }
]

export const faqs: Faq[] = [
  {
    question: "How does the 7-day free trial work?",
    answer: "Start with full access to all Professional plan features for 7 days. No credit card required during the trial. You'll only be charged if you decide to continue after the trial ends."
  },
  {
    question: "What happens after my trial ends?",
    answer: "You'll be prompted to select a plan and enter payment details to continue using ClaimMate. We'll send you a reminder email 3 days before your trial expires so you can make an informed decision."
  },
  {
    question: "Can I change plans later?",
    answer: "Yes! Upgrade or downgrade anytime. When upgrading, you'll get immediate access to new features and be charged the prorated difference. When downgrading, changes take effect at your next billing cycle."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee. If you're not completely satisfied, contact our support team within 30 days of purchase for a full refund, no questions asked."
  },
  {
    question: "Is there a limit on the number of claims?",
    answer: "The Starter plan includes up to 50 claims per month. Professional and Enterprise plans include unlimited claims. All plans include our full AI-powered drafting capabilities."
  },
  {
    question: "Can I use ClaimMate with my team?",
    answer: "Yes! The Professional plan includes up to 3 team members, while Enterprise supports unlimited team members with advanced collaboration features and role-based permissions."
  },
  {
    question: "What kind of support do you offer?",
    answer: "All plans include support, but response times vary. Starter gets email support (48h response), Professional includes priority support (24h), and Enterprise comes with dedicated support (4h SLA) and training."
  },
  {
    question: "Do you offer custom features for large teams?",
    answer: "Yes! Our Enterprise plan includes custom template development, dedicated account management, and integration support. Contact our sales team to discuss your specific needs."
  }
]

export const testimonials: Testimonial[] = [
  {
    content:
      "This platform has completely transformed how our team collaborates. The pricing is transparent and the value is undeniable.",
    author: {
      name: "Sarah Johnson",
      role: "CTO",
      company: "TechNova",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    content:
      "After trying several competitors, we found this solution to be the most comprehensive and cost-effective for our growing business.",
    author: {
      name: "Michael Chen",
      role: "Product Manager",
      company: "GrowthWave",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    content:
      "The features included in the Pro plan have paid for themselves many times over. Highly recommended for any serious business.",
    author: {
      name: "Jessica Williams",
      role: "Operations Director",
      company: "Elevate Inc",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]
