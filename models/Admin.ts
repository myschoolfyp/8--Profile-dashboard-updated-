import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  adminCode: { type: String, required: true },
  contactNumber: { type: String, required: true },
  profilePicture: { type: String }, // Add profilePicture field
});

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
