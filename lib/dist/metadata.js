"use strict";
exports.__esModule = true;
exports.generateMeta = void 0;
var siteUrl = 'https://claimmate.vercel.app';
var defaultTitle = 'ClaimMate – AI-Powered Insurance Claim Drafting';
var defaultDescription = 'ClaimMate helps insurance professionals draft faster, more accurate claims with AI. Save time, ensure compliance, and reduce errors.';
var ogImage = siteUrl + "/og-image.png";
function generateMeta(_a) {
    var _b = _a.title, title = _b === void 0 ? defaultTitle : _b, _c = _a.description, description = _c === void 0 ? defaultDescription : _c, _d = _a.path, path = _d === void 0 ? '' : _d, _e = _a.image, image = _e === void 0 ? ogImage : _e;
    var url = "" + siteUrl + path;
    return {
        title: title,
        description: description,
        keywords: [
            'ClaimMate',
            'insurance claims software',
            'AI claims assistant',
            'claims drafting tool',
            'insurance adjuster tools',
            'automated claim writing',
            'property damage estimate',
            'insurance SaaS',
            'claim report automation',
            'AI insurance platform',
            'AI-powered claims software',
            'digital insurance tools',
            'automated insurance workflows',
            'claims management system',
            'property claims automation',
            'home insurance claim tool',
            'insurance reporting software',
            'AI for insurance adjusters',
            'smart claims processing',
            'AI claims documentation',
            'AI property inspection',
            'cloud-based insurance software',
            'claims workflow automation',
            'insurance technology platform',
            'AI tools for insurance professionals'
        ],
        openGraph: {
            title: title,
            description: description,
            url: url,
            siteName: 'ClaimMate',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: 'ClaimMate Preview'
                },
            ],
            type: 'website'
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [image]
        },
        metadataBase: new URL(siteUrl)
    };
}
exports.generateMeta = generateMeta;
// useage in each page.tsx file:
// import { generateMeta } from "@/lib/metadata";
// export const metadata = generateMeta({
//   title: "About – ClaimMate",
//   description:
//     "Learn more about ClaimMate and our mission to simplify insurance claim drafting.",
//   path: "/about-us",
// });
