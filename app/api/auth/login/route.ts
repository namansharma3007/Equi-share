import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { emailusername, password } = await req.json();

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: emailusername }, { email: emailusername }],
      },
      select: {
        id: true,
        password: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        image: true,
        gender: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Username or email not found" },
        {
          status: 404,
        }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 }
      );
    }
    const secretKey = process.env.JWT_SECRET as string;

    if (!secretKey) {
      console.error("JWT_SECRET is not defined in environment variables");
      return NextResponse.json(
        { message: "Internal server Error" },
        { status: 500 }
      );
    }

    const token = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: process.env.EXPIRY_TIME,
    });

    const userReturn = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      image: user.image,
      gender: user.gender,
      createdAt: user.createdAt,
    };

    const response = NextResponse.json(
      { message: "Login successful", userId: user.id },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60
    });

    return response;
  } catch (error) {
    console.log("Error logging in:", error);
    return NextResponse.json(
      { message: "Internal server Error" },
      { status: 500 }
    );
  }
}
