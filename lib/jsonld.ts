export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClaimMate",
  url: "https://claimmate.vercel.app",
  image: "https://claimmate.vercel.app/og-image.png",
  description:
    "ClaimMate is an AI-powered SaaS platform that helps insurance agents and adjusters draft accurate, compliant insurance claims faster and more efficiently.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free waitlist access during beta launch",
  },
  author: {
    "@type": "Organization",
    name: "ClaimMate",
  },
};
