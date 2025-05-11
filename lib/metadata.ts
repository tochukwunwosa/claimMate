const siteUrl = "https://claimmate.vercel.app";
const defaultTitle = "ClaimMate – AI-Powered Insurance Claim Drafting";
const defaultDescription =
  "ClaimMate helps insurance professionals draft faster, more accurate claims with AI. Save time, ensure compliance, and reduce errors.";
const ogImage = `${siteUrl}/og-image.png`;

export function generateMeta({
  title = defaultTitle,
  description = defaultDescription,
  path = "",
  image = ogImage,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}) {
  const url = `${siteUrl}${path}`;
  const canonicalUrl = url; // Canonical URL is generally the full page URL

  return {
    title,
    description,
    other: {
      "google-site-verification": "google020903c422c1dbcd",
      canonical: canonicalUrl,
    },
    keywords: [
      "ClaimMate",
      "insurance claims software",
      "AI claims assistant",
      "claims drafting tool",
      "insurance adjuster tools",
      "automated claim writing",
      "property damage estimate",
      "insurance SaaS",
      "claim report automation",
      "AI insurance platform",
      "AI-powered claims software",
      "digital insurance tools",
      "automated insurance workflows",
      "claims management system",
      "property claims automation",
      "home insurance claim tool",
      "insurance reporting software",
      "AI for insurance adjusters",
      "smart claims processing",
      "AI claims documentation",
      "AI property inspection",
      "cloud-based insurance software",
      "claims workflow automation",
      "insurance technology platform",
      "AI tools for insurance professionals",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: "ClaimMate",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "ClaimMate Preview",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    metadataBase: new URL(siteUrl),
  };
}

// useage in each page.tsx file:
// import { generateMeta } from "@/lib/metadata";

// export const metadata = generateMeta({
//   title: "About – ClaimMate",
//   description:
//     "Learn more about ClaimMate and our mission to simplify insurance claim drafting.",
//   path: "/about-us",
// });
