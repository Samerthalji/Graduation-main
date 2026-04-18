import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Sidebar() {
  const {user}=useUser();
  return (
    <div className="col-span-3 hidden lg:block bg-gray-100 w-full sticky top-20 h-fit">
      {/* Profile Card */}
      <div className="flex flex-col justify-center items-center mx-auto my-2 w-full p-5 bg-white rounded-lg shadow-lg border border-gray-100 shadow-gray-500">
        <Link to="/profile">
          <img src={user?.profileImageUrl} alt="profile" className="w-16 h-16 rounded-full" />
        </Link>
        <h1 className="text-2xl font-extrabold">{user?.fName} {user?.lName}</h1>
        <p className="text-gray-600">{user?.headline}</p>
        <Link to="/profile"
          className="bg-white rounded-full text-blue-800 text-center border-2 border-blue-800 w-full p-1 my-2 hover:bg-blue-800 hover:text-white hover:-translate-y-0.5 transition-all duration-300">
          ViewProfile
        </Link>
      </div>

      {/* Sidebar Links */}
      <div className="flex flex-col gap-6 justify-between items-start mx-auto my-5 w-full p-2 bg-white rounded-lg border border-gray-100 shadow-lg shadow-gray-500">
        <Link to="/home" className="flex justify-center items-center gap-3">
          <i className="fa-solid fa-house text-blue-800"></i>
          <p className="text-indigo-950">Home</p>
        </Link>
        <Link to="/jobs" className="flex justify-center items-center gap-3">
          <i className="fa-solid fa-briefcase text-blue-800"></i>
          <p className="text-indigo-950">Jobs</p>
        </Link>
        <Link to="/applications" className="flex justify-center items-center gap-3">
          <i className="fa-solid fa-user-tie text-blue-800"></i>
          <p className="text-indigo-950">My Applications</p>
        </Link>
        <Link to="/saved" className="flex justify-center items-center gap-3">
          <i className="fa-solid fa-bookmark text-blue-800"></i>
          <p className="text-indigo-950">Saved Jobs</p>
        </Link>
        <a href="#" className="flex justify-center items-center gap-3">
          <i className="fa-solid fa-arrow-right-from-bracket text-blue-800"></i>
          <p className="text-indigo-950">Logout</p>
        </a>
      </div>

      <Link to="/create-company"
        className="flex items-center justify-center px-5 py-3 mt-4 text-blue-800 bg-white font-semibold border-2 border-blue-800 rounded-lg transition-all duration-300 hover:bg-blue-800 hover:text-white hover:shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Create Company</span>
      </Link>
    </div>
  );
}
