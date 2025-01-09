import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { searchTerm, groupId } = await req.json();


    const availableMembers = await prisma.user.findMany({
      where: {
        AND: [
          {
            group: {
              none: { id: groupId },
            },
          },
          {
            OR: [
              {
                name: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
              {
                username: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      },
    });

    return NextResponse.json(availableMembers, { status: 200 });
    
  } catch (error) {
    console.log("Error while searching for members: ", error);
    return NextResponse.json(
      { error: "Internal server Error" },
      { status: 500 }
    );
  }
}
