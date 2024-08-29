export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/account"], // Apply this middleware only to the "/account" route
};

// =============================================================================================================

/* 
import { NextResponse } from "next/server";

export function middleware(request) {
  //   console.log(request);

  return NextResponse.redirect(new URL("/about", request.url));
}

export const config = {
  matcher: ["/account", "/cabins"],
};
*/
