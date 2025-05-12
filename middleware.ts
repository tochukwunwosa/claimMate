import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /**
     * Apply middleware to all routes EXCEPT:
     * - _next (Next.js internals)
     * - favicon, images, fonts, and other static assets
     * - ANY file in the public root (like robots.txt, sitemap.xml, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemap-\\d+\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
    "/dashboard/:path*",
    "/onboarding/:path*",
  ],
};

