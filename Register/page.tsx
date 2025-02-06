"use client";
import { useState } from "react";
import { User } from "lucide-react"; // Using the updated empty profile icon

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [userType, setUserType] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
      setProfilePicturePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);

    try {
      const formData = {
        firstName,
        lastName,
        email,
        password,
        userType,
        contactNumber,
        employeeCode,
        adminCode,
        profilePicture, // Profile picture data
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register user.");
      }

      alert("Registration successful!");

      // Reset form fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUserType("");
      setContactNumber("");
      setEmployeeCode("");
      setAdminCode("");
      setProfilePicture(null);
      setProfilePicturePreview(null);
    } catch (error) {
      console.error("Registration error:", error);
      setError("User Already Exists or another issue occurred.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {/* Reduced container size */}
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-[#0F6466] w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-center text-[#0F6466] mb-5">Register</h2>

        {/* Profile Picture Upload */}
        <div className="flex justify-center items-center mb-5">
          <label htmlFor="profilePicture" className="cursor-pointer">
            {profilePicturePreview ? (
              <img
                src={profilePicturePreview}
                alt="Profile Preview"
                className="w-20 h-20 object-cover rounded-full border-2 border-gray-300"
              />
            ) : (
              <User size={60} className="text-gray-400" />
            )}
          </label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            onChange={handleProfilePictureUpload}
            className="hidden"
          />
        </div>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First and Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              id="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-base"
            />
            <input
              type="text"
              id="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-base"
            />
          </div>

          <input
            type="email"
            id="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-base"
          />

          {/* Passwords */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-base"
            />
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-base"
            />
          </div>

          {/* User Type and Contact */}
          <div className="grid grid-cols-2 gap-3">
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-base"
            >
              <option value="" disabled>
                Select User Type
              </option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
            <input
              type="text"
              id="contactNumber"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-base"
            />
          </div>

          {/* Conditionally show code fields */}
          {userType === "Teacher" && (
            <input
              type="text"
              id="employeeCode"
              placeholder="Employee Code"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-base"
            />
          )}

          {userType === "Admin" && (
            <input
              type="text"
              id="adminCode"
              placeholder="Admin Code"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-base"
            />
          )}

          <button
            type="submit"
            className="w-full py-2 bg-[#0F6466] text-white rounded-md shadow hover:bg-[#2C3532] transition-colors duration-200 text-base font-semibold"
          >
            Register
          </button>

          <div className="text-center mt-3 text-base">
            Already have an account?{" "}
            <a href="Login#" className="text-[#0F6466]">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
