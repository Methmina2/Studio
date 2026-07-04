import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaSignOutAlt, FaHome, FaBook, FaCamera, FaEnvelope, FaCog } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-absolute-black">
      {/* Sidebar */}
      <div className="w-64 bg-studio-surface border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="font-serif text-xl font-bold text-[#de660e]">
            HOTMELLO
          </h2>
          <p className="text-xs text-zinc-500">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-[#de660e] hover:bg-white/5 rounded-lg transition"
          >
            <FaHome size={18} /> Dashboard
          </Link>
          <Link
            to="/admin/bookings"
            className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-[#de660e] hover:bg-white/5 rounded-lg transition"
          >
            <FaBook size={18} /> Bookings
          </Link>
          <Link
            to="/admin/calendar"
            className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-[#de660e] hover:bg-white/5 rounded-lg transition"
          >
            <FaCalendarAlt size={18} /> Calendar
          </Link>
          <Link
            to="/admin/rentals"
            className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-[#de660e] hover:bg-white/5 rounded-lg transition"
          >
            <FaCamera size={18} /> Rentals
          </Link>
          <Link
            to="/admin/contacts"
            className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-[#de660e] hover:bg-white/5 rounded-lg transition"
          >
            <FaEnvelope size={18} /> Contacts
          </Link>
          <Link
            to="/admin/services"
            className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-[#de660e] hover:bg-white/5 rounded-lg transition"
          >
            <FaCog size={18} /> Services
          </Link>
          <Link
            to="/admin/crew"
            className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-[#de660e] hover:bg-white/5 rounded-lg transition"
          >
            <FaCamera size={18} /> Crew
          </Link>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-zinc-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition"
          >
            <FaSignOutAlt size={18} /> Sign Out
          </button>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">{children}</div>
    </div>
  );
};

export default AdminLayout;
