import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';
import { JwtPayload } from "jsonwebtoken";


export async function verifyToken(token: string) {
  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET as string);
  try {
    const {payload} = await jwtVerify(token, secretKey)
    return payload;
  } catch (error) {
    console.error("Error while verifying token", error);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const tokelAll = req.cookies.get("token");
  const token = tokelAll?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Authorization token required" },
      { status: 401 }
    );
  }

  const decoded = await verifyToken(token);

  
  if (!decoded) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
  const decodedValue = decoded as JwtPayload;
  const userId = decodedValue.userId

  const response = NextResponse.next();
  response.headers.set("userId", userId);
  return response;
}

export const config = {
  matcher: ["/api/group/:path*", "/api/users/:path*", "/api/testing/:path*"],
  // matcher: ["/api/group/:path*", "/api/users/:path*"],
};


