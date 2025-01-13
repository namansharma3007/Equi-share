import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const otpsecretkey = process.env.OTP_SECRET;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Email not found",
        },
        { status: 404 }
      );
    }

    const otpHashed = await prisma.oTP.findFirst({
      where: { userId: user.id },
    });

    if (!otpsecretkey) {
      throw new Error("OTP_SECRET is not defined in environment variables");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Set expiry time to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes in milliseconds

    if(otpHashed){
      await prisma.oTP.update({
        where: {id: otpHashed.id},
        data: {
          otp: hashedOtp,
          expiresAt: expiresAt,
        }
      })
    } else {
      await prisma.oTP.create({
        data: {
          userId: user.id,
          otp: hashedOtp,
          expiresAt: expiresAt,
        },
      });
    }


    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send mail with defined transport object
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for equi-share",
      text: `Your OTP is ${otp} for equi-share. Your OTP is only valid for 7 minutes`,
    };

    await transporter.sendMail(mailOptions);

    const response = NextResponse.json(
      {
        message: "OTP sent to your email! Please check",
      },
      { status: 200 }
    );

    const otpToken = jwt.sign({ userId: user.id }, otpsecretkey, {
      expiresIn: "10m", // 10 minutes
    });

    response.cookies.set("otpToken", otpToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60 * 1000, // 10 minutes in milliseconds,
    });

    return response;
  } catch (error) {
    console.log("Error while implementing OTP generation", error);
    return NextResponse.json(
      {
        message: "Internal server error! Please try again later",
      },
      { status: 500 }
    );
  }
}
