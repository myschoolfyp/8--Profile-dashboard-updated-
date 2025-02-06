import mongoose from 'mongoose';

// Define the Student schema
const StudentSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true }, // Primary key with unique constraint
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  class: { type: String, required: true },
  contact: { type: String, required: true },
  subjects: [{ type: String, required: true }], // Array of subjects
});

// Create the Student model
const Student = mongoose.model('Student', StudentSchema);

export default Student;
