export default function Navbar() {
  return (
    <div className="bg-gradient-to-r from-[#1B3C47] to-[#0F6466] text-white py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-lg font-bold">Allied School</span>
        <div className="flex space-x-6">
          <a className="px-4 py-2 bg-opacity-20 hover:bg-white hover:text-[#0F6466] rounded-lg transition font-semibold" href="/">
            Home
          </a>
          <a className="px-4 py-2 bg-opacity-20 hover:bg-white hover:text-[#0F6466] rounded-lg transition font-semibold" href="/Login">
            Login 
          </a>
          <a className="px-4 py-2 bg-opacity-20 hover:bg-white hover:text-[#0F6466] rounded-lg transition font-semibold" href="/Register">
            Register 
          </a>
          <a className="px-4 py-2 bg-opacity-20 hover:bg-white hover:text-[#0F6466] rounded-lg transition font-semibold" href="/Profile">
            Dashboard
          </a>
          <a className="px-4 py-2 bg-opacity-20 hover:bg-white hover:text-[#0F6466] rounded-lg transition font-semibold" href="/Editprofile">
            Edit Profile
          </a>
        </div>
      </div>
    </div>
  );
}
