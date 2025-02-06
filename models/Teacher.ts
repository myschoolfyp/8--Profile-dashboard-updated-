import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true }, // Ensure this is present
  employeeCode: { type: String, required: true },
  profilePicture: { type: String }, // Store base64 image or URL
});

export default mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
