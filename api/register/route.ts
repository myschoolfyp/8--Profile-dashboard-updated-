import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";
import Teacher from "@/models/Teacher";

export async function POST(req: Request) {
  console.log("🔹 Received a POST request to /api/register");

  try {
    await dbConnect(); // ✅ Ensure MongoDB connection
    console.log("✅ MongoDB connected successfully");

    // Parse the request body
    const body = await req.json();
    console.log("🔹 Raw request body:", body);

    const {
      firstName,
      lastName,
      email,
      password,
      userType,
      contactNumber,
      employeeCode,
      adminCode,
      profilePicture,
    } = body;

    // ✅ Log received data for debugging
    console.log("🔹 Parsed registration data:", {
      firstName,
      lastName,
      email,
      password: "[HIDDEN]", // Avoid logging sensitive data
      userType,
      contactNumber,
      employeeCode,
      adminCode,
      profilePicture: profilePicture ? "[BASE64 IMAGE RECEIVED]" : "❌ No Image",
    });

    // ✅ Validate required fields
    if (!firstName || !lastName || !email || !password || !userType || !contactNumber) {
      console.error("❌ Missing required fields:", {
        firstName,
        lastName,
        email,
        password: password ? "[HIDDEN]" : "❌ Missing",
        userType,
        contactNumber,
      });

      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Map user types to their respective models
    const userModels: { [key: string]: any } = { Admin, Teacher };
    const UserModel = userModels[userType];

    // ✅ Check if user type is valid
    if (!UserModel) {
      console.error("❌ Invalid user type:", userType);
      return NextResponse.json(
        { success: false, message: "Invalid user type. Allowed: Admin, Teacher." },
        { status: 400 }
      );
    }

    // ✅ Check if the email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.error("❌ User already exists with email:", email);
      return NextResponse.json(
        { success: false, message: "User already exists." },
        { status: 400 }
      );
    }

    // ✅ Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user object (Ensure `profilePicture` is saved)
    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contactNumber, // Ensure correct field name
      employeeCode: userType === "Teacher" ? employeeCode : undefined,
      adminCode: userType === "Admin" ? adminCode : undefined,
      profilePicture, // ✅ Save base64 image string
    });

    // ✅ Log the new user object before saving
    console.log("🔹 Saving new user:", newUser);

    // ✅ Save to MongoDB
    await newUser.save();

    // ✅ Log success message
    console.log("✅ User registered successfully:", newUser);

    // ✅ Send response back
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully!",
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("❌ Server error during registration:", error.message || error);
    return NextResponse.json(
      { success: false, message: "Server Error: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
