import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");
    
  } catch (error) {
    console.log("Error occured while updating user", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
