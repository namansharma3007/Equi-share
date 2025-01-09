import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const userID = req.headers.get("userId");

    if (!userID) {
      return NextResponse.json(
        { message: "User not found! User not authenticated" },
        { status: 404 }
      );
    }

    const userData = await prisma.user.findFirst({
      where: {
        id: userID,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        group: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            expenses: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                amount: true,
                paidByUser: true,
                payerUser: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    gender: true,
                  },
                },
                cleared: true,
                splits: {
                  select: {
                    id: true,
                    amountOwed: true,
                    userId: true,
                    cleared: true,
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        gender: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Data fetched successfully",
        userData,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error occurred while fetching user data", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
