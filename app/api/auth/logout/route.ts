import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
        response.cookies.delete('token');
        response.headers.set("userId", "");
        return response;
      } catch (error) {
        console.log("Error while logging out", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
      }
    
}