import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Rutas que requieren autenticación
  const isPrivateRoute = pathname === "/" || 
                        pathname.startsWith("/asociados") || 
                        pathname.startsWith("/usuarios") || 
                        pathname.startsWith("/campanas");
  
  const publicRoutes = ["/login"];

  // Redirigir a login si no hay token en ruta privada
  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirigir a home si ya hay token en ruta pública
  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/asociados/:path*", "/usuarios/:path*", "/campanas/:path*", "/login", "/register"],
};