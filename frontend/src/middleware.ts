import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token");

    const protectedRoutes = [
        "/Admin-Portal",
        "/Doctors",
        "/Receptionist",
    ];

    if (
        protectedRoutes.some((route) =>
            req.nextUrl.pathname.startsWith(route)
        ) &&
        !token
    ) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/Admin-Portal/:path*",
        "/Doctors/:path*",
        "/Receptionist/:path*",
    ],
};
