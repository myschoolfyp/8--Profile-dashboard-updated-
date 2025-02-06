"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userType: category }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        setError(message || "Error logging in");
        return;
      }

      const { email: userEmail, userType, firstName, lastName, contactNumber } = await response.json();
      alert("Login successful!");

      localStorage.setItem("email", userEmail);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      localStorage.setItem("contactNumber", contactNumber);

      router.push(`/Profile?userType=${userType}`);
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-[550px] border-2 border-[#0F6466]">
        <h2 className="text-2xl font-bold text-center text-[#0F6466] mb-4">Welcome Back</h2>
  
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}
  
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="role" className="block text-base font-medium text-gray-700">Select Your Role</label>
            <select
              id="role"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-[#0F6466] transition-all duration-200"
            >
              <option value="" disabled>Select Your Role</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
  
          <div>
            <label htmlFor="email" className="block text-base font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-[#0F6466] transition-all duration-200"
            />
          </div>
  
          <div>
            <label htmlFor="password" className="block text-base font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-[#0F6466] transition-all duration-200"
            />
          </div>
  
          <button
            type="submit"
            className="w-full py-2 bg-[#0F6466] text-white rounded-md shadow hover:bg-[#2C3532] transition-colors duration-200 text-base font-semibold"
          >
            Login
          </button>
  
          <div className="text-center mt-3 text-base">
            Don't have an account?{" "}
            <a href="Register#" className="text-[#0F6466]">Register</a>
          </div>
        </form>
      </div>
    </div>
  );
  
}
