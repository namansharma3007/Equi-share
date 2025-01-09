import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const response = NextResponse.json({ message: 'Logged out successfully' });
        response.cookies.set('token', '', {
          httpOnly: true,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 0,
        });
        response.headers.set("userId", "");
        return response;
      } catch (error) {
        console.log("Error while logging out", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
      }
    
}