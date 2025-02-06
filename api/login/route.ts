import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const mongoUri = "mongodb://localhost:27017/myschool";

export async function POST(request: Request) {
  try {
    const { email, password, userType } = await request.json();

    if (!email || !password || !userType) {
      return NextResponse.json(
        { message: "Missing email, password, or userType" },
        { status: 400 }
      );
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db();
    let user;

    if (userType === "Admin") {
      user = await db.collection("admins").findOne({ email });
    } else if (userType === "Teacher") {
      user = await db.collection("teachers").findOne({ email });
    } else {
      return NextResponse.json({ message: "Invalid userType" }, { status: 400 });
    }
                         
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }

    // Return email and userType only
    return NextResponse.json(
      {
        message: "Login successful",
        email,
        userType,
      },
      { status: 200 }
    );
  } 
  
  catch (error) {
  
    console.error("Error logging in:");
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
