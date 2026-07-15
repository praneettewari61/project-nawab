import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Guards the couple's private admin area with HTTP Basic Auth. Credentials come
 * from the ADMIN_USER / ADMIN_PASSWORD environment variables (set in Vercel →
 * Project → Settings → Environment Variables).
 *
 * In Next.js 16 the former `middleware.ts` convention is named `proxy.ts`.
 */
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

// Header values must be Latin-1 (ByteString) — keep this ASCII-only.
const REALM = 'Basic realm="Varnit and Akshita Admin", charset="UTF-8"';

function challenge() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": REALM },
  });
}

/** Decode a base64 Basic-auth payload as UTF-8 (works in any runtime). */
function decodeBase64(value: string): string {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Length-checked constant-time-ish comparison to avoid trivial timing leaks. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function proxy(request: NextRequest) {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  // Fail closed if credentials haven't been configured.
  if (!expectedUser || !expectedPassword) {
    return new NextResponse(
      "Admin access is not configured. Set ADMIN_USER and ADMIN_PASSWORD.",
      { status: 503 },
    );
  }

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    const decoded = decodeBase64(header.slice("Basic ".length));
    const separator = decoded.indexOf(":");
    if (separator !== -1) {
      const user = decoded.slice(0, separator);
      const password = decoded.slice(separator + 1);
      if (safeEqual(user, expectedUser) && safeEqual(password, expectedPassword)) {
        return NextResponse.next();
      }
    }
  }

  return challenge();
}
