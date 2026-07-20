import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSession } from "@/lib/actions/auth-actions";

export async function proxy(request: NextRequest) {
  const session = await getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profile"],
};
