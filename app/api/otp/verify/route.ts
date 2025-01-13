import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

const otpsecretkey = process.env.OTP_SECRET;

export async function POST(req: NextRequest) {
  try {
    const { otp } = await req.json();

    if (!otp) {
      return NextResponse.json(
        {
          message: "OTP is required",
        },
        { status: 400 }
      );
    }

    const otpToken = req.cookies.get("otpToken");

    if (!otpToken) {
      throw new Error("OTP_TOKEN is not defined in cookies");
    }

    if (!otpsecretkey) {
      throw new Error("OTP_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(otpToken.value, otpsecretkey);

    if (!decoded) {
      return NextResponse.json(
        {
          message: "OTP expired! Please request a new OTP",
        },
        { status: 404 }
      );
    }

    const decodedData = decoded as JwtPayload;

    const otpRecord = await prisma.oTP.findFirst({
      where: { userId: decodedData.userId },
    });

    if (!otpRecord) {
      return NextResponse.json(
        {
          message: "OTP not found! Please request a new OTP",
        },
        { status: 404 }
      );
    }

    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json(
        {
          message: "OTP expired! Please request a new OTP",
        },
        { status: 404 }
      );
    }

    const isOtpValid = bcrypt.compare(otp, otpRecord.otp);

    if (!isOtpValid) {
      return NextResponse.json(
        {
          message: "Invalid OTP! Please retry",
        },
        { status: 404 }
      );
    }

    await prisma.oTP.delete({
      where: { id: otpRecord.id },
    });

    const response = NextResponse.json(
      {
        message: "OTP verified successfully",
        verified: true,
      },
      { status: 200 }
    );

    response.cookies.delete("otpToken");

    const changePasswordSessionToken = jwt.sign(
      { userId: decodedData.userId },
      otpsecretkey,
      {
        expiresIn: "20m", // 20 minutes
      }
    );

    response.cookies.set(
      "changePasswordSessionToken",
      changePasswordSessionToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 20 * 60 * 1000, // 20 minutes in milliseconds
      }
    );

    return response;
  } catch (error) {
    console.log("Error while verifying OTP: ", error);
    return NextResponse.json(
      {
        message: "Internal server error!",
      },
      { status: 500 }
    );
  }
}
