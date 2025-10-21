import { type NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// --- CORS CONFIGURATION ---
const raw = process.env.ALLOWED_ORIGINS?.trim() || "http://localhost:3000";
const allowedOrigins = new Set(raw.split(",").map((s) => s.trim()));

const DEFAULT_METHODS = ["GET", "POST", "OPTIONS"].join(", ");
const DEFAULT_HEADERS = [
  "Content-Type",
  "X-Requested-With",
  "x-api-key",
  "Authorization",
].join(", ");

function decideOrigin(origin?: string | null) {
  if (!origin) return null;
  return allowedOrigins.has(origin) ? origin : null;
}

function withCors(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("origin");
  const allowOrigin = decideOrigin(origin);

  // 🚫 If origin exists but is not allowed
  if (origin && !allowOrigin) {
    console.warn(`❌ Blocked CORS request from origin: ${origin}`);
    return new NextResponse(JSON.stringify({ error: "Origin not allowed" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ✅ If origin allowed, attach headers
  if (allowOrigin) {
    res.headers.set("Access-Control-Allow-Origin", allowOrigin);
    res.headers.set("Vary", "Origin");
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Methods", DEFAULT_METHODS);
    res.headers.set("Access-Control-Allow-Headers", DEFAULT_HEADERS);
    res.headers.set("Access-Control-Max-Age", "600");
    res.headers.set(
      "Access-Control-Expose-Headers",
      ["Retry-After", "X-RateLimit-Limit", "X-RateLimit-Remaining"].join(",")
    );
  }

  return res;
}

// --- CLERK PROTECTED ROUTES ---
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
  "/api/protected(.*)",
]);

// --- FIXED COMBINED MIDDLEWARE (Clerk v6+ + CORS) ---
export default clerkMiddleware(async (auth, req) => {
  // ✅ Handle CORS preflight
  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    return withCors(req, res);
  }

  // ✅ Protect sensitive routes
  if (isProtectedRoute(req)) {
    await auth.protect(); // Correct call for Clerk v6+
  }

  // ✅ Continue request and apply CORS
  const res = NextResponse.next();
  return withCors(req, res);
});

// --- CONFIG ---
// ✅ Combined matcher from both versions
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API and trpc routes
    "/(api|trpc)(.*)",
  ],
};
