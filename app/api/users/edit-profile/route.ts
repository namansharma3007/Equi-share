import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// Define the Gender enum (assuming it's defined in your Prisma schema)
enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

// Define the type for the update object
type UpdateObject = {
  firstName?: string;
  lastName?: string;
  username?: string;
  gender?: Gender; // Use the Gender enum type
  email?: string;
  image?: string;
};


const boyProfilePic = process.env.USER_IMAGE_MALE_URL;
const girlProfilePic = process.env.USER_IMAGE_FEMALE_URL;

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");

    const { firstName, lastName, username, gender, email } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 400 }
      );
    }

    // Check if username is already in use by another user
    if (username) {
      const userWithUsername = await prisma.user.findUnique({
        where: { username: username },
      });

      if (userWithUsername && userWithUsername.id !== userId) {
        return NextResponse.json(
          { message: "Username already in use" },
          { status: 400 }
        );
      }
    }

    // Check if email is already in use by another user
    if (email) {
      const userWithEmail = await prisma.user.findUnique({
        where: { email: email },
      });

      if (userWithEmail && userWithEmail.id !== userId) {
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Create the update object
    const updateObject: UpdateObject = {};
    if (firstName) updateObject.firstName = firstName;
    if (lastName) updateObject.lastName = lastName;
    if (username) updateObject.username = username;
    if (gender) updateObject.gender = gender as Gender; // Cast to Gender enum type
    if (email) updateObject.email = email;

    // Fetch the current user data
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if the updateObject matches the current user data
    let isDataUnchanged = true;
    for (const key in updateObject) {
      if (
        updateObject[key as keyof UpdateObject] !==
        currentUser[key as keyof typeof currentUser]
      ) {
        isDataUnchanged = false;
        break;
      }
    }

    if(updateObject.username || updateObject.gender){
      if(updateObject.gender && updateObject.username){
        if(updateObject.username !== currentUser.username){
          if(gender === "MALE"){
            updateObject.image = boyProfilePic + updateObject.username;
          } else {
            updateObject.image = girlProfilePic + updateObject.username;
          }
        }
      } else if(updateObject.username){
        updateObject.image = (gender === "MALE") ? boyProfilePic + updateObject.username : girlProfilePic + updateObject.username;
      } else {
        updateObject.image = (gender === "MALE") ? boyProfilePic + currentUser.username : girlProfilePic + currentUser.username;
      }
    }

    if (isDataUnchanged) {
      return NextResponse.json(
        { message: "No changes have been made" },
        { status: 400 }
      );
    }

    // Update the user in the database
    await prisma.user.update({
      where: { id: userId },
      data: updateObject,
    });

    return NextResponse.json(
      {
        message: "Profile updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error occurred while updating user", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}