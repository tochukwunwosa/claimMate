'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var ErrorBoundary_1 = require("@/components/ErrorBoundary");
var framer_motion_1 = require("framer-motion");
var script_1 = require("next/script");
var navbar_1 = require("@/components/navbar");
var footer_1 = require("@/components/footer");
require("./globals.css");
var google_1 = require("next/font/google");
var navigation_1 = require("next/navigation");
var jsonld_1 = require("@/lib/jsonld");
var UserContext_1 = require("@/contexts/UserContext");
var sonner_1 = require("sonner");
var inter = google_1.Inter({ subsets: ['latin'] });
function RootLayoutClient(_a) {
    var children = _a.children;
    var pathname = navigation_1.usePathname();
    var hideHeaderFooter = ((pathname.startsWith("/auth/") && pathname !== "/auth") ||
        (pathname.startsWith("/dashboard")) || (pathname.startsWith('/onboarding')));
    return (react_1["default"].createElement("html", { lang: "en", suppressHydrationWarning: true },
        react_1["default"].createElement("head", null,
            react_1["default"].createElement(script_1["default"], { async: true, defer: true, src: "https://cloud.umami.is/script.js", "data-website-id": process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID }),
            react_1["default"].createElement("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonld_1.jsonLd) } })),
        react_1["default"].createElement("body", { className: inter.className + " scroll-smooth snap-y snap-mandatory transition-colors duration-300 ease-in-out" },
            react_1["default"].createElement(ErrorBoundary_1["default"], null,
                !hideHeaderFooter && react_1["default"].createElement(navbar_1.Navbar, null),
                react_1["default"].createElement(framer_motion_1.AnimatePresence, null,
                    react_1["default"].createElement(UserContext_1.UserProvider, null,
                        react_1["default"].createElement(sonner_1.Toaster, { richColors: true }),
                        children)),
                !hideHeaderFooter && react_1["default"].createElement(footer_1.Footer, null)))));
}
exports["default"] = RootLayoutClient;
