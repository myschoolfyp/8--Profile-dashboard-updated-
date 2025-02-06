export default function Home() {
  return (
    <div className="bg-gradient-to-r from-[#D2E8E3] to-[#A8D5BA] min-h-screen flex flex-col">
     
      {/* Welcome Section */}
      <div className="flex-grow flex flex-col justify-center items-center text-center p-6">
        <h1 className="text-5xl font-extrabold text-[#0F6466] drop-shadow-lg">Welcome to School Management System</h1>
        <p className="text-lg text-gray-700 mt-4 max-w-2xl">
          Our system provides a seamless experience for managing students, teachers, and school resources efficiently.
          Stay organized, improve communication, and enhance learning with our powerful features.
        </p>
        <p className="text-xl text-red-700 mt-6 font-semibold animate-pulse">
          Click on the links in the navigation bar to get started!
        </p>
      </div>
    </div>
  );
}
