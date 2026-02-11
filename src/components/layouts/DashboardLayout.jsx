import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { LayoutDashboard, HandCoins, ReceiptIndianRupee, LogOut, User } from "lucide-react";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useContext(UserContext);

  return (
    <div className="flex h-screen bg-[#060606] text-white overflow-hidden">
      <aside className="w-64 bg-[#121212] border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-6 text-xl font-bold text-[#875cf5]">ExpenseTracker</div>
        <nav className="flex-1 px-4 space-y-2">
          <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl ${isActive ? "bg-[#875cf5] text-white" : "text-gray-400 hover:bg-gray-800"}`}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/income" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl ${isActive ? "bg-[#875cf5] text-white" : "text-gray-400 hover:bg-gray-800"}`}>
            <HandCoins size={20} /> Income
          </NavLink>
          <NavLink to="/expense" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl ${isActive ? "bg-[#875cf5] text-white" : "text-gray-400 hover:bg-gray-800"}`}>
            <ReceiptIndianRupee size={20} /> Expenses
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 w-full rounded-xl">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#0b0b0b]">
        <header className="h-16 flex justify-end items-center px-8 border-b border-gray-800">
          <div className="flex items-center gap-3">
             <span className="text-sm font-medium">{user?.fullName}</span>
             <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                <User size={18} />
             </div>
          </div>
        </header>
        <section className="flex-1 overflow-y-auto p-8">
          {children}
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;