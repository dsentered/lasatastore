"use server"

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("better-auth.session_token");

    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    runtime: "nodejs", // Required for auth.api calls
    matcher: ["/dashboard"], // Specify the routes the middleware applies to
};