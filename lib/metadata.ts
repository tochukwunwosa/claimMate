import { Metadata } from "next";

const siteUrl = "https://claimmate.vercel.app";
const defaultTitle = "ClaimMate – AI-Powered Insurance Claim Drafting";
const defaultDescription =
  "ClaimMate helps insurance professionals draft faster, more accurate claims with AI. Save time, ensure compliance, and reduce errors.";
const defaultOgImage = `${siteUrl}/opengraph-image.png`;

type PageMetadataProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
};

export function generateMeta({
  title = defaultTitle,
  description = defaultDescription,
  path = "",
  image,
}: PageMetadataProps = {}): Metadata {
  const baseTitle = "ClaimMate";
  const fullTitle = title === baseTitle ? baseTitle : `${baseTitle} – ${title}`;
  const fullUrl = `${siteUrl}${path}`;
  const resolvedImage = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image}`
    : defaultOgImage;


  return {
    title: fullTitle,
    description,
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
    authors: [{ name: "Tochukwu Nwosa" }],
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: baseTitle,
      images: [
        {
          url: resolvedImage,
          secureUrl: resolvedImage,
          width: 1200,
          height: 630,
          alt: "ClaimMate - AI powered drafting software",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      site: "@TochiObere",
    creator: "@TochiObere",
      images: [resolvedImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.ico",
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}


// use in page.tsx

// import { generateMeta } from '@/lib/metadata';

// export const metadata = generateMeta({
//   title: "Features",
//   description: "Explore ClaimMate's powerful features for insurance professionals.",
//   path: "/features",
//   image: "/images/feature-og-image.png", // optional
// });
