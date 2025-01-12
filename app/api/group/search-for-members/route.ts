import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { searchTerm, groupId, skip = 0 } = await req.json();

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
                firstName: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
              {
                lastName: {
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
      take: 5, // Limit the results to the first 5 names
      skip: skip, // Skip the first 'skip' results
    });

    return NextResponse.json(availableMembers, { status: 200 });
    
  } catch (error) {
    console.log("Error while searching for members: ", error);
    return NextResponse.json(
      { message: "Internal server Error" },
      { status: 500 }
    );
  }
}
