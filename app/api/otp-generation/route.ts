import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");
    const { email } = await req.json();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 8);

    const { data, error } = await resend.emails.send({
      from: `naman@localhost.example.com`,
      to: [email],
      subject: "Your OTP for equi-share",
      react: EmailTemplate({ email, otp }),
    });

    if(error){
      console.log(error)
      return NextResponse.json(
        {
          message: "Cannot sent email! Internal server error",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "OTP sent to your email! Please check",
        otp,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while implementing forget password", error);
    return NextResponse.json(
      {
        message: "Internal server error! Please try again later",
      },
      { status: 500 }
    );
  }
}

