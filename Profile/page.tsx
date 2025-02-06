"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Profile() {
  const searchParams = useSearchParams();
  const router = useRouter();


  const [showProfile, setShowProfile] = useState(true);
  const [userType, setUserType] = useState<string | null> (null);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    profilePicture: string;
    userType: string;
  } | null>(null);

  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [teachersData, setTeachersData] = useState<any[]>([]);
  const [adminsData, setAdminsData] = useState<any[]>([]);
 
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [deleteSearchTerm, setDeleteSearchTerm] = useState("");
  const [filteredDeleteUsers, setFilteredDeleteUsers] = useState(studentsData);

  const [newStudent, setNewStudent] = useState({
    id: "",
    name: "",
    class: "",
    contact: "",
    subjects: "",
  });


  const [isUpdatePopupVisible, setIsUpdatePopupVisible] = useState(false);
  const [updateSearchTerm, setUpdateSearchTerm] = useState("");
  const [studentToUpdate, setStudentToUpdate] = useState<any>(null);

  const handleUpdateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setUpdateSearchTerm(searchValue);
    if (searchValue === "") {
      setStudentToUpdate(null);
    } else {
      const foundStudent = studentsData.find(
        (student) => String(student.id).toLowerCase() === searchValue
      );
      setStudentToUpdate(foundStudent || null);
    }
  };

  const [error, setError] = useState("");
  const [activeData, setActiveData] = useState<"students" | "teachers" | "admins" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTableVisible, setIsTableVisible] = useState<{ [key: string]: boolean }>({
    students: false,
    teachers: false,
    admins: false,
  });
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    const userTypeParam = searchParams.get("userType");
    const email = localStorage.getItem("email");
    if (userTypeParam && email) {
      setUserType(userTypeParam);
      fetchUserData(email, userTypeParam);
      fetchStudentsData();
    } else {
      setError("Login First to Enter Profile Dashboard");
    }
  }, [searchParams]);

  const fetchUserData = async (email: string, userType: string) => {
    try {
      const response = await fetch("/api/profile", {
        headers: { email, userType },
      });
      const data = await response.json();
      if (data.message) {
        setError(data.message);
      } else {
        setUserData(data);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to fetch user details");
    }
  };
  
  const fetchStudentsData = async () => {
    try {
      const response = await fetch("/api/students");
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch students data");
      setStudentsData(data);
    } catch (err) {
      console.error(err);
      setError("An unknown error occurred");
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddStudent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      const data = await response.json();
      const errorElement = document.getElementById("student-error");
      if (data.exists && errorElement) {
        errorElement.innerText = "Student ID already exists";
        return;
      }
      if (errorElement) {
        errorElement.innerText = "";
      }
      setStudentsData((prevStudents) => [...prevStudents, data.student]);
      alert("Student added successfully!");
      setNewStudent({ id: "", name: "", class: "", contact: "", subjects: "" });
      setIsFormVisible(false);
    } catch (err) {
      const errorElement = document.getElementById("student-error");
      if (errorElement) {
        errorElement.innerText = "An unknown error occurred while adding the student.";
      }
    }
  };

  const handleUpdateStudent = async () => {
    if (!studentToUpdate) return;
    try {
      const response = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: studentToUpdate.id,
          name: studentToUpdate.name,
          class: studentToUpdate.class,
          contact: studentToUpdate.contact,
          subjects: studentToUpdate.subjects.join(", "),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to update the student.");
        return;
      }
      alert("Student updated successfully!");
      setStudentsData((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentToUpdate.id ? studentToUpdate : student
        )
      );
      setIsUpdatePopupVisible(false);
      setUpdateSearchTerm("");
      setStudentToUpdate(null);
    } catch (err) {
      console.error("Error updating student:", err);
      alert("An error occurred while updating the student.");
    }
  };

  const handleDeleteSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setDeleteSearchTerm(searchValue);
    if (searchValue === "") {
      setFilteredDeleteUsers([]);
    } else {
      const filtered = studentsData.filter(
        (student) =>
          student.id &&
          String(student.id).toLowerCase().includes(searchValue)
      );
      setFilteredDeleteUsers(filtered);
    }
  };

  const handleDeleteAll = () => {
    setIsDeletePopupVisible(true);
  };

  const confirmDelete = async () => {
    if (!deleteSearchTerm) {
      alert("Please enter a roll number to delete.");
      return;
    }
    const studentToDelete = studentsData.find(
      (student) => String(student.id) === deleteSearchTerm
    );
    if (!studentToDelete) {
      alert("Student not found with this roll number.");
      return;
    }
    const confirmMessage = `Are you sure you want to delete this student?`;
    if (!confirm(confirmMessage)) {
      return;
    }
    try {
      const response = await fetch("/api/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: studentToDelete._id }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Student deleted successfully!");
        setStudentsData((prev) =>
          prev.filter((student) => student._id !== studentToDelete._id)
        );
        setDeleteSearchTerm("");
        setFilteredDeleteUsers([]);
      } else {
        alert(data.message || "Failed to delete student.");
      }
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("An error occurred while deleting the student.");
    }
  };

  const deleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) {
      return;
    }
    try {
      const response = await fetch("/api/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Student deleted successfully!");
        setStudentsData((prevStudents) =>
          prevStudents.filter((student) => student._id !== id)
        );
      } else {
        alert(data.message || "Failed to delete student.");
      }
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("An error occurred while deleting the student.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTableVisibility = (type: "students" | "teachers" | "admins") => {
    setIsTableVisible((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleMenuClick = (dataType: "students" | "teachers" | "admins") => {
    setActiveData(dataType);
    setIsTableVisible({ students: false, teachers: false, admins: false });
    toggleTableVisibility(dataType);
  };

  // Declare filteredStudents before using it for sorting.
  const filteredStudents = studentsData.filter(
    (student) =>
      student &&
      student.id &&
      String(student.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort(
    (a, b) => Number(a.id) - Number(b.id)
  );

  const handleLogout = () => {
    localStorage.removeItem("email");
    router.push("/Login");
  };

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }
  if (!userData) {
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar Navigation */}
      {isMenuVisible && (
        <nav className="fixed inset-y-0 left-0 w-64 bg-white text-[#0F6466] shadow-xl flex flex-col justify-between">
          <div>
            <div className="py-6 text-center font-bold text-2xl border-b border-[#0F6466]">
              Dashboard
            </div>
            <div className="flex flex-col space-y-5 p-6">
              <button
                className="py-3 px-5 rounded-lg bg-[#0F6466] text-white font-medium hover:bg-[#0D4B4C] transition duration-200 shadow-md"
                onClick={() => handleMenuClick("students")}
              >
                Students
              </button>
            </div>
          </div>
          <div className="p-6">
            <button
              className="w-full py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition duration-200 shadow-md"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={`flex-grow p-8 transition-all duration-300 ${isMenuVisible ? "ml-64" : "ml-0"}`}>
        {/* Profile Section with integrated Sidebar Toggle and Action Button */}
        <section className="mb-12 p-8 rounded-xl shadow-lg bg-white border border-[#0F6466]">
          {/* Top row: Sidebar Toggle and Edit Profile Button */}
          <div className="flex justify-between items-center mb-6">

            <button
              className="flex items-center justify-center w-10 h-10 bg-[#0F6466] text-white rounded-full shadow-lg transition duration-200 hover:bg-[#0D4B4C]"
              onClick={() => setIsMenuVisible(!isMenuVisible)}
              title="Toggle Sidebar"
            >
              {isMenuVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" 
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" 
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <button 
              className="py-3 px-6 rounded-lg bg-[#0F6466] text-white font-medium hover:bg-[#0D4B4C] transition duration-200 shadow-md"
              onClick={() => router.push("/Editprofile")}
            >
              Edit Profile
            </button>
          </div>
          

          {/* Profile Details */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {userData?.profilePicture && (
                <img
                  src={userData.profilePicture}
                  alt="Profile"
                  className="w-40 h-40 rounded-full border-4 border-[#0F6466] shadow-xl"
                />
              )}
            </div>
            {/* User Details */}
            <div className="flex flex-col space-y-4 w-full">
              <h2 className="text-3xl font-bold text-[#0F6466]">
                {userData.firstName} {userData.lastName}
              </h2>
              <p className="mt-2 text-lg text-gray-700">{userData.email}</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold text-[#0F6466]">Contact Number:</span> {userData.contactNumber}
                  </p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold text-[#0F6466]">User Type:</span> {userData.userType}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of the Dashboard Content (e.g., Students List) */}
        {!activeData && (
          <h2 className="text-center text-5xl font-bold text-[#0F6466] mt-10">
            School Management Dashboard
          </h2>
        )}

        {activeData === "students" && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-semibold text-[#0F6466]">Students List</h3>
              <button
                onClick={() => toggleTableVisibility("students")}
                className="flex items-center justify-center w-10 h-10 bg-[#0F6466] text-white rounded-full shadow-md transition duration-200 hover:bg-[#0D4B4C] focus:outline-none"
                title="Toggle Table"
              >
                {isTableVisible.students ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" 
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" 
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
            </div>
            {isTableVisible.students && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearch}
                      placeholder="Search by ID..."
                      className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0F6466] w-64"
                    />
                    {userType !== "Teacher" && (
                      <button
                        className="py-3 px-6 rounded-lg bg-[#0F6466] text-white font-medium hover:bg-[#0D4B4C] transition duration-200 shadow-md"
                        onClick={() => setIsFormVisible(true)}
                      >
                        Add New
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    {userType !== "Teacher" && (
                      <button
                        className="py-3 px-8 rounded-lg bg-[#0F6466] text-white font-medium hover:bg-[#0D4B4C] transition duration-200 shadow-md"
                        onClick={() => setIsUpdatePopupVisible(true)}
                      >
                        Update
                      </button>
                    )}
                    {userType !== "Teacher" && (
                      <button
                        className="py-3 px-8 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition duration-200 shadow-md"
                        onClick={handleDeleteAll}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto shadow-lg rounded-lg">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-[#0F6466] text-white">
                        <th className="p-4 border text-center">ID</th>
                        <th className="p-4 border text-center">Name</th>
                        <th className="p-4 border text-center">Class</th>
                        <th className="p-4 border text-center">Contact</th>
                        <th className="p-4 border text-center">Subjects</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedStudents.map((student) => (
                        <tr key={student._id} className="bg-white border-b hover:bg-gray-100">
                          <td className="p-4 border text-center">{student.id}</td>
                          <td className="p-4 border text-center">{student.name}</td>
                          <td className="p-4 border text-center">{student.class}</td>
                          <td className="p-4 border text-center">{student.contact}</td>
                          <td className="p-4 border text-center">{student.subjects.join(", ")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        )}

        {isUpdatePopupVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
              <h2 className="text-2xl font-bold text-center text-[#0F6466] mb-6">
                Update Student
              </h2>
              <div className="mb-6">
                <input
                  type="text"
                  value={updateSearchTerm}
                  onChange={handleUpdateSearch}
                  placeholder="Search by ID..."
                  className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#0F6466]"
                />
              </div>
              {studentToUpdate ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateStudent();
                    alert("Student updated successfully!");
                    setIsUpdatePopupVisible(false);
                  }}
                >
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={studentToUpdate.name}
                        onChange={(e) =>
                          setStudentToUpdate((prev: any) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0F6466]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Class
                      </label>
                      <input
                        type="text"
                        value={studentToUpdate.class}
                        onChange={(e) =>
                          setStudentToUpdate((prev: any) => ({
                            ...prev,
                            class: e.target.value,
                          }))
                        }
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0F6466]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Contact
                      </label>
                      <input
                        type="text"
                        value={studentToUpdate.contact}
                        onChange={(e) =>
                          setStudentToUpdate((prev: any) => ({
                            ...prev,
                            contact: e.target.value,
                          }))
                        }
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0F6466]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Subjects
                      </label>
                      <input
                        type="text"
                        value={studentToUpdate.subjects.join(", ")}
                        onChange={(e) =>
                          setStudentToUpdate((prev: any) => ({
                            ...prev,
                            subjects: e.target.value.split(",").map((s) => s.trim()),
                          }))
                        }
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0F6466]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-8">
                    <button
                      type="button"
                      className="py-3 px-8 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition duration-200"
                      onClick={() => setIsUpdatePopupVisible(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-3 px-8 rounded-lg bg-[#0F6466] text-white font-medium hover:bg-[#0D4B4C] transition duration-200"
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-center text-gray-500">
                  No student found with this ID.
                </p>
              )}
            </div>
          </div>
        )}

        {isFormVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-2xl">
              <h2 className="text-xl font-bold mb-6 text-[#0F6466]">
                Add New Student
              </h2>
              <div id="student-error" className="text-red-500 mb-4"></div>
              <form className="space-y-5" onSubmit={handleAddStudent}>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">ID</label>
                  <input
                    type="text"
                    name="id"
                    value={newStudent.id}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0F6466]"
                    placeholder="Enter ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newStudent.name}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0F6466]"
                    placeholder="Enter Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Class</label>
                  <input
                    type="text"
                    name="class"
                    value={newStudent.class}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0F6466]"
                    placeholder="Enter Class"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Contact</label>
                  <input
                    type="text"
                    name="contact"
                    value={newStudent.contact}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0F6466]"
                    placeholder="Enter Contact"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Subjects</label>
                  <input
                    type="text"
                    name="subjects"
                    value={newStudent.subjects}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0F6466]"
                    placeholder="Enter Subjects"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-5">
                  <button
                    type="button"
                    className="py-3 px-6 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition duration-200"
                    onClick={() => setIsFormVisible(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-3 px-6 rounded-lg bg-[#0F6466] text-white font-medium hover:bg-[#0D4B4C] transition duration-200"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isDeletePopupVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-6 text-[#0F6466]">
                Search User to Delete
              </h2>
              <input
                type="text"
                value={deleteSearchTerm}
                onChange={handleDeleteSearch}
                placeholder="Search by ID..."
                className="border rounded-lg p-3 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-[#0F6466]"
              />
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {filteredDeleteUsers.length > 0 ? (
                  filteredDeleteUsers.map((user, index) => (
                    <div key={index} className="border-b pb-3 border-gray-300">
                      <p className="font-semibold text-lg text-[#0F6466]">
                        Roll Number: {user.id}
                      </p>
                      <p className="text-gray-700">Name: {user.name}</p>
                      <p className="text-gray-700">Class: {user.class}</p>
                      <p className="text-gray-700">Contact: {user.contact}</p>
                      <p className="text-gray-700">
                        Subjects: {user.subjects.join(", ")}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No users found with this roll number.
                  </p>
                )}
              </div>
              <div className="flex justify-end mt-6 space-x-5">
                <button
                  className="py-3 px-6 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition duration-200"
                  onClick={() => setIsDeletePopupVisible(false)}
                >
                  Cancel
                </button>
                <button
                  className="py-3 px-6 rounded-lg bg-[#0F6466] text-white font-medium hover:bg-[#0D4B4C] transition duration-200"
                  onClick={confirmDelete}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
