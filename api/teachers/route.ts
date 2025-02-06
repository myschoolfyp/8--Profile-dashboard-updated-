import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const mongoUri = "mongodb://localhost:27017/myschool";

export async function DELETE(req: Request) {
  const client = new MongoClient(mongoUri);

  try {
    const id = await req.json(); // Extract the MongoDB `_id` from the request body
    if (!id) {
      return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
    }

    await client.connect();
    const db = client.db();

    // Delete the student using the `_id`
    const result = await db.collection("students").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json({ message: "Failed to delete student" }, { status: 500 });
  } finally {
    await client.close();
  }
}
