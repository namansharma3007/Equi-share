import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/utilities";

const boyProfilePic = process.env.USER_IMAGE_MALE_URL;
const girlProfilePic = process.env.USER_IMAGE_FEMALE_URL;

export async function POST(req: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
      gender,
    } = await req.json();
    if (
      !firstName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !gender
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    if(username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { message: "Username must be at least 3 and at most 20 characters long" },
        { status: 400 }
      );
    }
    
    const spacesRegex = /\s+/;
    if(spacesRegex.test(username)) {
      return NextResponse.json(
        { message: "Username cannot contain spaces" },
        { status: 400 }
      );
    }

    const userName = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (userName) {
      return NextResponse.json(
        { message: "Username already in use" },
        { status: 400 }
      );
    }

    const userEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userEmail) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const newHashedPassword = await hashPassword(password);
    await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        username,
        email,
        password: newHashedPassword,
        image:
          gender === "MALE"
            ? boyProfilePic + username
            : girlProfilePic + username,
        gender,
      },
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error signingup user:", error);

    return NextResponse.json(
      { message: "Internal server Error" },
      { status: 500 }
    );
  }
}
