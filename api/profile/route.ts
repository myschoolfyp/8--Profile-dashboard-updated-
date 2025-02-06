import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const mongoUri = "mongodb://localhost:27017/myschool";

export async function GET(request: Request) {
  try {
    const emailHeader = request.headers.get("email"); // Renamed to emailHeader
    const userType = request.headers.get("userType");

    if (!emailHeader || !userType) {
      return NextResponse.json(
        { message: "Missing email or userType" },
        { status: 400 }
      );
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db();
    let user;

    if (userType === "Admin") {
      user = await db.collection("admins").findOne({ email: emailHeader });
    } else if (userType === "Teacher") {
      user = await db.collection("teachers").findOne({ email: emailHeader });
    } else if (userType === "Student") {
      user = await db.collection("students").findOne({ email: emailHeader });
    } else {
      return NextResponse.json(
        { message: "Invalid userType" },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { firstName, lastName, email: userEmail, contactNumber, profilePicture } = user; // Renamed userEmail
    return NextResponse.json({ firstName, lastName, email: userEmail, contactNumber, profilePicture, userType });
  } catch (error: unknown) {
    console.error("Error fetching profile:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { message: "Internal server error", error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
