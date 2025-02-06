import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const mongoUri = "mongodb://localhost:27017/myschool";

// POST function to add a new student
export async function POST(request: Request) {
  let client: MongoClient | null = null;
  try {
    const student = await request.json();
    const { id, name, class: className, contact, subjects } = student;

    if (!id || !name || !className || !contact || !subjects) {
      return NextResponse.json(
        { message: "Missing required fields: id, name, class, contact, subjects", error: true },
        { status: 400 }
      );
    }

    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db();

    const existingStudent = await db.collection("students").findOne({ id });

    if (existingStudent) {
      return NextResponse.json({ exists: true }, { status: 200 });
    }

    const newStudent = {
      id,
      name,
      class: className,
      contact,
      subjects: subjects.split(",").map((subject: string) => subject.trim()),
    };

    const result = await db.collection("students").insertOne(newStudent);

    if (result.insertedId) {
      return NextResponse.json(
        { message: "Student added successfully", student: newStudent, error: false },
        { status: 201 }
      );
    } else {
      throw new Error("Failed to add student to the database");
    }
  } catch (error: any) {
    console.error("Error in POST /api/students:", error.message || error);
    return NextResponse.json(
      { message: "Internal server error: " + (error.message || "Unknown error"), error: true },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// GET function to retrieve students
export async function GET() {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(mongoUri);
    await client.connect();

    const db = client.db();
    const students = await db.collection("students").find().toArray();

    return NextResponse.json(students, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/students:", error.message || error);
    return NextResponse.json(
      { message: "Internal server error: " + error.message, error: true },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// DELETE function to delete a student by MongoDB `_id`
export async function DELETE(request: Request) {
  let client: MongoClient | null = null;
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Student ID is required", error: true },
        { status: 400 }
      );
    }

    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db();

    const result = await db.collection("students").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Student not found", error: true },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student deleted successfully", error: false },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in DELETE /api/students:", error.message || error);
    return NextResponse.json(
      { message: "Internal server error: " + error.message, error: true },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// PUT function to update student details
export async function PUT(request: Request) {
  let client: MongoClient | null = null;
  try {
    const { id, name, class: className, contact, subjects } = await request.json();

    if (!id || !name || !className || !contact || !subjects) {
      return NextResponse.json(
        { message: "Missing required fields: id, name, class, contact, subjects", error: true },
        { status: 400 }
      );
    }

    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db();

    const updateResult = await db.collection("students").updateOne(
      { id }, // Match by unique `id` field
      {
        $set: {
          name,
          class: className,
          contact,
          subjects: subjects.split(",").map((subject: string) => subject.trim()),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { message: "Student not found", error: true },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student updated successfully", error: false },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PUT /api/students:", error.message || error);
    return NextResponse.json(
      { message: "Internal server error: " + (error.message || "Unknown error"), error: true },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
