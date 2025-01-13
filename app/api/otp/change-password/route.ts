import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { hashPassword } from "@/lib/utilities";

const otpsecretkey = process.env.OTP_SECRET;

export async function PATCH(req: NextRequest) {
  try {
    const { password, confirmPassword } = await req.json();

    const response = NextResponse.json({
        message: "Password changed successfully",
        changed: true
    }, {
        status: 200
    })

    response.cookies.delete("token");
    response.cookies.delete("otpToken");

    if (!password || !confirmPassword) {
      return NextResponse.json(
        {
          message: "Please provide password and new password",
        },
        {
          status: 400,
        }
      );
    }

    if(password.length < 6 || confirmPassword.length < 6){
        return NextResponse.json(
            {
              message: "Password must be at least 6 characters long",
            },
            {
              status: 400,
            }
          );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          message: "Passwords are not matching",
        },
        {
          status: 400,
        }
      );
    }

    const changePasswordSessionCookie = req.cookies.get(
      "changePasswordSessionToken"
    );

    if (!changePasswordSessionCookie) {
      throw new Error("No changePasswordSessionToken cookie found");
    }

    if (!otpsecretkey) {
      throw new Error("OTP_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(changePasswordSessionCookie.value, otpsecretkey);

    if (!decoded) {
      return NextResponse.json(
        {
          message: "Session expired! Please request a new OTP",
        },
        { status: 404 }
      );
    }

    const decodedData = decoded as JwtPayload;

    const userId = decodedData.userId;

    const newHashedPassword = await hashPassword(password);
    

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            password: newHashedPassword
        }
    })

    
    response.cookies.delete("changePasswordSessionToken");

    return response;

  } catch (error) {
    console.log("Error while changing password", error);
    return NextResponse.json(
      {
        message: "Internal server error!",
      },
      {
        status: 500,
      }
    );
  }
}
